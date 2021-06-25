<template>
  <div class="bsMessageReport">
    <!-- 头部 -->
    <div class="top_title">
      <div class="titleLeft">
        <span>消息举报 ({{ totalCount }})</span>
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
        <div class="search_item">
          审核状态：<el-select
            v-model="searchForm.reportType"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, i) in [
                { label: '全部', value: '' },
                { label: '屏蔽', value: 'Shield' },
                { label: '举报', value: 'Report' }
              ]"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
        <div>
          <el-button
            @click="search"
            size="medium"
            icon="el-icon-search"
            type="primary"
          >
            搜索
          </el-button>
        </div>
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
      title="审核"
      :visible.sync="shenheDialog"
      v-if="shenheDialog"
      width="800px"
      top="250px"
    >
      <editVersion :currentRow="currentRow" @sub="sub" />
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
            isHiden: true,
            companyInfo: true,
            align: "left",
            label: "用户",
            companyLogo: row => {
              return row.userImg;
            },
            linkman: row => {
              return row.userName;
            },
            companyName: row => {
              return row.userName;
            }
          },
          {
            prop: "platForm",
            isHiden: true,
            label: "举报类型",
            render: row => {
              return row.reportType === "Shield" ? "屏蔽" : "举报";
            }
          },
          {
            prop: "reportRemark",
            isHiden: true,
            label: "举报原因"
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "举报日期",
            render: row => {
              return row.createdOn && row.createdOn.replace(/T/, " ");
            }
          },
          {
            prop: "reportRemark",
            isHiden: true,
            label: "审核状态",
            render: row => {
              return row.reportState ? "审核通过" : "审核不通过";
            }
          },
          {
            prop: "handleResult",
            isHiden: true,
            label: "处理意见"
          }
        ],
        actions: [
          {
            type: "warning ",
            textWrapper() {
              return "审核";
            },
            disabledWrapper(row) {
              return row.reportType === "Shield";
            },
            methods: row => {
              this.currentRow = row;
              this.shenheDialog = true;
            }
          },
          {
            type: "danger",
            textWrapper() {
              return "删除";
            },
            methods: row => {
              this.deleteShenhe(row);
            }
          }
        ]
      },
      shenheDialog: false,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      searchForm: {
        date: null,
        state: "",
        reportType: null,
        keyword: null
      }
    };
  },
  mounted() {
    this.getMessageReportPage();
  },
  methods: {
    // 删除审核
    deleteShenhe(row) {
      this.$confirm("确定删除举报吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          try {
            row.isDelete = true;
            const res = await this.$http.post("/api/UpdateMessageReport", row);
            if (res.data.result.code === 200) {
              this.$common.handlerMsgState({
                msg: "删除成功",
                type: "success"
              });
              this.getMessageReportPage();
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
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 提交新增或编辑
    sub() {
      console.log("通过了");
      this.shenheDialog = false;
      this.getMessageReportPage();
    },
    // 获取所有举报列表
    async getMessageReportPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        reportType: this.searchForm.reportType,
        keyword: this.searchForm.keyword,
        startTime: this.searchForm.dateTile && this.searchForm.dateTile[0],
        endTime: this.searchForm.dateTile && this.searchForm.dateTile[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/MessageReportPage", fd);
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
      this.getMessageReportPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getMessageReportPage();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getMessageReportPage();
    }
  }
};
</script>
<style scoped lang="less">
.bsMessageReport {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
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
        .el-select {
          width: 200px;
          white-space: nowrap; /*不换行*/
        }
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
