<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-05-14 18:06:13
 * @FilePath: \projectd:\LittleBearPC\toys-bear-pc\src\views\bsPage\bsStatisticsManage\bsQueryLogRecord\BsQueryLogRecord.vue
 * @LastEditTime: 2021-06-24 10:57:57
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="bsQueryLogRecord">
    <div class="title">
      <div class="left">查询日志记录({{ totalCount }})</div>
    </div>
    <div class="visit_total_table">
      <div class="searchBox">
        <div class="item">
          <span class="label">关键字：</span>
          <el-input
            v-focus
            type="text"
            size="medium"
            v-model="searchForm.keyword"
            clearable
            placeholder="请输入关键词"
            @keyup.native.enter="search"
          ></el-input>
        </div>
        <div class="item date">
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
import bsTables from "@/components/table";

export default {
  name: "BsQueryLogRecord",
  components: {
    bsTables
  },
  data() {
    return {
      typesList: [
        {
          label: "系统通知",
          value: 0
        },
        {
          label: "补样",
          value: 3
        },
        {
          label: "借样",
          value: 5
        },
        {
          label: "补样借样",
          value: 11
        },
        {
          label: "洽谈",
          value: 12
        }
      ],
      readStatusList: [
        {
          label: "全部",
          value: "-1"
        },
        {
          label: "未读",
          value: 0
        },
        {
          label: "已读",
          value: 1
        }
      ],
      userInfo: {},
      staffList: [],
      searchForm: {
        keyword: null,
        fromCompanyName: null,
        staffId: null,
        messageExt: null,
        readStatus: "-1",
        dateTime: null
      },
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        isIndex: false,
        columns: [
          {
            prop: "phoneNumber",
            isHiden: true,
            label: "查询关键词"
          },
          {
            prop: "phoneNumber",
            isHiden: true,
            label: "查询人"
          },
          {
            prop: "message",
            isHiden: true,
            label: "所属公司"
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "查询日期",
            render: row => {
              return row.createdOn ? row.createdOn.replace(/T.*/, "") : "";
            }
          }
        ],
        btnWidth: 150
      },
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      title: "推送趋势",
      data: [1888, 1500, 500, 1100, 800, 953, 556],
      defaultValue: "30天"
    };
  },
  watch: {
    $route(to) {
      if (to.path == this.$route.path) {
        this.$refs.bsPushRecordChart.drawLine(true);
      }
    }
  },
  methods: {
    // 获取列表
    async getTableDataList() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        // startTime: this.formInline.dateTile && this.formInline.dateTile[0],
        // endTime: this.formInline.dateTile && this.formInline.dateTile[1],
        keyword: this.searchForm.keyword
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/SMSrecordPage", fd);
      if (res.data.result.code === 200) {
        this.tableData.data = res.data.result.object.items;
        this.totalCount = res.data.result.object.totalCount;
      } else {
        this.$message.error(res.data.result.message);
      }
      //   if (res.data.result.code === 200) {
      //     this.totalCount = res.data.result.item.totalCount;
      //     this.tableData.data = res.data.result.item.items;
      //   }
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getTableDataList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getTableDataList();
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getTableDataList();
    }
  },
  mounted() {
    this.$refs.bsPushRecordChart.drawLine();
  },
  created() {
    this.getTableDataList();
  }
};
</script>
<style lang="less" scoped>
.bsQueryLogRecord {
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
    // border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left::before {
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
  .visit_total_table {
    .searchBox {
      height: 76px;
      display: flex;
      align-items: center;
      .item {
        display: flex;
        align-items: center;
        max-width: 200px;
        margin-right: 20px;
        &.date {
          min-width: 300px;
        }
        .label {
          width: 70px;
          min-width: 70px;
        }
      }
    }
  }
}
</style>
