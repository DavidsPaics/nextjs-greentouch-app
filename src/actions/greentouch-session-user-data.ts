"use server"

import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { requiresTestLink } from "@/lib/test-links";
import { revalidatePath } from "next/cache";

export async function getCurrentGreentouchSessionUserData(greentouchSessionId: string) {
    try {
        const session = await getServerSession();
        if (!session) throw new Error("User not authenticated");

        const userId = session.user.id;

        const userData = await prisma.greentouchSessionUserData.findUnique({
            where: { greentouchSessionId_userId: { greentouchSessionId, userId } },
            include: { greentouchSession: true },
        });

        return userData;
    } catch (error) {
        console.error("Error fetching current greentouch session user data:", error);
        throw new Error("Failed to fetch current greentouch session user data");
    }
}

export async function saveUserNatureConnectedness(greentouchSessionId: string, value: number) {
    try {   
        const session = await getServerSession();
        if (!session) {
            console.error("User not authenticated");
            return {success:false, error: "User not authenticated"};
        }

        const userId = session.user.id;

        const existingData = await prisma.greentouchSessionUserData.findUnique({
            where: { greentouchSessionId_userId: { greentouchSessionId, userId } },
        });

        if (existingData && existingData.sessionCompleted) {
            return { success: false, error: "Session already completed." };
        }

        if (existingData) {
            await prisma.greentouchSessionUserData.update({
                where: { greentouchSessionId_userId: { greentouchSessionId, userId } },
                data: { natureConnectedness: value, natureConnectednessCreatedAt: new Date() },
            });
        } else {
            await prisma.greentouchSessionUserData.create({
                data: {
                userId,
                    greentouchSessionId,
                    natureConnectedness: value,
                }
            });
        }

        return {success:true}
    } catch (error) {
        console.error("Error saving user nature connectedness:", error);
        return {success:false, error: "Failed to save nature connectedness."};
    }
}

export async function getAllCompletedSessionsNumberInfo() {
    try {
        const session = await getServerSession();
        if (!session) {
            console.error("User not authenticated");
            return {success:false, error: "User not authenticated"};
        }

        const userId = session.user.id;

        const completedSessions = await prisma.greentouchSessionUserData.count({
            where: { userId, sessionCompleted: true },
        });

        return {success: true, completedSessions};
    } catch (error) {
        console.error("Error fetching completed sessions number info:", error);
        return {success: false, completedSessions: 0, error: "Failed to fetch completed sessions number info."};
    }
}

export async function getAllNatureConnectednessInfo() {
    try {
        const session = await getServerSession();
        if (!session) {
          console.error("User not authenticated");
            return {success:false, error: "User not authenticated"};
        }

        const userId = session.user.id;
        const userData = await prisma.greentouchSessionUserData.findMany({
            where: { userId, natureConnectedness: { not: null } },
            select: {
            natureConnectedness: true,
            natureConnectednessCreatedAt: true,
            greentouchSession: { select: { name: true } },
            },
            orderBy: { greentouchSession: { name: 'asc' } },
        });

        return {success: true, userData: userData.map((data, index) => ({
            id: index,
            greentouchSessionName: data.greentouchSession.name,
            natureConnectednessValue: data.natureConnectedness ?? 0,
            natureConnectednessCreatedAt: data.natureConnectednessCreatedAt,
        }))};
    } catch (error) {
        console.error("Error fetching nature connectedness info:", error);
        return {success: false, error: "Failed to fetch nature connectedness info."};
    }
}

export async function saveDiaryEntry(greentouchSessionId: string, greentouchSessionName: string, diaryTexts: string[]) {
    try {
        const session = await getServerSession();
        if (!session) {
          console.error("User not authenticated");
            return {success:false, error: "User not authenticated"};
        }

        const userId = session.user.id;

        const existingData = await prisma.greentouchSessionUserData.findUnique({
            where: { greentouchSessionId_userId: { greentouchSessionId, userId } },
        });

        if (existingData) {
            await prisma.greentouchSessionUserData.update({
                where: { greentouchSessionId_userId: { greentouchSessionId, userId } },
                data: { diaryEntry: diaryTexts },
            });
        } else {
            await prisma.greentouchSessionUserData.create({
                data: {
                    userId,
                    greentouchSessionId,
                    diaryEntry: diaryTexts,
                }
            });
        }

        revalidatePath("/sessions/" + greentouchSessionName);
        return {success:true}
    } catch (error) {
        console.error("Error saving diary entry:", error);
        return {success:false, error: "Failed to save diary entry."};
    }
}

