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
import { LoadingButton } from "@/components/loadingButton";
import { PasswordInput } from "@/components/auth/passwordInput";
import { authClient } from "@/lib/auth-client";

interface SignInFormProps {
	signInFormTranslations: {
        labelEmail: string;
        labelPassword: string;
        buttonSignIn: string;
        noAccountText: string;
        signUpLink: string;
        formMessages: {
            validEmailRequired: string;
            invalidCredentials: string;
            passwordRequired: string;
            unknownError: string;
	    };
    };
}

export function SignInForm({ signInFormTranslations }: SignInFormProps) {

    const formSchema = z.object({
        email: z.email({
            message: `${signInFormTranslations.formMessages.validEmailRequired}`,
        }),
        password: z.string().min(1, { message: `${signInFormTranslations.formMessages.passwordRequired}` }),
    });

    type SignInFormValues = z.infer<typeof formSchema>;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit({ email, password }: SignInFormValues) {

        setError(null);
        setLoading(true);

        const {error} = await authClient.signIn.email({
            email,
            password
        });

        setLoading(false);

        if (error?.code === "INVALID_EMAIL_OR_PASSWORD") {
            setError(signInFormTranslations.formMessages.invalidCredentials)
        } else if (error) {
            setError(error.message || signInFormTranslations.formMessages.unknownError)
        } else {
            window.location.replace("/")
        }
    }

    return (
        <Card className="w-full max-w-md">
        <CardContent className="space-y-6 pt-6">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{signInFormTranslations.labelEmail}</FormLabel>
                    <FormControl>
                        <Input type="email" autoComplete="email" placeholder={signInFormTranslations.labelEmail} {...field} />
                    </FormControl>
                    <FormMessage className="min-h-[20px]" />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{signInFormTranslations.labelPassword}</FormLabel>
                    <FormControl>
                        <div className="relative">
                        <PasswordInput
                            autoComplete="current-password"
                            placeholder={signInFormTranslations.labelPassword}
                            {...field}
                        />
                        </div>
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
                    {signInFormTranslations.buttonSignIn}
                </LoadingButton>
            </form>
            </Form>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
            <span className="text-sm text-muted-foreground">
            {signInFormTranslations.noAccountText}{" "}
            <Link href="/sign-up" className="underline">
              {signInFormTranslations.signUpLink}
            </Link>
            </span>
        </CardFooter>
        </Card>
    );
}