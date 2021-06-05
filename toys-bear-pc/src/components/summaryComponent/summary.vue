<template>
  <!-- 统计 -->
  <div class="summary">
    <div class="summaryBox">
      <div class="summaryList">
        <p class="item">
          <span class="itemTitle">总款数：</span>
          <span>{{ summaryData.totalDegree }}</span>
        </p>
        <p class="item" v-if="summaryData.totalCartons > 0">
          <span class="itemTitle">总箱数：</span>
          <span>{{ summaryData.totalCartons }}</span>
        </p>
        <p class="item">
          <span class="itemTitle">总数量：</span>
          <span>{{ summaryData.totalQuantity }}</span>
        </p>
        <p class="item">
          <span class="itemTitle">总体积/总材积：</span>
          <span
            >{{ summaryData.totalBulkStere }}(cbm)/{{
              summaryData.totalBulkFeet
            }}(cuft)</span
          >
        </p>
        <p class="item">
          <span class="itemTitle">总毛重/总净重：</span>
          <span
            >{{ summaryData.totalGrWe }}/{{ summaryData.totalNeWe }}(KG)</span
          >
        </p>
        <p class="item" v-if="summaryData.totalMoney > 0">
          <span class="itemTitle">总金额：</span>
          <span class="price"
            >{{ summaryData.cu_de }}{{ summaryData.totalMoney }}
          </span>
        </p>
        <p
          class="item"
          v-if="summaryData.sumAmountFa_pr > 0 && summaryData.sumHa_in_qu > 0"
        >
          <span class="itemTitle">总出厂价/总报出价</span>
          <span class="price">￥{{ summaryData.sumAmountFa_pr }}</span>
          <span>/</span>
          <span class="price">
            {{ summaryData.cu_de }}{{ summaryData.sumHa_in_qu || 0 }}
          </span>
        </p>
      </div>
      <div class="submit" v-show="summaryData.isHandle">
        <el-button type="primary" @click="handleSubmit(false)" size="small"
          >确定提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    summaryData: {
      type: Object
    }
  },
  watch: {
    summaryData: {
      deep: true,
      handler(val) {
        console.log(val, "watch数据");
      }
    }
  },
  data() {
    return {
      //   totalDegree: 0, //总款数
      //   totalCartons: 0, //总箱数
      //   totalQuantity: 0, //总数量
      //   totalBulkStere: 0, //总体积
      //   totalBulkFeet: 0, //总材积
      //   totalGrWe: 0, //总毛重
      //   totalNeWe: 0, //总净重
      //   cu_de: "", //金额单位
      //   totalMoney: 0, //总金额
      //   sumAmountFa_pr: 0, //总出厂价
      //   sumHa_in_qu: 0, //总报出价
    };
  },
  created() {},
  mounted() {
    // console.log(this.summaryData, "汇总数据");
  },
  methods: {
    //确认提交
    handleSubmit(val) {
      this.$emit("openSub", val);
    }
  }
};
</script>
<style scoped lang="less">
.summary {
  position: absolute;
  width: 100%;
  z-index: 1;
  left: 0;
  bottom: 0;
  box-sizing: border-box;
  padding-right: 30px;
  margin-right: 30px;
  .summaryBox {
    display: flex;
    height: 80px;
    border-top: 1px solid #e5e5e5;
    align-items: center;
    box-sizing: border-box;
    background-color: #fff;

    .summaryList {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 20px;
      .item {
        margin-right: 20px;
        display: flex;
        align-items: center;
        // .itemTitle {
        // }
        .price {
          color: #eb1515;
          font-weight: 700;
          font-size: 18px;
        }
      }
    }
    .submit {
      width: 120px;
      margin-left: 10px;
    }
  }
}
</style>
