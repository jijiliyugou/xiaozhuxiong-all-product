module.exports = {
  devEnv: {
    NODE_ENV: "development", // 本地环境
    // hosturl: "http://139.9.71.135:8081",
    loginUrl: "http://139.9.71.135:8080/#/me",
    // loginUrl: "https://www.toysbear.com/#/me",
    hosturl: "https://www.toysbear.com",
    // hosturl: "http://139.9.71.135:8096",
    wsBaseUrl: "ws://139.9.71.135:8090/ws?UserId="
  },
  testEnv: {
    NODE_ENV: "test", // 测试环境
    hosturl: "http://139.9.71.135:8081",
    wsBaseUrl: "ws://139.9.71.135:8090/ws?UserId="
  },
  proEnv: {
    NODE_ENV: "production", // 生产环境
    // hosturl: "http://139.9.71.135:8081",
    // loginUrl: "http://139.9.71.135:8080/#/me",
    // wsBaseUrl: "ws://139.9.71.135:8090/ws?UserId="
    hosturl: "https://www.toysbear.com",
    loginUrl: "https://www.toysbear.com/#/me",
    wsBaseUrl: "wss://impush.toysbear.com/ws?UserId="
  }
};
