import RevokeOtherSessions from "@/components/account/security/revokeSessionsButton";
import ChangePasswordForm from "@/components/account/security/changePasswordForm";
import { getServerSession } from "@/lib/get-session";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function Security() {

    const session = await getServerSession();

    if(!session) {
        redirect("/sign-in")
    }

    const t = await getTranslations("accountPage.securityPage");
    const tSignUp = await getTranslations("signUpPage.signUpForm.formMessages");

    return(
        <>
            <p className="text-lg px-4 mb-4 text-gray-700">
                {t("description")}
            </p>

            <section className="pb-6">
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow">
                    <h2 className="text-xl font-semibold mb-2">{t("changePasswordCard.cardTitle")}</h2>
                    <p className="text-base text-gray-700 mb-6">
                    {t("changePasswordCard.cardDescription")}
                    </p>

                    <ChangePasswordForm
                        changePasswordFormTranslations={{
                            labelCurrentPassword: t("changePasswordCard.labelCurrentPassword"),
                            labelNewPassword: t("changePasswordCard.labelNewPassword"),
                            labelConfirmPassword: t("changePasswordCard.labelConfirmPassword"),
                            button: t("changePasswordCard.button"),
                            successMessage: t("changePasswordCard.successMessage"),
                            formMessages: {
                                currentPasswordRequired: t("changePasswordCard.currentPasswordRequired"),
                                confirmPasswordRequired: tSignUp("confirmPasswordRequired"),
                                passwordsDoNotMatch: tSignUp("passwordsDoNotMatch"),
                                invalidCurrentPassword: t("changePasswordCard.invalidCurrentPassword"),
                                tooManyRequests: t("changePasswordCard.tooManyRequests"),
                                unknownError: t("changePasswordCard.unknownError"),
                                validation: {
                                    passwordRequired: tSignUp("validation.passwordRequired"),
                                    passwordMinLength: tSignUp("validation.passwordMinLength"),
                                    passwordLetter: tSignUp("validation.passwordLetter"),
                                    passwordNumber: tSignUp("validation.passwordNumber"),
                                    passwordSpecialChar: tSignUp("validation.passwordSpecialChar"),
                                }
                            }
                        }}
                    />
                </div>
            </section>

            <section className="pb-20">
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">{t("cardTitle")}</h2>
                    <p className="text-base text-gray-700">
                    {t("cardDescription")}
                    </p>
                </div>

                <div className="shrink-0">
                    <RevokeOtherSessions 
                        accountSecurityAlertDialogTranslations={{
                            button: t("alertDialog.button"),
                            title: t("alertDialog.title"),
                            description: t("alertDialog.description"),
                            cancelButton: t("alertDialog.cancelButton"),
                            actionButton: t("alertDialog.actionButton"),
                            successMessage: t("alertDialog.successMessage"),
                            errorMessage: t("alertDialog.errorMessage")
                        }}
                    />
                </div>
                </div>
            </section>
        </>
    )
}