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
            @change="handleChecked($event, item.companyNumber)"
            v-model="item.checked"
          ></el-checkbox>
        </div>
        <div class="text">
          <p @click="openBsSampleDetail(item)">
            <i class="el-icon-document"></i> 择样明细({{ item.sampleDetail }})
          </p>
          <p @click="openBsPushRecord(item)">
            <i class="el-icon-time"></i>推送记录({{ item.totalCount }})
          </p>
        </div>
      </div>
    </div>
    <div class="kong"></div>
    <div class="kong"></div>
    <div class="kong"></div>
    <div class="kong"></div>
    <el-dialog
      title="择样明细"
      :visible.sync="sampleDetailDialog"
      v-if="sampleDetailDialog"
      width="1620px"
      :before-close="closeSampleDetailDialog"
    >
      <bsSampleDetailComponent
        :sampleDetailData="sampleDetailData"
        :orderData="orderData"
      ></bsSampleDetailComponent>
    </el-dialog>

    <el-dialog
      title="推送记录"
      :visible.sync="pushRecordDialog"
      width="800px"
      :before-close="closePushRecordDialog"
    >
      <bsPushRecordComponent
        :supplierNumber="supplierNumber"
        :pushRecordData="pushRecordData"
      ></bsPushRecordComponent>
    </el-dialog>
  </div>
</template>

<script>
import bsSampleDetailComponent from "@/components/commonComponent/pushDetailsComponent/bsSampleDetailComponent.vue";
import bsPushRecordComponent from "@/components/commonComponent/pushDetailsComponent/bsPushRecordComponent.vue";
export default {
  components: { bsSampleDetailComponent, bsPushRecordComponent },
  props: {
    plantList: {
      type: Array
    },
    orderData: {
      type: Object
    }
  },
  watch: {},
  data() {
    return {
      sampleDetailDialog: false,
      pushRecordDialog: false,
      supplierNumber: null,
      pushRecordData: [],
      sampleDetailData: []
    };
  },
  methods: {
    //打开推送记录弹框
    async openBsPushRecord(val) {
      // this.$common.handlerMsgState({
      //   msg: "敬请期待",
      //   type: "warning"
      // });
      this.supplierNumber = val.companyNumber;
      const fd = {
        order: this.orderData.orderNumber,
        supplierNumber: val.companyNumber,
        PageSize: 999,
        PageIndex: 1
      };
      const res = await this.$http.post("/api/getSupplierPushRecord", fd);
      if (res.data.result.code === 200) {
        this.pushRecordData = res.data.result.item.items;
        this.pushRecordDialog = true;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    //关闭推送记录弹框
    closePushRecordDialog() {
      this.pushRecordDialog = false;
    },
    //打开择样明细弹框
    async openBsSampleDetail(val) {
      // this.$common.handlerMsgState({
      //   msg: "敬请期待",
      //   type: "warning"
      // });
      const fd = {
        id: this.orderData.erpOrderID,
        offerNumber: this.orderData.orderNumber,
        supplierNumber: val.companyNumber,
        orderPushType: this.orderData.orderPushType,
        PageSize: 999,
        PageIndex: 1
      };
      // 获取择样明细列表
      const res = await this.$http.post("/api/getQuotationOrderDetail", fd);
      if (res.data.result.code === 200) {
        this.sampleDetailData = res.data.result.item;
        this.sampleDetailDialog = true;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    //关闭择样明细弹框
    closeSampleDetailDialog() {
      this.sampleDetailDialog = false;
    },
    // 去聊天
    toNews(item) {
      console.log(item);
      this.$common.handlerMsgState({
        msg: "敬请期待",
        type: "warning"
      });
      // const fd = {
      //   name: item.companyNumber + "bsNews",
      //   linkUrl: "/bsIndex/bsNews",
      //   component: "bsNews",
      //   refresh: true,
      //   label: item.companyName,
      //   value: item
      // };
      // this.$store.commit("myAddTab", fd);
      // this.$router.push("/bsIndex/bsNews");
    },
    // 单选
    handleChecked(event, companyNumber) {
      this.$emit("updateMultipleSelection", event, companyNumber);
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
