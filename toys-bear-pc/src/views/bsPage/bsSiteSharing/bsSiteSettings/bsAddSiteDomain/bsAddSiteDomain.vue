<template>
  <div class="bsAddSiteDomain">
    <el-form
      label-width="100px"
      style="margin-left: -10px;"
      :rules="rules"
      :model="formData"
      size="medium"
    >
      <el-form-item label="名称：" style="margin-right:20px" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="域名地址：" style="margin-right:20px" prop="url">
        <el-input
          v-model="formData.url"
          @keyup.native.enter="submit"
        ></el-input>
      </el-form-item>
    </el-form>
    <center class="subBtn">
      <el-button
        @click="submit"
        type="primary"
        style="width:120px;"
        size="medium"
      >
        确定
      </el-button>
    </center>
    <div class="ipList">
      <span class="title">小竹熊域名IP：</span>
      <span class="value">香港IP：119.8.46.84</span>
      <span class="value">美国IP：132.148.25.167</span>
    </div>
    <div class="zhinanTitle">
      操作指南
    </div>
    <div class="caozuoIcons">
      <i class="icon www"></i>
      <i class="icon right"></i>
      <i class="icon dns"></i>
      <i class="icon right"></i>
      <i class="icon ip"></i>
    </div>
    <div class="shuoming">
      <span>1. 登录您的个人域名代理商</span>
      <span>2. 管理域名DNS</span>
      <span>3. 设置DNS为小竹熊域名IP</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    currentRow: {
      type: Object
    }
  },
  data() {
    return {
      formData: {
        name: "",
        url: ""
      },
      rules: {
        name: { required: true, message: "请输入网站名称", trigger: "blur" },
        url: { required: true, message: "请输入网址", trigger: "blur" }
      }
    };
  },
  methods: {
    // 提交新增
    async submit() {
      let api = "/api/CreateWebsiteInfo";
      if (this.isEdit) api = "/api/UpdateWebsiteInfo";
      const res = await this.$http.post(api, this.formData);
      const { code, msg } = res.data.result;
      if (code === 200) {
        this.$common.handlerMsgState({
          msg: this.isEdit ? "编辑成功" : "新增成功",
          type: "success"
        });
        this.$emit("success");
      } else {
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
      }
    }
  },
  created() {},
  mounted() {
    if (this.isEdit) {
      for (const key in this.currentRow) {
        this.formData[key] = this.currentRow[key];
      }
    }
  }
};
</script>
<style scoped lang="less">
.bsAddSiteDomain {
  height: 550px;
  .ipList {
    margin-top: 30px;
    margin-left: 88px;
    width: 654px;
    height: 78px;
    background: #eff6ff;
    display: flex;
    align-items: center;
    .title,
    .value {
      margin-left: 35px;
    }
  }
  .subBtn {
    width: 654px;
    margin-left: 88px;
    padding-top: 10px;
  }
  .zhinanTitle {
    width: 654px;
    margin-top: 30px;
    margin-left: 88px;
    text-align: center;
    position: relative;
    &::before,
    &::after {
      position: absolute;
      content: "";
      width: 252px;
      height: 1px;
      background: #dcdfe6;
      top: 10px;
    }
    &::before {
      left: 0;
    }
    &::after {
      right: 0;
    }
  }
  .caozuoIcons {
    width: 654px;
    margin-left: 88px;
    margin-top: 40px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .icon {
      width: 80px;
      height: 80px;
      background-size: contain;
      &.www {
        background: url("~@/assets/images/wwwIcon.png") no-repeat center;
      }
      &.dns {
        background: url("~@/assets/images/dnsIcon.png") no-repeat center;
      }
      &.ip {
        background: url("~@/assets/images/ipIcon.png") no-repeat center;
      }
      &.right {
        width: 31px;
        height: 26px;
        background: url("~@/assets/images/rightIcon.png") no-repeat center;
      }
    }
  }
  .shuoming {
    width: 654px;
    margin-top: 20px;
    margin-left: 88px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
