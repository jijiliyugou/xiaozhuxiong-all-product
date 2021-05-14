<template>
  <div class="bsMyClientsDetail">
    <div class="hander">
      <div class="handerBg"></div>
      <div class="handerTitle">
        <div class="top">
          <div class="clientsImg">
            <el-image
              style="width: 120px; height: 120px; border-radius: 50%"
              fit="contain"
              :src="companyInfo.companyLogo"
              lazy
            >
              <div slot="placeholder" class="image-slot">
                <img :src="require('@/assets/images/imgError.png')" />
              </div>
              <div slot="error" class="image-slot">
                <img :src="require('@/assets/images/imgError.png')" />
              </div>
            </el-image>
          </div>
          <div class="clientsData">
            <div class="name">{{ companyInfo.companyName }}</div>
            <div class="tel">
              <p v-if="companyInfo.contactsMan">
                联系人：{{ companyInfo.contactsMan }}
              </p>
              <p v-if="companyInfo.telephoneNumber">
                <i class="phoneIcon"></i>{{ companyInfo.telephoneNumber }}
              </p>
              <p v-if="companyInfo.phoneNumber">
                <i class="sjIcon"></i>{{ companyInfo.phoneNumber }}
              </p>
              <p v-if="companyInfo.qq">
                <i class="qqIcon"></i>{{ companyInfo.qq }}
              </p>
              <p class="onlineConsultation" @click="toNews">
                <img src="~@/assets/images/consult.png" alt />
                在线咨询
              </p>
            </div>
            <p v-if="companyInfo.address" style="color: #666">
              地址：{{ companyInfo.address }}
            </p>
          </div>
        </div>
        <div class="headTop">
          <div
            :class="{ tabs: true, active: isDiyu === 0 }"
            @click="checkTabsAll(0)"
          >
            所有产品
          </div>
          <div
            :class="{ tabs: true, active: isDiyu === 1 }"
            @click="checkTabsAll(1)"
          >
            推荐产品
          </div>
        </div>
      </div>
      <div class="tableBox">
        <div class="screenBox">
          <div class="left" v-if="isDiyu === 0">
            <div class="screenItem" @click="sortTypeEvent(null)">
              <span :class="{ screenLabel: true, active: sortOrder === null }"
                >综合</span
              >
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
            <div class="screenItem" @click="sortTypeEvent(4)">
              <span :class="{ screenLabel: true, active: sortOrder === 4 }">
                货号
              </span>
              <i v-show="isFa_no === null" class="jiantou xiajiantouIcon"></i>
              <i v-show="isFa_no === 1" class="jiantou xiaActiveIcon"></i>
              <i v-show="isFa_no === 2" class="jiantou shangActiveIcon"></i>
            </div>
            <div class="item">
              <span class="label">关键词搜索:</span>
              <el-input
                type="text"
                size="medium"
                v-model="KeyWord"
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
          <div class="left" v-if="isDiyu === 1">
            <div class="screenItem" @click="sortTypeEvent(null)">
              <span :class="{ screenLabel: true, active: sortOrder === null }"
                >综合</span
              >
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
            <div class="screenItem" @click="sortTypeEvent(4)">
              <span :class="{ screenLabel: true, active: sortOrder === 4 }">
                货号
              </span>
              <i v-show="isFa_no === null" class="jiantou xiajiantouIcon"></i>
              <i v-show="isFa_no === 1" class="jiantou xiaActiveIcon"></i>
              <i v-show="isFa_no === 2" class="jiantou shangActiveIcon"></i>
            </div>
            <div class="item">
              <span class="label">关键词搜索:</span>
              <el-input
                type="text"
                size="medium"
                v-model="searchForm.keyword"
                placeholder="请输入关键词"
                @keyup.native.enter="searchEcommend"
              ></el-input>
            </div>
            <div class="item">
              <el-button
                @click="searchEcommend"
                type="primary"
                size="medium"
                icon="el-icon-search"
              >
                搜索
              </el-button>
            </div>
          </div>
          <div class="right">
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
            <!-- <div class="totalCount">
            <span class="totalCountText">{{ totalCount }}</span>
            <span>条数据</span>
          </div> -->
            <div class="myMinPagination">
              <div @click="firstEvent" class="first el-icon-arrow-left"></div>
              <div class="count">
                <span class="pageIndex">{{ currentPage }}</span>
                <span>/</span>
                <span>{{ Math.ceil(totalCount / pageSize) }}</span>
              </div>
              <div @click="nextEvent" class="next el-icon-arrow-right"></div>
            </div>
          </div>
        </div>
        <div class="productListBox">
          <!-- 产品列表 -->
          <component :is="isGrid" :productList="productList"></component>
          <!-- 分页 -->
          <center class="myPagination">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[12, 24, 36, 48]"
              background
              :total="totalCount"
              :page-size="pageSize"
              :current-page.sync="currentPage"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            ></el-pagination>
          </center>
        </div>
      </div>
    </div>
    <div class="footer" v-if="totalCount >= 7">
      <img src="@/assets/images/footerBg.png" alt="" />
    </div>
  </div>
