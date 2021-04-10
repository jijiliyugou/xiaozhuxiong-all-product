<template>
  <div class="bsNewsMessageList">
    <div class="chatMain">
      <div class="head">
        <img src="@/assets/images/3Dicon.png" alt="" />
        <p>小竹熊大家族</p>
        <i class="el-icon-more"></i>
      </div>
      <div class="center">
        <div class="item left">
          <img class="header-img" src="@/assets/images/3Dicon.png" />
          <span class="message">1231312311</span>
        </div>
        <div class="chart-timer">
          2019-5-17
        </div>
        <div class="item right">
          <img class="header-img" src="@/assets/images/3Dicon.png" />
          <span class="message">哈哈哈哈哈</span>
        </div>
        <div class="item left">
          <img class="header-img" src="@/assets/images/3Dicon.png" />
          <span class="message">87987987987 </span>
        </div>
      </div>
      <div class="footer">
        <div class="footerHead">
          <div><img src="@/assets/images/tupian.png" alt="" /></div>
          <div><img src="@/assets/images/biaoq.png" alt="" /></div>
          <div><img src="@/assets/images/tupian.png" alt="" /></div>
        </div>
        <div class="input-box">
          <input type="text" />
          <el-button type="primary">发送</el-button>
        </div>
      </div>
    </div>
    <div class="chattingRecords">
      <div class="chattingTop">
        <p>聊天记录</p>
      </div>
      <div class="title">
        <div
          :class="{ tabs: true, active: isDiyu === 0 }"
          @click="checkTabs(0)"
        >
          全部
        </div>
        <div
          :class="{ tabs: true, active: isDiyu === 1 }"
          @click="checkTabs(1)"
        >
          全部
        </div>
        <div
          :class="{ tabs: true, active: isDiyu === 2 }"
          @click="checkTabs(2)"
        >
          视频
        </div>
        <div
          :class="{ tabs: true, active: isDiyu === 3 }"
          @click="checkTabs(3)"
        >
          链接
        </div>
      </div>
      <div class="chattingList">
        <div class="recordData">
          <div class="cecorLeft">
            <img src="@/assets/images/imgError.png" alt="" />
          </div>
          <div class="cecorRight">
            <div class="cecorHead">
              <p>名字</p>
              <p>28分钟前</p>
            </div>
            <div class="cecorMain">
              <p>聊天消息</p>
              <!-- <img src="" alt="" /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "bsNewsMessageList",
  props: {},
  data() {
    return {
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
.bsNewsMessageList {
  width: 80%;
  display: flex;
  .chatMain {
    border-radius: 4px;
    flex-grow: 1;
    background: #ffffff;
    .head {
      height: 54px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #dcdfe6;
      img {
        width: 30px;
        height: 30px;
        margin: 0 13px 0 20px;
      }
      p {
        flex: 1;
        font-size: 15px;
        font-weight: 700;
        color: #333333;
        line-height: 34px;
      }
      i {
        width: 50px;
        height: 100%;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .center {
      height: 540px;
      padding-top: 20px;
      box-sizing: border-box;
      .item {
        display: flex;
        margin-bottom: 10px;
      }
      .left {
        flex-direction: row;
        padding-left: 25px;
      }

      .right {
        flex-direction: row-reverse;
        padding-right: 35px;
      }

      .right .message {
        margin-right: 10px;
      }
      .left .message {
        margin-left: 10px;
      }

      .header-img {
        width: 50px;
        height: 50px;
        border-radius: 100px;
      }
      .chart-timer {
        text-align: center;
        color: #616161;
        font-size: 13px;
      }
      .message {
        background: #f5f7fa;
        border: 1px solid #e6e9ee;
        border-radius: 10px;
        display: flex;
        min-height: 25px;
        padding: 9px 10px;
        align-items: center;
        color: #222121;
      }
    }
    .footer {
      height: 180px;
      box-sizing: border-box;
      border-top: 1px solid #dcdfe6;
      padding: 0 20px 20px;
      .footerHead {
        display: flex;
        align-items: center;
        height: 46px;
        img {
          width: 18px;
          height: 18px;
          margin-right: 20px;
        }
      }
      .input-box {
        position: relative;
        border: 1px solid #dcdfe6;
        height: 115px;
        box-sizing: border-box;
        input {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          padding: 5px;
          box-sizing: border-box;
        }
        .el-button--primary {
          position: absolute;
          right: 12px;
          bottom: 12px;
          width: 80px;
          height: 36px;
          background: #3368a9;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 400;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
  .chattingRecords {
    width: 458px;
    height: 780px;
    background: #ffffff;
    border-radius: 4px;
    margin-left: 20px;
    .chattingTop {
      padding-left: 20px;
      height: 54px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #dcdfe6;
      p {
        font-size: 15px;
        font-weight: 700;
        color: #333333;
        line-height: 34px;
      }
    }
    .title {
      height: 50px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #dcdfe6;
      .tabs {
        width: 80px;
        height: 50px;
        box-sizing: border-box;
        border-bottom: 2px solid transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        margin: 0 10px;
        cursor: pointer;
        &.active {
          font-weight: 600;
          border-color: #3368a9;
          color: #3368a9;
        }
      }
    }
    .chattingList {
      padding: 20px;
      box-sizing: border-box;

      .recordData {
        background: #f6f8f9;
        border-radius: 4px;
        padding: 15px 18px;
        display: flex;
        .cecorLeft {
          width: 40px;
          height: 40px;
          margin-right: 8px;
          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid #dcdfe6;
            background: rgba(0, 0, 0, 0);
          }
        }
        .cecorRight {
          width: 100%;
          .cecorHead {
            display: flex;
            justify-content: space-between;
            p {
              height: 17px;
              font-size: 13px;
              font-weight: 400;
              text-align: left;
              color: #999999;
              line-height: 19px;
            }
          }
          .cecorMain {
            padding-top: 10px;
            box-sizing: border-box;
            p {
              color: #666666;
              font-size: 14px;
              line-height: 22px;
            }
          }
        }
      }
    }
  }
}
</style>
