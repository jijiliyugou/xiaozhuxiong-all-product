<template>
  <div class="recommendProduct">
    <div class="searchBox">
      <div class="search_keyword">
        关键词：<el-input
          v-model="searchForm.keywrod"
          style="width:200px;"
          clearable
          size="medium"
          @keyup.native.enter="search"
          placeholder="请选择"
        >
        </el-input>
      </div>
      <div class="search_date">
        时间段：
        <el-date-picker
          style="width:235px;"
          size="medium"
          v-model="searchForm.date"
          value-format="yyyy-MM-ddTHH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        >
        </el-date-picker>
      </div>
      <el-button
        size="medium"
        icon="el-icon-search"
        type="primary"
        @click="search"
        style="width: 90px;"
      >
        搜索
      </el-button>
    </div>
    <div class="tableBox">
      <myTable :table="tableData" />
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
  </div>
</template>

<script>
import myTable from "@/components/table.vue";
import { mapState } from "vuex";
export default {
  components: {
    myTable
  },
  data() {
    return {
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      searchForm: {
        keywrod: null,
        date: null
      },
      tableData: {
        showLoading: false,
        isIndex: true,
        data: [],
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
            isHiden: true,
            label: "单价",
            color: "red",
            render: row => {
              return row.cu_de + row.price;
            }
          },
          {
            prop: "typeId",
            isHiden: true,
            label: "推荐类型",
            color: "#3368A9",
            render: row => {
              return row.recommendType === 0 ? "全网" : "店铺";
            }
          }
        ],
        actions: [
          {
            type: "warning",
            textWrapper() {
              return "取消推荐";
            },
            methods: row => {
              this.clearRecommend(row);
            }
          }
        ]
      }
    };
  },
  methods: {
    // 搜索
    search() {
      this.currentPage = 1;
      this.getRecommendProductPage();
    },
    // 取消推荐
    clearRecommend(row) {
      this.$confirm("确定取消推荐此产品吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post(
            "/api/DeleteRecommendProductDetaileByProductNumber",
            {
              productNumberList: [row.productNumber]
            }
          );
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "取消推荐成功",
              type: "success"
            });
            this.getRecommendProductPage();
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 获取推荐产品
    async getRecommendProductPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        companyNumber: this.userInfo.commparnyList[0].companyNumber,
        keywrod: this.searchForm.keywrod,
        startTime: this.searchForm.date && this.searchForm.date[0],
        endTime: this.searchForm.date && this.searchForm.date[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post(
        "/api/RecommendProductByNumberPage",
        fd
      );
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData.data = res.data.result.item.items;
        this.$emit("handlerRecommendCount", this.totalCount);
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
      this.getRecommendProductPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getRecommendProductPage();
    }
  },
  created() {},
  mounted() {
    this.getRecommendProductPage();
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
.recommendProduct {
  .searchBox {
    display: flex;
    .search_keyword {
      width: 275px;
      margin-right: 20px;
    }
    .search_date {
      width: 305px;
      margin-right: 20px;
    }
  }
  .tableBox {
    margin-top: 20px;
  }
}
</style>