</template>

<script>
// import bsColumnComponent from "@/components/bsComponents/bsProductSearchComponent/bsColumnComponent";
import bsColumnComponent from "@/components/bsComponents/bsProductSearchComponent/bsTableItem";
import bsGridComponent from "@/components/bsComponents/bsProductSearchComponent/bsGridComponent";
import eventBus from "@/assets/js/common/eventBus.js";
import { mapGetters } from "vuex";
export default {
  name: "bsMyClientsDetail",
  components: {
    bsGridComponent,
    bsColumnComponent
  },
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      companyInfo: {},
      isFa_no: null,
      isDiyu: 0,
      isPrice: null,
      isTime: null,
      isRedu: null,
      sortOrder: null,
      sortType: null,
      KeyWord: null,
      keywordAll: null,
      isGrid: "bsGridComponent",
      currentPage: 1,
      pageSize: 12,
      totalCount: 0,
      productList: [],
      messageExt: null,
      searchForm: {
        keyword: "",
        minPrice: "",
        maxPrice: "",
        categoryNumber: null,
        time: []
      },
      typesList: []
    };
  },
  watch: {
    shoppingList: {
      deep: true,
      handler() {
        eventBus.$emit("upDateProductView");
      }
    }
  },
  created() {},
  mounted() {
    // 取消收藏/刷新页面
    eventBus.$on("resetProductCollection", item => {
      // this.getProductList();
      for (let i = 0; i < this.productList.length; i++) {
        if (this.productList[i].productNumber == item.productNumber) {
          this.productList[i].isFavorite = item.isFavorite;
        }
      }
    });
    // 加购删除购物车
    eventBus.$on("resetMyCart", item => {
      if (Object.prototype.toString.call(item) === "[object Array]") {
        // 数组
        if (item.length) {
          for (let i = 0; i < this.productList.length; i++) {
            for (let j = 0; j < item.length; j++) {
              if (this.productList[i].productNumber == item[j].productNumber) {
                this.productList[i].isShopping = true;
                break;
              } else {
                this.productList[i].isShopping = false;
              }
            }
          }
        } else {
          this.productList.forEach(val => {
            val.isShopping = false;
          });
        }
      } else if (Object.prototype.toString.call(item) === "[object Object]") {
        // 对象;
        for (let i = 0; i < this.productList.length; i++) {
          if (item.productNumber == this.productList[i].productNumber) {
            this.productList[i].isShopping = item.isShopping;
          }
        }
      }
    });
    eventBus.$emit("showCart", true);
    this.getProductListPageAll();
    this.getCompanyByID();
  },
  computed: {
    ...mapGetters({
      shoppingList: "myShoppingList"
    })
  },
  methods: {
    // 去聊天
    toNews() {
      const fd = {
        name: this.companyInfo.companyNumber + "bsNews",
        linkUrl: "/bsIndex/bsNews",
        component: "bsNews",
        refresh: true,
        label: this.companyInfo.companyName,
        value: this.companyInfo
      };
      this.$router.push("/bsIndex/bsNews");
      this.$store.commit("myAddTab", fd);
    },
    // 获取厂商资料
    async getCompanyByID() {
      const res = await this.$http.post("/api/CompanyByID", {
        companyNumber: this.item.companyNumber
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
    //所有产品接口
    async getProductListPageAll() {
      const fd = {
        PageIndex: this.currentPage,
        PageSize: this.pageSize,
        KeyWord: this.KeyWord,
        sortOrder: this.sortOrder,
        sortType: this.sortType,
        typeId: 1,
        companyNumber: this.item.companyNumber
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/SupplierProduct", fd);
      const { code, item, msg } = res.data.result;
      if (code === 200) {
        if (this.shoppingList) {
          for (let i = 0; i < item.items.length; i++) {
            this.$set(item.items[i], "isShopping", false);
            for (let j = 0; j < this.shoppingList.length; j++) {
              if (
                item.items[i].productNumber ===
                this.shoppingList[j].productNumber
              ) {
                this.$set(item.items[i], "isShopping", true);
              }
            }
          }
        }
        this.productList = item.items;
        this.totalCount = item.totalCount;
      } else {
        this.totalCount = 0;
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
      }
    },
    //推荐产品接口
    async getProductListPageEcommend() {
      const fd = {
        maxResultCount: this.pageSize,
        skipCount: this.currentPage,
        companyNumber: this.item.companyNumber,
        KeyWord: this.searchForm.keyword,
        minPrice: this.searchForm.minPrice,
        maxPrice: this.searchForm.maxPrice,
        startTime: this.searchForm.time.length ? this.searchForm.time[0] : null,
        endTime: this.searchForm.time.length ? this.searchForm.time[1] : null,
        sortOrder: this.sortOrder,
        sortType: this.sortType
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
      }
    },
    //切换产品类型
    checkTabsAll(num) {
      this.isDiyu = num;
      if (this.isDiyu === 0) {
        this.getProductListPageAll();
      } else {
        this.getProductListPageEcommend();
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
      if (this.isDiyu === 0) {
        this.getProductListPageAll();
      } else {
        this.getProductListPageEcommend();
      }
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      if (this.isDiyu === 0) {
        this.getProductListPageAll();
      } else {
        this.getProductListPageEcommend();
      }
    },
    // 所有产品搜索
    search() {
      this.currentPage = 1;
      this.getProductListPageAll();
    },
    //推荐产品搜索
    searchEcommend() {
      this.currentPage = 1;
      this.getProductListPageEcommend();
    },
    // 切换产品列表样式
    handerIsGrid(type) {
      this.isGrid = type;
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
      if (this.isDiyu === 0) {
        this.getProductListPageAll();
      } else {
        this.getProductListPageEcommend();
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
      if (this.isDiyu === 0) {
        this.getProductListPageAll();
      } else {
        this.getProductListPageEcommend();
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
      if (this.isDiyu === 0) {
        this.getProductListPageAll();
      } else {
        this.getProductListPageEcommend();
      }
    }
  }
};
</script>
<style scoped lang="less">
.bsMyClientsDetail {
  min-height: 100%;
  .hander {
    .handerBg {
      height: 160px;
      background: url("~@/assets/images/clientsBg.png") no-repeat center;
    }
    .handerTitle {
      padding-left: 57px;
      height: 180px;
      background: #ffffff;
      .top {
        height: 90px;
        display: flex;
        .clientsImg {
          transform: translateY(-30px);
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin-right: 15px;
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
        .clientsData {
          padding-top: 20px;
          flex: 1;
          .name {
            height: 31px;
            font-size: 24px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #333333;
            line-height: 34px;
          }
          .tel {
            display: flex;
            height: 31px;
            font-size: 14px;
            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #666666;
            line-height: 34px;
            margin: 10px 0;
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
            .onlineConsultation {
              cursor: pointer;
            }
          }
        }
      }
      .headTop {
        height: 50px;
        font-size: 15px;
        box-sizing: border-box;
        background-color: #fff;
        padding-left: 20px;
        display: flex;
        margin-top: 40px;
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
    }
  }
  .tableBox {
    padding: 30px 20px 0;
    background-color: #f9fafc;
    min-height: 100%;
    .screenBox {
      width: 100%;
      height: 50px;
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
          margin-right: 30px;
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
  .productListBox {
    width: 100%;
    box-sizing: border-box;
    .myPagination {
      padding: 30px 0;
    }
  }
}
.footer {
  margin-top: 20px;
  background-color: #f1f3f6;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
