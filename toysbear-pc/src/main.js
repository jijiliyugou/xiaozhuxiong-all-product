import Vue from "vue";
import App from "@/App.vue";
import { router } from "@/router/index.js";
import store from "@/store";
import "@/styles/base.less";
import myAxios from "@/request/http";
import md5 from "js-md5";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css";
import "@/assets/css/theme/index.css";
import RTM from "@/assets/js/signalROptions";
import Video from "video.js";
import "video.js/dist/video-js.css";
import "@/assets/css/globalVariable.less";
import _ from "lodash";
import ElTreeGrid from "element-tree-grid";
import wsConnection from "@/store/wsStore";
import VueClipboard from "vue-clipboard2";
import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme
import "@/assets/js/rem.js";
import { NoticeBar } from "vant";
Vue.use(VueQuillEditor);
Vue.use(VueClipboard);
Vue.use(NoticeBar);
Vue.prototype.$setWs = wsConnection;
Vue.component(ElTreeGrid.name, ElTreeGrid);
Vue.prototype.$video = Video;
Vue.prototype.$_ = _;

Vue.use(ElementUI);
Vue.prototype.$md5 = md5;
Vue.prototype.$RTM = RTM;

Vue.use(myAxios);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
  data: {
    eventHub: new Vue()
  },
  mounted() {
    window.onresize = () => {
      window.screenWidth = document.documentElement.clientWidth;
      store.state.screenWidth = window.screenWidth;
    };
  }
}).$mount("#app");
