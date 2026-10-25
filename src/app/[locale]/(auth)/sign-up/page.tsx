import type { Metadata } from "next";
import { SignUpForm } from "./sign-up-form";
import AlreadySignedUp from "./alreadySignedUp";
import { getServerSession } from "@/lib/get-session";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async function SignUpPage() {

    //console.log("Sign up Page rendered");

    const session = await getServerSession();
         
    if(session) {
        return (
            <AlreadySignedUp />
        )
    }

    const t = await getTranslations("signUpPage");

    return (
        <main className="min-h-screen bg-[#f5f5f5]">
            <section className="mx-auto max-w-5xl px-4 md:px-8 py-10 md:py-14">

                {/* Header */}
                <div className="mb-8 md:mb-10">
                    <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-left">
                        {t("title")}
                    </h1>
                    <div className="mt-2 h-px w-full bg-[#0A3730]/70" />
                    <div className="mt-2 text-sm text-[#2E7D5A]">
                        {t("labelRequired")}
                    </div>

                </div>
                    <SignUpForm 
                        signUpFormTranslations={{
                            labelName: t("signUpForm.labelName"),
                            labelSurname: t("signUpForm.labelSurname"),
                            labelPosition: t("signUpForm.labelPosition"),
                            labelStudent: t("signUpForm.labelStudent"),
                            labelAcademicStaff: t("signUpForm.labelAcademicStaff"),
                            labelOther: t("signUpForm.labelOther"),
                            labelUniversityTitle: t("signUpForm.labelUniversityTitle"),
                            labelUniversity: t("signUpForm.labelUniversity"),
                            labelFieldOfWork: t("signUpForm.labelFieldOfWork"),
                            labelSpecialization: t("signUpForm.labelSpecialization"),
                            labelMotivation: t("signUpForm.labelMotivation"),
                            labelPersonalInterest: t("signUpForm.labelPersonalInterest"),
                            labelProfessionalInterest: t("signUpForm.labelProfessionalInterest"),
                            labelBothOfThem: t("signUpForm.labelBothOfThem"),
                            labelEmail: t("signUpForm.labelEmail"),
                            labelPassword: t("signUpForm.labelPassword"),
                            labelConfirmPassword: t("signUpForm.labelConfirmPassword"),
                            buttonSignUp: t("signUpForm.buttonSignUp"),
                            haveAccountText: t("signUpForm.haveAccountText"),
                            signInLink: t("signUpForm.signInLink"),
                            formMessages: {
                                firstNameRequired: t("signUpForm.formMessages.firstNameRequired"),
                                lastNameRequired: t("signUpForm.formMessages.lastNameRequired"),
                                validEmailRequired: t("signUpForm.formMessages.validEmailRequired"),
                                confirmPasswordRequired: t("signUpForm.formMessages.confirmPasswordRequired"),
                                selectPositionRequired: t("signUpForm.formMessages.selectPositionRequired"),
                                selectMotivationRequired: t("signUpForm.formMessages.selectMotivationRequired"),
                                selectUniversityRequired: t("signUpForm.formMessages.selectUniversityRequired"),
                                selectSpecializationRequired: t("signUpForm.formMessages.selectSpecializationRequired"),
                                passwordsDoNotMatch: t("signUpForm.formMessages.passwordsDoNotMatch"),
                                signUpSuccessful: t("signUpForm.formMessages.signUpSuccessful"),
                                unknownError: t("signUpForm.formMessages.unknownError"),
                                validation: {
                                    passwordRequired: t("signUpForm.formMessages.validation.passwordRequired"),
                                    passwordMinLength: t("signUpForm.formMessages.validation.passwordMinLength"),
                                    passwordLetter: t("signUpForm.formMessages.validation.passwordLetter"),
                                    passwordNumber: t("signUpForm.formMessages.validation.passwordNumber"),
                                    passwordSpecialChar: t("signUpForm.formMessages.validation.passwordSpecialChar"),
                                }
                            }
                        }}
                    />
            </section>
        </main>
    );
}