<template>
  <div class="bsSampleQuotationDetails">
    <div class="title">报价详情</div>
    <bsSampleQuotationTopComponent
      :itemList="itemList"
      :handerTabData="handerTabData"
    ></bsSampleQuotationTopComponent>
    <div class="bsSampleTable">
      <div class="top">
        <div class="left">报价产品列表({{ tableData.length }})</div>
        <div class="right" v-if="tableData.length > 0">
          <el-button @click="exportOrder()" type="warning"> 导出列表</el-button>
        </div>
      </div>
      <div class="tableBox">
        <el-table
          :data="tableData"
          size="mini"
          style="width: 100%"
          ref="collecTable"
          :header-cell-style="{ background: '#f1f3f6' }"
        >
          <el-table-column label="序号" type="index" align="center" width="60">
          </el-table-column>
          <el-table-column prop="img" label="产品" width="220">
            <template slot-scope="scope">
              <div class="imgBox">
                <el-image
                  @click.native="goDetails(scope.row)"
                  fit="contain"
                  style="width: 80px; height: 60px"
                  :src="scope.row.imgUrlList && scope.row.imgUrlList[0]"
                >
                  <div
                    slot="placeholder"
                    style="width:60px;height:60px;"
                    class="errorImg"
                  >
                    <img
                      style="width: 55px; height: 60px"
                      src="~@/assets/images/imgError.png"
                      alt
                    />
                  </div>
                  <div
                    slot="error"
                    style="width:60px;height:60px;"
                    class="errorImg"
                  >
                    <img
                      style="width: 55px; height: 60px"
                      src="~@/assets/images/imgError.png"
                      alt
                    />
                  </div>
                </el-image>
                <div class="productName">
                  <div class="name" @click="goDetails(scope.row)">
                    {{ scope.row.name }}
                  </div>
                  <div class="factory">
                    <div class="factoryName" @click="toFactory(scope.row)">
                      {{ scope.row.supplierName }}
                    </div>
                    <div class="icons">
                      <!-- <el-tooltip
                        class="item"
                        effect="dark"
                        :content="scope.row.supplierPhone || '暂时没有厂商电话'"
                        placement="top"
                      >
                        <div class="cartPhoneIcon"></div>
                      </el-tooltip> -->
                      <div class="cartInfoIcon"></div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="supplierPhone"
            label="联系厂商"
            align="center"
            min-width="100"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.supplierPhone">
                {{ scope.row.supplierPhone }}
              </div>
              <div v-if="scope.row.supplierTelephoneNumber">
                {{ scope.row.supplierTelephoneNumber }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="资料来源"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.companyName }}
            </template>
          </el-table-column>
          <el-table-column
            prop="fa_no"
            label="出厂货号"
            align="center"
          ></el-table-column>
          <el-table-column prop="ch_pa" label="包装" align="center">
          </el-table-column>
          <el-table-column
            label="产品规格"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>
                {{ scope.row.ou_le }}x{{ scope.row.ou_wi }}x{{
                  scope.row.ou_hi
                }}(cm)
              </span>
            </template>
          </el-table-column>

          <el-table-column
            label="包装规格"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>
                {{ scope.row.in_le }}x{{ scope.row.in_wi }}x{{
                  scope.row.in_hi
                }}(cm)
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="外箱规格"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>
                {{ scope.row.ou_le }}x{{ scope.row.ou_wi }}x{{
                  scope.row.ou_hi
                }}(cm)
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="体积/材积"
            align="center"
            min-width="100"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>
                {{ scope.row.bulk_stere }}(cbm)/{{ scope.row.bulk_feet }}(cuft)
              </span>
            </template>
          </el-table-column>
          <el-table-column label="毛重/净重" align="center">
            <template slot-scope="scope">
              <span> {{ scope.row.gr_we }}/{{ scope.row.ne_we }}(kg) </span>
            </template>
          </el-table-column>
          <el-table-column label="装箱量" align="center">
            <template slot-scope="scope">
              <span> {{ scope.row.in_en }}/{{ scope.row.ou_lo }}(pcs) </span>
            </template>
          </el-table-column>
          <el-table-column prop="boxNumber" label="箱数" align="center">
            <template slot-scope="scope">
              <span>
                {{ handleOffer(scope.row.boxNumber) }}
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="箱数" align="center" width="100">
            <template slot-scope="scope">
              <input
                class="inputNumber"
                type="number"
                @input="changeInputNumber($event, scope.row)"
                @focus="selectInputValue($event)"
                @keydown="nextInput($event)"
                v-model="scope.row.boxNumber"
              />
            </template>
          </el-table-column> -->
          <el-table-column prop="ch_pa" label="总数量" align="center">
            <template slot-scope="scope">
              <span>
                {{
                  handleOffer(
                    sumPriceCount(scope.row.boxNumber, scope.row.ou_lo)
                  )
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="厂价" align="center">
            <template slot-scope="scope">
              <span style="color: #f56c6c"> ￥{{ scope.row.price }} </span>
            </template>
          </el-table-column>

          <el-table-column prop="offerAmount" label="报出价" align="center">
            <template slot-scope="scope">
              <span style="color: #f56c6c">
                {{ scope.row.cu_de + handleOffer(scope.row.offerAmount) }}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            prop="OfferTotalAmount"
            label="报出总价"
            align="center"
          >
            <template slot-scope="scope">
              <span style="color: #f56c6c">{{ scope.row.cu_de }}</span>
              <span style="color: #f56c6c">
                {{
                  handleOffer(
                    priceCount(
                      scope.row.offerAmount,
                      scope.row.ou_lo,
                      scope.row.boxNumber
                    )
                  )
                }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 统计 -->
        <div class="tableBtoBox">
          <div class="tableBto">
            <div class="right">
              <p class="item">
                <span class="itemTitle">总款数：</span>
                <span>{{ tableData.length }}</span>
              </p>
              <p class="item">
                <span class="itemTitle">总箱数：</span>
                <span>{{ myTotalQuantity(tableData) }}</span>
              </p>
              <p class="item">
                <span class="itemTitle">总体积/总材积：</span>
                <span
                  >{{ handleOffer(myTotalVolume(tableData).outerBoxStere) }}/{{
                    handleOffer(myTotalVolume(tableData).outerBoxFeet)
                  }}</span
                >
              </p>
              <p class="item">
                <span class="itemTitle">总毛重/总净重：</span>
                <span
                  >{{ handleOffer(totalMaozhong()) }}/{{
                    handleOffer(totalJingzhong())
                  }}(KG)</span
                >
              </p>
              <p class="item">
                <span class="itemTitle">总金额：</span>
                <span class="price"
                  >{{ item.cu_de + handleOffer(myTotalPrice(tableData)) }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <!-- <center style="padding:20px 0;">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[12, 24, 36, 48]"
            background
            :total="totalCount"
            :page-size="pageSize"
            :current-page.sync="currentPage"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          ></el-pagination>
        </center> -->
    <!-- 导出订单模板dialog -->
    <transition name="el-zoom-in-center">
      <el-dialog
        class="exportOrder"
        title="订单模板"
        v-if="exportTemplateDialog"
        :visible.sync="exportTemplateDialog"
        width="1200px"
      >
        <bsExportOrder :options="orderRow" />
      </el-dialog>
    </transition>
  </div>
</template>

<script>
import bsExportOrder from "@/components/commonComponent/exportOrderComponent/gongsizhaoyangbaojia.vue";
import bsSampleQuotationTopComponent from "@/components/bsComponents/bsSampleComponent/bsSampleQuotationTopComponent";
export default {
  name: "bsSampleQuotationDetails",
  components: {
    bsExportOrder,
    bsSampleQuotationTopComponent
  },
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      orderRow: {},
      exportTemplateDialog: false,
      handerTabData: [],
      tableData: [],
      currentPage: 1,
      pageSize: 500,
      totalCount: 0,
      itemList: {}
    };
  },
  created() {},

  mounted() {
    this.getProductOfferNumber();
  },
  methods: {
    // 判断编号
    handleOffer(row) {
      if (this.item.offerNumber.indexOf("S") < 0) {
        return row;
      } else {
        return 0;
      }
    },
    //厂商跳转
    toFactory(item) {
      const fd = {
        name: item.supplierNumber,
        linkUrl: this.$route.path,
        component: "bsMyClientsDetail",
        refresh: true,
        label: item.supplierName,
        value: {
          companyNumber: item.supplierNumber,
          companyLogo: item.supplierPersonnelLogo,
          companyName: item.supplierName,
          contactsMan: item.supplierPersonnelName,
          phoneNumber: item.supplierPhone,
          address: item.supplierAddres || item.supplierAddress
        }
      };
      this.$store.commit("myAddTab", fd);
    },
    // 获取该订单报价公式详情
    async getProductOfferNumber() {
      if (this.item.offerNumber.indexOf("S") < 0) {
        const fd = {
          OfferNumber: this.item.offerNumber
        };
        const res = await this.$http.post("/api/GetProductOfferByNumber", fd);
        if (res.data.result.code === 200) {
          this.handerTabData.push(res.data.result.item);
          this.itemList = res.data.result.item;
        } else {
          this.$message.error(res.data.result.msg);
        }
      }
      this.getProductOfferDetailPage();
    },
    // 点击产品名字跳转
    goDetails(row) {
      const fd = {
        name: row.productName + row.fa_no,
        linkUrl: "/bsIndex/bsSampleQuotation",
        component: "bsProductDetails",
        refresh: true,
        label: row.fa_no || "产品详情",
        value: row
      };
      this.$router.push("/bsIndex/bsProductSearchIndex");
      this.$store.commit("myAddTab", fd);
    },
    // 获取列表
    async getProductOfferDetailPage() {
      if (this.item.offerNumber.indexOf("S") < 0) {
        const fd = Object.assign(
          { skipCount: this.currentPage, maxResultCount: this.pageSize },
          this.item
        );

        const res = await this.$http.post("/api/ProductOfferDetailPage", fd);
        if (res.data.result.code === 200) {
          this.totalCount = res.data.result.item.totalCount;
          this.tableData = res.data.result.item.items;
        } else {
          this.$message.error(res.data.result.msg);
        }
      } else {
        const fd_s = {
          skipCount: this.currentPage,
          maxResultCount: this.pageSize,
          sampleNumber: this.item.offerNumber
        };
        const res = await this.$http.post(
          "/api/CompanySamplelistByNumber",
          fd_s
        );
        if (res.data.result.code === 200) {
          this.totalCount = res.data.result.item.totalCount;
          this.tableData = res.data.result.item.items;
        } else {
          this.$message.error(res.data.result.msg);
        }
      }
    },
    // 导出找样
    exportOrder() {
      this.orderRow = {
        sampleNumber: this.item.offerNumber,
        name: this.item.customerName,
        api: "/api/ExportSampleOfferToExcel"
      };
      this.exportTemplateDialog = true;
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getProductOfferDetailPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getProductOfferDetailPage();
    },

    isInteger(obj) {
      return Math.floor(obj) === obj;
    },
    /*
     * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
     * @param floatNum {number} 小数
     * @return {object}
     *   {times:100, num: 314}
     */
    toInteger(floatNum) {
      const ret = { times: 1, num: 0 };
      if (this.isInteger(floatNum)) {
        ret.num = floatNum;
        return ret;
      }
      const strfi = floatNum + "";
      const dotPos = strfi.indexOf(".");
      const len = strfi.substr(dotPos + 1).length;
      const times = Math.pow(10, len);
      const intNum = parseInt(floatNum * times + 0.5, 10);
      ret.times = times;
      ret.num = intNum;
      return ret;
    },
    /*
     * 核心方法，实现加减乘除运算，确保不丢失精度
     * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
     *
     * @param a {number} 运算数1
     * @param b {number} 运算数2
     * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
     * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
     *
     */
    operation(a, b, digits, op) {
      const o1 = this.toInteger(a);
      const o2 = this.toInteger(b);
      const n1 = o1.num;
      const n2 = o2.num;
      const t1 = o1.times;
      const t2 = o2.times;
      const max = t1 > t2 ? t1 : t2;
      let result = null;
      switch (op) {
        case "add":
          if (t1 === t2) {
            // 两个小数位数相同
            result = n1 + n2;
          } else if (t1 > t2) {
            // o1 小数位 大于 o2
            result = n1 + n2 * (t1 / t2);
          } else {
            // o1 小数位 小于 o2
            result = n1 * (t2 / t1) + n2;
          }
          return result / max;
        case "subtract":
          if (t1 === t2) {
            result = n1 - n2;
          } else if (t1 > t2) {
            result = n1 - n2 * (t1 / t2);
          } else {
            result = n1 * (t2 / t1) - n2;
          }
          return result / max;
        case "multiply":
          result = (n1 * n2) / (t1 * t2);
          return result;
        case "divide":
          result = (n1 / n2) * (t2 / t1);
          return result;
      }
    },
    // 加
    add(a, b, digits) {
      return this.operation(a, b, digits, "add");
    },
    // 减
    subtract(a, b, digits) {
      return this.operation(a, b, digits, "subtract");
    },
    // 乘
    multiply(a, b, digits) {
      return this.operation(a, b, digits, "multiply");
    },
    // 除
    divide(a, b, digits) {
      return this.operation(a, b, digits, "divide");
    },
    // 总数量
    sumPriceCount(boxNumber, ou_lo) {
      return this.multiply(boxNumber, ou_lo);
    },
    // 单个产品总价
    priceCount(price, ou_lo, boxNumber) {
      return this.multiply(this.multiply(price, ou_lo), boxNumber);
    },
    // 计算总净重
    totalJingzhong() {
      let number = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        number = this.add(
          number,
          this.multiply(this.tableData[i].boxNumber, this.tableData[i].ne_we)
        );
      }
      return number;
    },
    // 计算总毛重
    totalMaozhong() {
      let number = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        number = this.add(
          number,
          this.multiply(this.tableData[i].boxNumber, this.tableData[i].gr_we)
        );
      }
      return number;
    },
    // 计算总体积材积
    myTotalVolume(list) {
      let outerBoxStere = 0,
        outerBoxFeet = 0;
      for (let i = 0; i < list.length; i++) {
        outerBoxStere = this.add(
          outerBoxStere,
          this.multiply(list[i].bulk_stere, list[i].boxNumber)
        );
        outerBoxFeet = this.add(
          outerBoxFeet,
          this.multiply(list[i].bulk_feet, list[i].boxNumber)
        );
      }
      return {
        outerBoxStere,
        outerBoxFeet
      };
    },
    // 计算总箱数量
    myTotalQuantity() {
      let number = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        number = this.add(number, this.tableData[i].boxNumber || 0);
      }
      return number;
    },
    // 计算总价
    myTotalPrice(list) {
      let price = 0;

      for (let i = 0; i < list.length; i++) {
        price = this.add(
          price,
          this.multiply(
            this.multiply(list[i].offerAmount, list[i].boxNumber),
            list[i].ou_lo
          )
        );
      }
      return price;
    },

    // 点击箱数选中输入框中的所有值
    selectInputValue(e) {
      e.currentTarget.select();
    },
    // 修改数量
    changeInputNumber(e, val) {
      const re = /^[0-9]+.?[0-9]*/;
      if (!re.test(e.target.value)) {
        e.target.value = 0;
      } else if (e.target.value.length > 5) {
        e.target.value = e.target.value.slice(0, 5);
      } else if (!e.target.value) {
        e.target.value = 0;
      } else if (e.target.value.length > 1 && e.target.value[0] == 0) {
        e.target.value = e.target.value.slice(1, 5);
      }
      val.shoppingCount = Number(e.target.value);
      this.$store.commit("replaceShoppingCartValueCount", this.tableData);
    }
  },
  // 点击上下键盘
  nextInput(e) {
    if (e.keyCode === 40) {
      const inputs = document.getElementsByClassName("inputNumber");
      for (let i = 0; i < inputs.length; i++) {
        // 如果是最后一个，则焦点回到第一个
        if (i == inputs.length - 1) {
          inputs[0].focus();
        } else if (e.target == inputs[i]) {
          inputs[i + 1].focus();
          break; //不加最后一行eles就直接回到第一个输入框
        }
      }
      e.stopPropagation();
      e.preventDefault();
      e.returnValue = false;
      e.cancelBubble = true;
    } else if (e.keyCode === 38) {
      const inputs = document.getElementsByClassName("inputNumber");
      for (let i = 0; i < inputs.length; i++) {
        // 如果是最后一个，则焦点回到第一个
        if (i === 0) {
          inputs[inputs.length - 1].focus();
        } else if (e.target == inputs[i]) {
          inputs[i - 1].focus();
          break; //不加最后一行eles就直接回到第一个输入框
        }
      }
      e.stopPropagation();
      e.preventDefault();
      e.returnValue = false;
      e.cancelBubble = true;
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsSampleQuotationDetails {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
  .title {
    height: 50px;
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
  .bsSampleTable {
    padding-top: 15px;
    margin-bottom: 80px;
    .top {
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
    }
  }
  @{deep} .tableBox {
    .el-table {
      font-size: 13px;
      padding-bottom: 60px;
      .inputNumber {
        width: 50px;
        outline: none;
        -moz-appearance: textfield;
        text-align: center;
        color: #ff3e3e;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
        }
      }
      .imgBox {
        text-align: left;
        display: flex;
        font-size: 14px;
        .el-image {
          cursor: pointer;
        }
        .productName {
          width: 130px;
          height: 60px;
          margin-left: 15px;
          cursor: pointer;
          .name,
          .factory {
            width: 130px;
            max-width: 130px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
          .factory {
            color: #3368a9;
            display: flex;
            align-items: center;
            .factoryName {
              cursor: pointer;
            }
            .icons {
              display: flex;
              .cartPhoneIcon,
              .cartInfoIcon {
                width: 20px;
                height: 20px;
                margin-left: 15px;
                cursor: pointer;
              }
              .cartPhoneIcon {
                background: url("~@/assets/images/cartPhoneIcon.png") no-repeat
                  center;
                background-size: contain;
              }
              .cartInfoIcon {
                background: url("~@/assets/images/cartInfoIcon.png") no-repeat
                  center;
                background-size: contain;
              }
            }
          }
          .name {
            margin-top: 8px;
          }
        }
      }
    }
    .tableBtoBox {
      position: absolute;
      width: 100%;
      margin-right: 20px;
      z-index: 1;
      left: 0;
      bottom: 0;
      box-sizing: border-box;
      padding-right: 20px;
      .tableBto {
        width: 100%;
        display: flex;
        align-items: center;
        background-color: #fff;
        height: 80px;
        padding: 0 30px;
        box-sizing: border-box;
        .right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .item {
            margin-right: 15px;
            display: flex;
            align-items: center;
            // .itemTitle {
            // }
            .price {
              color: #eb1515;
              font-weight: 700;
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}
// 表格样式
@{deep} .el-table {
  /*
	 *改变浏览器默认的滚动条样式
	 */
  .el-table__body-wrapper::-webkit-scrollbar-track {
    background-color: #f8f8f8;
  }
  .el-table__body-wrapper::-webkit-scrollbar-track-piece {
    background-color: #f8f8f8;
  }
  .el-table__body-wrapper::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #dddddd;
    border-radius: 3px;
  }
  .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
  }
  .el-table__header {
    .cell {
      font-weight: 400;
      font-size: 14px;
      color: #666;
    }
  }
  .cell {
    padding: 0 2px;
  }
}
@{deep} .exportOrder {
  .el-dialog__body {
    padding: 0;
  }
}
@media screen and (max-width: 1768px) {
  .tableBtoBox {
    padding-right: 10px !important;
    bottom: 10px !important;
  }
}
@media screen and (min-width: 1919px) {
  .tableBtoBox {
    padding-right: 0px !important;
    bottom: 0px !important;
  }
}
</style>
