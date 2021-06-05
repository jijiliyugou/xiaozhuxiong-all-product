<template>
  <div class="clientOrderDetails">
    <div class="title">客户订单详情</div>
    <ul class="customerInfoBox">
      <li class="itemBox">
        <span>订单编号：</span>
        <span class="orderNumber">{{ item.orderNumber }}</span>
      </li>
      <div class="clientContentBox">
        <li class="clientItem">
          <span>客户：</span>
          <span class="content">{{ item.customerName }}</span>
        </li>
        <li class="clientItem">
          <span>业务员：</span>
          <span class="content">{{ item.createdBy }}</span>
        </li>
        <li class="clientItem">
          <span>公司名称：</span>
          <span class="content">{{ item.companyName }}</span>
        </li>
        <li class="clientItem">
          <span>联系人：</span>
          <span class="content">{{ item.contactName }}</span>
        </li>
        <li class="clientItem">
          <span>邮箱：</span>
          <span class="content">{{ item.email }}</span>
        </li>
      </div>
      <div class="clientContentBox">
        <li class="clientItem">
          <span>择样时间：</span>
          <span class="content">
            {{ item.createdOn && item.createdOn.replace(/T/, " ") }}
          </span>
        </li>
        <li class="remark">
          <span>备注：</span>
          <span class="content">{{ item.remark }}</span>
        </li>
      </div>
    </ul>
    <div class="mytableBox">
      <div class="tableTitle">
        <div class="titleText">
          <span class="title">产品列表</span>
          ({{ totalCount }})
        </div>
        <el-button size="medium" @click="openSelectTemplate" type="warning">
          <i class="iconfont icon-daochujinruchukou"></i>
          导出列表
        </el-button>
      </div>
      <bsTables :table="tableData" />
      <center style="margin-top: 20px">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          :total="totalCount"
          :current-page.sync="currentPage"
          @current-change="currentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>

    <!-- 统计 -->
    <Summary :summaryData="summaryData"></Summary>
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
          :orderNumber="item.orderNumber"
          :customerName="item.customerName"
          api="/api/ExportCustomerOrderDetailToExcel"
        />
      </el-dialog>
    </transition>
  </div>
</template>

