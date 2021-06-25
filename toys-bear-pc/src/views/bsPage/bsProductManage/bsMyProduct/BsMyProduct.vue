<template>
  <div class="bsMyProduct">
    <div class="myProduct_tab">
      <div :class="{ tabs: true, active: isDiyu === 1 }" @click="checkTab(1)">
        <span>我的产品({{ myProductTotalCount }})</span>
      </div>
      <div :class="{ tabs: true, active: isDiyu === 2 }" @click="checkTab(2)">
        <span>推荐产品({{ recommendProductTotalCount }})</span>
      </div>
    </div>
    <div class="myProduct_content">
      <myProduct v-if="isDiyu === 1" />
      <recommendProduct
        @handlerRecommendCount="handlerRecommendCount"
        v-else-if="isDiyu === 2"
      />
    </div>
  </div>
</template>

<script>
import myProduct from "./components/myProduct.vue";
import recommendProduct from "./components/recommendProduct.vue";
import { mapState } from "vuex";
export default {
  name: "",
  components: {
    myProduct,
    recommendProduct
  },
  data() {
    return {
      isDiyu: 1,
      myProductTotalCount: 0,
      recommendProductTotalCount: 0
    };
  },
  created() {},
  mounted() {
    this.getMyProductPage();
    this.getRecommendProductPage();
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    // 修改推荐产品数量
    handlerRecommendCount(count) {
      this.recommendProductTotalCount = count;
    },
    // 切换tab
    checkTab(num) {
      this.isDiyu = num;
    },
    // 获取我的产品
    async getMyProductPage() {
      const res = await this.$http.post("/api/MyProductPage", {
        pageIndex: 1,
        pageSize: 10
      });
      if (res.data.result.code === 200) {
        this.myProductTotalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取推荐产品
    async getRecommendProductPage() {
      const res = await this.$http.post("/api/RecommendProductByNumberPage", {
        companyNumber: this.userInfo.commparnyList[0].companyNumber,
        pageIndex: 1,
        pageSize: 10
      });
      if (res.data.result.code === 200) {
        this.recommendProductTotalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  }
};
</script>
<style scoped lang="less">
.bsMyProduct {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
  .myProduct_tab {
    display: flex;
    flex: 1;
    align-items: center;
    .tabs {
      width: 120px;
      height: 35px;
      box-sizing: border-box;
      border-bottom: 2px solid transparent;
      display: flex;
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
  .myProduct_content {
    margin-top: 20px;
  }
}
</style>
