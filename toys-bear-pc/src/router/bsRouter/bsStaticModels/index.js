/** 后台首页 */
const BsHome = () => import("@/views/bsPage/bsHome/BsHome.vue");

/** 产品详情 */
const BsProductDetails = () =>
  import(
    "@/views/bsPage/bsProductSearch/bsProductDetails/BsProductDetails.vue"
  );

/** 客户订单详情 */
const BsClientOrderDetails = () =>
  import(
    "@/views/bsPage/bsSiteSharing/bsCustomerOrder/bsClientOrderDetails/BsClientOrderDetails.vue"
  );

/** 展厅业务订单详情 */
const BsHallBusinessOrderDetails = () =>
  import(
    "@/views/bsPage/bsBusinessManage/bsHallBusiness/bsHallBusinessOrderDetails/BsHallBusinessOrderDetails.vue"
  );

// 找样报价-报价详情
const BsSampleQuotationDetails = () =>
  import(
    "@/components/bsComponents/bsSampleComponent/bsSampleQuotationDetails.vue"
  );
// 找样报价-选择报价商品
const BsSampleOfferCommodity = () =>
  import(
    "@/components/bsComponents/bsSampleComponent/bsSampleOfferCommodity.vue"
  );

// 找样报价-编辑详情
const BsSampleUpdata = () =>
  import("@/components/bsComponents/bsSampleComponent/bsSampleUpdata.vue");

// 查询厂商详情页
const BsMyClientsDetail = () =>
  import(
    "@/components/bsComponents/bsMyClientsComponent/bsMyClientsDetail.vue"
  );

/** 客户订单详情 */
const BsPurchaseOrderDetails = () =>
  import(
    "@/views/bsPage/bsBusinessManage/bsPurchaseOrder/bsPurchaseOrderDetails/BsPurchaseOrderDetails.vue"
  );

export default [
  {
    path: "/bsIndex/bsHome",
    name: "bsHome",
    component: BsHome
  },
  {
    path: "/bsIndex/bsProductDetails",
    name: "bsProductDetails",
    component: BsProductDetails
  },
  {
    path: "/bsIndex/bsClientOrderDetails",
    name: "bsClientOrderDetails",
    component: BsClientOrderDetails
  },
  {
    path: "/bsIndex/bsHallBusinessOrderDetails",
    name: "bsHallBusinessOrderDetails",
    component: BsHallBusinessOrderDetails
  },
  {
    path: "/bsIndex/bsSampleQuotationDetails",
    name: "bsSampleQuotationDetails",
    component: BsSampleQuotationDetails
  },
  {
    path: "/bsIndex/BsSampleOfferCommodity",
    name: "BsSampleOfferCommodity",
    component: BsSampleOfferCommodity
  },
  {
    path: "/bsIndex/bsSampleUpdata",
    name: "bsSampleUpdata",
    component: BsSampleUpdata
  },
  {
    path: "/bsIndex/bsMyClientsDetail",
    name: "bsMyClientsDetail",
    component: BsMyClientsDetail
  },
  {
    path: "/bsIndex/bsPurchaseOrderDetails",
    name: "bsPurchaseOrderDetails",
    component: BsPurchaseOrderDetails
  },
  {
    path: "/bsIndex",
    redirect: "/bsIndex/bsHome"
  }
];
