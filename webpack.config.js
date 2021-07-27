/*
webpack 配置文件
作用： 指示webpack干哪些活（当你运行webpack指令时，会加载里面的配置）

所有构建工具都是基于nodejs平台运行 模块化默认采用commonjs
*/

const {
    resolve,
} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 入口
    entry: ['./src/index.ts', './src/index.html'],
    // 输出路径
    output: {
        // 输出文件名
        filename: 'built.js',
        // 输出路径
        // __dirname nodejs变量，代表当前文件的目录的绝对路径
        path: resolve(__dirname, 'build')
    },
    // loader配置
    module: {
        rules: [{
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ],
            }, {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            }, {
                test: /\.ts$/, // 以ts结尾的文件
                // 要使用的loader
                use: [
                    // 配置babel
                    {
                        // 指定加载器
                        loader: 'babel-loader',
                        // 设置babel
                        options: {
                            // 设置预定义的环境
                            presets: [
                                [
                                    // 指定环境的插件
                                    '@babel/preset-env',
                                    // 配置信息
                                    {
                                        // 要兼容的目标浏览器及版本
                                        targets: {
                                            chrome: '58',
                                            ie: '11',
                                        },
                                        // 指定corejs的版本
                                        corejs: '3',
                                        // 使用corejs的方式 "usage"  表示按需加载
                                        useBuiltIns: 'usage',
                                    },

                                ],
                            ],
                        },
                    },
                    // 'babel-loader',
                    'ts-loader',
                ],
                // 要排除的文件
                exclude: /node-modules/,
            }, {
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    // 图片大小小于8kb，用base64处理
                    // 优点：减少i请求数量
                    // 缺点：图片体积会更大
                    limit: 8 * 1024,
                    // 问题L因为url-loader默认使用es6模块化解析，而html-loader引入是图片是用commonjs
                    // 解析式会出问题:[object Module]
                    // 解决：关闭url-loader的es6模块化，使用commonjs解析
                    exModule: false,
                    // 给图片重命名
                    // [hash:10]取图片前10位
                    // [ext]取文件原来扩展名
                    name: '[hash:10].[ext]',
                    outputPath: 'imgs',
                },
            },
            {

                test: /\.html$/,
                // 处理html文件中的img图片（负责引入img，从而能被url-loader进行处理）
                loader: 'html-loader',
            },
            // 打包其他资源（除了html，js，css资源意外的资源）
            {
                exclude: /\.(css|js|ts|html|less|jpg|png|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]',
                    outputPath: 'media',
                },
            },

        ],
    },
    // 插件
    plugins: [
        // 详细配置
        new HtmlWebpackPlugin({
            // 复制‘./src/index.html’文件，并自动引入打包输出的所有资源（js/css）
            template: './src/index.html',
            // 压缩html代码
            // minify: {
            //     // 移除空格
            //     collapseWhitespace: true,
            //     // 移除注释
            //     removeComments: true,
            // },
        })
    ],
    // mode: 'production' 会压缩js文件
    resolve: {
        extensions: ['.ts', '.js'],
    },
    mode: 'development',
    devServer: {
        // 运行代码的目录
        contentBase: resolve(__dirname, 'build'),
        // 启动gzip压缩
        compress: true,
        // 端口号
        port: 3000,
        // 开启HMR功能
        hot: true
    },
};