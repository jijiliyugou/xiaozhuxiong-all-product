<template>
  <div class="bsSampleSearch">
    <div class="searchBox">
      <el-form
        :inline="true"
        :rules="addInfoRules"
        :model="clienFormData"
        class="demo-form-inline"
      >
        <div class="left">
          <el-form-item label="报价客户：" prop="linkman">
            <el-select
              :disabled="isEdit"
              style="width: 190px; margin: 0 15px;"
              v-model="clienFormData.customerId"
              placeholder="请输入/选择客户"
            >
              <el-option
                v-for="item in clientList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item style=" margin: 0 24px  0 24px;">
            <el-button
              class="el-icon-plus"
              type="primary"
              @click.stop="openAddMyClient"
            >
              新增客户</el-button
            >
          </el-form-item>
          <el-form-item label="报价备注：" prop="title">
            <el-input
              :disabled="isEdit"
              style="width: 586px; margin: 0 15px;"
              v-model="clienFormData.title"
              maxlength="50"
              placeholder=" "
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="默认公式：" prop="defaultFormula">
            <el-select
              style="width: 120px; margin: 0 15px;"
              :disabled="isEdit"
              v-model="clienFormData.defaultFormula"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, i) in customerTemplate"
                :key="i"
                :label="item.name"
                :value="JSON.stringify(item)"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="利润率：" prop="profit">
            <el-input
              style="width: 120px; margin: 0 15px;"
              :disabled="isEdit"
              v-model="clienFormData.profit"
              placeholder="0"
            >
              <span slot="suffix">%</span></el-input
            >
          </el-form-item>
          <el-form-item label="汇率：" prop="exchange">
            <el-input
              style="width: 120px; margin: 0 15px;"
              :disabled="isEdit"
              v-model="clienFormData.exchange"
              placeholder=" "
            ></el-input>
          </el-form-item>
          <el-form-item label="币种：" prop="cu_deName">
            <el-select
              style="width: 120px; margin: 0 15px;"
              :disabled="isEdit"
              v-model="clienFormData.cu_deName"
            >
              <el-option
                v-for="(item, i) in options.cu_deList"
                :key="i"
                :label="item.itemCode"
                :value="item.itemCode"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="每车尺码：" prop="size">
            <el-select
              :disabled="isEdit"
              v-model="clienFormData.size"
              style="width: 134px;; margin: 0 15px;"
              placeholder="请选择尺码"
            >
              <el-option
                v-for="(item, i) in options.size"
                :key="i"
                :label="item.itemCode"
                :value="item.parameter"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="报价方式：" prop="offerMethod">
            <el-select
              style="width: 120px; margin: 0 15px;"
              :disabled="isEdit"
              v-model="clienFormData.offerMethod"
              placeholder=""
            >
              <el-option
                v-for="(item, i) in options.offerMethod"
                :key="i"
                :label="item.itemCode"
                :value="item.parameter"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="总费用：" prop="totalCost">
            <el-input
              style="width: 120px;; margin: 0 15px;"
              :disabled="isEdit"
              v-model="clienFormData.totalCost"
              placeholder=" "
            ></el-input>
          </el-form-item>
          <el-form-item label="小数位数：" prop="decimalPlaces">
            <el-select
              style="width:100%;"
              v-model="clienFormData.decimalPlaces"
              :disabled="isEdit"
              placeholder="请选择小数位数"
            >
              <el-option
                v-for="(item, i) in options.decimalPlaces"
                :key="i"
                :label="item.itemCode"
                :value="item.parameter"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="取舍方式：" prop="rejectionMethod">
            <el-select
              style="width: 345px; margin: 0 15px;"
              :disabled="isEdit"
              v-model="clienFormData.rejectionMethod"
              placeholder="请选择取舍方式"
            >
              <el-option
                v-for="(item, i) in options.rejectionMethod"
                :key="i"
                :label="item.itemCode"
                :value="item.parameter"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="right">
          <el-form-item label="价格小于：" prop="miniPrice">
            <el-input
              style="width: 120px;"
              :disabled="isEdit"
              v-model="clienFormData.miniPrice"
              placeholder=" "
            ></el-input>
          </el-form-item>
          <!-- 小数位数： -->
          <el-form-item label="小数位数：" prop="miniPriceDecimalPlaces">
            <el-select
              v-model="clienFormData.miniPriceDecimalPlaces"
              style="width: 120px;"
              :disabled="isEdit"
              placeholder="请选择小数位数："
            >
              <el-option
                v-for="(item, i) in options.decimalPlaces"
                :key="i"
                :label="item.itemCode"
                :value="item.parameter"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 新增客户dialog -->
    <el-dialog
      title="新增客户"
      top="30vh"
      :close-on-click-modal="false"
      :visible.sync="addMyClientDialog"
      destroy-on-close
      width="800px"
      :header-cell-style="{ backgroundColor: '#f9fafc' }"
    >
      <el-form
        ref="addMyClientRef"
        label-width="100px"
        :rules="addMyClientRules"
        :model="addClientFormData"
      >
        <el-form-item label="客户名称" prop="name">
          <el-input
            v-model="addClientFormData.name"
            placeholder="请输入客户名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input
            v-model="addClientFormData.phoneNumber"
            placeholder="请输入联系方式"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            placeholder="请输入备注信息"
            :rows="4"
            resize="none"
            v-model="addClientFormData.remark"
          ></el-input>
        </el-form-item>
        <center>
          <template>
            <el-button type="primary" @click="subMyClient">提 交</el-button>
            <el-button plain @click="addMyClientDialog = false"
              >取 消</el-button
            >
          </template>
        </center>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import eventBus from "@/assets/js/common/eventBus.js";
