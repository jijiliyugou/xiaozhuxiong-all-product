// 我的产品
const BsMyProduct = () =>
  import("@/views/bsPage/bsProductManage/bsMyProduct/BsMyProduct.vue");

// 产品视频
const BsProductVideo = () =>
  import("@/views/bsPage/bsProductManage/bsProductVideo/BsProductVideo.vue");

// 3D产品
const BsAbbrProduct = () =>
  import("@/views/bsPage/bsProductManage/bsAbbrProduct/BsAbbrProduct.vue");

// 我的店铺
const BsMyShop = () =>
  import("@/views/bsPage/bsProductManage/bsMyShop/BsMyShop.vue");

// 证书管理
const BsCertificateManages = () =>
  import(
    "@/views/bsPage/bsProductManage/bsCertificateManages/BsCertificateManages.vue"
  );

// 产品活动
const BsProductActivity = () =>
  import(
    "@/views/bsPage/bsProductManage/bsProductActivity/BsProductActivity.vue"
  );

// 产品价格
const BsProductPrice = () =>
  import("@/views/bsPage/bsProductManage/bsProductPrice/BsProductPrice.vue");

// 产品区域
const BsProductDistrict = () =>
  import(
    "@/views/bsPage/bsProductManage/bsProductDistrict/BsProductDistrict.vue"
  );

export default [
  {
    path: "/bsIndex/bsMyProduct",
    name: "bsMyProduct",
    component: BsMyProduct,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsProductVideo",
    name: "bsProductVideo",
    component: BsProductVideo,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsAbbrProduct",
    name: "bsAbbrProduct",
    component: BsAbbrProduct,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsMyShop",
    name: "bsMyShop",
    component: BsMyShop,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsCertificateManages",
    name: "bsCertificateManages",
    component: BsCertificateManages,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsProductActivity",
    name: "bsProductActivity",
    component: BsProductActivity,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsProductPrice",
    name: "bsProductPrice",
    component: BsProductPrice,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsProductDistrict",
    name: "bsProductDistrict",
    component: BsProductDistrict,
    meta: {
      keepAlive: true
    }
  }
];
