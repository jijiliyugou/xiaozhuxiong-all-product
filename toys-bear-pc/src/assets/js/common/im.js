import * as RongIMLib from "@rongcloud/imlib-v4";
const { devEnv, testEnv, proEnv } = require("@/assets/js/config/imConfig.js");
const env = process.env.NODE_ENV;
let id = devEnv.appkey;
switch (env) {
  case "production": // 生产环境
    id = proEnv.appkey;
    break;
  case "test": // 测试环境
    id = testEnv.appkey;
    break;
  default:
    // 本地环境
    id = devEnv.appkey;
    break;
}
class IM {
  constructor(appkey) {
    !this.RongIMClient &&
      (this.RongIMClient = RongIMLib.init({ appkey: appkey || id }));
  }
}
export default IM;
