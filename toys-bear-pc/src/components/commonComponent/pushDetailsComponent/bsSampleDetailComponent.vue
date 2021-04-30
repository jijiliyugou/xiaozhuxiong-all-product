<template>
  <div class="bsSampleDetailComponent">
    <div class="tableBox">
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="collecTable"
        :header-cell-style="{ background: '#f1f3f6' }"
      >
        <el-table-column label="序号" type="index" align="center" width="60">
        </el-table-column>
        <el-table-column prop="img" label="产品" width="280">
          <template slot-scope="scope">
            <div class="imgBox">
              <el-image
                @click.native="goDetails(scope.row)"
                fit="contain"
                style="width: 80px; height: 60px"
                :src="scope.row.imgUrlList && scope.row.imgUrlList[0]"
              >
                <div slot="placeholder" class="errorImg">
                  <img
                    style="width: 55px; height: 60px"
                    src="~@/assets/images/imgError.png"
                    alt
                  />
                </div>
                <div slot="error" class="errorImg">
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
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="scope.row.supplierPhone || '暂时没有厂商电话'"
                      placement="top"
                    >
                      <div class="cartPhoneIcon"></div>
                    </el-tooltip>
                    <div class="cartInfoIcon"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="资料来源" align="center">
          <template slot-scope="scope">
            {{ scope.row.supplierName }}
          </template>
        </el-table-column>
        <el-table-column
          prop="fa_no"
          label="出厂货号"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column prop="ch_pa" label="包装" align="center" width="100">
        </el-table-column>
        <el-table-column label="产品规格" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.ou_le }}x{{ scope.row.ou_wi }}x{{
                scope.row.ou_hi
              }}(cm)
            </span>
          </template>
        </el-table-column>

        <el-table-column label="包装规格" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.in_le }}x{{ scope.row.in_wi }}x{{
                scope.row.in_hi
              }}(cm)
            </span>
          </template>
        </el-table-column>
        <el-table-column label="外箱规格" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.ou_le }}x{{ scope.row.ou_wi }}x{{
                scope.row.ou_hi
              }}(cm)
            </span>
          </template>
        </el-table-column>
        <el-table-column label="体积/材积" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.bulk_stere }}(cbm)/{{ scope.row.bulk_feet }}(cuft)
            </span>
          </template>
        </el-table-column>
        <el-table-column label="毛重/净重" align="center" width="100">
          <template slot-scope="scope">
            <span> {{ scope.row.gr_we }}/{{ scope.row.ne_we }}(kg) </span>
          </template>
        </el-table-column>
        <el-table-column label="装箱量" align="center" width="100">
          <template slot-scope="scope">
            <span> {{ scope.row.in_en }}/{{ scope.row.ou_lo }}(pcs) </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="boxNumber"
          label="箱数"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.boxNumber }}
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
        <el-table-column prop="ch_pa" label="总数量" align="center" width="100">
          <template slot-scope="scope">
            <span>
              {{ sumPriceCount(scope.row.boxNumber, scope.row.ou_lo) }}
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="price" label="厂价" align="center" width="100">
          <template slot-scope="scope">
            <span style="color: #f56c6c"> ￥{{ scope.row.price }} </span>
          </template>
        </el-table-column> -->

        <el-table-column
          prop="offerAmount"
          label="单价"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span style="color: #f56c6c">
              {{ scope.row.cu_de + scope.row.offerAmount }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="OfferTotalAmount"
          label="总价"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span style="color: #f56c6c">{{ scope.row.cu_de }}</span>
            <span style="color: #f56c6c">
              {{
                priceCount(
                  scope.row.offerAmount,
                  scope.row.ou_lo,
                  scope.row.boxNumber
                )
              }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
              >{{ myTotalVolume(tableData).outerBoxStere }}/{{
                myTotalVolume(tableData).outerBoxFeet
              }}</span
            >
          </p>
          <p class="item">
            <span class="itemTitle">总毛重/总净重：</span>
            <span>{{ totalMaozhong() }}/{{ totalJingzhong() }}(KG)</span>
          </p>
          <p class="item">
            <span class="itemTitle">总金额：</span>
            <span class="price">{{ myTotalPrice(tableData) }} </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import bsAddOfferFormulaLang from "@/components/bsComponents/bsPersonalManageComponent/bsAddOfferFormulaLang";
export default {
  props: {
    productList: {
      type: Array
    },
    dialogVisible: {
      type: Boolean
    }
  },
  components: {
    // bsAddOfferFormulaLang
  },
  data() {
    return {
      tableData: []
    };
  },
  methods: {
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
      this.$store.commit("myAddTab", fd);
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
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsSampleDetailComponent {
  @{deep} .tableBox {
    .el-table {
      font-size: 13px;
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
          width: 190px;
          height: 60px;
          margin-left: 15px;
          cursor: pointer;
          .name,
          .factory {
            width: 190px;
            max-width: 190px;
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
  }
  .tableBtoBox {
    width: 100%;
    display: flex;
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
// 表格样式
.el-table {
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
}
</style>