export async function getAllDiaryEntries() {
    try {
        const session = await getServerSession();
        if (!session) {
            console.error("User not authenticated");
            return {success:false, error: "User not authenticated"};
        }

        const userId = session.user.id;

        const userData = await prisma.greentouchSessionUserData.findMany({
            where: { userId, diaryEntry: { isEmpty: false } },
            select: {
                greentouchSessionId: true,
                greentouchSession: { select: { name: true } },
                diaryEntry: true,
            },
            orderBy: { greentouchSession: { name: 'asc' } },
        });

        return {success: true, userData: userData.map((item) => ({
            greentouchSessionId: item.greentouchSessionId,
            greentouchSessionName: item.greentouchSession.name,
            initialDiaryText: item.diaryEntry,
        }))};
    } catch (error) {
        console.error("Error fetching diary entries:", error);
        return {success: false, error: "Failed to fetch diary entries."};
    }
}

export async function favoriteSession(greentouchSessionId: string, isFavorite: boolean) {
    try {
        const session = await getServerSession();
        if (!session) {
          console.error("User not authenticated");
            return {success:false, error: "User not authenticated"};
        }
        const userId = session.user.id;

        const existingData = await prisma.greentouchSessionUserData.findUnique({
            where: { greentouchSessionId_userId: { greentouchSessionId, userId } },
        });

        if (existingData) {
            await prisma.greentouchSessionUserData.update({
                where: { greentouchSessionId_userId: { greentouchSessionId, userId } },
                data: { isFavorite },
            });
        } else {
            await prisma.greentouchSessionUserData.create({
                data: {
                    userId,
                    greentouchSessionId,
                    isFavorite,
                }
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error favoriting session:", error);
        return { success: false, error: "Failed to favorite session." };
    }
}

export async function getAllFavoriteSessions() {
    try {
        const session = await getServerSession();
        if (!session) {
            console.error("User not authenticated");
            return {success:false, error: "User not authenticated"};
        }

        const userId = session.user.id;

        const favoriteSessions = await prisma.greentouchSession.findMany({
            where: { users: { some: { userId, isFavorite: true } } },
            orderBy: { name: 'asc' },
        });

        return {success: true, favoriteSessions};
    } catch (error) {
        console.error("Error fetching favorite sessions:", error);
        return {success: false, error: "Failed to fetch favorite sessions."};
    }
}

export async function removeFavoriteSession(greentouchSessionName: string) {
    try {
        const session = await getServerSession();
        if (!session) {
          console.error("User not authenticated");
            return {success:false, error: "User not authenticated"};
        }
        const userId = session.user.id;
        await prisma.greentouchSessionUserData.updateMany({
            where: { greentouchSession: { name: greentouchSessionName }, userId },
            data: { isFavorite: false },
        });
        revalidatePath("/account/favorites");
        return { success: true };
    } catch (error) {
        console.error("Error removing favorite session:", error);
        return { success: false, error: "Failed to remove favorite session." };
    }
}

export async function saveSurveyData(greentouchSessionId: string, outdoorTasksCount: string, indoorTasksCount: string, physicalHealthResponse: string, mentalHealthResponse: string, friendsFamilyResponse: string, learntSomethingNewResponse: string, closerToNatureResponse: string) {
    try {
        const session = await getServerSession();
        if (!session) {
          console.error("User not authenticated");
            return {success:false, error: "User not authenticated"};
        }
        const userId = session.user.id;

        const existingData = await prisma.greentouchSessionUserData.findUnique({
            where: { greentouchSessionId_userId: { greentouchSessionId, userId } },
        });

        if (existingData && existingData.sessionCompleted) {
            return { success: false, error: "Session already completed." };
        }

        if (existingData) {
            await prisma.greentouchSessionUserData.update({
                where: { greentouchSessionId_userId: { greentouchSessionId, userId } },
                data: {
                        outdoorTasksCount,
                        indoorTasksCount,
                        physicalHealthResponse,
                        mentalHealthResponse,
                        friendsFamilyResponse,
                        learntSomethingNewResponse,
                        closerToNatureResponse,
                },
            });
        } else {
            await prisma.greentouchSessionUserData.create({
                data: {
                    userId,
                    greentouchSessionId,
                    outdoorTasksCount,
                    indoorTasksCount,
                    physicalHealthResponse,
                    mentalHealthResponse,
                    friendsFamilyResponse,
                    learntSomethingNewResponse,
                    closerToNatureResponse,
                },
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error saving survey data:", error);
        return { success: false, error: "Failed to save survey data." };
    }
}

export async function saveTestLinkClicked(greentouchSessionId: string) {
    try {
        const session = await getServerSession();
        if (!session) {
            console.error("User not authenticated");
            return {success:false, error: "User not authenticated"};
        }
        const userId = session.user.id;

        const existingData = await prisma.greentouchSessionUserData.findUnique({
            where: { greentouchSessionId_userId: { greentouchSessionId, userId } },
        });

        // keep the first click, the link can be reopened any number of times
        if (existingData?.testLinkClickedAt) {
            return { success: true };
        }

        if (existingData) {
            await prisma.greentouchSessionUserData.update({
                where: { greentouchSessionId_userId: { greentouchSessionId, userId } },
                data: { testLinkClickedAt: new Date() },
            });
        } else {
            await prisma.greentouchSessionUserData.create({
                data: {
                    userId,
                    greentouchSessionId,
                    testLinkClickedAt: new Date(),
                },
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error saving test link click:", error);
        return { success: false, error: "Failed to save test link click." };
    }
}

export async function sessionIsCompleted(greentouchSessionId: string) {
    try {
        const session = await getServerSession();
        if (!session) {
            console.error("User not authenticated");
            return {success:false, error: "User not authenticated"};
        }
        const userId = session.user.id;

        const existingData = await prisma.greentouchSessionUserData.findUnique({
            where: { greentouchSessionId_userId: { greentouchSessionId, userId } },
        });

        const sessionRecord = await prisma.greentouchSession.findUnique({
            where: { id: greentouchSessionId },
            select: { name: true },
        });

        if (existingData?.sessionCompleted) {
            console.error("Session already completed");
            return {success:false, error: "Session already completed"};
        }

        const sessionName = sessionRecord?.name ?? "";
        const isSession1to6 = /^session-([1-6])$/i.test(sessionName);

        if (isSession1to6) {
            if (
                existingData?.natureConnectedness !== null &&
                existingData?.diaryEntry &&
                existingData?.diaryEntry.length > 0 &&
                existingData?.outdoorTasksCount !== null &&
                existingData?.indoorTasksCount !== null &&
                existingData?.physicalHealthResponse !== null &&
                existingData?.mentalHealthResponse !== null &&
                existingData?.friendsFamilyResponse !== null &&
                existingData?.learntSomethingNewResponse !== null &&
                existingData?.closerToNatureResponse !== null &&
                (!requiresTestLink(sessionName) || existingData?.testLinkClickedAt)
            ) {
                await prisma.greentouchSessionUserData.update({
                    where: { greentouchSessionId_userId: { greentouchSessionId, userId } },
                    data: {
                        sessionCompleted: true,
                        sessionCompletedAt: new Date(),
                    },
                });
                revalidatePath(`/sessions/`);
                return { success: true };
            } else {
                console.error("Cannot complete session. User data not found.");
                return {success:false, error: "User data not found"};
            }
        } else {
            // For other sessions, just require natureConnectedness (and the test link, if the session has one)
            if (
                existingData &&
                existingData.natureConnectedness !== null &&
                (!requiresTestLink(sessionName) || existingData.testLinkClickedAt)
            ) {
                await prisma.greentouchSessionUserData.update({
                    where: { greentouchSessionId_userId: { greentouchSessionId, userId } },
                    data: {
                        sessionCompleted: true,
                        sessionCompletedAt: new Date(),
                    },
                });
                revalidatePath(`/sessions/`);
                return { success: true };
            } else {
                console.error("Cannot complete session. Nature connectedness or test link data not found.");
                return {success:false, error: "Nature connectedness or test link data not found"};
            }
        }
    } catch (error) {
        console.error("Error marking session as completed:", error);
        return { success: false, error: "Failed to mark session as completed. Make sure all required data is provided." };
    }
}

export async function getAllCompletedGreentouchSessions () {
    try {
        const session = await getServerSession();
        if (!session) throw new Error("User not authenticated");
        const userId = session.user.id;

        const completedSessions = await prisma.greentouchSessionUserData.findMany({
            where: { userId, sessionCompleted: true },
            include: { greentouchSession: true },
        });

        return completedSessions;
    } catch (error) {
        console.error("Error fetching completed greentouch sessions:", error);
        throw new Error("Failed to fetch completed greentouch sessions");
    }
}