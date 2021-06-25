<template>
  <el-form
    ref="addDefaultFormRef"
    label-width="100px"
    :rules="defaultFormRules"
    :model="formData"
    class="bsAddOfferFormulaLang"
  >
    <el-form-item label="类型：" prop="title">
      <el-select
        size="medium"
        style="width: 200px;"
        clearable
        v-model="formData.title"
        placeholder="请选择"
      >
        <el-option
          v-for="item in messageExtType"
          :key="item.index"
          :label="item.title"
          :value="item.title"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="附带信息：">
      <template v-for="(item, index) in PushTitleList">
        <el-button
          v-if="index < 4"
          :key="item.id"
          size="small"
          style=" background: #f3f3f3;"
          @click="handleAddContent(item.itemCode)"
          >{{ item.itemCode }}</el-button
        >
      </template>
      <el-dropdown class="dropdownBox" trigger="click">
        <span class="el-dropdown-link">
          更多<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <template v-for="(item, index) in PushTitleList">
            <el-dropdown-item v-if="index >= 4" :key="item.index">
              <el-button
                style=" background: #f3f3f3;"
                size="small"
                @click="handleAddContent(item.itemCode)"
                >{{ item.itemCode }}</el-button
              >
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </el-form-item>
    <el-form-item label="内容：" prop="content">
      <el-input
        type="textarea"
        label="222323"
        :rows="5"
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
    },
    messageExtType: {
      type: Array
    }
  },
  data() {
    return {
      formData: {
        content: ""
      },
      PushTitleList: [],
      defaultFormRules: {
        title: [{ required: true, message: "请选择类型", trigger: "blur" }],
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
          for (let i = 0; i < this.messageExtType.length; i++) {
            if (this.messageExtType[i].title === this.formData.title) {
              this.formData.messageExt = this.messageExtType[i].messageExt;
            }
          }
          if (this.isEdit) {
            this.$emit("handleUpdate", this.formData);
          } else {
            this.$emit("submit", this.formData);
          }
        }
      });
    },
    // 关闭
    close() {
      this.$emit("close");
    },
    // 添加input值
    handleAddContent(val) {
      // this.formData.content += val;
      let str = this.formData.content + "[" + val + "]";
      this.$set(this.formData, "content", str);
    },
    // 获取系统配置
    async getSystemConfig() {
      const res = await this.$http.post("/api/ServiceConfigurationList", {
        basisParameters: "PushInformation"
      });
      if (res.data.result.code === 200) {
        this.PushTitleList = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  },
  created() {},
  mounted() {
    this.getSystemConfig();
    if (this.isEdit) {
      this.formData = JSON.parse(JSON.stringify(this.editRow));
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsAddOfferFormulaLang {
  .dropdownBox {
    line-height: 28px;
    padding: 0 6px;
    border: 1px solid #dcdfe6;
    background: #f3f3f3;
    margin-left: 20px;
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>
