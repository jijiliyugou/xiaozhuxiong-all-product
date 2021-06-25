<template>
  <div class="myCartBoX">
    <div class="wrapTitle">
      {{ myShoppingCartLang.myShoppingCart }}
      <span class="email" v-if="userInfo.loginEmail"
        >（{{ userInfo.loginEmail }}）</span
      >
    </div>
    <!-- 排序 -->
    <div class="sortBox">
      <p :class="{ sortID: true, active: isID !== 0 }" @click="sortID">
        <span class="text">{{ myShoppingCartLang.id }}</span>
        <i v-show="isID === 0" class="el-icon-d-caret"></i>
        <i class="el-icon-caret-bottom" v-show="isID === 1"></i>
        <i v-show="isID === 2" class="el-icon-caret-top"></i>
      </p>
      <p :class="{ sortID: true, active: isPrice !== 0 }" @click="sortPrice">
        <span class="text">{{ myShoppingCartLang.price }}</span>
        <i v-show="isPrice === 0" class="el-icon-d-caret"></i>
        <i class="el-icon-caret-bottom" v-show="isPrice === 1"></i>
        <i v-show="isPrice === 2" class="el-icon-caret-top"></i>
      </p>
      <p :class="{ sortID: true, active: isCTNS !== 0 }" @click="sortCTNS">
        <span class="text">{{ myShoppingCartLang.CTNS }}</span>
        <i v-show="isCTNS === 0" class="el-icon-d-caret"></i>
        <i class="el-icon-caret-bottom" v-show="isCTNS === 1"></i>
        <i v-show="isCTNS === 2" class="el-icon-caret-top"></i>
      </p>
      <p
        :class="{ sortID: true, active: isTotalQTY !== 0 }"
        @click="sortTotalQTY"
      >
        <span class="text">{{ myShoppingCartLang.totalQTY }}</span>
        <i v-show="isTotalQTY === 0" class="el-icon-d-caret"></i>
        <i class="el-icon-caret-bottom" v-show="isTotalQTY === 1"></i>
        <i v-show="isTotalQTY === 2" class="el-icon-caret-top"></i>
      </p>
      <p
        :class="{ sortID: true, active: isTotalAmount !== 0 }"
        @click="sortTotalAmount"
      >
        <span class="text">{{ myShoppingCartLang.totalAmount }}</span>
        <i v-show="isTotalAmount === 0" class="el-icon-d-caret"></i>
        <i class="el-icon-caret-bottom" v-show="isTotalAmount === 1"></i>
        <i v-show="isTotalAmount === 2" class="el-icon-caret-top"></i>
      </p>
    </div>
    <!-- 表格 -->
    <div class="tableBoxWrap">
      <el-table
        :cell-style="idStyle"
        :header-cell-style="{
          backgroundColor: '#F5F5F5',
          color: '#666',
          'font-size': '14px',
          'font-weight': 700,
          padding: '0'
        }"
        :data="dataList"
        @selection-change="selectionChange"
        id="myTable"
        ref="multipleTable"
        size="medium"
        :empty-text="publicLang.noData"
        tooltip-effect="dark"
        highlight-current-row
      >
        <el-table-column
          type="selection"
          width="30"
          align="center"
        ></el-table-column>
        <el-table-column
          width="50"
          align="center"
          prop="index"
          :label="myShoppingCartLang.id"
        ></el-table-column>
        <el-table-column
          :label="myShoppingCartLang.productInformation"
          align="center"
        >
          <template slot-scope="scope">
            <div class="productInformation">
              <div class="imgBox" @click="openProductDetail(scope.row)">
                <el-image
                  style="width: 100px; height: 100px; cursor: pointer;"
                  fit="contain"
                  :src="scope.row.productImgs"
                >
                  <div slot="placeholder" class="image-slot">
                    <img
                      class="errorImg"
                      style="width: 100px; height: 100px"
                      src="~@/assets/images/logo.png"
                      alt
                    />
                  </div>
                  <div slot="error" class="image-slot">
                    <img
                      class="errorImg"
                      style="width: 100px; height: 100px"
                      src="~@/assets/images/logo.png"
                      alt
                    />
                  </div>
                </el-image>
              </div>
              <div class="productNameBox">
                <p class="name">
                  {{
                    globalLang === "zh-CN"
                      ? scope.row.productJson.name
                      : scope.row.productJson.ename
                  }}
                </p>
                <p class="fa_no" v-if="shareInfo.showNumber == 1">
                  No.{{ scope.row.productJson.number }}
                </p>
                <p class="fa_no" v-else-if="shareInfo.showNumber == 2">
                  No.{{ scope.row.productNumber }}
                </p>
                <p class="fa_no" v-else-if="shareInfo.showNumber == -1"></p>
                <p class="fa_no" v-else>No.{{ scope.row.productJson.fa_no }}</p>
                <p class="price" v-if="shareInfo.isShowPrice">
                  <span>{{ userInfo.currencyType }}</span>
                  <span class="priceText">{{
                    scope.row.shareProductJson.price
                  }}</span>
                </p>
              </div>
              <div class="item">
                <div class="content">
                  <span>{{ myShoppingCartLang.packingMethod }}：</span>
                  <span>
                    {{
                      globalLang === "zh-CN"
                        ? scope.row.productJson.ch_pa
                        : scope.row.productJson.en_pa
                    }}
                  </span>
                </div>
                <div class="content">
                  <span>{{ myShoppingCartLang.productSpecification }}：</span>
                  <span
                    >{{ scope.row.productJson.pr_le }} x
                    {{ scope.row.productJson.pr_wi }} x
                    {{ scope.row.productJson.pr_hi }} (CM)</span
                  >
                </div>
                <div class="content">
                  <span>{{ myShoppingCartLang.packageSpecification }}：</span>
                  <span
                    >{{ scope.row.productJson.in_le }} x
                    {{ scope.row.productJson.in_wi }} x
                    {{ scope.row.productJson.in_hi }} (CM)</span
                  >
                </div>
                <div class="content">
                  <span>{{ myShoppingCartLang.outerBoxSize }}：</span>
                  <span
                    >{{ scope.row.productJson.ou_le }} x
                    {{ scope.row.productJson.ou_wi }} x
                    {{ scope.row.productJson.ou_hi }} (CM)</span
                  >
                </div>
              </div>
              <div class="item">
                <div class="content">
                  <span>{{ myShoppingCartLang.packingQuantity }}：</span>
                  <span
                    >{{ scope.row.productJson.in_en }} /
                    {{ scope.row.productJson.ou_lo }} (PCS)</span
                  >
                </div>
                <div class="content">
                  <span>{{ myShoppingCartLang.volumeVolume }}：</span>
                  <span
                    >{{ scope.row.productJson.bulk_stere }} (CBM) /
                    {{ scope.row.productJson.bulk_feet }} (CUFT)</span
                  >
                </div>
                <div class="content">
                  <span>{{ myShoppingCartLang.grossNetWeight }}：</span>
                  <span
                    >{{ scope.row.productJson.gr_we }} /
                    {{ scope.row.productJson.ne_we }} (KG)</span
                  >
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="myShoppingCartLang.CTNS"
          align="center"
          width="100"
        >
          <template slot="header">
            <div style="line-height: normal;">
              <p style="padding:0;line-height: 13px;">
                {{ myShoppingCartLang.CTNS }}
              </p>
              <p style="padding:0;line-height: 13px;">
                {{ myShoppingCartLang.totalQTY }}
              </p>
            </div>
          </template>
          <template slot-scope="scope">
            <div>
              <div>
                <input
                  class="inputNumber"
                  type="number"
                  @input="changeInputNumber($event, scope.row)"
                  @blur="blurInputValue($event, scope.row)"
                  @focus="selectInputValue($event)"
                  @keydown="nextInput($event)"
                  v-model="scope.row.number"
                />
              </div>
              <div class="tableTotalNumber">
                {{ multiply(scope.row.productJson.ou_lo, scope.row.number) }}
                <span>PCS</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="120" align="center">
          <template slot="header">
            <div style="line-height: normal;">
              <p style="padding:0;line-height: 13px;">
                {{ myShoppingCartLang.totalVolume }}
              </p>
              <p style="padding:0;line-height: 13px;">
                {{ myShoppingCartLang.totalAmount }}
              </p>
            </div>
          </template>
          <template slot-scope="scope">
            <div class="tableTotalVolume">
              <div class="item">
                <p class="item">
                  {{
                    multiply(
                      scope.row.number,
                      scope.row.productJson.bulk_stere
                    )
                  }}cbm
                </p>
                <p class="item">
                  {{
                    multiply(scope.row.number, scope.row.productJson.bulk_feet)
                  }}cuft
                </p>
              </div>
              <p class="item price" v-if="shareInfo.isShowPrice">
                <span>{{ userInfo.currencyType }}</span>
                <span>
                  {{
                    priceCount(
                      scope.row.shareProductJson.price,
                      scope.row.productJson.ou_lo,
                      scope.row.number
                    )
                  }}
                </span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-popconfirm
              class="deleteBtn"
              :title="
                globalLang === 'zh-CN'
                  ? '确定要删除此产品吗？'
                  : 'Are you sure you want to delete this product?'
              "
              @confirm="handleDelete(scope.row)"
            >
              <i class="el-icon-delete" slot="reference"></i>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="statisticsBox">
      <div class="totalWrapBox">
        <!-- 总数 -->
        <div class="totalBox" style="border-bottom:1px solid #e9e9e9;">
          <!-- 总体积 -->
          <div class="totalWrap totalVolume">
            {{ myShoppingCartLang.totalVolume }}：
            <span class="changeColor left">
              {{ myTotalOuterBoxStere }}cbm
            </span>
            <span class="changeColor right">
              {{ myTotalOuterBoxFeet }}cuft
            </span>
          </div>
          <!-- 总净重 -->
          <div class="totalWrap totalVolume">
            {{ myOrderLang.totalGrossNetWeight }}：
            <span class="changeColor">{{ myTotalMaozhong }}/</span
            ><span class="changeColor">{{ myTotalJingzhong }}</span>
            <span class="changeColor">(kg)</span>
          </div>
        </div>
        <div class="totalBox" style="border-bottom:1px solid #e9e9e9;">
          <!-- 总条数 -->
          <div class="totalWrap totalVolume">
            {{ myShoppingCartLang.totalRecords }} ：
            <span class="changeColor">
              {{ selectTableData.length }}
            </span>
          </div>
          <!-- 总箱数 -->
          <div class="totalWrap totalVolume">
            {{ myShoppingCartLang.totalQuantity }} ：
            <span class="changeColor">
              {{ myTotalQuantity }}
            </span>
          </div>
          <!-- 总个数 -->
          <div class="totalWrap totalVolume">
            {{ myShoppingCartLang.totalCount }}：
            <span class="changeColor">
              {{ myTotalGe }}
            </span>
          </div>
          <!-- 总价 -->
          <div class="totalWrap totalPrice" v-if="shareInfo.isShowPrice">
            {{ myShoppingCartLang.totalPrice }}：
            <span class="price">{{ userInfo.currencyType }}</span>
            <span style="margin-left:5px;" class="price">
              {{ myTotalPrice }}
            </span>
          </div>
        </div>
      </div>
      <!-- 提交信息 -->
      <div class="contactInfoBox" v-if="userInfo.isCustomerInfo">
        <div class="title">{{ myShoppingCartLang.contactInformation }}</div>
        <div class="userInfoBox">
          <el-form label-position="right" label-width="130px" :model="formInfo">
            <div class="wrapBox">
              <div class="left">
                <el-form-item :label="myShoppingCartLang.companyName">
                  <el-input
                    maxlength="30"
                    v-model="formInfo.companyName"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="right">
                <el-form-item :label="myShoppingCartLang.contact">
                  <el-input
                    maxlength="30"
                    v-model="formInfo.contactName"
                  ></el-input>
                </el-form-item>
                <el-form-item :label="myShoppingCartLang.email">
                  <el-input maxlength="30" v-model="formInfo.email"></el-input>
                </el-form-item>
              </div>
            </div>
            <el-form-item :label="myShoppingCartLang.remark">
              <el-input maxlength="255" v-model="formInfo.remark"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="submitBox">
        <el-button
          type="warning"
          :disabled="
            $refs.multipleTable && $refs.multipleTable.selection.length < 1
          "
          class="submitBtn"
          @click="submitOrder"
          >{{ myShoppingCartLang.submit
          }}<span
            v-if="
              $refs.multipleTable && $refs.multipleTable.selection.length > 0
            "
          >
            ({{ $refs.multipleTable && $refs.multipleTable.selection.length }})
          </span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import shoppingCartJs from "@/mixins/shoppingCart.js";
