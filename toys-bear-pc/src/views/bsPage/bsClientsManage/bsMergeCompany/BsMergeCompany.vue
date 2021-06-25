<template>
  <div class="bsCompanyManage">
    <div class="title">公司列表 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="item">
        <span class="label">关键词：</span>
        <el-input
          v-focus
          type="text"
          size="medium"
          clearable
          v-model="searchForm.OfferNumber"
          placeholder="请输入关键词"
          @keyup.native.enter="search"
        ></el-input>
      </div>
      <div class="item">
        <span class="label">公司类型：</span>
        <el-select
          v-model="searchForm.staffId"
          filterable
          size="medium"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in staffList"
            :key="item.id"
            :label="item.linkman"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="item">
        <span class="label">审核状态：</span>
        <el-select
          v-model="searchForm.staffId"
          filterable
          size="medium"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in staffList"
            :key="item.id"
            :label="item.linkman"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="item">
        <span class="label">内部审核：</span>
        <el-select
          v-model="searchForm.staffId"
          filterable
          size="medium"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in staffList"
            :key="item.id"
            :label="item.linkman"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="item" style="max-width: 300px">
        <span class="label">时间段：</span>
        <el-date-picker
          size="medium"
          value-format="yyyy-MM-ddTHH:mm:ss"
          v-model="searchForm.dateTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <div class="item">
        <el-button
          @click="search"
          type="primary"
          icon="el-icon-search"
          size="medium"
        >
          搜索
        </el-button>
      </div>
      <div class="item">
        <el-button type="primary" icon="el-icon-plus" size="medium">
          新增公司
        </el-button>
      </div>
    </div>
    <div class="tableBox">
      <bsTables :table="tableData" />
      <center style="padding: 20px 0">
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
</template>

<script>
import bsTables from "@/components/tableBtn";
export default {
  name: "bsCompanyManage",
  components: {
    bsTables
  },
  data() {
    return {
      totalCount: 0,
      staffList: [],
      pageSize: 10,
      currentPage: 1,
      searchForm: {
        orderNumber: null,
        OfferNumber: null,
        CustomerName: null,
        staffId: null,
        clientName: null,
        contacts: null,
        dateTime: null
      },
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: this.size,
        isIndex: true,
        columns: [
          {
            prop: "offerNumber",
            minWidth: 100,
            isHiden: true,
            label: "报价单号",
            event: row => {
              const fd = {
                name: "详情" + row.offerNumber,
                linkUrl: "/bsIndex/bsSampleQuotation",
                component: "bsSampleQuotationDetails",
                refresh: true,
                label: "详情" + row.offerNumber,
                value: row
              };
              this.$store.commit("myAddTab", fd);
            },
            isCallback: row => {
              return (
                "<span style='color: #3368a9; cursor: pointer;'>" +
                row.offerNumber +
                "</span>"
              );
            }
          },
          {
            prop: "customerName",
            isHiden: true,
            label: "客户名称"
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "报价时间",
            render: row => {
              return row.createdOn ? row.createdOn.replace(/T.*/, "") : "";
            }
          },
          {
            prop: "linkman",
            isHiden: true,
            label: "业务员"
          },
          {
            prop: "total",
            isHiden: true,
            label: "报价总数"
          },
          {
            prop: "orgPersonnelName",
            isHiden: true,
            label: "总金额",
            color: "#eb1515",
            render: row => {
              return row.cu_de + row.offerTotalAmount;
            }
          },
          {
            prop: "cu_deName",
            isHiden: true,
            label: "币种"
          },
          {
            prop: "exchange",
            isHiden: true,
            label: "汇率"
          },
          {
            prop: "profit",
            isHiden: true,
            label: "利润"
          },
          {
            prop: "status",
            isHiden: true,
            label: "状态",
            render(row) {
              let str = "";
              switch (row.status) {
                case 0:
                  str = "未审核";
                  break;
                case 1:
                  str = "审核通过";
                  break;
                case 2:
                  str = "审核不通过";
                  break;
              }
              return str;
            }
          }
        ],
        actions: [
          {
            type: "success",
            textWrapper() {
              return "编辑";
            },
            hidden(row) {
              return row.offerNumber[0] != "S";
            },
            methods: row => {
              const fd = {
                name: "编辑" + row.offerNumber,
                linkUrl: "/bsIndex/bsSampleQuotation",
                component: "bsSampleUpdata",
                refresh: true,
                label: "编辑" + row.offerNumber,
                value: row
              };
              this.$store.commit("myAddTab", fd);
            }
          },
          {
            type: "info",
            textWrapper() {
              return "推送";
            },
            hidden(row) {
              return row.offerNumber[0] != "S";
            },
            methods: row => {
              row.label = "报价推送";
              const fd = {
                name: row.offerNumber + "报价推送",
                linkUrl: "/bsIndex/bsSampleQuotation",
                component: "bsPushIndex",
                refresh: true,
                noPush: true,
                label: "报价推送",
                value: row
              };
              this.$store.commit("myAddTab", fd);
            }
          },
          {
            type: "danger",
            textWrapper() {
              return "删除";
            },
            hidden(row) {
              return row.offerNumber[0] != "S";
            },
            methods: row => {
              console.log(row);
            }
          },
          {
            type: "warning",
            color: "#F9723E",
            hidden(row) {
              return row.offerNumber[0] != "S" ? false : true;
            },
            textWrapper() {
              return "导出";
            },
            methods: row => {
              console.log(row);
            },
            icon2: "el-icon-download"
          },
          {
            type: "warning",
            color: "#F9AE3E",
            hidden(row) {
              return row.offerNumber[0] != "S" ? false : true;
            },
            textWrapper() {
              return "分享";
            },
            methods: row => {
              console.log(row);
            },
            class: "copy",
            icon2: "el-icon-s-promotion"
          }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 搜索
    search() {
      this.currentPage = 1;
      // this.getCompanySamplelistPage();
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getCompanySamplelistPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getCompanySamplelistPage();
    }
  }
};
</script>
<style scoped lang="less">
.bsCompanyManage {
  padding: 0 20px;
  min-height: 100%;
  background-color: #fff;
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
  .searchBox {
    height: 76px;
    display: flex;
    align-items: center;
    .item {
      display: flex;
      align-items: center;
      max-width: 290px;
      margin-right: 20px;
      .label {
        width: 70px;
        min-width: 70px;
      }
    }
  }
}
</style>
