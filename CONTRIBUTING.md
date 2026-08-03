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

To see a change in a real browser, run `npm run demo`. It builds and serves at <http://localhost:5050> (`PORT=…` to change it), mirroring the deployed layout so the page's relative `../dist/` paths resolve exactly as they do on GitHub Pages. Opening `example/index.html` directly works too, but only after a build.

## Before opening a pull request

Run the same checks CI does:

```bash
npm run typecheck
npm run lint
npm test
npm run build:prod
```

`npm run lint` autofixes what it can. Formatting is Prettier's job — run `npm run format` rather than hand-formatting around it. CSS formatting goes through `stylelint-prettier`.

## Conventions

- **Source lives in one file.** `src/Fireworksify.ts` holds the whole library; `src/bundle.ts` exists only to pull the stylesheet into the webpack graph and must stay out of the generated declarations.
- **The library is strict-mode TypeScript 7.** `tsconfig.json` targets ES2020 with `bundler` module resolution. The tests type-check under `tsconfig.test.json`, which only adds Node types and `noEmit`.
- **ES2020 is set in three places** and they must move together: `target` in `tsconfig.json`, `target` on the esbuild-loader rule, and `BUILD_TARGET` in `webpack.config.js`. Webpack's own runtime wrapper follows the last one, so a mismatch silently ships syntax the tsconfig promised not to.
- **esbuild does not type-check.** It only strips types, so `npm run build` will not fail on a type error — `npm run typecheck` is the gate, and CI runs it before building.
- **Tests run on jsdom with fake timers.** The library is driven by a 5ms `setInterval` and `Date.now()` deltas, so tests advance time with `vi.advanceTimersByTime()` rather than waiting.

## Releasing

Releases publish to GitHub Packages from CI:

1. Bump `version` in `package.json`.
2. Commit, then tag: `git tag v3.1.0 && git push --tags`.

The publish workflow verifies the tag matches `package.json`, runs the full check suite, and publishes. `prepublishOnly` rebuilds `dist/` from the tagged source, so build output never needs to be committed.
