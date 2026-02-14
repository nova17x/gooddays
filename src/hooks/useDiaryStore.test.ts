import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDiaryActions } from '@/hooks/useDiaryStore';
import { db } from '@/lib/db';
import 'fake-indexeddb/auto';

// Mock generateId to return predictable IDs if needed, but for now we can rely on random
// checking entry existence by date or body.

describe('useDiaryActions', () => {
    beforeEach(async () => {
        await db.entries.clear();
        vi.clearAllMocks();
    });

    it('should add an entry', async () => {
        const { result } = renderHook(() => useDiaryActions());
        const date = '2024-01-01';
        const body = 'Test entry';

        await result.current.addEntry(date, 'Prompt', body);

        const entries = await db.entries.toArray();
        expect(entries).toHaveLength(1);
        expect(entries[0].date).toBe(date);
        expect(entries[0].body).toBe(body);
    });

    it('should update an entry', async () => {
        const { result } = renderHook(() => useDiaryActions());
        const date = '2024-01-01';
        const body = 'Initial body';

        await result.current.addEntry(date, 'Prompt', body);
        const added = (await db.entries.toArray())[0];

        const newBody = 'Updated body';
        await result.current.updateEntry(date, added.id, newBody);

        const updated = await db.entries.get(added.id);
        expect(updated?.body).toBe(newBody);
        expect(updated?.updatedAt).not.toBe(added.updatedAt);
    });

    it('should remove an entry', async () => {
        const { result } = renderHook(() => useDiaryActions());
        const date = '2024-01-01';

        await result.current.addEntry(date, 'Prompt', 'Body');
        const added = (await db.entries.toArray())[0];

        await result.current.removeEntry(date, added.id);

        const entries = await db.entries.toArray();
        expect(entries).toHaveLength(0);
    });

    it('should replace store (import)', async () => {
        const { result } = renderHook(() => useDiaryActions());

        const newStore = {
            '2024-02-01': [
                { id: '1', date: '2024-02-01', prompt: '', body: 'Imported 1', createdAt: '', updatedAt: '' }
            ],
            '2024-02-02': [
                { id: '2', date: '2024-02-02', prompt: '', body: 'Imported 2', createdAt: '', updatedAt: '' }
            ]
        };

        await result.current.replaceStore(newStore);

        const count = await db.entries.count();
        expect(count).toBe(2);

        const entry1 = await db.entries.get('1');
        expect(entry1?.body).toBe('Imported 1');
    });
});
