<template>
  <div class="bsHome">
    <div class="myWorkbenchBox">
      <div class="myWorkbench">
        <div class="title">
          <i class="icon workbenchIcon"></i>
          <span>我的工作台</span>
        </div>
        <div class="content">
          <li
            class="item"
            @click="openMyGongzuo(item.title)"
            v-for="(item, i) in gongzuoList"
            :key="i"
          >
            <el-image
              style="width: 30px; height: 32px"
              :src="item.icon"
              fit="contain"
            >
            </el-image>
            <span class="text">{{ item.title }}</span>
          </li>
          <li class="block"></li>
          <li class="block"></li>
          <li class="block"></li>
        </div>
      </div>
      <div class="dataInfo">
        <div class="title">
          <i class="icon dataInfoIcon"></i>
          <span>数据统计</span>
        </div>
        <div class="content">
          <!-- <div class="item" v-for="item in 4" :key="item">
            <p class="total">敬请期待</p>
            <p :class="{ today: true, active: item > 2 }">今日:敬请期待</p>
            <p class="text">敬请期待</p>
          </div> -->

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
              今日:{{ statisticsData.hallOrderTotalToday }}
            </p>
            <p class="text">展厅业务总数</p>
          </div>
          <div class="item">
            <p class="total">{{ statisticsData.sampleOfferTotal }}</p>
            <p
              :class="{
                today: true,
                active: statisticsData.sampleOfferTotalToday > 0
              }"
            >
              <img
                :src="statisticsData.sampleOfferTotalToday > 0 ? up_t : up_f"
                alt=""
              />
              今日:{{ statisticsData.sampleOfferTotalToday }}
            </p>
            <p class="text">找样报价总数</p>
          </div>
          <div class="item">
            <p class="total">{{ statisticsData.purchaseTotal }}</p>
            <p
              :class="{
                today: true,
                active: statisticsData.purchaseTotalToday > 0
              }"
            >
              <img
                :src="statisticsData.purchaseTotalToday > 0 ? up_t : up_f"
                alt=""
              />
              今日:{{ statisticsData.purchaseTotalToday }}
            </p>
            <p class="text">采购订单总数</p>
          </div>
          <div class="item">
            <p class="total">{{ statisticsData.shareTotal }}</p>
            <p
              :class="{
                today: true,
                active: statisticsData.shareTotalToday > 0
              }"
            >
              <img
                :src="statisticsData.shareTotalToday > 0 ? up_t : up_f"
                alt=""
              />
              今日:{{ statisticsData.shareTotalToday }}
            </p>
            <p class="text">客户订单总数</p>
          </div>
        </div>
      </div>
    </div>
    <div class="labels">
      <div
        class="item"
        @click="openLabel(item.title)"
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
          <div class="title">{{ item.title }}</div>
          <div class="text">{{ item.content }}</div>
        </div>
      </div>
      <div class="block"></div>
      <div class="block"></div>
      <div class="block"></div>
      <div class="block"></div>
    </div>
    <div class="brandBox">
      <div class="left">
        <div class="title">
          <i class="brandIcon"></i>
          <span>品牌展厅</span>
        </div>
        <div class="bigHall">
          <div class="item" v-for="(item, i) in bigHalls" :key="i">
            <div class="imgBox">
              <el-image
                style="width: 302px; height: 133px"
                :src="item.bgImg || item.img"
                fit="contain"
              >
              </el-image>
            </div>
            <div class="name">{{ item.companyName || item.adTitle }}</div>
          </div>
        </div>
        <div class="minHall">
          <slider :options="sliderinit" @slide="slide">
            <slideritem v-for="(item, i) in minHalls" :key="i">
              <div class="minHallItem">
                <div class="imgBox">
                  <el-image
                    style="width: 221px; height: 108px"
                    :src="item.bgImg || item.img"
                    fit="contain"
                  >
                  </el-image>
                </div>
                <div class="name">
                  {{ item.companyName || item.adTitle || 123456 }}
                </div>
              </div>
            </slideritem>
          </slider>
        </div>
      </div>
      <div class="right">
        <div class="titleBox">
          <div class="hotBox">
            <el-radio-group v-model="hotValue" @change="changeHot">
              <el-radio-button
                v-for="(item, i) in hotList"
                :key="i"
                :label="item.value"
              ></el-radio-button>
            </el-radio-group>
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
        <div class="contentBox">
          <el-table
            v-show="hotValue === '热门择样'"
            :data="tableData"
            height="375"
            :header-row-style="{ height: '40px', padding: '0' }"
            :header-cell-style="{ backgroundColor: '#f9fafc', padding: '0' }"
          >
            <el-table-column prop="date" label="" width="50">
              <template slot-scope="scope">
                <div class="tableIndex">
                  <i class="oneIcon" v-if="scope.$index == 0"></i>
                  <i class="twoIcon" v-else-if="scope.$index == 1"></i>
                  <i class="threeIcon" v-else-if="scope.$index == 2"></i>
                  <span v-else>{{ scope.$index + 1 }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品信息" width="350">
              <template slot-scope="scope">
                <div class="productInfo">
                  <el-image
                    style="width: 70px; height: 54px"
                    :src="scope.row.imgUrl"
                    fit="contain"
                  >
                    <div slot="placeholder" class="image-slot">
                      <img
                        style="width: 70px; height: 54px"
                        :src="require('@/assets/images/imgError.png')"
                      />
                    </div>
                    <div slot="error" class="image-slot">
                      <img
                        style="width: 70px; height: 54px"
                        :src="require('@/assets/images/imgError.png')"
                      />
                    </div>
                  </el-image>
                  <div class="infoBox">
                    <div class="name">{{ scope.row.name }}</div>
                    <div class="price">
                      <span>￥{{ scope.row.price }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="categoryName"
              label="玩具分类"
              width="110"
              align="center"
            >
              <template slot-scope="scope">
                <span style="font-size: 13px">
                  {{ scope.row.categoryName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="count"
              label="择样次数"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <span style="font-sizr: 12px"> {{ scope.row.count }} 次 </span>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-if="hotValue === '热门搜索'"
            :data="HotTableData"
            style="width: 100%"
            height="375"
            :header-row-style="{ height: '40px', padding: '0' }"
            :header-cell-style="{ backgroundColor: '#f9fafc', padding: '0' }"
          >
            <el-table-column label="排名" width="70">
              <template slot-scope="scope">
                <div class="pnIndex">
                  <p :class="{ pnIndexRed: scope.$index < 3 }">
                    {{ scope.$index + 1 }}
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="keyWord" label="关键词" width="420">
              <template slot-scope="scope">
                <span style="font-size: 13px">
                  {{ scope.row.keyWord }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="count"
              label="搜索次数"
              width="110"
              align="center"
            >
              <template slot-scope="scope">
                <span style="font-sizr: 12px"> {{ scope.row.count }} 次 </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { calculateDate } from "@/assets/js/common/common.js";
import { slider, slideritem } from "vue-concise-slider"; // 引入slider组件
export default {
  name: "bsHome",
  components: {
    slider: slider,
    slideritem: slideritem
  },
  data() {
    return {
      //滑动配置[obj]
      sliderinit: {
        currentPage: 0, //当前页码
        thresholdDistance: 500, //滑动判定距离
        thresholdTime: 100, //滑动判定时间
        autoplay: 4000, //自动滚动[ms]
        loop: false, //循环滚动
        direction: "horizontal", //方向设置，垂直滚动
        infinite: 1, //无限滚动前后遍历数
        slidesToScroll: 1, // 每次滑动项数
        pagination: 1, // 每次滑动项数
        loopedSlides: 1,
        speed: 300
      },
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
      timeData: {
        startTime: "",
        endTime: ""
      },
      HotTableData: [],
      tableData: [],
      bigHalls: [],
      minHalls: [],
      hotValue: "热门搜索",
      hotList: [
        {
          value: "热门择样"
        },
        {
          value: "热门搜索"
        }
      ],
      dayValue: "7天",
      dayList: [
        {
          value: "3天"
        },
        {
          value: "7天"
        },
        {
          value: "15天"
        },
        {
          value: "30天"
        }
      ],
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
          title: "新品区",
          content: "新意产品不错过",
          icon: require("@/assets/images/xinpinqu.png")
        },
        {
          title: "现货区",
          content: "现货在手，说有就有",
          icon: require("@/assets/images/xianhuoqu.png")
        },
        {
          title: "VIP区",
          content: "品牌厂家不容错过",
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
      ]
    };
  },
  methods: {
    slide(data) {
      console.log(data);
    },
    // 点击label
    openLabel(title) {
      let fd = {};
      switch (title) {
        case "找玩具":
          fd = {
            name: "/bsIndex/bsProductSearchIndex",
            linkUrl: "/bsIndex/bsProductSearchIndex",
            component: "bsProductSearchIndex",
            refresh: true,
            label: "产品查询"
          };
          break;
        case "按图找样":
          fd = {
            name: "/bsIndex/bsProductSearchIndex",
            linkUrl: "/bsIndex/bsProductSearchIndex?id=imgSearch",
            component: "bsProductSearchIndex",
            refresh: true,
            label: "产品查询"
          };
          break;
        case "新品区":
          fd = {
            name: "/bsIndex/bsLatestProducts",
            linkUrl: "/bsIndex/bsLatestProducts",
            component: "bsLatestProducts",
            refresh: true,
            label: "最新产品"
          };
          break;
        case "现货区":
          fd = {
            name: "/bsIndex/bsSpotProducts",
            linkUrl: "/bsIndex/bsSpotProducts",
            component: "bsSpotProducts",
            refresh: true,
            label: "现货产品"
          };
          break;
        case "VIP区":
          fd = {
            name: "/bsIndex/bsVIPProducts",
            linkUrl: "/bsIndex/bsVIPProducts",
            component: "bsVIPProducts",
            refresh: true,
            label: "VIP产品"
          };
          break;
        case "玩具圈":
          fd = {
            name: "/bsIndex/bsToyCircle",
            linkUrl: "/bsIndex/bsToyCircle",
            component: "bsToyCircle",
            refresh: true,
            label: title
          };
          break;
      }
      this.$store.commit("myAddTab", fd);
      this.$router.push(fd.linkUrl);
    },
    // 点击工作台
    openMyGongzuo(title) {
      let fd = {};
      switch (title) {
        case "展厅业务":
          fd = {
            name: "/bsIndex/bsHallBusiness",
            linkUrl: "/bsIndex/bsHallBusiness",
            component: "bsHallBusiness",
            refresh: true,
            label: title
          };
          break;
        case "找样报价":
          fd = {
            name: "/bsIndex/bsSampleQuotation",
            linkUrl: "/bsIndex/bsSampleQuotation",
            component: "bsSampleQuotation",
            refresh: true,
            label: title
          };
          break;
        case "采购订单":
          fd = {
            name: "/bsIndex/bsPurchaseOrder",
            linkUrl: "/bsIndex/bsPurchaseOrder",
            component: "bsPurchaseOrder",
            refresh: true,
            label: title
          };
          break;
        case "浏览足迹":
          this.$common.handlerMsgState({
            msg: "敬请期待",
            type: "warning"
          });
          return false;
        // fd = {
        //   name: "/bsIndex/bsBrowsingFootprints",
        //   linkUrl: "/bsIndex/bsBrowsingFootprints",
        //   component: "bsBrowsingFootprints",
        //   refresh: true,
        //   label: title
        // };
        // break;
        case "站点分享":
          fd = {
            name: "/bsIndex/bsSiteLlis",
            linkUrl: "/bsIndex/bsSiteLlis",
            component: "bsSiteLlis",
            refresh: true,
            label: "站点列表"
          };
          break;
        case "客户订单":
          fd = {
            name: "/bsIndex/bsCustomerOrder",
            linkUrl: "/bsIndex/bsCustomerOrder",
            component: "bsCustomerOrder",
            refresh: true,
            label: title
          };
          break;
        case "我的消息":
          fd = {
            name: "/bsIndex/bsNews",
            linkUrl: "/bsIndex/bsNews",
            component: "bsNews",
            refresh: true,
            label: "消息"
          };
          break;
      }
      this.$store.commit("myAddTab", fd);
      this.$router.push(fd.linkUrl);
    },
    // 获取大小展厅
    async getOrgCompany() {
      const res = await this.$http.post("/api/GetExhibitionList", {
        companyType: "Exhibition"
      });
      if (res.data.result.code === 200) {
        this.bigHalls = res.data.result.item.bigHallList.splice(0, 3);
        this.minHalls = res.data.result.item.smallHallList;
      }
    },
    // 获取统计数据
    async getGetSalesOrderDataStatistics() {
      const res = await this.$http.post("/api/GetSalesOrderDataStatistics", {});
      if (res.data.result.code === 200) {
        this.statisticsData = res.data.result.item;
      }
    },
    // 热门搜索排行
    async getGetSalesHotSearch() {
      const res = await this.$http.post(
        "/api/GetSalesHotSearch",
        this.timeData
      );
      if (res.data.result.code === 200) {
        console.log(res.data.result.item);
        this.HotTableData = res.data.result.item;
      }
    },
    // 热门择样排行
    async getGetSalesHotSample() {
      console.log(this.timeData);
      const res = await this.$http.post(
        "/api/GetSalesHotSample",
        this.timeData
      );
      if (res.data.result.code === 200) {
        console.log(res);
        this.tableData = res.data.result.item;
      }
    },
    // 天数请求
    changeTime(Value) {
      this.timeData = Object.assign(calculateDate(Value));
      if (this.hotValue === "热门择样") {
        this.getGetSalesHotSample();
      } else {
        this.getGetSalesHotSearch();
      }
    },
    // 热门泽洋和热门搜索切换
    changeHot(Value) {
      if (Value === "热门择样") {
        this.getGetSalesHotSample();
      } else {
        this.getGetSalesHotSearch();
      }
    }
  },
  created() {
    this.timeData = Object.assign(calculateDate(this.dayValue));
  },
  mounted() {
    this.getOrgCompany();
    this.getGetSalesOrderDataStatistics();
    this.getGetSalesHotSearch();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsHome {
  min-height: 100%;
  .myWorkbenchBox {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .dataInfo {
      margin-left: 10px;
    }
    .myWorkbench {
      margin-right: 10px;
    }
    .dataInfo,
    .myWorkbench {
      flex: 1;
      min-height: 190px;
      background: #ffffff;
      border-radius: 4px;
      margin-bottom: 20px;
      padding: 0 20px;
      box-sizing: border-box;
      .title {
        margin: 15px 0;
        font-size: 18px;
        font-weight: 700;
        display: flex;
        align-items: center;
        .icon {
          width: 18px;
          height: 18px;
          margin-right: 17px;
          &.workbenchIcon {
            background: url("~@/assets/images/workbenchIcon.png") no-repeat
              center;
            background-size: contain;
          }
          &.dataInfoIcon {
            background: url("~@/assets/images/dataInfoIcon.png") no-repeat
              center;
            background-size: contain;
          }
        }
      }
    }
    .myWorkbench {
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
    .dataInfo {
      .content {
        padding: 0 10px;
        padding-top: 5px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 185px;
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
  }
  .labels {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      height: 110px;
      background-color: #fff;
      width: 15.7%;
      // min-width: 261px;
      border-radius: 4px;
      margin-bottom: 20px;
      padding: 0 25px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      cursor: pointer;
      .conText {
        padding-left: 20px;
        height: 54px;
        flex: 1;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap; /*不换行*/
        text-overflow: ellipsis; /*超出部分文字以...显示*/
        .title {
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
  .brandBox {
    display: flex;
    // flex-wrap: wrap;
    justify-content: space-between;
    .left {
      width: 987px;
      height: 440px;
      background-color: #fff;
      border-radius: 4px;
      box-sizing: border-box;
      padding: 0 20px;
      .title {
        height: 50px;
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 700;
        .brandIcon {
          width: 18px;
          margin-right: 17px;
          height: 18px;
          background: url("~@/assets/images/pingpaichanting.png") no-repeat
            center;
          background-size: contain;
        }
      }
      .bigHall {
        display: flex;
        justify-content: space-between;
        .item {
          width: 302px;
          .imgBox {
            width: 302px;
            height: 133px;
            overflow: hidden;
            .el-image {
              transition: all 1s;
            }
          }
          &:hover {
            .el-image {
              -webkit-transform: scale(1.1);
              -moz-transform: scale(1.1);
              -ms-transform: scale(1.1);
              transform: scale(1.1);
            }
          }
          .name {
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
      @{deep} .minHall {
        display: flex;
        justify-content: space-between;
        height: 208px;
        .swiper-container-horizontal .slider-wrapper,
        .swiper-container-vertical .slider-wrapper {
          align-items: flex-start !important;
        }
        .slider-item {
          width: 221px;
          height: 158px;
          margin-right: 20px;
          cursor: pointer;
          &:last-of-type {
            margin-right: 0;
          }
        }
        .minHallItem {
          width: 221px;
          height: 158px;
          .imgBox {
            width: 221px;
            height: 108px;
            // overflow: hidden;
            .el-image {
              width: 221px;
              height: 108px;
              transition: all 1s;
            }
          }
          &:hover {
            .el-image {
              -webkit-transform: scale(1.1);
              -moz-transform: scale(1.1);
              -ms-transform: scale(1.1);
              transform: scale(1.1);
            }
          }
          .name {
            height: 50px;
            display: flex;
            font-size: 14px;
            color: #333;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
    .right {
      flex: 1;
      height: 440px;
      background-color: #fff;
      border-radius: 4px;
      padding: 0 20px;
      margin-left: 20px;
      box-sizing: border-box;
      .titleBox {
        height: 50px;
        display: flex;
        align-items: center;
        .hotBox,
        .dayBox {
          flex: 1;
        }
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
      .contentBox {
        margin-top: 15px;
        height: 375px;
        background-color: #ccc;
        .tableIndex {
          display: flex;
          align-items: center;
          justify-content: center;
          .oneIcon {
            width: 21px;
            height: 30px;
            background: url("~@/assets/images/hotOne.png") no-repeat center;
            background-size: contain;
          }
          .twoIcon {
            width: 21px;
            height: 30px;
            background: url("~@/assets/images/hotTwo.png") no-repeat center;
            background-size: contain;
          }
          .threeIcon {
            width: 21px;
            height: 30px;
            background: url("~@/assets/images/hotThree.png") no-repeat center;
            background-size: contain;
          }
        }
        .pnIndex {
          p {
            width: 22px;
            height: 22px;
            background: #dcdfe6;
            border-radius: 2px;
            text-align: center;
            line-height: 22px;
            color: #666666;
            &.pnIndexRed {
              color: #fff;
              background-color: #ff4848;
            }
          }
        }

        .productInfo {
          display: flex;
          .infoBox {
            height: 54px;
            // width: 193px;
            margin-left: 16px;

            div {
              line-height: 25px;
            }
            .price {
              color: #ff4848;
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
            }
            .name {
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
            }
          }
        }
      }
    }
  }
}
</style>
