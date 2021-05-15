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
      <div class="item" style="width: 200px">
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
      </div>
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
      pageSize: 10,
      currentPage: 1,
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        isIndex: true,
        columns: [
          {
            prop: "customerName",
            label: "客户",
            render: row => {
              return (
                "<i style='margin-right: 15px' class='el-icon-view'></i>" +
                row.customerName
              );
            }
          },
          { prop: "siteRegion", label: "站点" },
          { prop: "createdBy", label: "业务员" },
          { prop: "email", label: "登录邮箱" },
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
    // 获取列表
    async getSearchCompanyShareOrdersPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.keyword,
        userId: this.userId,
        websiteInfoId: this.websiteInfoId,
        startTime: this.dateTime && this.dateTime[0],
        endTime: this.dateTime && this.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/SearchLoginLogPage", fd);
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
      this.getSearchCompanyShareOrdersPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getSearchCompanyShareOrdersPage();
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
      this.getSearchCompanyShareOrdersPage();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getSearchCompanyShareOrdersPage();
    }
  },
  created() {
    this.getDefaultSites();
  },
  mounted() {
    this.getStaffList();
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
    .item {
      display: flex;
      align-items: center;
      max-width: 290px;
      margin-right: 20px;
      .label {
        width: 58px;
        min-width: 58px;
      }
    }
  }
  @{deep} .tableBox {
    .el-table {
      font-size: 13px;
      .imgBox {
        text-align: left;
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
          }
          .name {
            margin-top: 8px;
          }
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
