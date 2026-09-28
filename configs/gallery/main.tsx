// Playwright integration-testing gallery — implements the contract the
// built-in `mount()` fixture drives (window.mount / window.unmount, #root).
//
// Members never see this file. The shared Vite config serves it at
// /playwright/gallery/index.html from each member's own dev server.
//
// Stories: any `__tests__/**/*.story.tsx` in the member's app, next to the
// specs that mount them. Each named export is one story. Id = path under
// __tests__/ without `.story.tsx`, plus the export name:
//   __tests__/components/ContentList.story.tsx  export `Empty`
//     → mount('components/ContentList/Empty')   or just 'ContentList/Empty'
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import type { ComponentType } from 'react';
import { PrimerRoot } from '../primer.tsx';

type StoryProps = Record<string, unknown>;

// Leading "/" = the Vite project root, i.e. the member's own directory.
// That is what lets one shared gallery serve every member.
// Props are whatever mount() passed, so stories are typed loosely here.
const stories = import.meta.glob<Record<string, ComponentType<StoryProps>>>(
    '/__tests__/**/*.story.tsx',
);

// The app's Tailwind entry. Only its own entry module imports it, so without
// this stories would render unstyled. Globbed rather than imported so an app
// that has no index.css still works.
import.meta.glob('/src/index.css', { eager: true });

const toId = (file: string) =>
    file.replace(/^\/__tests__\//, '').replace(/\.story\.tsx$/, '');

async function resolve(storyId: string) {
    const sep = storyId.lastIndexOf('/');
    const path = storyId.slice(0, sep);
    const name = storyId.slice(sep + 1);
    const entry = Object.entries(stories).find(
        ([file]) => toId(file) === path || toId(file).endsWith(`/${path}`),
    );
    if (!entry) return undefined;
    const mod = await entry[1]();
    return mod[name] ?? mod.default;
}

const rootEl = document.getElementById('root')!;
let root: Root | undefined;

declare global {
    interface Window {
        mount: (params: { story: string; props?: StoryProps }) => Promise<void>;
        unmount: () => Promise<void>;
    }
}

window.mount = async ({ story, props }) => {
    const Story = await resolve(story);
    if (!Story) {
        const known = Object.keys(stories).map(toId).join(', ') || 'none';
        throw new Error(
            `Unknown story "${story}". Story files found: ${known}`,
        );
    }
    // Applied before the first render, so the story reads the URL the test
    // asked for rather than the gallery's own address.
    if (window.__storyPath) {
        window.history.replaceState(null, '', window.__storyPath);
    }
    // Reuse the root so component.update(props) reconciles and keeps state.
    root ??= createRoot(rootEl);
    // flushSync so a render error rejects mount() instead of being swallowed.
    flushSync(() =>
        root!.render(
            <PrimerRoot>
                <Story {...props} />
            </PrimerRoot>,
        ),
    );
};

window.unmount = async () => {
    root?.unmount();
    root = undefined;
};
