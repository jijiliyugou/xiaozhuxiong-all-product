/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: gaojiahao
 * @Date: 2020-10-19 15:27:12
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-22 11:09:50
 */
import Vue from "vue";
import VueRouter from "vue-router";
import tokenService from "@service/tokenService";
Vue.use(VueRouter);

const routes = [
  { 
    path: '/', 
    name: "Home",
    component: resolve=>(require(["@views/Home"],resolve)),
    meta: {
      title: "宏升视频会议",
      auth: true      //检查权限true
    },
    children:[
    
    ]
  },
  { 
    path: '/createMeeting', 
    name: "createMeeting",
    component: resolve=>(require(["@views/meeting/createMeeting"],resolve)),
    meta: {
      title: "创建会议",
      auth: true
    },
  },
  { 
    path: '/addMeeting', 
    name: "addMeeting",
    component: resolve=>(require(["@views/meeting/addMeeting"],resolve)),
    meta: {
      title: "进入会议",
      // auth: true
    },
  },
  {
    path: "/login",
    name: "Login",
    component: resolve=>(require(["@views/Login"],resolve)),
    meta: {
      title: "登录"
    }
  },
  {
    path: "*",
    name: "/errorHandler",
    component: resolve=>(require(['@components/public/errorHandler'],resolve)),
    meta: {
      title: "页面出错"
    }
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
  base: "videoMeeting"
});

/**
 * @name: gaojiahao
 * @test: 路由全局前置守卫
 * @msg:
 * @param {*}
 * @return {*}
 */
router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth)) {
    if(to.name == "Login"){
      tokenService.clean();  
    }
    // 对路由进行验证
    if (tokenService.getToken() != "" && to.name !== "Login") {
      // 已经登陆
      next(); // 正常跳转到你设置好的页面
    } else {
      next({ path: "/login" });
      // next();
    }
  } else {
    next();
  }
});

const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
export default router;
