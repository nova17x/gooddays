import Dexie, { type EntityTable } from 'dexie';
import type { DiaryEntry } from './types';

const db = new Dexie('GoodDaysDB') as Dexie & {
    entries: EntityTable<
        DiaryEntry,
        'id' // primary key "id" (for the typings only)
    >;
};

// Schema definition
db.version(1).stores({
    entries: 'id, date, createdAt' // Primary key and indexed props
});

export { db };
