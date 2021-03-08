import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import myAxios from "@/request/http";
import store from "./store";
import "@/globalStyle/base.less";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css";
import "@/assets/css/theme/index.css";
import ElementUI from "element-ui";

(function(doc, win) {
  var docEl = doc.documentElement;
  var resizeEvt =
    "orientationchange" in window ? "orientationchange" : "resize";
  var recalc = function() {
    var clientWidth = docEl.clientWidth || window.innerWidth;
    if (!clientWidth) return;
    if (clientWidth > 1024) {
      docEl.style.fontSize = clientWidth / 19.2 + "px";
    } else {
      docEl.style.fontSize = clientWidth / 7.5 + "px";
    }
  };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);
// 引入语言包，注意路径
import i18n from "@/assets/js/locales/index.js";
// element-ui国际化
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
});
Vue.config.productionTip = false;
Vue.use(myAxios);
new Vue({
  i18n,
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
