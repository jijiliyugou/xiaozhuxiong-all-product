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
  }
];
