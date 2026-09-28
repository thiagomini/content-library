import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

// Flat-config globs resolve against the directory of the `eslint.config.mjs`
// that re-exports this, so the caller passes its own sources: an app keeps
// them in src/ and tests/, the repo root in configs/ and scripts/.
export function createConfig(files: string[]) {
    return tseslint.config(
        { ignores: ['**/dist', '**/test-results', '**/playwright-report'] },
        {
            extends: [js.configs.recommended, ...tseslint.configs.recommended],
            files,
            plugins: {
                'react-hooks': reactHooks,
                'react-refresh': reactRefresh,
            },
            rules: {
                ...reactHooks.configs.recommended.rules,
                'react-hooks/purity': 'off',
                'no-useless-assignment': 'off',
                'react-refresh/only-export-components': [
                    'warn',
                    { allowConstantExport: true },
                ],
            },
        },
    );
}

// What a member's app contains: units beside the code, Playwright specs in
// __tests__/, and the one-line config re-exports at its root.
export default createConfig([
    'src/**/*.{ts,tsx}',
    '__tests__/**/*.{ts,tsx}',
    '*.config.ts',
]);
