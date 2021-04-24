<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Gabriel.gaojiahao
 * @Date: 2019-03-25 10:56:56
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-12-05 11:04:59
 -->
<template>
  <div class="loadding" v-show="show">
    <spinner type="ripple" size="50px"></spinner>
  </div>
</template>

<script>
import { Spinner } from "vux";

export default {
  name: "Loading2",
  data() {
    return {
      show: false
    };
  },
  components: { Spinner }
};
</script>

<style scoped lang="less">
.loadding {
  //加载动画
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.1);
}
</style>
