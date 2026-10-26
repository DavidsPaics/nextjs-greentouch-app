"use client";

import { createContext, useContext, useState } from "react";

interface SurveyData {
  outdoorTasksCount?: string;
  indoorTasksCount?: string;
  physicalHealthResponse?: string;
  mentalHealthResponse?: string;
  friendsFamilyResponse?: string;
  learntSomethingNewResponse?: string;
  closerToNatureResponse?: string;
}

interface SessionPageInitialData {
  natureConnectednessValue: number | null;
  diaryEntry: string[] | null;
  surveyData: SurveyData;
  sessionCompleted: boolean;
  testLinkClicked?: boolean;
}

interface SessionPageContextType {
  natureConnectednessValue: number | null;
  setNatureConnectednessValue: (v: number | null) => void;

  diaryEntry: string[] | null;
  setDiaryEntry: (v: string[] | null) => void;

  surveyData: SurveyData;
  setSurveyData: (v: SurveyData) => void;

  sessionCompleted: boolean;
  setSessionCompleted: (v: boolean) => void;

  testLinkClicked: boolean;
  setTestLinkClicked: (v: boolean) => void;
}

const SessionPageContext = createContext<SessionPageContextType | undefined>(undefined);

export function SessionPageProvider({
  children,
  initialData
}: {
  children: React.ReactNode;
  initialData: SessionPageInitialData;
}) {
  const [natureConnectednessValue, setNatureConnectednessValue] = useState<number | null>(
    initialData.natureConnectednessValue
  );
  const [diaryEntry, setDiaryEntry] = useState<string[] | null>(initialData.diaryEntry);
  const [surveyData, setSurveyData] = useState<SurveyData>(initialData.surveyData);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(initialData.sessionCompleted);
  const [testLinkClicked, setTestLinkClicked] = useState<boolean>(initialData.testLinkClicked ?? false);

  return (
    <SessionPageContext.Provider value={{
      natureConnectednessValue,
      setNatureConnectednessValue,

      diaryEntry,
      setDiaryEntry,

      surveyData,
      setSurveyData,

      sessionCompleted,
      setSessionCompleted,

      testLinkClicked,
      setTestLinkClicked,
    }}>
      {children}
    </SessionPageContext.Provider>
  );
}

export function useSessionPage() {
  const ctx = useContext(SessionPageContext);
  if (!ctx) throw new Error("useSessionPage must be used inside SessionPageProvider");
  return ctx;
}
