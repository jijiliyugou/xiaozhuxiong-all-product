<template>
  <div class="myCartBoX">
    <!-- <div class="wrapTitle">
        {{ myShoppingCartLang.myShoppingCart }}
        <span class="email" v-if="userInfo.loginEmail"
          >（{{ userInfo.loginEmail }}）</span
        >
      </div> -->
    <!-- 排序 -->
    <div class="sortBox">
      <!-- <p :class="{ sortID: true, active: isID !== 0 }" @click="sortID">
          <span class="text">{{ myShoppingCartLang.id }}</span>
          <i v-show="isID === 0" class="el-icon-d-caret"></i>
          <i class="el-icon-caret-bottom" v-show="isID === 1"></i>
          <i v-show="isID === 2" class="el-icon-caret-top"></i>
        </p> -->
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
      <!-- <p
          :class="{ sortID: true, active: isTotalAmount !== 0 }"
          @click="sortTotalAmount"
        >
          <span class="text">{{ myShoppingCartLang.totalAmount }}</span>
          <i v-show="isTotalAmount === 0" class="el-icon-d-caret"></i>
          <i class="el-icon-caret-bottom" v-show="isTotalAmount === 1"></i>
          <i v-show="isTotalAmount === 2" class="el-icon-caret-top"></i>
        </p> -->
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
        :show-header="false"
      >
        <el-table-column
          type="selection"
          width="30"
          align="center"
        ></el-table-column>
        <el-table-column
          :label="myShoppingCartLang.productInformation"
          align="center"
        >
          <template slot-scope="scope">
            <div class="productInformation">
              <div class="imgBox" @click="openProductDetail(scope.row)">
                <el-image
                  style="width: 110px; height: 110px; cursor: pointer"
                  :src="scope.row.productImgs"
                >
                  <!-- <el-image
                    style="width: 110px; height: 110px; cursor: pointer;"
                    fit="contain"
                    :src="scope.row.productImgs"
                  > -->
                  <div slot="placeholder" class="image-slot">
                    <img
                      class="errorImg"
                      style="width: 110px; height: 110px"
                      src="~@/assets/images/logo.png"
                      alt
                    />
                  </div>
                  <div slot="error" class="image-slot">
                    <img
                      class="errorImg"
                      style="width: 110px; height: 110px"
                      src="~@/assets/images/logo.png"
                      alt
                    />
                  </div>
                </el-image>
              </div>
              <div class="infoBox">
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
                  <p class="fa_no" v-else>
                    No.{{ scope.row.productJson.fa_no }}
                  </p>
                  <p class="price" v-if="shareInfo.isShowPrice">
                    <span>{{ userInfo.currencyType }}</span>
                    <span class="priceText">{{
                      scope.row.shareProductJson.price
                    }}</span>
                  </p>
                  <p class="price" v-if="shareInfo.isShowPrice">
                    {{ myShoppingCartLang.totalPrice }}:
                    <span>{{ userInfo.currencyType }}</span>
                    <span class="priceText">{{
                      priceCount(
                        scope.row.shareProductJson.price,
                        scope.row.productJson.ou_lo,
                        scope.row.number
                      )
                    }}</span>
                  </p>
                </div>
                <div class="item">
                  <div class="bottom_info">
                    <div>
                      <span>{{ myShoppingCartLang.CTNS }}：</span>
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
                    <!-- <div class="tableTotalNumber">
                                {{ multiply(scope.row.productJson.ou_lo, scope.row.number) }}
                                <span>PCS</span>
                            </div> -->
                    <div class="delete_btn">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="totalWrapBox">
      <div class="totalBox" style="border-bottom: 1px solid #e9e9e9">
        <div class="select_all">
          <el-checkbox v-model="checked" @change="selectAll">
            {{ myShoppingCartLang.selectAll }}</el-checkbox
          >
        </div>
        <div class="totalWrap totalPrice" v-if="shareInfo.isShowPrice">
          <div class="title">
            {{ myShoppingCartLang.totalPrice }}
          </div>
          <div>
            <span class="price">{{ userInfo.currencyType }}</span>
            <span style="margin-left: 5px" class="price">
              {{ myTotalPrice }}
            </span>
          </div>
        </div>
        <div class="submitBox">
          <el-button
            size="mini"
            type="warning"
            :disabled="
              $refs.multipleTable && $refs.multipleTable.selection.length < 1
            "
            class="submitBtn"
            @click="dialogFormVisible = true"
            >{{ myShoppingCartLang.submit
            }}<span
              v-if="
                $refs.multipleTable && $refs.multipleTable.selection.length > 0
              "
            >
              ({{
                $refs.multipleTable && $refs.multipleTable.selection.length
              }})
            </span>
          </el-button>
        </div>
      </div>
    </div>
    <el-dialog title="" :visible.sync="dialogFormVisible" width="90%">
      <div class="statisticsBox">
        <!-- 提交信息 -->
        <div class="contactInfoBox" v-if="userInfo.isCustomerInfo">
          <div class="title">{{ myShoppingCartLang.contactInformation }}</div>
          <div class="userInfoBox">
            <el-form
              label-position="right"
              label-width="130px"
              :model="formInfo"
            >
              <div class="wrapBox">
                <div class="left">
                  <el-form-item :label="myShoppingCartLang.companyName">
                    <el-input
                      maxlength="30"
                      v-model="formInfo.companyName"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="myShoppingCartLang.contact">
                    <el-input
                      maxlength="30"
                      v-model="formInfo.contactName"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="myShoppingCartLang.email">
                    <el-input
                      maxlength="30"
                      v-model="formInfo.email"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="myShoppingCartLang.remark">
                    <el-input
                      maxlength="255"
                      v-model="formInfo.remark"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="contact_btn">
            <el-button type="warning" @click="submitOrder">{{
              myShoppingCartLang.submit
            }}</el-button>
            <el-button @click="dialogFormVisible = false">{{
              myShoppingCartLang.cancel
            }}</el-button>
          </div>
        </div>
      </div>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitOrder">确 定</el-button>
      </div> -->
    </el-dialog>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import shoppingCartJs from "@/mixins/shoppingCart.js";
