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
              style="width: 30px; height: 32px;"
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
          <div class="item" v-for="item in 4" :key="item">
            <p class="total">敬请期待</p>
            <p :class="{ today: true, active: item > 2 }">今日:敬请期待</p>
            <p class="text">敬请期待</p>
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
            style="width: 54px; height: 54px;"
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
                style="width: 302px; height: 133px;"
                :src="item.bgImg || item.img"
                fit="contain"
              >
              </el-image>
            </div>
            <div class="name">{{ item.companyName || item.adTitle }}</div>
          </div>
        </div>
        <div class="minHall">
          <div class="item" v-for="(item, i) in minHalls" :key="i">
            <div class="imgBox">
              <el-image
                style="width: 222px; height: 108px;"
                :src="item.bgImg || item.img"
                fit="contain"
              >
              </el-image>
            </div>
            <div class="name">{{ item.companyName || item.adTitle }}</div>
          </div>
        </div>
      </div>
      <div class="right">
        <!-- <div class="titleBox">
          <div class="hotBox">
            <el-radio-group v-model="hotValue">
              <el-radio-button
                v-for="(item, i) in hotList"
                :key="i"
                :label="item.value"
              ></el-radio-button>
            </el-radio-group>
          </div>
          <div class="dayBox">
            <el-radio-group v-model="dayValue" size="mini">
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
            style="width: 100%"
            height="375"
            :header-row-style="{ height: '40px', padding: '0' }"
            :header-cell-style="{ backgroundColor: '#f9fafc', padding: '0' }"
          >
            <el-table-column prop="date" label="" width="50">
              <template slot-scope="scope">
                <div class="tableIndex">
                  <i class="oneIcon" v-if="scope.row.id == 1"></i>
                  <i class="twoIcon" v-else-if="scope.row.id == 2"></i>
                  <i class="threeIcon" v-else-if="scope.row.id == 3"></i>
                  <span v-else>{{ scope.row.id }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="商品信息" width="350">
              <template slot-scope="scope">
                <div class="productInfo">
                  <el-image
                    style="width: 70px; height: 54px;"
                    :src="scope.row.img"
                    fit="contain"
                  >
                  </el-image>
                  <div class="infoBox">
                    <div class="name">{{ scope.row.name }}</div>
                    <div class="price">
                      <span>{{ scope.row.pr_no }}</span>
                      <span>{{ scope.row.price }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="cate"
              label="玩具分类"
              width="110"
              align="center"
            >
              <template slot-scope="scope">
                <span style="font-size: 13px;">
                  {{ scope.row.cate }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="number"
              label="择样次数"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <span style="font-sizr: 12px;">
                  {{ scope.row.number }} 次
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "bsHome",
  data() {
    return {
      tableData: [
        {
          id: 1,
          img: require("@/assets/images/imgError.png"),
          name: "99式坦克军事系列积木套装99式坦克军事系列积木套装",
          price: "2932.00",
          pr_no: "￥",
          cate: "电玩玩具/坦克",
          number: "588454"
        },
        {
          id: 2,
          img: require("@/assets/images/imgError.png"),
          name: "99式坦克军事系列积木套装99式坦克军事系列积木套装",
          price: "2932.00",
          pr_no: "￥",
          cate: "电玩玩具/坦克",
          number: "588454"
        },
        {
          id: 3,
          img: require("@/assets/images/imgError.png"),
          name: "99式坦克军事系列积木套装99式坦克军事系列积木套装",
          price: "2932.00",
          pr_no: "￥",
          cate: "电玩玩具/坦克",
          number: "588454"
        },
        {
          id: 4,
          img: require("@/assets/images/imgError.png"),
          name: "99式坦克军事系列积木套装99式坦克军事系列积木套装",
          price: "2932.00",
          pr_no: "￥",
          cate: "电玩玩具/坦克",
          number: "588454"
        }
      ],
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
          fd = {
            name: "/bsIndex/bsBrowsingHistory",
            linkUrl: "/bsIndex/bsBrowsingHistory",
            component: "bsBrowsingHistory",
            refresh: true,
            label: "浏览记录"
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
    // 获取大小展厅
    async getOrgCompany() {
      const res = await this.$http.post("/api/GetExhibitionList", {
        companyType: "Exhibition"
      });
      if (res.data.result.code === 200) {
        this.bigHalls = res.data.result.item.bigHallList.splice(0, 3);
        this.minHalls = res.data.result.item.smallHallList.splice(0, 4);
      }
    }
  },
  created() {},
  mounted() {
    this.getOrgCompany();
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
    .dataInfo,
    .myWorkbench {
      width: 821px;
      height: 190px;
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
        .item {
          width: 185px;
          text-align: center;
          cursor: pointer;
          p {
            line-height: 34px;
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
      width: 261px;
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
        }
        .text {
          font-size: 14px;
          font-weight: 400;
          color: #999999;
          line-height: 34px;
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
    flex-wrap: wrap;
    justify-content: space-between;
    .left {
      width: 987px;
      height: 440px;
      background-color: #fff;
      border-radius: 4px;
      box-sizing: border-box;
      padding: 0 20px;
      margin-bottom: 20px;
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
      .minHall {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        .item {
          width: 222px;
          .imgBox {
            width: 222px;
            height: 108px;
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
    }
    .right {
      width: 652px;
      height: 440px;
      background-color: #fff;
      border-radius: 4px;
      padding: 0 20px;
      box-sizing: border-box;
      margin-bottom: 20px;
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
        .productInfo {
          display: flex;
          .infoBox {
            height: 54px;
            width: 193px;
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
