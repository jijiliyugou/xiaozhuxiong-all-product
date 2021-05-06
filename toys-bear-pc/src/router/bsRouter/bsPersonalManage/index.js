// 账号管理
const BsAccountManage = () =>
  import("@/views/bsPage/bsPersonalManage/bsAccountManage/BsAccountManage.vue");

// 报价设置
const BsQuotationSettings = () =>
  import(
    "@/views/bsPage/bsPersonalManage/bsQuotationSettings/BsQuotationSettings.vue"
  );

// 推送设置
const BsPushSettings = () =>
  import("@/views/bsPage/bsPersonalManage/bsPushSettings/BsPushSettings.vue");

// 推送详情
const BsPushIndex = () =>
  import("@/components/commonComponent/pushDetailsComponent/bsPushIndex.vue");

// 好友方式
const BsContactWay = () =>
  import("@/views/bsPage/bsPersonalManage/bsContactWay/BsContactWay.vue");

export default [
  {
    path: "/bsIndex/bsAccountManage",
    name: "bsAccountManage",
    component: BsAccountManage,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsQuotationSettings",
    name: "bsQuotationSettings",
    component: BsQuotationSettings,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsPushSettings",
    name: "bsPushSettings",
    component: BsPushSettings,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsPushIndex",
    name: "bsPushIndex",
    component: BsPushIndex,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsContactWay",
    name: "bsContactWay",
    component: BsContactWay,
    meta: {
      keepAlive: true
    }
  }
];
