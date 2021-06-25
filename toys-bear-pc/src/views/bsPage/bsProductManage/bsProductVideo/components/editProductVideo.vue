<template>
  <div class="editProductVideo">
    <component
      @openSelectProduct="openSelectProduct"
      @submitSelectProduct="submitSelectProduct"
      :item="item"
      :is="componentId"
    ></component>
  </div>
</template>

<script>
import currentProductVideo from "./currentProductVideo.vue";
import videoProductList from "./videoProductList.vue";
import eventBus from "@/assets/js/common/eventBus";
export default {
  props: ["item"],
  components: {
    currentProductVideo,
    videoProductList
  },
  data() {
    return {
      componentId: "currentProductVideo"
    };
  },
  methods: {
    // 切换产品页面
    openSelectProduct() {
      this.componentId = videoProductList;
    },
    // 提交已选产品
    async submitSelectProduct(list) {
      const fd = JSON.parse(JSON.stringify(this.item));
      fd.productNumbersList = list.map(v => v.productNumber);
      const res = await this.$http.post("/api/UpdateManuProductVideo", fd);
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "修改成功",
          type: "success"
        });
        eventBus.$emit("resetVideoProduct");
        this.$store.commit("closeTab", this.item.id + "产品信息");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  },
  mounted() {}
};
</script>
<style scoped lang="less">
.editProductVideo {
  background-color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
