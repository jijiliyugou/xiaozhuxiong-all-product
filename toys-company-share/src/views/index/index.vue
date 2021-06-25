<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-14 14:27:13
 * @FilePath: \projectd:\LittleBearPC\toys-company-share\src\views\index\index.vue
 * @LastEditTime: 2021-06-19 12:04:43
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="contentBox">
    <template v-if="isMobile">
      <home-top-component-mb
        :showTitle="$route.path === '/index/home' ? true : false"
      />
      <advertisement-component-mb
        v-if="$route.path === '/index/home'"
      ></advertisement-component-mb>
      <advanced-search-mb v-if="$route.path === '/index/product'" />
      <router-view class="myRouterView"></router-view>
    </template>
    <template v-else>
      <home-top-component />
      <!-- 广告 -->
      <advertisement-component v-if="$route.path === '/index/home'" />
      <advanced-search
        v-if="$route.path === '/index/product' || $route.path === '/index/home'"
      />
      <router-view class="myRouterView"></router-view>
      <myFoot class="myFoot" />
    </template>
  </div>
</template>

<script>
import homeTopComponent from "@/components/homeTopComponent/homeTopComponent.vue";
import homeTopComponentMb from "@/components/homeTopComponent/homeTopComponentMb.vue";
import advancedSearch from "@/components/advancedSearch/advancedSearch.vue";
import advancedSearchMb from "@/components/advancedSearch/advancedSearchMb.vue";
import advertisementComponent from "@/components/advertisementComponent/advertisementComponent.vue";
import advertisementComponentMb from "@/components/advertisementComponent/advertisementComponentMb.vue";
import myFoot from "@/components/myFoot/myFoot.vue";
import util from "@/assets/js/utils/util.js";

export default {
  components: {
    homeTopComponent,
    homeTopComponentMb,
    advancedSearch,
    advancedSearchMb,
    advertisementComponent,
    advertisementComponentMb,
    myFoot
  },
  data() {
    return {
      isMobile: false //是否移动端
    };
  },
  methods: {},
  created() {
    this.isMobile = util.isMobile();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
@media screen and (min-width: 768px) {
  .contentBox {
    height: 100%;
    .myRouterView {
      min-height: calc(100% - 343px);
    }
    .myFoot {
      margin-top: 20px;
    }
  }
}
@media (max-width: 767px) {
  .contentBox {
    height: 100%;
    position: relative;
    .myRouterView {
      min-height: calc(100% - 343px);
    }
    .myFoot {
      margin-top: 20px;
    }
  }
}
</style>
