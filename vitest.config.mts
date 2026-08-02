import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // The library is pure DOM manipulation — element creation, class names,
        // ids and inline left/top styles — so it needs a document but never a
        // layout engine or real rendering.
        environment: 'jsdom',
        include: ['tests/**/*.spec.ts'],
        restoreMocks: true,
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: [
                // Type-only declaration; there is no runtime to cover.
                'src/css.d.ts',
                // A webpack shim that re-exports the public API and pulls in the
                // stylesheet. Tests import src/Fireworksify.ts directly, so this
                // would report 0% and understate real coverage.
                'src/bundle.ts'
            ],
            reporter: ['text', 'lcov'],
            // Floors set just under the current numbers (97.57 / 97.95 / 100 /
            // 97.57), so an accidental drop fails CI but ordinary refactoring
            // does not. Raise them when coverage climbs; never lower them to
            // make a build pass.
            thresholds: {
                statements: 97,
                branches: 97,
                functions: 95,
                lines: 97
            }
        }
    }
});
