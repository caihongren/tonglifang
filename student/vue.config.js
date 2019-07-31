// const path = require('path')
// const debug = process.env.NODE_ENV !== 'production'

// module.exports = {
//     baseUrl: './', // 根域上下文目录
//     outputDir: 'dist', // 构建输出目录
//     assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
//     lintOnSave: false, // 是否开启eslint保存检测，有效值：ture | false | 'error'
//     runtimeCompiler: true, // 运行时版本是否需要编译
//     transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
//     productionSourceMap: true, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
//     configureWebpack: config => { // webpack配置，值位对象时会合并配置，为方法时会改写配置
//         if (debug) { // 开发环境配置
//             config.devtool = 'cheap-module-eval-source-map'
//         } else { // 生产环境配置
//         }
//          Object.assign(config, { // 开发生产共同配置，配置别名
//              resolve: {
//                  alias: {
//                      '@': path.resolve(__dirname, './src'),
//                      '@c': path.resolve(__dirname, './src/components'),
//                     'vue$': 'vue/dist/vue.esm.js'
//                 }
//             }
//          })
//     },
//     chainWebpack: config => { // webpack链接API，用于生成和修改webapck配置，
//         if (debug) {
//             // 本地开发配置
//         } else {
//             // 生产开发配置
//         }
//     },
//     parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译
//     pluginOptions: { // 第三方插件配置
//     },
//     pwa: { // 单页插件相关配置 https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
//     },
//     devServer: {
//         open: true,
//         host: 'localhost',
//         port: 8080,
//         https: false,
//         hotOnly: false,
//         proxy: { // 配置跨域
//           '/api': {
//             　　　　　　　　　//要访问的跨域的api的域名
//                             // target: 'http://192.168.2.223:8080',
//                             target: 'http://sso.icubespace.com/account', 
//                             ws: true,
//                             changOrigin: true,
//                             pathRewrite: {
//                                 '^/api': ''
//                             }
//                         },
//           '/img': {
//                             // target: 'http://192.168.2.223:8081', 
//                             target: 'http://sso.icubespace.com/course', 
//                             ws:true,
//                             changeOrigin: true,       
//                             pathRewrite: {        
//                                 '^/img': ''
//                             }
//                           }
//         },
//         before: app => { }
//     }
// }

const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

// 本地使用代理

module.exports = {
        publicPath: './', //publicPath取代了baseUrl
        outputDir: 'dist',
        lintOnSave: true,
        runtimeCompiler: true, //关键点在这  原来的 Compiler 换成了 runtimeCompiler
        // 调整内部的 webpack 配置。
        // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/webpack.md
        chainWebpack: (config) => {
            config.module
                .rule('')
                .test(/mxClient\.js$/)
                .use('exports-loader')
                .loader('exports-loader?mxClient,mxGraphModel,mxActor,mxShape,mxEventObject,mxGraph,mxPrintPreview,mxEventSource,mxRectangle,mxVertexHandler,mxMouseEvent,mxGraphView,mxImage,mxGeometry,mxRubberband,mxKeyHandler,mxDragSource,mxGraphModel,mxEvent,mxUtils,mxWindow,mxEvent,mxCodec,mxCell,mxConstants,mxPoint,mxGraphHandler,mxCylinder,mxCellRenderer,mxEvent,mxUndoManager')
                .end();
            config.resolve.alias
                .set('@', resolve('src'))
                .set('@assets', resolve('src/assets'));
            // 按这种格式.set('', resolve('')) 自己添加

        },
        configureWebpack: () => {},
        // 配置 webpack-dev-server 行为。
        devServer: {
            open: process.platform === 'darwin',
            host: '0.0.0.0',
            port: 8080,
            https: false,
            hotOnly: false,
            proxy: { // 配置跨域
                '/apl': {　　　　　　　　　 //要访问的跨域的api的域名
                    //target: 'http://192.168.2.223:10000',
                    target: 'http://192.168.2.223:10000/zuul/creator/api/public/account',
                    //target: 'http://cloud.asp0755.com/creator/api/public/account',
                    //target: 'http://192.168.0.104:8081',
                    // target: 'http://192.168.2.200:8080/creatoraccount',
                    ws: true,
                    changOrigin: true,
                    pathRewrite: {
                        '^/apl': ''
                    }
                },
                '/img': {
                    //target: 'http://192.168.0.104:8082',
                    //target: 'http://192.168.0.104:8082',
                     //target: ' http://cloud.asp0755.com/creator/api/public/course1',


                    target: 'http://192.168.2.223:10000/zuul/creator/api/public/course',
                    // target: 'http://192.168.2.200:8080/creatorcourse',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/img': ''
                    }
                },
                '/top': {
                    target: '"http://api.douban.com',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/top': ''
                    }
                }
            },
            before: app => {}
        }
    }
    // module.exports = {
    //   devServer: {
    //     proxy: "http://sso.icubespace.com/account",
    //     https: false
    //   }
    // }