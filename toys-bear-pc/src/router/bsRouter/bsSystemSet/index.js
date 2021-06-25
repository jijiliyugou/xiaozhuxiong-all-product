//系统参数
const BsSystemParameter = () =>
  import("@/views/bsPage/bsSystemSet/bsSystemParameter/BsSystemParameter.vue");
//菜单管理
const BsMenuManage = () =>
  import("@/views/bsPage/bsSystemSet/bsMenuManage/BsMenuManage.vue");
//角色管理
const BsRoleManage = () =>
  import("@/views/bsPage/bsSystemSet/bsRoleManage/BsRoleManage.vue");
//账号管理
const BsAccountManage = () =>
  import("@/views/bsPage/bsSystemSet/bsAccountManage/BsAccountManage.vue");

//消息模板管理
const BsMessageTemplateManage = () =>
  import(
    "@/views/bsPage/bsSystemSet/bsMessageTemplateManage/BsMessageTemplateManage.vue"
  );

//货厂查询
const BsYardManage = () =>
  import("@/views/bsPage/bsSystemSet/bsYardManage/BsYardManage.vue");

export default [
  {
    path: "/bsIndex/bsSystemParameter",
    name: "bsSystemParameter",
    component: BsSystemParameter,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsMenuManage",
    name: "bsMenuManage",
    component: BsMenuManage,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsRoleManage",
    name: "bsRoleManage",
    component: BsRoleManage,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsAccountManage",
    name: "bsAccountManage",
    component: BsAccountManage,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsMessageTemplateManage",
    name: "bsMessageTemplateManage",
    component: BsMessageTemplateManage,
    meta: {
      keepAlive: true
    }
  },
  {
    path: "/bsIndex/bsYardManage",
    name: "bsYardManage",
    component: BsYardManage,
    meta: {
      keepAlive: true
    }
  }
];
