<!--
 * @Description: 
 * @Author: gaojiahao
 * @Date: 2021-05-14 14:44:05
 * @FilePath: \projectd:\LittleBearPC\toys-bear-pc\src\views\bsPage\bsBusinessManage\bsDataTotal\bsDataTotal.vue
 * @LastEditTime: 2021-05-15 12:38:13
 * @LastEditors: sueRimn
 * @Descripttion: 
 * @version: 1.0.0
-->
<template>
  <div class="bsDataTotal">
    <div class="headTop">
      <div
        :class="{ tabs: true, active: isDiyu === 0 }"
        @click="checkTabsAll(0)"
      >
        来访统计
      </div>
      <div
        :class="{ tabs: true, active: isDiyu === 1 }"
        @click="checkTabsAll(1)"
      >
        择样统计
      </div>
      <div
        :class="{ tabs: true, active: isDiyu === 2 }"
        @click="checkTabsAll(2)"
      >
        择样排行
      </div>
      <div
        :class="{ tabs: true, active: isDiyu === 3 }"
        @click="checkTabsAll(3)"
      >
        关注我
      </div>
    </div>
    <VisitTotal v-if="isDiyu == 0"> </VisitTotal>
    <SampleTotal v-if="isDiyu == 1"></SampleTotal>
  </div>
</template>
<script>
import VisitTotal from "@/views/bsPage/bsBusinessManage/bsDataTotal/bsDataTotalComponent/visitTotal.vue";
import SampleTotal from "@/views/bsPage/bsBusinessManage/bsDataTotal/bsDataTotalComponent/sampleTotal.vue";
export default {
  name: "bsDataTotal",
  components: {
    VisitTotal,
    SampleTotal
  },
  data() {
    return {
      isDiyu: 0
    };
  },
  methods: {
    //checkTabsAll(value) {},
    //切换产品类型
    checkTabsAll(num) {
      this.isDiyu = num;
      if (this.isDiyu === 0) {
        // this.getProductListPageAll();
      } else {
        // this.getProductListPageEcommend();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.bsDataTotal {
  min-height: 100%;
  background-color: #fff;
  // padding: 0 20px;
  .headTop {
    height: 50px;
    font-size: 15px;
    box-sizing: border-box;
    background-color: #fff;
    padding-left: 20px;
    display: flex;
    border-radius: 4px;
    .tabs {
      width: 100px;
      height: 50px;
      box-sizing: border-box;
      border-bottom: 2px solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      cursor: pointer;
      &.active {
        font-weight: 700;
        border-color: #3368a9;
        color: #3368a9;
      }
    }
  }
}
</style>
