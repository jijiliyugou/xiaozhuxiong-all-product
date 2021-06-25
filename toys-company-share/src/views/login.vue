<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-04-14 14:27:13
 * @FilePath: \projectd:\LittleBearPC\toys-company-share\src\views\login.vue
 * @LastEditTime: 2021-06-16 11:02:36
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="login_content">
    <mbLogin v-if="isMobile"></mbLogin>
    <pcLogin v-else></pcLogin>
  </div>
</template>

<script>
import pcLogin from "@/components/login/pcLogin.vue";
import mbLogin from "@/components/login/mbLogin.vue";
import util from "@/assets/js/utils/util.js";
export default {
  name: "login",
  components: {
    pcLogin,
    mbLogin
  },
  data() {
    return {
      isMobile: false //是否移动端
    };
  },
  methods: {},
  created() {
    this.isMobile = util.isMobile();
  },
  mounted() {},
  watch: {},
  computed: {}
};
</script>
<style scoped lang="less">
@media screen and (min-width: 768px) {
  .login_content {
    font-size: 16px;
    height: 100vh;
    position: relative;
    color: #333;
  }
}
@media (max-width: 767px) {
  .login_content {
    font-size: 16px;
    position: relative;
    color: #333;
    min-height: 750px;
    background: url("~@/assets/images/loginBgImg_sm.jpg") no-repeat center;
  }
}
</style>