export default {
  name: "bsSampleSearch",
  props: {
    searchFormData: {
      type: Object
    },
    isEdit: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  watch: {
    "clienFormData.customerId": {
      deep: true,
      handler(newVal) {
        if (newVal) {
          this.clientList.forEach(val => {
            if (val.id === newVal) this.clienFormData.customerName = val.name;
          });
        }
      }
    },
    "clienFormData.cu_deName": {
      deep: true,
      handler(newVal) {
        if (newVal) {
          // console.log(newVal, this.options.cu_deList);
          this.options.cu_deList.forEach(val => {
            if (val.itemCode === newVal)
              this.clienFormData.cu_de = val.parameter;
          });
        }
      }
    },
    "clienFormData.defaultFormula": {
      deep: true,
      handler(newVal) {
        if (newVal) {
          const obj = JSON.parse(newVal);
          this.clienFormData.profit = obj.profit;
          this.clienFormData.offerMethod = obj.offerMethod;
          this.clienFormData.cu_de = obj.cu_de;
          this.clienFormData.cu_deName = obj.cu_deName;
          this.clienFormData.exchange = obj.exchange;
          this.clienFormData.size = obj.size;
          this.clienFormData.decimalPlaces = obj.decimalPlaces;
          this.clienFormData.rejectionMethod = obj.rejectionMethod;
          this.clienFormData.profitCalcMethod = obj.profitCalcMethod;
        }
      }
    }
  },
  data() {
    return {
      addMyClientDialog: false,
      clientList: [],
      customerTemplate: [],
      options: {
        // 报价配置项
        cu_deList: [],
        decimalPlaces: [],
        offerMethod: [],
        rejectionMethod: [],
        size: []
      },
      addClientFormData: {
        name: null,
        phoneNumber: null,
        remark: null
      },
      clienFormData: {
        title: null,
        companyName: "11",
        defaultFormula: null,
        customerId: null,
        customerName: null,
        quotationProductList: [],
        profit: 0,
        offerMethod: "出厂价",
        cu_de: "¥",
        cu_deName: "",
        totalCost: "0",
        exchange: 0,
        size: "24",
        decimalPlaces: 3,
        rejectionMethod: "四舍五入",
        miniPrice: 0,
        miniPriceDecimalPlaces: 1
      },
      addMyClientRules: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }]
      },
      addInfoRules: {
        linkman: [{ required: true, message: "请选择客户", trigger: "change" }],

        remark: [{ required: true, message: "请备注", trigger: "change" }],
        offerMethod: [
          { required: true, message: "请输入报价方式", trigger: "blur" }
        ],
        defaultFormula: [
          { required: true, message: "请选择默认公式", trigger: "blur" }
        ],
        cu_deName: [
          { required: true, message: "请输入报价方式", trigger: "blur" }
        ],
        cu_de: [{ required: true, message: "请选择币别", trigger: "change" }],
        exchange: [{ required: true, message: "请输入汇率", trigger: "blur" }],
        decimalPlaces: {
          required: true,
          message: "请选择小数位数",
          trigger: "change"
        },

        profit: { required: true, message: "请输入利润率", trigger: "blur" },
        totalCost: { required: true, message: "请输入总费用", trigger: "blur" },
        size: { required: true, message: "请选择尺码", trigger: "change" },
        rejectionMethod: {
          required: true,
          message: "请选择取舍方式",
          trigger: "change"
        },
        miniPrice: { required: true, message: "请输入价格", trigger: "blur" },
        miniPriceDecimalPlaces: {
          required: true,
          message: "请选择小数位数",
          trigger: "change"
        }
      }
    };
  },
  created() {
    this.getSelectCompanyOffer();
  },
  mounted() {
    this.getProductOfferByNumber();
  },
  beforeDestroy() {
    eventBus.$off("getSearchForm" + this.searchFormData.offerNumber);
  },
  methods: {
    //请求条件
    async getProductOfferByNumber() {
      const res = await this.$http.post("/api/GetProductOfferByNumber", {
        offerNumber: this.searchFormData.offerNumber
      });
      if (res.data.result.code === 200) {
        this.clienFormData = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取客户报价模板
    async getSelectProductOfferFormulaList() {
      const res = await this.$http.post(
        "/api/SelectProductOfferFormulaList",
        {}
      );
      if (res.data.result.code === 200) {
        this.customerTemplate = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
      eventBus.$emit("resetOffProduct");
    },
    // 获取系统配置项
    async getSelectCompanyOffer() {
      const res = await this.$http.post("/api/GetSelectCompanyOffer", {
        basisParameters: "CompanyProductOffer"
      });
      if (res.data.result.code === 200) this.options = res.data.result.item;
      else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
      this.getClientList();
    },
    // 新增客户
    openAddMyClient() {
      this.addClientFormData = {
        name: null,
        phoneNumber: null,
        remark: null
      };
      this.addMyClientDialog = true;
    },
    // 提交新增客户
    async subMyClient() {
      this.$refs.addMyClientRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            "/api/CreateCustomerInfo",
            this.addClientFormData
          );
          if (res.data.result.code === 200) {
            this.addMyClientDialog = false;
            this.getClientList();
            this.$common.handlerMsgState({
              msg: "新增操作成功",
              type: "success"
            });
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "warning"
            });
          }
        }
      });
    },
    // 获取客户列表
    async getClientList() {
      const fd = {
        skipCount: this.clientCurrentPage,
        maxResultCount: this.clientPageSize
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/SearchCustomerInfosPage", fd);
      if (res.data.result.code === 200) {
        this.clientList = res.data.result.item.items;
      }
      this.getSelectProductOfferFormulaList();
    }
  }
};
</script>
<style scoped lang="less">
.bsSampleSearch {
  background-color: #fff;
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
  .searchBox {
    width: 100%;
    box-sizing: border-box;
    padding: 20px 0;
    form {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .left {
        flex: 1;
      }
      .right {
        padding-top: 10px;
        margin-right: 20px;
        width: 280px;
        height: 158px;
        background: #ffffff;
        border: 1px solid #dcdfe6;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
      }
    }
  }
}
</style>