export default {
  name: "pcShoppingCart",
  components: {},
  mixins: [shoppingCartJs],
  data() {
    return {};
  },
  methods: {},
  created() {}
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.myCartBoX {
  max-width: 1240px;
  background-color: #fff;
  margin: 0 auto;
  .wrapTitle {
    height: 60px;
    padding: 0 32px;
    display: flex;
    align-items: center;
    color: #333;
    font-size: 20px;
    font-weight: bold;
    .email {
      font-size: 16px;
      color: #999;
      font-weight: 400;
    }
  }
  .sortBox {
    display: flex;
    align-items: center;
    height: 50px;
    background: #fcfcfc;
    box-sizing: border-box;
    padding: 0 20px 0 40px;
    .sortID {
      cursor: pointer;
      margin-right: 40px;
      .text {
        margin-right: 5px;
      }
      &.active {
        color: #ff760e;
      }
    }
  }
  .tableBoxWrap {
    padding: 0 20px;
    box-sizing: border-box;
  }
  @{deep} .el-table {
    color: #000;
    font-size: 14px;
    .el-input-number {
      .el-input {
        .el-input__inner {
          color: #ff3e3e;
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
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
    .tableTotalNumber {
      color: #ff3e3e;
      font-size: 14px;
      margin-top: 5px;
    }
    .el-table-column--selection .cell {
      padding: 0;
    }
    .deleteBtn {
      cursor: pointer;
    }
    .productInformation {
      width: 100%;
      // height: 100px;
      min-height: 100px;
      display: flex;
      justify-content: space-between;
      .imgBox {
        width: 100px;
        height: 100%;
        position: relative;
      }
      .productNameBox {
        flex: 1;
        min-height: 100px;
        text-align: left;
        box-sizing: border-box;
        padding: 0 20px;
        display: flex;
        flex-direction: column;
        .name {
          color: #333;
          font-weight: bold;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;

          position: relative;
          line-height: 20px;
          max-height: 40px;
        }
        .fa_no,
        .price {
          color: #ff3e3e;
        }
        .price {
          font-weight: 600;
          .priceText {
            margin-left: 3px;
          }
        }
      }
      .item {
        flex: 1;
        text-align: left;
        box-sizing: border-box;
        padding: 0 10px;
        min-height: 100px;
        display: flex;
        flex-direction: column;
        color: #666666;
        font-size: 12px;
      }
    }
    .tableTotalVolume {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #ff3e3e;
      height: 90px;
      .price {
        font-weight: bold;
        font-size: 16px;
      }
    }
  }
  .statisticsBox {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    color: #666;
    font-size: 14px;
    .totalBox {
      height: 50px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0 25px;
      justify-content: flex-end;
      .totalWrap {
        margin-left: 40px;
        display: flex;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .totalVolume {
        .changeColor {
          color: #ff3e3e;
          font-size: 18px;
          &.right {
            margin-left: 15px;
          }
        }
      }
      .totalPrice {
        .price {
          color: #ff3e3e;
          font-size: 24px;
          font-weight: bold;
        }
      }
    }
    .contactInfoBox {
      margin-top: 20px;
      box-sizing: border-box;
      padding: 0 25px 10px 25px;
      font-size: 14px;
      color: #606266;
      background: #f5f5f5;
      .title {
        font-size: 16px;
        color: #666;
        font-weight: bold;
        box-sizing: border-box;
        padding: 26px 0;
      }
      @{deep} .userInfoBox {
        .el-form-item {
          color: #606266;
          .el-form-item__label {
            color: #606266;
          }
        }
        .wrapBox {
          display: flex;
          .left,
          .right {
            width: 40%;
          }
          .right {
            flex: 1;
            display: flex;
            .el-form-item {
              flex: 1;
            }
          }
        }
      }
    }
    .submitBox {
      height: 106px;
      padding: 0 43px;
      .submitBtn {
        width: 197px;
        height: 46px;
        // background: #FF760E;
        opacity: 1;
        border-radius: 5px;
        font-size: 18px;
        font-weight: bold;
        margin-top: 25px;
        float: right;
      }
    }
  }
}
.deleteIcon {
  cursor: pointer;
}
.tablePrice {
  color: #ff3e3e;
  .price {
    margin-left: 5px;
  }
}
@{deep} .el-checkbox__input {
  padding: 6px;
  .el-checkbox__inner {
    width: 18px;
    height: 18px;
    &::after {
      left: 6px;
      top: 3px;
    }
  }
}
@{deep} .el-checkbox__input.is-indeterminate {
  .el-checkbox__inner::before {
    top: 7px;
  }
}
</style>
