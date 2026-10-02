#!/usr/bin/env node
// Creates a member's app folder from the season starter.
//
//   npm run new-member <github-handle> [season]
//
// Copies seasons/<season>/starter → seasons/<season>/members/<handle>,
// renames the package, assigns the folder to <handle> in .github/CODEOWNERS,
// and installs so the workspace links it. Commit the result together with
// the updated package-lock.json and .github/CODEOWNERS.

import {
    appendFileSync,
    cpSync,
    existsSync,
    mkdirSync,
    readFileSync,
    writeFileSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const [handle, season = '1'] = process.argv.slice(2);

if (!handle || !/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(handle)) {
    console.error('Usage: npm run new-member <github-handle> [season]');
    process.exit(1);
}

const seasonDir = join('seasons', season);
const starter = join(seasonDir, 'starter');
const target = join(seasonDir, 'members', handle);

if (!existsSync(starter)) {
    console.error(`No starter at ${starter}`);
    process.exit(1);
}
if (existsSync(target)) {
    console.error(`${target} already exists`);
    process.exit(1);
}

const SKIP = new Set([
    'node_modules',
    'dist',
    'test-results',
    'playwright-report',
]);
cpSync(starter, target, {
    recursive: true,
    filter: (src) => !SKIP.has(src.split(/[\\/]/).pop()),
});

const pkgPath = join(target, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
pkg.name = `@content-library/${handle.toLowerCase()}`;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 4)}\n`);

const CODEOWNERS = join('.github', 'CODEOWNERS');
// CODEOWNERS patterns use forward slashes regardless of the OS.
const ownerLine = `/seasons/${season}/members/${handle}/ @${handle}`;
const owners = existsSync(CODEOWNERS) ? readFileSync(CODEOWNERS, 'utf8') : '';
if (!owners.split('\n').some((line) => line.trim() === ownerLine)) {
    mkdirSync('.github', { recursive: true });
    const separator = owners && !owners.endsWith('\n') ? '\n' : '';
    appendFileSync(CODEOWNERS, `${separator}${ownerLine}\n`);
}

execFileSync('npm', ['install'], { stdio: 'inherit' });

console.log(
    `\nCreated ${target}. Commit it with package-lock.json and ${CODEOWNERS}.`,
);
