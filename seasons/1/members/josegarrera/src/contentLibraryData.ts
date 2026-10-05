import contentSource from '../../../data/content.json';

import type { ContentItem } from './contentItem';

export function loadContentItems(): ContentItem[] {
    return contentSource.items.map(
        ({ id, title, type, excerpt, url, publishedAt }) => ({
            id,
            title,
            type,
            excerpt,
            url,
            publishedAt,
        }),
    );
}
