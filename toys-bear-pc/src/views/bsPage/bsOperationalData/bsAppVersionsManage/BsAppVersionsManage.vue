<template>
  <div class="bsAppVersionsManage">
    <!-- 头部 -->
    <div class="top_title">
      <div class="titleLeft">
        <span>版本列表 ({{ totalCount }})</span>
      </div>
      <div class="right"></div>
    </div>
    <!-- 搜索 -->
    <div class="searchWarp">
      <div class="searchBox">
        <div class="search_item">
          公司名称：<el-input
            v-model="searchForm.keyword"
            style="width:200px;"
            @keyup.native.enter="search"
            clearable
            size="medium"
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
          @click="search"
          icon="el-icon-search"
          type="primary"
          style="width: 90px;"
        >
          搜索
        </el-button>
      </div>
      <div class="btns">
        <el-button
          size="medium"
          icon="el-icon-plus"
          type="primary"
          @click="openAddVersion"
        >
          新增版本
        </el-button>
      </div>
    </div>
    <!-- 表格 -->
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
    <!-- 新增编辑版本 -->
    <el-dialog
      :title="versionTitle"
      :visible.sync="versionDialog"
      v-if="versionDialog"
      width="800px"
      top="250px"
    >
      <editVersion
        @close="close"
        @sub="subm"
        :isEdit="isEdit"
        :currentRow="currentRow"
      />
    </el-dialog>
  </div>
</template>

<script>
import myTable from "@/components/table.vue";
import editVersion from "./components/editVersion.vue";
export default {
  name: "",
  components: {
    myTable,
    editVersion
  },
  data() {
    return {
      currentRow: null,
      tableData: {
        data: [],
        isIndex: true,
        columns: [
          {
            prop: "platForm",
            isHiden: true,
            label: "平台"
          },
          {
            prop: "vesion",
            isHiden: true,
            label: "版本号"
          },
          {
            prop: "fileUrl",
            isHiden: true,
            label: "版本地址"
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "新增时间",
            render: row => {
              return row.createdOn && row.createdOn.replace(/T/, " ");
            }
          }
        ],
        actions: [
          {
            type: "primary",
            textWrapper() {
              return "编辑";
            },
            methods: row => {
              this.versionDialog = true;
              this.isEdit = true;
              this.currentRow = row;
            }
          },
          {
            type: "danger",
            textWrapper() {
              return "删除";
            },
            methods: row => {
              console.log(row);
              this.deleteVersion(row);
            }
          }
        ]
      },
      isEdit: false,
      versionDialog: false,
      versionTitle: "新增版本",
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      stateList: [],
      searchForm: {
        date: null,
        keyword: null
      }
    };
  },
  mounted() {
    this.getAppVersionPage();
  },
  methods: {
    // 删除版本
    deleteVersion(row) {
      this.$confirm("确定删除此版本吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(async () => {
        try {
          const res = await this.$http.post("/api/UpdateBearVesion", {
            isdelete: true,
            id: row.id
          });
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
            this.getAppVersionPage();
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        } catch (err) {
          this.$common.handlerMsgState({
            msg: err,
            type: "danger"
          });
        }
      });
    },
    // 提交新增或编辑
    subm() {
      this.versionDialog = false;
      this.getAppVersionPage();
    },
    // 关闭新增版本
    close() {
      this.versionDialog = false;
    },
    // 打开新增版本
    openAddVersion() {
      this.versionTitle = "新增版本";
      this.isEdit = false;
      this.versionDialog = true;
    },
    // 获取所有版本列表
    async getAppVersionPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        startTime: this.searchForm.date && this.searchForm.date[0],
        endTime: this.searchForm.date && this.searchForm.date[1],
        keyword: this.searchForm.keyword
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/BearVesionPage", fd);
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
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getAppVersionPage();
    }
  }
};
</script>
<style scoped lang="less">
.bsAppVersionsManage {
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 20px;
  .top_title {
    height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e5e5;
    .titleLeft {
      flex: 1;
    }
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
  .searchWarp {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .searchBox {
      display: flex;
      .search_item {
        width: 275px;
        margin-right: 20px;
      }
      .search_date {
        width: 305px;
        margin-right: 20px;
      }
    }
  }
  .tableBox {
    margin-top: 20px;
  }
}
</style>
