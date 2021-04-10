<template>
  <div>
    <el-form
      ref="ClientForm"
      label-width="100px"
      :model="myEditClientForm"
      size="medium"
      :rules="addRules"
      class="clientDialogForm"
    >
      <el-form-item label="公司名称" prop="companyName">
        <el-input
          v-model="myEditClientForm.companyName"
          size="medium"
        ></el-input>
      </el-form-item>
      <el-form-item label="简称" prop="companyNickName">
        <el-input
          v-model="myEditClientForm.companyNickName"
          size="medium"
        ></el-input>
      </el-form-item>
      <div class="threeBox">
        <el-form-item label="公司logo" prop="companyLogo">
          <el-upload
            action="/api/File/InsertPic"
            list-type="picture-card"
            size="medium"
            ref="upload"
            :auto-upload="false"
            :on-change="changeUpload1"
            :on-preview="handlePictureCardPreview1"
            :on-remove="handleRemoveImg1"
            :http-request="successUpload1"
            :file-list="editImages1"
            accept=".jpg,.jpeg,.png,.ico,.bmp,.JPG,.JPEG,.PNG,.ICO,.BMP"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="公司背景" prop="bgImg">
          <el-upload
            size="medium"
            action="/api/File/InsertPic"
            list-type="picture-card"
            ref="upload2"
            :auto-upload="false"
            :on-change="changeUpload2"
            :on-preview="handlePictureCardPreview2"
            :on-remove="handleRemoveImg2"
            :http-request="successUpload2"
            :file-list="editImages2"
            accept=".jpg,.jpeg,.png,.ico,.bmp,.JPG,.JPEG,.PNG,.ICO,.BMP"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="营业执照" prop="bgImg">
          <el-upload
            action="/api/File/InsertPic"
            size="medium"
            list-type="picture-card"
            ref="upload2"
            :auto-upload="false"
            :on-change="changeUpload3"
            :on-preview="handlePictureCardPreview3"
            :on-remove="handleRemoveImg3"
            :http-request="successUpload3"
            :file-list="editImages3"
            accept=".jpg,.jpeg,.png,.ico,.bmp,.JPG,.JPEG,.PNG,.ICO,.BMP"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </div>
      <el-form-item>
        <div class="myMap">
          <BMapComponent
            @clickMap="clickMap"
            @attrItems="attrItems"
            ref="mapBaiduMap"
            :address="myEditClientForm.address"
          ></BMapComponent>
        </div>
      </el-form-item>
      <el-form-item label="联系地址" class="attrsForItem" prop="address">
        <el-input
          id="suggestId"
          size="medium"
          name="address_detail"
          @click.native="isShowAttrsList = false"
          @keyup.native="selectMapAttrs($event, false)"
          v-model="myEditClientForm.address"
        ></el-input>
        <div class="housingList" v-show="isShowAttrsList && attrsList.length">
          <div
            v-for="(item, index) in attrsList"
            :key="index"
            @click="
              selectMapAttrs(
                $event,
                item.city + item.district + item.street + item.business
              )
            "
          >
            {{ item.city + item.district + item.street + item.business }}
          </div>
        </div>
      </el-form-item>
      <div class="threeBox">
        <el-form-item label="手机" prop="phoneNumber">
          <el-input
            v-model.trim="myEditClientForm.phoneNumber"
            size="medium"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contactsMan">
          <el-input
            v-model="myEditClientForm.contactsMan"
            size="medium"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="e_mail">
          <el-input v-model="myEditClientForm.e_mail" size="medium"></el-input>
        </el-form-item>
      </div>
      <div class="threeBox">
        <el-form-item label="联系电话" prop="telephoneNumber">
          <el-input
            v-model="myEditClientForm.telephoneNumber"
            size="medium"
          ></el-input>
        </el-form-item>

        <el-form-item label="传真号码" prop="fax">
          <el-input v-model="myEditClientForm.fax" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="qq" prop="qq">
          <el-input v-model="myEditClientForm.qq" size="medium"></el-input>
        </el-form-item>
      </div>
      <div class="threeBox">
        <el-form-item label="msn" prop="msn">
          <el-input v-model="myEditClientForm.msn" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="skype" prop="skype">
          <el-input v-model="myEditClientForm.skype" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="公司KeyCode" prop="companyKeyCode">
          <el-input
            type="text"
            size="medium"
            v-model="myEditClientForm.companyKeyCode"
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="公司API" prop="api">
        <el-input
          type="text"
          v-model="myEditClientForm.companyAPI"
          size="medium"
        ></el-input>
      </el-form-item>
      <el-form-item label="公司介绍" prop="homepage">
        <el-input
          type="textarea"
          size="medium"
          rows="1"
          v-model="myEditClientForm.homepage"
          :maxlength="
            $store.state.globalJson.Json.CompanyRestrictions[1].itemCode
          "
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          size="medium"
          rows="1"
          v-model="myEditClientForm.remark"
          :maxlength="$store.state.globalJson.Json.UserRestrictions[0].itemCode"
        ></el-input>
        <p class="textareaLength">
          最多可输入
          <span>{{
            $store.state.globalJson.Json.UserRestrictions[0].itemCode
          }}</span
          >字，当前输入
          <span>{{
            myEditClientForm.remark && myEditClientForm.remark.length
          }}</span
          >，还可输入
          <span>{{
            $store.state.globalJson.Json.UserRestrictions[0].itemCode -
              (myEditClientForm.remark && myEditClientForm.remark.length)
          }}</span>
        </p>
      </el-form-item>
      <center>
        <el-button size="medium" type="primary" @click="submit">确认</el-button>
        <el-button size="medium" @click="close">取消</el-button>
      </center>
    </el-form>
  </div>
