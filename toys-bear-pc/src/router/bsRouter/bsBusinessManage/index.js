/*
 * @Description:
 * @Author: gaojiahao
 * @Date: 2021-03-31 17:09:19
 * @FilePath: \projectd:\LittleBearPC\toys-bear-pc\src\router\bsRouter\bsBusinessManage\index.js
 * @LastEditTime: 2021-06-23 15:54:34
 * @LastEditors: sueRimn
 * @Descripttion:
 * @version: 1.0.0
 */
// 展厅择样
const BsHallSample = () =>
  import("@/views/bsPage/bsBusinessManage/bsHallSample/BsHallSample.vue");

// 展厅业务
const BsHallBusiness = () =>
  import("@/views/bsPage/bsBusinessManage/bsHallBusiness/BsHallBusiness.vue");

// 公司业务
const BsCompanyBusiness = () =>
  import(
    "@/views/bsPage/bsBusinessManage/bsCompanyBusiness/BsCompanyBusiness.vue"
  );

// 厂商业务
const BsVendorBusiness = () =>
  import(
    "@/views/bsPage/bsBusinessManage/bsVendorBusiness/BsVendorBusiness.vue"
  );

// 择样明细
const BsHallSampleDetails = () =>
  import(
    "@/views/bsPage/bsBusinessManage/bsHallSampleDetails/BsHallSampleDetails.vue"
  );

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

//数据统计
const BsDataTotal = () =>
  import("@/views/bsPage/bsBusinessManage/bsDataTotal/bsDataTotal.vue");

//消息统计
const BsMessageStatistics = () =>
  import(
    "@/views/bsPage/bsBusinessManage/bsMessageStatistics/BsMessageStatistics.vue"
  );
//择样统计
const BsSampleSelectionStatistics = () =>
  import(
    "@/views/bsPage/bsBusinessManage/bsSampleSelectionStatistics/BsSampleSelectionStatistics.vue"
  );

//找样统计
const BsSampleStatistics = () =>
  import(
    "@/views/bsPage/bsBusinessManage/bsSampleStatistics/BsSampleStatistics.vue"
  );

//采购统计
const BsPurchaseStatistics = () =>
  import(
    "@/views/bsPage/bsBusinessManage/bsPurchaseStatistics/BsPurchaseStatistics.vue"
  );

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
    path: "/bsIndex/bsCompanyBusiness",
    name: "bsCompanyBusiness",
    component: BsCompanyBusiness,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsVendorBusiness",
    name: "bsVendorBusiness",
    component: BsVendorBusiness,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsHallSampleDetails",
    name: "bsHallSampleDetails",
    component: BsHallSampleDetails,
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
  },
  {
    path: "/bsIndex/bsDataTotal",
    name: "bsDataTotal",
    component: BsDataTotal,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsMessageStatistics",
    name: "bsMessageStatistics",
    component: BsMessageStatistics,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsSampleSelectionStatistics",
    name: "bsSampleSelectionStatistics",
    component: BsSampleSelectionStatistics,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsSampleStatistics",
    name: "bsSampleStatistics",
    component: BsSampleStatistics,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsPurchaseStatistics",
    name: "bsPurchaseStatistics",
    component: BsPurchaseStatistics,
    meta: {
      keepAlive: true
    }
  }
];
