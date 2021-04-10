/** 登录模块 */
import loginRouters from "./loginRouter/loginRouter";
// 后台模块
import bsRouters from "./bsRouter/bsRouter";
// 后台静态模块
const BsIndex = () => import("@/views/bsPage/BsIndex.vue");
/** 404模块 */
import _404 from "@/router/404/index";
/** 后台首页模块 */
import bsStaticModels from "@/router/bsRouter/bsStaticModels/index";

/** ERP模块 */
// import ERP from "@/router/ERP/index";
/** 不需要loadding的模块 */
// import dontLoad from "@/router/dontLoad/index";
/** 报价分享模块 */
// import offer from "@/router/offer/index";
/** 公共聊天模块 */
// import publicChat from "@/router/publicChat/index";
/** 特殊搜索路由 */
// const SearchIndex = () => import("@/views/productSearch/searchIndex.vue");
/** 静态路由 */
export const staticRouters = [
  ...loginRouters,
  _404,
  {
    path: "/bsIndex",
    name: "bsIndex",
    component: BsIndex,
    children: bsStaticModels
  },
  {
    path: "/",
    redirect: "/login"
  }
];
export async function setMenuTree(menuTree, router) {
  if (menuTree) {
    for (let i = 0; i < menuTree.length; i++) {
      if (menuTree[i].children) {
        for (let j = 0; j < menuTree[i].children.length; j++) {
          for (const value of bsRouters) {
            if (value.path === menuTree[i].children[j].linkUrl) {
              router.addRoute("bsIndex", value);
            }
          }
        }
      }
    }
  }
}
