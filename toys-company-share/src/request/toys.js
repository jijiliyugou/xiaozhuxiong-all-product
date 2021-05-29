// 引入axios请求
import axios from "axios";
import $Store from "@/store";
import router from "@/router/index.js";
import { Message } from "element-ui";
import { devEnv, testEnv, proEnv } from "@/assets/js/config/toysConfig";
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
// 基础实例
const instance = axios.create({
  baseURL: target,
  retry: 1, // 请求次数
  retryDelay: 1000, // 请求间隙
  startDate: 0, // 请求开始时间
  endDate: 0 // 请求结束时间
});
// 请求拦截
instance.interceptors.request.use(
  config => {
    // 不需要loadding的请求
    if (
      !config.url.includes("/api/WebsiteShare/AddShoppingCart") &&
      !config.url.includes("UpdateShoppingCart") &&
      !config.url.includes("RemoveShoppingCart") &&
      !config.url.includes("AddShoppingCart")
    ) {
      Message.closeAll();
      $Store.commit("handlerAppLoading", true);
    }
    // 不需要token的请求
    if (config.url !== "/api/GetToken") {
      config.headers.Utoken = $Store.state.temporaryToken;
    }
    // config.headers.Authorization = "bearer " + $Store.state.userInfo.token;
    config.headers["content-type"] = "application/json";
    return config;
  },
  error => {
    $Store.commit("handlerAppLoading", false);
    // console.log('请求错误拦截', error)
    var config = error.config;
    // If config does not exist or the retry option is not set, reject
    if (!config || !instance.defaults.retry) return Promise.reject(error);

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= instance.defaults.retry) {
      Message.error("请求超时，请检查网络");
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
      return axios(config);
    });
  }
);
// 响应拦截
instance.interceptors.response.use(
  res => {
    if (
      !res.config.url.includes("/api/WebsiteShare/AddShoppingCart") &&
      !res.config.url.includes("GetProductPackMethods")
    ) {
      Message.closeAll();
      $Store.commit("handlerAppLoading", false);
    }
    // 屏蔽不需要验证code的请求，如下载导出等
    if (res.config.url.includes("ExportOrderDetailToExcel")) {
      return res;
    } else {
      if (res.data.result.code === 401 || res.data.result.code === 403) {
        Message.error("登录过期，请重新登录");
        router.push({
          path: "/"
        });
      }
    }
    return res;
  },
  error => {
    if (error.response) {
      $Store.commit("handlerAppLoading", false);
      Message.closeAll();
      Message.error(
        `请求失败${error.response.statusText},${error.response.status}，请联系管理员`
      );
      return Promise.reject(error);
    } else {
      // 请求超时， 重新请求
      var config = error.config;
      // If config does not exist or the retry option is not set, reject
      if (!config || !instance.defaults.retry) return Promise.reject(error);

      // Set the variable for keeping track of the retry count
      config.__retryCount = config.__retryCount || 0;
      // Check if we've maxed out the total number of retries
      if (config.__retryCount >= instance.defaults.retry) {
        $Store.commit("handlerAppLoading", false);
        Message.closeAll();
        Message.error(
          "接口：" +
            config.url +
            "，超时时长为=" +
            config.timeout +
            "毫秒，超时次数为=" +
            (axios.defaults.retry + 1) +
            "次"
        );
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
