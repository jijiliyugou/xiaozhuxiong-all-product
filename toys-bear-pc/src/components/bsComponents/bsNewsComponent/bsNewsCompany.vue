<template>
  <div class="bsNewsCompany">
    <div class="headTop">
      <div :class="{ tabs: true, active: isDiyu === 0 }" @click="checkTabs(0)">
        全部（23）
      </div>
      <div :class="{ tabs: true, active: isDiyu === 1 }" @click="checkTabs(1)">
        消息通知 (10)
      </div>
    </div>
    <div class="main">
      <ul>
        <li>
          <div class="tableHead">
            <p>采购单号：S123455678912345</p>
            <div class="tableHeadIcon">
              <img src="@/assets/images/delete.png" alt="" />
            </div>
          </div>
          <div class="tablemian">
            <div>
              <p>公司名称：<span> 宏发外贸公司 </span></p>
              <p>择样时间：<span>2020-11-21 13:41:35</span></p>
            </div>
            <div>
              <p>本次代号：<span> 107362 </span></p>
              <p>备注：<span>1231231</span></p>
            </div>
            <div>
              <p :style="{ color: colorId === '1' ? '#666' : '#3368A9' }">
                状态: <span>未确认</span>
              </p>
            </div>
            <div>
              <p></p>
              <p>报价备注：尽快回复，大批量采购</p>
            </div>
            <div class="mianBtn">
              <el-button style="color:#3368A9;border-color: #3368A9;"
                >查看详情</el-button
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "bsNewsCompany",
  data() {
    return {
      colorId: "2",
      isDiyu: 0
    };
  },
  methods: {
    // 切换专区
    checkTabs(num) {
      this.isDiyu = num;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.bsNewsCompany {
  width: 80%;
  .headTop {
    height: 56px;
    font-size: 15px;
    box-sizing: border-box;
    background-color: #fff;
    padding-left: 20px;
    display: flex;
    border-radius: 4px;
    .tabs {
      width: 100px;
      height: 55px;
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
  .main {
    ul li {
      border-radius: 4px;
      height: 146px;
      background-color: #fff;
      margin-top: 20px;
    }
    ul li .tableHead {
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;
      font-size: 16px;
      color: #333;
      border-bottom: 2px solid #dcdfe6;
      .tableHeadIcon {
        width: 50px;
        min-width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        cursor: pointer;
      }
    }
    ul li .tablemian {
      display: flex;
      justify-content: space-between;
      padding: 20px 20px 0 20px;
      p {
        color: #666666;
        font-size: 14px;
        line-height: 34px;
      }
      .mianBtn {
        width: 100px;
      }
    }
  }
}
</style>
