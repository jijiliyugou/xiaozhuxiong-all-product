module.exports = {
  devEnv: {
    NODE_ENV: "development", // 本地环境
    hosturl: "http://139.9.71.135:8080",
    wsBaseUrl: "ws://139.9.71.135:8090/ws?UserId=",
    loginUrl: "http://139.9.71.135:8080/#/me"
    // hosturl: "https://www.toysbear.com",
    // loginUrl: "https://www.toysbear.com/#/me",
    // wsBaseUrl: "wss://impush.toysbear.com/ws?UserId="
  },
  testEnv: {
    NODE_ENV: "test", // 测试环境
    // hosturl: "http://139.9.71.135:8081",
    // wsBaseUrl: "ws://139.9.71.135:8090/ws?UserId="
    hosturl: "https://www.toysbear.com",
    loginUrl: "https://www.toysbear.com/#/me",
    wsBaseUrl: "wss://impush.toysbear.com/ws?UserId="
  },
  proEnv: {
    NODE_ENV: "production",
    // 测试环境
    // hosturl: "http://139.9.71.135:8080",
    // loginUrl: "http://139.9.71.135:8080/#/me",
    // wsBaseUrl: "ws://139.9.71.135:8090/ws?UserId="
    // 生产环境
    hosturl: "https://www.toysbear.com",
    loginUrl: "https://www.toysbear.com/#/me",
    wsBaseUrl: "wss://impush.toysbear.com/ws?UserId="
  }
};
