const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './frondend-js/main.js',
    output: {
        filename: 'main-bundled.js',
        path: path.resolve(__dirname, 'public/js')
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}