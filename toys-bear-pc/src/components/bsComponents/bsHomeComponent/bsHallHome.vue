<!--  -->
<template>
  <div class="bsHallHome">
    <div class="myWorkbenchBox">
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
          <!-- <li class="block"></li>
          <li class="block"></li>
          <li class="block"></li> -->
        </div>
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
            <div class="title">{{ item.title }}</div>
            <div class="text">{{ item.content }}</div>
          </div>
        </div>
      </div>
      <div class="recentlySample">
        <div class="title">
          <i class="icon recentlySampleIcon"></i>
          <span>最新择样</span>
        </div>
        <el-table
          :data="HotTableData"
          style="width: 100%"
          height="295"
          @row-click="rowClick"
          :row-style="rowStyle"
          :header-row-style="{ height: '40px', padding: '0' }"
          :header-cell-style="{ backgroundColor: '#f9fafc', padding: '0' }"
        >
          <el-table-column label="择样单号"> </el-table-column>
          <el-table-column label="择样类型"> </el-table-column>

          <el-table-column label="本次代号"> </el-table-column>
          <el-table-column label="择样日期"> </el-table-column>
          <el-table-column label="公司名称"> </el-table-column>
          <el-table-column label="择样总款数"> </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="myFooter">
      <div class="statistics">
        <div class="title">
          <i class="icon statisticsIcon"></i>
          <span>数据统计</span>
        </div>
        <ul class="increase">
          <li>
            <h3>1268451</h3>
            <p class="text">展厅择样总数</p>
            <div class="bacg">
              <p
                :class="{
                  today: true,
                  active: statisticsData.hallOrderTotalToday > 0
                }"
              >
                今日+ <span>50</span>
              </p>
            </div>
          </li>
          <li>
            <h3>1268451</h3>
            <p class="text">入驻厂商总数</p>
            <div class="bacg">
              <p
                :class="{
                  today: true,
                  active: statisticsData.hallOrderTotalToday > 0
                }"
              >
                今日+ <span>50</span>
              </p>
            </div>
          </li>
          <li>
            <h3>1268451</h3>
            <p class="text">展厅产品总数</p>
            <div class="bacg">
              <p
                :class="{
                  today: true,
                  active: statisticsData.hallOrderTotalToday > 0
                }"
              >
                今日+ <span>50</span>
              </p>
            </div>
          </li>
          <li>
            <h3>1268451</h3>
            <p class="text">我的客户总数</p>
            <div class="bacg">
              <p
                :class="{
                  today: true,
                  active: statisticsData.shareTotalToday > 0
                }"
              >
                今日+ <span>50</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="hallHot">
        <div class="titleBox">
          <div class="hotBox">
            <div class="title">
              <i class="icon hallHotIcon"></i>
              <span>展厅热门择样</span>
            </div>
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
            :data="tableData"
            height="365"
            style="width: 100%"
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
                    style="width: 70px; height: 54px; min-width: 70px"
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
              align="center"
            >
              <template slot-scope="scope">
                <span style="font-size: 13px">
                  {{ scope.row.categoryName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="择样次数" align="center">
              <template slot-scope="scope">
                <span style="font-sizr: 12px"> {{ scope.row.count }} 次 </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="newEnter">
        <div class="title">
          <i class="icon newEnterIcon"></i>
          <span>最新入驻厂商</span>
        </div>
        <el-table
          :data="HotTableData"
          style="width: 100%"
          height="365"
          @row-click="rowClick"
          :row-style="rowStyle"
          :header-row-style="{ height: '40px', padding: '0' }"
          :header-cell-style="{ backgroundColor: '#f9fafc', padding: '0' }"
        >
          <el-table-column label="排名"> </el-table-column>
          <el-table-column label="联系人"> </el-table-column>
          <el-table-column label="手机"> </el-table-column>
          <el-table-column label="产品数量"> </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { calculateDate } from "@/assets/js/common/common.js";
export default {
  name: "bsHallHome",
  data() {
    return {
      timeData: {
        startTime: "",
        endTime: ""
      },
      HotTableData: [],
      tableData: [],
      statisticsData: {
        hallOrderTotal: "", //展厅业务
        hallOrderTotalToday: "", //展厅今日
        sampleOfferTotal: "", //找样报价
        sampleOfferTotalToday: "", //找样报价今日
        enterVendorTotal: "", //入驻厂商总数
        enterVendorTotalToday: "", //入驻厂商总数今日
        hallProductTotal: "", //展厅产品总数
        hallProductTotalToday: "", //展厅产品总数今日
        shareTotal: "", //客户订单
        shareTotalToday: "" //客户订单今日
      },
      hotValue: "热门择样",
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
      gongzuoList: [
        {
          title: "公司业务",
          icon: require("@/assets/images/gongsiyewu.png")
        },
        {
          title: "厂商业务",
          icon: require("@/assets/images/caigoudingdan.png")
        },
        {
          title: "购物车",
          icon: require("@/assets/images/gouwuche.png")
        },
        {
          title: "找样报价",
          icon: require("@/assets/images/zhaoyangbaojia.png")
        },
        {
          title: "我的客户",
          icon: require("@/assets/images/kehudingdan.png")
        },
        {
          title: "择样明细",
          icon: require("@/assets/images/zeyang.png")
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
          title: "玩具圈",
          content: "查看发布玩具信息",
          icon: require("@/assets/images/wanjuquan.png")
        }
      ]
    };
  },
  created() {
    this.timeData = Object.assign(calculateDate(this.dayValue));
  },
  mounted() {
    this.getGetSalesHotSample();
  },
  methods: {
    // 行样式
    rowStyle() {
      return {
        cursor: "pointer"
      };
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
    //跳转页面路由
    handleGoToUrl(title) {
      this.$common.goToUrl(title);
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsHallHome {
  min-height: 100%;
  .myWorkbenchBox {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 20px;
    height: 345px;
    box-sizing: border-box;
    .myWorkbench {
      flex: 1;
      min-height: 345px;
      background: #ffffff;
      border-radius: 4px;
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

      .content {
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .item {
          margin: 15px 0;
          width: 40%;
          //   width: 150px;
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
    .labels {
      flex: 1;
      margin: 0 20px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .item {
        height: 100px;
        width: 100%;
        background-color: #fff;
        border-radius: 4px;
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
    }
    .recentlySample {
      width: 872px;
      background-color: #fff;
      border-radius: 4px;
      padding: 0 20px;
      .title {
        height: 50px;
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 700;
        .recentlySampleIcon {
          width: 18px;
          margin-right: 17px;
          height: 18px;
          background: url("~@/assets/images/recentlySampleIcon.png") no-repeat
            center;
          background-size: contain;
        }
      }
    }
  }
  .myFooter {
    display: flex;
    height: 463px;
    justify-content: space-between;
    flex-wrap: wrap;
    box-sizing: border-box;
    .statistics {
      flex: 1;
      background-color: #fff;
      border-radius: 4px;
      padding: 0 20px;
      box-sizing: border-box;
      .title {
        height: 50px;
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 700;
        .statisticsIcon {
          width: 18px;
          margin-right: 17px;
          height: 18px;
          background: url("~@/assets/images/statisticsIcon.png") no-repeat
            center;
          background-size: contain;
        }
      }
      .increase {
        display: flex;
        flex-wrap: wrap;
        li:nth-of-type(1) {
          border-bottom: 1px solid #dcdfe6;
        }
        li:nth-of-type(2) {
          border-left: 1px solid #dcdfe6;
          border-bottom: 1px solid #dcdfe6;
        }
        li:nth-of-type(4) {
          border-left: 1px solid #dcdfe6;
        }

        li {
          height: 180px;
          padding: 25px 0 15px;
          box-sizing: border-box;
          flex: 1;
          h3 {
            font-size: 30px;
            font-weight: 700;
            text-align: center;
            color: #333333;
            line-height: 34px;
          }
          .text {
            text-align: center;
            color: #999999;
            line-height: 34px;
            margin-top: 8px;
          }
          .bacg {
            margin: 0 auto;
            position: relative;
            width: 94px;
            height: 56px;
            background: url("~@/assets/images/tongji.png") no-repeat center;
            p {
              width: 100%;
              text-align: center;
              position: absolute;
              bottom: -14px;
              &.today {
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
    .hallHot {
      width: 660px;
      //   height: 430px;
      background-color: #fff;
      border-radius: 4px;
      padding: 0 20px;
      margin: 0 20px;
      box-sizing: border-box;
      .titleBox {
        height: 50px;
        display: flex;
        align-items: center;

        .hotBox,
        .dayBox {
          flex: 1;
          .title {
            height: 50px;
            display: flex;
            align-items: center;
            font-size: 18px;
            font-weight: 700;
            .hallHotIcon {
              width: 18px;
              margin-right: 17px;
              height: 18px;
              background: url("~@/assets/images/hallHotIcon.png") no-repeat
                center;
              background-size: contain;
            }
          }
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
    .newEnter {
      width: 539px;
      background-color: #fff;
      border-radius: 4px;
      padding: 0 20px;
      .title {
        height: 50px;
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 700;
        .newEnterIcon {
          width: 18px;
          margin-right: 17px;
          height: 18px;
          background: url("~@/assets/images/newEnterIcon.png") no-repeat center;
          background-size: contain;
        }
      }
    }
  }
}
</style>
