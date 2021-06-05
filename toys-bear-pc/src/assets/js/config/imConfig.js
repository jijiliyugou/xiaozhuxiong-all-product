module.exports = {
  devEnv: {
    NODE_ENV: "development", // 本地环境
    // hosturl: "http://124.71.6.26:8089",
    // appkey: "bmdehs6pbfaas"
    hosturl: "http://im.toysbear.com",
    appkey: "pkfcgjstp5888"
    // hosturl: "https://www.toysbear.com",
  },
  testEnv: {
    NODE_ENV: "test", // 测试环境
    hosturl: "http://124.71.6.26:8089",
    appkey: "bmdehs6pbfaas"
  },
  proEnv: {
    NODE_ENV: "production",
    // 新测试环境
    // hosturl: "http://124.71.6.26:8089",
    // appkey: "bmdehs6pbfaas"

    // 生产环境
    hosturl: "https://www.toysbear.com",
    appkey: "pkfcgjstp5888"
  }
};
