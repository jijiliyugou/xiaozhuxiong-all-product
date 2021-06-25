<template>
  <div class="dialogComponents">
    <el-form
      :model="formData"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <div class="box">
        <el-form-item label="视频名称：" prop="name">
          <el-input type="text" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="产品视频：" prop="file">
          <div class="uploadBox">
            <div class="kuang">
              <i class="uploadIcon el-icon-plus" v-if="!formData.file"></i>
              <div class="videoBox" v-else>
                <div class="iconClose" @click.stop="clearVideo">
                  <i class="el-icon-error"></i>
                </div>
                <video
                  class="video-js vjs-default-skin vjs-big-play-centered"
                  controls
                  :lazy-src="createFileUrl()"
                  style="object-fit: contain; width: 100%;height: 100%;"
                >
                  <source :src="createFileUrl()" type="video/mp4" />
                </video>
              </div>
            </div>
            <el-upload
              v-show="!formData.file"
              class="upload-demo"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="changeImg"
              :accept="globalJson.Json.MessageRestriction[2].itemCode"
              drag
              action="https"
            >
            </el-upload>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <center class="btnBox">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="$emit('close')">取消</el-button>
    </center>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      formData: {
        file: null,
        name: null
      },
      rules: {
        name: [{ required: true, message: "请输入视频名称", trigger: "blur" }],
        file: [{ required: true, message: "请选择视频", trigger: "change" }]
      }
    };
  },
  methods: {
    // 上传视频
    async successUpload() {
      const fd = new FormData();
      fd.append("CompanyNumber", this.userInfo.commparnyList[0].companyNumber);
      fd.append("TypeName", "company");
      fd.append("file", this.formData.file.raw);
      return await this.$http.post("/api/File/UploadProductFile", fd);
    },
    // 提交事件
    async submitEvent(url) {
      const res = await this.$http.post("/api/CreateManuProductVideo", {
        productNumbersList: [],
        videoTitle: this.formData.name,
        videoAddress: url
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "新增成功",
          type: "success"
        });
        this.$emit("sub");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 提交产品视频
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const result = await this.successUpload();
          console.log(result, "上传视频返回");
          if (result.data.result.code === 200) {
            const url = result.data.result.object[0].filePath;
            this.submitEvent(url);
          } else {
            this.$common.handlerMsgState({
              msg: result.data.result.message,
              type: "danger"
            });
          }
        }
      });
    },
    // 选择视频
    changeImg(file) {
      this.formData.file = file;
      this.$refs.ruleForm.clearValidate(["file"]);
    },
    clearVideo() {
      this.formData.file = null;
    },
    // 生成临时url
    createFileUrl() {
      const url = URL.createObjectURL(this.formData.file.raw);
      return url;
    }
  },
  mounted() {},
  computed: {
    ...mapState(["globalJson", "userInfo"])
  }
};
</script>
<style scoped lang="less">
.dialogComponents {
  .box {
    margin-top: 20px;
    .uploadBox {
      position: relative;
      height: 190px;
      .upload-demo {
        opacity: 0;
      }
      .kuang {
        width: 360px;
        height: 180px;
        border: 1px dashed #d9d9d9;
        position: absolute;
        border-radius: 5px;
        left: 0;
        top: 0;
        .videoBox {
          margin-top: 30px;
          margin-left: 20px;
          width: 320px;
          height: 120px;
          position: relative;
          .video-js {
            position: absolute;
            left: 0;
            top: 0;
          }
          .iconClose {
            position: absolute;
            right: -15px;
            top: -20px;
            font-size: 20px;
            cursor: pointer;
          }
        }
        .uploadIcon {
          font-size: 30px;
          color: #999;
          margin-top: 75px;
          margin-left: 165px;
          cursor: pointer;
        }
      }
    }
  }
  .btnBox {
    .el-button {
      width: 120px;
    }
  }
}
</style>
