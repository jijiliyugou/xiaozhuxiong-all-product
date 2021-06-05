<template>
  <div class="bsGridPushComponent">
    <div class="gridBox" v-for="item in plantList" :key="item.index">
      <div class="title">
        <div class="left">
          <el-image
            fit="contain"
            style="width: 100px; height: 100px"
            :src="item.companyLogo"
          >
            <div slot="placeholder" class="errorImg">
              <img
                style="width: 100px; height: 100px"
                src="~@/assets/images/imgError.png"
                alt
              />
            </div>
            <div slot="error" class="errorImg">
              <img
                style="width: 100px; height: 100px"
                src="~@/assets/images/imgError.png"
                alt
              />
            </div>
          </el-image>
        </div>
        <div class="right">
          <h4>{{ item.companyName }}</h4>
          <p>联系电话：{{ item.phoneNumber }}</p>
          <p class="onlineConsultation" @click="toNews(item)">
            <img src="~@/assets/images/consult.png" alt />
            在线咨询
          </p>
        </div>
      </div>
      <div class="cheDetail">
        <div class="checkboxP">
          <el-checkbox
            @change="handleChecked"
            v-model="item.checked"
          ></el-checkbox>
        </div>
        <div class="text" @click="openDetails">
          <p><i class="el-icon-document"></i> 择样明细(0)</p>
          <p><i class="el-icon-time"></i>推送记录(0)</p>
        </div>
      </div>
    </div>
    <div class="kong"></div>
    <div class="kong"></div>
    <div class="kong"></div>
    <div class="kong"></div>
  </div>
</template>

<script>
export default {
  props: {
    plantList: {
      type: Array
    }
  },
  components: {},
  watch: {},
  data() {
    return {};
  },
  methods: {
    // 去详情
    openDetails() {
      this.$common.handlerMsgState({
        msg: "敬请期待",
        type: "warning"
      });
    },
    // 去聊天
    toNews(item) {
      const fd = {
        name: item.companyNumber + "bsNews",
        linkUrl: "/bsIndex/bsNews",
        component: "bsNews",
        refresh: true,
        label: item.companyName,
        value: item
      };
      this.$store.commit("myAddTab", fd);
      this.$router.push("/bsIndex/bsNews");
    },
    // 单选
    handleChecked(value) {
      let arr = this.plantList.filter(item => {
        return item.checked === true;
      });
      this.$emit("update:multipleSelection", arr);
      if (!value) {
        this.$emit("update:checkAll", false);
      }
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.bsGridPushComponent {
  padding-top: 20px;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  .gridBox {
    width: 390px;
    height: 190px;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    margin-bottom: 20px;
    .title {
      height: 150px;
      border-bottom: 1px solid #dcdfe6;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      .left {
        margin: 20px;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
      }
      .right {
        h4 {
          font-weight: 700;
          color: #333333;
          line-height: 30px;
        }
        p {
          font-weight: 400;
          color: #666666;
          line-height: 35px;
          display: flex;
          align-items: center;
          img {
            margin-right: 10px;
            width: 28px;
            height: 28px;
          }
        }
        .onlineConsultation {
          cursor: pointer;
        }
      }
    }
    .cheDetail {
      height: 40px;
      display: flex;
      align-items: center;
      .checkboxP {
        padding-left: 20px;
      }
      .text {
        margin-left: 102px;
        margin-right: 20px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        p {
          cursor: pointer;
          font-weight: 400;
          color: #666666;
          display: flex;
          align-items: center;
          line-height: 19px;
          i {
            padding: 0 5px;
          }
        }
      }
    }
  }
  .kong {
    width: 390px;
    min-width: 390px;
  }
}
</style>
