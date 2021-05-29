<template>
  <div class="magnify">
    <!-- 左边产品图片区域 -->
    <div class="left_contaner">
      <div class="middle_img" @click="openBigImg(middleImg.url)">
        <!-- 3D -->
        <i v-if="threeDimensional" class="threeIcon" @click="open3D(true)"></i>
        <div class="pic" v-if="middleImg.type === 'img'">
          <pic-zoom :url="rerunImg(middleImg.url)" :scale="3"></pic-zoom>
        </div>

        <!-- <el-image
          v-if="middleImg.type === 'img'"
          :src="middleImg.url"
          fit="contain"
        >
          <div
            slot="placeholder"
            class="image-slot"
            style="width: 524px;height: 393px;"
          >
            <pic-zoom
              :url="require('@/assets/images/imgError.png')"
              :scale="3"
            ></pic-zoom>
          </div>
          <div
            slot="error"
            class="image-slot"
            style="width: 524px;  height: 393px;"
          >
            <pic-zoom
              :url="require('@/assets/images/imgError.png')"
              :scale="3"
            ></pic-zoom>
          </div>
        </el-image> -->
        <!-- element标签样式，不带放大镜 -->
        <!-- <el-image
          v-if="middleImg.type === 'img'"
          fit="contain"
          :src="middleImg.url"
        >
          <div
            slot="placeholder"
            class="image-slot"
            style="width: 524px;height: 393px;"
          >
            <img :src="require('@/assets/images/imgError.png')" />
          </div>
          <div
            slot="error"
            class="image-slot"
            style="width: 524px;  height: 393px;"
          >
            <img :src="require('@/assets/images/imgError.png')" />
          </div>
        </el-image> -->
        <!-- 产品视频 -->
        <video
          v-else-if="middleImg.type === 'video'"
          id="example_video"
          :width="middleImgWidth"
          :height="middleImgHeight"
          class="video-js vjs-default-skin bigVideo"
          controls
          poster=""
        >
          <source :src="videoAddress" type="video/mp4" />
        </video>
      </div>
      <!-- 缩略图容器 -->
      <div class="carousel" v-if="imageUrls.length || videoAddress">
        <!-- 左箭头 -->
        <div class="left_arrow arrow" @click="leftArrowClick">
          <i class="el-icon-arrow-left"></i>
        </div>
        <!-- 缩略图展示盒子 -->
        <div class="show_box">
          <ul class="picture_container" ref="middlePicture">
            <li
              class="picture_item"
              v-if="videoAddress"
              @mouseover="tabPicture({ type: 'video' })"
            >
              <div class="imgBox">
                <video
                  style="border: 1px solid #dcdfe6"
                  id="example_video"
                  :width="thumbnailWidth"
                  :height="thumbnailHeight"
                  class="video-js vjs-default-skin minVideo"
                  poster=""
                >
                  <source :src="videoAddress" type="video/mp4" />
                </video>
              </div>
            </li>
            <li
              class="picture_item"
              @mouseover="tabPicture({ type: 'img', url: item })"
              v-for="(item, index) in pictureList"
              :key="index"
            >
              <div class="imgBox">
                <img :src="item" class="small_img" alt="" />
              </div>
            </li>
          </ul>
        </div>
        <!-- 向右箭头 -->
        <div class="right_arrow arrow" @click="rightArrowClick">
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>
    <!-- 右边放大区域 -->
    <div class="right_contanier" v-show="isBig">
      <img :src="middleImg.url" ref="bigImg" class="big_img" alt="" />
      <!-- <el-image fit="contain" :src="middleImg.url" ref="bigImg" class="big_img">
        <div slot="placeholder" class="image-slot">
          <img :src="require('@/assets/images/errorImg.png')" />
        </div>
        <div slot="error" class="image-slot">
          <img :src="require('@/assets/images/errorImg.png')" />
        </div>
      </el-image> -->
    </div>
    <!-- 移动端预览大图 -->
    <el-dialog :visible.sync="dialogVisibleImg" v-if="dialogVisibleImg">
      <el-carousel
        height="700px"
        :autoplay="false"
        loop
        ref="swiperRef"
        width="100%"
      >
        <el-carousel-item v-for="(item, i) in imageUrls" :key="i">
          <img
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
            width="100%"
            height="700px"
            :src="item"
            alt
          />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
    <!-- 3d弹窗 -->
    <el-dialog
      :visible.sync="dialogVisibleThreeD"
      v-if="dialogVisibleThreeD"
      width="1264px"
      top="10vh"
      @close="open3D(false)"
      :fullscreen="threeDFullscreen"
      class="three_d"
    >
      <div slot="title" class="el-dialog__header_right">
        <i class="el-icon-full-screen" @click="isThreeDFullscreen"></i>
      </div>
      <div :class="[threeDFullscreen ? 'lg_panel' : 'sm_panel']">
        <iframe
          :src="threeDimensional"
          id="map"
          scrolling="no"
          frameborder="0"
          :class="[threeDFullscreen ? 'lg_iframe' : 'sm_iframe']"
        ></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";
