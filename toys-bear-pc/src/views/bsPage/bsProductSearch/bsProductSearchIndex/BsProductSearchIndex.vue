<template>
  <div class="productSearch">
    <template v-if="!imageSearchValue">
      <div class="advancedSearchBox">
        <bsProductSearch />
        <div class="standardScreening">
          <span class="myLabel">标准筛选:</span>
          <el-checkbox
            v-model="synthesis"
            @change="handleSynthesis"
            style="margin-right: 30px;"
          >
            综合
          </el-checkbox>
          <el-checkbox
            @change="handleCheckedScreensChange"
            v-model="searchForm.fa_no"
          >
            货号
          </el-checkbox>
          <el-checkbox
            @change="handleCheckedScreensChange"
            v-model="searchForm.name"
          >
            名称
          </el-checkbox>
          <el-checkbox
            @change="handleCheckedScreensChange"
            v-model="searchForm.number"
          >
            编号
          </el-checkbox>
          <el-checkbox
            @change="handleCheckedScreensChange"
            v-model="searchForm.packName"
          >
            包装
          </el-checkbox>
        </div>
        <div class="productClass">
          <span class="myLabel">产品分类:</span>
          <div :class="{ tags: true, showOneCate: isOneDownCate }">
            <div
              @click="oneTagEvent(null)"
              :class="{ itemTag: true, isActive: oneCurrentTag === null }"
            >
              全部
            </div>
            <div
              @click="oneTagEvent(item)"
              :class="{
                itemTag: true,
                isActive: oneCurrentTag && oneCurrentTag.id === item.id
              }"
              v-for="item in categoryList"
              :key="item.id"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="topLine">
            <div class="develop" @click="handlerOneCateLabel">
              <span class="zhankai">{{ isOneDownCate ? "展开" : "隐藏" }}</span>
              <i v-show="isOneDownCate" class="el-icon-arrow-down"></i>
              <i v-show="!isOneDownCate" class="el-icon-arrow-up"></i>
            </div>
          </div>
        </div>
        <div class="twoLevelClass" v-if="oneCurrentTag">
          <span class="myLabel">二级分类:</span>
          <div :class="{ tags: true, showTwoCate: isTwoDownCate }">
            <div
              @click="twoTagEvent(null)"
              :class="{ itemTag: true, isActive: currentTwoTag === null }"
            >
              全部
            </div>
            <div
              @click="twoTagEvent(item.id)"
              :class="{ itemTag: true, isActive: currentTwoTag === item.id }"
              v-for="item in oneCurrentTag.children"
              :key="item.id"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="topLine">
            <div class="develop" @click="handlerTwoCateLabel">
              <span class="zhankai">{{ isTwoDownCate ? "展开" : "隐藏" }}</span>
              <i v-show="isTwoDownCate" class="el-icon-arrow-down"></i>
              <i v-show="!isTwoDownCate" class="el-icon-arrow-up"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="productsWrap">
        <div class="screenBox">
          <div class="left">
            <div class="screenItem" @click="sortTypeEvent(null)">
              <span :class="{ screenLabel: true, active: sortOrder === null }"
                >综合</span
              >
            </div>
            <div class="screenItem" @click="sortTypeEvent(3)">
              <span :class="{ screenLabel: true, active: sortOrder === 3 }"
                >热度</span
              >
              <i v-show="isRedu === null" class="jiantou xiajiantouIcon"></i>
              <i v-show="isRedu === 1" class="jiantou xiaActiveIcon"></i>
              <i v-show="isRedu === 2" class="jiantou shangActiveIcon"></i>
            </div>
            <div class="screenItem" @click="sortTypeEvent(1)">
              <span :class="{ screenLabel: true, active: sortOrder === 1 }"
                >单价</span
              >
              <i v-show="isPrice === null" class="jiantou xiajiantouIcon"></i>
              <i v-show="isPrice === 1" class="jiantou xiaActiveIcon"></i>
              <i v-show="isPrice === 2" class="jiantou shangActiveIcon"></i>
            </div>
            <div class="screenItem" @click="sortTypeEvent(2)">
              <span :class="{ screenLabel: true, active: sortOrder === 2 }">
                时间
              </span>
              <i v-show="isTime === null" class="jiantou xiajiantouIcon"></i>
              <i v-show="isTime === 1" class="jiantou xiaActiveIcon"></i>
              <i v-show="isTime === 2" class="jiantou shangActiveIcon"></i>
            </div>
            <div class="screenItem dateTime">
              <span class="screenLabel">上架时间</span>
              <el-date-picker
                size="mini"
                value-format="yyyy-MM-ddTHH:mm:ss"
                v-model="searchForm.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </div>
            <div class="screenItem priceUnit">
              <span class="screenLabel">价格区间</span>
              <div class="intervalPrice">
                <el-input
                  size="mini"
                  v-model="searchForm.minPrice"
                  placeholder="最低"
                ></el-input>
                <span class="line">-</span>
                <el-input
                  size="mini"
                  v-model="searchForm.maxPrice"
                  placeholder="最高"
                ></el-input>
              </div>
            </div>
            <el-button
              @click="getProductList"
              type="primary"
              style="margin-left: 10px;"
              size="mini"
            >
              确定
            </el-button>
          </div>
          <div class="right">
            <div
              :class="{ grid: true, active: isGrid === 'bsGridComponent' }"
              @click="handerIsGrid('bsGridComponent')"
            ></div>
            <div
              :class="{ column: true, active: isGrid === 'bsColumnComponent' }"
              @click="handerIsGrid('bsColumnComponent')"
            ></div>
            <div class="line"></div>
            <div class="totalCount">
              <span class="totalCountText">{{ totalCount }}</span>
              <span>条数据</span>
            </div>
            <div class="myMinPagination">
              <div @click="firstEvent" class="first el-icon-arrow-left"></div>
              <div class="count">
                <span class="pageIndex">{{ currentPage }}</span>
                <span>/</span>
                <span>{{ Math.ceil(totalCount / pageSize) }}</span>
              </div>
              <div @click="nextEvent" class="next el-icon-arrow-right"></div>
            </div>
          </div>
        </div>
        <div class="productListBox">
          <!-- 产品列表 -->
          <component :is="isGrid" :productList="productList"></component>
          <!-- 分页 -->
          <center class="myPagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[12, 24, 36, 48]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount"
            >
            </el-pagination>
          </center>
        </div>
      </div>
    </template>
    <!-- 图搜结果 -->
    <template v-if="imageSearchValue">
      <div class="picSearchBox">
        <div class="searchInput">
          <span class="label">产品搜索:</span>
          <el-input
            size="medium"
            @keyup.native.enter="textSearchProducts"
            style="width: 340px; margin: 0 15px;"
            placeholder="请输入关键词"
            v-model="searchForm.keyword"
            clearable
          >
            <template slot="prefix">
              <el-upload
                :auto-upload="false"
                ref="uploadRef"
                accept=".jpg,.jpeg,.png,.ico,.bmp,.JPG,.JPEG,.PNG,.ICO,.BMP"
                class="upload-demo"
                action="/api/WebsiteShare/SearchProductsByPicture"
                :show-file-list="false"
                :on-change="uploadPic"
              >
                <i
                  style="font-size: 20px;"
                  class="el-input__icon el-icon-camera-solid"
                ></i>
              </el-upload>
            </template>
          </el-input>
          <el-button
            size="medium"
            @click="textSearchProducts"
            type="primary"
            icon="el-icon-search"
            >搜 索</el-button
          >
        </div>
        <div class="resultTitle">
          搜索图片
        </div>
        <div class="resultBox">
          <div class="left">
            <p class="totalCountBox">
              <span class="title">搜索产品</span>
              <span class="total">
                <span class="title">总记录：</span>
                <span class="text"> {{ totalCount }} </span>条
              </span>
            </p>
          </div>
          <div class="middle">
            <!-- {{ searchImgPreview }} -->
            <div class="preview" v-if="searchImgPreview">
              <div class="imgBox">
                <div class="miniImg">
                  <el-image
                    @click.native.stop.prevent="
                      openCubeImg(searchImgPreview.img)
                    "
                    :src="searchImgPreview.img"
                    fit="contain"
                  ></el-image>
                </div>
                <el-image
                  :src="searchImgPreview.baseImg"
                  @click.native.stop.prevent="
                    openCubeImg(searchImgPreview.baseImg)
                  "
                  fit="contain"
                ></el-image>
              </div>
            </div>
          </div>
          <div class="right"></div>
        </div>
        <div class="picProductListBox">
          <!-- 产品列表 -->
          <component :is="isGrid" :productList="productList"></component>
        </div>
      </div>
    </template>
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog title="图片剪裁" :visible.sync="isShowCropper" destroy-on-close>
      <div class="cropperWrap">
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
          <!-- <el-button type="info" @click="cropperCancel">取 消</el-button>
        <el-button
          type="primary"
          class="el-icon-refresh-left"
          @click="$refs.cropper.rotateLeft()"
          >左 旋 转</el-button
        >
        <el-button
          type="primary"
          class="el-icon-refresh-right"
          @click="$refs.cropper.rotateRight()"
          >右 旋 转</el-button
        > -->
          <el-button
            class="submitBtn"
            type="primary"
            @click="onCubeImg"
            :loading="loading"
            >确认</el-button
          >
        </center>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import bsProductSearch from "@/components/bsComponents/bsProductSearchComponent/bsProductSearch";
