<template>
  <div class="bsSampleQuotationDetails">
    <div class="sample_title">业务详情</div>
    <!-- 业务头部信息 -->
    <div class="tablemian_left">
      <div class="tablemian_left_item">
        <p class="left_item">
          <span class="title">类型：</span>
          <span> {{ filterTypes(item.messageExt) }} </span>
        </p>
        <p class="left_item" v-if="item.the_nu">
          <span class="title">代号：</span>
          <span>{{ item.the_nu }}</span>
        </p>
        <p class="left_item">
          <span class="title">单号：</span>
          <span>{{ item.orderNumber }}</span>
        </p>
        <p
          :class="{
            left_item: true,
            red: item.orderStatus == '0',
            blue: item.orderStatus == '1',
            green: item.orderStatus == '9',
            gray: item.orderStatus == '99'
          }"
        >
          <span class="title">状态：</span>
          <span
            v-if="
              item.toCompanyNumer != userInfo.commparnyList[0].companyNumber &&
                item.orderStatus == '0'
            "
            >对方未读</span
          >
          <span
            v-else-if="
              item.toCompanyNumer == userInfo.commparnyList[0].companyNumber &&
                item.orderStatus == '0'
            "
            >--</span
          >
          <span
            v-if="
              item.toCompanyNumer != userInfo.commparnyList[0].companyNumber &&
                item.orderStatus == '1'
            "
            >对方已读</span
          >
          <span
            v-else-if="
              item.toCompanyNumer == userInfo.commparnyList[0].companyNumber &&
                item.orderStatus == '1'
            "
            >--</span
          >
          <span v-if="item.orderStatus == '9'">已完成</span>
          <span v-else-if="item.orderStatus == '99'">已取消</span>
        </p>
      </div>
      <div class="tablemian_left_item">
        <p class="left_item">
          <span class="title">时间：</span>
          <span>{{ item.createdOn && item.createdOn.replace(/T/, " ") }}</span>
        </p>
        <p class="left_content">
          <span class="title">内容：</span>
          <span class="left_content_content">{{ item.pushContent }}</span>
        </p>
      </div>
    </div>
    <div class="bsSampleTable" v-if="tableData.data.length">
      <div class="top">
        <div class="left">产品列表({{ totalCount }})</div>
        <div class="right">
          <el-button
            @click="exportTemplateDialog = true"
            size="medium"
            type="warning"
          >
            <i class="iconfont icon-daochujinruchukou"></i>
            导出列表
          </el-button>
          <el-button
            style="background-color: #F9AE3E;border-color: #F9AE3E;"
            type="warning"
            @click="openAdd"
            size="medium"
          >
            <i class="el-icon-shopping-cart-full" style="font-size: 16px;"></i>
            一键加购
          </el-button>
        </div>
      </div>
      <div class="tableBox">
        <bsTable :table="tableData" />
        <!-- 分页 -->
        <center style="padding:20px 0;">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 30, 40]"
            background
            :total="totalCount"
            :page-size="pageSize"
            :current-page.sync="currentPage"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          ></el-pagination>
        </center>
      </div>
    </div>
    <!-- 统计值 -->
    <Summary v-if="totalAmount" :summaryData="totalAmount"></Summary>
    <!-- 导出订单模板dialog -->
    <transition name="el-zoom-in-center">
      <el-dialog
        title="订单模板"
        class="exportOrder"
        v-if="exportTemplateDialog"
        :visible.sync="exportTemplateDialog"
        width="1200px"
      >
        <bsExportOrder
          :options="{
            orderNumber: item.orderNumber,
            the_nu: item.the_nu,
            name: item.fromCompanyName,
            api: '/api/GetSampleOrderExcel'
          }"
        />
      </el-dialog>
    </transition>
  </div>
</template>

