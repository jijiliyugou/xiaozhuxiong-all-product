<template>
  <div class="bsMyCollection">
    <div class="title">登录记录 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="item">
        <span class="label">关键词：</span>
        <el-input
          v-focus
          type="text"
          size="medium"
          v-model="companyKeyword"
          clearable
          placeholder="请输入关键词"
          @keyup.native.enter="search"
        ></el-input>
      </div>
      <div class="item">
        <span class="label">时间段：</span>
        <el-date-picker
          size="medium"
          value-format="yyyy-MM-ddTHH:mm:ss"
          v-model="dateTile"
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
import Table from "@/components/table";
export default {
  name: "bsLoginRecord",
  components: {
    Table
  },
  data() {
    return {
      companyKeyword: null,
      dateTile: null,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      tableData: {
        data: [],
        sizeMini: "mini",
        columns: [
          { prop: "companyName", label: "公司名称" },
          { prop: "companyNumber", label: "公司编号" },
          { prop: "linkman", label: "员工名称" },
          { prop: "phoneNumber", label: "手机号码" },
          {
            prop: "createdOn",
            label: "登录时间",
            render: row => {
              return row.createdOn.replace(/T/, " ");
            }
          }
        ]
      }
    };
  },
  methods: {
    // 获取登录记录
    async getSearchLoginLogRecordsPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        companyKeyword: this.companyKeyword,
        startTime: this.dateTile && this.dateTile[0],
        endTime: this.dateTile && this.dateTile[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/SearchLoginLogRecordsPage", fd);
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
      if (this.currentPage * pageSize > this.totalCount) return false;
      this.getSearchLoginLogRecordsPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getSearchLoginLogRecordsPage();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getSearchLoginLogRecordsPage();
    }
  },
  created() {
    this.getSearchLoginLogRecordsPage();
  },
  mounted() {},
  computed: {}
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
