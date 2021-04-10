/** 产品查询模块 */
import BsProductSearchModel from "./bsProductSearch/index";
/** 我的消息模块 */
import BsMyNewsModel from "./bsMyNews/index";
/** 业务管理模块 */
import BsBusinessManageModel from "./bsBusinessManage/index";
/** 站点分享模块 */
import BsSiteSharingModel from "./bsSiteSharing/index";
/** 个人管理模块 */
import BsPersonalManageModel from "./bsPersonalManage/index";
/** 我的客户模块 */
import BsMyClientsModel from "./bsMyClients/index";

export default [
  ...BsProductSearchModel,
  ...BsMyNewsModel,
  ...BsBusinessManageModel,
  ...BsSiteSharingModel,
  ...BsPersonalManageModel,
  ...BsMyClientsModel
];
