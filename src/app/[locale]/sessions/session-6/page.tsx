import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HouseIcon, TreeDeciduous } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionsAccordion } from "@/components/greentouchSessions/sessionsAccordion";
import NotAvailable from "@/components/greentouchSessions/notAvailable";
import { getGreentouchSessionByName, getSessionUnlockStatus } from "@/actions/greentouch-session";
import NatureConnectednessCard from "@/components/greentouchSessions/natureConnectednessCard";
import DiaryCard from "@/components/greentouchSessions/diaryCard";
import { getCurrentGreentouchSessionUserData } from "@/actions/greentouch-session-user-data";
import FavoriteButton from "@/components/greentouchSessions/favoriteButton";
import SurveyCard from "@/components/greentouchSessions/surveyCard";
import SessionCompletedCard from "@/components/greentouchSessions/sessionCompletedCard";
import { getTranslations } from "next-intl/server";
import { SessionPageProvider } from "@/components/greentouchSessions/sessionPageContext";

export default async function SessionSixPage() {
    
    const session = await getServerSession();

    if (!session) { 
        redirect("/sign-in"); 
    }

    const dbSession = await getGreentouchSessionByName("session-6");

    const { unlocked } = await getSessionUnlockStatus("session-6");
    
    const userData = dbSession ? await getCurrentGreentouchSessionUserData(dbSession.id) : null;

    const t = await getTranslations('sessionsPage');

    if (!unlocked && session.user.role !== "admin") {
        return (
            <NotAvailable />
        )
    }

    return(
        <SessionPageProvider 
            initialData={{
                natureConnectednessValue: userData?.natureConnectedness ?? null,
                diaryEntry: userData?.diaryEntry ?? null,
                surveyData: {
                outdoorTasksCount: userData?.outdoorTasksCount ?? undefined,
                indoorTasksCount: userData?.indoorTasksCount ?? undefined,
                physicalHealthResponse: userData?.physicalHealthResponse ?? undefined,
                mentalHealthResponse: userData?.mentalHealthResponse ?? undefined,
                friendsFamilyResponse: userData?.friendsFamilyResponse ?? undefined,
                learntSomethingNewResponse: userData?.learntSomethingNewResponse ?? undefined,
                closerToNatureResponse: userData?.closerToNatureResponse ?? undefined,
                },
                sessionCompleted: userData?.sessionCompleted ?? false,
            }}
        >
        <main className="flex flex-col items-center justify-start w-full min-h-screen bg-[#f5f5f5] text-gray-900">

            {/* Hero section (textual content) */}
            <section className="w-full max-w-5xl mx-auto px-4 pt-8">
                <div className="text-sm text-gray-500 mb-20">
                    <Link href="/sessions" className="text-[#1F566E] hover:underline font-medium">
                        {t('greentouchSessions.session6.breadcrumbItem1')}
                    </Link>
                    <span className="mx-2">&gt;</span>
                    <span>{t('greentouchSessions.session6.breadcrumbItem2')}</span>
                </div>
                {/* Navigation links (prev/next) */}
                <div className="flex justify-between items-center mb-10 underline">
                    <Link
                        href="/sessions/session-5"
                        className="text-[#1F566E] hover:underline font-medium flex items-center gap-1"
                    >
                        {t('greentouchSessions.session6.leftNavigationLink')}
                    </Link>

                    <Link
                        href="/sessions/session-7"
                        className="text-[#1F566E] hover:underline font-medium flex items-center gap-1"
                    >
                        {t('greentouchSessions.session6.rightNavigationLink')}
                    </Link>
                </div>

                <p className="text-xl font-semibold mb-4 text-left text-green-800">{t('greentouchSessions.session6.titleCapitals')}</p>
                <h1 className="text-3xl font-bold mb-8 text-left">{t('greentouchSessions.session6.description')}</h1>
                <p className="text-lg mb-4 text-gray-700"></p>
                <p className="text-lg mb-2  font-semibold text-green-800"> 
                    {t('greentouchSessions.session6.labelGoal')}
                </p>
                <p className="text-lg mb-4 text-gray-700"> 
                    {t('greentouchSessions.session6.paragraph1')}
                </p>

                <div className="flex mb-8">
                    <FavoriteButton
                        favoriteButtonTranslations={{
                            addToFavorites: t("additionalData.favoriteButton.addToFavorites"),
                            inFavorites: t("additionalData.favoriteButton.inFavorites"),
                            sessionIdMissingErrorMessage: t("additionalData.favoriteButton.sessionIdMissingErrorMessage"),
                            unknownErrorMessage: t("additionalData.favoriteButton.unknownErrorMessage"),
                            sessionAddedToFavorites: t("additionalData.favoriteButton.sessionAddedToFavorites"),
                            sessionRemovedFromFavorites: t("additionalData.favoriteButton.sessionRemovedFromFavorites")
                        }}
                        greentouchSessionId={dbSession?.id || ""}
                        initialIsFavorite={userData?.isFavorite ?? false}
                    />
                </div>
            </section>

            {/* Line divider */}
            <section className="w-full px-4">
                <div className="max-w-5xl border-t border-gray-300 mb-10 mx-auto" />
            </section>

            {/* Welcome section */}
            <section className="w-full max-w-5xl mx-auto px-4 pt-8">
                <p className="text-base font-semibold mb-4 text-gray-700"> 
                    {t('greentouchSessions.session6.welcomeTitle')}
                </p>
                <p className="text-base mb-4 text-gray-700"> 
                    {t('greentouchSessions.session6.welcomeParagraph1')}
                </p>
                <p className="text-base mb-4 text-gray-700"> 
                    {t('greentouchSessions.session6.welcomeParagraph2')}
                </p>
            </section>

            {/* Nature Connectedness Card */}
            <NatureConnectednessCard 
                natureConnectednessCardTranslations={{
                    cardTitle: t("additionalData.natureConnectednessCard.cardTitle"),
                    requiredLabel: t("additionalData.natureConnectednessCard.requiredLabel"),
                    cardDescription: t("additionalData.natureConnectednessCard.cardDescription"),
                    cardSubtitle: t("additionalData.natureConnectednessCard.cardSubtitle"),
                    leftSliderLabel: t("additionalData.natureConnectednessCard.leftSliderLabel"),
                    rightSliderLabel: t("additionalData.natureConnectednessCard.rightSliderLabel"),
                    actionButton: t("additionalData.natureConnectednessCard.actionButton"),
                    sessionIdMissingErrorMessage: t("additionalData.natureConnectednessCard.sessionIdMissingErrorMessage"),
                    sessionAlreadyCompletedErrorMessage: t("additionalData.natureConnectednessCard.sessionAlreadyCompletedErrorMessage"),
                    successMessage: t("additionalData.natureConnectednessCard.successMessage"),
                    unknownErrorMessage: t("additionalData.natureConnectednessCard.unknownErrorMessage")
                }}
                greentouchSessionId={dbSession?.id}
            />

            {/* Outdoor Task Card */}
            <section className="w-full max-w-5xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow p-8 mb-10 mt-10">
                    <div className="flex items-center gap-2 mb-6">
                        <TreeDeciduous className="w-6 h-6" />
                        <h3 className="text-xl font-semibold">{t('greentouchSessions.session6.outdoorTaskCard.cardTitle')}</h3>
                        <span className="ml-3 text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-center">
                            {t('greentouchSessions.session6.outdoorTaskCard.requiredLabel')}
                        </span>
                    </div>

                    {/* Video placeholder */}
                    <div className="w-full mb-8 aspect-video bg-gray-200 rounded-lg overflow-hidden">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/kNkA-khOvbg"
                            title="Outdoor Task Video"
                            allowFullScreen
                        />
                    </div>

                    <h4 className="text-xl font-semibold mb-3">{t('greentouchSessions.session6.outdoorTaskCard.taskTitle')}</h4>
                    <p className="text-base mb-4 text-gray-700">
                        {t('greentouchSessions.session6.outdoorTaskCard.taskDescription')}
                    </p>

                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>
                            <span className="font-semibold text-green-800">{t('greentouchSessions.session6.outdoorTaskCard.step1')}</span><br/> 
                            {t('greentouchSessions.session6.outdoorTaskCard.step1taskInstructions')}
                        </li>
                        <li>
                            <span className="font-semibold text-green-800">{t('greentouchSessions.session6.outdoorTaskCard.step2')}</span><br/> 
                            {t('greentouchSessions.session6.outdoorTaskCard.step2taskInstructions')}
                        </li>
                        <li>
                            <span className="font-semibold text-green-800">{t('greentouchSessions.session6.outdoorTaskCard.step3')}</span><br/>
                            {t('greentouchSessions.session6.outdoorTaskCard.step3taskInstructions')}
                        </li>
                    </ul>

                    <p className="text-base mb-4 text-gray-700 mt-4">
                        {t('greentouchSessions.session6.outdoorTaskCard.endMessage')}
                    </p>
                </div>
            </section>

            {/* Indoor Task Card */}
            <section className="w-full max-w-5xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow p-8 mb-10">
                    <div className="flex items-center gap-2 mb-6">
                        <HouseIcon className="w-6 h-6" />
                        <h3 className="text-xl font-semibold">{t('greentouchSessions.session6.indoorTaskCard.cardTitle')}</h3>
                        <span className="ml-3 text-xs font-semibold bg-amber-200 text-amber-600 px-2 py-0.5 rounded-full text-center">
                            {t('greentouchSessions.session6.indoorTaskCard.requiredLabel')}
                        </span>
                    </div>

                    <p className="text-base mb-4 text-gray-700">
                        {t('greentouchSessions.session6.indoorTaskCard.taskDescription')}
                    </p>

                    <ul className="list-disc mb-4 pl-6 space-y-2 text-gray-700">
                        <li>
                            {t('greentouchSessions.session6.indoorTaskCard.taskInstructions')}
                        </li>
                    </ul>

                    <div className="flex justify-end">
                        <Button asChild variant={"secondary"}>
                            <Link href="/nature-video-gallery">
                                {t('greentouchSessions.session6.indoorTaskCard.natureVideoGalleryLink')} &rarr;
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Diary Card */}
            <DiaryCard 
                diaryCardTranslations={{
                    cardTitle: t("additionalData.diaryCard.cardTitle"),
                    requiredLabel: t("additionalData.diaryCard.requiredLabel"),
                    cardDescription: t("additionalData.diaryCard.cardDescription"),
                    cardSubtitle: t("additionalData.diaryCard.cardSubtitle"),
                    noQuestionsAvailable: t("additionalData.diaryCard.noQuestionsAvailable"),
                    actionButton: t("additionalData.diaryCard.actionButton"),
                    localName: t("greentouchSessions.session6.localName"),
                    diaryQuestions: [t("greentouchSessions.session6.diaryQuestions.question1")],
                    sessionIdMissingErrorMessage: t("additionalData.diaryCard.sessionIdMissingErrorMessage"),
                    sessionNameMissingErrorMessage: t("additionalData.diaryCard.sessionNameMissingErrorMessage"),
                    successMessage: t("additionalData.diaryCard.successMessage"),
                    unknownErrorMessage: t("additionalData.diaryCard.unknownErrorMessage")
                }}
                greentouchSessionId={dbSession?.id} greentouchSessionName={dbSession?.name} 
            />

            {/* Survey Card */}
            <SurveyCard
                surveyCardTranslations={{
                    cardTitle: t("additionalData.surveyCard.cardTitle"),
                    requiredLabel: t("additionalData.surveyCard.requiredLabel"),
                    cardDescription: t("additionalData.surveyCard.cardDescription"),
                    cardSubtitle: t("additionalData.surveyCard.cardSubtitle"),
                    cardSubdescription1: t("additionalData.surveyCard.cardSubdescription1"),
                    frequencyScale: {
                        never: t("additionalData.surveyCard.frequencyScale.never"),
                        once: t("additionalData.surveyCard.frequencyScale.once"),
                        twice: t("additionalData.surveyCard.frequencyScale.twice"),
                        threeTimes: t("additionalData.surveyCard.frequencyScale.threeTimes"),
                        moreThanThreeTimes: t("additionalData.surveyCard.frequencyScale.moreThanThreeTimes"),
                    },
                    frequencyQuestions: {
                        outdoorTasks: t("additionalData.surveyCard.frequencyQuestions.outdoorTasks"),
                        indoorTasks: t("additionalData.surveyCard.frequencyQuestions.indoorTasks"),
                    },
                    cardSubdescription2: t("additionalData.surveyCard.cardSubdescription2"),
                    agreementScale: {
                        stronglyDisagree: t("additionalData.surveyCard.agreementScale.stronglyDisagree"),
                        disagree: t("additionalData.surveyCard.agreementScale.disagree"),
                        neutral: t("additionalData.surveyCard.agreementScale.neutral"),
                        agree: t("additionalData.surveyCard.agreementScale.agree"),
                        stronglyAgree: t("additionalData.surveyCard.agreementScale.stronglyAgree"),
                        notApplicable: t("additionalData.surveyCard.agreementScale.notApplicable"),
                    },
                    impactStatements: {
                        physicalHealth: t("additionalData.surveyCard.impactStatements.physicalHealth"),
                        mentalHealth: t("additionalData.surveyCard.impactStatements.mentalHealth"),
                        socialOpportunity: t("additionalData.surveyCard.impactStatements.socialOpportunity"),
                        learningChallenge: t("additionalData.surveyCard.impactStatements.learningChallenge"),
                        closerToNature: t("additionalData.surveyCard.impactStatements.closerToNature"),
                    },
                    actionButton: t("additionalData.surveyCard.actionButton"),
                    messages: {
                        sessionIdMissingErrorMessage: t("additionalData.surveyCard.messages.sessionIdMissingErrorMessage"),
                        answerAllQuestionsErrorMessage: t("additionalData.surveyCard.messages.answerAllQuestionsErrorMessage"),
                        sessionAlreadyCompletedErrorMessage: t("additionalData.surveyCard.messages.sessionAlreadyCompletedErrorMessage"),
                        successMessage: t("additionalData.surveyCard.messages.successMessage"),
                        unknownErrorMessage: t("additionalData.surveyCard.messages.unknownErrorMessage"),
                    }
                }}
                greentouchSessionId={dbSession?.id}
            />

            {/* Session Completed Card */}
            <SessionCompletedCard 
                sessionCompletedCardTranslations={{
                    title: t("additionalData.sessionCompletedCard.title"),
                    description: t("additionalData.sessionCompletedCard.description"),
                    markAsCompleted: t("additionalData.sessionCompletedCard.markAsCompleted"),
                    completed: t("additionalData.sessionCompletedCard.completed"),
                    dialog: {
                        title: t("additionalData.sessionCompletedCard.dialog.title"),
                        description: t("additionalData.sessionCompletedCard.dialog.description"),
                        cancelButton: t("additionalData.sessionCompletedCard.dialog.cancelButton"),
                        actionButton: t("additionalData.sessionCompletedCard.dialog.actionButton")
                    },
                    sessionIdMissingErrorMessage: t("additionalData.sessionCompletedCard.sessionIdMissingErrorMessage"),
                    notAllSectionsCompletedErrorMessage: t("additionalData.sessionCompletedCard.notAllSectionsCompletedErrorMessage"),
                    testLinkNotOpenedErrorMessage: t("additionalData.sessionCompletedCard.testLinkNotOpenedErrorMessage"),
                    unknownErrorMessage: t("additionalData.sessionCompletedCard.unknownErrorMessage"),
                    successMessage: t("additionalData.sessionCompletedCard.successMessage")
                }} 
                greentouchSessionId={dbSession?.id}
                greentouchSessionName={dbSession?.name}
            />

            <section className="w-full max-w-5xl mx-auto px-4 p-8 mb-10 mt-10">
                <SessionsAccordion />
            </section>

            {/* Bottom navigation links (prev/next) */}
            <section className="w-full max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center mb-10 underline">
                    <Link
                    href="/sessions/session-5"
                    className="text-[#1F566E] hover:underline font-medium flex items-center gap-1"
                    >
                    {t('greentouchSessions.session6.leftNavigationLink')}
                    </Link>

                    <Link
                    href="/sessions/session-7"
                    className="text-[#1F566E] hover:underline font-medium flex items-center gap-1"
                    >
                    {t('greentouchSessions.session6.rightNavigationLink')}
                    </Link>
                </div>
            </section>

        </main>
        </SessionPageProvider>
    )
}
