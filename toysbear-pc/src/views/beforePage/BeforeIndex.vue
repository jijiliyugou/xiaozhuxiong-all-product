<template>
  <div class="beforeIndex">
    <beforeTop
      class="beforeTop"
      v-if="!$route.path.includes('/login')"
    ></beforeTop>
    <div class="routerContent">
      <router-view></router-view>
    </div>
    <bsFooter v-if="!$route.path.includes('/login')"></bsFooter>
  </div>
</template>

<script>
import beforeTop from "@/components/beforeTop";
import bsFooter from "@/components/footer";
export default {
  components: {
    beforeTop,
    bsFooter
  }
};
</script>

<style lang="less" scoped>
.beforeIndex {
  height: 100%;
  width: 100%;
  .routerContent {
    min-height: calc(100% - 80px);
  }
}
</style>
