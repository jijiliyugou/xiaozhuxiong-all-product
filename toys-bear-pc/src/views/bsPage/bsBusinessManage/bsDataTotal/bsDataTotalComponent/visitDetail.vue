<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-06-21 11:33:39
 * @FilePath: \projectd:\LittleBearPC\toys-bear-pc\src\views\bsPage\bsBusinessManage\bsDataTotal\bsDataTotalComponent\visitDetail.vue
 * @LastEditTime: 2021-06-22 18:52:40
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="sampleList">
    <div class="sample_list_table">
      <div class="searchBox">
        <div class="item">
          <span class="label">选择厂商：</span>
          <el-select
            v-model="searchForm.staffId"
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
  name: "bsVisitDetail",
  components: {
    bsTables
  },
  data() {
    return {
      staffList: {},
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
            prop: "messageModel",
            isHiden: true,
            label: "排行",
            render: row => {
              return this.getRankImg(row.messageModel);
            }
          },
          {
            prop: "orderNumber",
            minWidth: 100,
            isHiden: true,
            label: "择样单号",
            event: row => {
              const fd = {
                name: row.orderNumber,
                linkUrl: "/bsIndex/bsHallBusiness",
                component: "bsHallBusinessOrderDetails",
                refresh: true,
                label: row.orderNumber,
                value: row
              };
              this.$store.commit("myAddTab", fd);
            },
            isCallback: row => {
              return (
                "<span style='color: #3368a9; cursor: pointer;'>" +
                row.orderNumber +
                "</span>"
              );
            }
          },
          {
            prop: "messageExt",
            isHiden: true,
            label: "择样类型",
            render: row => {
              let msg;
              switch (row.messageExt) {
                case "0":
                  msg = "系统通知";
                  break;
                case "3":
                  msg = "补样";
                  break;
                case "5":
                  msg = "借样";
                  break;
                case "11":
                  msg = "补样借样";
                  break;
                case "12":
                  msg = "洽谈";
                  break;
              }
              return msg;
            }
          },
          {
            prop: "the_nu",
            isHiden: true,
            label: "本次代号"
          },
          {
            prop: "happenDate",
            isHiden: true,
            label: "择样日期",
            render: row => {
              return row.happenDate ? row.happenDate.replace(/T.*/, "") : "";
            }
          },
          {
            prop: "hall_na",
            isHiden: true,
            label: "展厅名称"
          },
          {
            prop: "orgPersonnelName",
            isHiden: true,
            label: "业务员"
          },
          {
            prop: "pushContent",
            isHiden: true,
            label: "备注"
          }
        ],
        btnWidth: 150
      },
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      sample_list_frist_src: require("@/assets/images/sample_list_first.png"),
      sample_list_second_src: require("@/assets/images/sample_list_secongd.png"),
      sample_list_thrid_src: require("@/assets/images/sample_list_thrid.png")
    };
  },
  methods: {
    // 获取列表
    async getTableDataList() {
      const fd = {
        sampleTo: "",
        messageModel: "1",
        readStatus: this.searchForm.readStatus,
        sampleFrom: "Hall",
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyWord: this.searchForm.keyword,
        staffId: this.searchForm.staffId,
        fromCompanyName: this.searchForm.fromCompanyName,
        messageExt: this.searchForm.messageExt,
        startTime: this.searchForm.dateTime && this.searchForm.dateTime[0],
        endTime: this.searchForm.dateTime && this.searchForm.dateTime[1]
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/GetERPOrderListByPage", fd);
      if (res.data.result.code === 200) {
        this.totalCount = res.data.result.item.totalCount;
        this.tableData.data = res.data.result.item.items;
      }
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
    },
    getRankImg(value) {
      if (value == 1) {
        return `<img style="width:21px;height:30px" src='${this.sample_list_frist_src}' />`;
      } else if (value == 2) {
        return `<img style="width:21px;height:30px" src='${this.sample_list_second_src}' />`;
      } else if (value == 3) {
        return `<img style="width:21px;height:30px" src='${this.sample_list_thrid_src}' />`;
      }
    }
  },
  mounted() {},
  created() {
    this.getTableDataList();
  }
};
</script>
<style lang="less" scoped>
.sampleList {
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
  .visit_total_chart {
    width: 100%;
    height: 300px;
  }
  .sample_list_table {
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
