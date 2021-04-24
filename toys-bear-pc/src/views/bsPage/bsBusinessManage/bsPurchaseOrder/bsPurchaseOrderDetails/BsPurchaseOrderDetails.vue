<template>
  <div class="clientOrderDetails">
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
            <span class="itemTitle">操 作 员：</span>
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
          <span class="title">采购商品</span>
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
        <el-table-column label="序号" type="index" align="center" width="70">
        </el-table-column>
        <ex-table-column :autoFit="true" label="产品" width="300">
          <template slot-scope="scope">
            <div class="imgBox">
              <el-image
                fit="contain"
                @click.native="toProductDetails(scope.row)"
                style="width: 80px; height: 60px"
                :src="scope.row.imgUrl && scope.row.imgUrl[0]"
                :preview-src-list="scope.row.imgUrl || []"
              >
                <div slot="placeholder" class="errorImg">
                  <img src="~@/assets/images/imgError.png" alt />
                </div>
                <div slot="error" class="errorImg">
                  <img src="~@/assets/images/imgError.png" alt />
                </div>
              </el-image>
              <div class="productName">
                <div class="name" @click="toProductDetails(scope.row)">
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
                    <div class="cartInfoIcon" @click="toNews(scope.row)"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" label="资料来源">
          <template slot-scope="scope">
            <div
              style="
                width: 110px;
                overflow: hidden;
                max-width: 100px;
                white-space: nowrap;
                text-overflow: ellipsis;
              "
            >
              {{ scope.row.exhibitionName }}
            </div>
          </template>
        </ex-table-column>
        <ex-table-column
          :autoFit="true"
          prop="fa_no"
          label="出厂货号"
        ></ex-table-column>
        <ex-table-column :autoFit="true" prop="ch_pa" label="包装">
        </ex-table-column>
        <ex-table-column :autoFit="true" label="产品规格" min-width="100">
          <template slot-scope="scope">
            <span>
              {{ scope.row.pr_le }}x{{ scope.row.pr_wi }}x{{
                scope.row.pr_hi
              }}(cm)
            </span>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" label="包装规格" min-width="100">
          <template slot-scope="scope">
            <span>
              {{ scope.row.in_le }}x{{ scope.row.in_wi }}x{{
                scope.row.in_hi
              }}(cm)
            </span>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" label="外箱规格" min-width="100">
          <template slot-scope="scope">
            <span>
              {{ scope.row.ou_le }}x{{ scope.row.ou_wi }}x{{
                scope.row.ou_hi
              }}(cm)
            </span>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" label="体积/材积" min-width="150">
          <template slot-scope="scope">
            <span>
              {{ scope.row.bulk_stere }}(cbm)/{{ scope.row.bulk_feet }}(cuft)
            </span>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" label="毛重/净重">
          <template slot-scope="scope">
            <span> {{ scope.row.gr_we }}/{{ scope.row.ne_we }}(kg) </span>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" label="装箱量">
          <template slot-scope="scope">
            <span> {{ scope.row.in_en }}/{{ scope.row.ou_lo }}(pcs) </span>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" prop="fa_pr" label="参考单价">
          <template slot-scope="scope">
            <span style="color: #3368a9">
              <span>{{ scope.row.cu_de }}</span>
              {{ scope.row.fa_pr }}
            </span>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" prop="fa_pr_pr" label="报出价">
          <template slot-scope="scope">
            <span style="color: #f56c6c">
              <span>{{ scope.row.cu_de }}</span>
              {{ scope.row.fa_pr_pr }}
            </span>
          </template>
        </ex-table-column>
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
          <span class="itemTitle">总金额：</span>
          <span class="price">￥{{ options.sumFa_pr_pr }}</span>
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
        v-if="exportTemplateDialog"
        :visible.sync="exportTemplateDialog"
        top="60px"
        width="80%"
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
import bsExportOrder from "@/components/commonComponent/exportOrderComponent";
export default {
  components: { bsExportOrder },
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      options: {},
      exportTemplateDialog: false,
      isOrderDetailDialog: false,
      tableData: [],
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
        this.tableData = res.data.result.item.items;
        console.log(this.tableData);
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
    @{deep} .el-table {
      .el-table__header-wrapper .el-checkbox {
        display: none;
      }
      .cell {
        white-space: nowrap;
        width: fit-content;
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
        display: flex;
        font-size: 14px;
        cursor: pointer;
        .productName {
          width: 170px;
          height: 60px;
          margin-left: 15px;
          .name,
          .factory {
            width: 170px;
            max-width: 170px;
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
</style>
