# Contributing to Fireworksify

Thanks for taking the time to contribute.

## Getting set up

Requires Node 20 or newer.

```bash
git clone git@github.com:nowtwo-llc/nowtwo-fireworksify.git
cd nowtwo-fireworksify
npm install
```

## Development workflow

```bash
npm run watch        # rebuild ./build on change
npm run test:watch   # re-run the suite on change
```

To see a change in a real browser, run `npm run build:prod` and open `example/index.html`. It loads the built files from `../dist/`, which is the same layout the demo is deployed with.

## Before opening a pull request

Run the same checks CI does:

```bash
npm run typecheck
npm run lint
npm test
npm run build:prod
```

`npm run lint` autofixes what it can. Formatting is Prettier's job via `eslint-plugin-prettier` and `stylelint-prettier` — please don't hand-format around it.

## Conventions

- **Source lives in one file.** `src/Fireworksify.ts` holds the whole library; `src/bundle.ts` exists only to pull the stylesheet into the webpack graph and must stay out of the generated declarations.
- **The library is strict-mode TypeScript.** `tsconfig.json` targets ES5 with node10 module resolution because it ships to browsers. The tests type-check under `tsconfig.test.json`, which uses a modern target and resolver for Vitest's types.
- **ES5 output is deliberate.** `webpack.config.js` pins `target: ['web', 'es5']` and an explicit `output.environment` so webpack's own runtime cannot introduce `const`/`let`/arrow functions. If you change the target, change it in both the tsconfig and the webpack config.
- **Tests run on jsdom with fake timers.** The library is driven by a 5ms `setInterval` and `Date.now()` deltas, so tests advance time with `vi.advanceTimersByTime()` rather than waiting.

## Releasing

Releases publish to GitHub Packages from CI:

1. Bump `version` in `package.json`.
2. Commit, then tag: `git tag v3.1.0 && git push --tags`.

The publish workflow verifies the tag matches `package.json`, runs the full check suite, and publishes. `prepublishOnly` rebuilds `dist/` from the tagged source, so build output never needs to be committed.
