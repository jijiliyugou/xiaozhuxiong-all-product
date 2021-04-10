/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: gaojiahao
 * @Date: 2020-10-19 15:37:14
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-05 10:18:10
 */
const os = require('os');
const path = require("path");
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH, // 基本路径`/${publicPath}`
  outputDir: "dist", // 输出文件目录
  lintOnSave: false, // eslint-loader 是否在保存的时候检查
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // webpack配置
  chainWebpack: config => {
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .options({
        extractCSS: IS_PROD ? true : false // 把vue的css提取到单独的文件，默认
      })
      .end()
      .use("iview")
      .loader("iview-loader")
      .options({ prefix: false })
      .end()
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
      config.mode = "production";
    } else {
      // 为开发环境修改配置...
      config.mode = "development";
      // config.plugins.push(
      //   new Happypack({
      //     loaders: ['babel-loader'],
      //     //threads: 5, // 线程数取决于你电脑性能的好坏，好的电脑建议开更多线程
      //     threadPool: happyThreadPool,
      //     verbose: true,
      //   })
      // );
    }
    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        extensions: [".js", ".json", ".vue", ".css", ".less"],
        alias: {
          "@": path.resolve(__dirname, "./src"),
          "@assets": path.resolve(__dirname, "./src/assets"),
          "@components": path.resolve(__dirname, "./src/components"),
          "@service": path.resolve(__dirname, "./src/service"),
          "@views": path.resolve(__dirname, "./src/views"),
          "@css": path.resolve(__dirname, "./src/css"),
          "@plugins": path.resolve(__dirname, "./src/plugins"),
          "@less": path.resolve(__dirname, "./src/less"),
          "@mixins": path.resolve(__dirname, "./src/mixins"),
          "@utils": path.resolve(__dirname, "./src/utils"),
          "@lang": path.resolve(__dirname, "./src/lang")
        } // 别名配置
      },
    });
  },
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  // css相关配置
  css: {
    extract: IS_PROD ? true:false, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps?
    // css预设器配置项
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true
  },
  parallel: require("os").cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  pwa: {}, // PWA 插件相关配置 see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  // webpack-dev-server 相关配置
  devServer: {
    open: true, // 开启自动打开浏览器
    host: "0.0.0.0", // 地址
    port: "8080", // 端口
    // proxy: {
    //   //配置跨域
    //   "/api": {
    //     target: "http://cbapi.com", //这里后台的地址模拟的;应该填写你们真实的后台接口
    //     //ws: true,
    //     changOrigin: true, //允许跨域
    //     pathRewrite: {
    //       "^/api": "/api" //请求的时候使用这个api就可以
    //     }
    //   }
    // }
  },
  // 第三方插件配置
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        path.resolve(__dirname, './src/less/common.less')
      ]
    }
  }
};
