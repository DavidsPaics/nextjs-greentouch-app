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
import { useState } from "react";
import { toast } from "sonner";
import { LoadingButton } from "@/components/loadingButton";
import { PasswordInput } from "@/components/auth/passwordInput";
import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validation";

interface ChangePasswordFormProps {
  changePasswordFormTranslations: {
    labelCurrentPassword: string;
    labelNewPassword: string;
    labelConfirmPassword: string;
    button: string;
    successMessage: string;
    formMessages: {
      currentPasswordRequired: string;
      confirmPasswordRequired: string;
      passwordsDoNotMatch: string;
      invalidCurrentPassword: string;
      tooManyRequests: string;
      unknownError: string;
      validation: {
        passwordRequired: string;
        passwordMinLength: string;
        passwordLetter: string;
        passwordNumber: string;
        passwordSpecialChar: string;
      }
    };
  }
}

export default function ChangePasswordForm({ changePasswordFormTranslations }: ChangePasswordFormProps) {

  const formSchema = z.object({
    currentPassword: z.string().min(1, { message: `${changePasswordFormTranslations.formMessages.currentPasswordRequired}` }),
    newPassword: passwordSchema(changePasswordFormTranslations.formMessages.validation),
    confirmPassword: z.string().min(1, { message: `${changePasswordFormTranslations.formMessages.confirmPasswordRequired}` }),
  }).superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: `${changePasswordFormTranslations.formMessages.passwordsDoNotMatch}`,
        path: ['confirmPassword']
      });
    }
  });

  type ChangePasswordFormValues = z.infer<typeof formSchema>;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit({ currentPassword, newPassword }: ChangePasswordFormValues) {

    setError(null);
    setLoading(true);

    const {error} = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    setLoading(false);

    if (error?.code === "INVALID_PASSWORD") {
      setError(changePasswordFormTranslations.formMessages.invalidCurrentPassword)
    } else if (error?.status === 429) {
      setError(changePasswordFormTranslations.formMessages.tooManyRequests)
    } else if (error) {
      setError(changePasswordFormTranslations.formMessages.unknownError)
    } else {
      toast.success(changePasswordFormTranslations.successMessage);
      form.reset();
    }
  }

  const passwordFields = [
    { name: "currentPassword", label: changePasswordFormTranslations.labelCurrentPassword, autoComplete: "current-password" },
    { name: "newPassword", label: changePasswordFormTranslations.labelNewPassword, autoComplete: "new-password" },
    { name: "confirmPassword", label: changePasswordFormTranslations.labelConfirmPassword, autoComplete: "new-password" },
  ] as const;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        {passwordFields.map((passwordField) => (
          <FormField
            key={passwordField.name}
            control={form.control}
            name={passwordField.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{passwordField.label}</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete={passwordField.autoComplete}
                    placeholder={passwordField.label}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {error && (
          <div role="alert" className="text-sm text-red-600">
            {error}
          </div>
        )}

        <LoadingButton type="submit" loading={loading}>
          {changePasswordFormTranslations.button}
        </LoadingButton>
      </form>
    </Form>
  )
}
