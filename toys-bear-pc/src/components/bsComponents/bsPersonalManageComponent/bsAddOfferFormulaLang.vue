<template>
  <div class="bsAddOfferFormula">
    <el-form
      ref="addDefaultFormRef"
      label-width="100px"
      :rules="defaultFormRules"
      :model="formData"
      class="addDialogClass"
    >
      <el-form-item label="主题：" prop="title">
        <el-input
          placeholder="请输入主题"
          v-model="formData.title"
          clearable
          maxlength="20"
          size="medium"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item label="内容：" prop="content">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容..."
          v-model="formData.content"
          maxlength="100"
          size="medium"
          show-word-limit
        >
        </el-input>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input
          placeholder=""
          v-model.number="formData.sort"
          clearable
        ></el-input>
      </el-form-item>
      <center>
        <template>
          <el-button type="primary" @click="subDefaultForm">保 存</el-button>
          <el-button @click="close" style="margin-left: 20px;">取 消</el-button>
        </template>
      </center>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    editRow: {
      type: Object
    }
  },
  data() {
    return {
      formData: {
        zhuti: null,
        paixu: null,
        neirong: null
      },
      defaultFormRules: {
        title: [{ required: true, message: "请输入主题", trigger: "blur" }],
        sort: [
          //   { required: true, message: "请输入排序", trigger: "blur" },
          { type: "number", message: "必须为数字值" }
        ],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 提交
    subDefaultForm() {
      this.$refs.addDefaultFormRef.validate(async valid => {
        if (valid) {
          this.$emit("submit", this.formData);
        }
      });
    },
    // 关闭
    close() {
      this.$emit("close");
    }
  },
  created() {},
  mounted() {
    if (this.isEdit) {
      for (const key in this.editRow) {
        this.formData[key] = this.editRow[key];
      }
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsAddOfferFormula {
  .addDialogClass {
    .inputWrap {
      display: flex;
      justify-content: space-between;
      .left,
      .right {
        flex: 1;
        box-sizing: border-box;
        @{deep} .el-form-item__content {
          width: calc(100% - 100px);
          .el-select {
            width: 100%;
          }
        }
      }
      .left {
        padding-right: 10px;
      }
      .right {
        padding-left: 10px;
      }
    }
    .lessThanPrice {
      display: flex;
      justify-content: space-between;
      padding-top: 20px;
      border-top: 1px solid #dcdfe6;
      .left,
      .right {
        flex: 1;
        box-sizing: border-box;
      }
      .left {
        padding-right: 10px;
      }
      .right {
        padding-left: 10px;
      }
    }
  }
}
</style>
