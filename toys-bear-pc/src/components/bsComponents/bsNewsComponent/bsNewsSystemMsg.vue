<template>
  <div class="bsNewsSystemMsg">
    <div class="head">
      <div class="headName">
        <p>全部（23）</p>
      </div>
    </div>
    <div class="main">
      <ul>
        <li>
          <div class="tableHead">
            <p>小竹熊APP上新功能拉~</p>
            <div class="tableHeadIcon">
              <img src="@/assets/images/delete.png" alt="" />
            </div>
          </div>
          <div class="tablemian">
            <div>
              <p>
                小竹熊app是一款智能商务移动办公平台，小竹熊app功能齐全，提供更安全的数据管理，能满足日常所有的订单查询以及产品查询功能，解决大家日常繁琐的工作，小竹熊app支持单聊
              </p>
              <p>时间：<span>2020-11-21 13:41:35</span></p>
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
  name: "bsNewsSystemMsg",
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.bsNewsSystemMsg {
  width: 80%;
  .head {
    height: 56px;
    background-color: #fff;
    padding-left: 20px;
    display: flex;
    border-radius: 4px;
    .headName {
      width: 100px;
      font-size: 15px;
      font-weight: Bold;
      color: #3368a9;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .main {
    ul li {
      height: 146px;
      background-color: #fff;
      margin-top: 20px;
      border-radius: 4px;
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
      padding: 20px 20px 0 20px;
      display: flex;
      justify-content: space-between;
      p {
        p {
          color: #666666;
          font-size: 14px;
          line-height: 34px;
        }
      }
      .mianBtn {
        width: 100px;
      }
    }
  }
}
</style>
