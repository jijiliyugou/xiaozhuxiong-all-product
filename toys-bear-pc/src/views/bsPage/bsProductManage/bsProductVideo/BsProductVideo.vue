<template>
  <div class="bsProductVideo">
    <!-- 头部 -->
    <div class="top_title">
      <div class="titleLeft">
        <span>产品视频 ({{ totalCount }})</span>
      </div>
      <div class="right">
        <el-button
          @click="openAppVideo"
          type="primary"
          size="medium"
          icon="el-icon-plus"
        >
          新增视频
        </el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="tableBox">
      <myTable :table="tableData" @changeTableSort="changeTableSort" />
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
    <!-- 上传视频 -->
    <el-dialog
      title="上传视频"
      :close-on-click-modal="false"
      :visible.sync="shang_dialog"
      v-if="shang_dialog"
      width="655px"
      top="250px"
    >
      <dialogComponents @close="close" @sub="subAddVideo" />
    </el-dialog>
  </div>
</template>

<script>
import myTable from "@/components/table.vue";
import dialogComponents from "./components/dialogComponents.vue";
import eventBus from "@/assets/js/common/eventBus";
export default {
  name: "",
  components: {
    myTable,
    dialogComponents
  },
  data() {
    return {
      sortType: null,
      shang_dialog: false,
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      tableData: {
        data: [],
        isIndex: true,
        columns: [
          {
            prop: "videoAddress",
            label: "视频",
            width: 200,
            elVideo: true
          },
          {
            prop: "videoTitle",
            isHiden: true,
            label: "视频名称"
          },
          {
            prop: "productCount",
            isHiden: true,
            label: "已绑定产品数量"
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "上传时间",
            sortable: "custom",
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
              const fd = {
                name: row.id + "产品信息",
                linkUrl: this.$route.path,
                component: "bsEditProductVideo",
                refresh: true,
                label: "产品信息",
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
            methods: row => {
              this.handlerDeleteVideo(row);
            }
          }
        ]
      }
    };
  },
  beforeDestroy() {
    eventBus.$off("resetVideoProduct");
  },
  mounted() {
    this.getVideoPage();
    eventBus.$on("resetVideoProduct", () => {
      this.getVideoPage();
    });
  },
  methods: {
    // 排序
    changeTableSort({ order }) {
      switch (order) {
        case "descending": // 降序
          this.sortType = 1;
          break;
        case "ascending": // 升序
          this.sortType = 2;
          break;
        default:
          this.sortType = null; // 无排序
          break;
      }
      this.getVideoPage();
    },
    // 提交
    subAddVideo() {
      this.shang_dialog = false;
      this.getVideoPage();
    },
    // 取消新增视频
    close() {
      this.shang_dialog = false;
    },
    // 打开新增视频
    openAppVideo() {
      this.shang_dialog = true;
    },
    // 删除视频
    handlerDeleteVideo(row) {
      this.$confirm("确定取消此视频吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          console.log(row);
          const res = await this.$http.post("/api/DeleteManuProductVideo", row);
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
            this.getVideoPage();
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
    // 获取产品视频
    async getVideoPage() {
      const fd = {
        skipCount: this.currentPage,
        sortType: this.sortType,
        maxResultCount: this.pageSize
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/ManuProductVideoPage", fd);
      console.log(res);
      if (res.data.result.code === 200) {
        this.tableData.data = [];
        this.totalCount = res.data.result.item.totalCount;
        this.$nextTick(() => {
          this.tableData.data = res.data.result.item.items;
        });
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
      this.getVideoPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getVideoPage();
    }
  }
};
</script>
<style scoped lang="less">
.bsProductVideo {
  background-color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
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
  .tableBox {
    margin-top: 20px;
  }
}
</style>
