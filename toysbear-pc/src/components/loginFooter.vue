<template>
  <div class="myFooter">
    <p class="contactMe">
      Copyright©<span>{{ year }}</span
      >深圳宏升软件技术开发有限公司
      <span> 粤ICP备13031421号-4 </span>
      <!-- <img src="~@/assets/images/cnzz.gif" alt="" /> -->
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {},
  computed: {
    year() {
      return new Date().getFullYear();
    }
  }
};
</script>
<style scoped lang="less">
.myFooter {
  width: 100%;
  background-color: #fff;
  .contactMe {
    color: #999999;
    padding: 37px 0;
    text-align: center;
  }
}
</style>
