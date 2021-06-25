/*
 * @Description:
 * @Author: gaojiahao
 * @Date: 2021-05-27 18:59:16
 * @FilePath: \projectd:\LittleBearPC\toys-company-share\src\assets\js\config\toysConfig.js
 * @LastEditTime: 2021-06-18 18:32:33
 * @LastEditors: sueRimn
 * @Descripttion:
 * @version: 1.0.0
 */
module.exports = {
  devEnv: {
    NODE_ENV: "development", // 本地环境
    // hosturl: "http://124.71.6.26:8080",

    // 老测试
    hosturl: "http://124.71.6.26:8080"
    // hosturl: ""

    // hosturl: "https://www.toysbear.com",
  },
  testEnv: {
    NODE_ENV: "test", // 测试环境
    // hosturl: "http://124.71.6.26:8080"
    hosturl: ""
    // hosturl: "https://www.toysbear.com",
  },
  proEnv: {
    NODE_ENV: "production",
    // 测试环境
    hosturl: "http://124.71.6.26:8080"

    // 老测试
    // hosturl: "http://139.9.71.135:8080/"
    // 生产
    // hosturl: "https://www.toysbear.com"
    // hosturl: "http://shareing.toysbear.com"
    //hosturl: ""
  }
};
