<template>
  <div class="bsPushIndex">
    <div class="title">
      <div class="left">订单信息</div>
      <div class="right"></div>
    </div>
    <div class="handerTop">
      <div class="flex_t">
        <p>
          {{ orderData.OrderTypeName }}：<span class="pId"
            >{{ orderData.orderNumber }}
          </span>
        </p>
        <!-- <p>
          客户名称：<span>{{ orderData.offerName }} </span>
        </p> -->
        <p>
          业务员：<span style="color: #2d7fe4">{{ orderData.linkman }} </span>
        </p>
        <p>
          状态：<span
            :style="{
              color: orderData.orderStatus === 0 ? '#3368A9' : '#2D7FE4'
            }"
            >{{
              orderData.orderStatus === 0
                ? "未审核"
                : orderData.orderStatus === 1
                ? "审核通过"
                : "审核不通过"
            }}
          </span>
        </p>
      </div>
      <div class="flex_b">
        <p>
          {{ orderData.timeName }}：<span v-if="orderData.createdOn"
            >{{ orderData.createdOn.replace(/T/, " ") }}
          </span>
        </p>
        <div class="right">
          <p class="remark">
            {{ orderData.remarkName }}：<span>{{ orderData.remark }} </span>
          </p>
        </div>
      </div>
    </div>
    <div class="bsPushTable">
      <div class="title">
        <div class="left">厂商列表({{ tableData.length }})</div>
        <div class="right">
          <div
            :class="{ grid: true, active: isGrid === 'bsGridPushComponent' }"
            @click="handerIsGrid('bsGridPushComponent')"
          ></div>
          <!-- 列表版本未完成 -->
          <!-- <div
            :class="{ column: true, active: isGrid === 'bsTablePushComponent' }"
            @click="handerIsGrid('bsTablePushComponent')"
          ></div> -->
        </div>
      </div>
      <div class="tableBox">
        <!-- 产品列表 -->
        <component
          ref="listComponent"
          :is="isGrid"
          :plantList="tableData"
          :multipleSelection.sync="multipleSelection"
          :checkAll.sync="checkAll"
        ></component>
      </div>
    </div>
    <div
      :class="{
        PushFooter: true,
        PushFooterBorder: isGrid === 'bsGridPushComponent'
      }"
    >
      <div class="left">
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange"
          >全选</el-checkbox
        >
      </div>
      <div class="right">
        <p>已选择推送厂商：{{ multipleSelection.length }}</p>
        <el-button
          size="medium"
          type="primary"
          class="el-icon-position"
          @click="handlePushDialog(true)"
        >
          推送</el-button
        >
      </div>
    </div>

    <el-dialog :title="title" :visible.sync="pushDialog" width="800px">
      <bsPushDialogComponent
        :item="item"
        :multipleSelection="multipleSelection"
        :orderData="orderData"
        @handlePushDialog="handlePushDialog"
        @handleCheckAllClosee="handleCheckAllClosee"
      ></bsPushDialogComponent>
    </el-dialog>
  </div>
