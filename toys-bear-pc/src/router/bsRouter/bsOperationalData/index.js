//App版本管理
const BsAppVersionsManage = () =>
  import(
    "@/views/bsPage/bsOperationalData/bsAppVersionsManage/BsAppVersionsManage.vue"
  );
//vip管理
const BsVipManage = () =>
  import("@/views/bsPage/bsOperationalData/bsVipManage/BsVipManage.vue");
//现货管理
const BsSpotManage = () =>
  import("@/views/bsPage/bsOperationalData/bsSpotManage/BsSpotManage.vue");
//新品管理
const BsLatestManage = () =>
  import("@/views/bsPage/bsOperationalData/bsLatestManage/BsLatestManage.vue");
//在线人数
const BsOnlinePeople = () =>
  import("@/views/bsPage/bsOperationalData/bsOnlinePeople/BsOnlinePeople.vue");
//消息举报
const BsMessageReport = () =>
  import(
    "@/views/bsPage/bsOperationalData/bsMessageReport/BsMessageReport.vue"
  );
//游客管理
const BsSightseerManage = () =>
  import(
    "@/views/bsPage/bsOperationalData/bsSightseerManage/BsSightseerManage.vue"
  );
//站点设置
const BsSiteSet = () =>
  import("@/views/bsPage/bsOperationalData/bsSiteSet/BsSiteSet.vue");

export default [
  {
    path: "/bsIndex/bsAppVersionsManage",
    name: "bsAppVersionsManage",
    component: BsAppVersionsManage,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsVipManage",
    name: "bsVipManage",
    component: BsVipManage,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsSpotManage",
    name: "bsSpotManage",
    component: BsSpotManage,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsLatestManage",
    name: "bsLatestManage",
    component: BsLatestManage,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsOnlinePeople",
    name: "bsOnlinePeople",
    component: BsOnlinePeople,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsMessageReport",
    name: "bsMessageReport",
    component: BsMessageReport,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsSightseerManage",
    name: "bsSightseerManage",
    component: BsSightseerManage,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsSiteSet",
    name: "bsSiteSet",
    component: BsSiteSet,
    meta: {
      keepAlive: true
    }
  }
];
