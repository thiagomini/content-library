import { afterEach, describe, expect, it, vi } from 'vitest';

import { formatPublishedAt } from '../src/contentItem';

describe('The published date', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('reads as a month, day and year', () => {
        const formatted = formatPublishedAt('2026-04-02');

        expect(formatted).toBe('Apr 2, 2026');
    });

    it('keeps the calendar day west of Greenwich', () => {
        vi.stubEnv('TZ', 'Pacific/Honolulu');

        const formatted = formatPublishedAt('2026-04-02');

        expect(formatted).toBe('Apr 2, 2026');
    });
});
