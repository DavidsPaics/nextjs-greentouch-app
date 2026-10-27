import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

// The link from the reset email redirects here with ?token=... (or ?error=INVALID_TOKEN if it's invalid or expired)
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; error?: string }> }) {

	const { token, error } = await searchParams;

	const t = await getTranslations("resetPasswordPage");
	const tSignUp = await getTranslations("signUpPage.signUpForm.formMessages");

	const linkIsValid = !!token && !error;

    return (
			<main className="bg-[#f5f5f5]">
				<section className="grid grid-cols-1 lg:grid-cols-2 w-full">
					<div className="relative h-[40vh] lg:h-screen">
						<Image src="/sign-in-photo.jpg" alt="Sunrise over valley road" fill priority className="object-cover" />
					</div>

					<div className="flex items-center justify-center lg:justify-start bg-[#f5f5f5]">
						<div className="w-full max-w-lg px-6 lg:px-12 lg:pl-20 py-10 lg:py-0 mx-auto lg:mx-0">
							<h1 className="text-3xl md:text-4xl font-semibold mb-4 text-center lg:text-left">
								{linkIsValid ? t("title") : t("invalidLink.title")}
							</h1>
							<p className="text-base text-gray-700 mb-10 max-w-md text-center lg:text-left">
								{linkIsValid ? t("description") : t("invalidLink.description")}
							</p>

							{linkIsValid ? (
								<ResetPasswordForm
									token={token}
									resetPasswordFormTranslations={{
										labelNewPassword: t("form.labelNewPassword"),
										labelConfirmPassword: t("form.labelConfirmPassword"),
										buttonReset: t("form.buttonReset"),
										formMessages: {
											confirmPasswordRequired: tSignUp("confirmPasswordRequired"),
											passwordsDoNotMatch: tSignUp("passwordsDoNotMatch"),
											invalidLink: t("form.formMessages.invalidLink"),
											unknownError: t("form.formMessages.unknownError"),
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
							) : (
								<Card className="w-full max-w-md">
									<CardContent className="pt-6 pb-6">
										<Button asChild className="w-full">
											<Link href="/forgot-password">{t("invalidLink.button")}</Link>
										</Button>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</section>
			</main>
    );
}
