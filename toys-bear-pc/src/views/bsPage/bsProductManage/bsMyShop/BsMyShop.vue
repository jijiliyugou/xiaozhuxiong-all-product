<template>
  <div class="bsMyShop">
    <div class="hander">
      <div class="left">
        <div class="clientsImg">
          <el-image
            style="width: 100px; height: 100px; border-radius: 50%"
            fit="contain"
            :src="companyInfo.companyLogo"
            lazy
          >
            <div slot="placeholder" class="image-slot">
              <img
                style="width: 100px; height: 100px;"
                :src="require('@/assets/images/imgError.png')"
              />
            </div>
            <div slot="error" class="image-slot">
              <img
                style="width: 100px; height: 100px; "
                :src="require('@/assets/images/imgError.png')"
              />
            </div>
          </el-image>
        </div>
        <div class="handerTitle">
          <div class="name">
            {{ companyInfo.companyName }}
          </div>
          <div class="clientsData">
            <div class="tel">
              <p v-if="companyInfo.contactsMan">
                联系人：{{ companyInfo.contactsMan }}
              </p>
              <p v-if="companyInfo.telephoneNumber">
                <i class="phoneIcon"></i> 电话：{{
                  companyInfo.telephoneNumber
                }}
              </p>
              <p v-if="companyInfo.phoneNumber">
                <i class="sjIcon"></i> 手机：{{ companyInfo.phoneNumber }}
              </p>
              <p v-if="companyInfo.qq">
                <i class="qqIcon"></i> QQ：{{ companyInfo.qq }}
              </p>
            </div>
            <p v-if="companyInfo.address" style="color: #666">
              地址：{{ companyInfo.address }}
            </p>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="setFirm" @click="openIsShieldDialog">
          设置可查看厂商
        </div>

        <el-button
          type="warning"
          @click="openShareShop"
          class="el-icon-share fenx"
        >
          分享店铺</el-button
        >
      </div>
    </div>
    <div class="tableBox">
      <div class="headTop">
        <div
          :class="{ tabs: true, active: isDiyu === 0 }"
          @click="checkTabsAll(0)"
        >
          全部
        </div>
        <!-- <div
          :class="{ tabs: true, active: isDiyu === 1 }"
          @click="checkTabsAll(1)"
        >
          3D产品
        </div> -->
        <div
          :class="{ tabs: true, active: isDiyu === 2 }"
          @click="checkTabsAll(2)"
        >
          推荐产品
        </div>
      </div>
      <div class="screenBox">
        <div class="left">
          <div class="screenItem" @click="sortTypeEvent(4)">
            <span :class="{ screenLabel: true, active: sortOrder === 4 }">
              货号
            </span>
            <i v-show="isFa_no === null" class="jiantou xiajiantouIcon"></i>
            <i v-show="isFa_no === 1" class="jiantou xiaActiveIcon"></i>
            <i v-show="isFa_no === 2" class="jiantou shangActiveIcon"></i>
          </div>
          <div class="screenItem" @click="sortTypeEvent(1)">
            <span :class="{ screenLabel: true, active: sortOrder === 1 }"
              >单价</span
            >
            <i v-show="isPrice === null" class="jiantou xiajiantouIcon"></i>
            <i v-show="isPrice === 1" class="jiantou xiaActiveIcon"></i>
            <i v-show="isPrice === 2" class="jiantou shangActiveIcon"></i>
          </div>
          <div class="screenItem" @click="sortTypeEvent(2)">
            <span :class="{ screenLabel: true, active: sortOrder === 2 }">
              时间
            </span>
            <i v-show="isTime === null" class="jiantou xiajiantouIcon"></i>
            <i v-show="isTime === 1" class="jiantou xiaActiveIcon"></i>
            <i v-show="isTime === 2" class="jiantou shangActiveIcon"></i>
          </div>
          <div class="item" style="margin-left:20px">
            <span class="label">选择展厅:</span>
            <el-select
              v-model="searchForm.hall"
              size="medium"
              style="width:200px"
              clearable
              placeholder="请选择"
              @change="handleHall"
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
            <span class="label">选择厂商:</span>
            <el-select
              v-model="searchForm.supplier"
              size="medium"
              style="width:200px"
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
            <span class="label">关键词:</span>
            <el-input
              type="text"
              style="width:200px"
              size="medium"
              v-model="searchForm.keyword"
              placeholder="请输入关键词"
              clearable
              @keyup.native.enter="search"
            ></el-input>
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
        <!-- <div class="right">
          <div
            :class="{ grid: true, active: isGrid === 'bsGridComponent' }"
            @click="handerIsGrid('bsGridComponent')"
          ></div>
          <div
            :class="{
              column: true,
              active: isGrid === 'bsColumnComponent'
            }"
            @click="handerIsGrid('bsColumnComponent')"
          ></div>
          <div class="line"></div>
          <div class="totalCount">
            <span class="totalCountText">{{ totalCount }}</span>
            <span>条数据</span>
          </div>
          <div class="myMinPagination">
            <div @click="firstEvent" class="first el-icon-arrow-left"></div>
            <div class="count">
              <span class="pageIndex">{{ currentPage }}</span>
              <span>/</span>
              <span>{{ Math.ceil(totalCount / pageSize) }}</span>
            </div>
            <div @click="nextEvent" class="next el-icon-arrow-right"></div>
          </div>
        </div> -->
      </div>
      <div class="productListBox">
        <!-- 产品列表 -->
        <component
          ref="componentRef"
          :is="isGrid"
          :productList="productList"
        ></component>
        <!-- 分页 -->
        <center style="padding: 20px 0px;">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[12, 24, 36, 48]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
          >
          </el-pagination>
        </center>
      </div>
    </div>
    <el-dialog
      v-if="IsShareShopDialog"
      title="分享店铺"
      :visible.sync="IsShareShopDialog"
      width="560px"
    >
      <ShareShop @closeShareShop="closeShareShop"></ShareShop>
    </el-dialog>
    <el-dialog
      title="屏蔽公司/厂商"
      :visible.sync="IsShieldDialog"
      width="560px"
    >
      <ShieldDialog @closeShieldDialog="closeShieldDialog"></ShieldDialog>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ShareShop from "./components/shareShop.vue";
