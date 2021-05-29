import http from "./http";
import toys from "./toys";

export default {
  install(Vue) {
    /** 常规请求实例 */
    Vue.prototype.$http = http;
    /** 小竹熊请求实例 */
    Vue.prototype.$toys = toys;
  }
};
