// 引入axios请求
import axios from "axios";
import $Store from "@/store";
import router from "@/router/index.js";
import v from "vue";
/**
 * apiBaseURL
 */
import { proEnv, testEnv } from "@/assets/js/config/config.js";
const env = process.env.NODE_ENV;
let target = "";
let push_target = "";
let export_target = "";
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
    target = "";
    break;
}
/**
 * 推送BaseURL
 */
import {
  push_devEnv,
  push_testEnv,
  push_proEnv
} from "@/assets/js/config/pushConfig.js";
// 默认是本地环境
switch (env) {
  case "production": // 生产环境
    push_target = push_proEnv.hosturl;
    break;
  case "test": // 测试环境
    push_target = push_testEnv.hosturl;
    break;
  default:
    // 本地环境
    push_target = push_devEnv.hosturl;
    break;
}
/**
 * 推送BaseURL
 */
import {
  export_devEnv,
  export_testEnv,
  export_proEnv
} from "@/assets/js/config/exportConfig.js";
// 默认是本地环境
switch (env) {
  case "production": // 生产环境
    export_target = export_proEnv.hosturl;
    break;
  case "test": // 测试环境
    export_target = export_testEnv.hosturl;
    break;
  default:
    // 本地环境
    export_target = export_devEnv.hosturl;
    break;
}
console.log(push_target, target, export_target);
const createLogRecord = async function(obj) {
  if (obj.Url.includes("CreateLogRecord")) {
    v.prototype.$common.handlerMsgState({
      msg: obj.Message,
      type: "danger"
    });
    return false;
  }
  const res = await axios.post("api/CreateLogRecord", obj);
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
const myAxios = {};
myAxios.install = function(Vue) {
  const instanceOptions = {
    baseURL: target,
    retry: 1, // 请求次数
    retryDelay: 500, // 请求间隙
    startDate: 0, // 请求开始时间
    endDate: 0 // 请求结束时间
  };
  // 基础实例
  const instance = axios.create(instanceOptions);
  // 推送实例
  const push_instance = axios.create({
    baseURL: push_target,
    timeout: 20000, // 超时时间
    retry: 1, // 请求次数
    retryDelay: 1000, // 请求间隙
    startDate: 0, // 请求开始时间
    endDate: 0 // 请求结束时间
  });
  // 导出实例
  const export_instance = axios.create({
    baseURL: export_target,
    timeout: 20000, // 超时时间
    retry: 1, // 请求次数
    retryDelay: 1000, // 请求间隙
    startDate: 0, // 请求开始时间
    endDate: 0 // 请求结束时间
  });
  // 超过一秒没有返回请求数据的才出现loading
  // const loaddingOptions = {};
  // 推送请求拦截
  push_instance.interceptors.request.use(
    config => {
      config.headers.Utoken =
        $Store.state.userInfo && $Store.state.userInfo.accessToken;
      config.headers["content-type"] = "application/json";
      return config;
    },
    error => {
      // console.log('请求错误拦截', error)
      var config = error.config;
      // If config does not exist or the retry option is not set, reject
      if (!config || !push_instance.defaults.retry)
        return Promise.reject(error);

      // Set the variable for keeping track of the retry count
      config.__retryCount = config.__retryCount || 0;
      // Check if we've maxed out the total number of retries
      if (config.__retryCount >= push_instance.defaults.retry) {
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
        }, push_instance.defaults.retryDelay || 1);
      });

      // Return the promise in which recalls axios to retry the request
      return backoff.then(function() {
        return axios(config);
      });
    }
  );
  // 使用axios请求拦截器
  instance.interceptors.request.use(
    config => {
      config.headers.Utoken =
        $Store.state.userInfo && $Store.state.userInfo.accessToken;
      config.headers["content-type"] = "application/json";
      /**
       * 不需要loadding的请求
       */
      if (
        !config.url.includes("GetHallStatisticsCount") &&
        !config.url.includes("SelectProductOfferFormulaList") &&
        !config.url.includes("CreateProductCollection") &&
        !config.url.includes("ExportSampleOfferToExcel") &&
        !config.url.includes("ExportCustomerOrderDetailToExcel") &&
        !config.url.includes("GetSampleOrderExcel")
      ) {
        $Store.commit("updateAppLoading", true);
      }
      // }, 500);
      // 屏蔽不需要验证code的请求，如下载导出等
      // if (
      //   config.url.includes("GetSampleOrderExcel") ||
      //   config.url.includes("GetProductOfferOrderExcel") ||
      //   config.url.includes("LittleBearInstallDownload") ||
      //   config.url.includes("LittleBearInstallRepeatDownload") ||
      //   config.url.includes("ExportCompanySampleListToExcel") ||
      //   config.url.includes("GetERPOrderExcel") ||
      //   config.url.includes("ExportCustomerOrderDetailToExcel")
      // ) {
      //   config.timeout = 99999999;
      // }
      return config;
    },
    error => {
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
      // loaddingOptions[res.config.url] = false;
      v.prototype.$nextTick(() => {
        $Store.commit("updateAppLoading", false);
      });
      /** 全局设置请求时长和请求内容 */
      const myUrl = res.config.url;
      let httpDate;
      switch (myUrl) {
        case "/api/SearchBearProductPage":
          instance.endDate = Date.now();
          // eslint-disable-next-line no-case-declarations
          const httpTXT = JSON.parse(res.config.data).name || "所有产品";
          httpDate = instance.endDate - instance.startDate;
          $Store.commit("handlerHttpTime", httpDate);
          $Store.commit("handlerHttpContent", httpTXT);
          break;
        case "/api/HotRecommendPage":
          instance.endDate = Date.now();
          // eslint-disable-next-line no-case-declarations
          const httpHotTXT = JSON.parse(res.config.data).name || "所有产品";
          httpDate = instance.endDate - instance.startDate;
          $Store.commit("handlerHttpTime", httpDate);
          $Store.commit("handlerHttpContent", httpHotTXT);
          break;
        case "/api/File/SearchPicture":
          instance.endDate = Date.now();
          // eslint-disable-next-line no-case-declarations
          httpDate = instance.endDate - instance.startDate;
          $Store.commit("handlerHttpTime", httpDate);
          $Store.commit("handlerHttpContent", "[图片]");
      }

      if (
        // 不需要loading的请求
        !res.config.url.includes("GetHotWord") &&
        !res.config.url.includes("CreateLogRecord") &&
        !res.config.url.includes("ExportSampleOfferToExcel") &&
        // !res.config.url.includes('ProductCategoryList') &&
        !res.config.url.includes("UserConfirm") &&
        !res.config.url.includes("OrgCompanyList") &&
        !res.config.url.includes("SampleOrderTotal")
      ) {
        $Store.commit("updateAppLoading", false);
      }
      // 屏蔽不需要验证code的请求，如下载导出等
      if (
        res.config.url.includes("ExportSampleOfferToExcel") ||
        res.config.url.includes("GetSampleOrderExcel") ||
        res.config.url.includes("GetProductOfferOrderExcel") ||
        res.config.url.includes("LittleBearInstallDownload") ||
        res.config.url.includes("LittleBearInstallRepeatDownload") ||
        res.config.url.includes("ExportCompanySampleListToExcel") ||
        res.config.url.includes("GetERPOrderExcel") ||
        res.config.url.includes("ExportCustomerOrderDetailToExcel")
      ) {
        return res;
      } else {
        if (res.data.result.code === 401 || res.data.result.code === 403) {
          $Store.commit("updateAppLoading", false);
          v.prototype.$common.handlerMsgState({
            msg: "登录过期，请重新登录",
            type: "danger"
          });
          router.push({
            path: "/login?id=signOut"
          });
        }
      }
      return res;
    },
    error => {
      if (error.response) {
        /** 全局设置请求时长和请求内容 */
        const myUrl = error.response.config.url;
        let httpDate;
        switch (myUrl) {
          case "/api/SearchBearProductPage":
            instance.endDate = Date.now();
            // eslint-disable-next-line no-case-declarations
            const httpTXT =
              JSON.parse(error.response.config.data).name || "所有产品";
            httpDate = instance.endDate - instance.startDate;
            $Store.commit("handlerHttpTime", httpDate);
            $Store.commit("handlerHttpContent", httpTXT);
            break;
          case "/api/File/SearchPicture":
            instance.endDate = Date.now();
            // eslint-disable-next-line no-case-declarations
            httpDate = instance.endDate - instance.startDate;
            $Store.commit("handlerHttpTime", httpDate);
            $Store.commit("handlerHttpContent", "[图片]");
        }
        // 如果请求报404 | 500 | 401 之类的
        // console.log('响应失败拦截', error.response)
        switch (error.response.status) {
          case 401:
            $Store.commit("updateAppLoading", false);
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
            if (
              // 不需要loading的请求
              !error.response.config.url.includes("GetHotWord") &&
              !error.response.config.url.includes("CreateLogRecord") &&
              !error.response.config.url.includes("UserConfirm") &&
              !error.response.config.url.includes("OrgCompanyList") &&
              !error.response.config.url.includes("ExportSampleOfferToExcel") &&
              !error.response.config.url.includes("SampleOrderTotal")
            ) {
              $Store.commit("updateAppLoading", false);
            }
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
        // 请求超时， 重新请求
        var config = error.config;
        // If config does not exist or the retry option is not set, reject
        if (!config || !instance.defaults.retry) return Promise.reject(error);

        // Set the variable for keeping track of the retry count
        config.__retryCount = config.__retryCount || 0;
        // Check if we've maxed out the total number of retries
        if (config.__retryCount >= instance.defaults.retry) {
          $Store.commit("updateAppLoading", false);
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
  Vue.prototype.$http = instance;
  Vue.prototype.$push = push_instance;
  Vue.prototype.$export = export_instance;
  // Vue.prototype.baseAPI = target;
  // Vue.prototype.baseAPI = "";
};
export default myAxios;
