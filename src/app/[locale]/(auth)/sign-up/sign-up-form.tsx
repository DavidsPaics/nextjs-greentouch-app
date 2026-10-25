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
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { passwordSchema } from "@/lib/validation";
import { PasswordInput } from "@/components/auth/passwordInput";
import { LoadingButton } from "@/components/loadingButton";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const POSITIONS = ["student", "academic staff", "other"] as const;
const MOTIVATIONS = ["personal_interest", "professional_interest", "personal_and_professional_interest"] as const;

interface SignUpFormProps {
	signUpFormTranslations: {
        labelName: string;
        labelSurname: string;
        labelPosition: string;
        labelStudent: string;
        labelAcademicStaff: string;
        labelOther: string;
        labelUniversityTitle: string;
        labelUniversity: string;
        labelFieldOfWork: string;
        labelSpecialization: string;
        labelMotivation: string;
        labelPersonalInterest: string;
        labelProfessionalInterest: string;
        labelBothOfThem: string;
        labelEmail: string;
        labelPassword: string;
        labelConfirmPassword: string;
        buttonSignUp: string;
        haveAccountText: string;
        signInLink: string;
        formMessages: {
            firstNameRequired: string;
            lastNameRequired: string;
            validEmailRequired: string;
            confirmPasswordRequired: string;
            selectPositionRequired: string;
            selectMotivationRequired: string;
            selectUniversityRequired: string;
            selectSpecializationRequired: string;
            passwordsDoNotMatch: string;
            signUpSuccessful: string;
            unknownError: string;
            validation: {
                passwordRequired: string;
                passwordMinLength: string;
                passwordLetter: string;
                passwordNumber: string;
                passwordSpecialChar: string;
            }
        }
    };
}

export function SignUpForm({ signUpFormTranslations }: SignUpFormProps){
    
    const formSchema = z
    .object({
        firstName: z.string().min(1, { message: `${signUpFormTranslations.formMessages.firstNameRequired}` }),
        lastName: z.string().min(1, { message: `${signUpFormTranslations.formMessages.lastNameRequired}` }),
        email: z.email({
        message: `${signUpFormTranslations.formMessages.validEmailRequired}`,
        }),
        password: passwordSchema (signUpFormTranslations.formMessages.validation),
        confirmPassword: z.string().min(1, { message: `${signUpFormTranslations.formMessages.confirmPasswordRequired}` }),
        position: z.enum(POSITIONS, { message: `${signUpFormTranslations.formMessages.selectPositionRequired}` }),
        motivation: z.enum(MOTIVATIONS, { message: `${signUpFormTranslations.formMessages.selectMotivationRequired}` }),
        university: z.string().min(1, { message: `${signUpFormTranslations.formMessages.selectUniversityRequired}` }),
        specialization: z.string().min(1, { message: `${signUpFormTranslations.formMessages.selectSpecializationRequired}` }),
    }).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
        code: "custom",
        message: `${signUpFormTranslations.formMessages.passwordsDoNotMatch}`,
        path: ['confirmPassword']
        });
    }
    });

    type SignUpFormValues = z.infer<typeof formSchema>;

    const [error, setError] = useState<string | null>(null);

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            position: undefined,
            motivation: undefined,
            university: "",
            specialization: "",
        },
    });

    async function onSubmit({ firstName, lastName, email, password, position, motivation, university, specialization }: SignUpFormValues) {
        setError(null)

        const {error} = await authClient.signUp.email({
            name: firstName + " " + lastName,
            email,
            password,
            position,
            motivation,
            university,
            specialization,
        })

        if(error) {
            setError(error.message || signUpFormTranslations.formMessages.unknownError)
        } else {
            toast.success(signUpFormTranslations.formMessages.signUpSuccessful);
            window.location.replace("/") // Redirect to home page after successful sign-up
        }
    }

    const loading = form.formState.isSubmitting;

    return (
        <Card className="w-full max-w-none rounded-xl border shadow-sm">
            <CardContent className="space-y-6 pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                {signUpFormTranslations.labelName} <span className="text-[#2E7D5A]">*</span>
                                </FormLabel>
                                <FormControl>
                                <Input type="text" placeholder={signUpFormTranslations.labelName} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                {signUpFormTranslations.labelSurname} <span className="text-[#2E7D5A]">*</span>
                                </FormLabel>
                                <FormControl>
                                <Input type="text" placeholder={signUpFormTranslations.labelSurname} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </div>

                        <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>
                                {signUpFormTranslations.labelPosition} <span className="text-[#2E7D5A]">*</span>
                            </FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="mt-2 space-y-2"
                                >
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="student" id="pos-student" />
                                    <label htmlFor="pos-student" className="text-sm">{signUpFormTranslations.labelStudent}</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="academic staff" id="pos-academic" />
                                    <label htmlFor="pos-academic" className="text-sm">{signUpFormTranslations.labelAcademicStaff}</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="other" id="pos-other" />
                                    <label htmlFor="pos-other" className="text-sm">{signUpFormTranslations.labelOther}</label>
                                </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="university"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                            <FormLabel>
                                {signUpFormTranslations.labelUniversityTitle} <span className="text-[#2E7D5A]">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input type="text" placeholder={signUpFormTranslations.labelUniversity} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                            <FormLabel>
                                {signUpFormTranslations.labelFieldOfWork} <span className="text-[#2E7D5A]">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input type="text" placeholder={signUpFormTranslations.labelSpecialization} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="motivation"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>
                                {signUpFormTranslations.labelMotivation} <span className="text-[#2E7D5A]">*</span>
                            </FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid gap-2"
                                >
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="personal_interest" id="mot-personal" />
                                    <label htmlFor="mot-personal" className="text-sm">{signUpFormTranslations.labelPersonalInterest}</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="professional_interest" id="mot-prof" />
                                    <label htmlFor="mot-prof" className="text-sm">{signUpFormTranslations.labelProfessionalInterest}</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="personal_and_professional_interest" id="mot-both" />
                                    <label htmlFor="mot-both" className="text-sm">{signUpFormTranslations.labelBothOfThem}</label>
                                </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>
                                {signUpFormTranslations.labelEmail} <span className="text-[#2E7D5A]">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input type="email" placeholder={signUpFormTranslations.labelEmail} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                {signUpFormTranslations.labelPassword} <span className="text-[#2E7D5A]">*</span>
                                </FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <PasswordInput autoComplete="new-password" placeholder={signUpFormTranslations.labelPassword} {...field} />
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                {signUpFormTranslations.labelConfirmPassword} <span className="text-[#2E7D5A]">*</span>
                                </FormLabel>
                                <FormControl>
                                <div className="relative">
                                    <PasswordInput autoComplete="new-password" placeholder={signUpFormTranslations.labelConfirmPassword} {...field} />
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </div>

                        {error && (
                            <div role="alert" className="text-sm text-red-600">
                                {error}
                            </div>
                        )}
                        
                        <div className="mt-4 h-px w-full bg-gray-300" />
                        <div className="flex items-center justify-end gap-4 pt-2">
                            <span className="text-sm text-muted-foreground">
                                {signUpFormTranslations.haveAccountText}{" "}
                                <Link href="/sign-in" className="text-primary underline hover:opacity-80">
                                    {signUpFormTranslations.signInLink}
                                </Link>
                            </span>

                            <LoadingButton 
                                type="submit"
                                variant={"secondary"}
                                loading={loading}
                            >
                                {signUpFormTranslations.buttonSignUp}
                            </LoadingButton>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
  );
}