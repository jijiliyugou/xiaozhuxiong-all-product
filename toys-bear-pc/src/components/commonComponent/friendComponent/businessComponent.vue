<!--  -->
<template>
  <div class="businessComponent" @click.stop>
    <div class="header">
      <!-- <img  style="width: 50px; height: 50px; border-radius: 50%; z-index:99" :src="userData.userImage" alt=""> -->
      <el-image
        style="width: 50px; height: 50px; border-radius: 50%;"
        fit="contain"
        :src="userData.userImage"
      >
        <div slot="placeholder" class="image-slot">
          <img
            style="width: 50px; height: 50px; border-radius: 50%"
            :src="require('@/assets/images/imgError.png')"
          />
        </div>
        <div slot="error" class="image-slot">
          <img
            style="width: 50px; height: 50px; border-radius: 50%"
            :src="require('@/assets/images/imgError.png')"
          />
        </div>
      </el-image>
      <div class="username">
        <h3>{{ userData.linkman }}</h3>
        <p>{{ userData.companyName }}</p>
      </div>
    </div>
    <div class="main">
      <p>
        姓名：<span>{{ userData.linkman }}</span>
      </p>
      <p>
        电话：<span>{{ userData.phoneNumber }}</span>
      </p>
      <p>
        公司：<span class="blue">{{ userData.companyName }}</span>
      </p>
      <p>
        备注：<span>{{ userData.remark }}</span>
      </p>
    </div>
    <div class="footer">
      <div class="sendMessage" @click.stop="handlesendMessage">发消息</div>
      <div
        v-if="type === '添加'"
        class="addFriend"
        @click.stop="handlesendMessage"
      >
        添加好友
      </div>
      <div
        v-if="type === '删除'"
        class="deleteFriend"
        @click.stop="handlesendMessage"
      >
        删除好友
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "businessComponent",
  props: {
    userData: {
      type: Object
    }
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
  mounted() {},
  methods: {
    //   发消息
    handlesendMessage() {
      this.$common.handlerMsgState({
        msg: "敬请期待",
        type: "danger"
      });
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.businessComponent {
  cursor: default;
  width: 300px;
  height: 410px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  @{deep} .header {
    display: flex;
    padding: 20px 20px 0;
    height: 90px;
    box-sizing: border-box;
    border-bottom: 1px solid #dcdfe6;
    .el-image {
      .el-image__inner {
        opacity: 1;
      }
    }

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
      .blue {
        color: #3368a9;
      }
    }
  }
  .footer {
    margin: 0 20px;
    border-top: 1px solid #dcdfe6;
    div {
      cursor: pointer;
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
      color: #3368a9;
      box-sizing: border-box;
    }
    .deleteFriend {
      background-color: #ffffff;
      border: 1px solid #ff4848;
      color: #ff4848;
      box-sizing: border-box;
    }
  }
}
</style>
