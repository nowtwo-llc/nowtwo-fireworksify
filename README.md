# Fireworksify

[![CI](https://github.com/nowtwo-llc/nowtwo-fireworksify/actions/workflows/ci.yml/badge.svg)](https://github.com/nowtwo-llc/nowtwo-fireworksify/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Ever wanted exploding fireworks on your website or app? Ever wanted images flying across the page with an exploding effect? Then this little project is for you.

Fireworksify adds something fun to your application for a very small footprint — roughly **2.5k gzipped**, with **zero runtime dependencies**. It is plain DOM and CSS animation, so there is no `<canvas>` and nothing to initialise beyond one constructor call.

**[Try the live demo →](https://nowtwo-llc.github.io/nowtwo-fireworksify/)**

## Installing

### From npm (GitHub Packages)

This package is published to GitHub Packages under the `@nowtwo-llc` scope. Point the scope at the GitHub registry in an `.npmrc` next to your `package.json`:

```ini
@nowtwo-llc:registry=https://npm.pkg.github.com
```

GitHub Packages requires authentication even for public packages, so you also need a personal access token with the `read:packages` scope:

```ini
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install:

```bash
npm install @nowtwo-llc/fireworksify
```

### From a script tag

Download `fireworksify.min.js` and `fireworksify.min.css` from the [latest release](https://github.com/nowtwo-llc/nowtwo-fireworksify/releases) and serve them yourself:

```html
<link rel="stylesheet" type="text/css" href="[CSS_FILE_PATH]/fireworksify.min.css" />
<script src="[JS_FILE_PATH]/fireworksify.min.js"></script>
```

The UMD build exposes `Fireworksify` as a browser global.

## Usage

The stylesheet is shipped separately from the JavaScript — **you must include it**, or the fireworks will have no size, colour or animation.

### ES modules

```js
import { Fireworksify } from '@nowtwo-llc/fireworksify';
import '@nowtwo-llc/fireworksify/style.css';

const fireworksify = new Fireworksify({ duration: 10 });
fireworksify.start();
```

### CommonJS

```js
const { Fireworksify } = require('@nowtwo-llc/fireworksify');
// Load @nowtwo-llc/fireworksify/style.css through your bundler or a <link> tag.
```

### Script tag

```html
<script>
    window.onload = function () {
        var fireworksify = new Fireworksify({ duration: 10 });
        fireworksify.start();
    };
</script>
```

The examples above run a display for 10 seconds and then stop on their own. To fire a single firework instead — here, from the middle of the screen:

```js
fireworksify.generate(window.innerWidth / 2, window.innerHeight / 2);
```

To use your own artwork, give a seed a class with a background image:

```css
.hedgie-stunna-shades {
    width: 100px;
    height: 124px;
    background-image: url('./images/mini-hedgie-stunna.png');
}
```

```js
const fireworksify = new Fireworksify({
    duration: 10,
    additionalSeeds: [
        {
            explode: true,
            destroy: false,
            class: 'hedgie-stunna-shades'
        }
    ]
});
fireworksify.start();
```

## API

Method | Description
--- | ---
`new Fireworksify(config?)` | Creates the overlay container and starts the animation loop. `config` is optional.
`start()` | Runs a timed display for `duration` seconds, launching seeds from random offsets around the centre. Safe to call repeatedly.
`generate(x, y)` | Launches a single seed from the given viewport coordinates.
`destroy()` | Stops all timers, removes the container from the DOM and clears internal state. The instance should not be reused afterwards.

## Settings

Variable | Type | Description
--- | --- | ---
duration | *integer* | Number of seconds a `start()` display runs for. (**Default: 10**)
showDefault | *boolean* | Whether to include the built-in firework seed. (**Default: false** — but if no seeds are configured at all, the built-in seed is used anyway, so the out-of-the-box experience still works.)
additionalSeeds | *array* | Additional seed objects, chosen at random each time a seed launches. (**Default: []**)
additionalSeeds[].explode | *boolean* | Whether the seed bursts into particles at the top of its arc.
additionalSeeds[].destroy | *boolean* | Whether the seed is removed from the DOM at the top of its arc. If `false` it falls back down and is removed once it leaves the viewport.
additionalSeeds[].class | *string* | CSS class applied to the seed element, for styling and background images.

## Events

Name | Description
--- | ---
he:fireworksify:start | Fired when a timed display is started.
he:fireworksify:stop | Fired when a timed display finishes.

*Note — all events are dispatched on `document`.*

```js
document.addEventListener('he:fireworksify:start', function () {
    console.log('the show has begun');
});
```

## Browser support

The bundles are compiled to ES5, including the webpack runtime, so they run in any browser that supports CSS animations.

## Development

```bash
npm install
npm run build:dev    # development build → ./build
npm run build:prod   # production bundles + types → ./dist
npm run watch        # development build with file watching
npm test             # Vitest suite (jsdom)
npm run test:watch   # Vitest in watch mode
npm run typecheck    # tsc on the library and the tests
npm run lint         # ESLint + Stylelint
```

To try the demo locally, run `npm run build:prod` and open `example/index.html` — it loads the freshly built files from `../dist/`.

## Authors

* **NowTwo LLC** — [nowtwo.io](https://www.nowtwo.io/)

## License

This project is licensed under the MIT License — see [LICENSE](./LICENSE).

## Acknowledgments

* [Original Fireworks Project](https://shenhuang.github.io/demo_projects/fireworkdemo.html)
