<template>
  <div>
    <el-form
      ref="addClientFormRef"
      label-width="110px"
      size="medium"
      :rules="addRules"
      :model="clienFormData"
    >
      <div class="dialogForm">
        <div class="leftTab">
          <div
            :class="{ item: true, active: tp == 1 }"
            @click="handleTab('set_id', 1)"
          >
            站点设置
          </div>
          <div
            :class="{ item: true, active: tp == 2 }"
            @click="handleTab('formula', 2)"
          >
            报价公式
          </div>
          <!-- <div
              :class="{ item: true, active: tp == 3 }"
              @click="handleTab('advertising', 3)"
            >
              站点广告
            </div> -->
        </div>
        <div
          class="rightBox"
          id="rightBox"
          ref="rightBoxScroll"
          @scroll="handelScroll"
        >
          <div class="set" id="set_id">
            <div class="title">设置</div>
            <el-form-item label="站点域名：" prop="url">
              <div>
                <el-tag
                  @click="handlerTag(item)"
                  style="margin-right: 10px; cursor: pointer"
                  :effect="
                    clienFormData.websiteInfoId == item.id ? 'dark' : 'plain'
                  "
                  v-for="item in handSitesList"
                  :key="item.id"
                  >{{ item.name }}</el-tag
                >
              </div>
              <el-input
                style="display:none;"
                v-model="clienFormData.url"
                placeholder="请输入站点域名"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="客户名称：" prop="customerInfoId">
              <div class="formItemBox">
                <el-select
                  v-model="clienFormData.customerInfoId"
                  filterable
                  clearable
                  placeholder="请输入/选择 客户"
                >
                  <el-option
                    v-for="item in clientList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
                <el-button
                  style="margin-left: 10px"
                  type="primary"
                  @click.stop="openAddMyClient"
                  >新增客户</el-button
                >
              </div>
            </el-form-item>
            <div class="Excel">
              <el-form-item
                label-width="166px"
                label="是否允许客户导出："
                prop="isExportExcel"
              >
                <el-radio v-model="clienFormData.isExportExcel" :label="true"
                  >是</el-radio
                >
                <el-radio v-model="clienFormData.isExportExcel" :label="false"
                  >否</el-radio
                >
              </el-form-item>
              <el-form-item
                label-width="120px"
                label="站点过期时间："
                prop="expireTime"
              >
                <el-date-picker
                  v-model="clienFormData.expireTime"
                  type="datetime"
                  placeholder="请选择日期时间"
                  align="left"
                  value-format="yyyy-MM-ddTHH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="selectLang">
              <el-form-item label="语言选择：" prop="websiteLanguage">
                <el-checkbox-group v-model="clienFormData.websiteLanguage">
                  <el-checkbox
                    v-for="item in langs"
                    :label="item.id"
                    :key="item.id"
                  >
                    {{ item.itemText }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item
                label-width="230px"
                label="客户提交订单，是否需填资料："
                prop="isCustomerInfo"
              >
                <el-radio v-model="clienFormData.isCustomerInfo" :label="true"
                  >是</el-radio
                >
                <el-radio v-model="clienFormData.isCustomerInfo" :label="false"
                  >否</el-radio
                >
              </el-form-item>
            </div>
            <el-form-item label="显示价格：" prop="isShowPrice">
              <el-radio v-model="clienFormData.isShowPrice" :label="true"
                >是</el-radio
              >
              <el-radio v-model="clienFormData.isShowPrice" :label="false"
                >否</el-radio
              >
            </el-form-item>
            <el-form-item label="显示编号：" prop="showNumber">
              <el-radio v-model="clienFormData.showNumber" :label="0"
                >出厂货号</el-radio
              >
              <el-radio v-model="clienFormData.showNumber" :label="1"
                >展厅编号</el-radio
              >
              <el-radio v-model="clienFormData.showNumber" :label="2"
                >平台编号</el-radio
              >
              <el-radio v-model="clienFormData.showNumber" :label="-1"
                >均不显示</el-radio
              >
            </el-form-item>
          </div>
          <div class="formula" id="formula">
            <div class="title">报价公式</div>
            <el-form-item label="默认公式：" prop="defaultFormula">
              <el-select v-model="defaultFormula" placeholder="请选择">
                <el-option
                  v-for="(item, i) in customerTemplate"
                  :key="i"
                  :label="item.name"
                  :value="JSON.stringify(item)"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <div class="formItemBox">
              <el-form-item label="报价方式：" prop="offerMethod">
                <el-select
                  v-model="clienFormData.offerMethod"
                  placeholder="请选择报价方式"
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
              <el-form-item label="利润率：" prop="profit">
                <div style="display: flex; justify-content:space-between;">
                  <el-input
                    maxlength="30"
                    onkeyup="value=value.replace(/[^\d.]/g,'')"
                    style="flex:1;"
                    v-model="clienFormData.profit"
                  >
                    <span slot="suffix">%</span>
                  </el-input>
                  <el-radio-group
                    style="flex:1;display:flex; align-items:center;margin-left: 20px;"
                    v-model="clienFormData.profitCalcMethod"
                  >
                    <el-radio :label="2">除法</el-radio>
                    <el-radio :label="1">乘法</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </div>
            <div class="formItemBox">
              <el-form-item label="币种：" prop="currencyType">
                <el-select
                  v-model="clienFormData.currencyType"
                  placeholder="请选择币种"
                >
                  <el-option
                    v-for="(item, i) in options.cu_deList"
                    :key="i"
                    :label="item.itemCode"
                    :value="item.parameter"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="总费用：" prop="totalCost">
                <el-input
                  v-model="clienFormData.totalCost"
                  onkeyup="value=value.replace(/[^\d.]/g,'')"
                  clearable
                  placeholder="请输入总费用"
                >
                </el-input>
              </el-form-item>
            </div>
            <div class="formItemBox">
              <el-form-item label="汇率：" prop="exchange">
                <el-input
                  v-model="clienFormData.exchange"
                  onkeyup="value=value.replace(/[^\d.]/g,'')"
                  clearable
                  placeholder="请输入汇率"
                ></el-input>
              </el-form-item>
              <el-form-item label="每车尺码：" prop="size">
                <el-select
                  v-model.number="clienFormData.size"
                  @change="selectBlur"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请输入/选择尺码"
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
            </div>
            <div class="formItemBox">
              <el-form-item label="小数位数：" prop="decimalPlaces">
                <el-select
                  v-model="clienFormData.decimalPlaces"
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
            <div
              class="chengchuTishi"
              v-show="clienFormData.profitCalcMethod == 2"
            >
              {{ chufa }}
            </div>
            <div
              class="chengchuTishi"
              v-show="clienFormData.profitCalcMethod == 1"
            >
              {{ chengfa }}
            </div>
            <div class="lessThanPrice">
              <div class="left">
                <el-form-item label="价格小于：">
                  <el-input
                    v-model="clienFormData.miniPrice"
                    onkeyup="value=value.replace(/[^\d.]/g,'')"
                    clearable
                    placeholder="请输入"
                  >
                  </el-input>
                </el-form-item>
                <div class="tishi">当价格小于指定值，则调整小数位数</div>
              </div>
              <div class="right">
                <el-form-item label="小数位数：">
                  <el-select
                    v-model="clienFormData.miniPriceDecimalPlaces"
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
              </div>
            </div>
          </div>
          <!-- <div class="advertising" id="advertising">
              <div class="advertisingTising">
                <div class="title">站点广告</div>
                <el-button
                  @click="addAdvertising"
                  icon="el-icon-plus"
                  style="margin-left: 10px;height:36px"
                  size="mini"
                  type="primary"
                  >添加广告</el-button
                >
              </div>
              <el-table :data="advertisingTable" style="width: 100%">
                <el-table-column
                  prop="date"
                  label="图片"
                  align="center"
                  width="180"
                >
                  <template slot-scope="scope">
                    <el-image
                      style="width: 130px; height: 37px; cursor: pointer"
                      :src="scope.row.imgUrl"
                      fit="contain"
                    >
                      <div
                        slot="placeholder"
                        class="image-slot"
                        style="width: 130px; height: 37px; min-width: 130px"
                      >
                        <img
                          style="width: 130px; height: 37px; min-width: 130px"
                          :src="require('@/assets/images/imgError.png')"
                        />
                      </div>
                      <div
                        slot="error"
                        class="image-slot"
                        style="width: 130px; height: 37px; min-width: 130px"
                      >
                        <img
                          style="width: 130px; height: 37px; min-width: 130px"
                          :src="require('@/assets/images/imgError.png')"
                        />
                      </div>
                    </el-image>
                  </template>
                </el-table-column>
                <el-table-column prop="LinkUrl" label="链接" align="center">
                  <template slot-scope="scope">
                    <el-input
                      @blur="handleUpdataAdvertising(scope.row)"
                      v-model="scope.row.linkUrl"
                    >
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120">
                  <template slot-scope="scope">
                    <div class="handle">
                      排序接口还没有
                      <img
                        @click="handlegoUp(scope.$index, scope.row)"
                        src="@/assets/images/up_f.png"
                        alt=""
                      />
                      <div
                        class="delete"
                        @click="
                          handleDeleteAdvertising(scope.$index, scope.row)
                        "
                      >
                        删除
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div> -->
        </div>
      </div>
    </el-form>
    <center style="margin-top: 20px; padding:0 0 20px 0">
      <template>
        <el-button type="primary" @click="subProcessingLog">确定</el-button>
        <el-button style="margin-left: 30px;" plain @click="$emit('close')"
          >取消</el-button
        >
      </template>
    </center>
    <!-- 新增客户dialog -->
    <el-dialog
      title="新增客户"
      top="30vh"
      :close-on-click-modal="false"
      :visible.sync="addMyClientDialog"
      destroy-on-close
      width="800px"
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
    <!-- 选择广告 -->
    <el-dialog
      title="选择广告"
      :visible.sync="advertisingDialog"
      v-if="advertisingDialog"
      width="900px"
    >
      <div class="advertisingList">
        <li v-for="item in advertisingData" :key="item.id">
          <el-image
            fit="contain"
            style="width: 180px; height: 52px"
            :src="item.imgUrl"
          >
            <div slot="placeholder" class="errorImg">
              <img
                style="width: 180px; height: 52px"
                src="~@/assets/images/imgError.png"
                alt
              />
            </div>
            <div slot="error" class="errorImg">
              <img
                style="width: 180px; height: 52px"
                src="~@/assets/images/imgError.png"
                alt
              />
            </div>
          </el-image>
          <h4>{{ item.title }}</h4>
          <div class="checkboxP">
            <div>
              <el-checkbox
                @change="handleChecked"
                v-model="item.checked"
              ></el-checkbox>
            </div>
          </div>
        </li>
      </div>

      <center>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleAddadv">确 定</el-button>
          <el-button @click="advertisingDialog = false">取 消</el-button>
        </span>
      </center>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    clientList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    myFormData: {
      type: Object
    },
    handSitesList: {
      type: Array
    },
    customerTemplate: {
      type: Array
    }
  },
  data() {
    return {
      defaultFormula: null,
      langs: [],
      total: 0,
      advertisingDialog: false,
      addMyClientRules: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }]
      },
      chufa: "(出厂价+(总费用/(每车尺码/体积*外箱装量)))/(1-报价利润/100)/汇率",
      chengfa:
        "(出厂价+(总费用/(每车尺码/体积*外箱装量)))*(1+报价利润/100)/汇率",
      options: {
        // 报价配置项
        cu_deList: [],
        decimalPlaces: [],
        offerMethod: [],
        rejectionMethod: [],
        size: []
      },
      clienFormData: {
        websiteLanguage: [],
        miniPrice: 1,
        showNumber: 0,
        miniPriceDecimalPlaces: 1,
        profitCalcMethod: 2,
        url: null,
        isExportExcel: false,
        profit: 1,
        expireTime: null,
        customerInfoId: null,
        offerMethod: "汕头",
        currencyType: "¥",
        currencyTypeName: "RMB",
        totalCost: "0",
        exchange: 1,
        size: "24",
        decimalPlaces: 3,
        rejectionMethod: "四舍五入",
        websiteInfoId: null,
        isCustomerInfo: true,
        isShowPrice: true
      },
      addMyClientDialog: false,
      addClientFormData: {
        name: null,
        phoneNumber: null,
        remark: null
      },
      tp: 1,
      addRules: {
        websiteLanguage: [
          { required: true, message: "请选择语言", trigger: "change" }
        ],
        isCustomerInfo: [
          { required: true, message: "请选择是否提交资料", trigger: "change" }
        ],
        showNumber: [
          { required: true, message: "请选择是否显示编号", trigger: "blur" }
        ],
        isShowPrice: [
          { required: true, message: "请选择是否显示价格", trigger: "blur" }
        ],
        url: [{ required: true, message: "请选择站点域名", trigger: "change" }],
        isExportExcel: [
          { required: true, message: "请选择允许导出", trigger: "change" }
        ],
        profit: [{ required: true, message: "请输入利润率", trigger: "blur" }],
        customerInfoId: [
          { required: true, message: "请选择客户", trigger: "change" }
        ],
        offerMethod: [
          { required: true, message: "请选择报价方式", trigger: "change" }
        ],
        currencyType: [
          { required: true, message: "请选择币种", trigger: "change" }
        ],
        totalCost: [
          { required: true, message: "请输入总费用", trigger: "blur" }
        ],
        exchange: [{ required: true, message: "请输入汇率", trigger: "blur" }],
        size: [{ required: true, message: "请选择尺寸", trigger: "change" }],
        decimalPlaces: [
          { required: true, message: "请选择小数位数", trigger: "change" }
        ],
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
    // 广告弹框
    addAdvertising() {
      if (this.advertisingTable.length > 0) {
        let id = this.advertisingTable.map(item => {
          if (item.checked == true) {
            return item.id;
          }
        });
        for (let i = 0; i < this.advertisingData.length; i++) {
          for (let j = 0; j < id.length; j++) {
            if (this.advertisingTable[j].id == this.advertisingData[i].id) {
              this.advertisingData[i].checked = false;
            }
          }
        }
      }
      this.advertisingDialog = true;
    },
    // 下拉框输入事件
    selectBlur(val) {
      if (isNaN(Number(val))) {
        this.clienFormData.size = null;
      }
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
    },
    // 点击站点选中站点
    handlerTag(item) {
      this.clienFormData.url = item.url;
      this.clienFormData.websiteInfoId = item.id;
    },
    // 提交新增客户
    subMyClient() {
      this.$refs.addMyClientRef.validate(async valid => {
        if (valid) {
          const res = await this.$http.post(
            "/api/CreateCustomerInfo",
            this.addClientFormData
          );
          if (res.data.result.code === 200) {
            this.addMyClientDialog = false;
            this.$common.handlerMsgState({
              msg: "新增操作成功",
              type: "success"
            });
            this.getClientList();
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        }
      });
    },
    // 打开新增客户
    openAddMyClient() {
      this.addClientFormData = {
        name: null,
        phoneNumber: null,
        remark: null
      };
      this.addMyClientDialog = true;
    },
    // 滚动条事件
    handelScroll() {
      let setOffset = document.getElementById("set_id").offsetTop - 30;
      let formulaOffset = document.getElementById("formula").offsetTop - 30;
      // let advertisingOffset =
      //   document.getElementById("advertising").offsetTop - 51;
      console.log(this.$refs.rightBoxScroll.scrollTop, setOffset);
      if (this.$refs.rightBoxScroll.scrollTop === 0) {
        this.tp = 1;
      } else if (
        this.$refs.rightBoxScroll.scrollTop >= formulaOffset &&
        this.$refs.rightBoxScroll.scrollHeight -
          this.$refs.rightBoxScroll.scrollTop !=
          this.$refs.rightBoxScroll.clientHeight
      ) {
        this.tp = 2;
      } else if (
        this.$refs.rightBoxScroll.scrollHeight -
          this.$refs.rightBoxScroll.scrollTop ===
        this.$refs.rightBoxScroll.clientHeight
      ) {
        // this.tp = 3;
        this.tp = 2;
      }
    },
    // 获取系统配置语言列表
    async getLanguageType() {
      const res = await this.$http.post("/api/ServiceConfigurationList", {
        basisParameters: "languageType"
      });
      if (res.data.result.code === 200) this.langs = res.data.result.item;
      else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 提交新增 | 编辑 分享
    async subProcessingLog() {
      this.$refs.addClientFormRef.validate(async valid => {
        if (valid) {
          let url = "/api/CreateWebsiteShareInfo";
          if (this.isEdit) url = "/api/UpdateWebsiteShareInfo";
          const list = [];
          for (let i = 0; i < this.clienFormData.websiteLanguage.length; i++) {
            for (let j = 0; j < this.langs.length; j++) {
              if (this.langs[j].id == this.clienFormData.websiteLanguage[i]) {
                list.push(this.langs[j]);
                break;
              }
            }
          }
          this.clienFormData.websiteLanguage = JSON.stringify(list);

          for (const key in this.clienFormData) {
            if (
              this.clienFormData[key] == "undefined" ||
              this.clienFormData[key] == null ||
              this.clienFormData[key] == "" ||
              this.clienFormData[key] == undefined ||
              this.clienFormData[key] == "null"
            ) {
              delete this.clienFormData[key];
            }
          }

          const res = await this.$http.post(url, this.clienFormData);
          if (res.data.result.code === 200) {
            // if (this.advertisingTable.length > 0) {
            //   for (
            //     let index = 0;
            //     index < this.advertisingTable.length;
            //     index++
            //   ) {
            //     this.getCreateWebsiteShareAdRelation(
            //       this.advertisingTable[index]
            //     );
            //   }
            // }
            // this.getDataList();
            // this.clienFormData = {};
            this.$emit("submit");
            this.$common.handlerMsgState({
              msg: "操作成功",
              type: "success"
            });
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        }
      });
    },
    // 关联站点
    async getCreateWebsiteShareAdRelation(item) {
      const fd = {
        adId: item.id,
        shareId: this.clienFormData.websiteInfoId,
        linkUrl: item.linkUrl
      };
      const res = await this.$http.post(
        "/api/CreateWebsiteShareAdRelation",
        fd
      );
      if (res.data.result.code === 200) {
        console.log(res);
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 点击导航菜单，页面滚动到指定位置
    handleTab(val, index) {
      this.tp = index;
      console.log(this.tp);
      let total = document.getElementById(val).offsetTop;
      this.$refs.rightBoxScroll.scrollTop = total - 71;
    }
  },
  created() {},
  async mounted() {
    console.log(this.myFormData, 998);
    if (this.isEdit) {
      let myLangs = [];
      if (this.myFormData.websiteLanguage) {
        myLangs = JSON.parse(this.myFormData.websiteLanguage);
      }
      const fd = JSON.parse(JSON.stringify(this.myFormData));
      this.clienFormData = fd;
      this.clienFormData.customerInfoId = fd.customerId;
      this.clienFormData.websiteLanguage = myLangs.map(val => {
        return val.id;
      });
      console.log(this.clienFormData);
    }
    await this.getLanguageType();
    await this.getSelectCompanyOffer();
  },
  watch: {
    "clienFormData.currencyType": {
      deep: true,
      handler(newVal) {
        if (newVal) {
          this.options.cu_deList.forEach(val => {
            if (val.parameter === newVal)
              this.clienFormData.currencyTypeName = val.itemCode;
          });
        }
      }
    },
    defaultFormula: {
      deep: true,
      handler(newVal) {
        if (newVal) {
          console.log(newVal);
          const obj = JSON.parse(newVal);
          this.clienFormData.profit = obj.profit;
          this.clienFormData.offerMethod = obj.offerMethod;
          this.clienFormData.currencyType = obj.cu_de;
          this.clienFormData.currencyTypeName = obj.cu_deName;
          this.clienFormData.exchange = obj.exchange;
          this.clienFormData.size = obj.size;
          // this.clienFormData.showNumber = obj.showNumber;
          this.clienFormData.decimalPlaces = obj.decimalPlaces;
          this.clienFormData.rejectionMethod = obj.rejectionMethod;
        }
      }
    }
  }
};
</script>
<style scoped lang="less">
.dialogForm {
  width: 100%;
  // height: 100%;
  display: flex;
  .leftTab {
    width: 140px;
    min-width: 140px;
    border-right: 1px solid #e5e5e5;
    font-size: 15px;
    .item {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      cursor: pointer;
      position: relative;
      &.active {
        background-color: #eff6ff;
        &::after {
          position: absolute;
          content: "";
          left: 0;
          top: 0;
          width: 3px;
          background-color: #3368a9;
          height: 50px;
        }
      }
    }
  }
  .rightBox {
    flex: 1;
    padding: 20px;
    height: 600px;
    overflow: hidden;
    overflow-y: auto;
    .title {
      border: 0;
    }
    .Excel {
      display: flex;
      .el-form-item {
        flex: 1;
      }
    }
    .selectLang {
      display: flex;
      border-bottom: 1px solid #e5e5e5;
      .el-form-item {
        flex: 1;
        .el-checkbox-group {
          width: 100%;
        }
        &:last-of-type {
          .el-form-item__label {
            width: 220px !important;
          }
          .el-form-item__content {
            margin: 0 !important;
          }
        }
      }
    }
    .advertising {
      .advertisingTising {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .handle {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .delete {
          width: 30px;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