</template>

<script>
import BMapComponent from "@/components/commonComponent/attrsMap/attrsMap.vue";
export default {
  props: ["editClientForm"],
  components: {
    BMapComponent
  },
  data() {
    return {
      myEditClientForm: {},
      isShowAttrsList: false,
      attrsList: [],
      editImages1: [],
      editImages2: [],
      editImages3: [],
      addRules: {
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
          { min: 1, max: 99, message: "请输入 1-99 个字符", trigger: "blur" }
        ],
        companyType: [
          { required: true, message: "请选择公司类型", trigger: "change" }
        ],
        companyLogo: [
          {
            required: true,
            validator: (rule, value, cb) => {
              if (value) {
                cb();
              } else {
                cb(new Error("请选择公司logo"));
              }
            }
          }
        ],
        address: [
          { required: true, message: "请输入公司地址", trigger: "blur" },
          { min: 1, max: 100, message: "请输入 1-100 个字符", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请输入联系手机", trigger: "blur" },
          {
            validator: (rule, value, cb) => {
              if (/^\s*\d{11}\s*$/.test(value)) {
                cb();
              } else {
                cb(new Error("手机号格式错误"));
              }
            }
          }
        ]
      }
    };
  },
  methods: {
    // 搜索地址
    selectMapAttrs(e) {
      switch (e.type) {
        case "click":
          this.myEditClientForm.address = e.target.innerText;
          this.$refs.mapBaiduMap.resetMap(this.myEditClientForm.address);
          this.$nextTick(() => {
            this.isShowAttrsList = false;
          });
          break;
        default:
          this.myEditClientForm.address = e.target.value;
          this.$refs.mapBaiduMap.resetMap(this.myEditClientForm.address);
          this.$nextTick(() => {
            this.isShowAttrsList = false;
          });
          break;
      }
    },
    // 获取只能搜索地址列表
    attrItems(attrs) {
      this.attrsList = attrs;
      this.isShowAttrsList = true;
    },
    // 点击地图获取地址
    clickMap(attr) {
      this.myEditClientForm.address = attr || this.myEditClientForm.address;
      this.$nextTick(() => {
        this.isShowAttrsList = false;
      });
    },
    // 上传公司logo
    async successUpload1() {
      const fd = new FormData();
      fd.append("BusinessType", "Logo");
      fd.append("file", this.myEditClientForm.companyLogo.raw);
      return await this.$http.post("/api/File/InsertPic", fd);
    },
    // 上传公司背景
    async successUpload2() {
      const fd = new FormData();
      fd.append("BusinessType", "Logo");
      fd.append("file", this.myEditClientForm.bgImg.raw);
      return await this.$http.post("/api/File/InsertPic", fd);
    },
    // 上传公司营业执照
    async successUpload3() {
      const fd = new FormData();
      fd.append("BusinessType", "Logo");
      fd.append("file", this.myEditClientForm.businessLicense.raw);
      return await this.$http.post("/api/File/InsertPic", fd);
    },
    // 删除公司logo
    handleRemoveImg1() {
      this.editImages1 = [];
      this.myEditClientForm.companyLogo = null;
    },
    // 删除公司背景
    handleRemoveImg2() {
      this.editImages2 = [];
      this.myEditClientForm.bgImg = null;
    },
    // 删除公司营业执照
    handleRemoveImg3() {
      this.editImages3 = [];
      this.myEditClientForm.businessLicense = null;
    },
    // 点击预览公司logo
    handlePictureCardPreview1(row) {
      this.$PreviewPic({
        zIndex: 9999, // 组件的zIndex值 默认为2000
        index: 0, // 展示第几张图片 默认为0
        list: [row.url], // 需要展示图片list
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
    // 点击预览公司背景
    handlePictureCardPreview2(row) {
      this.$PreviewPic({
        zIndex: 9999, // 组件的zIndex值 默认为2000
        index: 0, // 展示第几张图片 默认为0
        list: [row.url], // 需要展示图片list
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
    // 点击预览营业执照
    handlePictureCardPreview3(row) {
      this.$PreviewPic({
        zIndex: 9999, // 组件的zIndex值 默认为2000
        index: 0, // 展示第几张图片 默认为0
        list: [row.url], // 需要展示图片list
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
    // 选择公司logo
    changeUpload1(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      this.myEditClientForm.companyLogo = file;
    },
    // 选择公司背景
    changeUpload2(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      this.myEditClientForm.bgImg = file;
    },
    // 选择营业执照
    changeUpload3(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      this.myEditClientForm.businessLicense = file;
    },
    submit() {
      this.$refs.ClientForm.validate(async valid => {
        if (valid) {
          if (this.myEditClientForm.companyLogo instanceof Object) {
            const companyLogo = await this.successUpload1();
            if (companyLogo.data.result.code === 200) {
              this.myEditClientForm.companyLogo =
                companyLogo.data.result.object[0].filePath;
            } else {
              this.$common.handlerMsgState({
                msg: companyLogo.data.result.message,
                type: "danger"
              });
              return false;
            }
          }
          if (this.myEditClientForm.bgImg instanceof Object) {
            const bgImg = await this.successUpload2();
            if (bgImg.data.result.code === 200) {
              this.myEditClientForm.bgImg =
                bgImg.data.result.object[0].filePath;
            } else {
              this.$common.handlerMsgState({
                msg: bgImg.data.result.message,
                type: "danger"
              });
            }
          }
          if (this.myEditClientForm.businessLicense instanceof Object) {
            const businessLicense = await this.successUpload3();
            if (businessLicense.data.result.code === 200) {
              this.myEditClientForm.businessLicense =
                businessLicense.data.result.object[0].filePath;
            } else {
              this.$common.handlerMsgState({
                msg: businessLicense.data.result.message,
                type: "danger"
              });
            }
          }
          this.$emit("submit", this.myEditClientForm);
        }
      });
    },
    close() {
      this.$emit("close");
    }
  },
  created() {},
  mounted() {
    this.$set(
      this,
      "myEditClientForm",
      JSON.parse(JSON.stringify(this.editClientForm))
    );
    // 是否有头像
    if (this.editClientForm.companyLogo) {
      this.$set(this, "editImages1", [
        { url: this.editClientForm.companyLogo }
      ]);
    }
    // 是否有背景图
    if (this.editClientForm.bgImg) {
      this.$set(this, "editImages2", [{ url: this.editClientForm.bgImg }]);
    }
    // 是否有营业执照
    if (this.editClientForm.businessLicense) {
      this.$set(this, "editImages3", [
        { url: this.editClientForm.businessLicense }
      ]);
    }
    this.isShowAttrsList = false;
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.myMap {
  height: 150px;
}
.el-form {
  .el-form-item {
    margin-bottom: 10px;
  }
  @{deep} .el-form-item__error {
    padding: 0;
    z-index: 999 !important;
    transform: scale(0.8);
  }
}
.threeBox {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  .el-upload {
    width: 100px;
    height: 100px;
  }
  .el-form-item {
    margin: 0;
  }
}
</style>
