const webpack = require("webpack");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css", "html", "svg", "less"];
// const proEnv = require("./config/pro.env"); // 生产环境
// const testEnv = require("./config/test.env"); // 测试环境
// const devEnv = require("./config/dev.env"); // 本地环境
const env = process.env.NODE_ENV;
// let target = "";
// // 默认是本地环境
// switch (env) {
//   case "production": // 生产环境
//     target = proEnv.hosturl;
//     break;
//   case "test": // 测试环境
//     target = testEnv.hosturl;
//     break;
//   default:
//     // 本地环境
//     target = devEnv.hosturl;
//     break;
// }
// console.log(target);
const config = {
  productionSourceMap: false,
  publicPath: "/",
  lintOnSave: true, // 是否在开发环境下每次保存代码时都启用 eslint验证
  chainWebpack(config) {
    config.resolve.alias
      .set("style", resolve("public/style"))
      .set("api", resolve("src/api"))
      .set("tools", resolve("src/tools"))
      .set("components", resolve("src/components"))
      .set("echarts", resolve("src/echarts"))
      .set("echarts", resolve("node_modules/echarts"));

    config.output.filename("[name].[hash].js").end();
  },
  configureWebpack: {
    // 警告 webpack 的性能提示
    performance: {
      hints: "warning",
      // 入口起点的最大体积
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith(".js");
      }
    },
    externals: {
      BMap: "BMap"
    }
  }
};
const plugins = [
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery"
  })
];
const pluginsProduction = [
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery"
  }),
  new CompressionWebpackPlugin({
    // 配置压缩包
    filename: "[path].gz[query]", // 目标资源名称。
    algorithm: "gzip", // 可以是 function(buf, callback) 或者字符串。对于字符串来说依照 zlib 的算法(或者 zopfli 的算法)。默认值是 "gzip"。
    test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"), // 所有匹配该正则的资源都会被处理。默认值是全部资源。
    // threshold: 10240,  // 只有大小大于该值的资源会被处理。单位是 bytes。默认值是 0
    minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理。默认值是 0.8。
    deleteOriginalAssets: false // 删除原文件
  })
];
if (env !== "production") {
  config.devServer = {
    open: true // 开启自动打开浏览器
    // host: "localhost", // 地址
    // port: "8080", // 端口
    // disableHostCheck: true,
    // proxy: {
    //   "/api": {
    //     // 设置跨域变量代号
    //     target: target, // 你想要代理的目标源链接
    //     ws: true, // 开启websocket
    //     changeOrigin: true, // 开启代理
    //     pathRewrite: {
    //       // 设置二级
    //       "^/api": "/api"
    //     }
    //   }
    // }
  };
  config.configureWebpack.plugins = plugins;
} else {
  config.configureWebpack.plugins = pluginsProduction;
}
module.exports = config;
