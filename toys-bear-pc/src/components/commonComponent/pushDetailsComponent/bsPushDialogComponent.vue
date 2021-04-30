<template>
  <div class="bsPushDialogComponent">
    <el-dialog
      title="推送"
      :visible.sync="pushDialog"
      width="40%"
      :before-close="closeDialog"
    >
      <div class="pushBox">
        <div class="titleDar">
          <p>主题</p>
          <p>消息内容</p>

          <p class="addTemplate" @click="addMsgTemplate">+新增消息模板</p>
        </div>
        <div class="msgList">
          <ul class="item" v-for="item in arr" :key="item.index">
            <li><el-radio v-model="radio" label=""></el-radio></li>
            <li>{{ item.zt }}</li>
            <li>{{ item.nr }}</li>
          </ul>
        </div>
      </div>
      <div class="magContent">
        <p>消息内容</p>
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="textarea"
          maxlength="100"
          size="medium"
          show-word-limit
        >
        </el-input>
      </div>
      <center style="margin-top: 10px">
        <template>
          <el-button type="primary">确定推送</el-button>
          <el-button style="margin-left: 30px" plain @click="closeDialog"
            >取消</el-button
          >
        </template>
      </center>
    </el-dialog>

    <!-- 新增编辑推送常用语dialog -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="addLangDialog"
      v-if="addLangDialog"
      width="50%"
    >
      <bsAddOfferFormulaLang
        :editRow="editRow"
        :isEdit="isEdit"
        @submit="submit"
        @close="close"
      />
    </el-dialog>
  </div>
</template>

<script>
import bsAddOfferFormulaLang from "@/components/bsComponents/bsPersonalManageComponent/bsAddOfferFormulaLang";
export default {
  props: {
    productList: {
      type: Array
    },
    pushDialog: {
      type: Boolean
    }
  },
  components: {
    bsAddOfferFormulaLang
  },
  data() {
    return {
      radio: "1",
      checkAll: false,
      textarea: "",
      isEdit: false,
      editRow: {},
      dialogTitle: "新增消息模板",
      addLangDialog: false,
      arr: [
        {
          zt: "报价专用，针对部分厂商的",
          nr: "这是一条非常有诚意的采购信息1"
        },
        {
          zt: "报价专用，针对部分厂商的",
          nr: "这是一条非常有诚意的采购信息1"
        },
        {
          zt: "报价专用，针对部分厂商的",
          nr: "这是一条非常有诚意的采购信息1"
        },
        {
          zt: "报价专用，针对部分厂商的",
          nr: "这是一条非常有诚意的采购信息1"
        },
        {
          zt: "报价专用，针对部分厂商的",
          nr: "这是一条非常有诚意的采购信息1"
        }
      ]
    };
  },
  methods: {
    //关闭弹框
    closeDialog() {
      this.$emit("handlePushDialog", false);
    },
    //新增消息模板
    addMsgTemplate() {
      this.isEdit = false;
      this.addLangDialog = true;
    },
    // 提交新增或编辑
    async submit(form) {
      const res = await this.$http.post("/api/PushSettings/Create", form);
      if (res.data.result.code === 200) {
        this.close();
        this.$common.handlerMsgState({
          msg: "新增成功",
          type: "success"
        });

        this.getPushSettingsPage();
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 关闭新增或编辑
    close() {
      this.addLangDialog = false;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsPushDialogComponent {
  @{deep} .pushBox {
    height: 270px;

    .titleDar {
      height: 50px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #333333;
      .addTemplate {
        color: #3368a9;
        cursor: pointer;
      }
    }
    .msgList {
      height: 200px;
      overflow-y: auto;
      .item {
        padding-right: 20px;
        border-top: 1px solid #dcdfe6;
        height: 50px;
        display: flex;
        align-items: center;
        li {
          margin-right: 20px;
        }
      }
    }
  }
  @{deep} .magContent {
    p {
      margin: 9px 0;
    }
    .el-textarea__inner {
      height: 120px;
    }
  }
}
</style>
