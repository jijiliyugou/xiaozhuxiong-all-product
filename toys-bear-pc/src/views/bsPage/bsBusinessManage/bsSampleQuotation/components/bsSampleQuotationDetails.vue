<template>
  <div class="bsSampleQuotationDetails">
    <div class="title">报价详情</div>
    <bsSampleQuotationTopComponent
      :itemList="itemList"
      :handerTabData="handerTabData"
    ></bsSampleQuotationTopComponent>
    <div class="bsSampleTable">
      <div class="top">
        <div class="left">报价产品列表({{ tableData.data.length }})</div>
        <div class="right" v-if="tableData.data.length > 0">
          <el-button @click="exportOrder()" type="warning"> 导出列表</el-button>
        </div>
      </div>
      <div class="tableBox">
        <bsTable :table="tableData" />
      </div>
    </div>
    <!-- 统计值 -->
    <Summary :summaryData="summaryData"></Summary>
    <!-- 导出订单模板dialog -->
    <transition name="el-zoom-in-center">
      <el-dialog
        class="exportOrder"
        title="订单模板"
        v-if="exportTemplateDialog"
        :visible.sync="exportTemplateDialog"
        width="1200px"
      >
        <bsExportOrder :options="orderRow" />
      </el-dialog>
    </transition>
  </div>
</template>

