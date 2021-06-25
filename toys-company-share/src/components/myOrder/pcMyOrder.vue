<template>
  <div class="myOrderWrap">
    <div class="orderBox">
      <div class="title">
        {{ myOrderLang.myOrder }}
        <span class="value" v-if="userInfo.loginEmail"
          >（{{ userInfo.loginEmail }}）</span
        >
      </div>
      <ul class="orderListWrap">
        <template v-if="orderList.length > 0">
          <li class="itemBox" v-for="(item, i) in orderList" :key="i">
            <div class="orderTitle">
              <div class="left">
                {{ myOrderLang.oddNumbers }}：
                <span class="value">{{ item.orderNumber }}</span>
              </div>
              <div
                class="right"
                @click="exportOrder(item.orderNumber, item.companyName)"
                v-if="userInfo.isExportExcel"
              >
                <i class="iconfont icon-daochujinruchukou"></i>
                {{ myOrderLang.exportOrder }}
              </div>
            </div>
            <div class="orderContent">
              <div class="one">
                <div class="left">
                  <div class="keys">{{ myOrderLang.orderTime }}：</div>
                  <div class="keys">{{ myOrderLang.companyName }}：</div>
                </div>
                <div class="right">
                  <div class="values">
                    {{ item.createdOn.replace(/T/, " ") }}
                  </div>
                  <div class="values">{{ item.companyName }}</div>
                </div>
              </div>
              <div class="two">
                <div class="left">
                  <div class="keys">{{ myOrderLang.totalQuantity }}：</div>
                  <div class="keys">{{ myOrderLang.email }}：</div>
                </div>
                <div class="right">
                  <div class="values">{{ item.totalKuanshu }}</div>
                  <div class="values">{{ item.email }}</div>
                </div>
              </div>
              <div class="three">
                <div class="left">
                  <div class="keys" v-if="shareInfo.isShowPrice">
                    {{ myOrderLang.totalPrice }}：
                  </div>
                  <div class="keys">{{ myOrderLang.contact }}：</div>
                </div>
                <div class="right">
                  <div class="values totalPrice" v-if="shareInfo.isShowPrice">
                    {{ item.currencyType }}
                    {{ item.totalAmount }}
                  </div>
                  <div class="values">{{ item.contactName }}</div>
                </div>
              </div>
              <div class="four">
                <el-button type="warning" @click="toOrderDetail(item)" plain>{{
                  myOrderLang.viewDetails
                }}</el-button>
              </div>
            </div>
          </li>
        </template>
        <center v-else style="padding:20px;">{{ publicLang.noData }}</center>
      </ul>
      <!-- 分页 -->
      <center class="paginationWrap">
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
      </center>
    </div>
  </div>
</template>

<script>
import myOrderJs from "@/mixins/myOrder.js";
export default {
  name: "pcMyOrder",
  mixins: [myOrderJs]
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.orderBox {
  margin: 0 auto;
  max-width: 1240px;
  box-sizing: border-box;
  padding: 0 23px;
  background-color: #fff;
  .title {
    height: 65px;
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
          width: 115px;
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
        height: 100px;
        display: flex;
        padding: 0 20px;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;
        .one,
        .two,
        .three {
          flex: 1;
          height: 100%;
          display: flex;
          // word-break: break-word;
          word-break: break-all;
          .left,
          .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            color: #333;
            .values {
              height: 20px;
              display: flex;
              align-items: center;
            }
            .keys,
            .values {
              margin-top: 20px;
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
}
</style>
