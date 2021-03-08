<template>
  <div class="magnify">
    <!-- 左边产品图片区域 -->
    <div class="left_contaner">
      <div
        class="middle_img"
        @mouseover="boxMouseOver"
        @mouseleave="boxMouseLeave"
        @click="openBigImg(middleImg.url)"
      >
        <!-- 产品图片 -->
        <!-- :style="{
            width: middleImgWidth - 2 + 'px',
            height: middleImgHeight + 'px'
          }" -->
        <!-- <img
          :style="{
            width: middleImgWidth - 2 + 'px',
            height: middleImgHeight + 'px'
          }"
          v-if="middleImg.type === 'img'"
          :src="middleImg.url"
          alt=""
        /> -->
        <el-image
          v-if="middleImg.type === 'img'"
          fit="contain"
          :src="middleImg.url"
        >
          <div slot="placeholder" class="image-slot">
            <img :src="require('@/assets/images/errorImg.png')" />
          </div>
          <div slot="error" class="image-slot">
            <img :src="require('@/assets/images/errorImg.png')" />
          </div>
        </el-image>
        <!-- 产品视频 -->
        <video
          v-else-if="middleImg.type === 'video'"
          id="example_video"
          :width="middleImgWidth"
          :height="middleImgHeight"
          class="video-js vjs-default-skin "
          controls
          poster=""
        >
          <source :src="videoAddress" type="video/mp4" />
        </video>
        <!-- 阴影盒子 -->
        <div
          class="shade"
          @mouseover="shadeMouseOver"
          @mousemove="shadeMouseMove"
          ref="shade"
          v-show="isShade"
        ></div>
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
                  style="border: 1px solid #b1b1b1;"
                  id="example_video"
                  :width="thumbnailWidth"
                  :height="thumbnailHeight"
                  class="video-js vjs-default-skin"
                  poster=""
                >
                  <source
                    src="http://img.toysbear.com/Ad/Video//2020-12-31/16094169983727201208.MP4"
                    type="video/mp4"
                  />
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
  </div>
</template>

