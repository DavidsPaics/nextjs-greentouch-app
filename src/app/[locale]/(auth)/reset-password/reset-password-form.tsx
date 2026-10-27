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
} from "@/components/ui/card";
import { useState } from "react";
import { LoadingButton } from "@/components/loadingButton";
import { PasswordInput } from "@/components/auth/passwordInput";
import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validation";

interface ResetPasswordFormProps {
    token: string;
	resetPasswordFormTranslations: {
        labelNewPassword: string;
        labelConfirmPassword: string;
        buttonReset: string;
        formMessages: {
            confirmPasswordRequired: string;
            passwordsDoNotMatch: string;
            invalidLink: string;
            unknownError: string;
            validation: {
                passwordRequired: string;
                passwordMinLength: string;
                passwordLetter: string;
                passwordNumber: string;
                passwordSpecialChar: string;
            }
	    };
    };
}

export function ResetPasswordForm({ token, resetPasswordFormTranslations }: ResetPasswordFormProps) {

    const formSchema = z.object({
        password: passwordSchema(resetPasswordFormTranslations.formMessages.validation),
        confirmPassword: z.string().min(1, { message: `${resetPasswordFormTranslations.formMessages.confirmPasswordRequired}` }),
    }).superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: `${resetPasswordFormTranslations.formMessages.passwordsDoNotMatch}`,
                path: ['confirmPassword']
            });
        }
    });

    type ResetPasswordFormValues = z.infer<typeof formSchema>;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit({ password }: ResetPasswordFormValues) {

        setError(null);
        setLoading(true);

        const {error} = await authClient.resetPassword({
            newPassword: password,
            token,
        });

        setLoading(false);

        if (error?.code === "INVALID_TOKEN") {
            setError(resetPasswordFormTranslations.formMessages.invalidLink)
        } else if (error) {
            setError(resetPasswordFormTranslations.formMessages.unknownError)
        } else {
            window.location.replace("/sign-in?reset=success")
        }
    }

    return (
        <Card className="w-full max-w-md">
        <CardContent className="space-y-6 pt-6 pb-6">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{resetPasswordFormTranslations.labelNewPassword}</FormLabel>
                    <FormControl>
                        <PasswordInput
                            autoComplete="new-password"
                            placeholder={resetPasswordFormTranslations.labelNewPassword}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage className="min-h-[20px]" />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{resetPasswordFormTranslations.labelConfirmPassword}</FormLabel>
                    <FormControl>
                        <PasswordInput
                            autoComplete="new-password"
                            placeholder={resetPasswordFormTranslations.labelConfirmPassword}
                            {...field}
                        />
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
                    {resetPasswordFormTranslations.buttonReset}
                </LoadingButton>
            </form>
            </Form>
        </CardContent>
        </Card>
    );
}
