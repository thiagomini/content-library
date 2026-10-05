import { expect, test } from '@withnik/configs/playwright';

test('renders every content item ordered from newest to oldest', async ({
    mount,
}) => {
    const app = await mount('App/Default');

    const heading = app.getByRole('heading', { name: 'Content Library' });
    await expect(heading).toBeVisible();

    const items = app.getByRole('listitem');
    await expect(items).toHaveCount(40);
    await expect(items.first()).toContainText('Building real apps together');
    await expect(items.first()).toContainText('blueprint');

    const titleLink = items
        .first()
        .getByRole('link', { name: 'Building real apps together' });
    await expect(titleLink).toHaveAttribute(
        'href',
        'https://better.withnik.com/c/general-discussions/building-real-apps-together',
    );
    await expect(titleLink).toHaveAttribute('target', '_blank');

    const contentButton = items
        .first()
        .getByRole('link', { name: 'View content' });
    await expect(contentButton).toHaveAttribute(
        'href',
        'https://better.withnik.com/c/general-discussions/building-real-apps-together',
    );
});
