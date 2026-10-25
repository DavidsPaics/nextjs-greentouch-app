import { getAllGreentouchSessions } from "@/actions/greentouch-session";
import { getAllCompletedGreentouchSessions } from "@/actions/greentouch-session-user-data";
import { UnlockDelayDialog } from "@/components/greentouchSessions/unlockDelayDialog";
import { getServerSession } from "@/lib/get-session";
import { DEFAULT_UNLOCK_DELAY_HOURS, getPreviousSessionName, getUnlockStatus, hasUnlockDelay } from "@/lib/session-unlock";
import { LockIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface SessionData {
  localName: string;
  title: string;
  description: string;
  image: string;
  diaryQuestions?: string[];
}

export default async function Sessions() {

    const session = await getServerSession();

    const t = await getTranslations("sessionsPage");
    const greentouchSessionsObj = t.raw("greentouchSessions") as Record<string, SessionData>;
    const greentouchSessions = Object.values(greentouchSessionsObj);

    if (!session) { 
        return (
            //display only demo session if not logged in
            <main className="w-full min-h-screen bg-[#f5f5f5] text-gray-900">

                {/* Top gradient header */}
                <section className="bg-gradient-to-r from-[#0A3730] to-[#1F6E4C] text-white pb-10 pt-20">
                    <div className="max-w-5xl mx-auto px-4">
                        <h1 className="text-3xl font-bold text-left">{t('header.title')}</h1>
                    </div>
                </section>

                {/* Hero section */}
                <section className="w-full max-w-5xl px-4 pt-20 pb-10 mx-auto">
                    <div className="flex flex-col gap-6">
                        {greentouchSessions.filter(s => s.localName === "demo-session").map((greentouchSession) => (
                            <Link
                            key={greentouchSession.localName}
                            href={`/sessions/${greentouchSession.localName}`}
                            className="flex flex-col sm:flex-row items-stretch bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
                            >
                            {/* Image section – raztegnjena do robov */}
                            <div className="relative w-full sm:w-52 md:w-54 lg:w-56 h-40 sm:h-46 flex-shrink-0">
                                <Image
                                src={greentouchSession.image}
                                alt={greentouchSession.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>
                            {/* Text section */}
                            <div className="flex flex-col justify-center px-6 py-4">
                                <h2 className="text-lg sm:text-xl font-semibold">{greentouchSession.title}</h2>
                                <p className="text-sm sm:text-base text-gray-600">{greentouchSession.description}</p>
                            </div>
                            </Link>
                        ))}
                    </div>

                    {/* Reminder section */}
                    <div className="w-full max-w-5xl mt-10 py-6 mx-auto bg-gradient-to-r from-[#0A3730] to-[#1F6E4C] text-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
                        <div className="px-6 text-start">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4">{t('additionalData.reminderSection.title')}</h2>
                            <p className="text-sm sm:text-base opacity-90">
                            {t('additionalData.reminderSection.message')}
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        ) 
    }   

    const dbGreentouchSessions = await getAllGreentouchSessions();
    const completedSessions = await getAllCompletedGreentouchSessions();

    // "si" is Slovenian in this app, but Sinhala in date formatting
    const locale = await getLocale();
    const dateLocale = locale === "si" ? "sl" : locale;

    const getUnlockDelayHours = (localName: string) =>
        dbGreentouchSessions.find((s) => s.name === localName)?.unlockDelayHours ?? DEFAULT_UNLOCK_DELAY_HOURS;

    const getSessionUnlockStatus = (localName: string) => {
        const previousSessionName = getPreviousSessionName(localName);
        const previousSessionCompletedAt = completedSessions.find(
            (completed) => completed.greentouchSession.name === previousSessionName
        )?.sessionCompletedAt ?? null;

        return getUnlockStatus(localName, getUnlockDelayHours(localName), previousSessionCompletedAt);
    };

    return (
        <main className="w-full min-h-screen bg-[#f5f5f5] text-gray-900">

            {/* Top gradient header */}
            <section className="bg-gradient-to-r from-[#0A3730] to-[#1F6E4C] text-white pb-10 pt-20">
                <div className="max-w-5xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-left">{t('header.title')}</h1>
                </div>
            </section>

            {/* Hero section */}
            <section className="w-full max-w-5xl px-4 pt-20 pb-20 mx-auto">
                <div className="flex flex-col gap-6">
                {greentouchSessions.map((greentouchSession) => {
                    const { unlocked, unlocksAt } = getSessionUnlockStatus(greentouchSession.localName);
                    const unlockDelayHours = getUnlockDelayHours(greentouchSession.localName);

                    // prepare nice date format (if exists)
                    const formattedUnlocksAt =
                        unlocksAt
                            ? unlocksAt.toLocaleString(dateLocale, {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : null;

                    return (
                        <div
                            key={greentouchSession.localName}
                            className={`relative flex flex-row items-stretch rounded-xl shadow transition overflow-hidden ${
                                unlocked || session.user.role === "admin"
                                    ? "bg-white hover:shadow-md"
                                    : "bg-gray-200 opacity-70 cursor-not-allowed"
                            }`}
                        >
                            {/* if user is admin, show all sessions with their unlock delay */}
                            {session.user.role === "admin" ? (
                                <Link
                                    href={`/sessions/${greentouchSession.localName}`}
                                    className="flex flex-col sm:flex-row flex-1"
                                >
                                    <div className="relative w-full sm:w-52 md:w-54 lg:w-56 h-40 sm:h-46 flex-shrink-0">
                                        <Image
                                            src={greentouchSession.image}
                                            alt={greentouchSession.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 30vw, 25vw"
                                        />
                                    </div>

                                    <div className="flex flex-col justify-center px-4 sm:px-6 py-4 pb-12">
                                        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                                            {greentouchSession.title}
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600">
                                            {greentouchSession.description}
                                        </p>
                                    </div>
                                </Link>
                                // if user is not admin, but session is unlocked
                            ) : unlocked ? (
                                <Link
                                    href={`/sessions/${greentouchSession.localName}`}
                                    className="flex flex-col sm:flex-row flex-1"
                                >
                                    {/* Image */}
                                    <div className="relative w-full sm:w-52 md:w-54 lg:w-56 h-40 sm:h-46 flex-shrink-0">
                                        <Image
                                            src={greentouchSession.image}
                                            alt={greentouchSession.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 30vw, 25vw"
                                        />
                                    </div>

                                    {/* Text */}
                                    <div className="flex flex-col justify-center px-4 sm:px-6 py-4">
                                        <h2 className="text-lg sm:text-xl font-semibold">
                                            {greentouchSession.title}
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600">
                                            {greentouchSession.description}
                                        </p>
                                        {greentouchSession.localName !== "demo-session" && (
                                            (unlocked && completedSessions.some(
                                                (completed) =>
                                                    completed.greentouchSession.name === greentouchSession.localName
                                            )) ? (
                                                <p className="text-sm sm:text-base mt-2 text-green-600 font-semibold">{t('additionalData.sessionStatus.completed')}</p>
                                            ) : (
                                                <p className="text-sm sm:text-base mt-2 text-gray-600 font-semibold">{t('additionalData.sessionStatus.inProgress')}</p>
                                            )
                                        )}
                                    </div>
                                </Link>
                                // if user is not admin and session is locked
                            ) : (
                                <HoverCard>
                                <HoverCardTrigger asChild>
                                <div className="flex flex-col sm:flex-row flex-1">
                                    <div className="relative w-full sm:w-52 md:w-54 lg:w-56 h-40 sm:h-46 flex-shrink-0">
                                        <Image
                                            src={greentouchSession.image}
                                            alt={greentouchSession.title}
                                            fill
                                            className="object-cover grayscale"
                                            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 30vw, 25vw"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center px-4 sm:px-6 py-4">
                                        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                                            {greentouchSession.title}
                                                <LockIcon className="w-4 h-4 text-gray-600" />
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-600">
                                            {greentouchSession.description}
                                        </p>
                                        <HoverCardContent>
                                        {formattedUnlocksAt ? (
                                            <p className="text-sm sm:text-base text-gray-600 italic">
                                                {t('additionalData.unlockStatus.unlocksOn', { date: formattedUnlocksAt })}
                                            </p>
                                        ) : (
                                            <p className="text-sm sm:text-base text-gray-600 italic">
                                                {t('additionalData.unlockStatus.previousSessionsCompletionRequired')}
                                            </p>
                                        )}
                                        </HoverCardContent>
                                        <p className="text-sm sm:text-base mt-2 text-gray-600 font-semibold">
                                            {unlocksAt
                                                ? t('additionalData.sessionStatus.availableIn', { hours: Math.ceil((unlocksAt.getTime() - Date.now()) / (60 * 60 * 1000)) })
                                                : t('additionalData.sessionStatus.toBeCompleted')}
                                        </p>
                                    </div>
                                </div>
                                </HoverCardTrigger>
                                </HoverCard>
                            )}

                            {/* Admin unlock delay button */}
                            {session.user.role === "admin" &&
                            hasUnlockDelay(greentouchSession.localName) && (
                                <div className="absolute bottom-3 right-3 pt-4">
                                    <UnlockDelayDialog
                                        unlockDelayDialogTranslations={{
                                            sessionTitle: (greentouchSession.title),
                                            title: t("additionalData.setUnlockDelayDialog.title"),
                                            description1: t("additionalData.setUnlockDelayDialog.description1"),
                                            description2: t("additionalData.setUnlockDelayDialog.description2"),
                                            labelHours: t("additionalData.setUnlockDelayDialog.labelHours"),
                                            actionButton: t("additionalData.setUnlockDelayDialog.actionButton"),
                                            successMessage: t("additionalData.setUnlockDelayDialog.successMessage"),
                                            errorMessage: t("additionalData.setUnlockDelayDialog.errorMessage")
                                        }}
                                        sessionName={greentouchSession.localName}
                                        initialUnlockDelayHours={unlockDelayHours}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
                </div>
            </section>
        </main>
    );
}
