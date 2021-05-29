// 站点列表
const BsSiteLlis = () =>
  import("@/views/bsPage/bsSiteSharing/bsSiteLlis/BsSiteLlis.vue");
// 客户订单
const BsCustomerOrder = () =>
  import("@/views/bsPage/bsSiteSharing/bsCustomerOrder/BsCustomerOrder.vue");
// 站点设置
const BsSiteSettings = () =>
  import("@/views/bsPage/bsSiteSharing/bsSiteSettings/BsSiteSettings.vue");
//登录记录
const BsLoginHistory = () =>
  import("@/views/bsPage/bsSiteSharing/bsLoginHistory/BsLoginHistory.vue");

//浏览记录
const BsBrowsingHistory = () =>
  import(
    "@/views/bsPage/bsSiteSharing/bsBrowsingHistory/BsBrowsingHistory.vue"
  );
//广告管理
const BsAdvertisingManage = () =>
  import(
    "@/views/bsPage/bsSiteSharing/bsAdvertisingManage/BsAdvertisingManage.vue"
  );
export default [
  {
    path: "/bsIndex/bsSiteLlis",
    name: "bsSiteLlis",
    component: BsSiteLlis,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsCustomerOrder",
    name: "bsCustomerOrder",
    component: BsCustomerOrder,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsSiteSettings",
    name: "siteSettings",
    component: BsSiteSettings,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsLoginHistory",
    name: "bsLoginHistory",
    component: BsLoginHistory,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsBrowsingHistory",
    name: "bsBrowsingHistory",
    component: BsBrowsingHistory,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsAdvertisingManage",
    name: "bsAdvertisingManage",
    component: BsAdvertisingManage,
    meta: {
      keepAlive: true
    }
  }
];
