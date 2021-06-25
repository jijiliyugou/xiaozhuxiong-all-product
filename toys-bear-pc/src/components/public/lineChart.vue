<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-05-14 18:06:13
 * @FilePath: \projectd:\LittleBearPC\toys-bear-pc\src\components\public\lineChart.vue
 * @LastEditTime: 2021-06-25 18:50:42
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="lineChart">
    <div class="title">
      <div class="left">{{ title }}</div>
      <div class="right">
        <div class="item date">
          <span class="label">时间段：</span>
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd"
            v-model="searchForm.dateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
        <div style="margin-left:10px;">
          <el-radio-group v-model="radio" size="mini" @change="change">
            <el-radio-button label="today">今日</el-radio-button>
            <el-radio-button label="3天">3天</el-radio-button>
            <el-radio-button label="7天">7天</el-radio-button>
            <el-radio-button label="15天">15天</el-radio-button>
            <el-radio-button label="30天">30天</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="visit_total_chart" id="lineChart"></div>
  </div>
</template>
<script>
/**
 * echart line 折线图
 * @description 该组件一般用统计
 * @tutorial https://echarts.apache.org/examples/zh/index.html#chart-type-bar
 * @property {Array} charId 折线图ID
 * @property {Array} data 折线图数据
 * @property {String} title 折线图标题
 * @property {String} defaultValue 默认筛选值
 * @getData {Function} click 点击切换筛选数据
 */
import * as echarts from "echarts";

export default {
  name: "LineChart",
  props: {
    charId: {
      type: String,
      dafault: "barChart"
    },
    title: {
      type: String,
      default: ""
    },
    chartData: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultValue: {
      type: String,
      dafault: ""
    },
    chartCoulum: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    //监听默认天数类型
    defaultValue: {
      handler(val) {
        this.radio = val;
      }
    },
    //监听传入数据 做数据处理 使数据变成[['日期','数量'],['2012-02-02'],...]的形式
    chartData: {
      handler(val) {
        this.data = [];
        for (var i = 0; i < val.length; i++) {
          var arr = Object.values(val[i]).reverse(); //对象转数租，在反序
          this.data.push(arr);
        }
        this.drawLine();
      }
      //immediate:true
    }
  },
  data() {
    return {
      radio: "30天",
      searchForm: {},
      data: [],
      pickerMinDate: "",
      pickerOptions: {
        disabledDate: time => {
          if (this.pickerMinDate !== "") {
            const day30 = (30 - 1) * 24 * 3600 * 1000;
            let maxTime = this.pickerMinDate + day30;
            let minTime = this.pickerMinDate - day30;
            if (maxTime > new Date()) {
              maxTime = new Date();
            }
            return time.getTime() > maxTime && time.getTime() < minTime;
          }
          return time.getTime() > Date.now();
        }
      }
    };
  },
  methods: {
    drawLine(flag) {
      var chartDom = document.getElementById("lineChart");
      var myChart = echarts.init(chartDom);
      var option;
      var me = this;

      option = {
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.chartCoulum,
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        },
        yAxis: {
          type: "value"
        },
        grid: {
          top: "12px",
          left: "12px",
          right: "12px",
          bottom: "12px",
          containLabel: true
        },
        series: [
          {
            data: this.data,
            type: "line",
            areaStyle: {}
          }
        ]
      };
      if (!flag) {
        option && myChart.setOption(option);
      } else {
        option && myChart.setOption(option, true);
      }
      myChart.off("click");
      myChart.on("click", function(params) {
        me.$emit("select-date", params);
      });
    },
    //获取数据
    getData(value) {
      this.$emit("get-data", value);
    },
    //设置时间类型
    change(value) {
      if (value == "今日") {
        return false;
      }
      this.$emit("set-date-type", value);
    },
    changeDate(value) {
      this.$emit("change-search-date", value);
      this.radio = "";
    }
  },
  mounted() {
    //this.drawLine();
  },
  created() {
    //this.getData();
  }
};
</script>
<style lang="less" scoped>
.lineChart {
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
    .right {
      display: flex;
    }
  }
  .visit_total_chart {
    width: 100%;
    height: 300px;
  }
}
</style>
