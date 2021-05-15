<template>
  <div class="bsSuperAdminHome">
    <div class="header">
      <ul>
        <li>
          <el-image
            style="width: 30px; height: 32px"
            :src="require('@/assets/images/zhantingyewu.png')"
            fit="contain"
          >
          </el-image>
          <span>VIP到期提醒</span>
          <p>12</p>
        </li>
        <li>
          <el-image
            style="width: 30px; height: 32px"
            :src="require('@/assets/images/zhantingyewu.png')"
            fit="contain"
          >
          </el-image>
          <span>新品待审核:</span>
          <p>12</p>
        </li>
        <li>
          <el-image
            style="width: 30px; height: 32px"
            :src="require('@/assets/images/zhantingyewu.png')"
            fit="contain"
          >
          </el-image>
          <span>现货待审核:</span>
          <p>12</p>
        </li>
        <li>
          <el-image
            style="width: 30px; height: 32px"
            :src="require('@/assets/images/zhantingyewu.png')"
            fit="contain"
          >
          </el-image>
          <span>VIP待审核:</span>
          <p>12</p>
        </li>
        <li>
          <el-image
            style="width: 30px; height: 32px"
            :src="require('@/assets/images/zhantingyewu.png')"
            fit="contain"
          >
          </el-image>
          <span>游客待审核</span>
          <p>12</p>
        </li>
        <li>
          <el-image
            style="width: 30px; height: 32px"
            :src="require('@/assets/images/zhantingyewu.png')"
            fit="contain"
          >
          </el-image>
          <span>错误日志记录</span>
          <p>12</p>
        </li>
      </ul>
    </div>
    <div class="todayData">
      <div class="title">
        <i class="icon myProductIcon"></i>
        <span>今日数据概况</span>
      </div>
      <div class="todayDataList">
        <ul>
          <li v-for="item in 10" :key="item.index">
            <el-image
              style="width: 30px; height: 32px"
              :src="require('@/assets/images/zhantingyewu.png')"
              fit="contain"
            >
            </el-image>
            <div class="todayAdd">
              <h3>10</h3>
              <p>今日新增配件商</p>
              <p>配件商总数: 85454</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="mainBox">
      <div class="todaySaleroom">
        <div class="headerTit">
          <div class="title">
            <i class="icon myProductIcon"></i>
            <span>今日销售额</span>
          </div>
          <div class="dayBox">
            <el-radio-group v-model="dayValue" size="mini" @change="changeTime">
              <el-radio-button
                v-for="(item, i) in dayList"
                :key="i"
                :label="item.value"
              ></el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="marketGross">
          <div class="grossBox">
            <h3>926,800.00</h3>
            <p>今日销售总额</p>
          </div>
        </div>
        <div class="compare">
          <div class="item">
            <p class="total">{{ statisticsData.hallOrderTotal }}</p>
            <p
              :class="{
                today: true,
                active: statisticsData.hallOrderTotalToday > 0
              }"
            >
              <img
                :src="statisticsData.hallOrderTotalToday > 0 ? up_t : up_f"
                alt=""
              />
              较今日:{{ statisticsData.hallOrderTotalToday }}
            </p>
            <p class="text">今日买家数</p>
          </div>
          <div class="item">
            <p class="total">{{ statisticsData.hallOrderTotal }}</p>
            <p
              :class="{
                today: true,
                active: statisticsData.hallOrderTotalToday > 0
              }"
            >
              <img
                :src="statisticsData.hallOrderTotalToday > 0 ? up_t : up_f"
                alt=""
              />
              较昨日:{{ statisticsData.hallOrderTotalToday }}
            </p>
            <p class="text">今日客单均价</p>
          </div>
        </div>
      </div>
      <div class="peopleCounting">
        <div class="title">
          <i class="icon myProductIcon"></i>
          <span>在线人数统计</span>
        </div>
        <div class="peopleNum">
          <div>
            <p class="dian">·</p>
            <p>当前在线：</p>

            <p><span class="txt">222</span> 人</p>
          </div>
          <div>
            <p>今日总在线：</p>

            <p><span class="txt">333</span> 人</p>
          </div>
          <div>
            <p>昨日总在线：</p>
            <p><span class="txt">444</span> 人</p>
          </div>
        </div>
      </div>
      <div class="trendingSearch">
        <div class="title">
          <i class="icon myProductIcon"></i>
          <span>热搜词</span>
        </div>
        <Table :table="trendingTableData"></Table>
      </div>
    </div>
    <div class="hottable">
      <div style="margin-right: 20px">
        <BsHotProductTable :productdata="searchProductdata" />
      </div>
      <div>
        <BsHotProductTable :productdata="purchaseProductdata" />
      </div>
    </div>
    <div class="hottable">
      <div style="margin-right: 20px">
        <BsHotProductTable :productdata="sampleProductdata" />
      </div>
      <div>
        <BsHotProductTable :productdata="offerProductdata" />
      </div>
    </div>
  </div>
