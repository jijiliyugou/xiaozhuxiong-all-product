/*
 * @Description:
 * @Author: gaojiahao
 * @Date: 2021-03-31 17:09:19
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\main.js
 * @LastEditTime: 2021-04-20 15:00:56
 * @LastEditors: sueRimn
 * @Descripttion:
 * @version: 1.0.0
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import VueI18n from "vue-i18n";
import zhLocale from "view-design/dist/locale/zh-CN";
import enLocale from "view-design/dist/locale/en-US";
import cn from "@lang/zh";
import us from "@lang/en";
import '@less/common';
import '@css/iconfont/iconfont.css';
import Loading from "@plugins/loading/pageLoad/loading";
import FromLoading from "@components/public/loading/loading.js";

Vue.use(ViewUI);
Vue.use(VueI18n);
Vue.use(Loading);
Vue.use(FromLoading);
Vue.prototype.$Message = ViewUI.Message;

Vue.locale = () => {};

Vue.config.productionTip = false;

const messages = {
  zh: Object.assign(cn, zhLocale),
  en: Object.assign(us, enLocale),
};
const i18n = new VueI18n({
  locale: localStorage.getItem("language") || "zh", // set locale
  messages // set locale messages
});

let vueMain = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
export default vueMain;
