<template>
  <div class="editProduct">
    <el-form
      :inline="true"
      class="addProductDialog"
      :model="addProductForm"
      :rules="addProductRules"
      size="medium"
      ref="addProductRulesForm"
      label-width="110px"
    >
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="addProductForm.name"></el-input>
      </el-form-item>
      <div class="contentBox">
        <el-form-item label="出厂货号：" prop="fa_no">
          <el-input v-model="addProductForm.fa_no"></el-input>
        </el-form-item>
        <el-form-item label="产品分类：" prop="categoryNumber">
          <el-cascader
            style="width:100%;"
            clearable
            filterable
            ref="addCateRef"
            :show-all-levels="false"
            v-model="addProductForm.categoryNumber"
            @change="changeCate"
            :options="categoryList"
            :props="{
              label: 'name',
              value: 'id',
              children: 'children',
              checkStrictly: true,
              emitPath: false
            }"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="包装：" prop="ch_pa">
          <el-select
            v-model="addProductForm.ch_pa"
            style="width:100%;"
            @change="changeCh_pa"
          >
            <el-option
              v-for="item in packingList"
              :key="item.value"
              :label="item.ch_pa"
              :value="item.ch_pa"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单价：" prop="price">
          <el-input
            v-model="addProductForm.price"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            clearable
          >
            <span slot="append">￥</span>
          </el-input>
        </el-form-item>
        <el-form-item label="内核/装箱量：">
          <div class="formItemSan">
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.in_en"
            ></el-input>
            <span class="itemX">/</span>
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.ou_lo"
            ></el-input>
            <span class="unit">PCS</span>
          </div>
        </el-form-item>
        <el-form-item label="外箱规格：">
          <div class="formItemSan">
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.ou_le"
            ></el-input>
            <span class="itemX">X</span>
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.ou_wi"
            ></el-input>
            <span class="itemX">X</span>
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.ou_hi"
            ></el-input>
            <span class="unit">CM</span>
          </div>
        </el-form-item>
        <el-form-item label="体积/材积：">
          <div class="formItemSan">
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.bulk_stere"
            ></el-input>
            <span class="itemX">/</span>
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.bulk_feet"
            ></el-input>
            <span class="unit">CBM/CUFT</span>
          </div>
        </el-form-item>
        <el-form-item label="样品规格：">
          <div class="formItemSan">
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.pr_le"
            ></el-input>
            <span class="itemX">X</span>
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.pr_wi"
            ></el-input>
            <span class="itemX">X</span>
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.pr_hi"
            ></el-input>
            <span class="unit">CM</span>
          </div>
        </el-form-item>
        <el-form-item label="毛重/净重：">
          <div class="formItemSan">
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.gr_we"
            ></el-input>
            <span class="itemX">/</span>
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.ne_we"
            ></el-input>
            <span class="unit">KG</span>
          </div>
        </el-form-item>
        <el-form-item label="包装规格：">
          <div class="formItemSan">
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.in_le"
            ></el-input>
            <span class="itemX">X</span>
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.in_wi"
            ></el-input>
            <span class="itemX">X</span>
            <el-input
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              v-model="addProductForm.in_hi"
            ></el-input>
            <span class="unit">CM</span>
          </div>
        </el-form-item>
      </div>
      <el-form-item class="productName" label="产品图片：">
        <div class="gonggaoImgList">
          <draggable
            class="syllable_ul"
            element="ul"
            filter=".forbid"
            :list="fileList"
            :options="{ group: 'id', animation: 150 }"
            :no-transition-on-drag="true"
            @change="changeGonggaoImg"
            @start="startGonggaoImg"
            @end="endGonggaoImg"
            :move="moveGonggaoImg"
          >
            <el-col :span="6" v-for="(value, i) in fileList" :key="i">
              <div
                class="imgItemBox"
                @mouseenter="itemImgNter(value.uid)"
                @mouseleave="itemImgLeave"
              >
                <el-image fit="contain" :src="value.url"></el-image>
                <div class="itemIcon" v-show="isHoverImgItem === value.uid">
                  <span>
                    <i
                      @click="opemViewer(i, fileList)"
                      class="el-icon-zoom-in"
                    />
                    <i @click="handleRemove(value)" class="el-icon-delete" />
                  </span>
                </div>
              </div>
            </el-col>
            <el-col class="imgsItemBox forbid" :span="6">
              <el-upload
                action="api"
                list-type="picture-card"
                ref="imgUpload"
                :on-exceed="onExceed"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="changeUpload"
                :on-preview="handlePictureCardPreview"
                :http-request="successUpload"
                :file-list="fileList"
                accept=".jpg,.jpeg,.png,.ico,.bmp,.JPG,.JPEG,.PNG,.ICO,.BMP"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-col>
          </draggable>
        </div>
        <span style="color:#EB1515;margin-top:5px;">(最大上传9张图片)</span>
      </el-form-item>
      <el-form-item class="productName" label="地区：">
        <el-select
          style="width:100%;"
          multiple
          v-model="addProductForm.areaRegion"
        >
          <el-option
            v-for="item in areaList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="productName" label="产品说明：">
        <el-input
          type="textarea"
          v-model="addProductForm.remark"
          :maxlength="globalJson.Json.UserRestrictions[0].itemCode"
        ></el-input>
        <p class="textareaLength">
          最多可输入
          <span>{{ globalJson.Json.UserRestrictions[0].itemCode }}</span
          >字，当前输入
          <span>
            {{
              addProductForm.remark ? addProductForm.remark.length : 0
            }} </span
          >，还可输入
          <span>{{
            globalJson.Json.UserRestrictions[0].itemCode -
              ((addProductForm.remark && addProductForm.remark.length) || 0)
          }}</span>
        </p>
      </el-form-item>
    </el-form>
    <center>
      <el-button type="primary" @click="sub()">确认</el-button>
      <el-button @click="$emit('close')">取消</el-button>
    </center>
  </div>
