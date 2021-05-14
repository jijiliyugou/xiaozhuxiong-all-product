<template>
  <div class="my-table">
    <el-table
      :data="table.data"
      v-loading="table.showLoading"
      :height="table.height || '100%'"
      fit
      :size="table.sizeMini"
      :header-cell-style="{ backgroundColor: '#f9fafc' }"
      @selection-change="handleSelectionChange"
      @current-change="handleTableCurrentChange"
    >
      <el-table-column
        v-if="table.selection || false"
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        v-if="table.isIndex"
        label="序号"
        type="index"
        align="center"
        width="60"
      >
      </el-table-column>
      <el-table-column
        v-for="(col, index) in table.columns"
        :width="col.width"
        :align="col.align || 'center'"
        :key="index"
        :prop="col.prop"
        :label="col.label"
        :show-overflow-tooltip="table.isHiden || true"
        cell-mouse-enter
      >
        <template slot-scope="scope">
          <span v-if="col.render" v-html="col.render(scope.row)"></span>
          <div class="productInfo" v-else-if="col.productInfo">
            <el-image
              v-if="col.elImage"
              @click.native="goDetails(scope.row)"
              style="width: 80px; height: 60px; min-width: 70px"
              :src="col.elImage(scope.row)"
              fit="contain"
            >
              <div slot="placeholder" class="image-slot">
                <img
                  style="width: 80px; height: 60px"
                  :src="require('@/assets/images/imgError.png')"
                />
              </div>
              <div slot="error" class="image-slot">
                <img
                  style="width: 80px; height: 60px"
                  @click="goDetails(scope.row)"
                  :src="require('@/assets/images/imgError.png')"
                />
              </div>
            </el-image>
            <div class="infoBox">
              <div
                class="name"
                @click="goDetails(scope.row)"
                v-if="col.nameHtml"
                v-html="col.nameHtml(scope.row)"
              ></div>
              <div class="factory">
                <div
                  class="fcatoryName"
                  v-if="col.fcatoryNameHtml"
                  :style="{ color: col.color }"
                  @click="toFactory(scope.row)"
                  v-html="col.fcatoryNameHtml(scope.row)"
                ></div>
                <div class="icons">
                  <!-- <el-tooltip
                    class="item"
                    effect="dark"
                    :content="scope.row.supplierPhone || '暂时没有厂商电话'"
                    placement="top"
                  >
                    <div class="cartPhoneIcon"></div>
                  </el-tooltip> -->
                  <div class="cartInfoIcon" @click="toNews(scope.row)"></div>
                </div>
              </div>
            </div>
          </div>
          <span
            v-else-if="col.textData"
            :style="{ color: col.color }"
            v-html="col.textData(scope.row)"
          >
          </span>
          <span v-else-if="register(col)">
            <component
              :is="templates[col.prop]"
              :row="scope.row"
              :col="col"
              @action="col.action"
            ></component>
          </span>
          <span v-else>
            {{ scope.row[col.prop] }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="table.actions"
        label="操作"
        align="center"
        :width="table.btnWidth || 300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div v-if="table.actions">
            <el-button
              v-for="btn in table.actions"
              :key="btn.index"
              :type="btn.classWrapper(scope.row)"
              :disabled="btn.disabledWrapper(scope.row)"
              size="mini"
              @click="btn.methods(scope.row)"
              :icon="btn.icon"
              :style="{ margin: btn.margin }"
            >
              {{ btn.textWrapper(scope.row) }}
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="table.addIcon"
        label=""
        align="center"
        :width="table.btnWidth || 300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div class="addIcon">
            <div
              v-if="typeId != 1"
              class="right"
              @click.stop="handlerShopping(scope.row)"
            >
              <i v-if="scope.row.isShopping" class="shoppingCartActive"></i>
              <i v-else class="shoppingCart"></i>
            </div>
            <!-- <div
              v-if="typeId === 1"
              class="right"
              @click.stop="handlerUpadate(item)"
            >
              <i v-if="item.isShoppingUpdate" class="updateIcon"></i>
              <i v-else class="UpadateCart"></i>
            </div> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Vue from "vue";
import eventBus from "@/assets/js/common/eventBus";
import { mapGetters, mapState } from "vuex";
export default {
  name: "Table",
  props: {
    table: Object
  },
  computed: {
    ...mapGetters({
      shoppingList: "myShoppingList"
    }),
    ...mapState(["typeId"])
  },
  data() {
    return {
      isShopping: false,
      isShoppingUpdate: false,
      canClick: true,
      templates: {},
      item: null
    };
  },
  created() {
    if (this.table.actions) {
      this.table.actions.forEach(btn => {
        if (!btn.textWrapper) {
          btn.textWrapper = () => {
            return btn.text;
          };
        }

        if (!btn.classWrapper) {
          btn.classWrapper = () => {
            return btn.type || "primary";
          };
        }

        if (!btn.disabledWrapper) {
          btn.disabledWrapper = () => {
            return btn.disabled;
          };
        }
      });
    }
  },
  mounted() {},
  methods: {
    // 点击产品名字跳转
    goDetails(row) {
      const fd = {
        name: row.productNumber,
        linkUrl: this.$route.path,
        component: "bsProductDetails",
        refresh: true,
        label: row.fa_no || "产品详情",
        value: row
      };
      this.$router.push("/bsIndex/bsProductSearchIndex");
      this.$store.commit("myAddTab", fd);
    },
    //厂商跳转
    toFactory(item) {
      const fd = {
        name: item.supplierNumber,
        linkUrl: "/bsIndex/bsShoppingCart",
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
      this.$router.push("/bsIndex/bsVendorQuery");
      this.$store.commit("myAddTab", fd);
    },
    // 去聊天
    toNews(item) {
      const fd = {
        name: item.supplierNumber + "bsNews",
        linkUrl: "/bsIndex/bsNews",
        component: "bsNews",
        refresh: true,
        label: item.supplierName,
        value: {}
      };
      this.$store.commit("myAddTab", fd);
    },
    // 加购
    handlerShopping(item) {
      this.item = item;
      if (this.shoppingList.length >= 500 && !item.isShopping) {
        this.$common.handlerMsgState({
          msg: "购物车已满500条",
          type: "warning"
        });
        return;
      }
      if (this.canClick) {
        this.canClick = false;
        this.callbackShopping();
        setTimeout(() => {
          this.canClick = true;
        }, 500);
      } else {
        this.$common.handlerMsgState({
          msg: "操作过于频繁",
          type: "danger"
        });
      }
    },
    // 加购事件
    callbackShopping() {
      this.item.isShopping = !this.item.isShopping;
      if (this.item.isShopping) {
        this.item.shoppingCount = 1;
        this.$store.commit("pushShopping", this.item);
        this.$common.handlerMsgState({
          msg: "加购成功",
          type: "success"
        });
      } else {
        this.item.shoppingCount = 0;
        this.$store.commit("popShopping", this.item);
        this.$common.handlerMsgState({
          msg: "取消加购成功",
          type: "warning"
        });
      }
      eventBus.$emit("resetMyCart", this.item);
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    // 添加报价
    handlerUpadate(item) {
      item.isShoppingUpdate = !item.isShoppingUpdate;
      if (item.isShoppingUpdate) {
        this.$set(item, "boxNumber", 1); //默认传一箱过去，不然总金额计算错误
        // item.boxNumber = 1;
        this.$store.commit("pushOfferProductList", item);
        // this.$emit("pushOfferProductList", item);
        this.$common.handlerMsgState({
          msg: "添加报价产品成功",
          type: "success"
        });
      } else {
        this.$store.commit("popOfferProductList", item);
        // this.$emit("popOfferProductList", item);
        this.$common.handlerMsgState({
          msg: "删除报价产品成功",
          type: "warning"
        });
      }
      this.$forceUpdate();
    },
    handleSelectionChange(val) {
      let res = [];
      val.forEach(item => {
        res.push(item.id);
      });
      this.$emit("selectionChange", res);
    },
    handleTableCurrentChange(val) {
      this.$emit("tableCurrentChange", val);
    },
    deleteOne(id) {
      console.log(id, "删除id");
      //   this.$confirm("确定要删除吗？", "警告", {
      //     type: "warning",
      //   })
      //     .then(() => {
      //       this.table.curdApi.deleteApi({ id: id }).then((res) => {
      //         this.$message({
      //           type: "success",
      //           message: "删除成功！",
      //         });
      //         this.getList();
      //       });
      //     })
      //     .catch((e) => {});
    },
    register(col) {
      if (col.template) {
        this.templates[col.prop] = {
          render: Vue.compile(col.template).render,
          props: {
            row: Object,
            col: Object
          },
          methods: {
            action(val, val2) {
              this.$emit("action", this, this.row, val, val2);
            }
          }
        };
        return true;
      }
      return false;
    }
  }
};
</script>
<style lang="less" scoped>
@deep: ~">>>";

@{deep}.el-table {
  .cell {
    padding: 0 5px;
  }
}
.operate-menu img {
  float: left;
  height: 14px;
  margin: 11px 5px 0 0;
}
.productInfo {
  display: flex;
  justify-content: center;
  .el-image {
    cursor: pointer;
  }
  .infoBox {
    width: 190px;
    height: 60px;
    margin-left: 10px;
    div {
      line-height: 25px;
    }
    .name {
      cursor: pointer;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
    }
    .factory {
      cursor: pointer;
      display: flex;
      align-items: center;
      color: #3368a9;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
      .fcatoryName {
        width: 100px;
        max-width: 100px;
        cursor: pointer;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap; /*不换行*/
        text-overflow: ellipsis; /*超出部分文字以...显示*/
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
          background: url("~@/assets/images/cartPhoneIcon.png") no-repeat center;
          background-size: contain;
        }
        .cartInfoIcon {
          background: url("~@/assets/images/cartInfoIcon.png") no-repeat center;
          background-size: contain;
        }
      }
    }
  }
  .el-image {
    width: 70px;
    height: 54px;
    min-width: 70px;
  }
}
.addIcon {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  .right {
    width: 46px;
    min-width: 46px;
    padding-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    .shoppingCart {
      width: 36px;
      height: 36px;
      transition: all 0.3s;
      background: url("~@/assets/images/shoppingCartIcon.png") no-repeat center;
      background-size: contain;
    }
    .shoppingCartActive {
      width: 36px;
      height: 36px;
      transition: all 0.3s;
      background: url("~@/assets/images/shoppingCartActiveIcon.png") no-repeat
        center;
      background-size: contain;
    }
    &:hover {
      .shoppingCart {
        -webkit-transform: scale(1.2) rotate(360deg);
        -moz-transform: scale(1.2) rotate(360deg);
        -ms-transform: scale(1.2) rotate(360deg);
        transform: scale(1.2) rotate(360deg);
        margin-bottom: 5px;
      }
      .shoppingCartActive {
        -webkit-transform: scale(1.2) rotate(360deg);
        -moz-transform: scale(1.2) rotate(360deg);
        -ms-transform: scale(1.2) rotate(360deg);
        transform: scale(1.2) rotate(360deg);
        margin-bottom: 5px;
      }
    }
    .UpadateCart {
      width: 36px;
      height: 36px;
      transition: all 0.3s;
      background: url("~@/assets/images/UpadateCart.png") no-repeat center;
      background-size: contain;
    }
    .updateIcon {
      width: 36px;
      height: 36px;
      transition: all 0.3s;
      background: url("~@/assets/images/updateIcon.png") no-repeat center;
      background-size: contain;
    }
    &:hover {
      .UpadateCart {
        -webkit-transform: scale(1.2) rotate(360deg);
        -moz-transform: scale(1.2) rotate(360deg);
        -ms-transform: scale(1.2) rotate(360deg);
        transform: scale(1.2) rotate(360deg);
        margin-bottom: 5px;
      }
      .updateIcon {
        -webkit-transform: scale(1.2) rotate(360deg);
        -moz-transform: scale(1.2) rotate(360deg);
        -ms-transform: scale(1.2) rotate(360deg);
        transform: scale(1.2) rotate(360deg);
        margin-bottom: 5px;
      }
    }
  }
}
</style>
