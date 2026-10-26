"use client";

import { CheckIcon, ClipboardListIcon, ExternalLinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { saveTestLinkClicked } from "@/actions/greentouch-session-user-data";
import { useSessionPage } from "./sessionPageContext";
import { cn } from "@/lib/utils";

interface TestLinkCardProps {
    testLinkCardTranslations: {
        cardTitle: string;
        requiredLabel: string;
        actionButton: string;
        openedLabel: string;
        unknownErrorMessage: string;
    };
    url: string;
    greentouchSessionId?: string;
    className?: string;
}

export default function TestLinkCard({ testLinkCardTranslations, url, greentouchSessionId, className }: TestLinkCardProps) {

    // 1) GLOBAL STATE from SessionPageContext
    const { testLinkClicked, setTestLinkClicked } = useSessionPage();

    // The link opens in a new tab as usual, the click is saved in the background
    const handleClick = async () => {
        if (!greentouchSessionId || testLinkClicked) return;

        try {
            const result = await saveTestLinkClicked(greentouchSessionId);

            if (result.success) {
                setTestLinkClicked(true);
            } else {
                toast.error(testLinkCardTranslations.unknownErrorMessage);
            }
        } catch (error) {
            console.error("Error saving test link click:", error);
            toast.error(testLinkCardTranslations.unknownErrorMessage);
        }
    };

    return (
        <section className="w-full max-w-5xl mx-auto px-4">
            <div className={cn("bg-white rounded-lg shadow p-8 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6", className)}>
                <div className="flex items-center gap-3">
                    <ClipboardListIcon className="w-6 h-6 shrink-0 text-green-800" />
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <h3 className="text-xl font-semibold">
                            {testLinkCardTranslations.cardTitle}
                        </h3>
                        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-center">
                            {testLinkCardTranslations.requiredLabel}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 shrink-0">
                    {testLinkClicked && (
                        <span className="flex items-center gap-1 text-sm font-semibold text-green-600">
                            <CheckIcon className="w-4 h-4" />
                            {testLinkCardTranslations.openedLabel}
                        </span>
                    )}
                    <Button asChild>
                        <a href={url} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
                            {testLinkCardTranslations.actionButton}
                            <ExternalLinkIcon className="w-4 h-4" />
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}
