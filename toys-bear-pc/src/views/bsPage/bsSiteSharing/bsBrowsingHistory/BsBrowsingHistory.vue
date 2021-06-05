<template>
  <div class="bsMyCollection">
    <div class="title">浏览记录 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="item">
        <span class="label">关键字：</span>
        <el-input
          v-focus
          type="text"
          size="medium"
          v-model="keyword"
          clearable
          placeholder="请输入关键词"
          @keyup.native.enter="search"
        ></el-input>
      </div>
      <!-- <div class="item" style="width: 200px">
        <span class="label">站点：</span>
        <el-select
          v-model="websiteInfoId"
          size="medium"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in sitesList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div> -->
      <div class="item" v-if="userInfo.userInfo.isMain">
        <span class="label">业务员：</span>
        <el-select
          v-model="userId"
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
        <span class="label">时间段：</span>
        <el-date-picker
          size="medium"
          value-format="yyyy-MM-ddTHH:mm:ss"
          v-model="dateTime"
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
        <div class="laiY">
          浏览来源：
        </div>
      </div>
      <div class="item">
        <el-button
          size="medium"
          @click="handletype('')"
          :class="{ all: btnType == '' }"
        >
          <i class="allSource"></i>
          <span :class="{ itemBtn: true, color: btnType == '' }">全部来源</span>
        </el-button>
      </div>
      <div class="item">
        <el-button
          size="medium"
          @click="handletype('BrowseProducts')"
          :class="{ ll: btnType == 'BrowseProducts' }"
        >
          <i class="llcommodity"></i>
          <span :class="{ itemBtn: true, color: btnType == 'BrowseProducts' }"
            >浏览商品</span
          >
        </el-button>
      </div>
      <div class="item">
        <el-button
          size="medium"
          @click="handletype('ProductsShop')"
          :class="{ jg: btnType == 'ProductsShop' }"
        >
          <i class="commodityJg"></i>
          <span :class="{ itemBtn: true, color: btnType == 'ProductsShop' }"
            >商品加购</span
          >
        </el-button>
      </div>
      <div class="item">
        <el-button
          size="medium"
          @click="handletype('ProductOrder')"
          :class="{ Dd: btnType == 'ProductOrder' }"
        >
          <i class="commodityDd"></i>
          <span :class="{ itemBtn: true, color: btnType == 'ProductOrder' }"
            >商品订单</span
          >
        </el-button>
      </div>
    </div>

    <div class="tableBox">
      <Table :table="tableData"></Table>
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
import { mapState } from "vuex";
import Table from "@/components/table";
export default {
  name: "bsBrowsingHistory",
  components: {
    Table
  },
  data() {
    return {
      staffList: [],
      userId: null,
      websiteInfoId: null,
      keyword: null,
      dateTime: null,
      sitesList: [],
      totalCount: 0,
      btnType: "",
      pageSize: 10,
      currentPage: 1,
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        // isIndex: true,
        columns: [
          {
            width: 300,
            color: "#3368a9",
            productInfo: true,
            prop: "customerName",
            label: "浏览产品",
            infoBox: true,
            align: "left",
            elImage: row => {
              return row.imageUrls;
            },
            nameHtml: row => {
              return row.productName;
            },
            fcatoryNameHtml: row => {
              return row.supplierName;
            }
          },
          { prop: "customerName", label: "浏览客户" },
          { prop: "contactperson", label: "联系人" },
          { prop: "linkman", label: "业务员" },
          {
            prop: "source",
            label: "浏览来源",
            render: row => {
              let msg = "";
              switch (row.source) {
                case "BrowseProducts":
                  msg = "<i  class='iconll'></i>浏览商品";
                  break;
                case "ProductOrder":
                  msg = "<i  class='iconDd'></i>商品订单";
                  break;
                case "ProductsShop":
                  msg = "<i  class='iconJg'></i>商品加购";
                  break;
              }
              return msg;
            }
          },
          { prop: "siteName", label: "浏览站点" },
          { prop: "url", label: "浏览网址" },
          {
            prop: "createdOn",
            label: "浏览时间",
            render: row => {
              return row.createdOn.replace(/T.*/, "");
            }
          }
        ]
      }
    };
  },
  methods: {
    // 获取公司下的员工列表
    async getStaffList() {
      const res = await this.$http.post("/api/CompanyUserList", {
        orgCompanyID: this.$store.state.userInfo.commparnyList[0].commparnyId
      });
      if (res.data.result.code === 200) {
        this.staffList = res.data.result.item.personnels;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取站点浏览记录分页查询
    async getSearchWebsiteBrowsingPage() {
      const fd = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.keyword,
        userId: this.userId,
        startTime: this.dateTime && this.dateTime[0],
        endTime: this.dateTime && this.dateTime[1],
        source: this.btnType
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined) {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/SearchWebsiteBrowsingPage", fd);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData.data = res.data.result.item.items;
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
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getSearchWebsiteBrowsingPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getSearchWebsiteBrowsingPage();
    },
    // 获取站点列表
    async getDefaultSites() {
      const res = await this.$http.post("/api/SearchDropdownWebsiteInfos", {});
      if (res.data.result.code === 200) {
        this.sitesList = [{ name: "全部", id: null }, ...res.data.result.item];
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
      this.getSearchWebsiteBrowsingPage();
    },
    // 切换类型
    handletype(type) {
      this.btnType = type;
      this.getSearchWebsiteBrowsingPage();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getSearchWebsiteBrowsingPage();
    }
  },
  created() {
    // this.getDefaultSites();
  },
  mounted() {
    this.getStaffList();
    this.getSearchWebsiteBrowsingPage();
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsMyCollection {
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
  .searchBox {
    height: 76px;
    display: flex;
    align-items: center;
    @{deep}.item {
      display: flex;
      align-items: center;
      max-width: 290px;
      margin-right: 20px;
      .all {
        background: #65a9fe;
      }
      .ll {
        background: #33a96a;
      }
      .jg {
        background: #f9723e;
      }
      .Dd {
        background: #7965ff;
      }
      .itemBtn {
        line-height: 28px;
        color: #333;
        &.color {
          color: #fff;
        }
      }
      .laiY {
        width: 140px;
        text-align: right;
        height: 24px;
        line-height: 24px;
        border-left: 1px solid #dcdfe6;
      }
      .label {
        width: 58px;
        min-width: 58px;
      }
    }
  }

  .allSource {
    display: inline-block;
    vertical-align: bottom;
    width: 28px;
    height: 28px;
    background: url("~@/assets/images/allSource.png") no-repeat center;
    background-size: contain;
    margin-right: 10px;
  }
  .llcommodity {
    display: inline-block;
    vertical-align: bottom;
    width: 28px;
    height: 28px;
    background: url("~@/assets/images/llcommodity.png") no-repeat center;
    background-size: contain;
    margin-right: 10px;
  }
  .commodityJg {
    display: inline-block;
    vertical-align: bottom;
    width: 28px;
    height: 28px;
    background: url("~@/assets/images/commodityJg.png") no-repeat center;
    background-size: contain;
    margin-right: 10px;
  }
  .commodityDd {
    display: inline-block;
    vertical-align: bottom;
    width: 28px;
    height: 28px;
    background: url("~@/assets/images/commodityDd.png") no-repeat center;
    background-size: contain;
    margin-right: 10px;
  }

  @{deep} .tableBox {
    .el-table {
      font-size: 13px;
      .iconll {
        display: inline-block;
        vertical-align: bottom;
        width: 18px;
        height: 13px;
        background: url("~@/assets/images/iconll.png") no-repeat center;
        background-size: contain;
        margin-right: 10px;
        margin-bottom: 4px;
      }
      .iconJg {
        display: inline-block;
        vertical-align: bottom;
        width: 18px;
        height: 13px;
        background: url("~@/assets/images/iconJg.png") no-repeat center;
        background-size: contain;
        margin-right: 10px;
        margin-bottom: 4px;
      }
      .iconDd {
        display: inline-block;
        vertical-align: bottom;
        width: 18px;
        height: 13px;
        background: url("~@/assets/images/iconDd.png") no-repeat center;
        background-size: contain;
        margin-right: 10px;
        margin-bottom: 4px;
      }
    }
  }
}
</style>
