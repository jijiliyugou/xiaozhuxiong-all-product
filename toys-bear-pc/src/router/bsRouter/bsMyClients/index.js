//我的客户
const BsMyClients = () =>
  import("@/views/bsPage/bsMyClients/bsMyClients/BsMyClients.vue");

// 厂商查询
const BsVendorQuery = () =>
  import("@/views/bsPage/bsMyClients/bsVendorQuery/BsVendorQuery.vue");

//货场查询
const BsGoodsYardSearch = () =>
  import("@/views/bsPage/bsMyClients/bsGoodsYardSearch/BsGoodsYardSearch.vue");

export default [
  {
    path: "/bsIndex/bsMyClients",
    name: "bsMyClients",
    component: BsMyClients,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsVendorQuery",
    name: "bsVendorQuery",
    component: BsVendorQuery,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsGoodsYardSearch",
    name: "bsGoodsYardSearch",
    component: BsGoodsYardSearch,
    meta: {
      keepAlive: true
    }
  }
];
