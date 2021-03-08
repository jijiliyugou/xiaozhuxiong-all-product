import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import axios from "axios";
import { staticRouters, setMenuTree } from "./routers";
Vue.use(VueRouter);
function getToken() {
  return new Promise((result, reject) => {
    axios
      .post("/api/GetToken", {
        companyNum: "LittleBearWeb",
        platForm: "PC"
      })
      .then(res => {
        if (res.data.result.code === 200) {
          result(res.data.result.item);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}
export const router = new VueRouter({
  linkActiveClass: "router-link-active",
  mode: "hash",
  // mode: "history",
  routes: staticRouters
});
export async function getMenuFuc() {
  const list = store.state.routers;
  const routers = await setMenuTree(list);
  router.addRoutes(routers);
}
// 拦截
router.beforeEach(async (to, from, next) => {
  // 如果没有登录token
  if (!store.state.userInfo || !store.state.userInfo.accessToken) {
    const res = await getToken();
    const obj =
      typeof res === "string" && res.constructor === String
        ? { accessToken: res }
        : null;
    store.commit("setToken", obj);
    if (
      to.path.includes("/beforeIndex") ||
      to.path.includes("/erp") ||
      to.path.includes("/offer") ||
      to.path.includes("/publicChat") ||
      to.path.includes("/dontLoad")
    ) {
      next();
    } else {
      return next({ path: "/beforeIndex/login" });
    }
  } else {
    // 如果有登录token
    if (
      to.path.includes("/beforeIndex") ||
      to.path.includes("/erp") ||
      to.path.includes("/offer") ||
      to.path.includes("/publicChat") ||
      to.path.includes("/dontLoad")
    ) {
      next();
    } else {
      if (store.state.isLogin) {
        next();
      } else {
        // 如果有token但是没有经过正规登录
        return next({ path: "/beforeIndex/login" });
      }
    }
  }
});
// 路由报错
router.onError(error => {
  console.log(error);
  // 已有路由未配置页面文件的情况下就乖乖去404吧
  router.push("/404");
});
