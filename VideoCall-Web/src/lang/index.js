/*
 * @Description:
 * @Author: gaojiahao
 * @Date: 2021-03-31 20:28:01
 * @FilePath: \projectd:\LittleBearPC\VideoCall-Web\src\lang\index.js
 * @LastEditTime: 2021-04-01 11:27:31
 * @LastEditors: sueRimn
 * @Descripttion:
 * @version: 1.0.0
 */

import Vue from "vue"; // 引入vue
import VueI18n from "vue-i18n"; // 引入i18n模块
import Cookies from "js-cookie"; // 封装了获取，设置，删除cookie的方法
import elementEnLocale from "iview/src/locale/lang/en-US"; // element-ui英文包
import elementZhLocale from "iview/src/locale/lang/zh-CN"; // element-ui中文包
import enLocale from "./en"; // 本地英文包
import zhLocale from "./zh"; // 本地中文包

Vue.use(VueI18n); // vue使用i18n模块
// 引入本地
const messages = {
  en: {
    ...enLocale, // es6的拓展运算符，相当于解析出每个对象
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  }
};
// 创建国际化实例
const i18n = new VueI18n({
  locale: Cookies.get("language") || "zh", // set locale，默认中文
  messages // set locale messages。语言包
});
locale.i18n((key, value) => i18n.t(key, value));
export default i18n;
