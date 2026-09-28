// The one place Primer is bootstrapped. Both the app entry (src/main.tsx)
// and the Playwright gallery wrap with this, so a component under test
// renders exactly as it does in the app.
import '@primer/primitives/dist/css/primitives.css';
import '@primer/primitives/dist/css/functional/themes/light.css';

import { BaseStyles, ThemeProvider } from '@primer/react';
import { StrictMode, type ReactNode } from 'react';

// Primer's theme CSS is keyed on attributes, not classes. They must be on
// <html>, not just on ThemeProvider's wrapper div, because overlays
// (ActionMenu, SelectPanel, Dialog) portal to <body> and would otherwise
// render with no colour tokens at all.
document.documentElement.dataset.colorMode = 'light';
document.documentElement.dataset.lightTheme = 'light';
document.documentElement.dataset.darkTheme = 'dark';

export function PrimerRoot({ children }: { children: ReactNode }) {
    return (
        <StrictMode>
            <ThemeProvider colorMode="day">
                <BaseStyles>{children}</BaseStyles>
            </ThemeProvider>
        </StrictMode>
    );
}
