<template>
  <div class="dialogComponents">
    <!-- 批量修改价格 -->
    <div class="tuijian">
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
  </div>
</template>

<script>
export default {
  props: ["selectionList"],
  data() {
    return {
      xiu_radio: 1,
      xiu_content: null
    };
  },
  methods: {
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
  mounted() {}
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