</template>
<script>
import bsGridPushComponent from "@/components/commonComponent/pushDetailsComponent/bsGridPushComponent.vue";
import bsTablePushComponent from "@/components/commonComponent/pushDetailsComponent/bsTablePushComponent.vue";
import bsPushDialogComponent from "@/components/commonComponent/pushDetailsComponent/bsPushDialogComponent.vue";
export default {
  name: "bsPushIndex",
  components: {
    bsGridPushComponent,
    bsTablePushComponent,
    bsPushDialogComponent
  },
  props: {
    item: {
      type: Object
    }
  },

  watch: {
    // multipleSelection: {
    //   handler(newName, oldName) {
    //     console.log(newName, oldName);
    //   },
    // },
  },
  data() {
    return {
      isGrid: "bsGridPushComponent",
      checkAll: false,
      pushDialog: false,
      orderData: {
        orderPushType: null
      },
      itemList: {},
      title: null,

      multipleSelection: [],
      tableData: []
    };
  },
  created() {
    console.log(this.item, "点击推送按钮传过来的数据");
    switch (this.item.label) {
      case "展厅业务推送":
        this.title = "展厅业务推送";
        this.orderData = {
          OrderTypeName: "择样单号",
          timeName: "择样时间",
          remarkName: "择样备注",
          // offerName: this.item.client_na,
          linkman: this.item.orgPersonnelName,
          status: this.item.orderStatus,
          createdOn: this.item.createdOn,
          remark: this.item.pushContent,
          orderPushType: 1,
          orderNumber: this.item.orderNumber
        };
        break;
      case "报价推送":
        this.title = "报价推送";
        this.orderData = {
          OrderTypeName: "报价单号",
          timeName: " 报价时间",
          remarkName: "报价备注",
          // offerName: this.item.customerName, //客户名称
          linkman: this.item.linkman, //业务员
          orderStatus: this.item.status, //状态
          createdOn: this.item.createdOn, //时间
          remark: this.item.title, //备注
          orderPushType: 2, //推送类型
          orderNumber: this.item.offerNumber //单号
        };
        break;
      case "采购推送":
        this.title = "采购推送";
        this.orderData = {
          OrderTypeName: "采购单号",
          timeName: " 采购时间",
          remarkName: "采购备注",
          // offerName: this.item.fromCompanyName, //客户名称
          linkman: this.item.orgPersonnelName, //业务员
          orderStatus: this.item.readStatus, //状态
          createdOn: this.item.createdOn, //时间

          remark: this.item.pushContent, //备注
          orderPushType: 4, //推送类型
          orderNumber: this.item.offerNumber //单号
        };
        break;
      default:
        this.$common.handlerMsgState({
          msg: "该订单无法推送",
          type: "danger"
        });
    }
  },
  mounted() {
    this.getSendCompanyList();
  },
  methods: {
    // 根据订单获取可以发送的接收者
    async getSendCompanyList() {
      const res = await this.$http.post("/api/SendCompanyList", this.orderData);
      if (res.data.result.code === 200) {
        for (let i = 0; i < res.data.result.item.length; i++) {
          res.data.result.item[i].checked = false;
        }
        this.tableData = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },

    // 切换产品列表样式
    handerIsGrid(type) {
      this.isGrid = type;
    },
    // 关闭全选
    handleCheckAllClosee() {
      this.checkAll = false;
      this.multipleSelection = [];
      if (this.isGrid === "bsGridPushComponent") {
        this.$refs.listComponent.plantList.forEach(row => {
          row.checked = false;
        });
      } else {
        this.$refs.listComponent.$refs.multipleTable.clearSelection();
      }
    },
    //全选按钮
    handleCheckAllChange(val) {
      if (val) {
        //点击全选后数据所有选择的数据存到这个数组里边
        this.multipleSelection = this.tableData;
        if (this.isGrid === "bsGridPushComponent") {
          this.$refs.listComponent.plantList.forEach(row => {
            row.checked = true;
          });
        } else {
          this.$refs.listComponent.plantList.forEach(row => {
            this.$refs.listComponent.$refs.multipleTable.toggleRowSelection(
              row,
              true
            );
          });
        }
      } else {
        this.multipleSelection = [];
        if (this.isGrid === "bsGridPushComponent") {
          this.$refs.listComponent.plantList.forEach(row => {
            row.checked = false;
          });
        } else {
          this.$refs.listComponent.$refs.multipleTable.clearSelection();
        }
      }
    },

    // 打开/关闭推送弹框
    handlePushDialog(flag) {
      if (this.multipleSelection.length > 0) {
        this.pushDialog = flag;
      } else {
        this.$common.handlerMsgState({
          msg: "请勾选推送厂商",
          type: "warning"
        });
      }
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsPushIndex {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
  .title {
    height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &::before {
      width: 4px;
      height: 14px;
      background-color: #3368a9;
      position: absolute;
      left: 0;
      top: 50%;
      content: "";
      transform: translate(0, -50%);
    }
  }
  .handerTop {
    padding-top: 26px;
    .flex_t {
      display: flex;
      align-content: center;
      margin-bottom: 10px;
      p {
        // width: 260px;
        min-width: 270px;
        margin-right: 30px;
        font-weight: 400;
        .pId {
          font-weight: 700;
          font-size: 15px;
        }
      }
    }
    .flex_b {
      display: flex;
      align-content: center;
      align-items: center;
      p {
        margin-right: 30px;
        min-width: 270px;
      }
      .right {
        flex: 1;
        display: flex;
        align-items: center;
        .remark {
          flex: 1;
        }
      }
    }
  }
  .bsPushTable {
    margin-top: 20px;
    .right {
      display: flex;
      width: 80px;
      min-width: 80px;
      .searchTime {
        margin-right: 40px;
        span {
          color: #3368a9;
        }
      }
      .grid,
      .column {
        width: 17px;
        height: 17px;
        cursor: pointer;
      }
      .grid {
        margin-right: 25px;
        background: url("~@/assets/images/gridIcon.png") no-repeat center;
        background-size: contain;
        &.active {
          background: url("~@/assets/images/gridActiveIcon.png") no-repeat
            center;
          background-size: contain;
        }
      }
      .column {
        background: url("~@/assets/images/columnIcon.png") no-repeat center;
        background-size: contain;
        &.active {
          background: url("~@/assets/images/columnActiveIcon.png") no-repeat
            center;
          background-size: contain;
        }
      }
    }
  }
  .PushFooter {
    // margin-top: 10px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    .right {
      display: flex;
      align-items: center;
      p {
        margin: 0 20px;
        color: #333333;
      }
    }
  }
  .PushFooterBorder {
    border-top: 1px solid #dcdfe6;
  }
}
</style>
