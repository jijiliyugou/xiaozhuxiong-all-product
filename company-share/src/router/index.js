import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routers.js";
import $Store from "@/store";
//路由导航冗余报错（路由重复）
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
// 拦截
router.beforeEach(async (to, from, next) => {
  // 如果没有登录token
  if (to.path !== "/login" && to.path !== "/404" && !$Store.state.userInfo) {
    return next({ path: "/login" });
  }
  next();
});
// router.afterEach((to, from) => {
//   if (to.name == "shoppingCart" && from.name === "product") {
//     const isRefresh = sessionStorage.getItem("isRefresh");
//     console.log(to.name, isRefresh);
//     if (isRefresh == "0") {
//       sessionStorage.setItem("isRefresh", null);
//       window.location.reload();
//     } else {
//       sessionStorage.setItem("isRefresh", "0");
//     }
//   } else if (to.name === "product" && from.name === "shoppingCart") {
//     sessionStorage.setItem("isRefresh", "0");
//   }
// });
// 路由报错
router.onError(error => {
  console.log(error);
  // 已有路由未配置页面文件的情况下就乖乖去404吧
  router.push("/404");
});

export default router;
