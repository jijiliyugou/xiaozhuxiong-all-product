// 产品搜索首页
const BsProductSearchIndex = () =>
  import(
    "@/views/bsPage/bsProductSearch/bsProductSearchIndex/BsProductSearchIndex.vue"
  );
//  我的收藏
const BsMyCollection = () =>
  import("@/views/bsPage/bsProductSearch/bsMyCollection/BsMyCollection.vue");

//  最新产品
const BsLatestProducts = () =>
  import(
    "@/views/bsPage/bsProductSearch/bsLatestProducts/BsLatestProducts.vue"
  );

// 浏览足迹
const BsBrowsingFootprints = () =>
  import(
    "@/views/bsPage/bsProductSearch/bsBrowsingFootprints/BsBrowsingFootprints.vue"
  );

//  现货产品
const BsSpotProducts = () =>
  import("@/views/bsPage/bsProductSearch/bsSpotProducts/BsSpotProducts.vue");

//  VIP产品
const BsVIPProducts = () =>
  import("@/views/bsPage/bsProductSearch/bsVIPProducts/BsVIPProducts.vue");

//  产品管理
const BsProductManageIndex = () =>
  import(
    "@/views/bsPage/bsProductSearch/bsProductManageIndex/BsProductManageIndex.vue"
  );

export default [
  {
    path: "/bsIndex/bsProductSearchIndex",
    name: "bsProductSearchIndex",
    component: BsProductSearchIndex,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsMyCollection",
    name: "bsMyCollection",
    component: BsMyCollection,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsLatestProducts",
    name: "bsLatestProducts",
    component: BsLatestProducts,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsBrowsingFootprints",
    name: "bsBrowsingFootprints",
    component: BsBrowsingFootprints,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsSpotProducts",
    name: "bsSpotProducts",
    component: BsSpotProducts,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsVIPProducts",
    name: "bsVIPProducts",
    component: BsVIPProducts,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsProductManageIndex",
    name: "bsProductManageIndex",
    component: BsProductManageIndex,
    meta: {
      keepAlive: true
    }
  }
];
