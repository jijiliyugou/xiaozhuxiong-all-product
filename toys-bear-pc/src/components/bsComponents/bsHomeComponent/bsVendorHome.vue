<!--  -->
<template>
  <div class="baVendorHome">
    <div class="myWorkbench">
      <div class="title">
        <i class="icon workbenchIcon"></i>
        <span>我的工作台</span>
      </div>
      <div class="content">
        <li
          class="item"
          @click="handleGoToUrl(item.title)"
          v-for="(item, i) in gongzuoList"
          :key="i"
        >
          <el-image
            style="width: 30px; height: 32px"
            :src="item.icon"
            fit="contain"
          >
          </el-image>
          <!-- <el-badge :value="5" class="homeBadge"> -->
          <span class="text">{{ item.title }}</span>
          <!-- </el-badge> -->
        </li>
        <li class="block"></li>
        <li class="block"></li>
        <li class="block"></li>
      </div>
    </div>
    <div class="centerBox">
      <div class="myProduct">
        <div class="title">
          <i class="icon myProductIcon"></i>
          <span>我的产品</span>
        </div>
        <div class="labels">
          <div
            class="item"
            @click="handleGoToUrl(item.title)"
            v-for="(item, i) in labelList"
            :key="i"
          >
            <div class="imgBox">
              <el-image
                style="width: 54px; height: 54px"
                :src="item.icon"
                fit="contain"
              >
              </el-image>
            </div>
            <div class="conText">
              <div class="titleName">{{ item.title }}</div>
              <div class="text">{{ item.content }}</div>
            </div>
          </div>
          <div class="block"></div>
          <div class="block"></div>
          <div class="block"></div>
          <div class="block"></div>
        </div>
      </div>
      <div class="banner"></div>
    </div>
    <div class="statisticalBox">
      <div class="visiting">
        <div class="title">
          <i class="icon statisticsIcon"></i>
          <span>来访统计</span>
        </div>
        <div class="totalBox">
          <span>择样产品总数</span>
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
            今日:{{ statisticsData.hallOrderTotalToday }}
          </p>
        </div>
        <Table :table="visitingTableData"></Table>
      </div>
      <div class="sample">
        <div class="title">
          <i class="icon statisticalIcon"></i>
          <span>择样统计</span>
        </div>
        <div class="totalBox">
          <span>择样产品总数</span>
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
            今日:{{ statisticsData.hallOrderTotalToday }}
          </p>
        </div>
        <Table :table="sampleTableData"></Table>
      </div>
      <div class="ranking">
        <div class="title">
          <i class="icon rankingIcon"></i>
          <span>择样排行</span>
        </div>
        <div class="totalBox">
          <span>择样产品总数</span>
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
            今日:{{ statisticsData.hallOrderTotalToday }}
          </p>
        </div>
        <Table :table="rankingTableData"></Table>
      </div>
    </div>
  </div>
</template>

