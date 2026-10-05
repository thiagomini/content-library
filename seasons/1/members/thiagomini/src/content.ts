import content from '../../../data/content.json';

export interface ContentItem {
    id: string;
    title: string;
    type: string;
    url: string;
    publishedAt: string;
    excerpt: string;
    durationSeconds: number | null;
    thumbnailUrl: string | null;
}

const items: readonly ContentItem[] = content.items;

export const contentItems = [...items].sort((firstItem, secondItem) =>
    secondItem.publishedAt.localeCompare(firstItem.publishedAt),
);
