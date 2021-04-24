/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: gaojiahao
 * @Date: 2020-11-27 10:49:37
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-31 15:20:40
 */
import pageLoading from "./loading.vue";

let [FromLoading, pageLoadInstance] = [{}, null];

FromLoading.install = Vue => {
  if (!pageLoadInstance) {
    // 扩展vue实例，引入loading
    const FromLoading = Vue.extend(pageLoading);
    // 创建loading实例并挂载
    pageLoadInstance = new FromLoading().$mount();
    document.body.appendChild(pageLoadInstance.$el);
  }
  // $loading即是你后期调用的名称
  Vue.prototype.$FromLoading = {
    show(text) {
      pageLoadInstance.show = true;
      pageLoadInstance.text = text||"Loading";
    },
    hide(text) {
      pageLoadInstance.show = false;
      pageLoadInstance.text = text||"Loading";
    }
  };
};

export default FromLoading;
