const DontLoadDerivedSampleList = () =>
  import(
    "@/components/dontLoad/dontLoadDerivedSampleList/dontLoadDerivedSampleList.vue"
  );
const DontLoadShareFactory = () =>
  import("@/components/dontLoad/dontLoadShareFactory/dontLoadShareFactory.vue");
const DontLoadShareFactoryAllProducts = () =>
  import(
    "@/components/dontLoad/dontLoadShareFactory/dontLoadShareFactoryAllProducts/dontLoadShareFactoryAllProducts.vue"
  );
const DontLoadShareFactoryProductDetails = () =>
  import(
    "@/components/dontLoad/dontLoadShareFactory/dontLoadShareFactoryProductDetails/dontLoadShareFactoryProductDetails.vue"
  );
const DontLoadShareFactoryPC = () =>
  import(
    "@/components/dontLoad/dontLoadShareFactory/dontLoadShareFactoryPC/dontLoadShareFactoryPC.vue"
  );
const DontLoadShareFactoryAllProductsPC = () =>
  import(
    "@/components/dontLoad/dontLoadShareFactory/dontLoadShareFactoryPC/dontLoadShareFactoryAllProductsPC/dontLoadShareFactoryAllProductsPC.vue"
  );
const DontLoadProductDetailsPC = () =>
  import(
    "@/components/dontLoad/dontLoadShareFactory/dontLoadShareFactoryPC/dontLoadProductDetailsPC/dontLoadProductDetailsPC.vue"
  );

export default [
  {
    path: "/dontLoadDerivedSampleList",
    name: "dontLoadDerivedSampleList",
    component: DontLoadDerivedSampleList
  },
  {
    path: "/dontLoadShareFactory",
    name: "dontLoadShareFactory",
    component: DontLoadShareFactory
  },
  {
    path: "/dontLoadAllProducts",
    name: "dontLoadAllProducts",
    component: DontLoadShareFactoryAllProducts
  },
  {
    path: "/dontLoadProductDetails",
    name: "dontLoadProductDetails",
    component: DontLoadShareFactoryProductDetails
  },
  {
    path: "/dontLoadShareFactoryPC",
    name: "dontLoadShareFactoryPC",
    component: DontLoadShareFactoryPC
  },
  {
    path: "/dontLoadShareFactoryAllProductsPC",
    name: "dontLoadShareFactoryAllProductsPC",
    component: DontLoadShareFactoryAllProductsPC
  },
  {
    path: "/dontLoadProductDetailsPC",
    name: "dontLoadProductDetailsPC",
    component: DontLoadProductDetailsPC
  }
];