export default {
  name: "mbShoppingCart",
  components: {},
  mixins: [shoppingCartJs],
  data() {
    return {
      checked: true,
      dialogFormVisible: false
    };
  },
  methods: {
    selectAll(value) {
      if (value) {
        this.dataList.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 提交订单
    async submitOrder() {
      const selectProducts = this.$refs.multipleTable.selection;
      console.log(selectProducts);
      this.formInfo.currencyType = this.userInfo.currencyType;
      this.formInfo.shareOrderDetails = selectProducts.map(val => {
        return {
          productNumber: val.shareProductJson.productNumber,
          productName: val.shareProductJson.name,
          productEName: val.shareProductJson.ename,
          productPrice: val.shareProductJson.price,
          productCount: Number(val.number),
          productFeet: val.shareProductJson.outerBoxFeet,
          productStere: val.shareProductJson.outerBoxStere,
          productImage: val.productImgs,
          currencyType: this.userInfo.currencyType,
          outerBoxLo: val.shareProductJson.outerBoxLo,
          packMethod:
            this.globalLang === "zh-CN"
              ? val.shareProductJson.packMethod
              : val.shareProductJson.ePackMethod,
          productInfo: val.shareProductJson
        };
      });
      const res = await this.$http.post(
        "/api/WebsiteShare/CreateShareOrder",
        this.formInfo
      );
      const { code, message } = res.data.result;
      if (code === 200) {
        this.$message.success(this.publicLang.submittedSuccessfully);
        const products = selectProducts.map(val => {
          return val.productNumber;
        });
        this.deleteSubmitProduct(products);
        this.dialogFormVisible = false;
        window.localStorage.setItem("nowActive", "/index/myOrder");
        //this.$router.push("/index/myOrder");
        this.$router.push({
          path: "/index/myOrder"
        });
      } else {
        this.$message.error(message);
      }
    }
  },
  created() {}
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.myCartBoX {
  width: 100%;
  background-color: #fff;
  margin: 0 auto;
  .wrapTitle {
    height: 60px;
    display: flex;
    align-items: center;
    color: #333;
    font-size: 20px;
    font-weight: bold;
    margin: 0 2.5%;
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
    background: #fff;
    box-sizing: border-box;
    padding: 0 2.5%;
    border-bottom: 1px solid #cecece;
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
    margin: 0 2.5%;
    box-sizing: border-box;
    padding-bottom: 103px;
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
      border: 1px solid #cecece;
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
      font-size: 16px;
    }
    .productInformation {
      width: 100%;
      display: flex;
      .imgBox {
        width: 110px;
        height: 110px;
        position: relative;
      }
      .infoBox {
        width: 214px;
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
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          color: #666666;
          font-size: 12px;
          .bottom_info {
            display: flex;
            .delete_btn {
              margin-left: 10px;
            }
          }
        }
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
  .totalWrapBox {
    position: fixed;
    bottom: 52px;
    width: 100%;
    left: 0;
    background: #ffffff;
    z-index: 0;
    .totalBox {
      height: 50px;
      //   background: #f5f5f5;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0 2.5%;
      justify-content: flex-end;
      .select_all {
        margin-right: auto;
      }
      .totalWrap {
        //margin-left: 40px;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
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
        .title {
          font-size: 12px;
          color: #666666;
        }
        .price {
          color: #ff3e3e;
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
    .submitBox {
      // height: 106px;
      // padding: 0 43px;
      margin-left: 10px;
      .submitBtn {
        // width: 197px;
        height: 32px;
        // background: #FF760E;
        opacity: 1;
        border-radius: 5px;
        font-size: 14px;
        float: right;
      }
    }
  }
  .statisticsBox {
    // width: 100%;
    box-sizing: border-box;
    color: #666;
    font-size: 14px;
    .contactInfoBox {
      box-sizing: border-box;
      padding: 0 10px 10px 10px;
      font-size: 14px;
      color: #606266;
      background: #f5f5f5;
      .title {
        font-size: 16px;
        color: #666;
        font-weight: bold;
        box-sizing: border-box;
        padding: 26px 0;
        text-align: center;
      }
      @{deep} .userInfoBox {
        .el-form-item {
          color: #606266;
          .el-form-item__label {
            color: #606266;
          }
        }
        .wrapBox {
          .left,
          .right {
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
      .contact_btn {
        display: flex;
        justify-content: flex-end;
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
@{deep} .el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  z-index: 0;
}
@{deep} .el-checkbox__inner {
  z-index: 0;
}
@{deep} .el-checkbox__label {
  font-size: 12px;
}
</style>