</template>

<script>
import Table from "@/components/table";
import BsHotProductTable from "@/components/bsComponents/bsHomeComponent/bsHotProductTable";
export default {
  name: "bsSuperAdminHome",
  components: {
    Table,
    BsHotProductTable
  },
  data() {
    return {
      searchProductdata: {
        title: "热门搜索产品",
        className: "searchProductIcon",
        data: []
      },
      purchaseProductdata: {
        title: "热门采购产品",
        className: "purchaseProductIcon",
        data: []
      },
      sampleProductdata: {
        title: "热门择样产品",
        className: "sampleProductIcon",
        data: []
      },
      offerProductdata: {
        title: "热门报价产品",
        className: "offerProductIcon",
        data: []
      },
      dayValue: "今日",
      dayList: [
        {
          value: "今日"
        },
        {
          value: "昨日"
        }
      ],
      statisticsData: {
        hallOrderTotal: "", //展厅业务
        hallOrderTotalToday: "", //展厅今日
        sampleOfferTotal: "", //找样报价
        sampleOfferTotalToday: "", //找样报价今日
        purchaseTotal: "", //采购订单
        purchaseTotalToday: "", //采购今日
        shareTotal: "", //客户订单
        shareTotalToday: "" //客户订单今日
      },
      up_f: require("@/assets/images/up_f.png"),
      up_t: require("@/assets/images/up_t.png"),
      trendingTableData: {
        data: [],
        showLoading: false,
        isHiden: true,
        sizeMini: "mini",
        columns: [
          {
            prop: "name",
            label: "排名",
            render: row => {
              console.log(row);
            }
          },

          { prop: "fa_no", label: "关键词", width: 150 },
          { prop: "ch_pa", label: "包装" }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 天数请求
    changeTime(value) {
      console.log(value);
      //   this.timeData = Object.assign(calculateDate(value));
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsSuperAdminHome {
  min-height: 100%;
  .header {
    margin-bottom: 20px;
    ul {
      display: flex;
      justify-content: space-between;
      li {
        width: 260px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #ff6565;
        border-radius: 4px;
        padding: 0 40px 0 23px;
        color: #fff;
        box-sizing: border-box;
        p {
          font-size: 20px;
        }
      }
    }
    ul li:nth-of-type(1) {
      background-color: #ff6565;
    }
    ul li:nth-of-type(2) {
      background-color: #f9ae3e;
    }
    ul li:nth-of-type(3) {
      background-color: #5da4fb;
    }
    ul li:nth-of-type(4) {
      background-color: #896dff;
    }
    ul li:nth-of-type(5) {
      background-color: #29d2cc;
    }
    ul li:nth-of-type(6) {
      background-color: #ff9b74;
    }
  }
  // 共同的title
  .todaySaleroom,
  .peopleCounting,
  .peopleCounting,
  .trendingSearch,
  .todayData {
    background: #ffffff;
    border-radius: 4px;
    padding: 0 20px;
    box-sizing: border-box;
    .title {
      height: 50px;
      font-size: 18px;
      font-weight: 700;
      display: flex;
      align-items: center;
      .icon {
        width: 18px;
        height: 18px;
        margin-right: 17px;
        &.workbenchIcon {
          background: url("~@/assets/images/workbenchIcon.png") no-repeat center;
          background-size: contain;
        }
        &.statisticsIcon {
          background: url("~@/assets/images/statisticsIcon.png") no-repeat
            center;
          background-size: contain;
        }
        &.statisticalIcon {
          background: url("~@/assets/images/statisticalIcon.png") no-repeat
            center;
          background-size: contain;
        }
        &.rankingIcon {
          background: url("~@/assets/images/rankingIcon.png") no-repeat center;
          background-size: contain;
        }
        &.myProductIcon {
          background: url("~@/assets/images/myProductIcon.png") no-repeat center;
          background-size: contain;
        }
      }
    }
  }
  .todayData {
    .todayDataList {
      ul {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        li {
          display: flex;
          align-items: center;
          padding-left: 24px;
          box-sizing: border-box;
          text-align: center;
          margin-bottom: 20px;
          width: 308px;
          height: 120px;
          background: #ffffff;
          border: 1px solid #dcdfe6;
          border-radius: 5px;
          .todayAdd {
            width: 237px;
            h3 {
              height: 26px;
              font-size: 20px;
              font-weight: 700;
              color: #333333;
            }
            p {
              line-height: 30px;
              color: #666666;
            }
          }
        }
      }
    }
  }
  .mainBox {
    height: 415px;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .todaySaleroom {
      flex: 1;
      .headerTit {
        display: flex;
        justify-content: space-between;
        align-items: center;
        @{deep} .hotBox {
          .el-radio-group {
            .el-radio-button {
              .el-radio-button__inner {
                font-size: 18px;
                color: #999999;
                height: 50px;
                width: 100px;
                background-color: #fff;
                box-sizing: border-box;
                border: none;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                border-bottom: 3px solid transparent;
              }
              &.is-active {
                .el-radio-button__inner {
                  font-size: 18px;
                  font-weight: 700;
                  color: #3368a9;
                  border-bottom-color: #3368a9;
                  box-shadow: none;
                }
              }
            }
          }
        }
        .dayBox {
          display: flex;
          justify-content: flex-end;
        }
      }
      .marketGross {
        padding: 18px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        .grossBox {
          width: 183px;
          height: 183px;
          border: 6px solid #f9ae3e;
          border-radius: 50%;
          text-align: center;
          h3 {
            font-size: 24px;
            font-weight: 700;
            margin-top: 60px;
            color: #333333;
          }
          p {
            color: #666666;
          }
        }
      }
      .compare {
        padding: 0 10px;
        padding-top: 5px;
        box-sizing: border-box;
        display: flex;
        .item {
          width: 180px;
          text-align: center;
          cursor: pointer;
          margin-bottom: 20px;
          p {
            line-height: 34px;
            img {
              width: 10px;
              height: 15px;
              margin-right: 10px;
            }
            &.total {
              font-size: 24px;
              font-weight: 700;
            }
            &.today {
              color: #999999;
            }
            &.text {
              color: #999999;
            }
            &.active {
              color: #ff4848;
            }
          }
        }
      }
    }
    .peopleCounting {
      width: 780px;
      margin: 0 20px;
      .peopleNum {
        height: 56px;
        background: #f9fafc;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        box-sizing: border-box;
        div {
          flex: 1;
          text-align: center;
          color: #666666;
          display: flex;
          align-items: center;
          justify-content: center;
          p {
            .txt {
              font-size: 24px;
              font-weight: 700;
              color: #333333;
            }
          }
          .dian {
            color: #33a96a;
            font-size: 40px;
            padding: 0 8px;
          }
        }
      }
    }
    .trendingSearch {
      width: 420px;
    }
  }
  .hottable {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    div {
      height: 470px;
      flex: 1;
    }
  }
}
</style>
