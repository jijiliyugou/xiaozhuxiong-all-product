<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-05-14 18:06:13
 * @FilePath: \projectd:\LittleBearPC\toys-bear-pc\src\views\bsPage\bsBusinessManage\bsDataTotal\bsDataTotalComponent\sampleTotal.vue
 * @LastEditTime: 2021-06-25 20:22:25
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="sampleTotal">
    <line-chart
      :title="title"
      :chartData="chartData"
      :defaultValue="defaultValue"
      :chartCoulum="chartCoulum"
      charId="sampleTotal"
      @set-date-type="setDateType"
      @change-search-date="changeSearchDate"
      @select-date="selectDate"
    ></line-chart>
    <div class="title">
      <div class="left">来访明细</div>
    </div>
    <div class="visit_total_table">
      <div class="searchBox">
        <div class="item">
          <span class="label">选择展厅：</span>
          <el-select
            v-model="searchForm.hallNumber"
            @change="changeHall"
            size="medium"
            clearable
            placeholder="请选择"
          >
            <template v-for="item in hallList">
              <el-option
                :key="item.hallNumber"
                :label="item.hallName"
                :value="item.hallNumber"
              >
              </el-option>
            </template>
          </el-select>
        </div>
        <div class="item">
          <span class="label">选择厂商：</span>
          <el-select
            v-model="searchForm.supplierNumber"
            filterable
            size="medium"
            clearable
            placeholder="请选择"
          >
            <template v-for="item in supplierList">
              <el-option
                :key="item.keyGuid"
                :label="item.client_na"
                :value="item.keyGuid"
              >
              </el-option>
            </template>
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
import LineChart from "@/components/public/lineChart";
import bsTables from "@/components/table";
import {
  calculateDateAndDates,
  getDiffDate,
  formatTime
} from "@/assets/js/common/common.js";
import { mapState } from "vuex";

export default {
  name: "SampleTotal",
  components: {
    bsTables,
    LineChart
  },
  data() {
    return {
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
      hallList: [], //展厅列表
      supplierList: [], //厂商列表
      searchForm: {
        keyword: null,
        hallNumber: null,
        supplierNumber: null,
        dateTime: null
      },
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        isIndex: false,
        columns: [
          {
            isHiden: true,
            label: "产品图片",
            elImageUrl: true,
            elImage: row => {
              return row.viewImage;
            }
          },
          {
            prop: "productNumber",
            isHiden: true,
            label: "产品名称"
          },
          {
            prop: "fa_no",
            isHiden: true,
            label: "出厂货号"
          },
          {
            prop: "salseName",
            isHiden: true,
            label: "公司名称"
          },
          {
            prop: "ma_na",
            isHiden: true,
            label: "厂商"
          },
          {
            prop: "hallName",
            isHiden: true,
            label: "展厅"
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "时间",
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
      title: "择样产品数趋势", //折线图名称
      chartData: [], //折线图数据
      defaultValue: "30天", //折线图默认天数
      dateType: 1, //接口类型
      chartCoulum: [] //折线图列名
    };
  },
  watch: {
    defaultValue: {
      handler(val) {
        if (val == "today") {
          this.dateType = 0;
        } else {
          this.dateType = 1;
        }
        var time = calculateDateAndDates(val);
        this.searchForm.startTime = time.startTime;
        this.searchForm.endTime = time.endTime;
        this.chartCoulum = time.dates;
        this.getChartDatas();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 获取图形数据
    async getChartDatas() {
      const fd = {
        dateType: this.dateType,
        startTime: this.searchForm.startTime,
        endTime: this.searchForm.endTime,
        supplierNumber: this.userInfo.commparnyList[0].companyNumber,
        skipCount: 1,
        maxResultCount: 99999,
        type: 1
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/getVisitingTrend", fd);
      if (res.data.result.code === 200) {
        //this.totalCount = res.data.result.item.totalCount;
        this.chartData = res.data.result.item.items;
      }
    },
    // 获取列表
    async getTableDataList() {
      const fd = {
        startTime: this.searchForm.startTime,
        endTime: this.searchForm.endTime,
        // salseCompanyNumber: this.userInfo.commparnyList[0].companyNumber,
        pageSize: this.pageSize,
        pageIndex: this.currentPage,
        hallNumber: this.searchForm.hallNumber,
        ma_nu: this.searchForm.supplierNumber,
        visitorsType: 6
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/GetCompanyPageByVisitorsAll", fd);
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
    // 选择展厅
    changeHall(val) {
      this.searchForm.supplierNumber = null;
      if (val) {
        const currentHall = this.hallList.find(v => v.hallNumber === val);
        this.supplierList = currentHall.supplierList;
      } else {
        this.supplierList = [];
      }
    },
    // 获取展厅下的厂商
    async getSupplierListByHall() {
      const res = await this.$http.post("/api/GetSupplierListByHall", {});
      if (res.data.result.code === 200) {
        this.hallList = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    //设置天数类型
    setDateType(value) {
      this.defaultValue = value;
    },
    //根据搜索的时间改变数据，重新生成chart
    changeSearchDate(value) {
      this.searchForm.startTime = value[0];
      this.searchForm.endTime = value[1];
      this.dateType = 1;
      this.chartCoulum = getDiffDate(
        this.searchForm.startTime,
        this.searchForm.endTime
      );
      this.getChartDatas();
    },
    //选中某个时间段查看明细
    selectDate(data) {
      var time = data.value[0];
      if (this.defaultValue == "today") {
        var data2 = formatTime(new Date());
        this.searchForm.startTime = data2 + "T" + time + ":00:00";
        this.searchForm.endTime = data2 + "T" + (parseInt(time) + 1) + ":59:59";
        this.searchForm.hallNumber = "";
        this.searchForm.ma_nu = "";
        this.getTableDataList();
      } else {
        this.searchForm.startTime = time + "T00:00:00";
        this.searchForm.endTime = time + "T23:59:59";
        this.searchForm.hallNumber = "";
        this.searchForm.ma_nu = "";
        this.getTableDataList();
      }
    }
  },
  created() {
    this.getTableDataList();
    this.getSupplierListByHall();
  },
  computed: {
    ...mapState(["currentComparnyId", "userInfo"])
  }
};
</script>
<style lang="less" scoped>
.sampleTotal {
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
