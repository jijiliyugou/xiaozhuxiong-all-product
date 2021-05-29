<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-05-14 18:06:13
 * @FilePath: \projectd:\LittleBearPC\toys-bear-pc\src\views\bsPage\bsBusinessManage\bsDataTotal\bsDataTotalComponent\sampleTotal.vue
 * @LastEditTime: 2021-05-17 09:33:52
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="sampleTotal">
    <div class="title">
      <div class="left">择样产品数趋势</div>
      <div>
        <div style="margin-top: 20px">
          <el-radio-group v-model="radio" size="mini">
            <el-radio-button label="今日"></el-radio-button>
            <el-radio-button label="3天"></el-radio-button>
            <el-radio-button label="7天"></el-radio-button>
            <el-radio-button label="15天"></el-radio-button>
            <el-radio-button label="30天"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="visit_total_chart" id="barChart"></div>
    <div class="title">
      <div class="left">来访明细</div>
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
        <div class="item">
          <span class="label">择样类型：</span>
          <el-select
            v-model="searchForm.messageExt"
            size="medium"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, i) in typesList"
              :key="i"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <span class="label">展厅名称：</span>
          <el-input
            type="text"
            size="medium"
            clearable
            v-model="searchForm.fromCompanyName"
            placeholder="请输入关键词"
            @keyup.native.enter="search"
          ></el-input>
        </div>
        <div class="item">
          <span class="label">状态：</span>
          <el-select
            size="medium"
            v-model="searchForm.readStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, i) in readStatusList"
              :key="i"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <span class="label">业务员：</span>
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
  </div>
</template>
<script>
import * as echarts from "echarts";

export default {
  name: "SampleTotal",
  data() {
    return {
      radio: "30天",
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
      }
    };
  },
  methods: {
    drawLine() {
      var chartDom = document.getElementById("barChart");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "2.13",
            "2.14",
            "2.15",
            "2.16",
            "2.17",
            "2.18",
            "2.19",
            "2.20",
            "2.21",
            "2.22",
            "2.23",
            "2.24",
            "2.25",
            "2.26",
            "2.27",
            "2.28",
            "3.1",
            "3.2",
            "3.3",
            "3.4",
            "3.5",
            "3.6",
            "3.7",
            "3.8",
            "3.9",
            "3.10",
            "3.11",
            "3.12",
            "3.13",
            "3.14"
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [1888, 1500, 500, 1100, 800, 953, 556],
            type: "line",
            areaStyle: {}
          }
        ]
      };
      option && myChart.setOption(option);
    },
    search() {}
  },
  mounted() {
    this.drawLine();
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
  .visit_total_chart {
    width: 100%;
    height: 300px;
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
