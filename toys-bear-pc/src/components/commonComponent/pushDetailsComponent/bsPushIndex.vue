<template>
  <div class="bsPushIndex">
    <div class="title">
      <div class="left">订单信息</div>
      <div class="right"></div>
    </div>
    <div class="handerTop">
      <div class="flex_t">
        <p>
          采购单号：<span class="pId">{{ itemList.offerNumber }} </span>
        </p>
        <p>
          客户名称：<span>{{ itemList.customerName }} </span>
        </p>
        <p>
          业务员：<span style="color: #2d7fe4">{{ itemList.linkman }} </span>
        </p>
        <p>
          状态：<span
            :style="{
              color: itemList.status == 0 ? '#3368A9' : '#2D7FE4'
            }"
            >{{
              itemList.status == 0
                ? "未审核"
                : itemList.status == 1
                ? "审核通过"
                : "审核不通过"
            }}
          </span>
        </p>
      </div>
      <div class="flex_b">
        <p>
          报价时间：<span v-if="itemList.createdOn"
            >{{ itemList.createdOn.replace(/T/, " ") }}
          </span>
        </p>
        <div class="right">
          <p class="remark">
            报价备注：<span>{{ itemList.title }} </span>
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
          <div
            :class="{ column: true, active: isGrid === 'bsTablePushComponent' }"
            @click="handerIsGrid('bsTablePushComponent')"
          ></div>
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
    <div class="PushFooter">
      <div class="left">
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange"
          >全选</el-checkbox
        >
      </div>
      <div class="right">
        <p>已选择推送厂家：{{ multipleSelection.length }}</p>
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
    <bsPushDialogComponent
      @handlePushDialog="handlePushDialog"
      :pushDialog="pushDialog"
    ></bsPushDialogComponent>
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
      itemList: {},
      multipleSelection: [],
      tableData: [
        {
          id: 1,
          checked: false,
          name: "腾彩玩具有限公司",
          phone: 222,
          phoneNumber: 1232132
        },
        {
          id: 2,
          name: "玩具",
          checked: false,
          phone: 222,
          phoneNumber: 1232132
        },
        {
          id: 3,
          name: "有限公司",
          checked: false,
          phone: 222,
          phoneNumber: 1232132
        }
      ]
    };
  },
  methods: {
    // 切换产品列表样式
    handerIsGrid(type) {
      this.isGrid = type;
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
      this.pushDialog = flag;
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
        width: 235px;
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
        width: 235px;
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
    margin-bottom: 80px;
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
    display: flex;
    justify-content: space-between;
    padding: 30px;
    .right {
      display: flex;
      align-items: center;
      p {
        margin: 0 20px;
        color: #333333;
      }
    }
  }
}
</style>
