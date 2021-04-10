import Fly from "flyio/dist/npm/fly";
import router from "../router";
import store from "../store";

const fly = new Fly();
// fly请求 设置拦截器
const storage = window["localStorage"]; //window[isPC||window.isApp ? 'localStorage' : 'sessionStorage'];
const XZX_TOKEN_KEY = "XZX_LOGIN_TOKEN";
let globalToken;

let tokenService = {
  // 清除token
  clean() {
    storage.removeItem(XZX_TOKEN_KEY);
    sessionStorage.clear();
    localStorage.clear();
    // store.commit('clearMenuRouter');
    // store.commit('clearAuth');
  },
  // 设置token
  setToken(data) {
    globalToken = {
      ...data,
      timestamp: +new Date()
    };
    storage.setItem(XZX_TOKEN_KEY, JSON.stringify(globalToken));
  },
  // 获取token
  getToken() {
    let token =
      globalToken != null
        ? globalToken
        : JSON.parse(storage.getItem(XZX_TOKEN_KEY)) || {};
    if (token["accessToken"]) {
      let timestamp = token.timestamp;
      let timeCalc = new Date() - timestamp;
      if (timeCalc > (10 * 3600 * 1000)) {
        this.clean();
        return ''
      // } else if (timeCalc > (12 * 3600 * 1000)) { // 设置12小时过期时间
      //   return ''
      }
      return token["accessToken"];
    } else {
      return "";
    }
  },
  getEnterpriseInfo() {
    return new Promise((resolve, reject) => {
      fly
        .get(`/H_roleplay-si/na/enterpriseInfo`)
        .then(res => {
          let data = {};
          res.data.map(p => {
            data[p.PROPERTY] = p.VALUE;
          });
          resolve(data);
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
  // 登录
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
  // PC端登录，默认返回token
  pcLogin(userInfo, key = "token") {
    var that = this;
    return new Promise((resolve, reject) => {
      let params = {
        method: "post",
        baseURL: process.env.VUE_APP_API,
        url: "/api/Authenticate",
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
          this.setToken(data['result'] || "");
          resolve(data);
        })
        .catch(function(error) {
          let res = error.response;
          let data = (res && res.data) || {};
          let message = data.error.message || "请求异常";
          reject({
            success: false,
            message: message
          });
        });
    });
  },
  //发送验证码
  sendTestCode(mobile) {
    return new Promise((resolve, reject) => {
      let params = {
        method: "post",
        baseURL: process.env.VUE_APP_API,
        url: "/H_roleplay-si/sendVerification",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          userCode: mobile
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
  appLogin() {
    var that = this;
    return new Promise((resolve, reject) => {
      window.DsService.getToken(function(tokenString) {
        if (tokenString) {
          let token = JSON.parse(tokenString) || {};
          if (token["token"]) {
            that.setToken(token);
          } else if (router.history.current.path != "/login") {
            console.log("app token 格式不 正确");
            router.push("/login");
          }
          resolve(token["token"]);
        } else if (router.history.current.path != "/login") {
          reject({ message: "没有拿到app token:" } + tokenString);
          router.push("/login");
        }
      });
    });
  },
  toLoginPage() {
    if (router.history.current.path != "/login") {
      router.push("/login");
    }
    return new Promise((resolve, reject) => {
      resolve();
    });
  },
  register(data){
    return new Promise((resolve, reject) => {
      let params = {
        method: "post",
        baseURL: process.env.VUE_APP_API,
        url: "/api/app/user/emailRegister",
        headers: {
          "Content-Type": "application/json"
        },
        data: data
      };
      fly
        .request(params, params.data)
        .then(res => {
          console.log(res)
          resolve(res);
        })
        .catch(function(error) {
          let res = error.response;
          let data = (res && res.data) || {};
          let message = data.error.message || "请求异常";
          reject({
            success: false,
            message: message
          });
        });
    }); 
  }
};
export default tokenService;
