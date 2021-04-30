<template>
  <div class="bsSampleOfferCommodity">
    <div class="hander">
      <div class="left">
        <div
          :class="{ tabs: true, active: typeId === 0 }"
          @click="checkTabstypeId(0)"
        >
          我的收藏
        </div>
        <div
          :class="{ tabs: true, active: typeId === 2 }"
          @click="checkTabstypeId(2)"
        >
          我的找样
        </div>
        <div
          :class="{ tabs: true, active: typeId === 1 }"
          @click="checkTabstypeId(1)"
        >
          所有产品
        </div>
      </div>
      <div class="right">
        <el-button @click="handleAffirm" type="primary" round>
          确定已选择({{ offerProductList.length }})
          <i style="font-size:15px" class="el-icon-right el-icon--right"></i>
        </el-button>
      </div>
    </div>
    <div class="productListBox">
      <!-- 产品列表 -->
      <!-- <bsProductSearchIndex v-if="typeId === 1"></bsProductSearchIndex> -->

      <!-- <div class="bsGridComponent" v-if="typeId != 1"> -->
      <div class="bsGridComponent">
        <bsSampleOfferProductList
          @pushOfferProductList="pushOfferProductList"
          @popOfferProductList="popOfferProductList"
          v-for="item in productList"
          :key="item.productNumber"
          :item="item"
        />
        <div class="kong"></div>
        <div class="kong"></div>
        <div class="kong"></div>
        <div class="kong"></div>
      </div>

      <!-- 分页 -->
      <!-- <center style="padding:20px 0;" v-if="typeId != 1"> -->
      <center style="padding:20px 0;">
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
</template>
<script>
// import { mapState } from "vuex";
import bsSampleOfferProductList from "@/components/bsComponents/bsSampleComponent/bsSampleOfferProductList";
// import bsProductSearchIndex from "@/views/bsPage/bsProductSearch/bsProductSearchIndex/BsProductSearchIndex.vue";

import eventBus from "@/assets/js/common/eventBus.js";
export default {
  name: "bsSampleOfferCommodity",
  components: {
    bsSampleOfferProductList
  },
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      num: null,
      typeId: 0,
      offerProductList: [],
      productList: [],
      isGrid: "bsGridComponent",
      totalCount: 0,
      pageSize: 12,
      currentPage: 1
    };
  },
  mounted() {
    // this.$set(this, "offerProductList", this.item.list);
    // this.getProductList();
    this.getProductOfferDetailPage();
  },
  methods: {
    // 获取全部列表
    async getProductOfferDetailPage() {
      const fd = {
        skipCount: 1,
        maxResultCount: 9999,
        ...this.item
      };
      const res = await this.$http.post("/api/ProductOfferDetailPage", fd);
      if (res.data.result.code === 200) {
        this.offerProductList = res.data.result.item.items;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
      this.getProductList();
    },
    // 删除产品
    popOfferProductList(item) {
      for (let i = 0; i < this.offerProductList.length; i++) {
        if (this.offerProductList[i].productNumber == item.productNumber) {
          this.offerProductList.splice(i, 1);
        }
      }
    },
    // 添加产品
    pushOfferProductList(item) {
      this.offerProductList.push(item);
    },
    //   产品列表
    async getProductList() {
      const fd = {
        pageSize: this.pageSize,
        typeId: this.typeId,
        pageIndex: this.currentPage
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/SupplierProduct", fd);
      const { code, item, msg } = res.data.result;
      if (code === 200) {
        if (this.offerProductList) {
          for (let i = 0; i < item.items.length; i++) {
            for (let j = 0; j < this.offerProductList.length; j++) {
              if (
                item.items[i].productNumber ===
                this.offerProductList[j].productNumber
              ) {
                item.items[i].isShopping = true;
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
    //返回编辑页面
    async handleAffirm() {
      eventBus.$emit("getSearchForm" + this.item.offerNumber, this.callback);
      const quotationProductList = this.offerProductList.map(item => ({
        productNumber: item.productNumber,
        boxNumber: item.boxNumber
      }));
      this.item.topValue.quotationProductList = quotationProductList;
      const res = await this.$http.post(
        "/api/UpdateProductOffer",
        this.item.topValue
      );
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "提交成功",
          type: "success"
        });
        eventBus.$emit("resetOffProduct");
        const option = {
          name: this.item.offerNumber,
          toName: "编辑" + this.item.offerNumber
        };
        const tabList = this.$store.state.tabList;
        const flag = tabList.find(
          val => val.name === "编辑" + this.item.offerNumber
        );
        if (tabList.length < 1) {
          return false;
        } else {
          if (flag) this.$store.commit("closeOfferTab", option);
        }
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          error: "danger"
        });
      }
    },

    //切换
    checkTabstypeId(num) {
      this.typeId = num;
      this.getProductList();
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getProductList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getProductList();
    }
  }
};
</script>
<style lang="less" scoped>
.bsSampleOfferCommodity {
  background: #fff;

  .hander {
    height: 70px;
    font-size: 15px;
    box-sizing: border-box;
    background-color: #fff;
    padding-left: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
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
    .right {
      margin-right: 20px;
    }
  }
  .productListBox {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    .bsGridComponent {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .kong {
        width: 250px;
        min-width: 250px;
      }
    }
  }
}
</style>
