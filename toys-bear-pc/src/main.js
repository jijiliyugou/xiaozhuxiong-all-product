import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import myAxios from "@/request/index.js";
import "@/styles/base.less";
// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";

import element from "@/element/index";
import "@/assets/css/theme/index.css";
import { getMenuFuc } from "@/router/index";
import PreviewPic from "vue-preview-pictures"; // 预览
import waterfall from "vue-waterfall2";
import Video from "video.js";
import "video.js/dist/video-js.css";
import common from "@/utils/common";
import calculate from "@/utils/calculate";
import VueCookies from "vue-cookies";
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
// import VueAwesomeSwiper from "vue-awesome-swiper";
// Vue.use(VueAwesomeSwiper);
// import "swiper/dist/css/swiper.css";
/**
 * 全局组件集合
 */
import MessageComponent from "@/components/commonComponent/messageComponent/main.js";

Vue.prototype.$PreviewPic = PreviewPic;
Vue.prototype.$calculate = calculate;
Vue.prototype.$video = Video;
Vue.config.productionTip = false;
getMenuFuc();
// Vue.use(ElementUI);
Vue.use(element);
Vue.use(myAxios);
Vue.use(waterfall);
Vue.use(VueCookies);
Vue.use(common);
Vue.use(MessageComponent);
Vue.component(CollapseTransition.name, CollapseTransition);
// Input默认选中焦点
Vue.directive("focus", {
  inserted(el) {
    // 聚焦元素
    el.querySelector("input").focus();
  }
});
new Vue({
  router,
  store,
  render: h => h(App),
  data: {
    eventHub: new Vue()
  }
}).$mount("#app");
