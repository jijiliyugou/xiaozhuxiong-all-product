<template>
  <el-form
    label-width="100px"
    ref="offerFromDataRef"
    :model="offerFromData"
    :rules="defaultFormRules"
  >
    <div class="item">
      <el-form-item
        label="公式类型:"
        prop="profitCalcMethod"
        label-width="90px"
      >
        <div class="radioBox">
          <el-radio
            v-model="offerFromData.profitCalcMethod"
            v-for="item in profitCalcMethodList"
            :key="item.label"
            :label="item.label"
            >{{ item.name }}</el-radio
          >
        </div>
      </el-form-item>
    </div>
    <div class="bgxian"></div>
    <div class="item" style="margin-top:20px">
      <el-form-item label="模板名称:" label-width="90px" prop="name">
        <el-input
          size="small"
          style="width:240px"
          placeholder="请输入模板名称"
          v-model="offerFromData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="设置说明:">
        <el-input
          size="small"
          style="width:328px"
          v-model="offerFromData.remark"
        ></el-input>
      </el-form-item>
    </div>
    <div class="mainBox" v-if="offerFromData.profitCalcMethod == 3">
      <div class="title">
        <h3>自定义公式</h3>
      </div>
      <div class="item">
        <div class="label custom" style="margin-right:10px">
          选择要添加的字段:
        </div>
        <!-- <el-input
          size="small"
          style="width:150px"
          v-model="offerFromData.ma_na"
        ></el-input> -->
        <el-select
          v-model="formulaName"
          style="width:150px"
          placeholder="请选择"
          size="small"
          clearable
        >
          <el-option
            v-for="item in formulaList"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>

        <div class="label custom" style="margin-right:10px">
          其他数值:
        </div>
        <el-input
          size="small"
          clearable
          style="width:150px"
          onkeyup="value=value.replace(/[^\d.]/g,'')"
          v-model="formulaNumber"
        ></el-input>
        <div class="btn" @click="handlePushformula" style="margin-left:14px">
          添加
        </div>
      </div>
      <div class="item" style="margin-top:14px">
        <div class="label custom" style="margin-right:10px">
          添加计算符号:
        </div>
        <div class="btnBox">
          <div class="btn" @click="handleAddSymbol('+')">+</div>
          <div class="btn" @click="handleAddSymbol('-')">-</div>
          <div class="btn" @click="handleAddSymbol('*')">*</div>
          <div class="btn" @click="handleAddSymbol('/')">/</div>
          <div class="btn" @click="handleAddSymbol('(')">(</div>
          <div class="btn" @click="handleAddSymbol(')')">)</div>

          <el-dropdown trigger="click" class="dropdownBox">
            <span class="el-dropdown-link">
              <i class="fastIcon"></i>快捷公式
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in dropdownData"
                :key="item.val"
                style="display: flex; justify-content: space-between; margin:5px 0"
              >
                <p style="margin-right:15px">
                  {{ item.name }}
                  {{ item.val }}
                </p>
                <el-button
                  size="mini"
                  @click="handleDropdown(item)"
                  type="primary"
                  >填入</el-button
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="item" style="margin-top:14px">
        <div class="label custom" style="margin-right:10px">
          公式算法:
        </div>
        <draggable class="draggableBox" :list="formulaTags">
          <el-tag
            class="tagBox"
            v-for="(tag, index) in formulaTags"
            :key="index"
            color="#e8f2ff"
            @click="handleClose(index)"
          >
            {{ tag }}
          </el-tag>
        </draggable>
      </div>
      <div
        class="item"
        style="margin:14px 0 18px 0"
        v-if="offerFromData.profitCalcRule"
      >
        <div class="item" style="padding-left:140px">
          {{ offerFromData.profitCalcRule }}
        </div>
      </div>
      <div class="item" style="margin:14px 0 18px 0">
        <div class="item" style="padding-left:140px">
          <el-button size="small" @click="saveFormula" type="primary"
            >保 存</el-button
          >
          <el-button size="small" @click="clearFormula" type="primary"
            >取 消</el-button
          >
        </div>
      </div>
    </div>
    <div class="mainBox">
      <div class="title">
        <h3>报价参数设置</h3>
      </div>
      <div class="item">
        <el-form-item
          label="报价方式:"
          label-width="100px"
          prop="offerMethod"
          style="margin-right:10px"
        >
          <el-select
            v-model="offerFromData.offerMethod"
            clearable
            style="width:140px"
            size="small"
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
        <el-form-item
          label="报价利润:"
          prop="profit"
          label-width="100px"
          style="margin-right:10px"
        >
          <el-input
            maxlength="30"
            size="small"
            style="width:140px"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            v-model="offerFromData.profit"
          >
            <span slot="suffix">%</span>
          </el-input>
        </el-form-item>
        <el-form-item
          label="总费用:"
          label-width="100px"
          prop="totalCost"
          style="margin-right:20px"
        >
          <el-input
            size="small"
            style="width:140px"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            v-model="offerFromData.totalCost"
          ></el-input>
        </el-form-item>
      </div>
      <div class="item">
        <el-form-item label="每车尺码:" prop="size" style="margin-right:10px">
          <el-select
            style="width:140px"
            size="small"
            v-model="offerFromData.size"
            @change="selectBlur"
            v-model.number="offerFromData.size"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            filterable
            allow-create
            default-first-option
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
        <el-form-item label="汇率:" prop="exchange" style="margin-right:10px">
          <el-input
            size="small"
            style="width:140px"
            v-model="offerFromData.exchange"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            :maxlength="String(offerFromData.exchange).includes('.') ? 7 : 6"
          ></el-input>
        </el-form-item>
        <el-form-item label="币种:" prop="cu_de" style="margin-right:20px">
          <el-select
            style="width:140px"
            size="small"
            v-model="offerFromData.cu_de"
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
      </div>
      <div class="item">
        <el-form-item
          label="小数位数:"
          prop="decimalPlaces"
          style="margin-right:10px"
        >
          <el-select
            style="width:140px"
            size="small"
            v-model="offerFromData.decimalPlaces"
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
        <el-form-item label="取舍方式:" prop="rejectionMethod">
          <div class="radioBox">
            <el-radio-group v-model="offerFromData.rejectionMethod">
              <template v-for="item in configList">
                <el-radio
                  v-if="item.itemText === 'RejectionMethod'"
                  :key="item.id"
                  :label="item.parameter"
                  >{{ item.itemCode }}</el-radio
                >
              </template>
            </el-radio-group>
          </div>
        </el-form-item>
      </div>
      <div class="item" style=" justify-content: space-between;">
        <div class="right">
          <el-form-item
            label="价格小于:"
            label-width="100px"
            style="margin-right:10px"
          >
            <el-input
              size="small"
              style="width:140px"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              clearable
              v-model="offerFromData.miniPrice"
            ></el-input>
          </el-form-item>
          <el-form-item label="小数位数:" label-width="100px">
            <el-input
              size="small"
              style="width:140px"
              onkeyup="value=value.replace(/[^\d.]/g,'')"
              clearable
              v-model="offerFromData.miniPriceDecimalPlaces"
            ></el-input>
          </el-form-item>
        </div>
      </div>
      <!-- <div class="item" style=" justify-content: space-between;">
        <div class="left">
          <el-form-item label="取值方式:" prop="naturalMethod">
            <div class="radioBox">
              <el-radio-group v-model="offerFromData.naturalMethod">
                <template v-for="item in configList">
                  <el-radio
                    v-if="item.itemText === 'NaturalMethod'"
                    :key="item.id"
                    :label="item.parameter"
                    >{{ item.itemCode }}</el-radio
                  >
                </template>
              </el-radio-group>
            </div>
          </el-form-item>
        </div>
      </div> -->
    </div>
    <center style="margin-top:28px">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subDefaultForm">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </center>
  </el-form>
