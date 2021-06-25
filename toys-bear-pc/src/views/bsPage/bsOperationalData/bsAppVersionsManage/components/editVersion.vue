<template>
  <div>
    <el-form
      ref="addVersionForm"
      label-width="100px"
      :rules="addVersionRules"
      :model="versionFormData"
    >
      <div class="oneInput">
        <el-form-item label="平台：" prop="platForm">
          <el-select
            size="medium"
            v-model="versionFormData.platForm"
            placeholder="请选择"
          >
            <el-option
              v-for="item in $store.state.globalJson.Json.PlatForm"
              :key="item.id"
              :label="item.itemText"
              :value="item.itemCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="强制更新："
          prop="forceUpdate"
          v-if="versionFormData.platForm != 'pc'"
        >
          <el-select
            size="medium"
            v-model="versionFormData.forceUpdate"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, i) in [
                { itemText: '是', itemCode: true },
                { itemText: '否', itemCode: false }
              ]"
              :key="i"
              :label="item.itemText"
              :value="item.itemCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题：" prop="title" v-else>
          <el-input size="medium" v-model="versionFormData.title"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="版本号：" prop="vesion">
        <el-input
          size="medium"
          v-model="versionFormData.vesion"
          :maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item label="链接地址：" prop="fileUrl">
        <el-input
          size="medium"
          v-model="versionFormData.fileUrl"
          :disabled="versionFormData.versionFile != ''"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传文件：" v-if="versionFormData.platForm != 'pc'">
        <input
          type="file"
          ref="installFile"
          @change="changeUpload"
          :accept="
            $store.state.globalJson.Json.packageManage &&
              $store.state.globalJson.Json.packageManage[0].itemCode
          "
          :size="
            $store.state.globalJson.Json.packageManage &&
              $store.state.globalJson.Json.packageManage[1].itemCode
          "
        />
      </el-form-item>
      <el-form-item label="更新内容：" v-else>
        <el-input
          type="textarea"
          size="medium"
          :rows="3"
          placeholder="请输入内容"
          v-model="versionFormData.content"
        >
        </el-input>
      </el-form-item>
      <center class="btns">
        <el-button
          type="primary"
          size="medium"
          @click="handleEdit()"
          :disabled="isUpLoad"
        >
          <i :class="{ 'el-icon-loading': isUpLoad }"></i>
          {{ isUpLoad ? "文件上传中" : "提交" }}
        </el-button>
        <el-button type="danger" size="medium" @click="$emit('close')">
          取消
        </el-button>
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
    currentRow: {
      currentRow: Object
    }
  },
  data() {
    return {
      versionFormData: {
        platForm: null,
        forceUpdate: false,
        vesion: null,
        fileUrl: "",
        versionFile: "",
        title: "",
        content: ""
      },
      isUpLoad: false,
      addVersionRules: {
        platForm: [
          { required: true, message: "请选择平台", trigger: "change" }
        ],
        forceUpdate: [
          { required: true, message: "请选择是否强制更新", trigger: "change" }
        ],
        vesion: [
          { required: true, message: "请输入版本号", trigger: "blur" },
          { min: 1, max: 9999, message: "请输入版本号", trigger: "blur" }
        ],
        fileUrl: [
          { required: true, message: "请输入链接地址", trigger: "blur" },
          { min: 1, max: 9999, message: "请输入链接地址", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 编辑/新增
    async handleEdit() {
      this.$refs.addVersionForm.validate(async valid => {
        if (valid) {
          let api = "/api/CreateBearVesion",
            msg = "新增成功";
          if (this.isEdit) (api = "/api/UpdateBearVesion"), (msg = "编辑成功");
          const res = await this.$http.post(api, this.versionFormData);
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: msg,
              type: "success"
            });
            this.$emit("sub");
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        }
      });
    },
    // 选择文件
    async changeUpload(e) {
      this.isUpLoad = true;
      this.versionFormData.versionFile = e.target.files[0];
      const fd = new FormData();
      fd.append("BusinessType", "package");
      fd.append("file", this.versionFormData.versionFile);
      const res = await this.$http.post("/api/File/InsertPic", fd);
      if (res.data.result.code === 200) {
        this.versionFormData.fileUrl = res.data.result.object[0].filePath;
        this.$message.success("上传文件成功");
      } else {
        this.$message.success("上传文件失败，请检查网络");
      }
      this.isUpLoad = false;
      console.log(this.versionFormData.versionFile);
    }
  },
  mounted() {
    if (this.isEdit) {
      this.$set(
        this,
        "versionFormData",
        JSON.parse(JSON.stringify(this.currentRow))
      );
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.oneInput {
  width: 100%;
  display: flex;
  @{deep} .el-form-item {
    width: 50%;
    .el-select {
      width: 100%;
    }
  }
}
.btns {
  .el-button {
    width: 120px;
  }
}
</style>
