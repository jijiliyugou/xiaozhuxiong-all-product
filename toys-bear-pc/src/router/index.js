import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/index";
// import axios from "axios";
// import { Message } from "element-ui";
import { staticRouters, setMenuTree } from "./routers";
// const originalPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err);
// };
//解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
//push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};
//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};
Vue.use(VueRouter);
// 获取cookit

// 获取token
function getToken() {
  return new Promise((result, reject) => {
    Vue.prototype.$http
      .post("/api/GetToken", {
        companyNum: "LittleBearWeb",
        platForm: "PC"
      })
      .then(res => {
        result(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
// 获取系统参数
function getClientTypeList(type, token) {
  return new Promise((result, reject) => {
    Vue.prototype.$http
      .post(
        "/api/ServiceConfigurationList",
        {
          basisParameters: type
        },
        {
          headers: {
            "content-type": "application/json",
            Utoken: token
          }
        }
      )
      .then(res => {
        if (res.data.result.code === 200) {
          result(res.data.result.item);
        } else {
          reject(res.data.result.item);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}
// 刷新个人登录信息
function resetPersonInfo(token) {
  return new Promise((result, reject) => {
    Vue.prototype.$http
      .post("/api/RefreshToken", {
        token: token
      })
      .then(res => {
        result(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
// 获取菜单
function getUserRoleMenu(token) {
  return new Promise((result, reject) => {
    Vue.prototype.$http
      .post(
        "/api/GetUserRoleMenu",
        {},
        {
          headers: {
            "content-type": "application/json",
            Utoken: token
          }
        }
      )
      .then(res => {
        result(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}
const routes = [...staticRouters];

const router = new VueRouter({
  routes
});
export async function getMenuFuc() {
  const list = store.state.routers;
  await setMenuTree(list, router);
}
// 拦截
router.beforeEach(async (to, from, next) => {
  // 如果没有登录token
  if (!store.state.userInfo) {
    // const token = Vue.prototype.$cookies.get("userInfo");
    const validityPeriod = Vue.prototype.$cookies.get("validityPeriod");
    if (validityPeriod) {
      console.log(validityPeriod, "登录cookie");
      const fd_location = JSON.stringify(validityPeriod);
      localStorage.setItem("validityPeriod", fd_location);
      console.log(
        "跳转保存的token和是否保存7天失效",
        validityPeriod,
        validityPeriod
      );
      const res = await resetPersonInfo(validityPeriod.token);
      store.commit("handlerLogin", true);
      // 设置token
      store.commit("setToken", res.data.result);
      store.commit(
        "setComparnyId",
        res.data.result.commparnyList[0].commparnyId
      );
      // 清空菜单状态
      const fd = {
        component: "bsHome",
        label: "后台首页",
        linkUrl: "/bsIndex/bsHome",
        name: "/bsIndex/bsHome",
        refresh: true
      };
      store.commit("updateActiveTab", fd);
      store.commit("closeTabAll");
      // 登录成功获取系统参数
      const Json = {};
      Json.MessageRestriction = await getClientTypeList(
        "MessageRestriction",
        validityPeriod.token
      );
      Json.UserRestrictions = await getClientTypeList(
        "UserRestrictions",
        validityPeriod.token
      );
      Json.NoticeRestrictions = await getClientTypeList(
        "NoticeRestrictions",
        validityPeriod.token
      );
      Json.CompanyRestrictions = await getClientTypeList(
        "CompanyRestrictions",
        validityPeriod.token
      );
      Json.PlatForm = await getClientTypeList("PlatForm", validityPeriod.token);
      Json.packageManage = await getClientTypeList(
        "packageManage",
        validityPeriod.token
      );
      store.commit("globalJson/setGlobalJson", Json);
      // 登录成功获取菜单
      const menus = await getUserRoleMenu(validityPeriod.token);
      if (menus.data.result.code === 200) {
        store.commit("setRouters", menus.data.result.item.modulesList || []);
        await getMenuFuc();
      }
      next({ path: "/bsIndex" });
    } else {
      const validityPeriod = localStorage.getItem("validityPeriod");
      if (validityPeriod) {
        const options = JSON.parse(validityPeriod);
        if (options.dateTime) {
          const currentDate = Date.now();
          // 一天的时间戳为86400000
          const day = 86400000 * 7;
          // 超过7天
          if (currentDate - options.dateTime >= day) {
            const result = await getToken();
            if (result.data.result.code === 200) {
              // accessToken = result.data.result.item;
              store.commit("setToken", {
                accessToken: result.data.result.item
              });
            }
            return next({ path: "/login" });
          } else {
            console.log(123, "刷新token", options.token);
            // 刷新token
            const res = await resetPersonInfo(options.token);
            store.commit("handlerLogin", true);
            console.log(res);
            // 设置token
            store.commit("setToken", res.data.result);
            store.commit(
              "setComparnyId",
              res.data.result.commparnyList[0].commparnyId
            );
            // 登录成功获取系统参数
            const Json = {};
            Json.MessageRestriction = await getClientTypeList(
              "MessageRestriction",
              options.token
            );
            Json.UserRestrictions = await getClientTypeList(
              "UserRestrictions",
              options.token
            );
            Json.NoticeRestrictions = await getClientTypeList(
              "NoticeRestrictions",
              options.token
            );
            Json.CompanyRestrictions = await getClientTypeList(
              "CompanyRestrictions",
              options.token
            );
            Json.PlatForm = await getClientTypeList("PlatForm", options.token);
            Json.packageManage = await getClientTypeList(
              "packageManage",
              options.token
            );
            store.commit("globalJson/setGlobalJson", Json);
            // 登录成功获取菜单
            const menus = await getUserRoleMenu(options.token);
            if (menus.data.result.code === 200) {
              store.commit(
                "setRouters",
                menus.data.result.item.modulesList || []
              );
              await getMenuFuc();
            }
            // 清空菜单状态
            const fd = {
              component: "bsHome",
              label: "后台首页",
              linkUrl: "/bsIndex/bsHome",
              name: "/bsIndex/bsHome",
              refresh: true
            };
            store.commit("updateActiveTab", fd);
            store.commit("closeTabAll");
            next({ path: "/bsIndex" });
          }
        } else {
          sessionStorage.clear();
          const res = await getToken();
          if (res.data.result.code === 200) {
            const obj = { accessToken: res.data.result.item };
            store.commit("setToken", obj);
          }
          if (to.path == "/login" || to.path == "/loginConfirm") {
            next();
          } else {
            return next({ path: "/login" });
          }
        }
      } else {
        sessionStorage.clear();
        const res = await getToken();
        if (res.data.result.code === 200) {
          const obj = { accessToken: res.data.result.item };
          store.commit("setToken", obj);
        }
        if (to.path == "/login" || to.path == "/loginConfirm") {
          next();
        } else {
          return next({ path: "/login" });
        }
      }
    }
  } else {
    if (store.state.isLogin) {
      next();
    } else {
      if (to.path == "/login" || to.path == "/loginConfirm") {
        next();
      } else {
        return next({ path: "/login" });
      }
    }
  }
});
export default router;
