import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import myAxios from "@/request/http";
import "@/styles/base.less";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/css/theme/index.css";
import { getMenuFuc } from "@/router/index";
import ExTableColumn from "ex-table-column";
import PreviewPic from "vue-preview-pictures"; // 预览
import waterfall from "vue-waterfall2";
import Video from "video.js";
import "video.js/dist/video-js.css";
import common from "@/utils/common";

/**
 * 全局组件集合
 */
import MessageComponent from "@/components/commonComponent/messageComponent/main.js";

Vue.component(ExTableColumn.name, ExTableColumn);
Vue.prototype.$PreviewPic = PreviewPic;
Vue.prototype.$video = Video;
Vue.config.productionTip = false;
getMenuFuc();
Vue.use(ElementUI);
Vue.use(myAxios);
Vue.use(waterfall);
Vue.use(common);
Vue.use(MessageComponent);

new Vue({
  router,
  store,
  render: h => h(App),
  data: {
    eventHub: new Vue()
  }
}).$mount("#app");
