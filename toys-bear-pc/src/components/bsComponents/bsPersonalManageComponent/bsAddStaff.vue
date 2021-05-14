<template>
  <div class="bsAddStaff">
    <el-form :model="addEmployeeForm" ref="addEmployeeRef" :rules="addRules">
      <el-form-item label="员工头像" label-width="100px" prop="userImage">
        <el-upload
          action="api"
          list-type="picture-card"
          ref="upload"
          :auto-upload="false"
          :on-change="changeUpload"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :http-request="successUpload"
          :file-list="editImages"
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
        <el-form-item label="密码" label-width="100px">
          <el-input
            v-model="addEmployeeForm.password"
            onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')"
          ></el-input>
        </el-form-item>
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
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="备注" label-width="100px">
        <el-input
          type="textarea"
          v-model="addEmployeeForm.remark"
          maxlength="50"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <center>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="$emit('close')">取消</el-button>
    </center>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    },
    companyId: {
      type: String
    },
    currentEditRow: {
      type: Object
    }
  },
  data() {
    return {
      file: null,
      editImages: [], // 编辑员工时的头像预览
      addEmployeeForm: {
        // 新增员工表单
        personnelNo: null,
        phoneNumber: "",
        password: "",
        sex: 1,
        isMain: false,
        enabled: true,
        remark: "",
        birthday: "",
        userImage: "",
        linkman: null,
        companyId: null,
        newPassword: null // 编辑时的密码
      },
      addRules: {
        userImage: [
          { required: true, message: "请选择员工头像", trigger: "change" }
        ],
        phoneNumber: [
          { required: true, message: "请输入员工账号", trigger: "blur" },
          {
            // pattern: /^1[2,3,4,5,6,7,8,9][0-9]{9}$/,
            pattern: /^1[3456789]\d{9}$/,
            // pattern: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\d|9\d)\d{8}$/,
            message: "手机格式不正确",
            trigger: "blur"
          }
        ],
        linkman: [
          { required: true, message: "请输入员工昵称", trigger: "blur" },
          { min: 1, max: 15, message: "请输入1-15个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入员工密码", trigger: "blur" },
          { min: 6, max: 20, message: "最少输入6到20个字符", trigger: "blur" }
          //   let reg= /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,20}$/
          //   密码必须是由4-20位字母+数字组合'
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
    // 选择头像
    changeUpload(file, fileList) {
      this.file = file.raw;
      this.editImages = fileList;
      if (fileList.length > 1) fileList.shift();
    },
    // 预览头像
    handlePictureCardPreview(file) {
      this.$PreviewPic({
        zIndex: 9999, // 组件的zIndex值 默认为2000
        index: 0, // 展示第几张图片 默认为0
        list: [file.url], // 需要展示图片list
        onClose: i => {
          // 关闭时的回调
          console.log(i);
        },
        onSelect: i => {
          // 点击某张图片的回调
          console.log(i);
        }
      });
    },
    // 删除图片事件
    handleRemove(file, fileList) {
      this.addEmployeeForm.userImage = "";
      this.editImages = fileList;
    },
    // 上传头像
    async successUpload() {
      const fd = new FormData();
      fd.append("BusinessType", "Head");
      fd.append("file", this.file);
      return await this.$http.post("/api/File/InsertPic", fd);
    },
    // 获取当前日期
    getCurrentDate() {
      var now = new Date();
      var year = now.getFullYear(); // 得到年份
      var month = now.getMonth(); // 得到月份
      var date = now.getDate(); // 得到日期
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      var defaultDate = year + "-" + month + "-" + date;
      this.$set(this.addEmployeeForm, "birthday", defaultDate);
    },
    // 提交添加员工
    async submit() {
      if (this.editImages.length != 0) {
        const imgRes = await this.successUpload();
        if (imgRes.data.result.code === 200) {
          this.addEmployeeForm.userImage =
            imgRes.data.result.object[0] &&
            imgRes.data.result.object[0].filePath
              ? imgRes.data.result.object[0].filePath
              : this.addEmployeeForm.userImage;
        } else {
          this.$messsage.error("头像上传失败");
          return false;
        }
        this.$refs.addEmployeeRef.validate(async valid => {
          if (valid) {
            this.addEmployeeForm.companyId = this.companyId;
            this.$emit("submit", this.addEmployeeForm);
          }
        });
      } else {
        this.$refs.addEmployeeRef.validateField("userImage");
      }
    }
  },
  created() {},
  mounted() {
    this.getCurrentDate();
    if (this.isEdit) {
      for (const key in this.currentEditRow) {
        this.addEmployeeForm[key] = this.currentEditRow[key];
      }
      if (this.currentEditRow.userImage)
        this.$set(this, "editImages", [{ url: this.currentEditRow.userImage }]);
    }
  }
};
</script>
<style scoped lang="less">
.bsAddStaff {
  .flexLayout {
    display: flex;
    justify-content: space-between;
  }
}
</style>
