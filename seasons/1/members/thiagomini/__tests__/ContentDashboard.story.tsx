import { ContentDashboard } from '../src/ContentDashboard';
import type { ContentItem } from '../src/ContentDashboardService';

const threeItems = [
    {
        id: 'middle',
        title: 'Middle content',
        type: 'lesson',
        url: 'https://example.com/middle',
        publishedAt: '2026-03-15',
        excerpt: 'Published in the middle.',
        durationSeconds: null,
        thumbnailUrl: null,
    },
    {
        id: 'oldest',
        title: 'Oldest content',
        type: 'lesson',
        url: 'https://example.com/oldest',
        publishedAt: '2026-01-01',
        excerpt: 'Published first.',
        durationSeconds: null,
        thumbnailUrl: null,
    },
    {
        id: 'newest',
        title: 'Newest content',
        type: 'lesson',
        url: 'https://example.com/newest',
        publishedAt: '2026-06-30',
        excerpt: 'Published last.',
        durationSeconds: null,
        thumbnailUrl: null,
    },
] satisfies readonly ContentItem[];

const singleItem = [
    {
        id: 'testing-content',
        title: 'Testing content',
        type: 'article',
        url: 'https://example.com/testing-content',
        publishedAt: '2026-04-13',
        excerpt: 'Learn how to write reliable tests.',
        durationSeconds: null,
        thumbnailUrl: null,
    },
] satisfies readonly ContentItem[];

export const WithThreeItems = () => (
    <ContentDashboard items={threeItems} locale="en-US" />
);

export const WithSingleItem = () => (
    <ContentDashboard items={singleItem} locale="en-US" />
);

export const Empty = () => <ContentDashboard items={[]} />;
