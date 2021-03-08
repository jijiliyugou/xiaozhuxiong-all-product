const webpack = require("webpack");
const proEnv = require("./config/pro.env"); // 生产环境
const testEnv = require("./config/test.env"); // 测试环境
const devEnv = require("./config/dev.env"); // 本地环境
const env = process.env.NODE_ENV;
let target = "";
// 默认是本地环境
switch (env) {
  case "production": // 生产环境
    target = proEnv.hosturl;
    break;
  case "test": // 测试环境
    target = testEnv.hosturl;
    break;
  default:
    // 本地环境
    target = devEnv.hosturl;
    break;
}
console.log(target);
const config = {
  publicPath: "/",
  lintOnSave: true, // 是否在开发环境下每次保存代码时都启用 eslint验证
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
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      })
    ],
    externals: {
      BMap: "BMap"
    }
  }
};
if (env !== "production") {
  config.devServer = {
    open: true, // 开启自动打开浏览器
    host: "localhost", // 地址
    port: "8080", // 端口
    disableHostCheck: true,
    proxy: {
      "/api": {
        // 设置跨域变量代号
        target: target, // 你想要代理的目标源链接
        ws: true, // 开启websocket
        changeOrigin: true, // 开启代理
        pathRewrite: {
          // 设置二级
          "^/api": "/api"
        }
      }
    }
  };
}
module.exports = config;