</template>

<script>
import draggable from "vuedraggable";
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
  name: "offerFormulaDialog",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    editRow: {
      type: Object
    }
  },
  components: {
    draggable
  },
  data() {
    return {
      formulaTags: [],
      profitCalcMethodList: [
        { label: 1, name: "乘法公式" },
        { label: 2, name: "除法公式" },
        { label: 3, name: "自定义公式" }
      ],
      formulaList: [
        { name: "每车尺码" },
        { name: "出厂价" },
        { name: "总费用" },
        { name: "外箱体积 " },
        { name: "外箱材积" },
        { name: "外箱装量" },
        { name: "报价利润%" },
        { name: "汇率" }
      ],

      formulaName: null,
      formulaNumber: null,
      chufa: [
        "(",
        "出厂价",
        "+",
        "(",
        "总费用",
        "/",
        "(",
        "每车尺码",
        "/",
        "外箱体积",
        "*",
        "外箱装量",
        ")",
        ")",
        ")",
        "/",
        "(",
        "1",
        "-",
        "报价利润%",
        ")",
        "/",
        "汇率"
      ],
      chengfa: [
        "(",
        "出厂价",
        "+",
        "(",
        "总费用",
        "/",
        "(",
        "每车尺码",
        "/",
        "外箱体积",
        "*",
        "外箱装量",
        ")",
        ")",
        ")",
        "*",
        "(",
        "1",
        "-",
        "报价利润%",
        ")",
        "/",
        "汇率"
      ],
      dropdownData: [
        {
          name: "除：",
          val:
            "(出厂价+(总费用/(每车尺码/外箱体积*外箱装量)))/(1-报价利润%)/汇率"
        },
        {
          name: "乘：",
          val:
            "(出厂价+(总费用/(每车尺码/外箱体积*外箱装量)))*(1-报价利润%)/汇率"
        }
      ],
      offerFromData: {
        profitCalcMethod: 2,
        name: null,
        remark: null,
        offerMethod: null,
        totalCost: null,
        cu_de: null,
        cu_deName: null,
        exchange: null,
        decimalPlaces: null,
        profit: null,
        size: null,
        rejectionMethod: "",
        naturalMethod: "",
        miniPriceDecimalPlaces: null,
        miniPrice: null,
        profitCalcRule: "" //报价公式
      },
      configList: [],
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
        totalCost: [
          { required: true, message: "请输入总费用", trigger: "change" }
        ],
        profit: [{ required: true, message: "请输入利润", trigger: "blur" }],
        size: [{ required: true, message: "请选择尺码", trigger: "change" }],
        rejectionMethod: [
          { required: true, message: "请选择取舍方式", trigger: "change" }
        ],
        naturalMethod: [
          { required: true, message: "请选择取值方式", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    offerFromData: {
      deep: true,
      handler(newVal) {
        console.log(newVal);
      }
    },
    "offerFromData.profit": {
      deep: true,
      handler(newVal) {
        if (newVal == 100) {
          if (this.offerFromData.profitCalcMethod == 2) {
            this.offerFromData.profit = 10;
            this.$common.handlerMsgState({
              msg: "除法利润率不可为100",
              error: "danger"
            });
          }
        }
      }
    },
    "offerFromData.profitCalcMethod": {
      deep: true,
      handler(newVal) {
        if (newVal == 2) {
          if (this.offerFromData.profit == 100) {
            this.offerFromData.profit = 10;
            this.$common.handlerMsgState({
              msg: "除法利润率不可为100",
              error: "danger"
            });
          }
        }
      }
    }
  },
  created() {},
  mounted() {
    this.getSystemConfig();
    if (this.isEdit) {
      for (const key in this.editRow) {
        this.offerFromData[key] = this.editRow[key];
      }
    }
  },
  methods: {
    // 提交
    subDefaultForm() {
      this.$refs.offerFromDataRef.validate(async valid => {
        if (valid) {
          this.offerFromData.miniPrice = this.offerFromData.miniPrice || 0;
          this.offerFromData.miniPriceDecimalPlaces =
            this.offerFromData.miniPriceDecimalPlaces || 0;
          this.$emit("submit", this.offerFromData);
        }
      });
    },
    // 关闭
    close() {
      this.$emit("close");
    },
    // 添加标签
    handlePushformula() {
      if (this.formulaName && this.formulaNumber) {
        this.$common.handlerMsgState({
          msg: "不能同时添加两个字段",
          type: "danger"
        });
      } else if (this.formulaNumber) {
        this.handleAddSymbol(this.formulaNumber);
        // this.formulaTags.push(this.formulaNumber);
        this.formulaNumber = null;
      } else if (this.formulaName) {
        this.handleAddSymbol(this.formulaName);
        // this.formulaTags.push(this.formulaName);
        this.formulaName = null;
      }
    },
    // 添加符号和验证
    handleAddSymbol(val) {
      this.formulaTags.push(val);
      if (this.validationFormula(this.formulaTags.join(""))) {
        this.offerFromData.profitCalcRule = this.formulaTags.join("");
      } else {
        this.formulaTags.pop();
        this.$common.handlerMsgState({
          msg: "公式错误或运算符使用不正确",
          type: "danger"
        });
      }
    },
    // 验证公式
    validationFormula(val) {
      // 错误情况，第一个运算符
      if (/^[+*/)-]/.test(val)) {
        return false;
      }
      // 错误情况，左括号后面不能跟着运算符
      if (/\([*/+-]/.test(val)) {
        return false;
      }
      // 错误情况，运算符连续
      if (/[*/+-]{2,}/.test(val)) {
        return false;
      }
      return val;
    },
    // 删除标签
    handleClose(index) {
      this.formulaTags.splice(index, 1);
      this.offerFromData.profitCalcRule = this.formulaTags.join("");
    },
    // 快捷公式
    handleDropdown(item) {
      this.offerFromData.profitCalcRule = item.val;
      if (item.name === "除：") {
        this.formulaTags = this.chufa;
      } else {
        this.formulaTags = this.chengfa;
      }
    },
    // 清除公式
    clearFormula() {
      this.formulaTags = [];
      this.offerFromData.profitCalcRule = "";
    },
    // 保存公式验证
    saveFormula() {
      if (this.offerFromData.profitCalcRule == "") {
        this.$common.handlerMsgState({
          msg: "公式不能为空",
          type: "danger"
        });
        return false;
      }

      if (/[*/+-]\)/.test(this.offerFromData.profitCalcRule)) {
        this.$common.handlerMsgState({
          msg: "右括号前面不能跟着运算符",
          type: "danger"
        });
        return false;
      }
      if (!/[+*/(-]/.test(this.offerFromData.profitCalcRule)) {
        this.$common.handlerMsgState({
          msg: "缺失运算符",
          type: "danger"
        });
        return false;
      }
      if (/[+*/(-]$/.test(this.offerFromData.profitCalcRule)) {
        this.$common.handlerMsgState({
          msg: "结尾运算符错误",
          type: "danger"
        });
        return false;
      }
      let stack = [];
      for (let i = 0, item; i < this.offerFromData.profitCalcRule.length; i++) {
        item = this.offerFromData.profitCalcRule.charAt(i);
        if ("(" === item) {
          stack.push("(");
        } else if (")" === item) {
          if (stack.length > 0) {
            stack.pop();
          } else {
            return false;
          }
        }
      }
      if (stack.length === 0) {
        this.GetVerificationProfitCalcRule();
      } else {
        this.$common.handlerMsgState({
          msg: "缺少括号",
          type: "danger"
        });
      }
    },
    // 验证自定义报价
    async GetVerificationProfitCalcRule() {
      console.log(this.offerFromData.profitCalcRule, "验证自定义报价");
      const fd = {
        profitCalcMethod: this.offerFromData.profitCalcMethod,
        profitCalcRule: this.offerFromData.profitCalcRule
      };
      const res = await this.$http.post("/api/VerificationProfitCalcRule", fd);
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "自定义公式验证通过",
          type: "success"
        });
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },

    // 下拉框输入事件
    selectBlur(val) {
      if (isNaN(Number(val))) {
        this.offerFromData.size = null;
      }
    },
    // 选择币别事件
    changeSelect(val) {
      const { itemCode } = this.configList.find(item => item.parameter === val);
      this.offerFromData.cu_deName = itemCode;
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
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
@{deep} .el-form-item {
  margin-bottom: 16px;
}
.item {
  display: flex;
  align-items: center;
  width: 100%;
  .label {
    padding-left: 6px;
    min-width: 75px;
    box-sizing: border-box;
  }
  .custom {
    width: 130px;
    text-align: right;
  }
  .btnBox {
    display: flex;
    justify-content: space-between;
    .fastIcon {
      display: inline-block;
      vertical-align: bottom;
      width: 20px;
      height: 16px;
      background: url("~@/assets/images/fastIcon.png") no-repeat center;
      background-size: contain;
    }
    .dropdownBox {
      display: flex;
      align-items: center;
      background: #f5f5f5;
      border: 1px solid #dcdfe6;
      border-radius: 5px;
      padding: 0 15px;
    }
  }
  .btn {
    width: 60px;
    height: 32px;
    box-sizing: border-box;
    background: #f5f5f5;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 14px;
    cursor: pointer;
  }
  @{deep} .left {
    .el-form-item {
      margin-bottom: 0 !important;
    }
  }
  @{deep}.right {
    width: 100%;
    height: 80px;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    display: flex;
    align-items: center;
    .el-form-item {
      margin-bottom: 0 !important;
    }
  }
  .draggableBox {
    min-height: 108px;
    width: 624px;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    padding: 7px 6px;
    box-sizing: border-box;
    .tagBox {
      margin: 8px 6px;
      color: #333333;
      cursor: pointer;
    }
  }
}
.bgxian {
  height: 1px;
  width: 100%;
  background: #dcdfe6;
}
.mainBox {
  .title {
    line-height: 40px;
    width: 100%;
    height: 40px;
    background: #f5f5f5;
    border-radius: 4px;
    margin-bottom: 20px;
    h3 {
      font-size: 15px;
      font-weight: 700;
      text-align: left;
      color: #333333;
      margin-left: 20px;
    }
  }
}
</style>
