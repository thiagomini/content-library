# Content Library

A real app repo from [Better Engineering Community](https://www.withnik.com/community).  
Members work together building real apps.
The most effective way to learn architecture, design patterns, effective AI and testing — all the things that matter today.

## Setup

```sh
npm install
npx playwright install chromium   # once, for the integration tests
```

## Running tests

Run these **from inside an app folder**:

```sh
cd seasons/1/members/<handle>

npm run test:unit
npm run test:integration
npm run test:integration:headless
```

## Where tests go

Both layers live in the app's `__tests__/` folder:

- `*.test.ts` — Vitest.
- `*.spec.ts` — Playwright.
- `*.story.tsx` — the spec mounts, next to that test file. A named export is one scenario, and `mount('App/Default')` renders it. Start on a URL with `mount(id, { path: '/?search=x' })`.
