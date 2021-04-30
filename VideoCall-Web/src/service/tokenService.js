import Fly from "flyio/dist/npm/fly";
import router from "../router";
import store from "../store";
import {AGORA_APP_KEY,AGORA_APP_SECRET} from "@root/agora.config"

const fly = new Fly();
// fly请求 设置拦截器
const storage = window["sessionStorage"]; //window[isPC||window.isApp ? 'localStorage' : 'sessionStorage'];
const SPHY_TOKEN_KEY = "SPHY_LOGIN_TOKEN";
const AGORA_TOKEN = "AGORA_TOKEN";

let globalToken;
let Base64 = require('js-base64').Base64;

let tokenService = {
  // 清除token
  clean() {
    storage.removeItem(SPHY_TOKEN_KEY);
    sessionStorage.clear();
    this.clearCookie();
    // localStorage.clear();
    // store.commit('clearMenuRouter');
    // store.commit('clearAuth');
  },
  // 设置token
  setToken(data) {
    globalToken = {
      ...data,
      timestamp: data.expiration
    };
    storage.setItem(SPHY_TOKEN_KEY, JSON.stringify(globalToken));
    this.setAgoraToken();
  },
  // 获取token
  getToken() {
    let token =
      globalToken != null
        ? globalToken
        : JSON.parse(storage.getItem(SPHY_TOKEN_KEY)) || {};
    if (token["token"]) {
      let timestamp = token.timestamp;
      let timeCalc = new Date() - timestamp;
      if (timeCalc > (10 * 3600 * 1000)) {
        this.clean();
        return ''
      // } else if (timeCalc > (12 * 3600 * 1000)) { // 设置12小时过期时间
      //   return ''
      }
      return token["token"];
    } else {
      return "";
    }
  },
  // PC端登录，默认返回token
  pcLogin(userInfo, key = "token") {
    var that = this;
    return new Promise((resolve, reject) => {
      let params = {
        method: "post",
        baseURL: process.env.VUE_APP_API,
        url: "/api/TokenAuth/Token",
        headers: {
          "Content-Type": "application/json"
        },
        data: userInfo
      };
      // console.log(params);
      fly
        .request(params, params.data)
        .then(res => {
          let data = res.data;
          this.setToken(data.data || "");
          resolve(data);
        })
        .catch(function(error) {
          let res = error.response;
          let data = (res && res.data) || '请求异常';
          reject({
            success: false,
            data: data
          });
        });
    });
  },
  // 刷新token
  refreshToken(data) {
    var that = this;
    return new Promise((resolve, reject) => {
      let params = {
        method: "post",
        baseURL: process.env.VUE_APP_API,
        url: "/api/TokenAuth/RefreshToken",
        headers: {
          "Content-Type": "application/json"
        },
        data: data
      };
      // console.log(params);
      fly
        .request(params, params.data)
        .then(res => {
          let data = res.data;
          this.setToken(data.data || "");
          resolve(data);
        })
        .catch(function(error) {
          let res = error.response;
          let data = (res && res.data) || '请求异常';
          reject({
            success: false,
            data: data
          });
        });
    });
  },
  //发送验证码
  sendTestCode(data) {
    return new Promise((resolve, reject) => {
      let params = {
        method: "post",
        baseURL: process.env.VUE_APP_API,
        url: "/api/System/SendSMS",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          phoneNumber: data.phoneNumber,
          messageType: data.messageType,
        }
      };
      fly
        .request(params, params.data)
        .then(res => {
          resolve(res.data);
        })
        .catch(function(error) {
          let res = error.response;
          let data = (res && res.data) || {};
          let message = data.message || "请求异常";
          reject({
            success: false,
            message: message
          });
        });
    });
  },
  async login() {
    // 清楚token缓存
    this.clean();
    let query = querystring.parse(location.search.slice(1)),
      isDebug = query.debug == "true",
      enterpriseInfo;
    let code = query.code;

    // 根据环境不同 调用不同的登录接口
    if (isDebug) {
      return this.toLoginPage();
    } else {
      return this.toLoginPage();
    }
  },
  toLoginPage() {
    if (router.history.current.path != "/login") {
      router.push("/login");
    }
    return new Promise((resolve, reject) => {
      resolve();
    });
  },
  //删除所有cookie
  clearCookie() {
    var keys = document.cookie.match(/[^ =;]+(?==)/g);
    if (keys) {
      for (var i = keys.length; i--;) {
        document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
        // document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString() // 清除当前域名下的，例如 .m.ratingdog.cn
        // document.cookie = keys[i] + '=0;path=/;domain=ratingdog.cn;expires=' + new Date(0).toUTCString() // 清除一级域名下的或指定的，例如 .ratingdog.cn
      }
    }
  },
  //获取二维码
  getQrCodeUrl() {
    var that = this;
    return new Promise((resolve, reject) => {
      let params = {
        method: "get",
        baseURL: process.env.VUE_APP_API,
        url: "/api/TokenAuth/VideoMeetingLoginQRCode",
        headers: {
          "Content-Type": "application/json"
        },
      };
      // console.log(params);
      fly
        .request(params, params.data)
        .then(res => {
          let data = res.data;
          resolve(data);
        })
        .catch(function(error) {
          let res = error.response;
          let data = (res && res.data) || '请求异常';
          reject({
            success: false,
            data: data
          });
        });
    });
  },
  //生成声网token认证，处理RESTful API的控制用户的设备状态
  setAgoraToken(){
    var customerKey  = AGORA_APP_KEY;
    var customerSecret = AGORA_APP_SECRET;
    var plainCredentials  = customerKey+":"+customerSecret;
    var base64Credentials = Base64.encode(plainCredentials);
    var authorizationHeader = "Basic " + base64Credentials;
    storage.setItem(AGORA_TOKEN, authorizationHeader);
  }
};
export default tokenService;
