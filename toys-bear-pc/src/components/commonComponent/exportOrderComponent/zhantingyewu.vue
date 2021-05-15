<template>
  <div class="exportBox">
    <div class="left">
      <li :class="{ item: true, active: tp == 1 }" @click="checkTp(1)">
        报出价(带工厂信息)
      </li>
      <li :class="{ item: true, active: tp == 2 }" @click="checkTp(2)">
        报出价(不带工厂信息)
      </li>
      <li :class="{ item: true, active: tp == 3 }" @click="checkTp(3)">
        出厂价(带工厂信息)
      </li>
      <li :class="{ item: true, active: tp == 4 }" @click="checkTp(4)">
        出厂价+报出价+工厂信息
      </li>
      <li :class="{ item: true, active: tp == 5 }" @click="checkTp(5)">
        宏升导入EXCEL模板
      </li>
      <li :class="{ item: true, active: tp == 6 }" @click="checkTp(6)">
        报出价不带厂商资料 (英文)
      </li>
    </div>
    <div class="right">
      <div class="tp1" v-show="tp === 1">
        <div class="orderTitle">报出价(带工厂信息)</div>
        <div class="imgBox">
          <el-image
            fit="contain"
            class="myImg"
            :z-index="5000"
            :preview-src-list="[require('@/assets/images/zhantingyewuTp1.png')]"
            :src="require('@/assets/images/zhantingyewuTp1.png')"
          ></el-image>
        </div>
        <div class="selectTions">
          <div class="label">
            是否按厂商单独导出图片：
            <!-- <el-radio-group class="myExportWay" v-model="imageExportWay">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group> -->
            <el-checkbox-group
              class="myExportWay"
              @change="changeCheckBox"
              v-model="imageExportWay"
            >
              <el-checkbox :label="2">是</el-checkbox>
              <el-checkbox :label="1">否</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="label">
            是否带图：
            <el-radio-group class="myExportWay" v-model="exportWay">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </div>
          <div class="label">
            图片大小：
            <el-select
              size="medium"
              style="width: 100px;"
              v-model="imgSize"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, i) in imageSizeList"
                :key="i"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="label">
            <el-button type="warning" size="medium" @click="exportOrder(1)">
              <i class="iconfont icon-daochujinruchukou"></i>
              确定导出
            </el-button>
          </div>
        </div>
      </div>
      <div class="tp1" v-show="tp === 2">
        <div class="orderTitle">报出价(不带工厂信息)</div>
        <div class="imgBox">
          <el-image
            fit="contain"
            :z-index="5000"
            :preview-src-list="[require('@/assets/images/zhantingyewuTp2.png')]"
            class="myImg"
            :src="require('@/assets/images/zhantingyewuTp2.png')"
          ></el-image>
        </div>
        <div class="selectTions">
          <div class="label">
            是否按厂商单独导出图片：
            <!-- <el-radio-group class="myExportWay" v-model="imageExportWay">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group> -->
            <el-checkbox-group
              class="myExportWay"
              @change="changeCheckBox"
              v-model="imageExportWay"
            >
              <el-checkbox :label="2">是</el-checkbox>
              <el-checkbox :label="1">否</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="label">
            是否带图：
            <el-radio-group class="myExportWay" v-model="exportWay">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </div>
          <div class="label">
            图片大小：
            <el-select
              size="medium"
              style="width: 100px;"
              v-model="imgSize"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, i) in imageSizeList"
                :key="i"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="label">
            <el-button type="warning" size="medium" @click="exportOrder(2)">
              <i class="iconfont icon-daochujinruchukou"></i>
              确定导出
            </el-button>
          </div>
        </div>
      </div>
      <div class="tp1" v-show="tp === 3">
        <div class="orderTitle">出厂价(带工厂信息))</div>
        <div class="imgBox">
          <el-image
            fit="contain"
            :z-index="5000"
            :preview-src-list="[require('@/assets/images/zhantingyewuTp3.png')]"
            class="myImg"
            :src="require('@/assets/images/zhantingyewuTp3.png')"
          ></el-image>
        </div>
        <div class="selectTions">
          <div class="label">
            是否按厂商单独导出图片：
            <!-- <el-radio-group class="myExportWay" v-model="imageExportWay">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group> -->
            <el-checkbox-group
              class="myExportWay"
              @change="changeCheckBox"
              v-model="imageExportWay"
            >
              <el-checkbox :label="2">是</el-checkbox>
              <el-checkbox :label="1">否</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="label">
            是否带图：
            <el-radio-group class="myExportWay" v-model="exportWay">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </div>
          <div class="label">
            图片大小：
            <el-select
              size="medium"
              style="width: 100px;"
              v-model="imgSize"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, i) in imageSizeList"
                :key="i"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="label">
            <el-button type="warning" size="medium" @click="exportOrder(3)">
              <i class="iconfont icon-daochujinruchukou"></i>
              确定导出
            </el-button>
          </div>
        </div>
      </div>
      <div class="tp1" v-show="tp === 4">
        <div class="orderTitle">出厂价+报出价+工厂信息</div>
        <div class="imgBox">
          <el-image
            fit="contain"
            :z-index="5000"
            :preview-src-list="[require('@/assets/images/zhantingyewuTp4.png')]"
            class="myImg"
            :src="require('@/assets/images/zhantingyewuTp4.png')"
          ></el-image>
        </div>
        <div class="selectTions">
          <div class="label">
            是否按厂商单独导出图片：
            <!-- <el-radio-group class="myExportWay" v-model="imageExportWay">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group> -->
            <el-checkbox-group
              class="myExportWay"
              @change="changeCheckBox"
              v-model="imageExportWay"
            >
              <el-checkbox :label="2">是</el-checkbox>
              <el-checkbox :label="1">否</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="label">
            是否带图：
            <el-radio-group class="myExportWay" v-model="exportWay">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </div>
          <div class="label">
            图片大小：
            <el-select
              size="medium"
              style="width: 100px;"
              v-model="imgSize"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, i) in imageSizeList"
                :key="i"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="label">
            <el-button type="warning" size="medium" @click="exportOrder(4)">
              <i class="iconfont icon-daochujinruchukou"></i>
              确定导出
            </el-button>
          </div>
        </div>
      </div>
      <div class="tp1" v-show="tp === 5">
        <div class="orderTitle">宏升导入EXCEL模板</div>
        <div class="imgBox">
          <el-image
            fit="contain"
            class="myImg"
            :z-index="5000"
            :preview-src-list="[require('@/assets/images/zhantingyewuTp5.png')]"
            :src="require('@/assets/images/zhantingyewuTp5.png')"
          ></el-image>
        </div>
        <div class="selectTions">
          <div class="label">
            是否按厂商单独导出图片：
            <!-- <el-radio-group class="myExportWay" v-model="imageExportWay">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group> -->
            <el-checkbox-group
              class="myExportWay"
              @change="changeCheckBox"
              v-model="imageExportWay"
            >
              <el-checkbox :label="2">是</el-checkbox>
              <el-checkbox :label="1">否</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="label">
            <el-button type="warning" size="medium" @click="exportOrder(5)">
              <i class="iconfont icon-daochujinruchukou"></i>
              确定导出
            </el-button>
          </div>
        </div>
      </div>
      <div class="tp1" v-show="tp === 6">
        <div class="orderTitle">报出价不带厂商资料 (英文)</div>
        <div class="imgBox">
          <el-image
            fit="contain"
            :z-index="5000"
            :preview-src-list="[require('@/assets/images/zhantingyewuTp6.png')]"
            class="myImg"
            :src="require('@/assets/images/zhantingyewuTp6.png')"
          ></el-image>
        </div>
        <div class="selectTions">
          <div class="label">
            是否按厂商单独导出图片：
            <!-- <el-radio-group class="myExportWay" v-model="imageExportWay">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group> -->
            <el-checkbox-group
              class="myExportWay"
              @change="changeCheckBox"
              v-model="imageExportWay"
            >
              <el-checkbox :label="2">是</el-checkbox>
              <el-checkbox :label="1">否</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="label">
            是否带图：
            <el-radio-group class="myExportWay" v-model="exportWay">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </div>
          <div class="label">
            图片大小：
            <el-select
              size="medium"
              style="width: 100px;"
              v-model="imgSize"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, i) in imageSizeList"
                :key="i"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="label">
            <el-button type="warning" size="medium" @click="exportOrder(6)">
              <i class="iconfont icon-daochujinruchukou"></i>
              确定导出
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentTime } from "@/assets/js/common/common.js";
export default {
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {
      tp: 1,
      imgSize: "200*150",
      imageSizeList: ["200*150", "400*300", "640*480"],
      imageExportWay: [],
      exportWay: 1
    };
  },
  methods: {
    // 查看模板
    checkTp(t) {
      this.tp = t;
    },
    // 修改了压缩包
    changeCheckBox(list) {
      if (list.length > 1) {
        this.imageExportWay.splice(0, 1);
      }
    },
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
      this.$store.commit("handlerIsJindu", true);
      // this.options.templateType = type;
      const fd = {
        excelExportWay: this.exportWay,
        imageExportWay: this.imageExportWay.length ? this.imageExportWay[0] : 0,
        imageWidth: this.imgSize.split("*")[0],
        imageHeight: this.imgSize.split("*")[1],
        templateType: type,
        ...this.options
      };
      this.$http
        .post(this.options.api, fd, {
          responseType: "blob",
          timeout: 1000000000
        })
        .then(res => {
          const time = getCurrentTime();
          const exeName = this.options.name + "_" + time + ".xlsx";
          const zipName = this.options.name + "_" + time + ".zip";
          const fileName = this.imageExportWay.length > 0 ? zipName : exeName;
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
          this.$store.commit("handlerIsJindu", false);
        })
        .catch(() => {
          this.$store.commit("handlerIsJindu", false);
        });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.exportBox {
  display: flex;
  .left {
    width: 230px;
    min-width: 230px;
    border-right: 1px solid #e5e5e5;
    font-size: 15px;
    .item {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      cursor: pointer;
      &.active {
        position: relative;
        background-color: #eff6ff;
        &::after {
          position: absolute;
          content: "";
          left: 0;
          top: 0;
          width: 3px;
          background-color: #3368a9;
          height: 50px;
        }
      }
    }
  }
  .right {
    flex: 1;
    .orderTitle {
      font-size: 20px;
      font-weight: 700;
      margin-top: 90px;
      text-align: center;
    }
    .imgBox {
      margin-top: 25px;
      padding: 0 45px;
      height: 136px;
      box-sizing: border-box;
    }
    .selectTions {
      margin-top: 87px;
      height: 66px;
      border-top: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 20px;
      .label {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