import { mapState } from "vuex";
import PicZoom from "vue-piczoom";
export default {
  components: {
    PicZoom
  },
  props: {
    middleImgWidth: {
      // 产品图片宽
      default: 350,
      type: Number
    },
    middleImgHeight: {
      // 产品图片高
      default: 400,
      type: Number
    },
    thumbnailHeight: {
      // 缩略图容器高度
      default: 100,
      type: Number
    },
    thumbnailWidth: {
      // 缩略图宽度
      default: 100,
      type: Number
    },
    thumbnailCount: {
      // 缩略图数量
      default: 5,
      type: Number
    },
    imageUrls: Array, // 图片数据
    default: [],
    videoAddress: String, // 视频地址
    zoom: {
      default: 2, // 缩略比例,放大比例
      type: Number
    },
    threeDimensional: {
      default: "",
      type: String
    }
  },
  data() {
    return {
      direction: null,
      startX: 0, //开始触摸的位置
      moveX: 0, //滑动时的位置
      endX: 0, //结束触摸的位置
      disX: 0, //移动距离
      dialogVisibleImg: false,
      pictureList: [], // 缩略图
      middleImg: "", // 中图图片地址
      bigImg: "", // 大图图片地址
      isShade: false, // 控制阴影显示与否
      isBig: false, // 控制放大图显示与否
      initX: 0, // 初始clientX值
      initY: 0, // 初始clientY值
      leftX: 0, // 初始定位left
      topY: 0, // 初始定位top
      middleLeft: 0, // 当前放置小图盒子的定位left值,
      itemWidth: 98.19, // 缩略图每张的宽度
      dialogVisibleThreeD: false, //是否显示3d弹窗
      threeDFullscreen: false //3d是否全屏
    };
  },
  created() {},
  computed: {
    ...mapState(["screenWidth"])
  },
  mounted() {
    if (this.imageUrls && this.imageUrls.length) {
      this.pictureList = this.imageUrls;
    }
    if (this.videoAddress) {
      this.middleImg = {
        type: "video",
        url: this.videoAddress
      };
    } else {
      this.middleImg = {
        type: "img",
        url: this.pictureList[0]
      };
    }
    // 计算缩略图的宽度,默认是显示4张图片,两边箭头的宽度和为50
    this.itemWidth = (this.middleImgWidth - 50) / this.thumbnailCount;
  },
  methods: {
    rerunImg(img) {
      if (img) return img;
      else return require("@/assets/images/imgError.png");
    },
    // 打开3D效果
    open3D(value) {
      if (!this.threeDimensional) {
        this.$common.handlerMsgState({
          msg: "暂无产品3D数据！",
          type: "warning"
        });
        return;
      }
      this.dialogVisibleThreeD = value;
      if (!value) {
        this.threeDFullscreen = false;
      }
    },
    touchEnd(e) {
      e = e || window.event;
      e.preventDefault();
      switch (this.direction) {
        case "left":
          this.$refs.swiperRef.next();
          break;
        case "right":
          this.$refs.swiperRef.prev();
          break;
      }
    },
    touchStart(e) {
      e = e || window.event;
      e.preventDefault();
      if (e.touches.length == 1) {
        //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
        this.startX = e.touches[0].clientX; // 记录开始位置
        this.direction = null;
      }
    },
    touchMove(e) {
      e = e || window.event;
      e.preventDefault();
      if (e.touches.length == 1) {
        //滑动时距离浏览器左侧的距离
        this.moveX = e.touches[0].clientX;
        //实时的滑动的距离-起始位置=实时移动的位置
        this.disX = this.moveX - this.startX;
        if (this.disX < 0 || this.disX == 0) {
          // 左滑动 上一张
          this.direction = "left";
        } else if (this.disX > 0) {
          // 右滑动 下一张
          this.direction = "right";
        } else {
          this.direction = null;
        }
      }
    },
    // 关闭预览大图
    closeViewer() {
      this.dialogVisibleImg = false;
    },
    // 点击大图
    openBigImg() {
      if (document.body.clientWidth <= 1024 && this.middleImg.type === "img") {
        this.dialogVisibleImg = true;
      }
    },
    // 鼠标移入缩略图切换图片
    tabPicture(item) {
      this.middleImg = item;
    },
    // 点击左边箭头
    leftArrowClick() {
      if (this.middleLeft <= -this.itemWidth) {
        // 每次向右平移一个图片盒子的宽度
        this.middleLeft += this.itemWidth;
        $(".picture_container").animate(
          {
            left: this.middleLeft
          },
          500
        );
      }
    },
    /**
     * 获取网页滚出去的距离（包括上面滚出去的部分和左边滚出去的部分）
     * @returns {{scrollTop: (Number|number), scrollLeft: (Number|number)}}
     */
    getPageScroll() {
      return {
        scrollTop:
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0,
        scrollLeft:
          window.pageXOffset ||
          document.documentElement.scrollLeft ||
          document.body.scrollLeft ||
          0
      };
    },
    /**
     * 获取事件对象点击的点，相对于文档左上角的坐标
     * @param e
     * @returns {{pageX: *, pageY: *}}
     */
    getEventPage(e) {
      return {
        pageX: e.clientX + this.getPageScroll().scrollLeft,
        pageY: e.clientY + this.getPageScroll().scrollTop
      };
    },
    // 点击右边箭头
    rightArrowClick() {
      // 每次向左平移一个盒子的宽度,最多移动的宽度为(图片数组长度-4)*每张缩略图的宽度
      if (
        this.middleLeft >
        -this.itemWidth *
          (this.videoAddress
            ? this.pictureList.length + 1 - this.thumbnailCount
            : this.pictureList.length - this.thumbnailCount)
      ) {
        this.middleLeft -= this.itemWidth;
        $(".picture_container").animate(
          {
            left: this.middleLeft
          },
          500
        );
      }
    },
    //3d是否全屏
    isThreeDFullscreen() {
      this.threeDFullscreen = this.threeDFullscreen ? false : true;
    }
  }
};
</script>

