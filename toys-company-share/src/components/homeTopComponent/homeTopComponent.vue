<template>
  <div class="wrap">
    <div class="topLauot">
      <div class="left">
        <el-image
          @click.native="tohome"
          fit="contain"
          :src="userInfo && userInfo.companyLogo"
        >
          <div slot="placeholder" class="image-slot">
            <img :src="require('@/assets/images/logo.png')" />
          </div>
          <div slot="error" class="image-slot">
            <img :src="require('@/assets/images/logo.png')" />
          </div>
        </el-image>
        <span class="leftTitleText">
          {{ currentLang.companyName }}
        </span>
      </div>
      <div class="right">
        <div class="myInput">
          <el-input
            prefix-icon="el-icon-search"
            :placeholder="homeLang.SearchPlaceholder"
            @keyup.enter.native="search"
            @keyup.native="handlerSearchForms"
            v-model="searchForm.keyword"
          >
            <template slot="suffix">
              <el-upload
                :auto-upload="false"
                ref="uploadRef"
                accept=".jpg,.jpeg,.png,.ico,.bmp,.JPG,.JPEG,.PNG,.ICO,.BMP"
                class="upload-demo"
                action="/api/WebsiteShare/SearchProductsByPicture"
                :headers="headers"
                :show-file-list="false"
                :on-change="openUpload"
              >
                <i class="el-input__icon el-icon-camera"></i>
              </el-upload>
            </template>
          </el-input>
          <el-button @click="search" class="searchBtn">{{
            homeLang.search
          }}</el-button>
        </div>
        <div class="langBox">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              {{ language.label }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="item"
                v-for="(item, index) in langList"
                :key="index"
                >{{ item.label }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 菜单栏 -->
    <div class="menuBox">
      <div class="menuWrap">
        <div class="left">
          <el-menu
            :default-active="$route.path"
            background-color="#3368A9"
            text-color="#fff"
            router
            active-text-color="#ffd04b"
            class="el-menu-demo"
            mode="horizontal"
          >
            <el-menu-item index="/index/home">{{ homeLang.home }}</el-menu-item>
            <el-menu-item
              index="/index/product"
              :route="{ path: '/index/product', query: { productType: 1 } }"
              >{{ homeLang.product }}</el-menu-item
            >
          </el-menu>
        </div>
        <div class="right">
          <!-- <div class="itemBox myCart">
            <text class="icon cartIcon"></text>
            {{ homeLang.ShoppingCart }}
          </div>
          <div class="itemBox myOrder">
            <text class="icon orderIcon"></text>
            {{ homeLang.MyOrder }}
          </div> -->
          <el-menu
            :default-active="$route.path"
            background-color="#3368A9"
            text-color="#fff"
            router
            active-text-color="#ffd04b"
            class="el-menu-demo"
            mode="horizontal"
          >
            <el-menu-item index="/index/shoppingCart">
              <template slot="title">
                <el-badge
                  type="warning"
                  :hidden="!shoppingList || shoppingList.length < 1"
                  :value="shoppingList && shoppingList.length"
                  class="myBadge"
                >
                  <i class="iconfont icon-gouwuche"></i>
                </el-badge>
                <span>{{ homeLang.ShoppingCart }}</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/index/myOrder">
              <template slot="title">
                <i class="iconfont icon-dingdan1"></i>
                <span>{{ homeLang.MyOrder }}</span>
              </template>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
    </div>
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog
      :title="homeLang.imageClipping"
      :visible.sync="isShowCropper"
      top="100px"
      destroy-on-close
      append-to-body
    >
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :canScale="option.canScale"
            :info="option.info"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
            :mode="option.mode"
          ></vueCropper>
        </div>
      </div>
      <center slot="footer" class="dialog-footer">
        <el-button type="info" @click="cropperCancel" style="color:#333;">
          {{ homeLang.cancel }}
        </el-button>
        <el-button
          type="primary"
          class="el-icon-refresh-left"
          @click="$refs.cropper.rotateLeft()"
        >
          {{ homeLang.leftRotation }}
        </el-button>
        <el-button
          type="primary"
          class="el-icon-refresh-right"
          @click="$refs.cropper.rotateRight()"
          >{{ homeLang.rightRotation }}</el-button
        >
        <el-button type="success" @click="onCubeImg" :loading="loading">
          {{ homeLang.confirm }}
        </el-button>
      </center>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { VueCropper } from "vue-cropper";
export default {
  name: "home-top-component",
  components: {
    VueCropper
  },
  computed: {
    homeLang() {
      return this.$t("lang.home");
    },
    ...mapGetters({
      shoppingList: "myShoppingList"
    }),
    ...mapState([
      "searchForm",
      "langs",
      "userInfo",
      "currentLang",
      "globalLang"
    ])
  },
  data() {
    return {
      language: {},
      langList: [
        {
          label: "简体中文",
          value: "zh-CN"
        },
        {
          label: "英文",
          value: "en"
        }
      ],
      headers: {
        Authorization: "bearer " + this.$store.state.userInfo.token
      },
      baseImg: null,
      loading: false,
      // 显示裁剪框
      isShowCropper: false,
      // 裁剪组件的基础配置option
      option: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        full: false, // 是否输出原图比例的截图
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "jpeg", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 1000, // 默认生成截图框宽度
        autoCropHeight: 500, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [2, 1], // 截图框的宽高比例
        canMove: true, // 图片是否可移动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      activeIndex2: "1"
    };
  },
  mounted() {
    this.language = this.langList.find(val => val.value == this.globalLang);
  },
  methods: {
    // 打开按图找样
    openUpload(file) {
      console.log(file);
      // /api/WebsiteShare/SearchProductsByPicture
      // 选取图片 限制图片大小
      const isLt5M = file.size / 1024 / 1024 < 3;
      if (!isLt5M) {
        this.$message.error(this.homeLang.theSizeOfTheUploaded);
        this.option.img = "";
        this.$refs.uploadRef.value = "";
        return false;
      }
      this.isShowCropper = true;
      this.fileinfo = file;
      // 选择成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        const f = window.URL.createObjectURL(file.raw);
        this.baseImg = this.option.img = f;
      });
    },
    // 确定裁剪图片
    onCubeImg() {
      this.loading = true;
      // 获取cropper的截图的base64 数据
      this.$refs.cropper.getCropBlob(async file => {
        const urlPreView = window.URL.createObjectURL(file);
        this.option.img = urlPreView;
        this.$store.commit("handlerSearchImgPreview", {
          img: urlPreView,
          baseImg: this.baseImg
        });
        // 上传
        try {
          const fd = new FormData();
          fd.append("file", file);
          const res = await this.$http.post(
            "/api/WebsiteShare/SearchProductsByPicture",
            fd
          );
          this.cropperCancel();
          if (res.data.result.code === 200) {
            this.$store.commit("imageSearch", res.data.result.data);
            console.log(res.data.result.data);
          } else {
            this.$store.commit("imageSearch", null);
            this.$message.error(res.data.result.message);
          }
          this.$router.push("/index/product?productType=1");
        } catch (error) {
          this.loading = false;
          this.cropperCancel();
        }
      });
    },
    // 取消裁剪
    cropperCancel() {
      this.$refs.cropper.clearCrop();
      this.isShowCropper = false;
      this.option.img = "";
      this.loading = false;
      this.$refs.uploadRef.value = "";
    },
    // 去首页
    tohome() {
      if (this.$route.path.includes("/index/home")) return false;
      else this.$router.push("/index/home");
    },
    // 修改搜索内容
    handlerSearchForms() {
      this.$store.commit("handlerSearchForm", this.searchForm);
    },
    // 搜索产品
    search() {
      this.$store.commit("imageSearch", null);
      this.$store.commit("handlerSearchImgPreview", null);
      if (this.$route.path.includes("/index/product"))
        this.$root.eventHub.$emit("resetProducts");
      else this.$router.push("/index/product?productType=1");
    },
    // 选择了语言
    handleCommand(lang) {
      this.language = lang;
      this.$i18n.locale = lang.value;
      this.$store.commit("setLang", lang.value);
      // 如果存在
      if (this.langs) {
        let currentLang = this.langs.find(
          val => val.language == this.globalLang
        );
        // 如果上次的语言存在  用上次的
        if (currentLang) {
          this.$store.commit("handleCurrentLang", currentLang);
        } else {
          currentLang = this.langs.find(val => val.language == "en");
          // 有英文用英文
          if (currentLang) {
            this.$store.commit("handleCurrentLang", currentLang);
          } else {
            // 没有英文用第一个
            this.$store.commit("handleCurrentLang", this.langs[0]);
          }
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
@deep: ~">>>";
.wrap {
  width: 100%;
  background-color: #fff;
  .topLauot {
    height: 130px;
    max-width: 1240px;
    margin: 0 auto;
    display: flex;
    .left,
    .right {
      height: 130px;
      flex: 1;
      display: flex;
      align-items: center;
      .el-image {
        cursor: pointer;
        width: 60px;
        height: 60px;
        img {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
      }
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .leftTitleText {
        max-width: 500px;
        font-size: 36px;
        font-weight: bold;
        color: #333333;
        margin-left: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .langBox {
        margin-left: 46px;
        min-width: 80px;
        .el-dropdown {
          cursor: pointer;
        }
      }
      .myInput {
        width: 437px;
        height: 44px;
        background: #ffffff;
        border: 2px solid #3368a9;
        border-radius: 4px;
        box-sizing: border-box;
        display: flex;
        ::v-deep .el-input {
          height: 40px;
          border: none;
          .el-input__inner {
            height: 40px;
            border: none;
          }
        }
        .el-input__icon {
          cursor: pointer;
          font-size: 20px;
          color: #3368a9;
        }
        .el-button {
          background-color: #3368a9;
          color: #fff;
          border-color: #3368a9;
          min-width: 90px;
          font-size: 16px;
          border-radius: 0px;
        }
      }
    }
  }
  .menuBox {
    width: 100%;
    height: 52px;
    background-color: #3368a9;
    color: #fff;
    font-size: 14px;
    .menuWrap {
      max-width: 1240px;
      height: 100%;
      margin: 0 auto;
      display: flex;
      .left,
      .right {
        flex: 1;
        display: flex;
        align-items: center;
        .el-menu {
          height: 50px;
          box-sizing: border-box;
          .el-menu-item {
            min-width: 180px;
            height: 50px;
            text-align: center;
            line-height: 50px;
            font-size: 18px;
          }
        }
      }
      .right {
        justify-content: flex-end;
        .el-menu {
          .el-menu-item {
            font-size: 14px !important;
          }
        }
        .el-menu-item i {
          color: #fff;
          margin-right: 10px;
        }
        .el-menu-item.is-active i {
          color: #fff;
          margin-right: 10px;
        }
        // .itemBox {
        //   width: 160px;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   cursor: pointer;
        //   .icon {
        //     width: 18px;
        //     height: 18px;
        //     margin-right: 10px;
        // &.cartIcon {
        //   background: url("~@/assets/images/cartIcon.png") center no-repeat;
        //   background-size: 100% 100%;
        // }
        // &.orderIcon {
        //   width: 14px;
        //   background: url("~@/assets/images/orderIcon.png") center no-repeat;
        //   background-size: 100% 100%;
        // }
        //   }
        // }
      }
    }
  }
}
@{deep} .el-menu-item {
  &.is-active {
    background-color: rgba(255, 255, 255, 0.2) !important;
    color: #fff !important;
    border-bottom-color: #5c86ba !important;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-bottom: 7px solid #fff;
      left: 50%;
      bottom: -3px;
      transform: translate(-50%, 0);
    }
  }
}
@{deep} .myBadge {
  .el-badge__content.is-fixed {
    top: 15px;
    right: 20px;
  }
}
// 截图
.cropper-content {
  .cropper {
    width: auto;
    height: 500px;
  }
}
</style>
