# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fireworksify is a lightweight (~2.5k gzipped) browser library that adds animated fireworks effects to websites. It's a standalone TypeScript library with zero runtime dependencies, published as `@classifylearning/fireworksify` to GitHub Packages.

## Build & Development Commands

```bash
npm run build:dev       # Development build → ./build/fireworksify.js + .css
npm run build:prod      # Production build → ./dist/fireworksify.min.js + .min.css
npm run watch           # Dev build with file watching
npm test                # Full pipeline: build → unit tests
npm run test:unit       # Unit tests only (Karma + Mocha + Chai in ChromeHeadless)
npm run eslint          # ESLint with auto-fix
npm run eslint:format   # Prettier + ESLint formatting on src/
npm run clean           # Remove build artifacts
```

## Architecture

The entire library lives in a single file: `src/Fireworksify.ts` (with `src/Fireworksify.css` for styling/animations).

**Three internal classes:**
- **`Fireworksify`** (exported) — Main controller. Manages animation loop (`setInterval` at 5ms), seed/particle arrays, and the DOM container. Public API: `start()` for timed displays, `generate(x, y)` for single fireworks, `destroy()` for cleanup.
- **`FireworkSeed`** — A projectile that launches upward. Has a configurable `seedConfig` controlling whether it explodes at apex, gets destroyed, and its CSS class.
- **`FireworkParticle`** — Individual explosion particle. Created in bursts of 72 (every 5 degrees) by `newFireworkStar()`.

**Physics:** Simple time-delta simulation with gravity (0.0005), air resistance (0.0005), and velocity scaling (0.3). Elements are removed from DOM when their timer expires or they leave the viewport.

**Custom events** dispatched on `document`: `he:fireworksify:start` and `he:fireworksify:stop`.

## Build System

Webpack 5 with TypeScript (`ts-loader`). Output is UMD format. Development builds go to `./build/`, production builds to `./dist/`. CSS is extracted via `MiniCssExtractPlugin`. Production uses `TerserPlugin` for minification.

Environment config is loaded from `env.development.json` / `env.production.json`.

## Code Style

- Prettier: 120 char width, 4-space indent, single quotes, no trailing commas, always arrow parens
- ESLint: Airbnb-based config with TypeScript and Prettier integration
- Stylelint for CSS
