<template>
  <div class="clientOrderDetails">
    <div class="title">客户订单详情</div>
    <ul class="customerInfoBox">
      <li class="itemBox">
        <span>订单编号：</span>
        <span class="orderNumber">{{ item.orderNumber }}</span>
      </li>
      <div class="clientContentBox">
        <div class="left">
          <li class="clientItem">
            <span>客户：</span>
            <span class="content">{{ item.customerName }}</span>
          </li>
          <li class="clientItem">
            <span>择样时间：</span>
            <span class="content">
              {{ item.createdOn && item.createdOn.replace(/T/, " ") }}
            </span>
          </li>
        </div>
        <div class="middle">
          <li class="clientItem">
            <span>联系人：</span>
            <span class="content">{{ item.contactName }}</span>
          </li>
          <li class="clientItem">
            <span>公司名称：</span>
            <span class="content">{{ item.companyName }}</span>
          </li>
        </div>
        <div class="right">
          <li class="clientItem">
            <span>邮箱：</span>
            <span class="content">{{ item.email }}</span>
          </li>
          <li class="clientItem">
            <span>备注：</span>
            <span class="content">{{ item.remark }}</span>
          </li>
        </div>
      </div>
    </ul>
    <div class="tableBox">
      <div class="tableTitle">
        <div class="titleText">
          <span class="title">商品列表</span>
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
        <ex-table-column :autoFit="true" label="产品" width="300">
          <template slot-scope="scope">
            <div class="imgBox">
              <el-image
                fit="contain"
                @click.native="goDetails(scope.row)"
                style="width:80px;height:60px;cursor: pointer;"
                :src="scope.row.productImage"
                :preview-src-list="[scope.row.productImage]"
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
                  {{ scope.row.productName }}
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
              style="width:110px;overflow:hidden;max-width: 100px;white-space: nowrap;text-overflow: ellipsis;"
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
        <ex-table-column :autoFit="true" label="箱数">
          <template slot-scope="scope">
            <span> {{ scope.row.in_en }} </span>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" label="总数量">
          <template slot-scope="scope">
            <span> {{ scope.row.in_en }} </span>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" prop="costPrice" label="参考单价">
          <template slot-scope="scope">
            <span style="color:#3368A9">
              {{ options.currencyType + scope.row.costPrice }}
            </span>
          </template>
        </ex-table-column>
        <ex-table-column :autoFit="true" prop="productPrice" label="报出价">
          <template slot-scope="scope">
            <span style="color:#f56c6c">
              {{ options.currencyType + scope.row.productPrice }}
            </span>
          </template>
        </ex-table-column>
      </el-table>
      <div class="totalBox">
        <p class="item">
          <span class="itemTitle">总款数：</span>
          <span>{{ options.totalKuanshu }}</span>
        </p>
        <p class="item">
          <span class="itemTitle">总箱数：</span>
          <span>{{ options.totalCount }}</span>
        </p>
        <p class="item">
          <span class="itemTitle">总体积/总材积：</span>
          <span>{{ options.totalStere }}</span
          >/<span>{{ options.totalFeet }}</span>
        </p>
        <p class="item">
          <span class="itemTitle">总毛重/总净重：</span>
          <span
            >{{ options.totalGrossWeight }}/{{
              options.totalNetWeight
            }}(KG)</span
          >
        </p>
        <p class="item">
          <span class="itemTitle">总出厂价/总金额：</span>
          <span style="color: #3368A9;">
            {{ options.currencyType }}
          </span>
          <span style="color: #3368A9;">{{ options.totalCostPrice }}</span>
          <span style="margin:5px;"></span>
          <span class="price">
            {{ options.currencyType }}
          </span>
          <span class="price">{{ options.totalAmount }}</span>
        </p>
      </div>
    </div>

    <center style="margin-top:20px;">
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
      options: {},
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      orderOption: {}
    };
  },
  created() {
    console.log(this.item, "客户详情");
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
        noPush: true,
        label: item.supplierName,
        value: {
          companyNumber: item.supplierNumber,
          companyLogo: item.productImage,
          companyName: item.productName,
          contactsMan: item.supplierName,
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
        this.tableData = res.data.result.item.shareOrderDetails.items;
        console.log(this.options);
        this.totalCount = res.data.result.item.shareOrderDetails.totalCount;
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
      console.log(row);
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
        min-width: 250px;
        .clientItem {
          line-height: 34px;
          margin-right: 20px;
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
        .el-image {
          cursor: pointer;
        }
        .productName {
          width: 190px;
          height: 60px;
          margin-left: 15px;
          .name,
          .factory {
            width: 190px;
            cursor: pointer;
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
</style>
