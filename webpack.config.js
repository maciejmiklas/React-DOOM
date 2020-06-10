const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        react_doom: "./src/react_doom.js",
        test: "./src/test.js"
    },
    output: {
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: ['babel-loader']
            },

            // In order to use extracted CSS enable this module and insert following line into index.html->head:
            // <link rel="stylesheet" type="text/css" href="dist/react_doom.css">
            {
                test: /\.Xscss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true,
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },

            // In order to use inline CSS enable this module and remove  <link rel="stylesheet" ... /> from index.html
            {
                test: /\.scss$/,
                use: [
                    'style-loader', // creates style nodes from JS strings
                    'css-loader', // translates CSS into CommonJS
                    'sass-loader', // compiles Sass to CSS, using Node Sass by default
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'dist/'
                        }
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'dist/fonts/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
};
