module.exports = {
  export_devEnv: {
    NODE_ENV: "development", // 本地环境
    hosturl: "http://139.9.71.135:8087"
  },
  export_testEnv: {
    NODE_ENV: "test", // 测试环境
    hosturl: "http://139.9.71.135:8087"
  },
  export_proEnv: {
    NODE_ENV: "production", // 生产环境
    hosturl: "http://139.9.71.135:8087"
  }
};
