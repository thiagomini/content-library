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

test('renders no content items when empty', async ({ mount }) => {
    const dashboard = await mount('ContentDashboard/Empty');

    await expect(dashboard.getByRole('listitem')).toHaveCount(0);
});
