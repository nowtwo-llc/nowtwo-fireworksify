# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fireworksify is a lightweight (~2.5k gzipped) browser library that adds animated fireworks effects to websites. Standalone TypeScript, zero runtime dependencies, owned by NowTwo LLC.

Published as `@nowtwo-llc/fireworksify` to **two registries**:

| Registry | Role |
| --- | --- |
| npm (`registry.npmjs.org`) | Public. This is what consumers install and the only one the README documents. |
| GitHub Packages | Internal backup mirror. Not user-facing — do not document it in the README. |

Both the npm org and the GitHub org are named `nowtwo-llc`, so one package name publishes to both with no rewriting.

Publishing to npm does **not** create a GitHub Package; the registries are unrelated, which is why the mirror job exists.

The repo is being prepared to go public. All naming, metadata, copyright and documentation must stay under NowTwo LLC; do not reintroduce references to prior owners of this code.

## Build & Development Commands

```bash
npm run build:dev       # Development UMD build → ./build
npm run build:prod      # UMD + ESM + CJS bundles and types → ./dist
npm run build:types     # Declarations only → ./dist/types
npm run watch           # Development build with file watching
npm test                # Vitest suite (jsdom)
npm run test:watch      # Vitest in watch mode
npm run typecheck       # tsc over the library and the tests
npm run lint            # ESLint + Stylelint
npm run eslint          # ESLint with autofix
npm run stylelint       # Stylelint
npm run clean           # Remove build/ and dist/
```

## Architecture

The library is one file: `src/Fireworksify.ts`, with `src/Fireworksify.css` for styling and keyframe animations.

`src/bundle.ts` is the webpack entry. It exists **only** to add the stylesheet side-effect import so `MiniCssExtractPlugin` emits the CSS. Keep that import out of `Fireworksify.ts` — a declaration file carrying `import './Fireworksify.css'` resolves to `dist/types/Fireworksify.css` for consumers, which does not exist and breaks their typecheck.

**Three internal classes:**
- **`Fireworksify`** (exported) — Main controller. Owns the animation loop (`setInterval` at 5ms), the seed/particle arrays and the DOM container. Public API: `start()`, `generate(x, y)`, `destroy()`.
- **`FireworkSeed`** — Projectile that launches upward. Its `seedConfig` controls whether it explodes at apex, whether it is destroyed, and its CSS class.
- **`FireworkParticle`** — Explosion particle. Created in bursts of 72 (every 5 degrees) by `newFireworkStar()`.

**Physics:** time-delta simulation with gravity (0.0005), air resistance (0.0005) and velocity scaling (0.3). Elements leave the DOM when their timer expires or they exit the viewport.

**Custom events** dispatched on `document`: `he:fireworksify:start` and `he:fireworksify:stop`.

When no seeds are configured, `newFireworkSeed()` falls back to `DEFAULT_SEED`. Without that fallback the documented `new Fireworksify({ duration: 10 }).start()` throws on an empty seed array.

## Distribution

`package.json` ships four artifacts through an `exports` map:

| Condition | File |
| --- | --- |
| `import` | `dist/fireworksify.mjs` |
| `require` | `dist/fireworksify.cjs` |
| `types` | `dist/types/Fireworksify.d.ts` |
| `unpkg` / script tag | `dist/fireworksify.min.js` (UMD, exposes the `Fireworksify` global) |
| `./style.css` | `dist/fireworksify.css` |

The CSS is always a separate file — it is never inlined into the JavaScript, so consumers must import the stylesheet themselves.

`dist/` and `build/` are gitignored. `prepublishOnly` rebuilds `dist/` so published output always matches the tagged source.

## Build System

Webpack 5 with `ts-loader`. `webpack.config.js` exports a single UMD config in development and an array of three configs (UMD, ESM, CJS) in production.

Things that are load-bearing and easy to break:

- **`target: ['web', 'es5']` plus an explicit `output.environment`.** Without these, webpack's own runtime emits `const`/`let` and silently breaks the ES5 promise. The ESM config needs `module: true` in its environment, so it sets the ES5 flags individually rather than using the `es5` target.
- **The CJS config uses `src/Fireworksify.ts` as its entry, not `src/bundle.ts`.** Bundling the CSS import there pulls in webpack's automatic-publicPath runtime, which throws outside a browser and breaks `require()` at load time.
- **`onlyCompileBundledFiles: true` on ts-loader.** `tsconfig.json` is scoped to `src`, but this keeps the bundle compile limited to what the entry reaches.
- **Declarations are emitted once** by `tsc -p tsconfig.types.json`; ts-loader has `declaration: false` so three compilers don't race to write the same files.
- Cleaning is done by the npm scripts (`rm -rf`), not a webpack plugin — three configs writing to one directory would delete each other's output.

## TypeScript setup

Three configs, deliberately:

- `tsconfig.json` — the library. ES5 target, node10 resolution, strict (TS 6 default). Covers `src` only.
- `tsconfig.test.json` — the tests and `vitest.config.mts`. Modern target and `bundler` resolution, because Vitest's declarations use private identifiers and `exports` subpaths that the ES5/node10 config cannot resolve.
- `tsconfig.types.json` — declaration-only emit, `src/Fireworksify.ts` alone.

**TypeScript is pinned to `^6.0.3` on purpose.** TypeScript 7 is the native Go port; it does not expose the JS compiler API, so `ts-loader` (which calls `createProgram`/`createLanguageService`) breaks entirely. Before any TS 7 move, `target: es5` and `moduleResolution: node` must be migrated — `ignoreDeprecations: "6.0"` stops working there.

## Testing

Vitest on jsdom. The suite imports from `src/`, so no build is needed to run tests.

The library runs on a 5ms `setInterval` and `Date.now()` deltas, so tests use `vi.useFakeTimers()` and advance time explicitly. Never add real-time waits — the Karma suite this replaced took ~20s for the same 38 tests.

Assertions are chai-style (`expect(x).to.equal(y)`), which Vitest supports natively since its `expect` is built on chai. `@typescript-eslint/no-unused-expressions` is disabled for `tests/**` because those assertions are bare expressions.

## Code Style

- Prettier: 120 char width, 4-space indent, single quotes, no trailing commas, always arrow parens.
- ESLint flat config (`eslint.config.mjs`) using `typescript-eslint` with type-checked rules, plus `globals`. There is no `.eslintrc` — ESLint 10 removed support for it.
- Stylelint via `stylelint-prettier`. Note that Stylelint 15/16 removed the stylistic rules; don't re-add rules like `media-feature-colon-space-after` — Prettier owns formatting.

## CI

- `ci.yml` — typecheck, lint, test, build, `npm pack --dry-run` on pushes and PRs to `main`.
- `publish.yml` — on `v*` tags. Verifies the tag matches `package.json`, then publishes in two jobs: npm first via OIDC trusted publishing (no token; needs `id-token: write`, Node >= 22.14.0 and npm >= 11.5.1, so it upgrades npm because setup-node ships 10.x), then the GitHub Packages backup with `GITHUB_TOKEN`. The mirror job `needs: npm`, so a failed npm publish stops it.
- `pages.yml` — deploys `example/` plus `dist/` to GitHub Pages. The demo is served at `/example/` so its `../dist/...` paths resolve the same way they do locally.
