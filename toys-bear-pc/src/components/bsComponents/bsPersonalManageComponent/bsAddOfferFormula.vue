<template>
  <div class="bsAddOfferFormula">
    <el-form
      ref="addDefaultFormRef"
      label-width="100px"
      :rules="defaultFormRules"
      :model="addDefaultForm"
      class="addDialogClass"
    >
      <el-form-item class="offerMethodClass" label="模板名称：" prop="name">
        <el-input
          placeholder="请输入内容"
          v-model="addDefaultForm.name"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        class="offerMethodClass"
        label="报价方式："
        prop="offerMethod"
      >
        <el-select
          v-model="addDefaultForm.offerMethod"
          clearable
          placeholder="请选择"
        >
          <template v-for="item in configList">
            <el-option
              v-if="item.itemText === 'OfferMethod'"
              :key="item.id"
              :label="item.itemCode"
              :value="item.itemCode"
            >
            </el-option>
          </template>
        </el-select>
      </el-form-item>
      <div class="inputWrap">
        <div class="left">
          <el-form-item label="币种：" prop="cu_de">
            <el-select
              v-model="addDefaultForm.cu_de"
              @change="changeSelect"
              clearable
              placeholder="请选择"
            >
              <template v-for="item in configList">
                <el-option
                  v-if="item.itemText === 'Cu_de'"
                  :key="item.id"
                  :label="item.itemCode"
                  :value="item.parameter"
                >
                </el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="汇率：" prop="exchange">
            <el-input
              v-model="addDefaultForm.exchange"
              :maxlength="String(addDefaultForm.exchange).includes('.') ? 7 : 6"
            ></el-input>
          </el-form-item>
          <el-form-item label="小数位数：" prop="decimalPlaces">
            <el-select
              v-model="addDefaultForm.decimalPlaces"
              clearable
              placeholder="请选择"
            >
              <template v-for="item in configList">
                <el-option
                  v-if="item.itemText === 'DecimalPlaces'"
                  :key="item.id"
                  :label="item.itemCode"
                  :value="item.itemCode"
                >
                </el-option>
              </template>
            </el-select>
          </el-form-item>
        </div>
        <div class="right">
          <el-form-item label="利润率：" prop="profit">
            <el-input
              v-model.number="addDefaultForm.profit"
              clearable
              maxlength="6"
              ><i slot="append">%</i></el-input
            >
          </el-form-item>
          <el-form-item label="每车尺码：" prop="size">
            <el-select
              v-model="addDefaultForm.size"
              clearable
              placeholder="请选择"
            >
              <template v-for="item in configList">
                <el-option
                  v-if="item.itemText === 'Size'"
                  :key="item.id"
                  :label="item.itemCode"
                  :value="item.itemCode"
                >
                </el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="取舍方式：" prop="rejectionMethod">
            <el-select
              v-model="addDefaultForm.rejectionMethod"
              clearable
              placeholder="请选择"
            >
              <template v-for="item in configList">
                <el-option
                  v-if="item.itemText === 'RejectionMethod'"
                  :key="item.id"
                  :label="item.itemCode"
                  :value="item.itemCode"
                >
                </el-option>
              </template>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="lessThanPrice">
        <div class="left">
          <el-form-item label="价格小于：" prop="miniPrice">
            <el-input
              style="width:100%;"
              v-model="addDefaultForm.miniPrice"
              clearable
              placeholder="请输入"
            >
            </el-input>
          </el-form-item>
        </div>
        <div class="right">
          <!-- xiaoshuweishu -->
          <el-form-item label="小数位数：" prop="miniPriceDecimalPlaces">
            <el-select
              v-model="addDefaultForm.miniPriceDecimalPlaces"
              style="width:100%;"
              placeholder="请选择"
            >
              <template v-for="item in configList">
                <el-option
                  v-if="item.itemText === 'DecimalPlaces'"
                  :key="item.id"
                  :label="item.itemCode"
                  :value="item.itemCode"
                >
                </el-option>
              </template>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <el-form-item label="备注：" prop="remark">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="addDefaultForm.remark"
        >
        </el-input>
      </el-form-item>
      <center>
        <template>
          <el-button type="primary" @click="subDefaultForm">提 交</el-button>
          <el-button type="danger" @click="close">取 消</el-button>
        </template>
      </center>
    </el-form>
  </div>
