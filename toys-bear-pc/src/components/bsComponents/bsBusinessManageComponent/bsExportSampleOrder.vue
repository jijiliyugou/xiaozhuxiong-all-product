<template>
  <div>
    <el-card class="box-card">
      <div
        slot="header"
        style="display:flex; align-items:center; justify-content:space-between"
      >
        <span class="headerTitle">报出价(带工厂信息)</span>
        <div>
          <el-button
            type="primary"
            @click="openViewer(require('@/assets/images/mode1.png'))"
            >预览</el-button
          >
          <el-button type="success" @click="exportOrder(1)">导出</el-button>
        </div>
      </div>
      <div class="modeImgBox">
        <el-image
          fit="contain"
          class="myImg"
          :src="require('@/assets/images/mode1.png')"
        ></el-image>
      </div>
    </el-card>
    <el-card class="box-card">
      <div
        slot="header"
        style="display:flex; align-items:center; justify-content:space-between"
      >
        <span class="headerTitle">报出价(不带工厂信息)</span>
        <div>
          <el-button
            type="primary"
            @click="openViewer(require('@/assets/images/mode2.png'))"
            >预览</el-button
          >
          <el-button type="success" @click="exportOrder(2)">导出</el-button>
        </div>
      </div>
      <div class="modeImgBox">
        <el-image
          fit="contain"
          class="myImg"
          :src="require('@/assets/images/mode2.png')"
        ></el-image>
      </div>
    </el-card>
    <el-card class="box-card">
      <div
        slot="header"
        style="display:flex; align-items:center; justify-content:space-between"
      >
        <span class="headerTitle">出厂价(带工厂信息)</span>
        <div>
          <el-button
            type="primary"
            @click="openViewer(require('@/assets/images/mode3.png'))"
            >预览</el-button
          >
          <el-button type="success" @click="exportOrder(3)">导出</el-button>
        </div>
      </div>
      <div class="modeImgBox">
        <el-image
          fit="contain"
          class="myImg"
          :src="require('@/assets/images/mode3.png')"
        ></el-image>
      </div>
    </el-card>
    <el-card class="box-card">
      <div
        slot="header"
        style="display:flex; align-items:center; justify-content:space-between"
      >
        <span class="headerTitle">出厂价+报出价+工厂信息</span>
        <div>
          <el-button
            type="primary"
            @click="openViewer(require('@/assets/images/mode4.png'))"
            >预览</el-button
          >
          <el-button type="success" @click="exportOrder(4)">导出</el-button>
        </div>
      </div>
      <div class="modeImgBox">
        <el-image
          fit="contain"
          class="myImg"
          :src="require('@/assets/images/mode4.png')"
        ></el-image>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCurrentTime } from "@/assets/js/common/common.js";
export default {
  props: ["orderRow", "api"],
  data() {
    return {};
  },
  methods: {
    // 打开预览模板
    openViewer(url) {
      this.$PreviewPic({
        zIndex: 9999, // 组件的zIndex值 默认为2000
        index: 0, // 展示第几张图片 默认为0
        list: [url], // 需要展示图片list
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
    // 导出模板
    exportOrder(type) {
      const fd = {
        templateType: type,
        orderNumber: this.orderRow.orderNumber,
        the_nu: this.orderRow.the_nu
      };
      this.$http
        .post(this.api, fd, {
          responseType: "blob"
        })
        .then(res => {
          const time = getCurrentTime();
          const fileName = this.orderRow.orderNumber + "_" + time + ".xls";
          console.log(res);
          const blob = res.data;
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // 兼容IE
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          } else {
            // 兼容Google及fireFox
            const link = document.createElement("a");
            link.style.display = "none";
            link.download = fileName;
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(link.href); // 释放URL 对象
            document.body.removeChild(link);
          }
        });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less"></style>