<script>
import Summary from "@/components/summaryComponent/summary";
import bsExportOrder from "@/components/commonComponent/exportOrderComponent/gongsizhaoyangbaojia.vue";
import bsSampleQuotationTopComponent from "@/components/bsComponents/bsSampleComponent/bsSampleQuotationTopComponent";
import bsTable from "@/components/table";
export default {
  name: "bsSampleQuotationDetails",
  components: {
    bsExportOrder,
    bsSampleQuotationTopComponent,
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
              return row.imgUrlList;
            },
            nameHtml: row => {
              return row.name;
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
            prop: "companyName",
            isHiden: true,
            label: "资料来源"
          },
          { prop: "fa_no", width: 60, label: "出厂货号", isHiden: true },
          { prop: "ch_pa", width: 50, label: "包装", isHiden: true },
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
            prop: "boxNumber",
            label: "箱数",
            width: 50
          },
          {
            label: "数量",
            width: 50,
            render: row => {
              return this.$calculate.countTotalQuantity(
                row.boxNumber,
                row.ou_lo
              );
            }
          },
          {
            prop: "price",
            label: "厂价",
            width: 50,
            color: "red",
            render: row => {
              return "￥ " + row.price;
            }
          },
          {
            prop: "offerAmount",
            label: "报出价",
            width: 50,
            color: "red",
            render: row => {
              return row.cu_de + " " + row.offerAmount;
            }
          },
          {
            prop: "OfferTotalAmount",
            label: "报出总价",
            width: 60,
            color: "red",
            render: row => {
              return (
                row.cu_de +
                " " +
                this.$calculate.countTotalprice(
                  row.offerAmount,
                  row.ou_lo,
                  row.boxNumber
                )
              );
            }
          }
        ]
      },
      orderRow: {},
      exportTemplateDialog: false,
      handerTabData: [],
      currentPage: 1,
      pageSize: 500,
      totalCount: 0,
      itemList: {},
      summaryData: {
        //汇总数据
        totalDegree: 0, //总款数
        totalCartons: 0, //总箱数
        totalQuantity: 0, //总数量
        totalBulkStere: 0, //总体积
        totalBulkFeet: 0, //总材积
        totalGrWe: 0, //总毛重
        totalNeWe: 0, //总净重
        cu_de: "", //金额单位
        totalMoney: 0 //总金额
        // countData: [],
      }
    };
  },
  created() {},

  mounted() {
    this.getProductOfferNumber();
  },
  methods: {
    // 判断编号
    handleOffer(row) {
      if (this.item.offerNumber.indexOf("S") < 0) {
        return row;
      } else {
        return 0;
      }
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
      this.$store.commit("myAddTab", fd);
    },
    // 获取该订单报价公式详情
    async getProductOfferNumber() {
      if (this.item.offerNumber.indexOf("S") < 0) {
        const fd = {
          OfferNumber: this.item.offerNumber
        };
        const res = await this.$http.post("/api/GetProductOfferByNumber", fd);
        if (res.data.result.code === 200) {
          this.handerTabData.push(res.data.result.item);
          this.itemList = res.data.result.item;
        } else {
          this.$message.error(res.data.result.msg);
        }
      }
      this.getProductOfferDetailPage();
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
    // 获取列表
    async getProductOfferDetailPage() {
      if (this.item.offerNumber.indexOf("S") < 0) {
        const fd = Object.assign(
          { skipCount: this.currentPage, maxResultCount: this.pageSize },
          this.item
        );

        const res = await this.$http.post("/api/ProductOfferDetailPage", fd);
        if (res.data.result.code === 200) {
          this.totalCount = res.data.result.item.totalCount;
          this.tableData.data = res.data.result.item.items;
          this.handleCountData(res.data.result.item.items);
        } else {
          this.$message.error(res.data.result.msg);
        }
      } else {
        const fd_s = {
          skipCount: this.currentPage,
          maxResultCount: this.pageSize,
          sampleNumber: this.item.offerNumber
        };
        const res = await this.$http.post(
          "/api/CompanySamplelistByNumber",
          fd_s
        );
        if (res.data.result.code === 200) {
          this.totalCount = res.data.result.item.totalCount;
          this.tableData.data = res.data.result.item.items;
          this.handleCountData(res.data.result.item.items);
        } else {
          this.$message.error(res.data.result.msg);
        }
      }
    },
    //计算汇总数据
    handleCountData(array) {
      //总款数
      this.summaryData.totalDegree = array.length;
      this.summaryData.cu_de = this.item.cu_de;
      //金额单位
      for (let i = 0; i < array.length; i++) {
        //总箱数
        this.summaryData.totalCartons = this.$calculate.add(
          this.summaryData.totalCartons,
          array[i].boxNumber || 0
        );
        //总数量
        this.summaryData.totalQuantity = this.$calculate.add(
          this.summaryData.totalQuantity,
          this.$calculate.multiply(array[i].boxNumber, array[i].ou_lo) || 0
        );
        //总体积
        this.summaryData.totalBulkStere = this.$calculate.add(
          this.summaryData.totalBulkStere,
          this.$calculate.multiply(array[i].boxNumber, array[i].bulk_stere) || 0
        );
        //总材积
        this.summaryData.totalBulkFeet = this.$calculate.add(
          this.summaryData.totalBulkFeet,
          this.$calculate.multiply(array[i].boxNumber, array[i].bulk_feet) || 0
        );
        //总毛重
        this.summaryData.totalGrWe = this.$calculate.add(
          this.summaryData.totalGrWe,
          this.$calculate.multiply(array[i].boxNumber, array[i].gr_we) || 0
        );
        //总净重
        this.summaryData.totalNeWe = this.$calculate.add(
          this.summaryData.totalNeWe,
          this.$calculate.multiply(array[i].boxNumber, array[i].ne_we) || 0
        );
        //总金额
        this.summaryData.totalMoney = this.$calculate.add(
          this.summaryData.totalMoney,
          this.$calculate.multiply(
            this.$calculate.multiply(array[i].offerAmount, array[i].boxNumber),
            array[i].ou_lo
          )
        );
      }
    },
    // 导出找样
    exportOrder() {
      this.orderRow = {
        sampleNumber: this.item.offerNumber,
        name: this.item.customerName,
        api: "/api/ExportSampleOfferToExcel"
      };
      this.exportTemplateDialog = true;
    },
    // 点击箱数选中输入框中的所有值
    selectInputValue(e) {
      e.currentTarget.select();
    },
    // 修改数量
    changeInputNumber(e, val) {
      const re = /^[0-9]+.?[0-9]*/;
      if (!re.test(e.target.value)) {
        e.target.value = 0;
      } else if (e.target.value.length > 5) {
        e.target.value = e.target.value.slice(0, 5);
      } else if (!e.target.value) {
        e.target.value = 0;
      } else if (e.target.value.length > 1 && e.target.value[0] == 0) {
        e.target.value = e.target.value.slice(1, 5);
      }
      val.shoppingCount = Number(e.target.value);
      this.$store.commit("replaceShoppingCartValueCount", this.tableData);
    }
  },
  // 点击上下键盘
  nextInput(e) {
    if (e.keyCode === 40) {
      const inputs = document.getElementsByClassName("inputNumber");
      for (let i = 0; i < inputs.length; i++) {
        // 如果是最后一个，则焦点回到第一个
        if (i == inputs.length - 1) {
          inputs[0].focus();
        } else if (e.target == inputs[i]) {
          inputs[i + 1].focus();
          break; //不加最后一行eles就直接回到第一个输入框
        }
      }
      e.stopPropagation();
      e.preventDefault();
      e.returnValue = false;
      e.cancelBubble = true;
    } else if (e.keyCode === 38) {
      const inputs = document.getElementsByClassName("inputNumber");
      for (let i = 0; i < inputs.length; i++) {
        // 如果是最后一个，则焦点回到第一个
        if (i === 0) {
          inputs[inputs.length - 1].focus();
        } else if (e.target == inputs[i]) {
          inputs[i - 1].focus();
          break; //不加最后一行eles就直接回到第一个输入框
        }
      }
      e.stopPropagation();
      e.preventDefault();
      e.returnValue = false;
      e.cancelBubble = true;
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsSampleQuotationDetails {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
  padding-bottom: 100px;
  .title {
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
