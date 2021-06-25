<template>
  <div class="shareShop">
    <div class="tree">
      <el-tree
        :data="supplierData"
        show-checkbox
        :props="props"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        @check-change="handleCheckChange"
      >
        >
        <span class="custom-tree-node" slot-scope="{ data }">
          <div class="treeBox">
            <div class="treeLeft">{{ data.hallName }}</div>
            <div class="treeRight" v-if="data.productCount">
              产品数：{{ data.productCount }}
            </div>
          </div>
        </span>
      </el-tree>
    </div>
    <div class="xian"></div>
    <el-form
      label-width="100px"
      ref="FormRules"
      :model="fromData"
      :rules="FormRules"
    >
      <el-form-item
        label="报价利润:"
        prop="profit"
        label-width="100px"
        style="margin-right:10px"
      >
        <el-input
          maxlength="30"
          size="small"
          style="width:250px"
          onkeyup="value=value.replace(/[^\d.]/g,'')"
          v-model="fromData.profit"
        >
          <span slot="suffix">%</span>
        </el-input>
      </el-form-item>
    </el-form>
    <center style="margin-top:20px">
      <template>
        <el-button type="primary" @click="handleShare">确定</el-button>
        <el-button
          style="margin-left: 30px;"
          plain
          @click="$emit('closeShareShop')"
          >取消</el-button
        >
      </template>
    </center>
    <el-dialog title="分享成功" :visible.sync="IsShield" width="560px">
      <div class="shieidSucceed">
        <p>店铺链接：</p>
        <p>https://element.eleme.cn/#/zh-CN/component/installation</p>
      </div>
      <center style="margin-top:20px">
        <template>
          <el-button type="primary" @click="copyUrl">复制链接</el-button>
          <el-button style="margin-left: 30px;" plain @click="IsShield = false"
            >取消</el-button
          >
        </template>
      </center>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      IsShield: false,
      fromData: {},
      FormRules: {
        profit: [{ required: true, message: "请输入利润", trigger: "blur" }]
      },
      supplierData: [],
      props: {
        children: "supplierList",
        label: "hallName"
      }
    };
  },
  created() {
    this.GetSupplierListByHall();
  },
  mounted() {},
  methods: {
    // 产品选择展厅下厂商列表
    async GetSupplierListByHall() {
      const res = await this.$http.post("/api/GetSupplierListByHall");
      if (res.data.result.code === 200) {
        this.supplierData = res.data.result.item;
        console.log(res.data.result.item);
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 厂商分享确定分享
    async handleShare() {
      this.$refs.FormRules.validate(async valid => {
        if (valid) {
          for (const key in this.fromData) {
            if (
              this.fromData[key] == "undefined" ||
              this.fromData[key] == null ||
              this.fromData[key] == "" ||
              this.fromData[key] == undefined ||
              this.fromData[key] == "null"
            ) {
              delete this.fromData[key];
            }
          }
          const res = await this.$http.post(
            "/api/CreateSupplierShare",
            this.fromData
          );
          if (res.data.result.code === 200) {
            this.$emit("closeShareShop");
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        }
      });
    },
    handerRadioVal(val) {
      console.log(val, "val");
    },
    // tree选中
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    // 复制链接
    copyUrl() {}
  }
};
</script>
<style scoped lang="less">
.shareShop {
  .tree {
    min-height: 300px;
    .treeBox {
      width: 400px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .treeLeft {
        flex: 1;
        color: #333;
      }
      .treeRight {
        width: 100px;
        color: #3368a9;
      }
    }
  }
  .xian {
    width: 100%;
    height: 1px;
    background: #e5e5e5;
    margin-bottom: 20px;
  }
  .shieidSucceed {
  }
}
</style>
