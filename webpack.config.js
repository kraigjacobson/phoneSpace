var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: ['./index.js'],
    output: {
        filename: 'dist/bundle.js'
    },
    module: {

        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader?importLoaders=1'
                })
            },
            {
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'dist/[name].bundle.css',
            allChunks: true
        }),
        new CopyWebpackPlugin([
            {from:'assets/img',to:'assets/img'}
        ])
    ]
};