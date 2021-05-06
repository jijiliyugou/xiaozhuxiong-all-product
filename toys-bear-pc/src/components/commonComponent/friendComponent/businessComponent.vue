<!--  -->
<template>
  <div class="businessComponent">
    <div class="header">
      <el-image
        style="width: 50px; height: 50px; border-radius: 50%"
        fit="contain"
        :src="require('@/assets/images/imgError.png')"
        lazy
      >
        <div slot="placeholder" class="image-slot">
          <img :src="require('@/assets/images/imgError.png')" />
        </div>
        <div slot="error" class="image-slot">
          <img :src="require('@/assets/images/imgError.png')" />
        </div>
      </el-image>
      <div class="username">
        <h3>cheng</h3>
        <p>玩具厂</p>
      </div>
    </div>
    <div class="main">
      <p>姓名：<span></span></p>
      <p>电话：<span></span></p>
      <p>公司：<span class=""></span></p>
      <p>备注：<span></span></p>
    </div>
    <div class="footer">
      <div class="sendMessage">发消息</div>
      <div v-if="type === '添加'" class="addFriend">添加好友</div>
      <div class="deleteFriend">删除好友</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "businessComponent",
  props: {
    item: Object
  },
  data() {
    return {
      type: "添加",
      companyInfo: {}
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style scoped lang="less">
.businessComponent {
  width: 300px;
  height: 410px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  .header {
    display: flex;
    padding: 20px 20px 0;
    height: 90px;
    box-sizing: border-box;
    border-bottom: 1px solid #dcdfe6;
    .username {
      padding-left: 15px;
      overflow: hidden;
      h3 {
        font-weight: 700;
        font-size: 18px;
        text-align: left;
        color: #333333;
        line-height: 34px;
      }
      p {
        color: #999999;
        font-size: 14px;
      }
    }
  }
  .main {
    height: 160px;
    padding: 0 20px;
    p {
      margin-top: 20px;
      color: #999999;
      span {
        color: #333333;
      }
    }
  }
  .footer {
    margin: 0 20px;
    border-top: 1px solid #dcdfe6;
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 260px;
      height: 36px;
      border-radius: 4px;
    }
    .sendMessage {
      background-color: #3368a9;
      margin: 25px 0 12px 0;
      color: #fff;
    }
    .addFriend {
      background-color: #ffffff;
      border: 1px solid #3368a9;
      color: #ff4848;
      box-sizing: border-box;
    }
    .deleteFriend {
      background-color: #ffffff;
      border: 1px solid #ff4848;
      color: #3368a9;
      box-sizing: border-box;
    }
  }
}
</style>
