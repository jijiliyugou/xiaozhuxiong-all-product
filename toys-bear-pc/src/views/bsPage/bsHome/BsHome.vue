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
          <div
            class="item"
            v-for="(item, i) in bigHalls"
            :key="i"
            @mouseenter.stop="getHallTotalCount(item)"
            @click.stop="topHallHome(item)"
          >
            <div class="imgBox">
              <el-image
                style="width: 302px; height: 133px"
                :src="item.img || item.bgImg"
                fit="contain"
              >
              </el-image>
              <div class="hoverBox">
                <div class="box">
                  <div class="boxLeft">
                    <p class="changshang changshangCount">
                      {{ factoryCount }}
                    </p>
                    <p class="changshang">
                      <i class="changshangIcon"></i> 厂商数
                    </p>
                  </div>
                  <div class="boxRight">
                    <p class="changshang changshangCount">
                      {{ productCount }}
                    </p>
                    <p class="changshang"><i class="chanpinIcon"></i> 产品数</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="name">{{ item.companyName || item.adTitle }}</div>
          </div>
        </div>
        <div class="minHall">
          <el-carousel
            indicator-position="outside"
            arrow="never"
            :interval="4000"
            direction="horizontal"
          >
            <el-carousel-item v-for="(children, i) in minHalls" :key="i">
              <div class="minHall">
                <div
                  class="minHallItem"
                  @click="topHallHome(item)"
                  @mouseenter.stop="getHallTotalCount(item)"
                  v-for="item in children"
                  :key="item.id"
                >
                  <div class="imgBox">
                    <el-image
                      style="width: 221px; height: 108px"
                      :src="item.img || item.bgImg"
                      fit="contain"
                    >
                    </el-image>
                    <div class="hoverBox">
                      <div class="box">
                        <div class="boxLeft">
                          <p class="changshang changshangCount">
                            {{ factoryCount }}
                          </p>
                          <p class="changshang">
                            <i class="changshangIcon"></i> 厂商数
                          </p>
                        </div>
                        <div class="boxRight">
                          <p class="changshang changshangCount">
                            {{ productCount }}
                          </p>
                          <p class="changshang">
                            <i class="chanpinIcon"></i> 产品数
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="name">
                    {{ item.companyName || item.adTitle }}
                  </div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
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
            height="365"
            style="width:100%;"
            @row-click="toProductDetails"
            :row-style="rowStyle"
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
            <el-table-column prop="name" label="产品信息" width="280">
              <template slot-scope="scope">
                <div class="productInfo">
                  <el-image
                    style="width: 70px; height: 54px; min-width: 70px;"
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
            style="width: 100%;"
            height="365"
            @row-click="rowClick"
            :row-style="rowStyle"
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
            <el-table-column prop="keyWord" label="关键词" width="350">
              <template slot-scope="scope">
                <span style="font-size: 13px;">
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

