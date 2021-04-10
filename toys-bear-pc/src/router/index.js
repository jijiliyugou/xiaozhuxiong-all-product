import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store/index";
import axios from "axios";
import { Message } from "element-ui";
import { staticRouters, setMenuTree } from "./routers";
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
Vue.use(VueRouter);
// 获取token
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
  if (!store.state.userInfo || !store.state.userInfo.accessToken) {
    try {
      const res = await getToken();
      const obj =
        typeof res === "string" && res.constructor === String
          ? { accessToken: res }
          : null;
      store.commit("setToken", obj);
      next();
    } catch (error) {
      if (error) Message.error("请求失败，请求接口为/api/GetToken");
      next();
    }
    if (
      to.path.includes("/beforeIndex") ||
      to.path.includes("/erp") ||
      to.path.includes("/login") ||
      to.path.includes("/offer") ||
      to.path.includes("/publicChat") ||
      to.path.includes("/dontLoad")
    ) {
      next();
    } else {
      return next({ path: "/login" });
    }
  } else {
    // 如果有登录token
    if (
      to.path.includes("/beforeIndex") ||
      to.path.includes("/login") ||
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
        console.log("没有登录");
        // 如果有token但是没有经过正规登录
        return next({ path: "/login" });
      }
    }
  }
});
export default router;