<script>
import Table from "@/components/table";
export default {
  name: "baVendorHome",
  components: {
    Table
  },
  data() {
    return {
      up_f: require("@/assets/images/up_f.png"),
      up_t: require("@/assets/images/up_t.png"),
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
      labelList: [
        {
          title: "找玩具",
          content: "产品100W+为您存在",
          icon: require("@/assets/images/zhaowanju.png")
        },
        {
          title: "按图找样",
          content: "智能对比，轻松找样",
          icon: require("@/assets/images/antuzhaoyang.png")
        },
        {
          title: "现货区",
          content: "现货在手，说有就有",
          icon: require("@/assets/images/xianhuoqu.png")
        },
        {
          title: "VIP区",
          content: "品牌厂商不容错过",
          icon: require("@/assets/images/vipqu.png")
        },
        {
          title: "玩具圈",
          content: "查看发布玩具信息",
          icon: require("@/assets/images/wanjuquan.png")
        }
      ],
      gongzuoList: [
        {
          title: "展厅业务",
          icon: require("@/assets/images/zhantingyewu.png")
        },
        {
          title: "找样报价",
          icon: require("@/assets/images/zhaoyangbaojia.png")
        },
        {
          title: "采购订单",
          icon: require("@/assets/images/caigoudingdan.png")
        },
        {
          title: "浏览足迹",
          icon: require("@/assets/images/liulanzuji.png")
        },
        {
          title: "站点分享",
          icon: require("@/assets/images/zhandianfenxiang.png")
        },
        {
          title: "客户订单",
          icon: require("@/assets/images/kehudingdan.png")
        },
        {
          title: "我的消息",
          icon: require("@/assets/images/wodexiaoxi.png")
        }
      ],
      visitingTableData: {
        data: [
          {
            name: "成名",
            url:
              "http://img.toysbear.com/ProductImgCutting//HS0016308/HS0000005/P160235290538512_HS0016308_Photo01YS0549242.jpg"
          }
        ],
        selection: false,
        showLoading: false,
        height: "390",
        columns: [
          {
            prop: "name",
            label: "访客",
            width: 150,
            productInfo: true,
            cartInfoIcon: true,
            color: "red",
            // elImage: (row) => {
            //   return row.url;
            // },
            nameHtml: row => {
              console.log(row);
              return 2222;
            },
            fcatoryNameHtml: row => {
              console.log(row);
              return 6565654;
            }
          },
          { prop: "teacherName", label: "来源" },
          { prop: "start", label: "查看厂商" },
          { prop: "end", label: "查看货号" },
          { prop: "commitTimes", label: "查看时间" }
        ]
      },
      sampleTableData: {
        data: [],
        selection: false,
        showLoading: false,
        height: "390",
        columns: [
          { prop: "name", label: "产品信息" },

          { prop: "teacherName", label: "出厂货号" },
          { prop: "start", label: "公司" },
          { prop: "end", label: "时间" }
        ]
      },
      rankingTableData: {
        data: [],
        selection: false,
        showLoading: false,
        height: "390",
        columns: [
          { prop: "name", label: "展厅" },
          { prop: "teacherName", label: "公司" },
          { prop: "start", label: "出厂货号" },
          { prop: "end", label: "择样数" }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    //跳转页面路由
    handleGoToUrl(title) {
      this.$common.goToUrl(title);
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.baVendorHome {
  // 共同的title
  .myProduct,
  .visiting,
  .sample,
  .ranking,
  .myWorkbench {
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
    .totalBox {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80px;
      span {
        color: #999999;
      }
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
          margin: 0 20px;
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
  .myWorkbench {
    flex: 1;
    min-height: 130px;
    margin-bottom: 20px;
    .content {
      box-sizing: border-box;
      padding: 0 60px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .item {
        width: 150px;
        height: 60px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        cursor: pointer;
        @{deep} .homeBadge {
          .el-badge__content {
            right: 6px;
          }
        }
        .text {
          margin-left: 20px;
        }
        .el-image {
          transition: all 1s;
        }
        &:hover {
          .el-image {
            -webkit-transform: scale(1.2);
            -moz-transform: scale(1.2);
            -ms-transform: scale(1.2);
            transform: scale(1.2);
          }
        }
      }
      .block {
        width: 150px;
      }
    }
  }
  .centerBox {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .myProduct {
      flex: 1;
      min-height: 152px;
      margin-right: 20px;
      .labels {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .item {
          flex: 1;
          height: 102px;
          background-color: #fff;
          width: 15.7%;
          // min-width: 261px;
          border-radius: 4px;
          padding: 0 15px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          cursor: pointer;
          .conText {
            padding-left: 20px;
            flex: 1;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
            .titleName {
              font-size: 20px;
              font-weight: 700;
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
            }
            .text {
              font-size: 14px;
              font-weight: 400;
              color: #999999;
              line-height: 34px;
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
            }
          }
          .imgBox {
            width: 54px;
            height: 54px;
            overflow: hidden;
            border-radius: 50%;
            .el-image {
              transition: all 1s;
            }
          }
          &:hover {
            .imgBox {
              .el-image {
                -webkit-transform: scale(1.2);
                -moz-transform: scale(1.2);
                -ms-transform: scale(1.2);
                transform: scale(1.2);
              }
            }
          }
        }
        .block {
          width: 261px;
        }
      }
    }
    .banner {
      width: 438px;
      height: 152px;
      border-radius: 4px;
      background: url("~@/assets/images/advertisingIcon.png") no-repeat center;
      background-size: contain;
    }
  }
  .statisticalBox {
    display: flex;
    // justify-content: space-around;
    .visiting {
      width: 540px;
      height: 520px;
    }
    .sample {
      width: 640px;
      margin: 0 20px;
      height: 520px;
    }
    .ranking {
      width: 440px;
      height: 520px;
    }
  }
}
</style>
