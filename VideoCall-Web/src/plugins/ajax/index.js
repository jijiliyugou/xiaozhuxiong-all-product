/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: gaojiahao
 * @Date: 2020-10-19 15:30:49
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-04-26 10:40:11
 */
import conf from "./conf";
import ajax from "./ajax";

export default {
  ajax: ajax.ajax,
  post: ajax.post,
  put: ajax.put,
  upload: ajax.upload,
  request: ajax.request,
  postJSON: ajax.postJSON,
  agoraAjax: ajax.agoraAjax,
  conf
};