</template>

<script>
import { mapState } from "vuex";
import draggable from "vuedraggable";
export default {
  props: ["isEdit", "currentRow"],
  components: {
    draggable
  },
  data() {
    return {
      isHoverImgItem: null,
      areaList: [],
      packingList: [],
      fileList: [],
      addProductForm: {
        name: "",
        fa_no: null,
        categoryName: "",
        categoryNumber: "",
        supplierId: this.$store.state.currentComparnyId,
        supplierNumber: this.$store.state.userInfo.commparnyList[0]
          .companyNumber,
        price: null,
        ch_pa: null,
        pa_nu: null,
        pr_le: null,
        pr_wi: null,
        pr_hi: null,
        in_en: null,
        ou_lo: null,
        ou_le: null,
        ou_wi: null,
        ne_we: null,
        gr_we: null,
        bulk_feet: "",
        ou_hi: null,
        areaRegion: [],
        remark: "",
        cu_de: "￥",
        bulk_stere: null
      },
      categoryList: [],
      addProductRules: {
        name: [
          { required: true, message: "请输入产品名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur"
          }
        ],
        fa_no: [{ required: true, message: "请输入货号", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        ch_pa: [{ required: true, message: "请选择包装", trigger: "change" }],
        categoryNumber: [
          { required: true, message: "请选择类目", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    // 提交
    sub() {
      this.$refs.addProductRulesForm.validate(async valid => {
        if (valid) {
          let api = "/api/CreateBearProduct",
            msgText = "新增成功";
          if (this.isEdit === 2) {
            api = "/api/UpdateBearProduct";
            msgText = "编辑成功";
          }
          const res = await this.$http.post(api, this.addProductForm);
          const { code, item, msg } = res.data.result;
          if (code === 200) {
            this.$common.handlerMsgState({
              msg: msgText,
              type: "success"
            });
            const list = [];
            for (let i = 0; i < this.fileList.length; i++) {
              if (this.fileList[i].raw) {
                const result = await this.successUpload({
                  companyNumber: item.companyNumber,
                  index: i + 1,
                  supplierNumber: item.supplierNumber,
                  productNumber: item.productNumber,
                  file: this.fileList[i].raw
                });
                if (result.data.result.code === 200) {
                  list.push(result.data.result.object[0].filePath);
                } else {
                  this.$common.handlerMsgState({
                    msg: result.data.result.message,
                    type: "danger"
                  });
                }
              } else {
                list.push(this.fileList[i].url);
              }
            }
            this.editImgs(item.productNumber, list);
          } else {
            this.$common.handlerMsgState({
              msg: msg,
              type: "danger"
            });
          }
        }
      });
    },
    // 修改图片
    async editImgs(productNumber, list) {
      const res = await this.$http.post("/api/CreateBearProductImgAndVideo", {
        productNumber: productNumber,
        imgUrl: list
      });
      console.log(res);
      if (res.data.result.code !== 200) {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
      // 广播事件
      this.$emit("subEdit");
    },
    onExceed() {
      this.$common.handlerMsgState({
        msg: "最多只能选择9张图片",
        type: "danger"
      });
    },
    // evt里面有两个值，一个evt.added 和evt.removed  可以分别知道移动元素的ID和删除元素的ID
    changeGonggaoImg(evt) {
      console.log(evt, "change...");
      // const newVal = this.fileList[evt.moved.oldIndex]
      // this.fileList[evt.moved.oldIndex] = this.fileList[evt.moved.newIndex]
      // this.fileList[evt.moved.newIndex] = newVal
    },
    // start ,end ,add,update, sort, remove 得到的都差不多
    startGonggaoImg(evt) {
      this.drag = true;
      console.log(evt, "start...");
    },
    // 图片拖拽结束
    endGonggaoImg() {
      this.drag = true;
      // evt.item // 可以知道拖动的本身
      // evt.to    // 可以知道拖动的目标列表
      // evt.from  // 可以知道之前的列表
      // evt.oldIndex  // 可以知道拖动前的位置
      // evt.newIndex  // 可以知道拖动后的位置
    },
    // 移动公告图片
    moveGonggaoImg(evt, originalEvent) {
      this.isHoverImgItem = null;
      console.log(evt, "move");
      console.log(originalEvent); // 鼠标位置
    },
    // 鼠标移入发公告
    itemImgNter(id) {
      this.isHoverImgItem = id;
    },
    // 鼠标移出发公告
    itemImgLeave() {
      this.isHoverImgItem = null;
    },
    // 上传图片
    async successUpload({
      companyNumber,
      index,
      supplierNumber,
      productNumber,
      file
    }) {
      const fd = new FormData();
      fd.append("BusinessType", "product");
      fd.append("CompanyNumber", companyNumber);
      fd.append("Position", index);
      fd.append("SupplierNumber", supplierNumber);
      fd.append("ProductNumber", productNumber);
      fd.append("file", file);
      return await this.$http.post("/api/File/InsertPic", fd);
    },
    // 删除产品图片
    handleRemove(val) {
      this.fileList = this.fileList.filter(v => v.uid !== val.uid);
    },
    // 预览图片
    opemViewer(i, fileList) {
      this.$PreviewPic({
        zIndex: 9999, // 组件的zIndex值 默认为2000
        index: i, // 展示第几张图片 默认为0
        list: fileList.map(v => v.url), // 需要展示图片list
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
    // 选择产品图片
    changeUpload(file, fileList) {
      if (this.fileList.length > 8) {
        this.$common.handlerMsgState({
          msg: "图片已超过9张",
          type: "danger"
        });
        return false;
      }
      this.fileList = fileList;
      console.log(this.fileList);
    },
    // 预览产品图片
    handlePictureCardPreview(row) {
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
    // 选中包装
    changeCh_pa(val) {
      const current = this.packingList.find(v => v.ch_pa === val);
      if (current) {
        this.addProductForm.pa_nu = current.pa_nu;
      }
    },
    // 获取专区
    async getVipRegions() {
      const res = await this.$http.post("/api/getVipRegions", {});
      if (res.data.result.code === 200) {
        this.areaList =
          res.data.result.item.vipRegionItem &&
          res.data.result.item.vipRegionItem[0] &&
          res.data.result.item.vipRegionItem[0].items;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取包装方式list
    async getProductChpaList() {
      const res = await this.$http.post("/api/GetProductChpaList", {
        supplierNumber: this.$store.state.userInfo.commparnyList[0]
          .companyNumber
      });
      if (res.data.result.code === 200) {
        this.packingList = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 级联选择
    changeCate(id) {
      if (id) {
        this.addProductForm.categoryName = this.$refs.addCateRef.getCheckedNodes()[0].label;
        this.$refs.addCateRef.panel.activePath = [];
        this.$refs.addCateRef.panel.syncActivePath();
        this.$refs.addCateRef.dropDownVisible = false;
      }
    },
    // 递归分类
    traverseCateList(list) {
      if (list instanceof Array) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].children && list[i].children.length === 0) {
            delete list[i].children;
          } else {
            this.traverseCateList(list[i].children);
          }
        }
      }
    },
    // 获取产品分类列表
    async getProductCategoryList() {
      const res = await this.$http.post("/api/ProductCategoryList", {});
      if (res.data.result.code === 200) {
        this.traverseCateList(res.data.result.item);
        this.categoryList = res.data.result.item;
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
    this.getProductCategoryList();
    this.getProductChpaList();
    this.getVipRegions();
    if (this.isEdit == 2) {
      const json = {
        id: null,
        productNumber: null,
        pa_nu: null,
        videoAddress: null,
        videoId: null,
        name: "",
        fa_no: null,
        categoryName: "",
        categoryNumber: "",
        packName: null,
        packNumber: null,
        supplierId: null,
        supplierNumber: null,
        price: null,
        ch_pa: null,
        pr_le: null,
        pr_wi: null,
        pr_hi: null,
        in_en: null,
        ou_lo: null,
        ou_le: null,
        ou_wi: null,
        ne_we: null,
        gr_we: null,
        bulk_feet: "",
        ou_hi: null,
        areaRegion: [],
        remark: "",
        cu_de: "￥",
        bulk_stere: null
      };
      for (const key in json) {
        json[key] = this.currentRow[key];
      }
      json.pa_nu = json.packNumber;
      this.fileList = this.currentRow.imgUrlList.map((v, i) => {
        return { url: v, uid: Date.now() * i };
      });
      // json.imgUrl = this.currentRow.imgUrlList;
      this.$set(this, "addProductForm", json);
      console.log(this.addProductForm, this.currentRow);
    } else if (this.isEdit == 3) {
      for (const key in this.addProductForm) {
        this.$set(this.addProductForm, key, this.currentRow[key]);
      }
      this.fileList = this.currentRow.imgUrlList.map((v, i) => {
        return { url: v, uid: Date.now() * i };
      });
    }
  },
  computed: {
    ...mapState(["globalJson", "currentComparnyId", "userInfo"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.addProductDialog {
  @{deep} .el-form-item {
    width: 100%;
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
  .contentBox {
    display: flex;
    flex-wrap: wrap;
    @{deep} .el-form-item {
      width: 49%;
      margin-right: 0;
      box-sizing: border-box;
      &:nth-child(odd) {
        margin-right: 18px;
      }
    }
    .formItemSan {
      display: flex;
      width: 100%;
      .el-input {
        width: 60px;
      }
      .laiyuan {
        width: 100%;
      }
      .itemX {
        margin: 0 10px;
      }
      .unit {
        margin-left: 10px;
      }
    }
  }
}
.gonggaoVideoList {
  width: 100%;
  height: 150px;
}
.gonggaoImgList {
  &:after {
    content: " ";
    height: 0;
    clear: both;
    display: block;
    visibility: hidden;
  }
  .syllable_ul {
    .el-col {
      margin-top: 5px;
      width: 148px;
      margin-right: 10px;
      box-sizing: border-box;
      .imgItemBox {
        width: 148px;
        box-sizing: border-box;
        border: 1px solid #dcdfe6;
        height: 0;
        padding-bottom: 100%;
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        .itemIcon {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          span {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            i {
              color: #fff;
              margin: 0 5px;
              cursor: pointer;
            }
          }
        }
        .el-image {
          width: 100%;
          height: 100%;
          padding-bottom: 100%;
          position: relative;
          @{deep} .el-image__error {
            margin-top: 70px;
          }
          @{deep} img {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
          }
        }
      }
      @{deep} .el-image-viewer__wrapper {
        .el-image-viewer__mask {
          opacity: 0.1;
        }
      }
    }
  }
  .imgsItemBox {
    margin-top: 5px;
    // .imgsItem {
    //   width: 100%;
    //   height: 100%;
    //   float: left;
    //   @{deep} .el-upload {
    //     width: 100%;
    //     height: 123.98px;
    //     line-height: normal;
    //     position: relative;
    //     .el-icon-plus {
    //       position: absolute;
    //       left: 50%;
    //       top: 50%;
    //       transform: translate(-50%, -50%);
    //     }
    //   }
    // }
  }
}
</style>
