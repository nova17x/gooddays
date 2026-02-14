import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useDiaryStore } from './useDiaryStore';
import { STORAGE_KEY } from '@/lib/constants';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('useDiaryStore', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    it('should initialize with empty store', async () => {
        const { result } = renderHook(() => useDiaryStore());

        // Wait for isLoaded to be true
        await waitFor(() => expect(result.current.isLoaded).toBe(true));

        expect(result.current.store).toEqual({});
    });

    it('should add an entry', async () => {
        const { result } = renderHook(() => useDiaryStore());
        await waitFor(() => expect(result.current.isLoaded).toBe(true));

        const date = '2023-01-01';

        act(() => {
            result.current.addEntry(date, 'Test Prompt', 'Test Body');
        });

        expect(result.current.getEntries(date)).toHaveLength(1);
        expect(result.current.getEntries(date)[0].body).toBe('Test Body');
        expect(result.current.hasEntry(date)).toBe(true);
    });

    it('should update an entry', async () => {
        const { result } = renderHook(() => useDiaryStore());
        await waitFor(() => expect(result.current.isLoaded).toBe(true));

        const date = '2023-01-01';

        act(() => {
            result.current.addEntry(date, 'Original Prompt', 'Original Body');
        });

        const entryId = result.current.getEntries(date)[0].id;

        act(() => {
            result.current.updateEntry(date, entryId, 'Updated Body');
        });

        expect(result.current.getEntries(date)[0].body).toBe('Updated Body');
    });

    it('should remove an entry', async () => {
        const { result } = renderHook(() => useDiaryStore());
        await waitFor(() => expect(result.current.isLoaded).toBe(true));

        const date = '2023-01-01';

        act(() => {
            result.current.addEntry(date, 'Prompt', 'Body');
        });

        const entryId = result.current.getEntries(date)[0].id;

        act(() => {
            result.current.removeEntry(date, entryId);
        });

        expect(result.current.getEntries(date)).toHaveLength(0);
        expect(result.current.hasEntry(date)).toBe(false);
    });

    it('should persist data to localStorage', async () => {
        const { result } = renderHook(() => useDiaryStore());
        await waitFor(() => expect(result.current.isLoaded).toBe(true));

        const date = '2023-01-01';

        act(() => {
            result.current.addEntry(date, 'Prompt', 'Body');
        });

        // Verify setItem was called
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            STORAGE_KEY,
            expect.stringContaining('Body')
        );
    });

    it('should load data from localStorage on init', async () => {
        // Setup initial data in localStorage
        const initialData = {
            '2023-01-01': [{
                id: 'test-id',
                date: '2023-01-01',
                prompt: 'Initial Prompt',
                body: 'Initial Body',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }]
        };
        localStorageMock.getItem.mockReturnValue(JSON.stringify(initialData));

        const { result } = renderHook(() => useDiaryStore());
        await waitFor(() => expect(result.current.isLoaded).toBe(true));

        expect(result.current.getEntries('2023-01-01')).toHaveLength(1);
        expect(result.current.getEntries('2023-01-01')[0].body).toBe('Initial Body');
    });
});
