import { expect, test } from '@withnik/configs/playwright';

test('sorts supplied content from newest to oldest', async ({ mount }) => {
    const dashboard = await mount('ContentDashboard/WithThreeItems');
    const items = dashboard.getByRole('listitem');

    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toContainText('Newest content');
    await expect(items.nth(0)).toContainText('Jun 30, 2026');
    await expect(items.nth(1)).toContainText('Middle content');
    await expect(items.nth(2)).toContainText('Oldest content');
});

test('Display each content item', async ({ mount }) => {
    const dashboard = await mount('ContentDashboard/WithSingleItem');
    const item = dashboard.getByRole('listitem');
    const contentUrl = 'https://example.com/testing-content';

    await expect(item).toHaveCount(1);
    await expect(item.getByRole('link', { name: 'Testing content' })).toHaveAttribute(
        'href',
        contentUrl,
    );
    await expect(item).toContainText('Learn how to write reliable tests.');
    await expect(item).toContainText('article');
    await expect(item).toContainText('Apr 13, 2026');
    await expect(item.getByRole('link', { name: 'View content' })).toHaveAttribute(
        'href',
        contentUrl,
    );
});

test('renders no content items when empty', async ({ mount }) => {
    const dashboard = await mount('ContentDashboard/Empty');

    await expect(dashboard.getByRole('listitem')).toHaveCount(0);
});
