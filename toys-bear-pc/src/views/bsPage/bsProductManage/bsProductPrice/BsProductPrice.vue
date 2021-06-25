<template>
  <div class="bsProductPrice">
    <!-- 搜索 -->
    <div class="searchBox">
      <div class="searchBox_left">
        <div class="search_item">
          关键词：<el-input
            v-model="searchForm.keyword"
            style="width:200px;"
            @keyup.native.enter="search"
            clearable
            size="medium"
            placeholder="请选择"
          >
          </el-input>
        </div>
        <div class="search_item">
          时间段：<el-date-picker
            style="width:235px;"
            v-model="searchForm.date"
            size="medium"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          >
          </el-date-picker>
        </div>
        <el-button
          size="medium"
          @click="search"
          icon="el-icon-search"
          type="primary"
          style="width: 90px;"
        >
          搜索
        </el-button>
      </div>
      <div class="searchBox_right">
        <el-button
          size="medium"
          type="primary"
          @click="open_piXiu"
          style="width: 119px;"
        >
          批量修改价格
        </el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="tableBox">
      <myTable :table="tableData" @selectionChange="selectionChange" />
      <!-- 分页 -->
      <center style="padding:20px 0;">
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
    <!-- 批量修改价格 -->
    <el-dialog
      title="批量修改价格"
      :close-on-click-modal="false"
      :visible.sync="pi_dialog"
      v-if="pi_dialog"
      width="532px"
      top="250px"
    >
      <dialogComponents
        @close="pi_close"
        @subm="pi_subm"
        :selectionList="selectionList"
      />
    </el-dialog>
  </div>
</template>

<script>
import myTable from "@/components/table.vue";
import dialogComponents from "./components/dialogComponents.vue";
export default {
  name: "",
  components: {
    myTable,
    dialogComponents
  },
  data() {
    return {
      pi_dialog: false,
      tableData: {
        data: [],
        selection: true,
        showLoading: false,
        isIndex: true,
        columns: [
          {
            prop: "name",
            label: "产品信息",
            width: 300,
            color: "#3368a9",
            align: "center",
            infoBox: true,
            productInfo: true,
            cartInfoIcon: false,
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
            prop: "exhibitionName",
            isHiden: true,
            label: "资料来源"
          },
          {
            prop: "fa_no",
            isHiden: true,
            label: "出厂货号"
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "时间",
            render: row => {
              return row.createdOn && row.createdOn.replace(/T/, " ");
            }
          },
          {
            prop: "price",
            value: "price",
            isInput: true,
            align: "center",
            width: 200,
            label: "单价",
            color: "blue",
            inputBlur: row => {
              this.handlerPrice(row);
            }
          }
        ]
      },
      searchForm: {
        keyword: null,
        date: null
      },
      selectionList: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0
    };
  },
  mounted() {
    // 获取产品列表
    this.getMyProductPage();
  },
  methods: {
    // 取消批量修改价格
    pi_close() {
      this.pi_dialog = false;
    },
    // 批量修改价格成功
    pi_subm() {
      this.pi_dialog = false;
      this.selectionList = [];
      this.getMyProductPage();
    },
    // 打开批量修改价格
    open_piXiu() {
      if (!this.selectionList.length) {
        this.$common.handlerMsgState({
          msg: "请选择产品",
          type: "danger"
        });
        return false;
      }
      this.pi_dialog = true;
    },
    // 修改价格
    async handlerPrice(option) {
      console.log(option);
      const res = await this.$http.post("/api/UpdateProductPrice", {
        type: 0,
        priceVal: option.price,
        productNumberList: [option.productNumber]
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "修改价格成功",
          type: "success"
        });
        // this.getMyProductPage();
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取我的产品
    async getMyProductPage() {
      const fd = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.searchForm.keyword,
        startTime: this.searchForm.date && this.searchForm.date[0],
        endTime: this.searchForm.date && this.searchForm.date[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/MyProductPage", fd);
      if (res.data.result.code === 200) {
        this.tableData.data = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 选择发生变化
    selectionChange(list) {
      this.selectionList = list;
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getMyProductPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getMyProductPage();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getMyProductPage();
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsProductPrice {
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  .searchBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .searchBox_left {
      display: flex;
      .search_item {
        width: 300px;
        margin-right: 20px;
      }
    }
  }
  .tableBox {
    margin-top: 20px;
    @{deep} .el-table {
      .el-table__header-wrapper .el-checkbox {
        display: block !important;
      }
    }
  }
}
</style>
