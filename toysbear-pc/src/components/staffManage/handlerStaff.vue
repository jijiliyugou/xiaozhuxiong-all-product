<template>
  <div>
    <el-form
      :model="addEmployeeForm"
      ref="addEmployeeRef"
      :rules="addEmployeeRules"
    >
      <el-form-item label="员工头像" label-width="100px" prop="userImage">
        <el-upload
          action="/api/File/InsertPic"
          list-type="picture-card"
          ref="upload"
          :auto-upload="false"
          :on-change="changeUpload"
          :on-remove="onRemove"
          :on-preview="handlePicEmployeePreview"
          :http-request="successUpload"
          :file-list="fileList"
          accept=".jpg,.jpeg,.png,.ico,.bmp,.JPG,.JPEG,.PNG,.ICO,.BMP"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>

      <div class="flexLayout">
        <el-form-item label="员工账号" label-width="100px" prop="phoneNumber">
          <el-input
            v-model="addEmployeeForm.phoneNumber"
            :disabled="isEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="100px" prop="linkman">
          <el-input v-model="addEmployeeForm.linkman"></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码" v-if="employeeMan.employeeTitle === '编辑员工'" label-width="100px">
              <el-input v-model="addEmployeeForm.newPassword"></el-input>
            </el-form-item>-->
        <!-- <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="addEmployeeForm.password"></el-input>
        </el-form-item> -->
      </div>
      <div class="flexLayout">
        <el-form-item label="性别" label-width="100px" prop="sex">
          <el-radio-group v-model="addEmployeeForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否主账号" label-width="100px" prop="isMain">
          <el-radio-group v-model="addEmployeeForm.isMain">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否激活" label-width="100px" prop="enabled">
          <el-radio-group v-model="addEmployeeForm.enabled">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item label="生日" label-width="100px">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="addEmployeeForm.birthday"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="备注" label-width="100px">
        <el-input type="textarea" v-model="addEmployeeForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <center>
      <el-button type="primary" @click="addEmployee">保存</el-button>
      <el-button type="danger" @click="close">取消</el-button>
    </center>
  </div>
</template>

<script>
export default {
  props: ["row", "isEdit"],
  data() {
    return {
      file: null,
      fileList: [],
      addEmployeeForm: {},
      addEmployeeRules: {
        userImage: [
          { required: true, message: "请选择员工头像", trigger: "change" }
        ],
        phoneNumber: [
          { required: true, message: "请输入员工账号", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机格式不正确",
            trigger: "blur"
          }
        ],
        linkman: [
          { required: true, message: "请输入员工昵称", trigger: "blur" },
          { min: 1, max: 20, message: "请输入1-20个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入员工密码", trigger: "blur" },
          { min: 6, max: 20, message: "最少输入6-20个字符", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择员工性别", trigger: "change" }],
        isMain: [
          { required: true, message: "请选择是否主账号", trigger: "change" }
        ],
        enabled: [
          { required: true, message: "请选择是否激活", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    // 删除图片事件
    onRemove() {
      this.file = null;
      for (let i = 0; i < this.fileList.length; i++) {
        this.fileList.splice(0, this.fileList.length);
      }
    },
    // 上传头像
    async successUpload() {
      const fd = new FormData();
      fd.append("BusinessType", "Logo");
      fd.append("file", this.file);
      if (!this.file) {
        return {
          data: {
            result: {
              code: 400,
              message: "请选择图片"
            }
          }
        };
      }
      return await this.$http.post("/api/File/InsertPic", fd);
    },
    // 取消新增员工
    close() {
      this.$emit("close");
    },
    // 新增员工
    async addEmployee() {
      if (this.file) {
        const imgRes = await this.successUpload();
        if (imgRes.data.result.code === 200 && imgRes.data.result.object[0]) {
          this.addEmployeeForm.userImage =
            imgRes.data.result.object[0].filePath;
        } else {
          this.$message.error(imgRes.data.result.message);
          return;
        }
      }
      this.$refs.addEmployeeRef.validate(async valid => {
        if (valid) {
          this.$emit("submit", this.addEmployeeForm);
        }
      });
    },
    // 员工管理预览头像
    handlePicEmployeePreview(file) {
      console.log(file.url);
    },
    // 选择头像
    changeUpload(file, fileList) {
      if (
        file.size >
        this.$store.state.globalJson.Json.NoticeRestrictions[5].itemCode
      ) {
        this.$message.error(
          "上传图片大小不能超过 " +
            this.$store.state.globalJson.Json.NoticeRestrictions[5].itemCode /
              1024 /
              1024 +
            "MB"
        );
        fileList.pop();
        return false;
      }
      this.file = file.raw;
      this.fileList = fileList;
      if (this.$_.size(fileList) > 1) {
        fileList.shift();
      }
    }
  },
  created() {},
  mounted() {
    this.addEmployeeForm = JSON.parse(JSON.stringify(this.row));
    if (this.isEdit && this.row.userImage)
      this.$set(this, "fileList", [{ url: this.addEmployeeForm.userImage }]);
  }
};
</script>
<style scoped lang="less"></style>
