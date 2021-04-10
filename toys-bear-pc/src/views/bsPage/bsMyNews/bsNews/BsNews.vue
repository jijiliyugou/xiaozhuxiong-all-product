<template>
  <div>敬请期待</div>
  <!-- <div class="bsNews">
    <div class="bsNewsLeft">
      <div>
        <h3>业务消息</h3>
        <ul class="exhibition">
          <li @click="handerIsGrid('bsNewsExhibition')">
            <div class="exhibition_left">
              <div class="_leftImg">
                <img src="@/assets/images/gallery.png" alt="" />
              </div>
            </div>
            <div class="exhibition_right">
              <h4>展厅业务</h4>
              <p>您有0个展厅业务需要处理</p>
            </div>
          </li>
          <li @click="handerIsGrid('bsNewsCompany')">
            <div class="exhibition_left">
              <div class="_leftImg">
                <img src="@/assets/images/manufacturer.png" alt="" />
              </div>
            </div>
            <div class="exhibition_right">
              <h4>公司业务</h4>
              <p>您有0个公司业务需要处理</p>
            </div>
          </li>
          <li @click="handerIsGrid('bsNewsFirm')">
            <div class="exhibition_left">
              <div class="_leftImg">
                <img src="@/assets/images/manufacturer.png" alt="" />
              </div>
            </div>
            <div class="exhibition_right">
              <h4>厂商业务</h4>
              <p>您有0个厂商业务需要处理</p>
            </div>
          </li>
          <li @click="handerIsGrid('bsNewsSystemMsg')">
            <div class="exhibition_left">
              <div class="_leftImg">
                <img src="@/assets/images/system.png" alt="" />
              </div>
            </div>
            <div class="exhibition_right">
              <h4>系统消息</h4>
              <p>您有0条消息需要处理</p>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <h3 style=" border-bottom: 1px solid #e5e5e5;">其他消息</h3>
        <ul class="exhibition">
          <li
            v-for="list in msgList"
            :key="list.id"
            @click="
              handerIsGrid('bsNewsMessageList');
              handerMsgList(list);
            "
          >
            <div class="exhibition_left">
              <div class="_leftImg">
                <img :src="list.img" alt="" />
              </div>
            </div>
            <div class="exhibition_right">
              <h4>{{ list.name }}</h4>
              <p>{{ list.message }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <component :is="isGrid" :dataName="dataList"></component>
  </div> -->
</template>

<script>
//展厅业务
// import bsNewsExhibition from "@/components/bsComponents/bsNewsComponent/bsNewsExhibition";
// //公司业务
// import bsNewsCompany from "@/components/bsComponents/bsNewsComponent/bsNewsCompany";
// //系统消息
// import bsNewsSystemMsg from "@/components/bsComponents/bsNewsComponent/bsNewsSystemMsg";
// //厂商业务
// import bsNewsFirm from "@/components/bsComponents/bsNewsComponent/bsNewsFirm";
// //消息列表
// import bsNewsMessageList from "@/components/bsComponents/bsNewsComponent/bsNewsMessageList";
export default {
  name: "bsNews",
  // components: {
  //   bsNewsExhibition,
  //   bsNewsCompany,
  //   bsNewsSystemMsg,
  //   bsNewsFirm,
  //   bsNewsMessageList
  // },
  data() {
    return {
      colorId: "2",
      isGrid: "bsNewsMessageList",
      isDiyu: "0",
      dataList: [],
      msgList: [
        {
          id: 1,
          name: "小竹熊大家族",
          img: require("@/assets/images/system.png"),
          message: "收到"
        },
        {
          id: 2,
          name: "耀昇展厅",
          img: require("@/assets/images/system.png"),
          message: "收到"
        },
        {
          id: 3,
          name: "zs3",
          img: require("@/assets/images/system.png"),
          message: "大概是多少？"
        }
      ]
    };
  },
  methods: {
    // 切换专区
    handerIsGrid(type) {
      this.isGrid = type;
    },
    handerMsgList(val) {
      console.log(val, "22222s");
      console.log(typeof val);
      // this.dataList = val;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.bsNews {
  min-height: 100%;
  background-color: #f1f2f6;
  display: flex;
  .bsNewsLeft {
    margin-right: 20px;
    background-color: #fff;
    width: 300px;
    height: 780px;
    opacity: 1;
    border-radius: 6px;
    h3 {
      height: 55px;
      font-size: 15px;
      font-weight: 700;
      padding-left: 20px;
      line-height: 55px;
    }
    .exhibition {
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
    }
    .exhibition li:hover {
      background-color: #eff6ff;
    }
    .exhibition li {
      height: 70px;
      display: flex;
      padding-left: 20px;
      .exhibition_left {
        width: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        ._leftImg {
          border-radius: 50%;
          img {
            width: 50px;
            height: 50px;
          }
        }
      }
      .exhibition_right {
        padding: 13px 0 0 15px;
        h4 {
          font-weight: bold;
          height: 20px;
          line-height: 20px;
          color: #333;
          font-size: 14px;
        }
        p {
          color: #999;
        }
      }
    }
  }
  .bsNewsRight {
    width: 80%;
    margin-left: 20px;
    .right_top {
      height: 56px;
      background-color: #fff;
      padding-left: 20px;
      display: flex;
      ._topAll {
        width: 100px;
        font-size: 15px;
        font-weight: Bold;
        color: #3368a9;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .businessList {
        width: 200px;
        font-size: 15px;
        color: #666666;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .right_bottom {
      ul li {
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
        padding: 20px 20px 0 20px;
        p {
          color: #666666;
          font-size: 14px;
          line-height: 34px;
        }
        .mianName {
          margin-right: 150px;
        }
        .mianCode {
          flex: 1;
          .mianCode_top {
            display: flex;
            p:nth-child(1) {
              margin-right: 200px;
            }
          }
        }
      }
    }
  }
}
</style>
