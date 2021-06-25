//公司管理
const BsCompanyManage = () =>
  import("@/views/bsPage/bsClientsManage/bsCompanyManage/BsCompanyManage.vue");

//合并公司
const BsMergeCompany = () =>
  import("@/views/bsPage/bsClientsManage/bsMergeCompany/BsMergeCompany.vue");

export default [
  {
    path: "/bsIndex/bsCompanyManage",
    name: "bsCompanyManage",
    component: BsCompanyManage,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsMergeCompany",
    name: "bsMergeCompany",
    component: BsMergeCompany,
    meta: {
      keepAlive: true
    }
  }
];
