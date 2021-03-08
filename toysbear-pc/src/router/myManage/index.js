const MyCustomer = () => import("@/views/myManage/myCustomer.vue");
const MyProduct = () => import("@/views/myManage/myProduct.vue");
const ProductMan = () => import("@/views/myManage/productMan.vue");
const CompanyMan = () => import("@/views/myManage/companyMan.vue");
const AdvertisingMan = () => import("@/views/myManage/advertisingMan.vue");
const InfoTemplate = () => import("@/views/myManage/infoTemplate.vue");
const DefaultFormulaMan = () =>
  import("@/views/myManage/defaultFormulaMan.vue");
const BearproductOff = () => import("@/views/myManage/bearproductOff.vue");
const OffHallMan = () => import("@/views/myManage/offHallMan.vue");
const AuthHallList = () => import("@/views/myManage/authHallList.vue");
const PermissionSetting = () =>
  import("@/views/myManage/permissionSetting.vue");
const CustomerManagement = () =>
  import("@/views/myManage/customerManagement.vue");
const CompanyShare = () => import("@/views/myManage/companyShare.vue");
const SampleManage = () => import("@/views/myManage/sampleManage.vue");
const ShoppingCart = () => import("@/views/myManage/shoppingCart.vue");
export default [
  {
    path: "/myCustomer",
    name: "myCustomer",
    component: MyCustomer
  },
  {
    path: "/myProduct",
    name: "myProduct",
    component: MyProduct
  },
  {
    path: "/productMan",
    name: "productMan",
    component: ProductMan
  },
  {
    path: "/advertisingMan",
    name: "advertisingMan",
    component: AdvertisingMan
  },
  {
    path: "/infoTemplate",
    name: "infoTemplate",
    component: InfoTemplate
  },
  {
    path: "/companyMan",
    name: "companyMan",
    component: CompanyMan
  },
  {
    path: "/defaultFormulaMan",
    name: "defaultFormulaMan",
    component: DefaultFormulaMan
  },
  {
    path: "/bearproductOff",
    name: "bearproductOff",
    component: BearproductOff
  },
  {
    path: "/offHallMan",
    name: "offHallMan",
    component: OffHallMan
  },
  {
    path: "/authHallList",
    name: "authHallList",
    component: AuthHallList
  },
  {
    path: "/permissionSetting",
    name: "permissionSetting",
    component: PermissionSetting
  },
  {
    path: "/customerManagement",
    name: "customerManagement",
    component: CustomerManagement
  },
  {
    path: "/companyShare",
    name: "companyShare",
    component: CompanyShare
  },
  {
    path: "/sampleManage",
    name: "sampleManage",
    component: SampleManage
  },
  {
    path: "/shoppingCart",
    name: "shoppingCart",
    component: ShoppingCart
  }
];