import bsColumnComponent from "@/components/bsComponents/bsProductSearchComponent/bsColumnComponent";
import bsGridComponent from "@/components/bsComponents/bsProductSearchComponent/bsGridComponent";
import eventBus from "@/assets/js/common/eventBus";
import { mapGetters, mapState } from "vuex";
import { VueCropper } from "vue-cropper";
export default {
  name: "bsProductSearchIndex",
  components: {
    bsProductSearch,
    bsColumnComponent,
    bsGridComponent,
    VueCropper
  },
  data() {
    return {
      loading: false,
      baseImg: null,
      fileinfo: null,
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
      oneCurrentTag: null,
      cateChildren: [],
      categoryList: [],
      isPrice: null,
      isTime: null,
      isRedu: null,
      sortOrder: null,
      sortType: null,
      synthesis: true,
      productList: [],
      isGrid: "bsGridComponent",
      currentPage: 1,
      pageSize: 12,
      totalCount: 0,
      searchForm: {
        keyword: "",
        minPrice: "",
        maxPrice: "",
        categoryNumber: null,
        time: [],
        fa_no: 0,
        number: 0,
        name: 0,
        packName: 0
      },
      currentTwoTag: null,
      isOneDownCate: true,
      isTwoDownCate: true
    };
  },
  methods: {
    // 重新切图
    openCubeImg(img) {
      this.isShowCropper = true;
      this.option.img = img;
    },
    // 图搜
    uploadPic(file) {
      const isLt5M = file.size / 1024 / 1024 < 3;
      if (!isLt5M) {
        this.$common.handlerMsgState({
          msg: "上传文件大小不能超过 3MB!",
          type: "danger"
        });
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
        this.dialogVisible = true;
      });
    },
    // 文字搜
    textSearchProducts() {
      this.currentPage = 1;
      this.getProductList();
    },
    // 确定裁剪图片
    onCubeImg() {
      this.isGrid = "bsColumnComponent";
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
          const companynumber =
            this.$store.state.userInfo.commparnyList[0] &&
            this.$store.state.userInfo.commparnyList[0].companyNumber;
          const fd = new FormData();
          fd.append("companynumber", companynumber);
          fd.append("file", file);
          const res = await this.$http.post("/api/File/SearchPicture", fd);
          if (res.data.result.code === 200) {
            this.$store.commit("searchValues", res.data.result.object);
            this.productList = res.data.result.object;
            this.totalCount = res.data.result.object.length;
            this.cropperCancel();
          } else {
            this.$store.commit("searchValues", []);
            this.cropperCancel();
            this.$common.handlerMsgState({
              msg: res.data.result.message,
              type: "danger"
            });
          }
        } catch (error) {
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
    },
    // 过滤类型
    sortTypeEvent(type) {
      this.sortOrder = type;
      switch (type) {
        case 1:
          this.sortType = this.isPrice =
            this.isPrice === null ? 1 : this.isPrice === 1 ? 2 : null;
          this.sortType = null;
          this.isTime = null;
          this.isRedu = null;
          this.sortType = this.isPrice;
          this.sortType === null && (this.sortOrder = null);
          break;
        case 2:
          this.isTime = this.isTime === null ? 1 : this.isTime === 1 ? 2 : null;
          this.sortType = null;
          this.isPrice = null;
          this.isRedu = null;
          this.sortType = this.isTime;
          this.sortType === null && (this.sortOrder = null);
          break;
        case 3:
          this.isRedu = this.isRedu === null ? 1 : this.isRedu === 1 ? 2 : null;
          this.sortType = null;
          this.isPrice = null;
          this.isTime = null;
          this.sortType = this.isRedu;
          this.sortType === null && (this.sortOrder = null);
          break;
        default:
          this.isPrice = null;
          this.isTime = null;
          this.isRedu = null;
          this.sortType = null;
          this.sortOrder = null;
          break;
      }
      this.getProductList();
    },
    // 获取产品列表请求
    async getProductList() {
      this.$store.commit("searchValues", null);
      const fd = {
        name: this.searchForm.keyword,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        categoryNumber: this.searchForm.categoryNumber,
        minPrice: this.searchForm.minPrice,
        maxPrice: this.searchForm.maxPrice,
        startTime: this.searchForm.time.length ? this.searchForm.time[0] : null,
        endTime: this.searchForm.time.length ? this.searchForm.time[1] : null,
        precisionSearch: JSON.stringify({
          fa_no: this.searchForm.fa_no ? 1 : 0,
          number: this.searchForm.number ? 1 : 0,
          name: this.searchForm.name ? 1 : 0,
          packName: this.searchForm.packName ? 1 : 0
        }),
        sortOrder: this.sortOrder,
        sortType: this.sortType
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "")
          delete fd[key];
      }
      const res = await this.$http.post("/api/SearchBearProductPage", fd);
      const { code, item, msg } = res.data.result;
      if (code === 200) {
        if (this.shoppingList) {
          for (let i = 0; i < item.items.length; i++) {
            for (let j = 0; j < this.shoppingList.length; j++) {
              if (
                item.items[i].productNumber ===
                this.shoppingList[j].productNumber
              )
                item.items[i].isShopping = true;
            }
          }
        }
        this.productList = item.items;
        this.totalCount = item.totalCount;
      } else {
        this.totalCount = 0;
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
      }
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getProductList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      eventBus.$emit("toTop");
      this.currentPage = page;
      this.getProductList();
    },
    // 获取产品类目列表
    async getProductCategoryList() {
      const res = await this.$http.post("/api/ProductCategoryList", {});
      if (res.data.result.code === 200) {
        this.categoryList = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 选择综合
    handleSynthesis(flag) {
      if (flag) {
        this.searchForm.fa_no = 0;
        this.searchForm.number = 0;
        this.searchForm.name = 0;
        this.searchForm.packName = 0;
      }
    },
    // 选择筛选
    handleCheckedScreensChange(flag) {
      if (flag) {
        this.synthesis = null;
      }
    },
    // 切换产品列表样式
    handerIsGrid(type) {
      this.isGrid = type;
    },
    // 上一页
    firstEvent() {
      if (this.currentPage === 1) {
        this.$common.handlerMsgState({
          msg: "已经是第一页了",
          type: "danger"
        });
        return false;
      }
      this.currentPage--;
      this.getProductList();
    },
    // 下一页
    nextEvent() {
      const totalPage = Math.ceil(this.totalCount / this.pageSize);
      if (totalPage <= this.currentPage) {
        this.$common.handlerMsgState({
          msg: "已经是第最后一页了",
          type: "danger"
        });
        return false;
      }
      this.currentPage++;
      this.getProductList();
    },
    // 一级分类点击事件
    oneTagEvent(item) {
      this.currentTwoTag = null;
      this.oneCurrentTag = item;
      this.cateChildren = item ? item.children : [];
      this.searchForm.categoryNumber = item ? item.id : item;
    },
    // 二级分类点击事件
    twoTagEvent(id) {
      this.currentTwoTag = id;
      this.searchForm.categoryNumber = id || this.oneCurrentTag.id;
    },
    // 展开一级分类
    handlerOneCateLabel() {
      this.isOneDownCate = !this.isOneDownCate;
    },
    // 展开二级分类
    handlerTwoCateLabel() {
      this.isTwoDownCate = !this.isTwoDownCate;
    },
    clearRootEvent() {
      eventBus.$off("searchProducts");
      eventBus.$off("openUpload");
    }
  },
  created() {
    this.getProductCategoryList();
    this.getProductList();
  },
  mounted() {
    // 点击搜索-文字搜索
    eventBus.$on("searchProducts", form => {
      this.searchForm.keyword = form.keyword;
      this.currentPage = 1;
      this.getProductList();
    });
    // 图搜
    eventBus.$on("openUpload", file => {
      this.uploadPic(file);
    });
    // 取消收藏
    eventBus.$on("resetProducts", list => {
      if (list.length) {
        for (let i = 0; i < this.productList.length; i++) {
          for (let j = 0; j < list.length; j++) {
            if (this.productList[i].productNumber == list[j].productNumber) {
              this.productList[i].isFavorite = true;
              break;
            } else {
              this.productList[i].isFavorite = false;
            }
          }
        }
      } else {
        this.productList.forEach(val => {
          val.isFavorite = false;
        });
      }
    });
    eventBus.$on("resetProductCollection", item => {
      for (let i = 0; i < this.productList.length; i++) {
        if (
          this.productList[i].productNumber == item.bearProduct.productNumber
        ) {
          this.productList[i].isFavorite = item.isFavorite;
        }
      }
    });
    // 增加滚动事件
    eventBus.$emit("startScroll");
    // 删除购物车
    eventBus.$on("resetMyCart", list => {
      if (list.length) {
        for (let i = 0; i < this.productList.length; i++) {
          for (let j = 0; j < list.length; j++) {
            if (this.productList[i].productNumber == list[j].productNumber) {
              this.productList[i].isShopping = true;
              break;
            } else {
              this.productList[i].isShopping = false;
            }
          }
        }
      } else {
        this.productList.forEach(val => {
          val.isShopping = false;
        });
      }
    });
    this.$nextTick(() => {
      if (this.$route.query.id === "imgSearch") {
        eventBus.$emit("imgSearch");
      }
    });
  },
  computed: {
    ...mapGetters({
      shoppingList: "myShoppingList"
    }),
    ...mapState(["searchImgPreview"]),
    ...mapState(["imageSearchValue"]),
    ...mapState(["myColles"])
  },
  watch: {
    shoppingList(list) {
      if (list) {
        if (list.length) {
          for (let i = 0; i < this.productList.length; i++) {
            for (let j = 0; j < list.length; j++) {
              if (this.productList[i].productNumber == list[j].productNumber) {
                this.productList[i].isShopping = true;
                break;
              } else {
                this.productList[i].isShopping = false;
              }
            }
          }
        } else {
          this.productList.forEach(val => {
            val.isShopping = false;
          });
        }
      }
    },
    "searchForm.time"(newVal) {
      if (newVal == null) {
        this.searchForm.time = [];
      }
    }
  },
  beforeDestroy() {
    this.clearRootEvent();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.productSearch {
  .advancedSearchBox {
    background-color: #fff;
    width: 100%;
    .standardScreening,
    .productClass,
    .twoLevelClass {
      padding: 20px;
      padding-top: 0;
      .myLabel {
        margin-right: 15px;
      }
    }
    @{deep} .standardScreening {
      display: flex;
      .el-checkbox {
        .el-checkbox__input {
          border-radius: 50%;
          .el-checkbox__inner {
            border-radius: 50%;
          }
        }
      }
    }
    .productClass,
    .twoLevelClass {
      display: flex;
      .myLabel {
        padding-top: 20px;
      }
      .topLine {
        border-top: 1px solid #dcdfe6;
        .develop {
          background: #ffffff;
          border: 1px solid #dcdfe6;
          border-radius: 5px;
          width: 68px;
          height: 30px;
          margin-top: 13px;
          line-height: 30px;
          text-align: center;
          box-sizing: border-box;
          cursor: pointer;
          .zhankai {
            margin-right: 5px;
          }
        }
      }
      .tags {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid #dcdfe6;
        padding-top: 13px;
        .itemTag {
          padding: 5px 12px;
          border-radius: 4px;
          cursor: pointer;
          &.isActive {
            background-color: #3368a9;
            color: #fff;
          }
        }
        &.showOneCate {
          max-height: 66px;
          overflow: hidden;
        }
        &.showTwoCate {
          max-height: 33px;
          overflow: hidden;
        }
      }
    }
  }
  .productsWrap {
    margin-top: 20px;
    background-color: #fff;
    .screenBox {
      width: 100%;
      height: 50px;
      background-color: #f9fafc;
      display: flex;
      align-items: center;
      .left {
        flex: 1;
        display: flex;
        align-items: center;
        .screenItem {
          margin-left: 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 5px;
          &.priceUnit,
          &.dateTime {
            cursor: default;
            @{deep} .el-date-editor {
              width: 210px;
              box-sizing: border-box;
              padding-left: 16px;
              .el-icon-date {
                display: none;
              }
            }
          }
          .screenLabel {
            margin-right: 10px;
            &.active {
              color: #3368a9;
              font-weight: bold;
            }
          }
          .jiantou {
            width: 9px;
            height: 16px;
            opacity: 1;
          }
          .xiajiantouIcon {
            background: url("~@/assets/images/xiajiantou.png") no-repeat center;
            background-size: contain;
          }
          .xiaActiveIcon {
            background: url("~@/assets/images/xiaActive.png") no-repeat center;
            background-size: contain;
          }
          .shangActiveIcon {
            background: url("~@/assets/images/shangActive.png") no-repeat center;
            background-size: contain;
          }
          .el-date-editor {
            width: 210px;
          }
          .intervalPrice {
            width: 130px;
            display: flex;
            align-items: center;
            .line {
              margin: 0 5px;
            }
          }
        }
      }
      .right {
        width: 340px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .grid,
        .column {
          width: 17px;
          height: 17px;
          margin-right: 25px;
          cursor: pointer;
        }
        .grid {
          background: url("~@/assets/images/gridIcon.png") no-repeat center;
          background-size: contain;
          &.active {
            background: url("~@/assets/images/gridActiveIcon.png") no-repeat
              center;
            background-size: contain;
          }
        }
        .column {
          background: url("~@/assets/images/columnIcon.png") no-repeat center;
          background-size: contain;
          &.active {
            background: url("~@/assets/images/columnActiveIcon.png") no-repeat
              center;
            background-size: contain;
          }
        }
        .line {
          width: 1px;
          height: 100%;
          opacity: 1;
          background: #e9e9e9;
        }
        .totalCount {
          margin-left: 15px;
          .totalCountText {
            color: #eb1515;
          }
        }
        .myMinPagination {
          width: 110px;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          margin-left: 20px;
          .first,
          .next {
            cursor: pointer;
          }
          .count {
            .pageIndex {
              color: #ff760e;
            }
          }
        }
      }
    }
    .productListBox {
      background-color: #fff;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .myPagination {
        padding: 30px 0;
      }
    }
  }
  // 图搜样式
  .picSearchBox {
    background-color: #fff;
    padding: 20px;
    .searchInput {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .resultTitle {
      padding: 20px 0;
    }
    .resultBox {
      height: 170px;
      border-top: 1px solid #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
      box-sizing: border-box;
      padding: 10px 0;
      display: flex;
      .middle {
        flex: 1;
        .preview {
          width: 100%;
          height: 148px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          .imgBox {
            position: relative;
            right: 100px;
            .miniImg {
              position: absolute;
              right: -100px;
              top: 0;
              width: 100px;
              height: 100px;
              box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
              background-color: #fff;
              z-index: 1;
              .el-image {
                width: 100%;
                height: 100%;
                cursor: pointer;
                @{deep} img {
                  transition: all 1s;
                  &:hover {
                    -webkit-transform: scale(1.1);
                    -moz-transform: scale(1.1);
                    -ms-transform: scale(1.1);
                    transform: scale(1.1);
                  }
                }
              }
            }
            .el-image {
              width: 200px;
              height: 100%;
              cursor: pointer;
              @{deep} img {
                transition: all 1s;
                &:hover {
                  -webkit-transform: scale(1.1);
                  -moz-transform: scale(1.1);
                  -ms-transform: scale(1.1);
                  transform: scale(1.1);
                }
              }
            }
          }
        }
      }
      .left,
      .right {
        width: 250px;
        min-width: 250px;
        .totalCountBox {
          margin-top: 128px;
          .total {
            margin-left: 40px;
            .text {
              color: #eb1515;
            }
          }
        }
      }
    }
  }
}
</style>
