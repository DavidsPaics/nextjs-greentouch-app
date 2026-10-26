"use client";

import {useState } from "react";
import { LoadingButton } from "../loadingButton";
import { toast } from "sonner";
import { sessionIsCompleted } from "@/actions/greentouch-session-user-data";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { useSessionPage } from "./sessionPageContext";

interface SessionCompletedCardProps {
    sessionCompletedCardTranslations: {
        title: string;
        description: string;
        markAsCompleted: string;
        completed: string;
        dialog: {
            title: string;
            description: string;
            cancelButton: string;
            actionButton: string;
        };
        successMessage: string;
        notAllSectionsCompletedErrorMessage: string;
        unknownErrorMessage: string;
        sessionIdMissingErrorMessage: string;
    };
    greentouchSessionId?: string;
    greentouchSessionName?: string;
}

export default function SessionCompletedCard({ sessionCompletedCardTranslations, greentouchSessionId, greentouchSessionName }: SessionCompletedCardProps) {

    // 1) GLOBAL STATE from SessionPageContext
    const { sessionCompleted, setSessionCompleted, natureConnectednessValue, diaryEntry, surveyData } = useSessionPage();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!greentouchSessionId) {
            toast.error(sessionCompletedCardTranslations.sessionIdMissingErrorMessage);
            return;
        }

        if(sessionCompleted) {
            return;
        }

        // 2) Check that all sections are completed
        if (greentouchSessionName === "session-7") {
            const allResponsesAvailable =  natureConnectednessValue !== null
            if (!allResponsesAvailable) {
                toast.error(sessionCompletedCardTranslations.notAllSectionsCompletedErrorMessage);
                return;
            }
        }
        else {
            const allResponsesAvailable = surveyData &&
            natureConnectednessValue !== null &&
            diaryEntry !== null && diaryEntry.length !== 0 &&
            surveyData.outdoorTasksCount !== undefined &&
            surveyData.indoorTasksCount !== undefined &&
            surveyData.physicalHealthResponse !== undefined &&
            surveyData.mentalHealthResponse !== undefined &&
            surveyData.friendsFamilyResponse !== undefined &&
            surveyData.learntSomethingNewResponse !== undefined &&
            surveyData.closerToNatureResponse !== undefined;
            if (!allResponsesAvailable) {
                toast.error(sessionCompletedCardTranslations.notAllSectionsCompletedErrorMessage);
                return;
            }
        }

        setIsLoading(true);

        try {
            const result = await sessionIsCompleted(greentouchSessionId);

            if (result.success) {
                setSessionCompleted(true);
                toast.success(sessionCompletedCardTranslations.successMessage);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error("Error marking session as completed:", error);
            toast.error(sessionCompletedCardTranslations.unknownErrorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="w-full max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow p-8">
                <div className="flex flex-col items-center text-center gap-4">
                    <h3 className="text-xl font-semibold">{sessionCompletedCardTranslations.title}</h3>
                    <p className="text-sm text-gray-700 max-w-md">{sessionCompletedCardTranslations.description}</p>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="default" disabled={isLoading || sessionCompleted}>
                                {sessionCompleted ? sessionCompletedCardTranslations.completed : sessionCompletedCardTranslations.markAsCompleted}
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{sessionCompletedCardTranslations.dialog.title}</DialogTitle>
                                <DialogDescription>{sessionCompletedCardTranslations.dialog.description}</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">{sessionCompletedCardTranslations.dialog.cancelButton}</Button>
                                </DialogClose>
                                <LoadingButton
                                    variant="default"
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={isLoading || sessionCompleted}
                                    loading={isLoading}
                                >
                                    {sessionCompleted ? sessionCompletedCardTranslations.completed : sessionCompletedCardTranslations.markAsCompleted}
                                </LoadingButton>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </section>
    );
}
