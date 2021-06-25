//分类管理
const BsClassifyManage = () =>
  import("@/views/bsPage/bsBasicsInfo/bsClassifyManage/BsClassifyManage.vue");

//分类分配
const BsClassifyAllocation = () =>
  import(
    "@/views/bsPage/bsBasicsInfo/bsClassifyAllocation/BsClassifyAllocation.vue"
  );

//分类管理
const BsProductPackManage = () =>
  import(
    "@/views/bsPage/bsBasicsInfo/bsProductPackManage/BsProductPackManage.vue"
  );

//分类管理
const BsProductPackAllocation = () =>
  import(
    "@/views/bsPage/bsBasicsInfo/bsProductPackAllocation/BsProductPackAllocation.vue"
  );

//分类管理
const BsAdvertisingManage = () =>
  import(
    "@/views/bsPage/bsBasicsInfo/bsAdvertisingManage/BsAdvertisingManage.vue"
  );

//分类管理
const BsRegionManage = () =>
  import("@/views/bsPage/bsBasicsInfo/bsRegionManage/BsRegionManage.vue");

//分类管理
const BsBrandManage = () =>
  import("@/views/bsPage/bsBasicsInfo/bsBrandManage/BsBrandManage.vue");

export default [
  {
    path: "/bsIndex/bsClassifyManage",
    name: "bsClassifyManage",
    component: BsClassifyManage,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsClassifyAllocation",
    name: "bsClassifyAllocation",
    component: BsClassifyAllocation,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsProductPackManage",
    name: "bsProductPackManage",
    component: BsProductPackManage,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsProductPackAllocation",
    name: "bsProductPackAllocation",
    component: BsProductPackAllocation,
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
  },
  {
    path: "/bsIndex/bsRegionManage",
    name: "bsRegionManage",
    component: BsRegionManage,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsBrandManage",
    name: "bsBrandManage",
    component: BsBrandManage,
    meta: {
      keepAlive: true
    }
  }
];
