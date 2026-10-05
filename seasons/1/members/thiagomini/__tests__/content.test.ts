import { describe, expect, it } from 'vitest';
import { contentItems } from '../src/content';

describe('contentItems', () => {
    it('includes every fixture item ordered from newest to oldest', () => {
        expect(contentItems).toHaveLength(40);

        expect(contentItems.map((item) => item.publishedAt)).toEqual(
            [...contentItems]
                .map((item) => item.publishedAt)
                .sort((firstDate, secondDate) =>
                    secondDate.localeCompare(firstDate),
                ),
        );
    });

    it('preserves the fields required to render a content item', () => {
        expect(contentItems[0]).toMatchObject({
            title: 'Building real apps together',
            type: 'blueprint',
            publishedAt: '2026-09-25',
            excerpt: expect.any(String),
            url: expect.any(String),
        });
    });
});
