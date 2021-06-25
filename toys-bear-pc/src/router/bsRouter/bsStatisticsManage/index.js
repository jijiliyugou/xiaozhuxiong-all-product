/*
 * @Description:
 * @Author: gaojiahao
 * @Date: 2021-06-19 17:32:48
 * @FilePath: \projectd:\LittleBearPC\toys-bear-pc\src\router\bsRouter\bsStatisticsManage\index.js
 * @LastEditTime: 2021-06-23 11:51:31
 * @LastEditors: sueRimn
 * @Descripttion:
 * @version: 1.0.0
 */
//App下载记录
const BsAppDownloadRecord = () =>
  import(
    "@/views/bsPage/bsStatisticsManage/bsAppDownloadRecord/BsAppDownloadRecord.vue"
  );
//产品查看记录
const BsProductQueryRecord = () =>
  import(
    "@/views/bsPage/bsStatisticsManage/bsProductQueryRecord/BsProductQueryRecord.vue"
  );
//推送记录
const BsPushRecord = () =>
  import("@/views/bsPage/bsStatisticsManage/bsPushRecord/BsPushRecord.vue");
//查询日志记录
const BsQueryLogRecord = () =>
  import(
    "@/views/bsPage/bsStatisticsManage/bsQueryLogRecord/BsQueryLogRecord.vue"
  );
//登录记录
const BsLoginRecord = () =>
  import("@/views/bsPage/bsStatisticsManage/bsLoginRecord/BsLoginRecord.vue");
//查询日志记录
const BsErrorLogRecord = () =>
  import(
    "@/views/bsPage/bsStatisticsManage/bsErrorLogRecord/BsErrorLogRecord.vue"
  );
//短信记录
const BsNoteRecord = () =>
  import("@/views/bsPage/bsStatisticsManage/bsNoteRecord/BsNoteRecord.vue");
export default [
  {
    path: "/bsIndex/bsAppDownloadRecord",
    name: "bsAppDownloadRecord",
    component: BsAppDownloadRecord,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsProductQueryRecord",
    name: "bsProductQueryRecord",
    component: BsProductQueryRecord,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsPushRecord",
    name: "bsPushRecord",
    component: BsPushRecord,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsQueryLogRecord",
    name: "BsQueryLogRecord",
    component: BsQueryLogRecord,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsLoginRecord",
    name: "bsLoginRecord",
    component: BsLoginRecord,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsErrorLogRecord",
    name: "bsErrorLogRecord",
    component: BsErrorLogRecord,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsNoteRecord",
    name: "bsNoteRecord",
    component: BsNoteRecord,
    meta: {
      keepAlive: true
    }
  }
];
