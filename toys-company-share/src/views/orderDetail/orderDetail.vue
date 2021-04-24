<template>
  <div class="contentBox">
    <home-top-component />
    <orderDetailComponent :item="$route.query.item" class="orderDetailBox" />
    <myFoot class="myFoot" />
  </div>
</template>

<script>
import homeTopComponent from "@/components/homeTopComponent/homeTopComponent.vue";
import myFoot from "@/components/myFoot/myFoot.vue";
import orderDetailComponent from "@/components/orderDetailComponent/orderDetailComponent.vue";
export default {
  components: {
    homeTopComponent,
    orderDetailComponent,
    myFoot
  },
  data() {
    return {};
  },
  methods: {},
  created() {
    document.title = this.orderDetailLang.orderDetails;
  },
  mounted() {},
  watch: {
    "$store.state.globalLang"(val) {
      if (val) document.title = this.orderDetailLang.orderDetails;
    }
  },
  computed: {
    orderDetailLang() {
      return this.$t("lang.myOrder");
    }
  }
};
</script>
<style scoped lang="less">
.contentBox {
  height: 100%;
  .orderDetailBox {
    min-height: calc(100% - 343px) !important;
  }
  .myFoot {
    margin-top: 20px;
  }
}
</style>