export default {
  name: "bsHome",
  data() {
    return {
      factoryCount: 0,
      productCount: 0,
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
      hotValue: "热门择样",
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
      ]
    };
  },
  methods: {
    // 获取产品数和厂商数
    async getHallTotalCount(item) {
      const key = item.companyNumber || item.content;
      if (!key) {
        return false;
      }
      let companyOptions = sessionStorage.getItem(key);
      if (companyOptions) {
        companyOptions = JSON.parse(companyOptions);
        this.factoryCount = companyOptions.firmTotalCount;
        this.productCount = companyOptions.productTotalCount;
      } else {
        const res = await this.$http.post("/api/GetHallStatisticsCount", {
          hallNumber: item.companyNumber || item.content
        });
        if (res.data.result.code === 200) {
          this.factoryCount = res.data.result.item.firmTotalCount;
          this.productCount = res.data.result.item.productTotalCount;
          sessionStorage.setItem(key, JSON.stringify(res.data.result.item));
        }
      }
    },
    // 去展厅主页
    // topHallHome() {
    // this.$common.handlerMsgState({
    //   msg: "敬请期待",
    //   type: "warning"
    // });
    // return false;
    topHallHome(item) {
      if (!item.companyNumber && !item.content) {
        this.$common.handlerMsgState({
          msg: "展厅信息有误,请联系管理员",
          type: "warning"
        });
        return false;
      }
      const fd = {
        name: item.companyNumber || item.content,
        linkUrl: "/bsIndex/bsHome",
        component: "bsExhibitionHallHome",
        refresh: true,
        label: item.companyName || item.adTitle,
        value: item
      };
      this.$store.commit("myAddTab", fd);
    },
    // 去产品详情
    toProductDetails(row) {
      const fd = {
        name: row.productNumber,
        linkUrl: "/bsIndex/bsProductSearchIndex",
        component: "bsProductDetails",
        refresh: true,
        label: row.fa_no || "产品详情",
        value: row
      };
      this.$store.commit("myAddTab", fd);
    },
    // 点击了行
    rowClick(row) {
      const fd = {
        name: "/bsIndex/bsProductSearchIndex",
        linkUrl: "/bsIndex/bsProductSearchIndex",
        component: "bsProductSearchIndex",
        refresh: true,
        label: "产品查询"
      };
      this.$store.commit("myAddTab", fd);
      this.$router.push(fd.linkUrl);
      this.$store.commit("handlerSearchTxt", row.keyWord);
    },
    // 行样式
    rowStyle() {
      return {
        cursor: "pointer"
      };
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
            linkUrl: "/bsIndex/bsProductSearchIndex",
            component: "bsProductSearchIndex",
            refresh: true,
            label: "产品查询"
          };
          this.$store.commit("handlerHallSearchCate", null);
          this.$store.commit("handlerimgSearch", true);
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
          // this.$common.handlerMsgState({
          //   msg: "敬请期待",
          //   type: "warning"
          // });
          // return false;
          fd = {
            name: "/bsIndex/bsBrowsingFootprints",
            linkUrl: "/bsIndex/bsBrowsingFootprints",
            component: "bsBrowsingFootprints",
            refresh: true,
            label: title
          };
          break;
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
    group(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)));
      }
      return newArray;
    },
    // 获取大小展厅
    async getOrgCompany() {
      const res = await this.$http.post("/api/GetExhibitionList", {
        companyType: "Exhibition"
      });
      if (res.data.result.code === 200) {
        this.bigHalls = res.data.result.item.bigHallList.splice(0, 3);
        const list = res.data.result.item.smallHallList;
        this.minHalls = this.group(list, 4);
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
        this.HotTableData = res.data.result.item;
      }
    },
    // 热门择样排行
    async getGetSalesHotSample() {
      const res = await this.$http.post(
        "/api/GetSalesHotSample",
        this.timeData
      );
      if (res.data.result.code === 200) {
        this.tableData = res.data.result.item;
      }
    },
    // 天数请求
    changeTime(value) {
      this.timeData = Object.assign(calculateDate(value));
      if (this.hotValue === "热门择样") {
        this.getGetSalesHotSample();
      } else {
        this.getGetSalesHotSearch();
      }
    },
    // 热门泽洋和热门搜索切换
    changeHot(value) {
      console.log(value);
      if (value === "热门择样") {
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
    this.getGetSalesHotSample();
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    }
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
    box-sizing: border-box;
    .left {
      width: 980px;
      min-width: 980px;
      height: 430px;
      background-color: #fff;
      border-radius: 4px;
      box-sizing: border-box;
      padding: 0 20px;
      box-sizing: border-box;
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
          cursor: pointer;
          .imgBox {
            width: 302px;
            height: 133px;
            overflow: hidden;
            position: relative;
            .el-image {
              transition: all 1s;
            }
            .hoverBox {
              color: #fff;
              opacity: 0;
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              transition: all 1s;
              .box {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-evenly;
                .boxLeft,
                .boxRight {
                  // width: 50%;
                  .changshangIcon {
                    display: block;
                    width: 14px;
                    height: 14px;
                    margin-right: 10px;
                    background: url("~@/assets/images/changshangIcon.png")
                      no-repeat center;
                    background-size: contain;
                  }
                  .chanpinIcon {
                    display: block;
                    width: 14px;
                    height: 14px;
                    margin-right: 10px;
                    background: url("~@/assets/images/chanpinIcon.png")
                      no-repeat center;
                    background-size: contain;
                  }
                  .changshang {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    margin-top: 10px;
                    &.changshangCount {
                      margin-top: 40px;
                    }
                  }
                }
              }
            }
            &:hover .hoverBox {
              opacity: 1;
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
        height: 198px;
        display: flex;
        .el-carousel {
          height: 198px;
          width: 100%;
          box-sizing: border-box;
          .el-carousel__container {
            height: 198px;
          }
          .el-carousel__indicators {
            position: absolute;
            left: 50%;
            bottom: 10px;
            margin-left: -18px;
            .el-carousel__indicator {
              .el-carousel__button {
                width: 10px !important;
                height: 10px !important;
                border-radius: 50%;
              }
            }
          }
        }
        .minHallItem {
          width: 221px;
          height: 158px;
          cursor: pointer;
          margin-right: 20px;
          .imgBox {
            width: 221px;
            height: 108px;
            overflow: hidden;
            .el-image {
              width: 221px;
              height: 108px;
              transition: all 1s;
            }
            position: relative;
            .hoverBox {
              color: #fff;
              opacity: 0;
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              transition: all 1s;
              .box {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: space-evenly;
                .boxLeft,
                .boxRight {
                  // width: 50%;
                  .changshangIcon {
                    display: block;
                    width: 14px;
                    height: 14px;
                    margin-right: 10px;
                    background: url("~@/assets/images/changshangIcon.png")
                      no-repeat center;
                    background-size: contain;
                  }
                  .chanpinIcon {
                    display: block;
                    width: 14px;
                    height: 14px;
                    margin-right: 10px;
                    background: url("~@/assets/images/chanpinIcon.png")
                      no-repeat center;
                    background-size: contain;
                  }
                  .changshang {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    margin-top: 10px;
                    &.changshangCount {
                      margin-top: 30px;
                    }
                  }
                }
              }
            }
            &:hover .hoverBox {
              opacity: 1;
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
      height: 430px;
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
        height: 365px;
        background-color: #ccc;
        box-sizing: border-box;
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
          .el-image {
            width: 70px;
            height: 54px;
            min-width: 70px;
          }
        }
      }
    }
  }
}
</style>
