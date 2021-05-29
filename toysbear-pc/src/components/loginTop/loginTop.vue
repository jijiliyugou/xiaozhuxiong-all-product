<template>
  <div class="loginTop">
    <div class="top">
      <el-image
        style="width: 213px; height: 53px"
        :src="require('@/assets/images/loginTopImg.png')"
        fit="contain"
      >
      </el-image>
      <div class="line"></div>
      <div class="welcome">欢迎登录</div>
      <div class="right">
        <div class="infoItem">
          <div class="iconBox telephoneIcon"></div>
          <span class="content">热线电话：0754-89671122</span>
        </div>
        <div class="infoItem qq" @click="toQQ('3300802838')">
          <div class="iconBox QQIcon"></div>
          <span class="content">客服QQ1</span>
        </div>
        <div class="infoItem qq" @click="toQQ('3300802838')">
          <div class="iconBox QQIcon"></div>
          <span class="content">客服QQ2</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    // QQ客服
    toQQ(qq) {
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = "http://wpa.qq.com/msgrd?v=3&uin=" + qq + "&site=qq&menu=yes";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href); // 释放URL 对象
      document.body.removeChild(link);
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.loginTop {
  width: 100%;
  height: 100%;
  .top {
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }

  .line {
    width: 1px;
    height: 37px;
    background-color: #c6c6c6;
    margin-left: 25px;
    margin-top: 15px;
  }
  .welcome {
    color: #666666;
    font-size: 26px;
    margin-left: 15px;
    margin-top: 18px;
  }
  .right {
    flex: 1;
    height: 100%;
    margin-left: 386px;
    justify-content: flex-end;
    display: flex;
    align-items: center;
    .infoItem {
      margin-right: 18px;
      margin-top: 18px;
      display: flex;
      align-items: center;
      &.qq,
      &.info {
        cursor: pointer;
      }
      .iconBox {
        width: 18px;
        height: 18px;
        &.telephoneIcon {
          background: url("~@/assets//images/telephoneIcon.png") no-repeat
            center;
        }
        &.QQIcon {
          background: url("~@/assets//images/QQIcon.png") no-repeat center;
        }
        &.lingdangIcon {
          background: url("~@/assets//images/lingdangIcon.png") no-repeat center;
        }
      }
      .userIcon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        // display: flex;
        // align-items: center;
        line-height: 30px;
        white-space: nowrap;
        overflow: hidden;
        text-align: center;
      }
      .content {
        margin-left: 10px;
        &.userName {
          max-width: 112px;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
      }
    }
  }
}
</style>
