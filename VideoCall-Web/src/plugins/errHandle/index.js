/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: gaojiahao
 * @Date: 2020-10-20 14:22:42
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-15 16:17:03
 */
import Vue from "vue";
import { Message } from "view-design";

// 错误处理回调
export default function errorHandler(err) {
  if (err && (err.includes("查询") || err.includes("database"))) {
    err = "抱歉，数据似乎出了点问题，请稍后重试";
  }
  // 弹窗提醒
  // Message.info({
  //   background: true,
  //   content: '接口出错：'+err,
  // });
}
