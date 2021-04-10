// 展厅择样
const BsHallSample = () =>
  import("@/views/bsPage/bsBusinessManage/bsHallSample/BsHallSample.vue");
// 展厅业务
const BsHallBusiness = () =>
  import("@/views/bsPage/bsBusinessManage/bsHallBusiness/BsHallBusiness.vue");
// 购物车
const BsShoppingCart = () =>
  import("@/views/bsPage/bsBusinessManage/bsShoppingCart/BsShoppingCart.vue");
// 找样报价
const BsSampleQuotation = () =>
  import(
    "@/views/bsPage/bsBusinessManage/bsSampleQuotation/BsSampleQuotation.vue"
  );
// 采购订单
const BsPurchaseOrder = () =>
  import("@/views/bsPage/bsBusinessManage/bsPurchaseOrder/BsPurchaseOrder.vue");

export default [
  {
    path: "/bsIndex/bsHallSample",
    name: "bsHallSample",
    component: BsHallSample,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsHallBusiness",
    name: "bsHallBusiness",
    component: BsHallBusiness,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsShoppingCart",
    name: "bsShoppingCart",
    component: BsShoppingCart
  },
  {
    path: "/bsIndex/bsSampleQuotation",
    name: "bsSampleQuotation",
    component: BsSampleQuotation,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsPurchaseOrder",
    name: "bsPurchaseOrder",
    component: BsPurchaseOrder,
    meta: {
      keepAlive: true
    }
  }
];
