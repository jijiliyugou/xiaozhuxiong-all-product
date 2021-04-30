<template>
  <div class="bsGridPushComponent">
    <div class="gridBox" v-for="item in plantList" :key="item.index">
      <div class="title">
        <div class="left">
          <el-image
            fit="contain"
            style="width: 100px; height: 100px"
            :src="item.imgUrl"
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
          <h4>{{ item.name }}</h4>
          <p>联系电话：{{ item.phoneNumber }}</p>
          <p class="onlineConsultation" @click="toNews">
            <img src="~@/assets/images/consult.png" alt />
            在线咨询
          </p>
        </div>
      </div>
      <div class="cheDetail">
        <p>
          <el-checkbox
            @change="handleChecked"
            v-model="item.checked"
          ></el-checkbox>
        </p>
        <p><i class="el-icon-document"></i> 择样明细(4)</p>
        <p><i class="el-icon-time"></i>推送记录(0)</p>
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
    // 去聊天
    toNews() {
      const fd = {
        name: this.companyInfo.companyNumber + "bsNews",
        linkUrl: "/bsIndex/bsNews",
        component: "bsNews",
        refresh: true,
        label: this.companyInfo.companyName,
        value: this.companyInfo
      };
      this.$router.push("/bsIndex/bsNews");
      this.$store.commit("myAddTab", fd);
    },
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
  padding: 30px 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .gridBox {
    width: 390px;
    height: 190px;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
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
      justify-content: space-around;
      p {
        font-weight: 400;
        color: #666666;
        display: flex;
        align-items: center;
        line-height: 19px;
      }
    }
  }
  .kong {
    width: 390px;
    min-width: 390px;
  }
}
</style>
