import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDiaryStore } from './useDiaryStore';
import { db } from '@/lib/db';
import { STORAGE_KEY } from '@/lib/constants';
import 'fake-indexeddb/auto';

describe('useDiaryStore with Dexie', () => {
    beforeEach(async () => {
        await db.entries.clear();
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should initialize with empty store', async () => {
        const { result } = renderHook(() => useDiaryStore());
        await waitFor(() => expect(result.current.isLoaded).toBe(true));
        expect(result.current.store).toEqual({});
    });

    it('should add an entry', async () => {
        const { result } = renderHook(() => useDiaryStore());
        await waitFor(() => expect(result.current.isLoaded).toBe(true));

        const date = '2023-01-01';

        await act(async () => {
            await result.current.addEntry(date, 'Test Prompt', 'Test Body');
        });

        await waitFor(() => {
            expect(result.current.getEntries(date)).toHaveLength(1);
        });
        expect(result.current.getEntries(date)[0].body).toBe('Test Body');
    });

    it('should update an entry', async () => {
        const { result } = renderHook(() => useDiaryStore());
        await waitFor(() => expect(result.current.isLoaded).toBe(true));

        const date = '2023-01-01';

        await act(async () => {
            await result.current.addEntry(date, 'Original Prompt', 'Original Body');
        });

        await waitFor(() => {
            expect(result.current.getEntries(date)).toHaveLength(1);
        });

        const entryId = result.current.getEntries(date)[0].id;

        await act(async () => {
            await result.current.updateEntry(date, entryId, 'Updated Body');
        });

        await waitFor(() => {
            expect(result.current.getEntries(date)[0].body).toBe('Updated Body');
        });
    });

    it('should remove an entry', async () => {
        const { result } = renderHook(() => useDiaryStore());
        await waitFor(() => expect(result.current.isLoaded).toBe(true));

        const date = '2023-01-01';

        await act(async () => {
            await result.current.addEntry(date, 'Prompt', 'Body');
        });

        await waitFor(() => {
            expect(result.current.getEntries(date)).toHaveLength(1);
        });

        const entryId = result.current.getEntries(date)[0].id;

        await act(async () => {
            await result.current.removeEntry(date, entryId);
        });

        await waitFor(() => {
            expect(result.current.getEntries(date)).toHaveLength(0);
        });
    });

    it('should migrate from localStorage', async () => {
        // Setup initial data in localStorage
        const initialData = {
            '2023-01-01': [{
                id: 'test-id',
                date: '2023-01-01',
                prompt: 'Initial Prompt',
                body: 'Migrated Body',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }]
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));

        const { result } = renderHook(() => useDiaryStore());

        await waitFor(() => expect(result.current.isLoaded).toBe(true));

        // Migration happens on mount, so wait for it to reflect in DB -> store
        await waitFor(() => {
            expect(result.current.getEntries('2023-01-01')).toHaveLength(1);
        });

        expect(result.current.getEntries('2023-01-01')[0].body).toBe('Migrated Body');
    });
});
