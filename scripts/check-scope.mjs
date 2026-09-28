#!/usr/bin/env node
// Enforces "stay in your own directory". CODEOWNERS routes reviews; it does
// not stop anyone editing another member's app or the shared infra.
//
//   node scripts/check-scope.mjs <base-ref>
//
// Fails when a PR touches more than one member directory, or touches
// anything outside seasons/<n>/members/. The maintainer's PRs are expected
// to touch shared paths, so they skip the check.

import { execFileSync } from 'node:child_process';

const MEMBERS = 'seasons/1/members';
const MAINTAINER = 'niksumeiko';

const baseRef = process.argv[2] ?? 'origin/main';
const author = process.env.PR_AUTHOR ?? process.env.GITHUB_ACTOR ?? '';

if (author === MAINTAINER) {
    console.log(`Author is ${MAINTAINER} — scope check skipped.`);
    process.exit(0);
}

const files = execFileSync(
    'git',
    ['diff', '--name-only', `${baseRef}...HEAD`],
    {
        encoding: 'utf8',
    },
)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const problems = [];
const memberDirs = new Set();
const outside = [];

for (const file of files) {
    const match = file.match(new RegExp(`^${MEMBERS}/([^/]+)/`));
    if (match) memberDirs.add(match[1]);
    else outside.push(file);
}

if (memberDirs.size > 1) {
    problems.push(
        `Touches ${memberDirs.size} member directories: ${[...memberDirs].join(', ')}. One PR, one directory.`,
    );
}

// Everything outside members/ is shared: configs, starter, data, briefs,
// lockfile. A lockfile change means a new dependency — that needs an issue.
if (outside.length > 0) {
    problems.push(
        `Touches maintainer-owned paths:\n    ${outside.join('\n    ')}`,
    );
}

if (problems.length > 0) {
    console.error('Scope check failed:\n');
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error(
        '\nIf this change is intentional, open an issue rather than widening the PR.',
    );
    process.exit(1);
}

console.log(
    `Scope OK — ${files.length} file(s) in ${MEMBERS}/${[...memberDirs][0] ?? '(none)'}`,
);
