const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const ENVIRONMENT = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const BUILD_DIR = process.env.BUILD_DIR ? path.resolve(process.env.BUILD_DIR) : path.resolve(__dirname, './build');

const resolveAliases = {
    env: path.resolve(__dirname, `./env.${ENVIRONMENT}.json`)
};

const resolve = {
    extensions: ['.ts', '.css'],
    alias: {
        '~': path.resolve('./node_modules'),
        ...resolveAliases
    },
    symlinks: false
};

// Declarations are emitted once by `npm run build:types`. Without this the three
// production compilers would each race to write the same .d.ts files.
const tsRule = {
    test: /\.ts$/,
    use: {
        loader: 'ts-loader',
        options: {
            // tsconfig.json also covers tests and the demo so the editor and
            // ESLint can see them. The bundles must only compile what the
            // entry actually reaches, or a test-only type error fails the build.
            onlyCompileBundledFiles: true,
            compilerOptions: {
                declaration: false,
                declarationMap: false
            }
        }
    }
};

const cssRule = {
    test: /\.css$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader']
};

// Entry points. src/bundle.ts adds the stylesheet side-effect import that makes
// MiniCssExtractPlugin emit dist/fireworksify.css; src/Fireworksify.ts is the
// plain module. The CJS build uses the latter so it never references CSS at
// all — bundling it there pulled in webpack's automatic-publicPath runtime,
// which throws outside a browser and broke `require()` at load time.
const BUNDLE_ENTRY = './src/bundle.ts';
const MODULE_ENTRY = './src/Fireworksify.ts';

// Webpack emits its own runtime wrapper around our bundle. Without an explicit
// ES5 environment it uses const/let, which would contradict the `target: es5`
// this library compiles to.
const ES5_ENVIRONMENT = {
    arrowFunction: false,
    const: false,
    destructuring: false,
    forOf: false,
    optionalChaining: false,
    templateLiteral: false
};

const baseConfig = {
    entry: BUNDLE_ENTRY,
    mode: ENVIRONMENT,
    devtool: 'source-map',
    resolve,
    module: { rules: [tsRule, cssRule] },
    watchOptions: {
        ignored: ['dist/**', 'example/**', 'node_modules/**']
    }
};

const productionPlugins = () => [
    new webpack.DefinePlugin({
        'process.env': { NODE_ENV: '"production"' }
    })
];

/**
 * UMD bundle — the <script src> / unpkg entry point, and the build the Karma
 * suite loads. Exposes `Fireworksify` as a browser global.
 */
const umdConfig = {
    ...baseConfig,
    name: 'umd',
    target: ['web', 'es5'],
    output: {
        path: BUILD_DIR,
        libraryTarget: 'umd',
        globalObject: 'this',
        filename: ENVIRONMENT === 'production' ? 'fireworksify.min.js' : 'fireworksify.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: ENVIRONMENT === 'production' ? 'fireworksify.min.css' : 'fireworksify.css'
        }),
        ...(ENVIRONMENT === 'production' ? productionPlugins() : [])
    ],
    optimization:
        ENVIRONMENT === 'production'
            ? {
                  minimize: true,
                  minimizer: [new TerserPlugin({ extractComments: false }), new CssMinimizerPlugin()]
              }
            : { minimize: false }
};

/**
 * ESM bundle — what bundlers resolve via the "import" condition. Left
 * unminified so downstream tooling can tree-shake and minify it in context.
 * Emits the canonical dist/fireworksify.css consumers import.
 */
const esmConfig = {
    ...baseConfig,
    name: 'esm',
    target: 'web',
    experiments: { outputModule: true },
    output: {
        path: BUILD_DIR,
        filename: 'fireworksify.mjs',
        library: { type: 'module' },
        environment: { ...ES5_ENVIRONMENT, module: true, dynamicImport: true }
    },
    plugins: [new MiniCssExtractPlugin({ filename: 'fireworksify.css' }), ...productionPlugins()],
    optimization: { minimize: false }
};

/**
 * CommonJS bundle — the "require" condition, for Node-based consumers and
 * older bundler setups.
 */
const cjsConfig = {
    ...baseConfig,
    name: 'cjs',
    entry: MODULE_ENTRY,
    target: ['web', 'es5'],
    output: {
        path: BUILD_DIR,
        filename: 'fireworksify.cjs',
        library: { type: 'commonjs2' },
        environment: ES5_ENVIRONMENT
    },
    module: { rules: [tsRule] },
    plugins: productionPlugins(),
    optimization: { minimize: false }
};

if (ENVIRONMENT === 'production') {
    console.log('Mode: PRODUCTION');
    module.exports = [umdConfig, esmConfig, cjsConfig];
} else {
    console.log('Mode: DEVELOPMENT');
    module.exports = umdConfig;
}
