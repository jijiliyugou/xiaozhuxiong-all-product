<template>
  <div class="addPushContent">
    <div class="productCount">
      <p class="countItem">
        <span class="countItem_title">产品数量：</span>
        <span>{{ myData.productCount || 0 }}</span>
      </p>
      <!-- <p class="countItem">
              <span class="countItem_title">下架产品数：</span>
              <span>{{ addShopOption.productCount }}</span>
            </p> -->
    </div>
    <div class="countItem_btns">
      <el-button size="medium" @click="$emit('close')">取消</el-button>
      <el-button size="medium" type="primary" @click="$emit('submit', myData)">
        加购
      </el-button>
    </div>
    <p class="tips">（已下架产品无法加购）</p>
  </div>
</template>

<script>
export default {
  props: ["addShopOption"],
  data() {
    return {
      myData: {}
    };
  },
  methods: {
    async getProductData() {
      const res = await this.$http.post(
        "/api/OnekeyShopping",
        this.addShopOption
      );
      if (res.data.result.code === 200) {
        this.myData = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  },
  created() {},
  mounted() {
    this.getProductData();
  }
};
</script>
<style scoped lang="less">
.addPushContent {
  text-align: center;
  .productCount {
    margin-top: 30px;
    font-size: 16px;
    .countItem {
      margin-bottom: 20px;
      .countItem_title {
        color: #666;
      }
    }
  }
  .countItem_btns {
    margin-top: 40px;
  }
  .tips {
    color: #999;
    font-size: 13px;
    margin-top: 10px;
  }
}
</style>
