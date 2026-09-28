// The maintainer-owned half of the repo. Member apps get their own
// eslint.config.mjs from the starter, which re-exports the shared default.
import { createConfig } from '@withnik/configs/eslint';

export default createConfig(['configs/**/*.{ts,tsx}', 'scripts/**/*.mjs']);
