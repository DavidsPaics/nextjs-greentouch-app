"use server"

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { getPreviousSessionName, getUnlockStatus, hasUnlockDelay, isGreentouchSessionName } from "@/lib/session-unlock";
import { revalidatePath } from "next/cache";

export async function setGreentouchSessionUnlockDelay(name: string, unlockDelayHours: number) {
  try {
    const session = await getServerSession();

    if (!session) {
        console.error("User not authenticated");
        return {success:false, error: "User not authenticated"};
    }

    if(session.user.role !== "admin") {
        console.error("Unauthorized access attempt");
        return {success:false, error: "Unauthorized"};
    }

    if (!hasUnlockDelay(name) || !Number.isInteger(unlockDelayHours) || unlockDelayHours < 0) {
        console.error("Invalid unlock delay:", name, unlockDelayHours);
        return {success:false, error: "Invalid unlock delay"};
    }

    const greentouchSession = await prisma.greentouchSession.upsert({
      where: { name },
      update: { unlockDelayHours },
      create: { name, unlockDelayHours },
    });

    revalidatePath("/sessions");

    return { success: true, greentouchSession };
  } catch (error) {
    console.error("Error setting unlock delay:", error);
    return { success: false, error: "Failed setting unlock delay" };
  }
}

export async function getAllGreentouchSessions() {
    try {
        const greentouchSessions = await prisma.greentouchSession.findMany({})

        return greentouchSessions;
    } catch (error) {
        console.log("Error fetching greentouch sessions:", error);
        throw new Error("Failed to fetch greentouch sessions");
    }
}

export async function getGreentouchSessionByName(name: string) {
    try {
        if (!isGreentouchSessionName(name)) return null;

        // create the session row on first access so user data can be saved against it
        const greentouchSession = await prisma.greentouchSession.upsert({
            where: { name },
            update: {},
            create: { name },
        })

        return greentouchSession;
    } catch (error) {
        console.log("Error fetching greentouch session:", error);
        throw new Error("Failed to fetch greentouch session");
    }
}

export async function getSessionUnlockStatus(name: string) {
    try {
        const session = await getServerSession();
        if (!session) throw new Error("User not authenticated");

        const greentouchSession = await getGreentouchSessionByName(name);
        if (!greentouchSession) return { unlocked: false, unlocksAt: null };

        const previousSessionName = getPreviousSessionName(name);
        const previousSessionUserData = previousSessionName
            ? await prisma.greentouchSessionUserData.findFirst({
                where: { userId: session.user.id, sessionCompleted: true, greentouchSession: { name: previousSessionName } },
                select: { sessionCompletedAt: true },
            })
            : null;

        return getUnlockStatus(name, greentouchSession.unlockDelayHours, previousSessionUserData?.sessionCompletedAt ?? null);
    } catch (error) {
        console.log("Error fetching session unlock status:", error);
        throw new Error("Failed to fetch session unlock status");
    }
}