import ShieldDialog from "./components/shieldDialog.vue";
import bsColumnComponent from "@/components/bsComponents/bsProductSearchComponent/bsTableItem";
import bsGridComponent from "@/components/bsComponents/bsProductSearchComponent/bsGridComponent";
export default {
  name: "bsMyShop",
  components: {
    bsGridComponent,
    bsColumnComponent,
    ShieldDialog,
    ShareShop
  },
  computed: {
    ...mapState(["userInfo"])
  },
  data() {
    return {
      IsShareShopDialog: false,
      IsShieldDialog: false,
      checkIdArr: [],
      searchForm: {
        keyword: ""
      },
      hallList: [],
      supplierList: [],
      companyInfo: {},
      isDiyu: 0,
      isFa_no: null,
      isPrice: null,
      isTime: null,
      isRedu: null,
      sortOrder: null,
      sortType: null,
      currentPage: 1,
      pageSize: 12,
      totalCount: 0,
      productList: [],
      isGrid: "bsGridComponent"
    };
  },
  created() {
    this.getCompanyByID();
    this.GetSupplierListByHall();
    this.getMyProductPage();
  },
  mounted() {},
  methods: {
    // 所有产品搜索
    search() {
      this.pageIndex = 1;
      if (this.isDiyu == 0) {
        this.getMyProductPage();
      } else if (this.isDiyu === 2) {
        this.getRecommendProductPage();
      }
    },
    //切换产品类型
    checkTabsAll(num) {
      this.isDiyu = num;
      if (this.isDiyu == 0) {
        this.getMyProductPage();
      } else if (this.isDiyu === 2) {
        this.getRecommendProductPage();
      }
    },
    // 获取店铺资料
    async getCompanyByID() {
      const res = await this.$http.post("/api/CompanyByID", {
        companyNumber: this.userInfo.commparnyList[0].companyNumber
      });
      if (res.data.result.code === 200) {
        this.companyInfo = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 产品选择展厅下厂商列表
    async GetSupplierListByHall() {
      const res = await this.$http.post("/api/GetSupplierListByHall");
      if (res.data.result.code === 200) {
        this.hallList = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 查询展厅下的厂商
    handleHall(val) {
      this.hallList.map(item => {
        if (val === item.hallNumber) {
          this.supplierList = item.supplierList;
        }
      });
    },
    // 获取我的产品
    async getMyProductPage() {
      const fd = {
        sortOrder: this.sortOrder,
        sortType: this.sortType,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.searchForm.keyword
      };
      if (this.searchForm.supplier) {
        fd.maKeyGuidList = [this.searchForm.supplier];
      }
      if (this.searchForm.hall) {
        fd.companyNumber = this.searchForm.hall;
      }

      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/MyProductPage", fd);
      if (res.data.result.code === 200) {
        this.productList = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取推荐产品
    async getRecommendProductPage() {
      const fd = {
        companyNumber: this.userInfo.commparnyList[0].companyNumber,
        sortOrder: this.sortOrder,
        sortType: this.sortType,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.searchForm.keyword
      };

      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post(
        "/api/RecommendProductByNumberPage",
        fd
      );
      if (res.data.result.code === 200) {
        this.productList = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 打开屏蔽弹框
    openIsShieldDialog() {
      this.IsShieldDialog = true;
    },
    // 关闭屏蔽弹框
    closeShieldDialog() {
      this.IsShieldDialog = false;
    },
    // 打开分享店铺弹框
    openShareShop() {
      this.IsShareShopDialog = true;
    },
    // 关闭分享店铺弹框
    closeShareShop() {
      this.IsShareShopDialog = false;
    },
    // 上一页
    firstEvent() {
      if (this.currentPage === 1) {
        this.$common.handlerMsgState({
          msg: "已经是第一页了",
          type: "danger"
        });
        return false;
      }
      this.currentPage--;
      if (this.isDiyu == 0) {
        this.getMyProductPage();
      } else if (this.isDiyu === 2) {
        this.getRecommendProductPage();
      }
    },
    // 下一页
    nextEvent() {
      const totalPage = Math.ceil(this.totalCount / this.pageSize);
      if (totalPage <= this.currentPage) {
        this.$common.handlerMsgState({
          msg: "已经是第最后一页了",
          type: "danger"
        });
        return false;
      }
      this.currentPage++;
      if (this.isDiyu == 0) {
        this.getMyProductPage();
      } else if (this.isDiyu === 2) {
        this.getRecommendProductPage();
      }
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      if (this.isDiyu == 0) {
        this.getMyProductPage();
      } else if (this.isDiyu === 2) {
        this.getRecommendProductPage();
      }
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      if (this.isDiyu == 0) {
        this.getMyProductPage();
      } else if (this.isDiyu === 2) {
        this.getRecommendProductPage();
      }
    },
    // 过滤类型
    sortTypeEvent(type) {
      this.sortOrder = type;
      switch (type) {
        case 1:
          this.sortType = this.isPrice =
            this.isPrice === null ? 1 : this.isPrice === 1 ? 2 : null;
          this.sortType = null;
          this.isFa_no = null;
          this.isTime = null;
          this.isRedu = null;
          this.sortType = this.isPrice;
          this.sortType === null && (this.sortOrder = null);
          break;
        case 2:
          this.isTime = this.isTime === null ? 1 : this.isTime === 1 ? 2 : null;
          this.sortType = null;
          this.isFa_no = null;
          this.isPrice = null;
          this.isRedu = null;
          this.sortType = this.isTime;
          this.sortType === null && (this.sortOrder = null);
          break;
        case 3:
          this.isRedu = this.isRedu === null ? 1 : this.isRedu === 1 ? 2 : null;
          this.sortType = null;
          this.isPrice = null;
          this.isFa_no = null;
          this.isTime = null;
          this.sortType = this.isRedu;
          this.sortType === null && (this.sortOrder = null);
          break;
        case 4:
          this.isFa_no =
            this.isFa_no === null ? 1 : this.isFa_no === 1 ? 2 : null;
          this.sortType = null;
          this.isPrice = null;
          this.isTime = null;
          this.sortType = this.isFa_no;
          this.sortType === null && (this.sortOrder = null);
          break;
        default:
          this.isPrice = null;
          this.isTime = null;
          this.isRedu = null;
          this.sortType = null;
          this.sortOrder = null;
          break;
      }
      if (this.isDiyu == 0) {
        this.getMyProductPage();
      } else if (this.isDiyu === 2) {
        this.getRecommendProductPage();
      }
    }
  }
};
</script>
<style scoped lang="less">
.bsMyShop {
  min-height: 100%;
  .hander {
    height: 148px;
    display: flex;
    background: #fff;
    padding: 24px 20px 24px 37px;
    box-sizing: border-box;
    .left {
      flex: 1;
      display: flex;
      align-items: center;
      .clientsImg {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        cursor: pointer;
        .el-image {
          img {
            width: 120px;
            height: 120px;
            object-fit: contain;
            image-rendering: -moz-crisp-edges;
            image-rendering: -o-crisp-edges;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            -ms-interpolation-mode: nearest-neighbor;
          }
        }
      }
      .handerTitle {
        margin-left: 35px;
        .name {
          height: 31px;
          font-size: 24px;
          font-family: Microsoft YaHei, Microsoft YaHei-Regular;
          font-weight: 400;
          text-align: left;
          color: #333333;
          line-height: 34px;
        }

        .clientsData {
          display: flex;
          padding-top: 10px;
          .tel {
            display: flex;
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #666666;
            p {
              display: flex;
              align-content: center;
              margin-right: 48px;
              img {
                margin-right: 10px;
                width: 28px;
                height: 28px;
              }
              .phoneIcon {
                min-width: 28px;
                width: 28px;
                height: 28px;
                margin-right: 15px;
                background: url("~@/assets/images/onlinePhoneIcon.png")
                  no-repeat center;
                background-size: contain;
              }
              .qqIcon {
                min-width: 28px;
                width: 28px;
                height: 28px;
                margin-right: 15px;
                background: url("~@/assets/images/QQ.png") no-repeat center;
                background-size: contain;
              }
              .sjIcon {
                min-width: 28px;
                width: 28px;
                height: 28px;
                margin-right: 15px;
                background: url("~@/assets/images/sjIcon.png") no-repeat center;
                background-size: contain;
              }
            }
          }
        }
      }
    }
    .right {
      width: 120px;
      .setFirm {
        margin-bottom: 20px;
        width: 100%;
        height: 30px;
        font-weight: 400;
        text-align: center;
        color: #3368a9;
        line-height: 30px;
        cursor: pointer;
      }
      .fenx {
        width: 110px;
      }
    }
  }
  .tableBox {
    background: #fff;
    margin-top: 22px;
    padding: 0 20px;
    .headTop {
      height: 50px;
      font-size: 15px;
      box-sizing: border-box;
      background-color: #fff;
      display: flex;
      border-radius: 4px;
      .tabs {
        width: 100px;
        height: 50px;
        box-sizing: border-box;
        border-bottom: 2px solid transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        cursor: pointer;
        &.active {
          font-weight: 700;
          border-color: #3368a9;
          color: #3368a9;
        }
      }
    }
    .screenBox {
      width: 100%;
      height: 50px;
      margin: 5px 0;
      background-color: #f9fafc;
      display: flex;
      align-items: center;
      .left {
        flex: 1;
        display: flex;
        align-items: center;
        .item {
          display: flex;
          align-items: center;
          margin-right: 20px;
          &.date {
            min-width: 300px;
          }
          .label {
            width: 80px;
            min-width: 80px;
          }
        }
        .screenItem {
          margin-right: 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 5px;
          &.priceUnit,
          &.dateTime {
            cursor: default;
          }
          .screenLabel {
            margin-right: 10px;
            &.active {
              color: #3368a9;
            }
          }
          .jiantou {
            width: 9px;
            height: 16px;
            opacity: 1;
          }
          .xiajiantouIcon {
            background: url("~@/assets/images/xiajiantou.png") no-repeat center;
            background-size: contain;
          }
          .xiaActiveIcon {
            background: url("~@/assets/images/xiaActive.png") no-repeat center;
            background-size: contain;
          }
          .shangActiveIcon {
            background: url("~@/assets/images/shangActive.png") no-repeat center;
            background-size: contain;
          }
          .el-date-editor {
            width: 210px;
          }
          .intervalPrice {
            width: 130px;
            display: flex;
            align-items: center;
            .line {
              margin: 0 5px;
            }
          }
        }
      }
      .right {
        width: 340px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .grid,
        .column {
          width: 17px;
          height: 17px;
          margin-right: 25px;
          cursor: pointer;
        }
        .grid {
          background: url("~@/assets/images/gridIcon.png") no-repeat center;
          background-size: contain;
          &.active {
            background: url("~@/assets/images/gridActiveIcon.png") no-repeat
              center;
            background-size: contain;
          }
        }
        .column {
          background: url("~@/assets/images/columnIcon.png") no-repeat center;
          background-size: contain;
          &.active {
            background: url("~@/assets/images/columnActiveIcon.png") no-repeat
              center;
            background-size: contain;
          }
        }
        .line {
          width: 1px;
          height: 100%;
          opacity: 1;
          background: #e9e9e9;
        }
        .totalCount {
          margin-left: 15px;
          .totalCountText {
            color: #eb1515;
          }
        }
        .myMinPagination {
          width: 110px;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          margin-left: 20px;
          .first,
          .next {
            cursor: pointer;
          }
          .count {
            .pageIndex {
              color: #ff760e;
            }
          }
        }
      }
    }
  }
}
</style>