<style scoped lang="less">
@deep: ~">>>";
.magnify {
  position: relative;
  .el-dialog {
    .el-dialog__header {
      .el-dialog__header_right {
        height: 50px;
        line-height: 50px;
        padding: 0;
        padding-right: 45px;
        border-bottom: 1px solid #dcdfe6;
        float: right;
      }
    }
  }
  .three_d {
    .sm_panel {
      width: 100%;
      height: 671px;
    }
    .sm_iframe {
      position: absolute;
      top: 50px;
      left: 0px;
      right: 0px;
      bottom: 10px;
      width: 100%;
      height: 711px;
    }
    .lg_panel {
      width: 100%;
      height: 845px;
    }
    .lg_iframe {
      position: absolute;
      top: 50px;
      left: 0px;
      right: 0px;
      bottom: 10px;
      width: 100%;
      height: 885px;
    }
  }
}
.left_contaner {
  width: 100%;
  height: 100%;
}
.left_contaner .middle_img {
  overflow: hidden;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  .pic {
    width: 524px;
    height: 393px;
    overflow: hidden;
  }
  .threeIcon {
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 60px;
    height: 60px;
    background: url("~@/assets/images/orange3D.png") no-repeat center;
    background-size: contain;
    cursor: pointer;
    z-index: 1;
  }
}
.left_contaner .shade {
  background-color: rgba(135, 206, 235, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  cursor: move;
}
.left_contaner .middle_img img {
  width: 524px;
  height: 393px;
  object-fit: contain;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
}
.middle_img .el-image {
  width: 524px;
  height: 393px;
  img {
    width: 524px;
    height: 393px;
    image-rendering: -moz-crisp-edges;
    image-rendering: -o-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor;
  }
}
.left_contaner .carousel {
  width: 100%;
  margin-top: 20px;
  /* display: -webkit-flex; */
  display: flex;
}
.left_contaner .carousel .show_box {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.left_contaner .carousel .arrow {
  flex-basis: 25px;
  cursor: pointer;
}
@{deep} .left_contaner .carousel .left_arrow {
  width: 30px;
  height: 65px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  font-size: 30px;
  border: 1px solid #dcdfe6;
  i {
    color: #dcdfe6;
  }
}
.left_contaner .carousel .right_arrow {
  width: 30px;
  height: 65px;
  display: flex;
  align-items: center;
  font-size: 30px;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  i {
    color: #dcdfe6;
  }
}
.left_contaner .carousel .picture_container {
  height: 100%;

  display: flex;
  // position: absolute;
  overflow: hidden;
  // top: 0;
  // left: 0;
}
.left_contaner .picture_container .picture_item {
  margin: 0 5px;
  height: 100%;
  float: left;
  box-sizing: border-box;
}
/* .left_contaner .picture_container .picture_item:hover {
  border: 2px solid #f2019f;
} */
.left_contaner .picture_container .picture_item .imgBox {
  box-sizing: border-box;
  width: 92px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.left_contaner .picture_container .picture_item .imgBox .minVideo {
  box-sizing: border-box;
  width: 92px;
  height: 65px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  object-fit: contain;
}
.left_contaner .picture_container .picture_item .imgBox img {
  width: 92px;
  height: 65px;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  object-fit: contain;
  // image-rendering: -moz-crisp-edges;
  // image-rendering: -o-crisp-edges;
  // image-rendering: -webkit-optimize-contrast;
  // image-rendering: crisp-edges;
  // -ms-interpolation-mode: nearest-neighbor;
}
.right_contanier {
  overflow: hidden;
  position: absolute;
  top: 0;
  background-color: #fff;
  // border: 1px solid #dcdfe6;
  /* border: 1px solid #d2d2d2; */
}
.right_contanier .big_img {
  position: absolute;
  object-fit: contain;
  top: 0px;
  left: 0px;
}
@{deep} .el-dialog__wrapper {
  .el-dialog {
    width: 100%;
  }
}
.el-carousel__arrow {
  width: 100px;
  height: 100px;
}
//视频窗口大小
.bigVideo {
  width: 524px;
  height: 393px;
}
</style>
