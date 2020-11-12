const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        react_doom: "./src/main/react_doom.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/React-DOOM/dist'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript"
                        ],
                    },
                }
            },

            // In order to use extracted CSS:
            // 1) enable this module (Xscss -> scss)
            // 2) insert following line into index.html->head:
            //    <link rel="stylesheet" type="text/css" href="dist/react_doom.css">
            // 3) disable other scss-module
            {
                test: /\.XXXX(sa|sc|c)ss$/,
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
                test: /\.(sa|sc|c)ss$/,
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
                            outputPath: '/img'
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
                            outputPath: '/font'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),

        new HtmlWebpackPlugin({
            title: 'React DOOM',
            template: './src/main/index.html',
            chunks: ['react_doom']
        }),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 4000,
    },
};
