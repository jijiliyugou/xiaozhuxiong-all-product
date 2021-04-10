const ErpHome = () => import("@/components/erpPage/erpHome.vue");
const ErpLogin = () => import("@/components/erpPage/erpLogin.vue");
const ErpOrder = () => import("@/components/erpPage/erpOrder.vue");
const ErpLoginConfirm = () =>
  import("@/components/erpPage/erpLoginConfirm.vue");

export default [
  {
    path: "/erpHome",
    name: "erpHome",
    component: ErpHome
  },
  {
    path: "/erpLogin",
    name: "erpLogin",
    component: ErpLogin
  },
  {
    path: "/erpOrder",
    name: "erpOrder",
    component: ErpOrder
  },
  {
    path: "/erpLoginConfirm",
    name: "erpLoginConfirm",
    component: ErpLoginConfirm
  }
];
