import { describe, expect, it } from 'vitest';

import { loadContentItems } from '../src/contentLibraryData';

describe('The data source', () => {
    it('provides every content item', () => {
        const items = loadContentItems();

        expect(items).toHaveLength(40);
    });
});
