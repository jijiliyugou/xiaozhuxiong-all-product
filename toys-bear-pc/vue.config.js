const { devEnv, testEnv, proEnv } = require("./src/assets/js/config/config.js");
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
  publicPath: "/new/",
  lintOnSave: true, // 是否在开发环境下每次保存代码时都启用 eslint验证
  configureWebpack: {
    externals: {
      BMap: "BMap"
    }
  }
};

if (env == "development")
  config.devServer = {
    open: true, // 开启自动打开浏览器
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
module.exports = config;
