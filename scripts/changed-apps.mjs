#!/usr/bin/env node
// Emits the app directories CI must test for this push/PR, as a matrix.
//
//   node scripts/changed-apps.mjs <base-ref>
//
// - A member PR touching seasons/1/members/anna/** → just anna's app.
// - A change to shared infra (configs/, the starter, root package.json,
//   lockfile, scripts, workflows) can break everyone → the starter plus
//   every member app.
//
// Outputs to $GITHUB_OUTPUT:
//   apps    = ["seasons/1/members/anna", ...]
//   any     = "true" | "false"
//   targets = [".", "seasons/1/members/anna", ...]
//
// `targets` is `apps` with the repo root prepended, for the tsc matrix.
// TypeScript is per-project: the root script checks configs/ only, and each
// app resolves its own tsconfig, so one matrix over `targets` covers both.
// The root entry also keeps the matrix non-empty when no app changed.
// ESLint needs no such fan-out — v10 resolves each file's config from the
// nearest ancestor eslint.config.mjs, so one root run lints every app.

import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SEASON = 'seasons/1';
const MEMBERS = `${SEASON}/members`;
const STARTER = `${SEASON}/starter`;

const INFRA = [
    'configs/',
    `${STARTER}/`,
    'scripts/',
    '.github/',
    'package.json',
    'package-lock.json',
];

const baseRef = process.argv[2] ?? 'origin/main';

// A base we cannot diff against tells us nothing about what changed: a
// branch's first push sends an all-zero SHA, a force-push or a shallow clone
// can leave the old tip unreachable. Fail open and check everything — silently
// skipping every app job is the one outcome worse than doing extra work.
let files;
try {
    files = execFileSync('git', ['diff', '--name-only', `${baseRef}...HEAD`], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
    })
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
} catch {
    console.error(
        `Cannot diff against "${baseRef}"; assuming shared infra changed.`,
    );
    files = null;
}

const allMembers = () =>
    existsSync(MEMBERS)
        ? readdirSync(MEMBERS, { withFileTypes: true })
              .filter((d) => d.isDirectory())
              .map((d) => join(MEMBERS, d.name))
        : [];

const infraChanged =
    files === null ||
    files.some((file) =>
        INFRA.some((path) => file === path || file.startsWith(path)),
    );

const apps = new Set();

if (infraChanged) {
    apps.add(STARTER);
    for (const dir of allMembers()) apps.add(dir);
} else {
    for (const file of files) {
        const match = file.match(new RegExp(`^(${MEMBERS}/[^/]+)/`));
        if (match && existsSync(match[1])) apps.add(match[1]);
    }
}

const list = [...apps].sort();
const output = [
    `apps=${JSON.stringify(list)}`,
    `any=${list.length > 0}`,
    `targets=${JSON.stringify(['.', ...list])}`,
].join('\n');

console.log(output);
if (process.env.GITHUB_OUTPUT)
    appendFileSync(process.env.GITHUB_OUTPUT, `${output}\n`);
