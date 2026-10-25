export const GREENTOUCH_SESSION_NAMES = [
    "demo-session",
    "session-1",
    "session-2",
    "session-3",
    "session-4",
    "session-5",
    "session-6",
    "session-7",
];

export const DEFAULT_UNLOCK_DELAY_HOURS = 12;

const ALWAYS_UNLOCKED_SESSION_NAMES = ["demo-session", "session-1"];

export function isGreentouchSessionName(name: string) {
    return GREENTOUCH_SESSION_NAMES.includes(name);
}

export function hasUnlockDelay(name: string) {
    return isGreentouchSessionName(name) && !ALWAYS_UNLOCKED_SESSION_NAMES.includes(name);
}

export function getPreviousSessionName(name: string) {
    const index = GREENTOUCH_SESSION_NAMES.indexOf(name);
    return index > 0 ? GREENTOUCH_SESSION_NAMES[index - 1] : null;
}

// A session unlocks `unlockDelayHours` after the previous session was completed.
// previousSessionCompletedAt is null when the previous session isn't completed yet.
export function getUnlockStatus(name: string, unlockDelayHours: number, previousSessionCompletedAt: Date | null) {
    if (!hasUnlockDelay(name)) {
        return { unlocked: true, unlocksAt: null };
    }

    if (!previousSessionCompletedAt) {
        return { unlocked: false, unlocksAt: null };
    }

    const unlocksAt = new Date(new Date(previousSessionCompletedAt).getTime() + unlockDelayHours * 60 * 60 * 1000);

    return { unlocked: unlocksAt <= new Date(), unlocksAt };
}
