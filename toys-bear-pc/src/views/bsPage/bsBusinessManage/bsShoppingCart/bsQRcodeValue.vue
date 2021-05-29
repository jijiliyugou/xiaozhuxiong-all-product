<template>
  <div class="codeBox">
    <div class="companyInfoBox">
      <el-image
        style="width: 60px;height: 60px;border-radius: 60px;"
        :src="QRcodeValue.companyLogo"
        fit="contain"
      >
        <div
          slot="placeholder"
          class="image-slot"
          style="width: 60px;height: 60px;border-radius: 60px;"
        >
          <img
            style="width: 60px;height: 60px;border-radius: 60px;"
            :src="require('@/assets/images/imgError.png')"
          />
        </div>
        <div
          slot="error"
          class="image-slot"
          style="width: 60px;height: 60px;border-radius: 60px;"
        >
          <img
            style="width: 60px;height: 60px;border-radius: 60px;"
            :src="require('@/assets/images/imgError.png')"
          />
        </div>
      </el-image>
      <span class="companyName">
        {{ QRcodeValue.companyName }}
      </span>
    </div>
    <div class="productCount">
      <span>{{ QRcodeValue.qrCodeType | filterCodeType }}: </span>
      <span>{{ QRcodeValue.productCount }}</span>
    </div>
    <div class="btns">
      <div class="btns_btn">
        <el-button type="primary" @click="$emit('submitCode')">
          一键添加全部商品到购物车
        </el-button>
      </div>
      <div class="btns_btn">
        <el-button @click="$emit('close')">取消</el-button>
      </div>
    </div>
    <!-- {{ QRcodeValue }} -->
  </div>
</template>

<script>
export default {
  props: ["QRcodeValue"],
  data() {
    return {};
  },
  methods: {},
  filters: {
    filterCodeType(val) {
      let msg;
      switch (val) {
        case "dontloadsharefactory":
          msg = "店铺产品总数";
          break;
        case "offerSharing":
          msg = "找样报价分享总数";
          break;
        default:
          msg = "";
      }
      return msg;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.codeBox {
  width: 100%;
  height: 250px;
  .companyInfoBox {
    margin-top: 10px;
    height: 60px;
    // background-color: skyblue;
    display: flex;
    align-items: center;
    justify-content: center;
    .companyName {
      font-size: 18px;
      color: #333333;
      margin-left: 16px;
    }
  }
  .productCount {
    margin-top: 27px;
    font-size: 18px;
    color: #333;
    text-align: center;
  }
  .btns {
    margin-top: 35px;
    .btns_btn {
      width: 266px;
      margin: 0 auto;
      height: 56px;
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
