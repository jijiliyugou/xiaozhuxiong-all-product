<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Gabriel.gaojiahao
 * @Date: 2019-03-25 10:56:56
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-12-05 11:04:07
 -->
<template>
  <div class="loadding" v-show="show">
    <Spin size="large" fix>
      <Icon type="ios-loading" size="18" class="spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
import { Spin, Icon } from "view-design";

export default {
  name: "Loading",
  data() {
    return {
      show: false
    };
  },
  components: {
    Spin,
    Icon
  }
};
</script>

<style lang="less" scoped>
.loadding {
  //加载动画
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background: #fff;
  z-index: 100;

  .spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }

    50% {
      transform: rotate(180deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
}
</style>
