# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fireworksify is a lightweight (~2.5k gzipped) browser library that adds animated fireworks effects to websites. Standalone TypeScript, zero runtime dependencies, owned by NowTwo LLC.

Published as `@nowtwo-llc/fireworksify` to **two registries**:

| Registry | Role |
| --- | --- |
| npm (`registry.npmjs.org`) | Public. The only registry this package is published to. |

A GitHub Packages mirror was published previously and has been removed: it required an access
token even for public packages. Do not reintroduce it.

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
npm run lint            # oxlint + Prettier + Stylelint, with fixes
npm run lint:check      # same, no fixes — what CI runs
npm run format          # Prettier
npm run oxlint          # oxlint with autofix
npm run stylelint       # Stylelint
npm run demo            # Build, then serve the demo at http://localhost:5050
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

Webpack 5 with **esbuild-loader**. `webpack.config.js` exports a single UMD config in development and an array of three configs (UMD, ESM, CJS) in production.

Things that are load-bearing and easy to break:

- **esbuild-loader, not ts-loader.** TypeScript 7 is the native Go port and exposes no JS compiler API, so ts-loader (which calls `createProgram`/`createLanguageService`) cannot run against it at all. esbuild only strips types — it never type-checks and never emits declarations.
- **ES2020 lives in three places** and they must move together: `target` in `tsconfig.json`, `target` on the esbuild-loader rule, and `BUILD_TARGET` in `webpack.config.js`. Webpack's runtime wrapper follows the last one, so a mismatch silently ships syntax the tsconfig promised not to.
- **The CJS config uses `src/Fireworksify.ts` as its entry, not `src/bundle.ts`.** Bundling the CSS import there pulls in webpack's automatic-publicPath runtime, which throws outside a browser and breaks `require()` at load time.
- **Declarations are emitted once** by `tsc -p tsconfig.types.json`. esbuild cannot produce them.
- Cleaning is done by the npm scripts (`rm -rf`), not a webpack plugin — three configs writing to one directory would delete each other's output.

## TypeScript setup

Running **TypeScript 7** (the native Go port). Three configs:

- `tsconfig.json` — the library. ES2020 target, `bundler` resolution, strict. Covers `src` only.
- `tsconfig.test.json` — the tests and `vitest.config.mts`. Adds Node types and `noEmit`; target and resolution come from the base.
- `tsconfig.types.json` — declaration-only emit, `src/Fireworksify.ts` alone.

`tsc` does two jobs here and both are required: `npm run typecheck` is the **only** type gate (esbuild does not check types, so `npm run build` will happily bundle broken code), and `npm run build:types` is the only source of `.d.ts` files.

Do not reintroduce a second TypeScript via the `@typescript/typescript6` shim. It works, but two packages then ship a `tsc` binary and `node_modules/.bin/tsc` resolves non-deterministically by install order — a typecheck that silently runs the wrong compiler.

## Testing

Vitest on jsdom. The suite imports from `src/`, so no build is needed to run tests.

The library runs on a 5ms `setInterval` and `Date.now()` deltas, so tests use `vi.useFakeTimers()` and advance time explicitly. Never add real-time waits — the Karma suite this replaced took ~20s for the same 38 tests.

Assertions are chai-style (`expect(x).to.equal(y)`), which Vitest supports natively since its `expect` is built on chai. `no-unused-expressions` is disabled for `tests/**` because those assertions are bare expressions.

## Code Style

- Prettier: 120 char width, 4-space indent, single quotes, no trailing commas, always arrow parens.
- **oxlint** (`.oxlintrc.json`) rather than ESLint. typescript-eslint hard-refuses TypeScript 7 at runtime, and ESLint's own parser cannot read TypeScript without it; oxlint parses TS natively in Rust. The trade-off is no type-aware rules (`no-floating-promises` and friends) — `strict` under `tsc` carries that weight now.
- Stylelint via `stylelint-prettier`. Note that Stylelint 15/16 removed the stylistic rules; don't re-add rules like `media-feature-colon-space-after` — Prettier owns formatting.

## CI

- `ci.yml` — typecheck, lint, test, build, `npm pack --dry-run` on pushes and PRs to `main`.
- `publish.yml` — on `v*` tags. Verifies the tag matches `package.json`, then publishes to npm via OIDC trusted publishing (no token; needs `id-token: write`, Node >= 22.14.0 and npm >= 11.5.1, so it upgrades npm because setup-node ships 10.x).

Two things in the workflows are security controls, not style — do not "tidy" them away:

- **The npm job sets `environment: npm-publish`.** That environment carries required reviewers, so a `v*` tag queues a release for approval instead of publishing immediately. The name must stay identical to the Environment field on the npm trusted publisher; GitHub puts it in the OIDC claim and npm rejects a mismatch.
- **Every action is pinned to a full commit SHA** with the version in a trailing comment. Tags can be force-moved by a compromised action repo; SHAs cannot. Dependabot (`.github/dependabot.yml`) updates the pins. Never replace a SHA with `@v5` to make a diff cleaner.
- `pages.yml` — deploys `example/` plus `dist/` to GitHub Pages. The demo is served at `/example/` so its `../dist/...` paths resolve the same way they do locally.
