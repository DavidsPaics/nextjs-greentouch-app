import Image from "next/image";
import { Metadata } from "next";
import { SignInForm } from "./sign-in-form";
import { getServerSession } from "@/lib/get-session";
import AlreadySignedIn from "./alreadySignedIn";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {

	const { reset } = await searchParams;

	//console.log("Sign in Page rendered");

	const session = await getServerSession();
	 
	if(session) {
		return (
			<AlreadySignedIn />
		)
	}

	const t = await getTranslations("signInPage");

    return (
			<main className="bg-[#f5f5f5]"> 
				<section className="grid grid-cols-1 lg:grid-cols-2 w-full"> 
					<div className="relative h-[40vh] lg:h-screen"> 
						<Image src="/sign-in-photo.jpg" alt="Sunrise over valley road" fill priority className="object-cover" />
					</div>

					<div className="flex items-center justify-center lg:justify-start bg-[#f5f5f5]">
						<div className="w-full max-w-lg px-6 lg:px-12 lg:pl-20 py-10 lg:py-0 mx-auto lg:mx-0">
							<h1 className="text-3xl md:text-4xl font-semibold mb-10 text-center lg:text-left">
								{t("title")}
							</h1>

                                <SignInForm 
									signInFormTranslations={{
										labelEmail: t("signInForm.labelEmail"),
										labelPassword: t("signInForm.labelPassword"),
										buttonSignIn: t("signInForm.buttonSignIn"),
										noAccountText: t("signInForm.noAccountText"),
										signUpLink: t("signInForm.signUpLink"),
										forgotPasswordLink: t("signInForm.forgotPasswordLink"),
										passwordResetSuccess: t("signInForm.passwordResetSuccess"),
										formMessages: {
											validEmailRequired: t("signInForm.formMessages.validEmailRequired"),
											invalidCredentials: t("signInForm.formMessages.invalidCredentials"),
											passwordRequired: t("signInForm.formMessages.passwordRequired"),
											unknownError: t("signInForm.formMessages.unknownError")
										}
									}}
									showPasswordResetSuccess={reset === "success"}
								/>
						</div>
					</div>
				</section>
			</main>
    );
}