<template>
  <div class="wrapBox">
    <div class="erweimaWrap">
      <el-image
        style="width: 92px; height: 92px"
        :src="require('@/assets/images/ErWeiMa.png')"
        fit="contain"
      ></el-image>
    </div>
    <div class="conText">
      <div class="TextWrap">
        <p class="text">扫码下载</p>
        <p class="text">小竹熊APP</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.wrapBox {
  width: 112px;
  height: 147px;
  background-color: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 5px;
  .erweimaWrap {
    width: 112px;
    height: 103px;
    padding: 10px;
    padding-bottom: 0;
    box-sizing: border-box;
    @{deep} .el-image {
      position: relative;
      width: 92px;
      height: 92px;
      img {
        width: 92px !important;
        height: 92px !important;
        position: absolute;
        transform: none !important;
        left: 0;
        top: 0;
      }
    }
  }
  .conText {
    height: 44px;
    color: #333333;
    display: flex;
    font-size: 13px;
    justify-content: center;
    .TextWrap {
      .text {
        text-align: center;
        line-height: 17px;
      }
    }
  }
}
</style>
