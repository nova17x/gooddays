import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { db } from '@/lib/db';
import 'fake-indexeddb/auto';
import EntryPage from '@/app/entry/[date]/page';

// Mock useParams
vi.mock('next/navigation', () => ({
    useParams: () => ({ date: '2024-03-01' }),
    useRouter: () => ({ push: vi.fn() }),
}));

// Mock scrollIntoView for VList
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('Diary Flow Integration', () => {
    beforeEach(async () => {
        await db.entries.clear();
        vi.clearAllMocks();
    });

    it('should create and display a new diary entry', async () => {
        const user = userEvent.setup();
        render(<EntryPage />);

        // 1. Initial state: No entry
        expect(await screen.findByText('この日の日記はまだありません')).toBeDefined();

        // 2. Click "Free Write" (from PromptChips)
        const chips = screen.getByText('✏️ 自由に書く');
        await user.click(chips);

        // 3. Type in editor
        const textarea = screen.getByRole('textbox');
        await user.type(textarea, 'Integration test body');

        // 4. Save
        const saveButton = screen.getByText('保存する');
        await user.click(saveButton);

        // 5. Verify entry is displayed
        await waitFor(() => {
            expect(screen.getByText('Integration test body')).toBeDefined();
        });

        // 6. Verify data in DB
        const entries = await db.entries.toArray();
        expect(entries).toHaveLength(1);
        expect(entries[0].body).toBe('Integration test body');
    });
});
