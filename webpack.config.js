const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: './src/Fireworksify.ts',
    output: {
        library: 'Fireworksify',
        libraryTarget: 'umd',
        filename: 'Fireworksify.js',
        path: path.resolve(__dirname, 'dist'),
        umdNamedDefine: true
    },
    resolve: {
        extensions: ['.ts', '.css'],
        alias: {
            '~': path.resolve('./node_modules')
        }
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' },
            { test: /\.css$/, use: [ MiniCssExtractPlugin.loader, 'css-loader'] }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css"
        })
    ],
    optimization: {
        minimizer: [
            new TerserJSPlugin({}),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
};
