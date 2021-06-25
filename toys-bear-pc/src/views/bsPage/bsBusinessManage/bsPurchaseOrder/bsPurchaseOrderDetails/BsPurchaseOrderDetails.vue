<template>
  <div class="BsPurchaseOrderDetails">
    <div class="title">采购订单详情</div>
    <ul class="customerInfoBox">
      <div class="clientContentBox">
        <div class="left">
          <li class="clientItem">
            <span class="itemTitle">采购单号：</span>
            <span class="content orderNumber">{{ item.orderNumber }}</span>
          </li>
          <li class="clientItem">
            <span class="itemTitle">采购时间：</span>
            <span class="content">
              {{ item.createdOn && item.createdOn.replace(/T/, " ") }}
            </span>
          </li>
        </div>
        <div class="middle">
          <li class="clientItem">
            <span class="itemTitle">业务员：</span>
            <span class="content orgPersonnelName">
              {{ item.orgPersonnelName }}
            </span>
          </li>
          <li class="clientItem">
            <span class="itemTitle">客户名称：</span>
            <span class="content">{{ item.fromCompanyName }}</span>
          </li>
        </div>
        <div class="right">
          <li class="clientItem">
            <span class="itemTitle">状态：</span>
            <span class="content state" v-if="item.readStatus"> 已读 </span>
            <span class="content state" v-else> 未读 </span>
          </li>
          <li class="clientItem">
            <span class="itemTitle">报价备注：</span>
            <span class="content">{{ item.pushContent }}</span>
          </li>
        </div>
      </div>
    </ul>
    <div class="tableBox">
      <div class="tableTitle">
        <div class="titleText">
          <span class="title">采购产品</span>
          ({{ totalCount }})
        </div>
        <el-button size="medium" @click="openSelectTemplate" type="warning">
          <i class="iconfont icon-daochujinruchukou"></i>
          导出列表
        </el-button>
      </div>
      <bsTables :table="tableData" />
    </div>
    <center style="margin-top: 20px">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        background
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        :total="totalCount"
        :current-page.sync="currentPage"
        @current-change="currentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </center>
    <!-- 统计 -->
    <Summary :summaryData="summaryData"></Summary>
    <!-- 导出订单模板dialog -->
    <transition name="el-zoom-in-center">
      <el-dialog
        title="订单模板"
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
import bsExportOrder from "@/components/commonComponent/exportOrderComponent/caigoudingdan.vue";
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
        cu_de: "￥", //金额单位
        totalMoney: 0, //总金额
        sumAmountFa_pr: 0, //总出厂价
        sumHa_in_qu: 0 //总报出价
        // countData: [],
      },
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        isIndex: true,
        columns: [
          {
            prop: "pr_na",
            label: "产品",
            width: 280,
            color: "#3368a9",
            align: "left",
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
            width: 100,
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
          { prop: "fa_no", label: "出厂货号", isHiden: true, width: 60 },
          { prop: "ch_pa", label: "包装", isHiden: true, minWidth: 70 },
          {
            prop: "pr_le",
            minWidth: 100,
            renderHeard: () => {
              return "产品规格</br>(cm)";
            },
            render: row => {
              return row.pr_le + "x" + row.pr_wi + "x" + row.pr_hi;
            }
          },
          {
            prop: "pr_le",
            minWidth: 100,
            renderHeard: () => {
              return "包装规格</br>(cm)";
            },
            render: row => {
              return row.in_le + "x" + row.in_wi + "x" + row.in_hi;
            }
          },
          {
            prop: "pr_le",
            minWidth: 100,
            renderHeard: () => {
              return "外箱规格</br>(cm)";
            },
            render: row => {
              return row.ou_le + "x" + row.ou_wi + "x" + row.ou_hi;
            }
          },
          {
            prop: "bulk_stere",
            renderHeard: () => {
              return "体积/材积</br>(cbm)/(cuft)";
            },
            minWidth: 100,
            render: row => {
              return row.bulk_stere + row.bulk_feet;
            }
          },
          {
            prop: "gr_we",
            minWidth: 90,
            renderHeard: () => {
              return "毛重/净重</br>(kg)";
            },

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
            prop: "ou_lo",
            label: "数量",
            width: 50,
            isHiden: true,
            render: row => {
              return row.ou_lo;
            }
          },
          {
            prop: "fa_pr",
            label: "参考单价",
            isHiden: true,
            minWidth: 80,
            color: "red",
            render: row => {
              return row.cu_de + " " + row.fa_pr;
            }
          },
          {
            prop: "ha_in_qu",
            label: "报出价",
            isHiden: true,
            minWidth: 100,
            color: "red",
            render: row => {
              return row.cu_de + " " + row.ha_in_qu;
            }
          }
        ]
      },
      options: {},
      exportTemplateDialog: false,
      isOrderDetailDialog: false,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      orderOption: {}
    };
  },
  created() {},
  mounted() {
    this.getSearchCompanyShareOrderDetailsPage();
  },
  methods: {
    // 去聊天
    toNews(item) {
      const fd = {
        name: item.supplierNumber + "bsNews",
        linkUrl: "/bsIndex/bsNews",
        component: "bsNews",
        refresh: true,
        label: item.supplierName,
        value: {}
      };
      this.$router.push("/bsIndex/bsNews");
      this.$store.commit("myAddTab", fd);
    },
    // 去厂商
    toFactory(item) {
      const fd = {
        name: item.supplierNumber,
        linkUrl: "/bsIndex/bsVendorQuery",
        component: "bsMyClientsDetail",
        refresh: true,
        noPush: true,
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
      this.$router.push("/bsIndex/bsVendorQuery");
    },
    // 查看产品详情
    toProductDetails(row) {
      if (!row.productNumber) {
        this.$message.error("该产品没有产品编号productNumber, 请联系管理员");
        return false;
      }
      const fd = {
        name: row.productNumber,
        linkUrl: this.$route.path,
        component: "bsProductDetails",
        refresh: true,
        label: row.fa_no || "产品详情",
        value: row
      };
      this.$store.commit("myAddTab", fd);
    },
    // 获取订单详情总数
    async getERPOrderTotal() {
      const res = await this.$http.post("/api/GetERPOrderTotal", {
        id: this.item.erpOrderID
      });
      if (res.data.result.code === 200) {
        this.options = res.data.result.item;
        this.summaryData.totalDegree = this.totalCount;
        this.summaryData.totalCartons = this.options.sumtAmount;
        this.summaryData.totalQuantity = this.options.sumAmountOu_lo;
        this.summaryData.totalBulkStere = this.options.sumBulk_stere;
        this.summaryData.totalBulkFeet = this.options.sumBulk_feet;
        this.summaryData.totalGrWe = this.options.sumGr_we;
        this.summaryData.totalNeWe = this.options.sumNe_we;
        this.summaryData.totalMoney = this.options.sumFa_pr_pr;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 打开选择导出模板
    openSelectTemplate() {
      this.exportTemplateDialog = true;
      // const str = "http://139.9.71.135:8087/ConversationListIcon.rar";
      // const link = document.createElement("a");
      // link.href = str;
      // link.style.display = "none";
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link); // 释放元素
    },
    // 获取分享客户订单
    async getSearchCompanyShareOrderDetailsPage() {
      const res = await this.$http.post("/api/GetERPOrderDetailPage", {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        id: this.item.erpOrderID
      });
      if (res.data.result.code === 200) {
        this.tableData.data = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
      this.getERPOrderTotal();
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
.BsPurchaseOrderDetails {
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
    padding: 20px 0;
    .itemBox {
      line-height: 34px;
      .orderNumber {
        font-weight: 700;
      }
    }
    .clientContentBox {
      display: flex;
      .left,
      .middle,
      .right {
        min-width: 400px;
        .clientItem {
          line-height: 34px;
          margin-right: 20px;
          .itemTitle {
            color: #999;
          }
          .orderNumber {
            font-weight: 700;
          }
          .orgPersonnelName {
            color: #3368a9;
          }
          .state {
            color: #e55555;
          }
        }
      }
    }
  }
  .tableBox {
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
</style>
