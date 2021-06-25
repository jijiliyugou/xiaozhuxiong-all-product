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
              <div class="text">
                {{ item.content }}<span>{{ item.count }}</span>
              </div>
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
          <span>来访公司总数</span>
          <p class="total">{{ statisticsData.visitingTotalCount }}</p>
          <p
            :class="{
              today: true,
              active: statisticsData.visitingTotalCountTotal > 0
            }"
          >
            <img
              :src="statisticsData.visitingTotalCountTotal > 0 ? up_t : up_f"
              alt=""
            />
            今日:{{ statisticsData.visitingTotalCountTotal }}
          </p>
        </div>
        <el-table
          :data="visitingTableData"
          height="390"
          style="width: 100%;font-sise: 12px"
          :header-row-style="{ height: '40px', padding: '0' }"
          :header-cell-style="{ backgroundColor: '#f9fafc', padding: '0' }"
        >
          <el-table-column prop="salseName" label="访客" width="180">
            <template slot-scope="scope">
              <div class="visitingSalse">
                <span class="salseName">{{ scope.row.salseName }}</span>
                <div class="bto">
                  <div class="left">所在展厅:</div>
                  <div class="right">{{ scope.row.hallName }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="checkType"
            label="来源"
            width="70"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="fa_no"
            label="查看货号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="createdOn" label="查看时间" align="center">
            <template slot-scope="scope">
              <span> {{ scope.row.createdOn.replace(/AM/, " ") }} </span>
            </template>
          </el-table-column>
        </el-table>
        <!-- <Table :table="visitingTableData"></Table> -->
      </div>
      <div class="sample">
        <div class="title">
          <i class="icon statisticalIcon"></i>
          <span>择样统计</span>
        </div>
        <div class="totalBox">
          <span>择样产品总数</span>
          <p class="total">{{ statisticsData.HistoryPageV2TotalCount }}</p>
          <p
            :class="{
              today: true,
              active: statisticsData.HistoryPageV2Total > 0
            }"
          >
            <img
              :src="statisticsData.HistoryPageV2Total > 0 ? up_t : up_f"
              alt=""
            />
            今日:{{ statisticsData.HistoryPageV2Total }}
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
          <span>择样总数</span>
          <p class="total">{{ statisticsData.RankingV2TotalCount }}</p>
          <p
            :class="{
              today: true,
              active: statisticsData.RankingV2Total > 0
            }"
          >
            <img
              :src="statisticsData.RankingV2Total > 0 ? up_t : up_f"
              alt=""
            />
            今日:{{ statisticsData.RankingV2Total }}
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
        visitingTotalCount: 0, //来访公司总数
        visitingTotalCountTotal: 0, //今日来访公司数量
        HistoryPageV2TotalCount: 0, //择样产品总数
        HistoryPageV2Total: 0, //今日择样产品数量
        RankingV2TotalCount: 0, //择样公司排行总数
        RankingV2Total: 0 //今日择样公司排行数
      },
      productCount: {
        videoCount: 0, //视频数
        certificateCount: 0, //证书数
        threeDCount: 0, //3D产品
        priceCount: 0 //产品价格
      },
      labelList: [
        {
          title: "产品视频",
          content: "产品视频数：",
          count: 0,
          icon: require("@/assets/images/ProductVideo.png")
        },
        {
          title: "3D产品",
          content: "3D产品数：",
          count: 0,
          icon: require("@/assets/images/xianhuoqu.png")
        },
        {
          title: "证书管理",
          content: "证书管理数：",
          count: 0,
          icon: require("@/assets/images/CertificateManage.png")
        },
        {
          title: "产品价格",
          content: "产品价格数：",
          count: 0,
          icon: require("@/assets/images/ProductPrice.png")
        }
      ],
      gongzuoList: [
        {
          title: "我的产品",
          icon: require("@/assets/images/bsMyProductIcon.png")
        },
        {
          title: "展厅业务",
          icon: require("@/assets/images/zhantingyewu.png")
        },

        {
          title: "采购订单",
          icon: require("@/assets/images/caigoudingdan.png")
        },
        {
          title: "我的店铺",
          icon: require("@/assets/images/bsMyShopIcon.png")
        },
        {
          title: "产品活动",
          icon: require("@/assets/images/bsProductActivityIcon.png")
        }
      ],
      visitingTableData: [],
      sampleTableData: {
        data: [],
        selection: false,
        showLoading: false,
        height: "390",
        columns: [
          {
            prop: "hallName",
            label: "产品信息",
            width: 230,
            color: "#3368a9",
            align: "center",
            // isHiden: true,
            infoBox: true,
            productInfo: true,
            elImage: row => {
              return row.viewImage;
            },
            nameHtml: row => {
              return row.productName;
            },
            fcatoryNameHtml: row => {
              return row.hallName;
            }
          },
          { prop: "fa_no", label: "出厂货号", width: 80 },
          { prop: "salseName", label: "公司" },
          {
            prop: "createdOn",
            label: "时间",
            render: row => {
              return row.createdOn.replace(/AM/, " ");
            }
          }
        ]
      },
      rankingTableData: {
        data: [],
        selection: false,
        showLoading: false,
        height: "390",
        columns: [
          { prop: "hallName", label: "展厅" },
          { prop: "fa_no", label: "出厂货号" },
          { prop: "sumfa_no", label: "择样数" }
        ]
      }
    };
  },
  created() {
    this.GetTodayCompanyVisitorsCount(1);
    this.GetTodayCompanyVisitorsCount(2);
    this.GetTodayCompanyVisitorsCount(3);
    this.GetMyProductCount();
    this.ProductRankingV2();
  },
  mounted() {
    this.GetCompanyPageByVisitorsAll(6);
    this.GetCompanyPageByVisitorsAll(-1);
  },
  methods: {
    //跳转页面路由
    handleGoToUrl(title) {
      this.$common.goToUrl(title);
    },
    // 厂商首页-我的产品count值
    async GetMyProductCount() {
      const res = await this.$http.post("/api/GetMyProductCount");
      if (res.data.result.code === 200) {
        // this.productCount = res.data.result.item;
        for (let i = 0; i < this.labelList.length; i++) {
          switch (this.labelList[i].title) {
            case "产品视频":
              this.labelList[i].count = res.data.result.item.videoCount;
              break;
            case "3D产品":
              this.labelList[i].count = res.data.result.item.threeDCount;
              break;
            case "证书管理":
              this.labelList[i].count = res.data.result.item.certificateCount;
              break;
            case "产品价格":
              this.labelList[i].count = res.data.result.item.priceCount;
              break;
          }
        }
      }
    },
    // 来访统计-2，择样统计type=6
    async GetCompanyPageByVisitorsAll(type) {
      const fd = {
        skipCount: 1,
        maxResultCount: 10,
        visitorsType: type
      };
      const res = await this.$http.post("/api/GetCompanyPageByVisitorsAll", fd);
      if (res.data.result.code === 200) {
        switch (type) {
          case -1:
            this.visitingTableData = res.data.result.item.items;
            this.statisticsData.visitingTotalCount =
              res.data.result.item.totalCount;
            break;
          case 6:
            this.sampleTableData.data = res.data.result.item.items;
            this.statisticsData.HistoryPageV2TotalCount =
              res.data.result.item.totalCount;
            break;
        }
      }
    },
    //择样排行
    async ProductRankingV2() {
      const fd = {
        skipCount: 1,
        maxResultCount: 10
      };
      const res = await this.$http.post("/api/ProductRankingV2", fd);
      if (res.data.result.code === 200) {
        this.rankingTableData.data = res.data.result.item.items;
        this.statisticsData.RankingV2TotalCount =
          res.data.result.item.totalCount;
      }
    },
    // 厂商角色-今日(来访公司,择样产品,公司排行)数量
    // 1-今日来访公司数量；2-今日择样产品数量 ；3-今日择样公司排行数
    async GetTodayCompanyVisitorsCount(type) {
      const res = await this.$http.post("/api/GetTodayCompanyVisitorsCount", {
        sumType: type
      });
      if (res.data.result.code === 200) {
        switch (type) {
          case 1:
            this.statisticsData.visitingTotalCountTotal = res.data.result.item;
            break;
          case 2:
            this.statisticsData.HistoryPageV2Total = res.data.result.item;
            break;
          case 3:
            this.statisticsData.RankingV2Total = res.data.result.item;
            break;
        }
      }
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
          width: 20%;
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
              span {
                color: #333333;
              }
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
    .visitingSalse {
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
      .salseName {
        color: #3368a9;
      }
      .bto {
        display: flex;
        color: #ccc;
      }
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
