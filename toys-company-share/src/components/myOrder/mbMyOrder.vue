<template>
  <div class="myOrderWrap">
    <div class="orderBox">
      <div class="title">
        {{ myOrderLang.myOrder }}
        <span class="value" v-if="userInfo.loginEmail"
          >（{{ userInfo.loginEmail }}）</span
        >
      </div>
      <ul
        class="orderListWrap"
        v-infinite-scroll="orderLoad"
        infinite-scroll-disabled="disabled"
      >
        <template v-if="orderList.length > 0">
          <li class="itemBox" v-for="(item, i) in orderList" :key="i">
            <div class="orderTitle" @click="toOrderDetail(item)">
              <div class="left">
                {{ myOrderLang.oddNumbers }}：
                <span class="value">{{ item.orderNumber }}</span>
              </div>
              <div class="right">
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
            <div class="orderContent">
              <div class="one">
                <div class="left">
                  <div class="keys">{{ myOrderLang.orderTime }}：</div>
                </div>
                <div class="right">
                  <div class="values">
                    {{ item.createdOn.replace(/T/, " ") }}
                  </div>
                </div>
              </div>
              <div class="three">
                <div class="item">
                  <div class="left">
                    <div class="keys">{{ myOrderLang.totalQuantity }}：</div>
                  </div>
                  <div class="right">
                    <div class="values total">{{ item.totalKuanshu }}</div>
                  </div>
                </div>
                <div class="item">
                  <div class="left">
                    <div class="keys" v-if="shareInfo.isShowPrice">
                      {{ myOrderLang.totalPrice }}：
                    </div>
                  </div>
                  <div class="right">
                    <div class="values totalPrice" v-if="shareInfo.isShowPrice">
                      {{ item.currencyType }}
                      {{ item.totalAmount }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </template>
        <center v-else style="padding:20px;">{{ publicLang.noData }}</center>
      </ul>
      <div v-if="loading" class="load_tip">{{ commonLang.loading }}</div>
      <div v-if="noMore" class="load_tip">{{ commonLang.noMore }}</div>
      <!-- 分页 -->
      <!-- <center class="paginationWrap">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next"
          :total="totalCount"
        >
        </el-pagination>
      </center> -->
    </div>
  </div>
</template>

<script>
import myOrderJs from "@/mixins/myOrder.js";
export default {
  name: "mbMyOrder",
  mixins: [myOrderJs],
  data() {
    return {
      loading: false,
      noMore: false
    };
  },
  computed: {
    disabled() {
      return this.loading || this.noMore;
    },
    commonLang() {
      return this.$t("lang.common");
    }
  },
  methods: {
    orderLoad() {
      this.getSearchShareOrdersPage(true);
    },
    // 获取订单列表
    async getSearchShareOrdersPage(flag) {
      if (!flag) return;
      this.loading = true;
      const res = await this.$http.get(
        "/api/WebsiteShare/SearchShareOrdersPage",
        {
          params: {
            pageIndex: this.currentPage,
            pageSize: this.pageSize
            // loginEmail: this.customerInfo.id
          }
        }
      );
      const { code, data, message } = res.data.result;
      if (code === 200) {
        for (var i = 0; i < data.items.length; i++) {
          this.orderList.push(data.items[i]);
        }
        //this.orderList = data.items;
        this.totalCount = data.totalCount;
        this.currentPage++;
        this.loading = false;
        this.noMore = data.items.length ? false : true;
      } else {
        this.$message.error(message);
        this.noMore = true;
        this.loading = false;
      }
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.orderBox {
  margin: 0 auto;
  box-sizing: border-box;
  padding: 0 2.5%;
  background-color: #fff;
  .title {
    height: 37px;
    display: flex;
    align-items: center;
    color: #333333;
    font-size: 20px;
    font-weight: bold;
    .value {
      font-size: 16px;
      color: #999;
      font-weight: 400;
    }
  }
  .orderListWrap {
    .itemBox {
      border: 1px solid #e9e9e9;
      margin-bottom: 20px;
      color: #333;
      font-size: 14px;
      .orderTitle {
        height: 40px;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        box-sizing: border-box;
        .left {
          .value {
            color: #666666;
          }
        }
        .right {
          color: #666;
          cursor: pointer;
          display: flex;
          align-items: center;
          .iconfont {
            margin-right: 10px;
          }
        }
      }
      .orderContent {
        font-size: 12px;
        height: 70px;
        padding: 0 20px;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;
        .one,
        .two,
        .three {
          .item {
            display: flex;
            margin-right: 10px;
          }
          // flex: 1;
          // height: 100%;
          display: flex;
          // word-break: break-word;
          word-break: break-all;
          .left,
          .right {
            // flex: 1;
            display: flex;
            flex-direction: column;
            color: #333;
            .values {
              height: 20px;
              // display: flex;
              align-items: center;
            }
            .total {
              width: 50px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .keys,
            .values {
              margin-top: 10px;
            }
          }
          .left {
            color: #999;
            .keys {
              text-align: right;
            }
          }
        }
        .three {
          .right {
            .totalPrice {
              color: #ff3e3e;
              width: 90px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .four {
          width: 112px;
          background-color: #ccc;
          .el-button {
            width: 112px;
            height: 34px;
            opacity: 1;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0px;
            overflow: hidden;
          }
        }
      }
    }
  }
  .paginationWrap {
    padding: 50px 0 36px 0;
  }
  .load_tip {
    text-align: center;
    flex: 1;
    padding-bottom: 70px;
  }
}
</style>
