import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.ts';

// Merged from the Vite config so plugins are declared exactly once. A
// standalone Vitest config SHADOWS vite config rather than extending it —
// re-declaring plugins here is how JSX silently stops compiling under test.
export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            // Rendering belongs to Playwright, so units are plain logic and
            // need no DOM. Anything that touches the browser is a story.
            environment: 'node',

            // Both test layers live in __tests__/, split by extension:
            // *.test.ts is a unit, *.spec.ts is a Playwright integration
            // test. Collecting a spec here would fail on the `mount` fixture.
            include: ['__tests__/**/*.test.ts'],
            exclude: ['node_modules/**', 'dist/**'],

            // An app starts with no logic worth unit-testing; its first
            // increment is UI. Without this, `test:unit` fails on an empty
            // app instead of passing.
            passWithNoTests: true,
        },
    }),
);
