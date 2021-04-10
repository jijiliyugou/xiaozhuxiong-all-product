<template>
  <div class="bsSampleOfferCommodity">
    <div class="hander">
      <div class="left">
        <div
          :class="{ tabs: true, active: typeId === 0 }"
          @click="checkTabstypeId(0)"
        >
          我的收藏
        </div>
        <div
          :class="{ tabs: true, active: typeId === 2 }"
          @click="checkTabstypeId(2)"
        >
          我的找样
        </div>
        <div
          :class="{ tabs: true, active: typeId === 1 }"
          @click="checkTabstypeId(1)"
        >
          所有产品
        </div>
      </div>
      <div class="right">
        <el-button @click="handleAffirm" type="primary" round>
          确定已选择({{ offerProductList.length }})
          <i style="font-size:15px" class="el-icon-right el-icon--right"></i>
        </el-button>
      </div>
    </div>
    <div class="productListBox">
      <!-- 产品列表 -->
      <div class="bsGridComponent">
        <bsSampleOfferProductList
          v-for="item in productList"
          :key="item.productNumber"
          :item="item"
        />
        <div class="kong"></div>
        <div class="kong"></div>
        <div class="kong"></div>
        <div class="kong"></div>
      </div>

      <!-- 分页 -->
      <center style="padding:20px 0;">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40]"
          background
          :total="totalCount"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import bsSampleOfferProductList from "@/components/bsComponents/bsSampleComponent/bsSampleOfferProductList";
export default {
  name: "bsSampleOfferCommodity",
  components: {
    bsSampleOfferProductList
  },
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      num: null,
      typeId: 0,
      productList: [],
      isGrid: "bsGridComponent",
      totalCount: 0,
      pageSize: 10,
      currentPage: 1
    };
  },
  computed: {
    ...mapState(["offerProductList"])
  },
  created() {},
  mounted() {
    this.getProductList();
  },
  methods: {
    //   产品列表
    async getProductList() {
      const fd = {
        pageSize: this.pageSize,
        typeId: this.typeId,
        pageIndex: this.currentPage
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/SupplierProduct", fd);
      const { code, item, msg } = res.data.result;
      if (code === 200) {
        if (this.offerProductList) {
          for (let i = 0; i < item.items.length; i++) {
            for (let j = 0; j < this.offerProductList.length; j++) {
              if (
                item.items[i].productNumber ===
                this.offerProductList[j].productNumber
              ) {
                item.items[i].isShopping = true;
              }
            }
          }
        }
        this.productList = item.items;
        this.totalCount = item.totalCount;
      } else {
        this.totalCount = 0;
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
      }
    },
    //返回编辑页面
    handleAffirm() {
      console.log(this.item.offerNumber);
      this.$store.commit("closeTab", this.item.offerNumber);
      // this.$forceUpdate();
    },

    //切换
    checkTabstypeId(num) {
      this.typeId = num;
      this.myOfferProductList = [];
      this.getProductList();
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getProductList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getProductList();
    }
  }
};
</script>
<style lang="less" scoped>
.bsSampleOfferCommodity {
  background: #fff;

  .hander {
    height: 70px;
    font-size: 15px;
    box-sizing: border-box;
    background-color: #fff;
    padding-left: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      border-radius: 4px;
      .tabs {
        width: 100px;
        height: 50px;
        box-sizing: border-box;
        border-bottom: 2px solid transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        cursor: pointer;
        &.active {
          font-weight: 700;
          border-color: #3368a9;
          color: #3368a9;
        }
      }
    }
    .right {
      margin-right: 20px;
    }
  }
  .productListBox {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    .bsGridComponent {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .kong {
        width: 250px;
        min-width: 250px;
      }
    }
  }
}
</style>
