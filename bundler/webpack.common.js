const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
    entry: path.resolve(__dirname, '../src/script.js'),
    output: {
        hashFunction: 'xxhash64',
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist'),
        clean: true
        // REMOVE library and publicPath from here
    },
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../static') }
            ]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
            minify: true
        }),
        new MiniCSSExtractPlugin({
            filename: 'style.css'
        })
    ],
    module: {
        rules: [
            // ... (keep your existing rules for HTML, JS, CSS, Images, Fonts, Shaders) ...
            {
                test: /\.(html)$/,
                use: ['html-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [MiniCSSExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                type: 'asset/resource',
                generator: { filename: 'assets/images/[hash][ext]' }
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: 'asset/resource',
                generator: { filename: 'assets/fonts/[hash][ext]' }
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                type: 'asset/source',
                generator: { filename: 'assets/images/[hash][ext]' }
            }
        ]
    }
}