</template>

<script>
const validateLength = (rule, value, callback) => {
  if (!value) {
    callback();
  } else {
    var reg = /^-?\d{1,5}(?:\.?\d{1,5})?$/; // 小数点左边最高5位，小数点右边最多5位
    var reg1 = /^\d{1,6}$/;
    if (/^[0-9]+\.?[0-9]*/.test(value)) {
      if (reg.test(value)) {
        if (String(value).includes(".")) {
          callback();
        } else {
          if (reg1.test(value)) {
            callback();
          } else {
            callback(new Error("只能输入1-6位数字"));
          }
        }
      } else {
        callback(new Error("小数点前后最多可1-5位数字"));
      }
    } else {
      callback(new Error("只能输入数字类型"));
    }
  }
};
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    editRow: {
      type: Object
    }
  },
  data() {
    return {
      configList: [],
      addDefaultForm: {
        name: null,
        remark: null,
        offerMethod: null,
        cu_de: null,
        cu_deName: null,
        exchange: null,
        decimalPlaces: null,
        profit: null,
        size: null,
        rejectionMethod: null,
        miniPriceDecimalPlaces: null,
        miniPrice: null
      },
      defaultFormRules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "字数在 1-200 个字符之间",
            trigger: "blur"
          }
        ],
        offerMethod: [
          { required: true, message: "请选择报价方式", trigger: "change" }
        ],
        cu_de: [{ required: true, message: "请选择币种", trigger: "change" }],
        exchange: [
          { required: true, message: "请输入汇率", trigger: "blur" },
          { validator: validateLength, trigger: "blur" }
        ],
        decimalPlaces: [
          { required: true, message: "请选择小数位数", trigger: "change" }
        ],
        profit: [
          { required: true, message: "请输入利润", trigger: "blur" },
          { type: "number", message: "利润必须为数字值", trigger: "blur" }
        ],
        size: [{ required: true, message: "请选择尺码", trigger: "change" }],
        rejectionMethod: [
          { required: true, message: "请选择取舍方式", trigger: "change" }
        ],
        miniPrice: [{ required: true, message: "请输入价格", trigger: "blur" }],
        miniPriceDecimalPlaces: [
          { required: true, message: "请选择小数位数", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    // 提交
    subDefaultForm() {
      this.$refs.addDefaultFormRef.validate(async valid => {
        if (valid) {
          this.$emit("submit", this.addDefaultForm);
        }
      });
    },
    // 关闭
    close() {
      this.$emit("close");
    },
    // 选择币别事件
    changeSelect(val) {
      const { itemCode } = this.configList.find(item => item.parameter === val);
      this.addDefaultForm.cu_deName = itemCode;
    },
    // 获取系统配置
    async getSystemConfig() {
      const res = await this.$http.post("/api/ServiceConfigurationList", {
        basisParameters: "CompanyProductOffer"
      });
      if (res.data.result.code === 200) {
        this.configList = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  },
  created() {},
  mounted() {
    this.getSystemConfig();
    if (this.isEdit) {
      for (const key in this.editRow) {
        this.addDefaultForm[key] = this.editRow[key];
      }
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsAddOfferFormula {
  .addDialogClass {
    .offerMethodClass {
      .el-select {
        width: 100%;
      }
    }
    .inputWrap {
      display: flex;
      justify-content: space-between;
      .left,
      .right {
        flex: 1;
        box-sizing: border-box;
        @{deep} .el-form-item__content {
          width: calc(100% - 100px);
          .el-select {
            width: 100%;
          }
        }
      }
      .left {
        padding-right: 10px;
      }
      .right {
        padding-left: 10px;
      }
    }
    .lessThanPrice {
      display: flex;
      justify-content: space-between;
      padding-top: 20px;
      border-top: 1px solid #dcdfe6;
      .left,
      .right {
        flex: 1;
        box-sizing: border-box;
      }
      .left {
        padding-right: 10px;
      }
      .right {
        padding-left: 10px;
      }
    }
  }
}
</style>
