"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { MailCheckIcon } from "lucide-react";
import { LoadingButton } from "@/components/loadingButton";
import { authClient } from "@/lib/auth-client";

interface ForgotPasswordFormProps {
	forgotPasswordFormTranslations: {
        labelEmail: string;
        buttonSend: string;
        backToSignIn: string;
        successMessage: string;
        formMessages: {
            validEmailRequired: string;
            tooManyRequests: string;
            unknownError: string;
        };
    };
}

export function ForgotPasswordForm({ forgotPasswordFormTranslations }: ForgotPasswordFormProps) {

    const locale = useLocale();

    const formSchema = z.object({
        email: z.email({
            message: `${forgotPasswordFormTranslations.formMessages.validEmailRequired}`,
        }),
    });

    type ForgotPasswordFormValues = z.infer<typeof formSchema>;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState(false);

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit({ email }: ForgotPasswordFormValues) {

        setError(null);
        setLoading(true);

        // The link in the email leads to /<locale>/reset-password?token=...
        const {error} = await authClient.requestPasswordReset({
            email,
            redirectTo: `/${locale}/reset-password`,
        });

        setLoading(false);

        if (error?.status === 429) {
            setError(forgotPasswordFormTranslations.formMessages.tooManyRequests)
        } else if (error) {
            setError(forgotPasswordFormTranslations.formMessages.unknownError)
        } else {
            // Same message whether or not the account exists
            setEmailSent(true)
        }
    }

    return (
        <Card className="w-full max-w-md">
        <CardContent className="space-y-6 pt-6">
            {emailSent ? (
                <div role="status" className="flex items-start gap-3 text-sm text-gray-700">
                    <MailCheckIcon className="w-6 h-6 shrink-0 text-green-700" />
                    <p>{forgotPasswordFormTranslations.successMessage}</p>
                </div>
            ) : (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{forgotPasswordFormTranslations.labelEmail}</FormLabel>
                    <FormControl>
                        <Input type="email" autoComplete="email" placeholder={forgotPasswordFormTranslations.labelEmail} {...field} />
                    </FormControl>
                    <FormMessage className="min-h-[20px]" />
                    </FormItem>
                )}
                />

                {error && (
                    <div role="alert" className="text-sm text-red-600">
                        {error}
                    </div>
                )}

                <LoadingButton type="submit" className="w-full" loading={loading}>
                    {forgotPasswordFormTranslations.buttonSend}
                </LoadingButton>
            </form>
            </Form>
            )}
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
            <Link href="/sign-in" className="text-sm text-muted-foreground underline">
                {forgotPasswordFormTranslations.backToSignIn}
            </Link>
        </CardFooter>
        </Card>
    );
}
