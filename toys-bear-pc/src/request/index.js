import http from "./servers/http";
import im from "./servers/im";

export default {
  install(Vue) {
    /** 常规请求实例 */
    Vue.prototype.$http = http;
    Vue.prototype.$im_http = im;
  }
};
