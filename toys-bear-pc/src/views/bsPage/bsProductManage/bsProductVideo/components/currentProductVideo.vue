<template>
  <div class="currentProductVideo">
    <!-- 头部 -->
    <div class="top_title">
      <div class="titleLeft">
        <span>视频信息</span>
      </div>
      <div class="right"></div>
    </div>
    <!-- 视频 -->
    <el-form
      :model="formData"
      :rules="rules"
      @submit.native.prevent
      ref="ruleForm"
      label-width="100px"
    >
      <div class="videoInfoBox">
        <div class="left">
          <div class="nameBox">
            <el-form-item label="视频名称：" prop="name">
              <el-input
                type="text"
                v-model="formData.name"
                @change="inputChange"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="middle">
          <el-form-item prop="file">
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
        <div class="right"></div>
      </div>
    </el-form>
    <!-- 头部 -->
    <div class="top_title">
      <div class="titleLeft">
        <span>视频产品 ({{ totalCount }})</span>
      </div>
      <div class="right">
        <el-button
          @click="openAppVideo"
          type="primary"
          size="medium"
          icon="el-icon-plus"
        >
          绑定产品
        </el-button>
      </div>
    </div>
    <!-- 产品列表 -->
    <div class="product_box">
      <div
        class="product_item"
        @click="toProductDetails(item)"
        v-for="item in productList"
        :key="item.productNumber"
      >
        <div class="imgBox">
          <el-image
            style="width: 222px; height: 166px;"
            :src="item.img"
            :preview-src-list="item.imgUrlList"
            fit="contain"
          >
            <div
              slot="placeholder"
              class="image-slot"
              style="width: 222px; height: 166px; min-width: 222px"
            >
              <img
                style="width: 222px; height: 166px; min-width: 222px"
                :src="require('@/assets/images/imgError.png')"
              />
            </div>
            <div
              slot="error"
              class="image-slot"
              style="width: 222px; height: 166px; min-width: 222px"
            >
              <img
                style="width: 222px; height: 166px; min-width: 222px"
                :src="require('@/assets/images/imgError.png')"
              />
            </div>
          </el-image>
        </div>
        <div class="contentBox">
          <div class="name">
            {{ item.name }}
          </div>
          <div class="item item_fa_no">出厂货号：{{ item.fa_no }}</div>
          <div class="item item_bottom">
            <div class="item_left">包装：{{ item.packName }}</div>
            <div class="item_right">
              <el-button type="primary" size="mini" @click.stop="cancel(item)">
                取消
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="kong"></div>
      <div class="kong"></div>
      <div class="kong"></div>
      <div class="kong"></div>
    </div>
    <!-- 分页 -->
    <!-- 分页 -->
    <center style="padding:20px 0;">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40]"
        background
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </center>
  </div>
</template>

<script>
import { mapState } from "vuex";
import eventBus from "@/assets/js/common/eventBus";
export default {
  props: ["item"],
  data() {
    return {
      productList: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
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
    // 取消绑定
    async cancel(item) {
      const selectProduct = this.productList.filter(
        v => v.productNumber != item.productNumber
      );
      await this.updateManuProductVideo({
        list: selectProduct
      });
      this.getManuProductVideoDetailePage();
    },
    // 修改视频名
    inputChange() {
      if (!this.formData.name) {
        this.$common.handlerMsgState({
          msg: "请输入视频名称",
          type: "danger"
        });
        return false;
      }
      this.updateManuProductVideo({
        list: this.productList,
        name: this.formData.name
      });
    },
    // 修改视频信息
    async updateManuProductVideo({ list, name, url }) {
      name && (this.item.videoTitle = name);
      url && (this.item.videoAddress = url);
      const fd = JSON.parse(JSON.stringify(this.item));
      fd.productNumbersList = list.map(v => v.productNumber);
      const res = await this.$http.post("/api/UpdateManuProductVideo", fd);
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "修改成功",
          type: "success"
        });
        eventBus.$emit("resetVideoProduct");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 选择视频
    async changeImg(file) {
      this.formData.file = file;
      this.$refs.ruleForm.clearValidate(["file"]);
      const result = await this.successUpload();
      if (result.data.result.code === 200) {
        const url = result.data.result.object[0].filePath;
        this.updateManuProductVideo({
          list: this.productList,
          url: url
        });
      } else {
        this.$common.handlerMsgState({
          msg: result.data.result.message,
          type: "danger"
        });
      }
    },
    // 上传视频
    async successUpload() {
      const fd = new FormData();
      fd.append("CompanyNumber", this.userInfo.commparnyList[0].companyNumber);
      fd.append("TypeName", "company");
      fd.append("file", this.formData.file.raw);
      return await this.$http.post("/api/File/UploadProductFile", fd);
    },
    // 去产品详情页
    async toProductDetails(item) {
      const fd = {
        name: item.productNumber,
        linkUrl: this.$route.path,
        component: "bsProductDetails",
        refresh: true,
        label: item.fa_no || "产品详情",
        value: item
      };
      this.$store.commit("myAddTab", fd);
    },
    // 打开选择产品
    openAppVideo() {
      this.$emit("openSelectProduct");
    },
    // 获取产品列表
    async getManuProductVideoDetailePage() {
      const res = await this.$http.post("/api/GetManuProductVideoDetailePage", {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        VideoId: this.item.id
      });
      if (res.data.result.code === 200) {
        this.productList = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 生成临时url
    createFileUrl() {
      let url;
      if (this.formData.file.raw) {
        url = URL.createObjectURL(this.formData.file.raw);
      } else {
        url = this.formData.file;
      }
      return url;
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getManuProductVideoDetailePage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getManuProductVideoDetailePage();
    },
    // 删除视频
    clearVideo() {
      this.formData.file = null;
    }
  },
  computed: {
    ...mapState(["globalJson", "userInfo"])
  },
  mounted() {
    this.formData.file = this.item.videoAddress;
    this.formData.name = this.item.videoTitle;
    this.getManuProductVideoDetailePage();
  }
};
</script>
<style scoped lang="less">
.currentProductVideo {
  .top_title {
    height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e5e5;
    .titleLeft {
      flex: 1;
    }
    &::before {
      width: 4px;
      height: 14px;
      background-color: #3368a9;
      position: absolute;
      left: 0;
      top: 50%;
      content: "";
      transform: translate(0, -50%);
    }
  }
  .videoInfoBox {
    height: 150px;
    display: flex;
    margin-top: 20px;
    .nameBox {
      width: 520px;
    }
    .left {
      padding: 0 20px;
      white-space: nowrap; /*不换行*/
    }
    .left,
    .middle,
    .right {
      flex: 1;
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
            margin-top: 10px;
            margin-left: 20px;
            width: 320px;
            height: 160px;
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
  }
  .product_box {
    padding-top: 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .product_item {
      width: 254px;
      height: 278px;
      background: #ffffff;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      margin-bottom: 20px;
      cursor: pointer;
      .imgBox {
        width: 254px;
        height: 194px;
        .el-image {
          margin-top: 16px;
          margin-left: 16px;
        }
      }
      .contentBox {
        box-sizing: border-box;
        padding: 0 16px;
        .name {
          font-weight: 700;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
        }
        .item {
          margin-top: 6px;
          color: #666;
          &.item_bottom {
            display: flex;
            justify-content: space-between;
            .item_fa_no {
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
            }
            .item_left {
              width: 160px;
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
            }
            .item_right {
              position: relative;
              top: -2px;
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
            }
          }
        }
      }
    }
    .kong {
      width: 254px;
      min-width: 254px;
    }
  }
}
</style>
