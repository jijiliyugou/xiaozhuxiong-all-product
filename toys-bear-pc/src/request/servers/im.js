// 引入axios请求
import axios from "axios";
import $Store from "@/store";
import router from "@/router/index.js";
import v from "vue";

// logo报错日志
const createLogRecord = async function(obj) {
  if (obj.Url.includes("CreateLogRecord")) {
    v.prototype.$common.handlerMsgState({
      msg: obj.Message,
      type: "danger"
    });
    return false;
  }
  const res = await v.prototype.$http.post("/api/CreateLogRecord", obj);
  if (res.data.result.code !== 200) {
    const msg =
      "api/CreateLogRecord报错code=" +
      res.data.result.code +
      "," +
      res.data.result.message;
    v.prototype.$common.handlerMsgState({
      msg: msg,
      type: "danger"
    });
  }
};

/**
 * imBaseURL
 */
import { proEnv, testEnv, devEnv } from "@/assets/js/config/imConfig.js";
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

// 基础实例
const instance = axios.create({
  baseURL: target,
  retry: 1, // 请求次数
  retryDelay: 500, // 请求间隙
  startDate: 0, // 请求开始时间
  endDate: 0 // 请求结束时间
});

// 请求拦截
instance.interceptors.request.use(
  config => {
    config.headers.Utoken =
      $Store.state.userInfo && $Store.state.userInfo.accessToken;
    config.headers["content-type"] = "application/json";
    return config;
  },
  error => {
    $Store.commit("updateAppLoading", false);
    console.log("请求错误拦截", error);
    var config = error.config;
    // If config does not exist or the retry option is not set, reject
    if (!config || !instance.defaults.retry) return Promise.reject(error);

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= instance.defaults.retry) {
      $Store.commit("updateAppLoading", false);
      v.prototype.$common.handlerMsgState({
        msg: "请求超时，请检查网络",
        type: "danger"
      });
      // Reject with the error
      return Promise.reject(error);
    }

    // Increase the retry count
    config.__retryCount += 1;

    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, instance.defaults.retryDelay || 1);
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
      return instance(config);
    });
  }
);
// 响应拦截
instance.interceptors.response.use(
  res => {
    return res;
  },
  error => {
    if (error.response) {
      $Store.commit("updateAppLoading", false);
      // 如果请求报404 | 500 | 401 之类的
      switch (error.response.status) {
        case 401:
          v.prototype.$common.handlerMsgState({
            msg: "登录过期，请重新登录",
            type: "danger"
          });
          createLogRecord({
            Message:
              "接口" +
              error.response.config.url +
              "，报" +
              error.response.status +
              "，" +
              error.response.statusText,
            LogType: 2,
            Title: "登录过期",
            Url: error.response.config.url,
            Parameters: error.response.config.data
          });
          router.push({
            path: "/login?id=signOut"
          });
          break;
        default:
          createLogRecord({
            Message:
              "接口" +
              error.response.config.url +
              "，报" +
              error.response.status +
              "，" +
              error.response.statusText,
            LogType: 2,
            Title: "请求失败",
            Url: error.response.config.url,
            Parameters: error.response.config.data
          });
          v.prototype.$common.handlerMsgState({
            msg:
              "请求失败" +
              error.response.statusText +
              "," +
              error.response.status +
              ",请联系管理员",
            type: "danger"
          });
          break;
      }
      return Promise.reject(error);
    } else {
      $Store.commit("updateAppLoading", false);
      // 请求超时， 重新请求
      var config = error.config;
      // If config does not exist or the retry option is not set, reject
      if (!config || !instance.defaults.retry) return Promise.reject(error);

      // Set the variable for keeping track of the retry count
      config.__retryCount = config.__retryCount || 0;
      // Check if we've maxed out the total number of retries
      if (config.__retryCount >= instance.defaults.retry) {
        createLogRecord({
          Message:
            "接口：" +
            config.url +
            "超时时长为=" +
            config.timeout +
            "毫秒，超时次数为=" +
            (instance.defaults.retry + 1) +
            "次",
          LogType: 1,
          Title: "请求超时",
          Url: config.url,
          Parameters: config.data
        });
        v.prototype.$common.handlerMsgState({
          msg:
            "接口：" +
            config.url +
            "，超时时长为=" +
            config.timeout +
            "毫秒，超时次数为=" +
            (instance.defaults.retry + 1) +
            "次",
          type: "danger"
        });
        // Reject with the error
        return Promise.reject(error);
      }

      // Increase the retry count
      config.__retryCount += 1;

      // Create new promise to handle exponential backoff
      var backoff = new Promise(function(resolve) {
        setTimeout(function() {
          resolve();
        }, instance.defaults.retryDelay || 1);
      });

      // Return the promise in which recalls axios to retry the request
      return backoff.then(function() {
        return instance(config);
      });
    }
  }
);

export default instance;
