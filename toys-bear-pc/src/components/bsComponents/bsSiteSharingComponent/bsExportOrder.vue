<template>
  <div>
    <el-card class="box-card">
      <div
        slot="header"
        style="display:flex; align-items:center; justify-content:space-between"
      >
        <span class="headerTitle">报出价(带工厂信息)</span>
        <div>
          <div class="isFac">
            <span class="facTitle">是否按厂商导出</span>
            <el-select v-model="imageExportWay" clearable placeholder="请选择">
              <el-option
                v-for="item in imageExportWayList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <el-radio-group class="myExportWay" v-model="exportWay">
            <el-radio :label="1">带图片导出</el-radio>
            <el-radio :label="2">不带图片导出</el-radio>
          </el-radio-group>
          <el-button
            class="btnMargin"
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
          <div class="isFac">
            <span class="facTitle">是否按厂商导出</span>
            <el-select v-model="imageExportWay" clearable placeholder="请选择">
              <el-option
                v-for="item in imageExportWayList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <el-radio-group class="myExportWay" v-model="exportWay">
            <el-radio :label="1">带图片导出</el-radio>
            <el-radio :label="2">不带图片导出</el-radio>
          </el-radio-group>
          <el-button
            type="primary"
            class="btnMargin"
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
          <div class="isFac">
            <span class="facTitle">是否按厂商导出</span>
            <el-select v-model="imageExportWay" clearable placeholder="请选择">
              <el-option
                v-for="item in imageExportWayList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <el-radio-group class="myExportWay" v-model="exportWay">
            <el-radio :label="1">带图片导出</el-radio>
            <el-radio :label="2">不带图片导出</el-radio>
          </el-radio-group>
          <el-button
            type="primary"
            class="btnMargin"
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
          <div class="isFac">
            <span class="facTitle">是否按厂商导出</span>
            <el-select v-model="imageExportWay" clearable placeholder="请选择">
              <el-option
                v-for="item in imageExportWayList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <el-radio-group class="myExportWay" v-model="exportWay">
            <el-radio :label="1">带图片导出</el-radio>
            <el-radio :label="2">不带图片导出</el-radio>
          </el-radio-group>
          <el-button
            type="primary"
            class="btnMargin"
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
  props: ["orderNumber", "customerName", "api"],
  data() {
    return {
      imageExportWayList: [
        { value: 0, label: "请选择" },
        { value: 2, label: "按厂商单独导图片" },
        { value: 1, label: "不按厂商单独导图片" }
      ],
      imageExportWay: 0,
      exportWay: 1
    };
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
      // const fd = {
      //   templateType: type,
      //   shareOrderNumber: this.orderNumber
      // };
      const fd = {
        excelExportWay: this.exportWay,
        imageExportWay: this.imageExportWay ? this.imageExportWay : 0,
        templateType: type,
        shareOrderNumber: this.orderNumber
      };
      this.$http
        .post(this.api, fd, {
          responseType: "blob",
          timeout: 100000000
        })
        .then(res => {
          const time = getCurrentTime();
          // const fileName = this.customerName + "_" + time + ".xlsx";

          const exeName = this.customerName + "_" + time + ".xlsx";
          const zipName = this.customerName + "_" + time + ".zip";
          const fileName = this.imageExportWay > 0 ? zipName : exeName;

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
<style scoped lang="less">
.isFac {
  display: inline;
  margin: 20px;
  .facTitle {
    margin-right: 10px;
  }
}
.btnMargin {
  margin-left: 20px;
}
</style>
