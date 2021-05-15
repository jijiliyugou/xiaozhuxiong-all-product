<template>
  <div class="bsGoodsYardSearch">
    <div class="title">货场查询 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="left">
        <div class="item">
          <span class="label">关键字：</span>
          <el-input
            v-focus
            type="text"
            size="medium"
            clearable
            v-model="keyword"
            placeholder="请输入关键词"
            @keyup.native.enter="search"
          ></el-input>
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
          <span class="label">货场类型：</span>
          <el-select
            filterable
            size="medium"
            style="width: 200px; heigth: 35px"
            clearable
            v-model="yardType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in yardTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
    </div>
    <!-- 货场列表 -->
    <div class="tableBox">
      <Table :table="tableData"></Table>
      <!-- 分页 -->
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
  name: "bsGoodsYardSearch",
  components: {
    Table
  },
  data() {
    return {
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      keyword: null,
      dateTime: null,
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        isIndex: true,
        columns: [
          {
            prop: "imgUrl",
            label: "图片",
            productInfo: true,
            elImage: row => {
              return row.imgUrl;
            }
          },
          { prop: "yardName", label: "货场名称" },
          {
            prop: "yardType",
            label: "货场类型",
            render: row => {
              return row.yardType === 0 ? "货场" : "货运";
            }
          },
          { prop: "contactsMan", label: "联系人" },
          { prop: "telephone", label: "电话" },
          { prop: "phoneNumber", label: "手机" },
          { prop: "address", label: "地址" },
          { prop: "remark", label: "备注", isHiden: true, width: 140 },
          {
            prop: "createdOn",
            label: "时间",
            render: row => {
              return row.createdOn.replace(/T.*/, "");
            }
          }
        ]
      },
      yardTypeList: [
        {
          id: 0,
          name: "货场"
        },
        {
          id: 1,
          name: "货运"
        }
      ],
      yardType: null
    };
  },
  methods: {
    async getProductYardPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.keyword,
        startTime: this.dateTime && this.dateTime[0],
        endTime: this.dateTime && this.dateTime[1],
        yardType: this.yardType
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/ProductYardPage", fd);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData.data = res.data.result.item.items;
      }
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getProductYardPage();
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getProductYardPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getProductYardPage();
    }
  },
  created() {},
  mounted() {
    this.getProductYardPage();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
@{deep} .el-table {
  color: #666;
}
.bsGoodsYardSearch {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
  .title {
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
    .left {
      flex: 1;
      display: flex;
      align-items: center;
      .item {
        display: flex;
        align-items: center;
        max-width: 290px;
        margin-right: 20px;
        .label {
          min-width: 58px;
        }
      }
    }
    .right {
      display: flex;
      width: 122px;
      min-width: 122px;
      margin-right: 50px;
    }
  }
  .yardForm {
    display: flex;
    align-items: center;
  }
}
</style>
