/** 产品查询模块 */
import BsProductSearchModel from "./bsProductSearch/index";
/** 产品管理模块 */
import BsProductManageModel from "./bsProductManage/index";
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
/** 客户管理模块 */
import BsClientsManageModel from "./bsClientsManage/index";
/** 基础信息模块 */
import BsbsBasicsInfoModel from "./bsBasicsInfo/index";
/** 统计管理模块 */
import BsStatisticsManageModel from "./bsStatisticsManage/index";
/** 运营数据模块 */
import BsOperationalDataModel from "./bsOperationalData/index";
/** 系统设置模块 */
import BsSystemSetModel from "./bsSystemSet/index";

export default [
  ...BsProductSearchModel,
  ...BsProductManageModel,
  ...BsMyNewsModel,
  ...BsBusinessManageModel,
  ...BsSiteSharingModel,
  ...BsPersonalManageModel,
  ...BsMyClientsModel,
  ...BsClientsManageModel,
  ...BsbsBasicsInfoModel,
  ...BsStatisticsManageModel,
  ...BsOperationalDataModel,
  ...BsSystemSetModel
];
