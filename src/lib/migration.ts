import { db } from './db';
import { STORAGE_KEY } from './constants';
import type { DiaryEntry, DiaryStore } from './types';

export const MIGRATION_KEY = 'gooddays_migrated_to_idb';

export async function migrateFromLocalStorage(): Promise<void> {
    if (typeof window === 'undefined') return;

    const isMigrated = localStorage.getItem(MIGRATION_KEY);
    if (isMigrated) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(MIGRATION_KEY, 'true');
        return;
    }

    try {
        const parsed: DiaryStore = JSON.parse(raw);
        const entries: DiaryEntry[] = [];

        // Flatten the store into an array of entries
        Object.values(parsed).forEach((dayEntries) => {
            if (Array.isArray(dayEntries)) {
                entries.push(...dayEntries);
            }
        });

        if (entries.length > 0) {
            // Bulk add to IndexedDB
            await db.entries.bulkPut(entries);
            console.log(`Migrated ${entries.length} entries to IndexedDB`);
        }

        // Mark as migrated
        localStorage.setItem(MIGRATION_KEY, 'true');

        // Optional: We can keep the old data for a while as backup
        // localStorage.removeItem(STORAGE_KEY); 
    } catch (error) {
        console.error('Migration failed:', error);
        // Do not mark as migrated so we can try again
    }
}
