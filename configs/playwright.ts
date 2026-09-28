import {
    defineConfig,
    devices,
    expect,
    test as base,
    type Locator,
} from '@playwright/test';

export const GALLERY = 'http://localhost:5173/playwright/gallery/index.html';

// Integration testing is built into @playwright/test (1.63+). `mount(storyId)`
// is a built-in fixture that drives the gallery page served by the member's
// own Vite dev server. No @playwright/experimental-ct-react.
//
// Paths (testDir, webServer cwd) resolve against the member's directory,
// because that is where the re-exporting playwright.config.ts lives.
export default defineConfig({
    testDir: './__tests__',
    testMatch: '**/*.spec.ts',

    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI
        ? [['github'], ['html', { open: 'never' }]]
        : [['list']],

    use: {
        ...devices['Desktop Chrome'],
        baseURL: GALLERY,

        // Stops a cached service worker shadowing page.route() mocks.
        serviceWorkers: 'block',

        // One browser context across tests in a worker — a large speedup.
        // Consequence: localStorage and cookies persist between tests.
        // Increment 4 persists the view mode, so tests that assume a cold
        // start must clear it (see __tests__/App.spec.ts).
        reuseContext: true,

        trace: 'on-first-retry',
    },

    projects: [{ name: 'integration' }],

    webServer: {
        command: 'npm run dev',
        url: GALLERY,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },
});

export type StoryProps = Record<string, unknown>;

export type MountOptions = {
    /**
     * URL the app should start on, for example `/?type=post`. Applied with
     * history.replaceState before the story's first render, so "restores
     * state from the URL" behaviour is testable without a second navigation.
     */
    path?: string;
    /** Plain, serializable props handed to the story. */
    props?: StoryProps;
};

export type MountedStory = Locator & {
    update(props?: StoryProps): Promise<void>;
    unmount(): Promise<void>;
};

type Mount = (storyId: string, options?: MountOptions) => Promise<MountedStory>;

// The built-in fixture forwards a story id and props only, and it navigates
// to baseURL on every call — so a URL set on the page beforehand would be
// thrown away. An init script runs before the gallery's own code on that
// navigation instead, and the last one added wins, which is exactly the
// "most recent mount() call decides" semantics we want.
declare global {
    interface Window {
        // Written by the init script below; the gallery applies it before the
        // story's first render.
        __storyPath?: string | null;
    }
}

export const test = base.extend<{ mount: Mount }>({
    mount: async ({ page, mount }, use) => {
        const mountStory = mount as unknown as (
            storyId: string,
            props?: StoryProps,
        ) => Promise<MountedStory>;

        const mountAtPath: Mount = async (storyId, { path, props } = {}) => {
            await page.addInitScript((value) => {
                window.__storyPath = value;
            }, path ?? null);

            return mountStory(storyId, props);
        };

        // This is Playwright's fixture `use()`, not React's `use` hook.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        await use(mountAtPath as never);
    },
});

export { expect };