<script>
import bsExportOrder from "@/components/bsComponents/bsSiteSharingComponent/bsExportOrder";
import bsTables from "@/components/table";
import Summary from "@/components/summaryComponent/summary";
export default {
  components: { bsExportOrder, bsTables, Summary },
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      summaryData: {
        //汇总数据
        isHandle: false,
        totalDegree: 0, //总款数
        totalCartons: 0, //总箱数
        totalQuantity: 0, //总数量
        totalBulkStere: 0, //总体积
        totalBulkFeet: 0, //总材积
        totalGrWe: 0, //总毛重
        totalNeWe: 0, //总净重
        cu_de: "" //金额单位
        // totalMoney: 0 //总金额
        // countData: [],
      },
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        isIndex: true,
        columns: [
          {
            prop: "productName",
            label: "产品",
            width: 300,
            color: "#3368a9",
            align: "left",
            // isHiden: true,
            infoBox: true,
            productInfo: true,
            cartInfoIcon: true,
            elImage: row => {
              return row.productImage;
            },
            nameHtml: row => {
              return row.productName;
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
                  row.supplierTelephoneNumber = "";
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
          { prop: "fa_no", label: "出厂货号", isHiden: true },
          { prop: "ch_pa", label: "包装", isHiden: true, width: 90 },
          {
            prop: "pr_le",
            renderHeard: () => {
              return "产品规格<br /> (cm)";
            },
            isHiden: true,
            render: row => {
              return row.pr_le + "x" + row.pr_wi + "x" + row.pr_hi;
            }
          },
          {
            prop: "pr_le",

            renderHeard: () => {
              return "包装规格<br /> (cm)";
            },
            isHiden: true,
            render: row => {
              return row.in_le + "x" + row.in_wi + "x" + row.in_hi;
            }
          },
          {
            prop: "pr_le",

            renderHeard: () => {
              return "外箱规格<br /> (cm)";
            },
            isHiden: true,
            render: row => {
              return row.ou_le + "x" + row.ou_wi + "x" + row.ou_hi;
            }
          },
          {
            prop: "bulk_stere",

            isHiden: true,
            renderHeard: () => {
              return "体积/材积<br />(cbm)/(cuft)";
            },
            width: 150,
            render: row => {
              return row.bulk_stere + "/" + row.bulk_feet;
            }
          },
          {
            prop: "gr_we",

            isHiden: true,
            renderHeard: () => {
              return "毛重/净重<br />(kg)";
            },
            width: 100,
            render: row => {
              return row.gr_we + "/" + row.ne_we;
            }
          },
          {
            prop: "in_en",

            renderHeard: () => {
              return "装箱量<br />(pcs)";
            },
            isHiden: true,
            render: row => {
              return row.in_en + "/" + row.ou_lo;
            }
          },
          {
            prop: "productCount",
            label: "箱数",
            width: 50,
            isHiden: true
          },
          {
            label: "数量",
            isHiden: true,
            width: 50,
            render: row => {
              return row.productCount * row.ou_lo;
            }
          },
          {
            prop: "costPrice",
            label: "参考单价",
            isHiden: true,
            width: 70,
            color: "#3368a9",
            render: row => {
              return "￥" + row.costPrice;
            }
          },
          {
            prop: "productPrice",
            label: "报出价",
            isHiden: true,
            width: 70,
            color: "#f56c6c",
            render: row => {
              return this.options.currencyType + row.productPrice;
            }
          },
          {
            prop: "OfferTotalAmount",
            label: "报出总价",
            width: 70,
            isHiden: true,
            color: "#f56c6c",
            render: row => {
              return (
                this.options.currencyType +
                this.$calculate.countTotalprice(
                  row.productCount,
                  row.ou_lo,
                  row.productPrice
                )
              );
            }
          }
        ],
        btnWidth: 100
      },
      exportTemplateDialog: false,
      isOrderDetailDialog: false,
      options: {},
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      orderOption: {}
    };
  },
  created() {
    // console.log(this.item, "客户详情");
  },
  mounted() {
    this.getSearchCompanyShareOrderDetailsPage();
  },
  methods: {
    // 去消息聊天
    toNews(item) {
      console.log(item);
      const fd = {
        name: "/bsIndex/bsNews",
        linkUrl: "/bsIndex/bsNews",
        component: "bsNews",
        refresh: true,
        label: "消息"
      };
      this.$store.commit("myAddTab", fd);
      this.$router.push("/bsIndex/bsNews");
    },
    // 去厂商
    toFactory(item) {
      if (!item.supplierNumber) {
        this.$common.handlerMsgState({
          msg: "该厂商没有厂商编号，请联系管理员",
          type: "danger"
        });
        return false;
      }
      const fd = {
        name: item.supplierNumber,
        linkUrl: "/bsIndex/bsVendorQuery",
        component: "bsMyClientsDetail",
        refresh: true,
        label: item.supplierName,
        value: {
          companyNumber: item.supplierNumber,
          companyLogo: item.productImage,
          companyName: item.supplierName,
          contactsMan: item.productName,
          phoneNumber: item.supplierPhone,
          address: item.supplierAddres || item.supplierAddress || ""
        }
      };
      this.$store.commit("myAddTab", fd);
      this.$router.push("/bsIndex/bsVendorQuery");
    },
    // 打开选择导出模板
    openSelectTemplate() {
      this.exportTemplateDialog = true;
      // const str = "http://124.71.6.26:8087/ConversationListIcon.rar";
      // const link = document.createElement("a");
      // link.href = str;
      // link.style.display = "none";
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link); // 释放元素
    },
    // 获取分享客户订单
    async getSearchCompanyShareOrderDetailsPage() {
      const res = await this.$http.post(
        "/api/SearchCompanyShareOrderDetailsPage",
        {
          skipCount: this.currentPage,
          maxResultCount: this.pageSize,
          shareOrderNumber: this.item.orderNumber
        }
      );
      if (res.data.result.code === 200) {
        this.options = res.data.result.item;
        console.log(this.options);
        this.tableData.data = res.data.result.item.shareOrderDetails.items;
        this.totalCount = res.data.result.item.shareOrderDetails.totalCount;
        this.summaryData.cu_de = this.options.currencyType;
        this.summaryData.totalDegree = this.options.totalKuanshu;
        this.summaryData.totalCartons = this.options.totalCount;
        this.summaryData.totalQuantity = this.$calculate.calculationTotalBox(
          this.tableData.data
        );
        this.summaryData.totalBulkStere = this.options.totalStere;
        this.summaryData.totalBulkFeet = this.options.totalFeet;
        this.summaryData.totalGrWe = this.options.totalGrossWeight;
        this.summaryData.totalNeWe = this.options.totalNetWeight;
        this.summaryData.sumAmountFa_pr = this.options.totalCostPrice;
        this.summaryData.sumHa_in_qu = this.options.totalAmount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 点击产品名字跳转
    goDetails(row) {
      const fd = {
        name: row.productName + row.fa_no,
        linkUrl: "/bsIndex/bsCustomerOrder",
        component: "bsProductDetails",
        refresh: true,
        label: row.fa_no || "产品详情",
        value: row
      };
      this.$router.push("/bsIndex/bsProductSearchIndex");
      this.$store.commit("myAddTab", fd);
    },
    // 切换当前页
    currentChange(page) {
      this.currentPage = page;
      this.getSearchCompanyShareOrderDetailsPage();
    },
    // 切换当前页条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getSearchCompanyShareOrderDetailsPage();
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.clientOrderDetails {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
  padding-bottom: 100px;
  .title {
    height: 55px;
    line-height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
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
  .customerInfoBox {
    // padding: 20px 0;
    .itemBox {
      line-height: 34px;
      margin-top: 20px;
      .orderNumber {
        font-weight: 700;
      }
    }
    .clientContentBox {
      margin-top: 12px;
      display: flex;
      .clientItem {
        width: 300px;
      }
      .remark {
        flex: 1;
      }
      &:last-of-type {
        padding-bottom: 20px;
      }
    }
  }
  .mytableBox {
    .tableTitle {
      padding-bottom: 18px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 15px;
      .titleText {
        .title {
          font-weight: 700;
          border: none;
        }
      }
    }
    .errorImg {
      img {
        width: 80px;
        height: 60px;
      }
    }
  }
}
@{deep} .exportOrder {
  .el-dialog__body {
    padding: 0;
  }
}
</style>
