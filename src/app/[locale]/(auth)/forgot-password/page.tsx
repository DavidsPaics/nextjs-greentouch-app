import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { connection } from "next/server";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default async function ForgotPasswordPage() {

	// Render on each request, so SMTP_HOST is read at runtime and not at build time
	await connection();

	const t = await getTranslations("forgotPasswordPage");

	// Without SMTP the reset email can't be sent
	const resetAvailable = !!process.env.SMTP_HOST;

    return (
			<main className="bg-[#f5f5f5]">
				<section className="grid grid-cols-1 lg:grid-cols-2 w-full">
					<div className="relative h-[40vh] lg:h-screen">
						<Image src="/sign-in-photo.jpg" alt="Sunrise over valley road" fill priority className="object-cover" />
					</div>

					<div className="flex items-center justify-center lg:justify-start bg-[#f5f5f5]">
						<div className="w-full max-w-lg px-6 lg:px-12 lg:pl-20 py-10 lg:py-0 mx-auto lg:mx-0">
							<h1 className="text-3xl md:text-4xl font-semibold mb-4 text-center lg:text-left">
								{t("title")}
							</h1>
							{resetAvailable ? (
							<>
							<p className="text-base text-gray-700 mb-10 max-w-md text-center lg:text-left">
								{t("description")}
							</p>

							<ForgotPasswordForm
								forgotPasswordFormTranslations={{
									labelEmail: t("form.labelEmail"),
									buttonSend: t("form.buttonSend"),
									backToSignIn: t("form.backToSignIn"),
									successMessage: t("form.successMessage"),
									formMessages: {
										validEmailRequired: t("form.formMessages.validEmailRequired"),
										tooManyRequests: t("form.formMessages.tooManyRequests"),
										unknownError: t("form.formMessages.unknownError")
									}
								}}
							/>
							</>
							) : (
								<Card className="w-full max-w-md mt-6">
									<CardContent className="space-y-6 pt-6 pb-6">
										<p role="status" className="text-base text-gray-700">
											{t("unavailable")}
										</p>
										<Button asChild variant="outline" className="w-full">
											<Link href="/sign-in">{t("form.backToSignIn")}</Link>
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
