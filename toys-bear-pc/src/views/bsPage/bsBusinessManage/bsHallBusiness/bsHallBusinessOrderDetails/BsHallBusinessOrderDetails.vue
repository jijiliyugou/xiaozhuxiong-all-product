<template>
  <div class="clientOrderDetails">
    <div class="title">业务详情</div>
    <ul class="customerInfoBox">
      <div class="infoTop">
        <div class="itemBox">
          <span class="itemTitle">择样类型：</span>
          <span class="type"
            ><span>{{ item.hall_na }}：</span
            >{{ item.messageExt | switchMessageExt }}</span
          >
        </div>
        <div class="itemBox">
          <span class="itemTitle">展厅名称：</span>
          <span class="name">{{ item.hall_na }}</span>
        </div>
        <div class="itemBox">
          <span class="itemTitle">本次代号：</span>
          <span class="orderNumber">{{ item.the_nu }}</span>
        </div>
        <div class="itemBox">
          <span class="itemTitle">状态：</span>
          <span class="orderNumber" v-if="item.readStatus == 0">未读</span>
          <span class="orderNumber" v-if="item.readStatus == 1">已读</span>
        </div>
      </div>
      <div class="infoBottom">
        <div class="itemBox">
          <span class="itemTitle">择样时间：</span>
          <span class="orderNumber">
            {{ item.happenDate && item.happenDate.replace(/T/, " ") }}
          </span>
        </div>
        <div class="itemBox">
          <span class="itemTitle">择样单号：</span>
          <span class="orderNumber">{{ item.orderNumber }}</span>
        </div>
      </div>
      <div class="infoBottom">
        <div class="itemBox remarkItemBox">
          <span class="itemTitle">备注：</span>
          <span class="remark">{{ item.pushContent }}</span>
        </div>
      </div>
    </ul>
    <div class="tableBox">
      <div class="tableTitle">
        <div class="titleText">
          <span class="title">择样列表</span>
          ({{ totalCount }})
        </div>
        <el-button size="medium" @click="openSelectTemplate" type="warning">
          <i class="iconfont icon-daochujinruchukou"></i>
          导出列表
        </el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="myTableRef"
        size="mini"
        :header-cell-style="{
          'font-size': '14px',
          color: '#666',
          backgroundColor: '#f9fafc',
          'font-weight': '400'
        }"
      >
        <el-table-column label="序号" type="index" align="center" width="50">
        </el-table-column>
        <el-table-column label="产品" width="300">
          <template slot-scope="scope">
            <div class="imgBox">
              <el-image
                fit="contain"
                @click.native="goDetails(scope.row)"
                style="width: 80px; height: 60px"
                :src="scope.row.imgUrl && scope.row.imgUrl[0]"
              >
                <div slot="placeholder" class="errorImg">
                  <img src="~@/assets/images/imgError.png" alt />
                </div>
                <div slot="error" class="errorImg">
                  <img src="~@/assets/images/imgError.png" alt />
                </div>
              </el-image>
              <div class="productName">
                <div class="name" @click="goDetails(scope.row)">
                  {{ scope.row.pr_na }}
                </div>
                <div class="factory">
                  <div class="fcatoryName" @click="toFactory(scope.row)">
                    {{ scope.row.supplierName }}
                  </div>
                  <div class="icons">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="scope.row.supplierPhone || '暂时没有厂商电话'"
                      placement="top"
                    >
                      <div class="cartPhoneIcon"></div>
                    </el-tooltip>
                    <div class="cartInfoIcon"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="资料来源">
          <template slot-scope="scope">
            {{ scope.row.exhibitionName }}
          </template>
        </el-table-column>
        <el-table-column prop="fa_no" label="出厂货号"></el-table-column>
        <el-table-column prop="ch_pa" label="包装"> </el-table-column>
        <el-table-column label="产品规格" min-width="100">
          <template slot-scope="scope">
            <span>
              {{ scope.row.pr_le }}x{{ scope.row.pr_wi }}x{{
                scope.row.pr_hi
              }}(cm)
            </span>
          </template>
        </el-table-column>
        <el-table-column label="包装规格" min-width="100">
          <template slot-scope="scope">
            <span>
              {{ scope.row.in_le }}x{{ scope.row.in_wi }}x{{
                scope.row.in_hi
              }}(cm)
            </span>
          </template>
        </el-table-column>
        <el-table-column label="外箱规格" min-width="100">
          <template slot-scope="scope">
            <span>
              {{ scope.row.ou_le }}x{{ scope.row.ou_wi }}x{{
                scope.row.ou_hi
              }}(cm)
            </span>
          </template>
        </el-table-column>
        <el-table-column label="体积/材积" min-width="150">
          <template slot-scope="scope">
            <span>
              {{ scope.row.bulk_stere }}(cbm)/{{ scope.row.bulk_feet }}(cuft)
            </span>
          </template>
        </el-table-column>
        <el-table-column label="毛重/净重">
          <template slot-scope="scope">
            <span> {{ scope.row.gr_we }}/{{ scope.row.ne_we }}(kg) </span>
          </template>
        </el-table-column>
        <el-table-column label="装箱量">
          <template slot-scope="scope">
            <span> {{ scope.row.in_en }}/{{ scope.row.ou_lo }}(pcs) </span>
          </template>
        </el-table-column>
        <el-table-column prop="productPrice" label="参考单价">
          <template slot-scope="scope">
            <span style="color: #f56c6c">
              {{ scope.row.cu_de + scope.row.fa_pr }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="totalBox">
        <p class="item">
          <span class="itemTitle">总款数：</span>
          <span>{{ totalCount }}</span>
        </p>
        <p class="item">
          <span class="itemTitle">总箱数：</span>
          <span>{{ options.sumtAmount }}</span>
        </p>
        <p class="item">
          <span class="itemTitle">总体积/总材积：</span>
          <span>{{ options.sumBulk_stere }}</span
          >/<span>{{ options.sumBulk_feet }}</span>
        </p>
        <p class="item">
          <span class="itemTitle">总毛重/总净重：</span>
          <span>{{ options.sumGr_we }}/{{ options.sumNe_we }}(KG)</span>
        </p>
        <p class="item">
          <span class="itemTitle">总出厂价/总金额：</span>
          <span class="price">￥{{ options.sumAmountFa_pr }}</span>
          <span>/</span>
          <span class="price">{{ options.sumFa_pr_pr }}</span>
        </p>
      </div>
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
    <!-- 导出订单模板dialog -->
    <transition name="el-zoom-in-center">
      <el-dialog
        title="订单模板"
        class="exportOrder"
        v-show="exportTemplateDialog"
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
import bsExportOrder from "@/components/commonComponent/exportOrderComponent/zhantingyewu.vue";
export default {
  components: { bsExportOrder },
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      exportTemplateDialog: false,
      isOrderDetailDialog: false,
      tableData: [],
      options: {
        sumtAmount: null,
        sumAmountFa_pr: null,
        sumBulk_stere: null,
        sumBulk_feet: null,
        sumGr_we: null,
        sumNe_we: null,
        sumFa_pr_pr: null,
        sumAmountOu_lo: null
      },
      currentPage: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  methods: {
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
    // 产品详情
    goDetails(row) {
      if (!row.productNumber) {
        this.$common.handlerMsgState({
          msg: "该产品没有产品编号productNumber, 请联系管理员",
          type: "danger"
        });
        return false;
      }
      const fd = {
        name: row.productNumber + row.fa_no,
        linkUrl: "/bsIndex/bsProductSearchIndex",
        component: "bsProductDetails",
        refresh: true,
        label: row.fa_no || "产品详情",
        value: row
      };
      this.$router.push("/bsIndex/bsProductSearchIndex");
      this.$store.commit("myAddTab", fd);
    },
    // 打开选择导出模板
    openSelectTemplate() {
      this.exportTemplateDialog = true;
    },
    // 获取订单详情总数
    async getERPOrderTotal() {
      const res = await this.$http.post("/api/GetERPOrderTotal", {
        id: this.item.erpOrderID
      });
      if (res.data.result.code === 200) {
        this.options = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取分享客户订单
    async getSearchCompanyShareOrderDetailsPage() {
      const res = await this.$http.post("/api/GetERPOrderDetailPage", {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        id: this.item.erpOrderID
      });
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
        console.log(this.tableData);
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
  },
  created() {},
  filters: {
    switchMessageExt(val) {
      let msg;
      switch (val) {
        case "0":
          msg = "系统通知";
          break;
        case "3":
          msg = "补样";
          break;
        case "5":
          msg = "借样";
          break;
        case "11":
          msg = "补样借样";
          break;
        case "12":
          msg = "洽谈";
          break;
      }
      return msg;
    }
  },
  mounted() {
    this.getSearchCompanyShareOrderDetailsPage();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.clientOrderDetails {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
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
    .infoTop,
    .infoBottom {
      display: flex;
      .itemBox {
        width: 300px;
        min-width: 300px;
        line-height: 34px;
        .itemTitle {
          color: #999;
        }
        &.remark {
          flex: 2;
          overflow: hidden;
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
        .type {
          font-size: 16px;
          font-weight: 700;
        }
        .name {
          color: #3368a9;
        }
      }
      .remarkItemBox {
        width: 100%;
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
    @{deep} .el-table {
      .el-table__header-wrapper .el-checkbox {
        display: none;
      }
      .cell {
        padding: 0 2px;
      }
      font-size: 12px;
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
      .price {
        color: #ff3e3e;
      }
      .tableTotalNumber {
        color: #ff3e3e;
        font-size: 14px;
        margin-top: 5px;
      }
      .imgBox {
        text-align: left;
        cursor: pointer;
        display: flex;
        font-size: 14px;
        .productName {
          width: 190px;
          height: 60px;
          margin-left: 15px;
          .name,
          .factory {
            width: 190px;
            max-width: 190px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
          .factory {
            color: #3368a9;
            display: flex;
            align-items: center;
            .fcatoryName {
              width: 100px;
              max-width: 100px;
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
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
    .totalBox {
      display: flex;
      align-items: center;
      height: 80px;
      padding-left: 10px;
      box-sizing: border-box;
      justify-content: flex-end;
      .item {
        margin-right: 15px;
        display: flex;
        align-items: center;
        // .itemTitle {
        // }
        .price {
          color: #eb1515;
          font-weight: 700;
          font-size: 18px;
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
