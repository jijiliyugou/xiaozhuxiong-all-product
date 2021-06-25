<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-05-14 18:06:13
 * @FilePath: \projectd:\LittleBearPC\toys-bear-pc\src\views\bsPage\bsBusinessManage\bsDataTotal\bsDataTotalComponent\visitTotal.vue
 * @LastEditTime: 2021-06-25 20:22:41
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="visitTotal">
    <bar-chart
      :title="title"
      :chartData="chartData"
      :defaultValue="defaultValue"
      :chartCoulum="chartCoulum"
      charId="visitTotal"
      @set-date-type="setDateType"
      @change-search-date="changeSearchDate"
      @select-date="selectDate"
    ></bar-chart>
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
    <!-- 公司详情dialog -->
    <transition name="el-zoom-in-center">
      <el-dialog
        title=""
        class="detail_dialog"
        v-if="isShowModal"
        :visible.sync="isShowModal"
        width="455px"
        top="11vh"
      >
        <div class="detail_dialog_panel">
          <div class="detail_dialog_head">
            <img :src="defaultBgImg" />
          </div>
          <div class="detail_dialog_title">
            <div class="detail_dialog_title_text">
              {{ detailInfo.abbreviation }}
            </div>
          </div>
          <div class="detail_dialog_content">
            <div class="detail_dialog_content_name">
              {{ detailInfo.companyName }}
            </div>
            <div class="detail_dialog_content_list_item">
              <div
                class="detail_dialog_content_item"
                v-if="detailInfo.contactsMan"
              >
                <div class="label">
                  联系人：<span>{{ detailInfo.contactsMan }}</span>
                </div>
              </div>
              <div
                class="detail_dialog_content_item"
                v-if="detailInfo.telePhoneNumber"
              >
                <div class="label">
                  电话：<span>{{ detailInfo.telePhoneNumber }}</span>
                </div>
              </div>
              <div
                class="detail_dialog_content_item"
                v-if="detailInfo.phoneNumber"
              >
                <div class="label">
                  手机：<span>{{ detailInfo.phoneNumber }}</span>
                </div>
              </div>
              <div class="detail_dialog_content_item" v-if="detailInfo.address">
                <div class="label">
                  地址：<span>{{ detailInfo.address }}</span>
                </div>
              </div>
              <div class="detail_dialog_content_item_zixun">
                <div class="label chart" @click="toNews">
                  <div class="icon_box">
                    <i class="el-icon-chat-dot-round"></i>
                  </div>
                  <div class="icon_title">在线咨询</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </transition>
  </div>
</template>
<script>
import bsTables from "@/components/table";
import BarChart from "@/components/public/barChart";
import {
  calculateDateAndDates,
  getDiffDate,
  formatTime
} from "@/assets/js/common/common.js";
import { mapState } from "vuex";

export default {
  name: "VisitTotal",
  components: {
    bsTables,
    BarChart
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
            prop: "salseName",
            minWidth: 100,
            isHiden: true,
            label: "访客",
            event: row => {
              this.showDetailModal(row);
            },
            isCallback: row => {
              return (
                "<span style='color: #3368a9; cursor: pointer;'>" +
                row.salseName +
                "</span>"
              );
            }
          },
          {
            prop: "hallName",
            isHiden: true,
            label: "所在展厅"
          },
          {
            prop: "checkType",
            isHiden: true,
            label: "来源"
          },
          {
            prop: "ma_na",
            isHiden: true,
            label: "查看厂商"
          },
          {
            prop: "fa_no",
            isHiden: true,
            label: "查看货号"
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "查看时间",
            render: row => {
              return row.createdOn ? row.createdOn.replace(/T.*/, "") : "";
            }
          },
          {
            isHiden: true,
            label: "图片",
            elImageUrl: true,
            elImage: row => {
              return row.viewImage;
            }
          },
          {
            prop: "productNumber",
            isHiden: true,
            label: "产品名称"
          }
        ],
        btnWidth: 150
      },
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      isShowModal: false, //是否显示公司弹窗
      defaultBgImg: require("@/assets/images/bsCompanyQueryBg.png"),
      detailInfo: {}, //公司详情
      title: "来访趋势图", //柱形图名称
      chartData: [], //柱形图数据
      defaultValue: "30天", //柱形图默认天数
      dateType: 1, //接口类型
      chartCoulum: [] //柱形图列名
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
        this.getTableDataList();
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
        type: 0
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
        visitorsType: -2
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
    //详情弹窗
    showDetailModal(value) {
      var flag = this.isShowModal ? false : true;
      this.isShowModal = flag;
      if (this.isShowModal) {
        this.detailInfo = value;
        this.$set(
          this.detailInfo,
          "abbreviation",
          this.detailInfo.companyName &&
            this.detailInfo.companyName.substring(0, 2)
        );
      } else {
        this.detailInfo = {};
      }
    },
    //在线咨询
    toNews() {
      this.isShowModal = false;
      const fd = {
        name: this.detailInfo.companyNumber + "bsNews",
        linkUrl: "/bsIndex/bsNews",
        component: "bsNews",
        refresh: true,
        label: this.detailInfo.companyName,
        value: this.detailInfo
      };
      this.$router.push("/bsIndex/bsNews");
      this.$store.commit("myAddTab", fd);
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
@deep: ~">>>";
.visitTotal {
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
  @{deep} .detail_dialog {
    .el-dialog__body {
      padding: 0;
    }
  }
  .detail_dialog {
    .detail_dialog_panel {
      width: 100%;
      height: 699px;
      opacity: 1;
      background: #ffffff;
      border-radius: 4px;
      position: relative;
      .detail_dialog_head {
        width: 100%;
        height: 185px;
        opacity: 1;
        background: #ffffff;
      }
      .detail_dialog_title {
        width: 120px;
        height: 120px;
        opacity: 1;
        background: #3368a9;
        border: 1px solid #3368a9;
        border-radius: 50%;
        position: absolute;
        top: 125px;
        left: 167.5px;
        .detail_dialog_title_text {
          text-align: center;
          width: 120px;
          height: 52px;
          opacity: 1;
          font-size: 40px;
          font-weight: 400;
          color: #ffffff;
          line-height: 24px;
          margin-top: 48px;
        }
      }
      .detail_dialog_content {
        margin-top: 76px;
        .detail_dialog_content_name {
          width: 192px;
          height: 31px;
          opacity: 1;
          font-size: 24px;
          font-weight: 400;
          text-align: center;
          color: #333333;
          line-height: 34px;
          margin: auto;
        }
        .detail_dialog_content_list_item {
          margin-top: 48px;
          .detail_dialog_content_item {
            opacity: 1;
            font-size: 14px;
            font-weight: 400;
            text-align: left;
            color: #666666;
            line-height: 34px;
            margin-left: 90px;
          }
          .detail_dialog_content_item_zixun {
            opacity: 1;
            font-size: 14px;
            font-weight: 400;
            text-align: left;
            color: #666666;
            line-height: 45px;
            margin-left: 90px;
            .label {
              display: flex;
              .icon_box {
                width: 28px;
                height: 28px;
                opacity: 1;
                background: #3368a9;
                border: 1px solid #3368a9;
                border-radius: 50%;
                color: white;
                margin-top: 7.5px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .icon_title {
                margin-left: 10px;
              }
            }
            .chart:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
