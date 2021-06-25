<template>
  <div class="dialogComponents">
    <!-- 批量推荐 -->
    <div class="tuijian" v-if="pi_option.id === 1">
      <div class="tuijian_xuan">
        <el-radio v-model="tui_radio" :label="0">全网</el-radio>
        <el-radio v-model="tui_radio" :label="1">店铺</el-radio>
      </div>
      <div class="tuijian_input">
        <div class="tuijian_input_titleBox">
          <span class="tuijian_input_title">内容：</span>
        </div>
        <el-input
          v-model="tui_content"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <center class="tuijian_btn">
        <el-button type="primary" @click="subTuijian">发布</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </center>
    </div>
    <!-- 批量修改价格 -->
    <div class="tuijian" v-else-if="pi_option.id === 2">
      <div class="tuijian_xuan">
        <el-radio v-model="xiu_radio" :label="1">调价幅度</el-radio>
        <el-radio v-model="xiu_radio" :label="2">批量加/减价</el-radio>
      </div>
      <div class="tuijian_input">
        <el-input
          v-model="xiu_content"
          onkeyup="value=value.replace(/[^\d.]/g,'')"
          :placeholder="xiu_radio_place"
        ></el-input>
      </div>
      <center class="tuijian_btn">
        <el-button type="primary" @click="submitXiu">确定</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </center>
    </div>
    <!-- 批量设置区域 -->
    <div class="tuijian" v-else-if="pi_option.id === 8">
      <div class="shezhi_xuan">
        <div class="shezhi_xuan_item" v-for="item in myAreaList" :key="item.id">
          <el-checkbox v-model="item.checked">{{ item.name }}</el-checkbox>
        </div>
      </div>
      <center class="tuijian_btn">
        <el-button type="primary" @click="submitShe">确定</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </center>
    </div>
    <!-- 批量公开 -->
    <div class="tuijian" v-else-if="pi_option.id === 3">
      <center style="font-weight: bold;margin:40px;font-size:16px;">
        是否批量公开
      </center>
      <center class="tuijian_btn">
        <el-button type="primary" @click="submitGong(0)">确定</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </center>
    </div>
    <!-- 批量隐藏 -->
    <div class="tuijian" v-else-if="pi_option.id === 4">
      <center style="font-weight: bold;margin:40px;font-size:16px;">
        是否批量隐藏
      </center>
      <center class="tuijian_btn">
        <el-button type="primary" @click="submitGong(1)">确定</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </center>
    </div>
    <!-- 批量上架 -->
    <div class="tuijian" v-else-if="pi_option.id === 5">
      <center style="font-weight: bold;margin:40px;font-size:16px;">
        是否批量上架
      </center>
      <center class="tuijian_btn">
        <el-button type="primary" @click="submitShang(0)">确定</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </center>
    </div>
    <!-- 批量下架 -->
    <div class="tuijian" v-else-if="pi_option.id === 6">
      <center style="font-weight: bold;margin:40px;font-size:16px;">
        是否批量下架
      </center>
      <center class="tuijian_btn">
        <el-button type="primary" @click="submitShang(1)">确定</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </center>
    </div>
    <!-- 批量删除 -->
    <div class="tuijian" v-else-if="pi_option.id === 7">
      <center style="font-weight: bold;margin:40px;font-size:16px;">
        是否批量删除
      </center>
      <center class="tuijian_btn">
        <el-button type="primary" @click="submitShan">确定</el-button>
        <el-button @click="$emit('close')">取消</el-button>
      </center>
    </div>
  </div>
</template>

<script>
export default {
  props: ["pi_option", "areaList", "selectionList"],
  data() {
    return {
      tui_radio: 0,
      tui_content: null,
      xiu_radio: 1,
      xiu_content: null,
      xiu_placeholder: "",
      myAreaList: []
    };
  },
  methods: {
    // 批量修改地区
    async submitShe() {
      console.log(this.myAreaList);
      const areaRegionIdList = this.myAreaList.filter(v => v.checked);
      const res = await this.$http.post("/api/UpdateProductAreaRegion", {
        productIdList: this.selectionList.map(v => v.id),
        areaRegionIdList: areaRegionIdList.map(v => v.id)
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "修改成功",
          type: "success"
        });
        this.$emit("subm");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 批量删除
    async submitShan() {
      const res = await this.$http.post("/api/BatchDeleteBearProduct", {
        productNumberList: this.selectionList.map(v => v.productNumber)
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "删除成功",
          type: "success"
        });
        this.$emit("subm");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 批量上架/下架
    async submitShang(number) {
      const res = await this.$http.post("/api/UpdateProductState", {
        productNumberList: this.selectionList.map(v => v.productNumber),
        isStop: number
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "修改成功",
          type: "success"
        });
        this.$emit("subm");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 批量公开/隐藏
    async submitGong(flag) {
      const res = await this.$http.post("/api/UpdateProductState", {
        productNumberList: this.selectionList.map(v => v.productNumber),
        isOpen: flag
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "修改成功",
          type: "success"
        });
        this.$emit("subm");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 提交批量推荐
    async subTuijian() {
      const res = await this.$http.post("/api/CareteRecommendProduct", {
        productNumberList: this.selectionList.map(v => v.productNumber),
        typeId: this.tui_radio,
        remark: this.tui_content
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "推荐成功",
          type: "success"
        });
        this.$emit("subm");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 单选
    handleChecked() {
      const listChecked = this.myAreaList.filter(item => {
        return item.checked === true;
      });
      console.log(listChecked);
    },
    // 批量修改价格
    async submitXiu() {
      const res = await this.$http.post("/api/UpdateProductPrice", {
        productNumberList: this.selectionList.map(v => v.productNumber),
        type: this.xiu_radio,
        priceVal: this.xiu_content ? this.xiu_content : 0
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "修改成功",
          type: "success"
        });
        this.$emit("subm");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  },
  computed: {
    xiu_radio_place() {
      if (this.xiu_radio == 1) {
        return "上调请输入正数，下调请输入负数";
      } else if (this.xiu_radio == 2) {
        return "加价请输入正数，减价请输入负数";
      } else {
        return "请选择";
      }
    }
  },
  created() {},
  mounted() {
    for (let i = 0; i < this.areaList.length; i++) {
      this.$set(this.areaList[i], "checked", false);
      this.myAreaList.push(this.areaList[i]);
    }
  }
};
</script>
<style scoped lang="less">
.dialogComponents {
  .tuijian {
    .tuijian_xuan {
      height: 66px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tuijian_input {
      margin-top: 20px;
      display: flex;
      .tuijian_input_titleBox {
        .tuijian_input_title {
          white-space: nowrap; /*不换行*/
        }
      }
    }
    .tuijian_btn {
      margin-top: 20px;
      padding: 20px;
      box-sizing: border-box;
      .el-button {
        width: 120px;
      }
    }
    .shezhi_xuan {
      display: flex;
      flex-wrap: wrap;
      padding: 20px;
      box-sizing: border-box;
      border-bottom: 1px solid #e5e5e5;
      .shezhi_xuan_item {
        width: 50%;
        padding: 15px 0;
      }
    }
  }
}
</style>
