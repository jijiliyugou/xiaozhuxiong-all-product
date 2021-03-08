<template>
  <div class="topWrap">
    <div class="topLaout">
      <el-image class="myImg" :src="companyInfo.companyLogo" fit="contain">
        <div
          slot="placeholder"
          class="image-slot"
          style="width: 80px;height: 80px;"
        >
          <img class="errorImg" src="~@/assets/images/imgError.png" alt />
        </div>
        <div slot="error" class="image-slot" style="width: 80px;height: 80px;">
          <img class="errorImg" src="~@/assets/images/imgError.png" alt />
        </div>
      </el-image>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dontLoadShareFactoryPC' }"
          >参考报价分享</el-breadcrumb-item
        >
        <el-breadcrumb-item v-if="title">{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "companyInfo"],
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.topWrap {
  width: 100%;
  height: 90px;
  background-color: #fff;
  .topLaout {
    width: 1200px;
    height: 90px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .myImg {
      width: 80px;
      height: 80px;
      img {
        width: 80px;
        height: 80px;
      }
    }
  }
}
</style>