<script>
import $ from "jquery";
import { mapState } from "vuex";
export default {
  components: {},
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
      itemWidth: 98.19 // 缩略图每张的宽度
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

    this.$nextTick(() => {
      // 容器的高
      const imgWidth = this.middleImgHeight + this.thumbnailHeight + 20;
      // 设置容器宽高
      $(".magnify").css({
        width: this.middleImgWidth,
        height: imgWidth
      });
      // 设置产品图宽高
      $(".middle_img").css({
        width: this.middleImgWidth,
        height: this.middleImgHeight
      });
      // 设置产品图宽高
      $(".middle_img .el-image").css({
        width: this.middleImgWidth - 2,
        height: this.middleImgHeight - 2
      });
      $(".middle_img .el-image img").css({
        width: this.middleImgWidth - 2,
        height: this.middleImgHeight - 2,
        "image-rendering": "-webkit-optimize-contrast",
        "-ms-interpolation-mode": "nearest-neighbor"
      });
      // 设置移动阴影图宽高
      $(".middle_img .shade").css({
        width: this.middleImgWidth / this.zoom,
        height: this.middleImgHeight / this.zoom
      });
      // 设置缩略图容器宽度
      if (this.videoAddress) {
        $(".picture_container").css({
          width: this.itemWidth * (this.pictureList.length + 1)
        });
      } else {
        $(".picture_container").css({
          width: this.itemWidth * this.pictureList.length
        });
      }
      // 设置缩略图容器高
      $(".carousel").css({
        height: this.thumbnailHeight
      });
      // 设置每个缩略图容器的宽度
      $(".picture_item").css({
        width: this.itemWidth
      });
      // 设置每个缩略图容器的高度
      $(".imgBox").css({
        height: this.thumbnailHeight
      });
      // 设置每个缩略图宽度
      $(".imgBox video").css({
        height: this.thumbnailHeight - 2,
        width: this.thumbnailWidth
      });
      // 设置每个缩略图宽度
      $(".imgBox>img").css({
        height: this.thumbnailHeight - 2,
        width: this.thumbnailWidth
      });
      // 设置放大后图片容器的宽高,left
      $(".right_contanier").css({
        left: this.middleImgWidth,
        width: this.middleImgWidth,
        height: this.middleImgHeight
      });
      // 设置放大图片的宽高(图片的放大倍数)
      $(".right_contanier .big_img").css({
        width: imgWidth * this.zoom,
        height: this.middleImgHeight * this.zoom
      });
    });
  },
  methods: {
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
    // 产品图片鼠标移入事件,显示阴影,显示大图
    boxMouseOver(e) {
      if (document.body.clientWidth <= 1024) {
        return false;
      }
      if (this.middleImg.type !== "img") {
        return false;
      }
      e.preventDefault();
      e.stopPropagation();
      this.isShade = true;
      this.isBig = true;
      // 计算阴影的位置
      let x = e.offsetX - $(".shade").width() / 2;
      let y = e.offsetY - $(".shade").height() / 2;
      let maxLeft = $(".middle_img").width() - $(".shade").width();
      let maxTop = $(".middle_img").height() - $(".shade").height();
      x = x <= 0 ? 0 : x;
      x = x >= maxLeft ? maxLeft : x;
      y = y <= 0 ? 0 : y;
      y = y >= maxTop ? maxTop : y;
      $(".shade").css({
        left: x,
        top: y
      });
    },
    // 鼠标在阴影移动
    shadeMouseMove(e) {
      e.preventDefault();
      e.stopPropagation(); //用页面x - 父盒子的offsetLeft - 父盒子的左边框宽度 标红的两个方法补在下面
      var x =
        this.getEventPage(e).pageX -
        $(".middle_img")[0].offsetParent.offsetLeft -
        $(".middle_img")[0].offsetParent.clientLeft; //用页面y - 父盒子的offsetTop - 父盒子的上边框宽度
      var y =
        this.getEventPage(e).pageY -
        $(".middle_img")[0].offsetParent.offsetTop -
        $(".middle_img")[0].offsetParent.clientTop; //让阴影的坐标居中

      x -= $(".shade").width() / 2;
      y -= $(".shade").height() / 2; // 移动边界限制

      let maxLeft = $(".middle_img").width() - $(".shade").width();
      let maxTop = $(".middle_img").height() - $(".shade").height();
      x = x <= 0 ? 0 : x;
      x = x >= maxLeft ? maxLeft : x;
      y = y <= 0 ? 0 : y;
      y = y >= maxTop ? maxTop : y; // 重新赋值当前的定位值
      $(".shade").css({
        left: x,
        top: y
      });
      // 计算出实时的大图的定位,首先计算出比例
      // 比例为x:大图宽度/小图宽度 y: 大图高度/小图高度,将小图的定位乘以比例就是大图的定位
      const xRate = $(".big_img").width() / $(".middle_img").width();
      const yRate = $(".big_img").height() / $(".middle_img").height();
      $(".big_img").css({
        left: -x * xRate,
        top: -y * yRate
      });
    },
    // 鼠标移入阴影,去除自定义事件
    shadeMouseOver(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    // 图片移出隐藏阴影和大图
    boxMouseLeave() {
      this.isShade = false;
      this.isBig = false;
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
    }
  }
};
</script>

<style scoped lang="less">
@deep: ~">>>";
.magnify {
  position: relative;
}
.left_contaner {
  width: 100%;
  height: 100%;
}
.left_contaner .middle_img {
  border: 1px solid #d2d2d2;
  box-sizing: border-box;
  position: relative;
}
.left_contaner .shade {
  background-color: rgba(135, 206, 235, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  cursor: move;
}
.left_contaner .middle_img img {
  /* width: 100%;
  height: 100%; */
  object-fit: contain;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
}
.middle_img .el-image {
  img {
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
.left_contaner .carousel .left_arrow {
  width: 25px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  font-size: 30px;
  border: 1px solid #d2d2d2;
}
.left_contaner .carousel .right_arrow {
  width: 25px;
  display: flex;
  align-items: center;
  font-size: 30px;
  border-radius: 5px;
  border: 1px solid #d2d2d2;
}
.left_contaner .carousel .picture_container {
  height: 100%;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
}
.left_contaner .picture_container .picture_item {
  height: 100%;
  float: left;
  box-sizing: border-box;
}
/* .left_contaner .picture_container .picture_item:hover {
  border: 2px solid #f2019f;
} */
.left_contaner .picture_container .picture_item .imgBox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.left_contaner .picture_container .picture_item .imgBox img {
  border: 1px solid #b1b1b1;
  box-sizing: border-box;
  cursor: pointer;
  object-fit: contain;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
}
.right_contanier {
  overflow: hidden;
  position: absolute;
  top: 0;
  background-color: #fff;
  border: 1px solid #eee;
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
</style>
