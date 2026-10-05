import { describe, expect, it } from 'vitest';

import { formatPublishedAt } from '../src/contentItem';

describe('The published date', () => {
    it('reads as a month, day and year', () => {
        const formatted = formatPublishedAt('2026-04-02');

        expect(formatted).toBe('Apr 2, 2026');
    });
});
