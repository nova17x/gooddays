import type { DiaryEntry, DiaryStore } from "@/lib/types";

const BACKUP_FILENAME = "gooddays-backup.json";
const LAST_BACKUP_KEY = "gooddays-last-backup";
const BACKUP_REMINDER_DAYS = 7;
const MIN_ENTRIES_FOR_REMINDER = 3;

interface BackupData {
    version: 1;
    exportedAt: string;
    entries: DiaryStore;
}

// --- Export ---

export function exportDiary(store: DiaryStore): void {
    const data: BackupData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        entries: store,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = BACKUP_FILENAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setLastBackupDate();
}

// --- Import ---

export async function importDiary(file: File): Promise<DiaryStore> {
    const text = await file.text();
    let parsed: unknown;

    try {
        parsed = JSON.parse(text);
    } catch {
        throw new Error("ファイルの形式が正しくありません。JSONファイルを選択してください。");
    }

    // Try BackupData format (version 1)
    if (isBackupData(parsed)) {
        return parsed.entries;
    }

    // Try raw DiaryStore format (legacy / manual)
    if (isDiaryStore(parsed)) {
        return parsed;
    }

    throw new Error("バックアップファイルの内容が正しくありません。Good Days でエクスポートしたファイルを選択してください。");
}

// --- Merge ---

export function mergeDiaryStores(
    existing: DiaryStore,
    imported: DiaryStore
): DiaryStore {
    const merged: DiaryStore = { ...existing };

    for (const [date, importedEntries] of Object.entries(imported)) {
        const existingEntries = merged[date] ?? [];
        const existingIds = new Set(existingEntries.map((e) => e.id));

        const newEntries = [...existingEntries];
        for (const entry of importedEntries) {
            if (existingIds.has(entry.id)) {
                // Replace with newer version
                const idx = newEntries.findIndex((e) => e.id === entry.id);
                if (idx !== -1 && entry.updatedAt > newEntries[idx].updatedAt) {
                    newEntries[idx] = entry;
                }
            } else {
                newEntries.push(entry);
            }
        }
        merged[date] = newEntries;
    }

    return merged;
}

// --- Backup Reminder ---

export function getLastBackupDate(): Date | null {
    const raw = localStorage.getItem(LAST_BACKUP_KEY);
    if (!raw) return null;
    const date = new Date(raw);
    return isNaN(date.getTime()) ? null : date;
}

function setLastBackupDate(): void {
    localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());
}

export function shouldShowBackupReminder(totalEntryCount: number): boolean {
    if (totalEntryCount < MIN_ENTRIES_FOR_REMINDER) return false;

    const lastBackup = getLastBackupDate();
    if (!lastBackup) return true;

    const daysSinceBackup =
        (Date.now() - lastBackup.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceBackup >= BACKUP_REMINDER_DAYS;
}

// --- Stats ---

export function getDiaryStats(store: DiaryStore): {
    dayCount: number;
    entryCount: number;
} {
    const days = Object.keys(store).filter(
        (key) => store[key] && store[key].length > 0
    );
    const entries = days.reduce((sum, key) => sum + store[key].length, 0);
    return { dayCount: days.length, entryCount: entries };
}

// --- Validation ---

function isBackupData(data: unknown): data is BackupData {
    if (typeof data !== "object" || data === null) return false;
    const obj = data as Record<string, unknown>;
    return obj.version === 1 && typeof obj.entries === "object";
}

function isDiaryStore(data: unknown): data is DiaryStore {
    if (typeof data !== "object" || data === null) return false;
    const obj = data as Record<string, unknown>;
    return Object.values(obj).every(
        (val) =>
            Array.isArray(val) &&
            val.every(
                (e: unknown) =>
                    typeof e === "object" &&
                    e !== null &&
                    "id" in e &&
                    "body" in e &&
                    "date" in e
            )
    );
}
