# Security Policy

## Supported versions

Only the latest published version of `@nowtwo-llc/fireworksify` receives security fixes.

## Reporting a vulnerability

Please **do not open a public issue** for a security report.

Use GitHub's private vulnerability reporting instead — go to the
[Security tab](https://github.com/nowtwo-llc/nowtwo-fireworksify/security/advisories/new)
and open a draft advisory. That keeps the report private until a fix ships.

If you cannot use that, email <support@nowtwo.io>.

Please include what the issue is, how to reproduce it, and which version you tested.
We aim to acknowledge reports within a few business days.

## Scope

This is a browser animation library with no runtime dependencies, no network calls, and no
data collection. It creates DOM elements and animates them.

The things most worth reporting:

- **DOM injection.** The library builds elements with `createElement` and `setAttribute` and
  never touches `innerHTML`, so caller-supplied values cannot be parsed as HTML. The one
  value that reaches the DOM is `additionalSeeds[].class`, written to a `class` attribute.
  If you find any path that turns caller input into parsed markup or executed script, that
  is a vulnerability and we want to hear about it.
- **Supply chain.** Anything about the published artifacts, the build, or the release
  workflow — for example a discrepancy between the published tarball and the tagged source.
  Releases are published from CI using npm trusted publishing and carry build provenance,
  which you can verify with `npm audit signatures`.

Denial of service caused by requesting an unreasonable number of fireworks is not a
vulnerability — that is the caller's choice.
