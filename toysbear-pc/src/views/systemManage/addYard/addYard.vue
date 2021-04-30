<template>
  <div style="position: relative">
    <el-form
      ref="yardFormRef"
      label-width="100px"
      :model="formDate"
      :rules="myRules"
    >
      <div style="display: flex;align-items:center;">
        <el-form-item prop="imgUrl">
          <div
            style="display: flex;align-items:center;position: relative;left: -65px;"
          >
            <span style="margin-right:10px;">货场图片</span>
            <el-upload
              action="/api/File/InsertPic"
              list-type="picture-card"
              ref="upload"
              :auto-upload="false"
              :on-change="changeUpload"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemoveImg"
              :http-request="successUpload"
              :file-list="editImages"
              accept=".jpg,.jpeg,.png,.ico,.bmp,.JPG,.JPEG,.PNG,.ICO,.BMP"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="货场类型" prop="yardType">
          <el-radio v-model="formDate.yardType" :label="0">货场</el-radio>
          <el-radio v-model="formDate.yardType" :label="1">货运站</el-radio>
        </el-form-item>
      </div>
      <el-form-item label="货场名称" prop="yardName">
        <el-input v-model="formDate.yardName"></el-input>
      </el-form-item>
      <div class="threeBox">
        <el-form-item label="联系人" prop="contactsMan">
          <el-input v-model.trim="formDate.contactsMan"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="telephone">
          <el-input v-model="formDate.telephone"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phoneNumber">
          <el-input v-model="formDate.phoneNumber"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formDate.remark"></el-input>
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <div class="attrsForItem">
          <el-input
            id="suggestId"
            name="address_detail"
            v-model="formDate.address"
            @keyup.enter.native="selectMapAttrs($event, false)"
          ></el-input>
          <div class="housingList" v-if="isShowAttrsList">
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
        </div>
      </el-form-item>
      <el-form-item>
        <div class="myMap">
          <BMapComponent
            @clickMap="clickMap"
            @attrItems="attrItems"
            ref="mapBaiduMap"
            :address="formDate.address"
          ></BMapComponent>
        </div>
      </el-form-item>
      <center>
        <el-button type="primary" @click="submit">确 认</el-button>
        <el-button @click="$emit('close')">取 消</el-button>
      </center>
    </el-form>
  </div>
</template>

<script>
import BMapComponent from "@/components/attrsMap.vue";
export default {
  components: {
    BMapComponent
  },
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {
      isShowAttrsList: false,
      attrsList: [],
      editImages: [],
      file: null,
      formDate: {},
      myRules: {
        yardName: [
          { required: true, message: "请输入货场名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 提交
    submit() {
      this.$refs.yardFormRef.validate(async valid => {
        if (valid) {
          if (this.file) {
            const imgRes = await this.successUpload();
            if (imgRes.data.result.code === 200) {
              this.formDate.imgUrl =
                imgRes.data.result.object[0] &&
                imgRes.data.result.object[0].filePath
                  ? imgRes.data.result.object[0].filePath
                  : this.formDate.imgUrl;
            } else {
              this.$message.error(imgRes.data.result.message);
            }
          }
          let api = "/api/CreateProductYard";
          let msg = "新增成功";
          if (this.options.isEdit) {
            msg = "编辑成功";
            api = "/api/UpdateProductYard";
          }
          for (const key in this.formDate) {
            if (
              this.formDate[key] === null ||
              this.formDate[key] === undefined ||
              this.formDate[key] === ""
            )
              delete this.formDate[key];
          }
          const res = await this.$http.post(api, this.formDate);
          if (res.data.result.code === 200) {
            this.$message.success(msg);
            this.$emit("success");
          } else {
            this.$message({
              customClass: "zZindex",
              message: res.data.result.msg,
              type: "error"
            });
          }
        }
      });
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
    // 删除图片
    handleRemoveImg(file) {
      if (file) {
        this.options.item.imgUrl = null;
        this.editImages = [];
        this.file = null;
      }
    },
    // 预览图片
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
    // 选择图片
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
      if (this.$_.size(fileList) > 1) {
        fileList.shift();
      }
    },
    selectMapAttrs(e) {
      switch (e.type) {
        case "click":
          this.formDate.address = e.target.innerText;
          this.$refs.mapBaiduMap.resetMap(this.formDate.address);
          this.$nextTick(() => {
            this.isShowAttrsList = false;
          });
          break;
        default:
          this.formDate.address = e.target.value;
          this.$refs.mapBaiduMap.resetMap(this.formDate.address);
          this.$nextTick(() => {
            this.isShowAttrsList = false;
          });
          break;
      }
    },
    // 获取只能搜索地址列表
    attrItems(attrs) {
      this.attrsList = attrs;
    },
    // 点击地图获取地址
    clickMap(attr) {
      this.formDate.address = attr || this.formDate.address;
      this.$nextTick(() => {
        this.isShowAttrsList = false;
      });
    }
  },
  created() {},
  mounted() {
    this.$set(this, "formDate", JSON.parse(JSON.stringify(this.options.item)));
    if (this.options.item.imgUrl)
      this.editImages = [{ url: this.options.item.imgUrl }];
    document.oncontextmenu = () => {
      this.isShowAttrsList = false;
      return false;
    };
    this.$nextTick(() => {
      this.attrsList = [];
      this.isShowAttrsList = false;
    });
  },
  watch: {
    "formDate.address"(val) {
      this.isShowAttrsList = !!val;
    }
  }
};
</script>
<style scoped lang="less">
@deep: "~>>>";
.threeBox {
  display: flex;
  justify-content: space-between;
  .el-upload {
    width: 100px;
    height: 100px;
  }
}
.attrsForItem {
  position: relative;
  .housingList {
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #ccc;
    max-height: 370px;
    overflow: auto;
    z-index: 1;
    div {
      cursor: pointer;
      padding: 0 15px;
      &:hover {
        background-color: #ecf5ff;
      }
    }
  }
}
.myMap {
  height: 150px;
}
@{deep} .zZindex {
  z-index: 9999 !important;
}
</style>