<script>
import Summary from "@/components/summaryComponent/summary";
import bsExportOrder from "@/components/commonComponent/exportOrderComponent/commonYewu.vue";
import bsTable from "@/components/table";
import { mapState } from "vuex";
import eventBus from "@/assets/js/common/eventBus.js";
export default {
  name: "bsSampleQuotationDetails",
  components: {
    bsExportOrder,
    bsTable,
    Summary
  },
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      totalAmount: null,
      exportTemplateDialog: false,
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        isIndex: true,
        columns: [
          {
            prop: "name",
            label: "产品",
            width: 300,
            color: "#3368a9",
            align: "left",
            // isHiden: true,
            infoBox: true,
            productInfo: true,
            cartInfoIcon: true,
            elImage: row => {
              return row.imgUrl;
            },
            nameHtml: row => {
              return row.pr_na;
            },
            fcatoryNameHtml: row => {
              return row.supplierName;
            }
          },
          {
            prop: "supplierPhone",
            label: "联系厂商",
            render: row => {
              switch (row.supplierTelephoneNumber) {
                case "":
                case null:
                case undefined:
                case "null":
                case "undefined":
                  row.supplierTelephoneNumber = "";
                  break;
              }
              switch (row.supplierPhone) {
                case "":
                case null:
                case undefined:
                case "null":
                case "undefined":
                  row.supplierPhone = "";
                  break;
              }
              return row.supplierPhone + "<br>" + row.supplierTelephoneNumber;
            }
          },
          {
            prop: "exhibitionName",
            isHiden: true,
            label: "资料来源"
          },
          { prop: "fa_no", width: 60, label: "出厂货号", isHiden: true },
          { prop: "ch_pa", width: 80, label: "包装", isHiden: true },
          {
            prop: "pr_le",
            renderHeard: () => {
              return "产品规格</br>(cm)";
            },
            isHiden: true,
            render: row => {
              return row.pr_le + "x" + row.pr_wi + "x" + row.pr_hi;
            }
          },
          {
            prop: "pr_le",

            renderHeard: () => {
              return "包装规格</br>(cm)";
            },
            isHiden: true,
            render: row => {
              return row.in_le + "x" + row.in_wi + "x" + row.in_hi;
            }
          },
          {
            prop: "pr_le",

            renderHeard: () => {
              return "外箱规格</br>(cm)";
            },
            isHiden: true,
            render: row => {
              return row.ou_le + "x" + row.ou_wi + "x" + row.ou_hi;
            }
          },
          {
            prop: "in_en",

            renderHeard: () => {
              return "装箱量</br>(pcs)";
            },
            isHiden: true,
            render: row => {
              return row.in_en + "/" + row.ou_lo;
            }
          },
          {
            prop: "bulk_stere",

            renderHeard: () => {
              return "体积/材积</br>(cbm)/(cuft)";
            },
            isHiden: true,
            width: 150,
            render: row => {
              return row.bulk_stere + "/" + row.bulk_feet;
            }
          },
          {
            prop: "gr_we",

            renderHeard: () => {
              return "毛重/净重</br>(kg)";
            },
            isHiden: true,
            render: row => {
              return row.gr_we + "/" + row.ne_we;
            }
          },
          {
            prop: "fa_pr",
            label: "厂价",
            width: 100,
            color: "#3368A9",
            render: row => {
              return "￥" + row.fa_pr;
            }
          },
          {
            prop: "ha_in_qu",
            label: "报出价",
            width: 100,
            color: "red",
            render: row => {
              return (row.cu_de || "￥") + row.ha_in_qu;
            }
          },
          {
            prop: "OfferTotalAmount",
            label: "报出总价",
            width: 100,
            color: "red",
            render: row => {
              return (
                (row.cu_de || "￥") +
                this.$calculate.countTotalprice(
                  row.ha_in_qu,
                  row.ou_lo,
                  row.tAmount || 1
                )
              );
            }
          }
        ]
      },
      currentPage: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  async mounted() {
    await this.getSearchCompanyShareOrderDetailsPage();
    await this.getERPOrderTotal();
    if (this.userInfo.commparnyList[0].companyType != "Supplier") {
      this.tableData.columns.push({
        prop: "fa_pr",
        label: "状态",
        width: 80,
        color: "#3368A9",
        render: row => {
          return this.filterTypesAndState(row);
        }
      });
    } else {
      this.$set(this.tableData, "dropdown", {
        width: 100,
        title: "状态",
        list: []
      });
    }
  },
  methods: {
    // 一键加购
    openAdd() {
      this.$common.handlerMsgState({
        msg: "敬请期待",
        type: "warning"
      });
    },
    // 获取合计total
    async getERPOrderTotal() {
      const res = await this.$http.post("/api/GetERPOrderTotal", {
        id: this.item.erpOrderID
      });
      if (res.data.result.code === 200) {
        const obj = res.data.result.item;
        this.totalAmount = {
          totalDegree: obj.sumCount, // 总款数
          totalCartons: obj.sumtAmount, // 总箱数
          totalQuantity: obj.sumAmountOu_lo, // 总数量
          totalBulkStere: obj.sumBulk_stere, // 总体积
          totalBulkFeet: obj.sumBulk_feet, // 总材积
          totalGrWe: obj.sumGr_we, // 总毛重
          totalNeWe: obj.sumNe_we, // 总净重
          cu_de: obj.cu_de || "￥", // 币种
          totalMoney: obj.sumHa_in_quAll // 总金额
        };
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.factoryTotalCount &&
        this.currentPage != 1
      )
        return false;
      this.getSearchCompanyShareOrderDetailsPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getSearchCompanyShareOrderDetailsPage();
    },
    // 获取订单详情单
    async getSearchCompanyShareOrderDetailsPage() {
      const res = await this.$http.post("/api/GetERPOrderDetailPage", {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        id: this.item.erpOrderID
      });
      if (res.data.result.code === 200) {
        this.tableData.data = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
        eventBus.$emit("resetTotalCount");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 过滤消息状态
    filterTypesAndState(raw) {
      const current = this.item.typeList.find(
        val =>
          val.messageExt == raw.messageExt &&
          val.messageModel == raw.messageModel
      );
      if (current) {
        const child = current.itemList.find(
          val => val.itemValue == raw.messageStatus
        );
        if (child) return child.itemText;
        else return "--";
      }
    },
    // 过滤消息类型
    filterTypes(Ext) {
      const current = this.item.typeList.find(val => val.messageExt == Ext);
      if (current) return current.title;
      else return Ext;
    },
    //厂商跳转
    toFactory(item) {
      const fd = {
        name: item.supplierNumber,
        linkUrl: this.$route.path,
        component: "bsMyClientsDetail",
        refresh: true,
        label: item.supplierName,
        value: {
          companyNumber: item.supplierNumber,
          companyLogo: item.supplierPersonnelLogo,
          companyName: item.supplierName,
          contactsMan: item.supplierPersonnelName,
          phoneNumber: item.supplierPhone,
          address: item.supplierAddres || item.supplierAddress
        }
      };
      console.log(fd);
      this.$store.commit("myAddTab", fd);
    },
    // 点击产品名字跳转
    goDetails(row) {
      const fd = {
        name: row.productName + row.fa_no,
        linkUrl: "/bsIndex/bsSampleQuotation",
        component: "bsProductDetails",
        refresh: true,
        label: row.fa_no || "产品详情",
        value: row
      };
      this.$router.push("/bsIndex/bsProductSearchIndex");
      this.$store.commit("myAddTab", fd);
    },
    // 导出找样
    exportOrder() {
      this.orderRow = {
        sampleNumber: this.item.offerNumber,
        name: this.item.customerName,
        api: "/api/ExportSampleOfferToExcel"
      };
      this.exportTemplateDialog = true;
    }
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsSampleQuotationDetails {
  background-color: #fff;
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
  .sample_title {
    height: 50px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &::before {
      width: 4px;
      height: 14px;
      background-color: #3368a9;
      position: absolute;
      left: 0;
      top: 50%;
      content: "";
      transform: translate(0, -50%);
    }
  }
  .tablemian_left {
    width: 100%;
    .tablemian_left_item {
      display: flex;
      margin-top: 15px;
      .left_item {
        width: 370px;
        // line-height: 30px;
        color: #666;
        .title {
          color: #999;
        }
        &.red {
          color: #ff4848;
          .title {
            color: #ff4848;
          }
        }
        &.blue {
          color: #3368a9;
          .title {
            color: #3368a9;
          }
        }
        &.green {
          color: #33a96a;
          .title {
            color: #33a96a;
          }
        }
        &.gray {
          color: #999999;
          .title {
            color: #999999;
          }
        }
      }
      .left_content {
        flex: 1;
        // line-height: 30px;
        // margin-top: 10px;
        display: flex;
        margin-right: 20px;
        box-sizing: border-box;
        color: #666;
        // display: flex;
        .title {
          color: #999;
          white-space: nowrap;
        }
        .left_content_content {
          max-width: 820px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .bsSampleTable {
    padding-top: 15px;
    margin-bottom: 80px;

    .top {
      height: 55px;
      font-size: 15px;
      font-weight: 700;
      padding-left: 15px;
      box-sizing: border-box;
      position: relative;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  @{deep} .tableBox {
    .el-table {
      font-size: 13px;
      .inputNumber {
        width: 50px;
        outline: none;
        -moz-appearance: textfield;
        text-align: center;
        color: #ff3e3e;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
        }
      }
      .imgBox {
        text-align: left;
        display: flex;
        font-size: 14px;
        .el-image {
          cursor: pointer;
        }
        .productName {
          width: 130px;
          height: 60px;
          margin-left: 15px;
          cursor: pointer;
          .name,
          .factory {
            width: 130px;
            max-width: 130px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
          .factory {
            color: #3368a9;
            display: flex;
            align-items: center;
            .factoryName {
              cursor: pointer;
            }
            .icons {
              display: flex;
              .cartPhoneIcon,
              .cartInfoIcon {
                width: 20px;
                height: 20px;
                margin-left: 15px;
                cursor: pointer;
              }
              .cartPhoneIcon {
                background: url("~@/assets/images/cartPhoneIcon.png") no-repeat
                  center;
                background-size: contain;
              }
              .cartInfoIcon {
                background: url("~@/assets/images/cartInfoIcon.png") no-repeat
                  center;
                background-size: contain;
              }
            }
          }
          .name {
            margin-top: 8px;
          }
        }
      }
    }
  }
}
// 表格样式
@{deep} .el-table {
  /*
	 *改变浏览器默认的滚动条样式
	 */
  .el-table__body-wrapper::-webkit-scrollbar-track {
    background-color: #f8f8f8;
  }
  .el-table__body-wrapper::-webkit-scrollbar-track-piece {
    background-color: #f8f8f8;
  }
  .el-table__body-wrapper::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #dddddd;
    border-radius: 3px;
  }
  .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
  }
  .el-table__header {
    .cell {
      font-weight: 400;
      color: #666;
    }
  }
  .cell {
    padding: 0 2px;
  }
}
@{deep} .exportOrder {
  .el-dialog__body {
    padding: 0;
  }
}
@media screen and (max-width: 1768px) {
  .tableBtoBox {
    padding-right: 10px !important;
    bottom: 10px !important;
  }
}
@media screen and (min-width: 1919px) {
  .tableBtoBox {
    padding-right: 0px !important;
    bottom: 0px !important;
  }
}
</style>
