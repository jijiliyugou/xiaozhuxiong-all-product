<template>
  <div class="my-table">
    <el-table
      :data="table.data"
      v-loading="table.showLoading"
      :height="table.height"
      fit
      ref="myTableRef"
      :size="table.sizeMini"
      :header-cell-style="{ backgroundColor: '#f9fafc' }"
      @selection-change="handleSelectionChange"
      @current-change="handleTableCurrentChange"
      @row-click="handleDetail"
    >
      <el-table-column
        v-if="table.selection || false"
        type="selection"
        width="50"
        align="center"
      />
      <el-table-column
        v-if="table.isIndex"
        label="序号"
        type="index"
        align="center"
        width="50"
      >
      </el-table-column>
      <el-table-column
        v-for="(col, index) in table.columns"
        :width="col.width"
        :min-width="col.minWidth"
        :align="col.align || 'center'"
        :key="index"
        :prop="col.prop"
        :label="col.label"
        :show-overflow-tooltip="col.isHiden"
        cell-mouse-enter
      >
        <template v-if="col.renderHeard" slot="header">
          <div v-html="col.renderHeard()"></div>
        </template>
        <template slot-scope="scope">
          <!-- 字段判断 -->
          <span
            v-if="col.render"
            :style="{ color: col.color }"
            v-html="col.render(scope.row)"
          ></span>
          <!-- 产品信息和图片 -->
          <div class="productInfo" v-else-if="col.productInfo">
            <el-tooltip
              effect="light"
              placement="right"
              popper-class="testtooltip"
            >
              <div slot="content">
                <el-image
                  v-if="col.elImage"
                  style="width: 300px; height: auto; cursor: pointer"
                  :preview-src-list="isArray(col.elImage(scope.row))"
                  :src="isString(col.elImage(scope.row))"
                  fit="contain"
                >
                  <div
                    slot="placeholder"
                    class="image-slot"
                    style="width: 300px; height: 280px; min-width: 300px"
                  >
                    <img
                      style="width: 300px; height: 280px; min-width: 300px"
                      :src="require('@/assets/images/imgError.png')"
                    />
                  </div>
                  <div
                    slot="error"
                    class="image-slot"
                    style="width: 300px; height: 280px; min-width: 300px"
                  >
                    <img
                      style="width: 300px; height: 280px; min-width: 300px"
                      :src="require('@/assets/images/imgError.png')"
                    />
                  </div>
                </el-image>
              </div>
              <el-image
                v-if="col.elImage"
                @click.native="goDetails(scope.row)"
                style="width: 82px; height: 62px; min-width: 82px"
                :src="isString(col.elImage(scope.row))"
                fit="contain"
              >
                <div
                  slot="placeholder"
                  class="image-slot"
                  style="width: 82px; height: 62px"
                >
                  <img
                    style="width: 82px; height: 62px"
                    :src="require('@/assets/images/imgError.png')"
                  />
                </div>
                <div
                  slot="error"
                  class="image-slot"
                  style="width: 82px; height: 62px"
                >
                  <img
                    style="width: 82px; height: 62px"
                    @click="goDetails(scope.row)"
                    :src="require('@/assets/images/imgError.png')"
                  />
                </div>
              </el-image>
            </el-tooltip>
            <div class="infoBox" v-if="col.infoBox">
              <div
                class="name"
                @click="goDetails(scope.row)"
                v-if="col.nameHtml"
              >
                <el-tooltip
                  effect="dark"
                  :disabled="col.nameHtml(scope.row).length < 15"
                  :content="col.nameHtml(scope.row)"
                  placement="top-start"
                >
                  <span
                    class=" spanName"
                    style="max-width:190px; display:inline-block"
                    v-html="col.nameHtml(scope.row)"
                  ></span>
                </el-tooltip>
              </div>
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
          <!-- 用户头像和名字 -->
          <div class="nameBox" v-else-if="col.companyInfo">
            <el-avatar
              style="background-color: #e4efff"
              :size="40"
              :src="col.companyLogo(scope.row)"
            >
              <p class="errText" v-html="col.linkman(scope.row)"></p>
            </el-avatar>
            <span
              style="margin-left: 10px"
              class="name"
              v-html="col.companyName(scope.row)"
            ></span>
            <span class="isMain" v-if="scope.row.isMain"><i>主账号</i></span>
          </div>
          <!-- 只放图片 -->
          <div class="productInfo" v-else-if="col.elImageUrl">
            <el-tooltip
              effect="light"
              placement="right"
              popper-class="testtooltip"
            >
              <div slot="content">
                <el-image
                  v-if="col.elImageUrl"
                  style="width: 300px; height: auto; cursor: pointer"
                  :preview-src-list="isArray(col.elImage(scope.row))"
                  :src="isString(col.elImage(scope.row))"
                  fit="contain"
                >
                  <div
                    slot="placeholder"
                    class="image-slot"
                    style="width: 300px; height: 280px; min-width: 300px"
                  >
                    <img
                      style="width: 300px; height: 280px; min-width: 300px"
                      :src="require('@/assets/images/imgError.png')"
                    />
                  </div>
                  <div
                    slot="error"
                    class="image-slot"
                    style="width: 300px; height: 280px; min-width: 300px"
                  >
                    <img
                      style="width: 300px; height: 280px; min-width: 300px"
                      :src="require('@/assets/images/imgError.png')"
                    />
                  </div>
                </el-image>
              </div>
              <el-image
                v-if="col.elImage"
                style="width: 82px; height: 62px; min-width: 82px"
                :src="isString(col.elImage(scope.row))"
                fit="contain"
              >
                <div
                  slot="placeholder"
                  class="image-slot"
                  style="width: 82px; height: 62px"
                >
                  <img
                    style="width: 82px; height: 62px"
                    :src="require('@/assets/images/imgError.png')"
                  />
                </div>
                <div
                  slot="error"
                  class="image-slot"
                  style="width: 82px; height: 62px"
                >
                  <img
                    style="width: 82px; height: 62px"
                    :src="require('@/assets/images/imgError.png')"
                  />
                </div>
              </el-image>
            </el-tooltip>
          </div>
          <!-- 字段颜色 -->
          <span
            v-else-if="col.isCallback"
            @click="col.event(scope.row)"
            :style="{ color: col.color }"
            v-html="col.isCallback(scope.row)"
          >
          </span>
          <!-- 模板字符串操作 -->
          <span v-else-if="register(col)">
            <component
              :is="templates[col.prop]"
              :row="scope.row"
              :col="col"
              @action="col.action"
            ></component>
          </span>
          <!-- 单纯字段 -->
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
            <template v-for="(btn, index) in table.actions">
              <el-button
                v-if="(!btn.hidden || btn.hidden(scope.row)) && index < 3"
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
            </template>
            <el-popover
              trigger="hover"
              placement="left-start"
              width="160"
              popper-class="more_btns"
              v-model="isShowMoreBtn[scope.row.id]"
              v-if="table.actions && table.actions.length > 3"
            >
              <div class="more_btn">
                <div class="more_btn_panel">
                  <template v-for="(btn, index) in table.actions">
                    <div class="more_btn_item" v-if="index >= 3" :key="index">
                      <el-button
                        v-if="!btn.hidden || btn.hidden(scope.row)"
                        :key="btn.index"
                        :type="btn.classWrapper(scope.row)"
                        :disabled="btn.disabledWrapper(scope.row)"
                        size="mini"
                        @click="btn.methods(scope.row)"
                        :icon="btn.icon"
                        :style="{
                          margin: btn.margin,
                          backgroundColor: btn.color,
                          borderColor: btn.color
                        }"
                        :class="[
                          btn.class ? 'copy_btn_share' + scope.row.id : ''
                        ]"
                      >
                        {{ btn.textWrapper(scope.row) }}
                      </el-button>
                    </div>
                  </template>
                </div>
              </div>
              <el-button
                slot="reference"
                icon="el-icon-more"
                size="mini"
                type="success"
                :style="{
                  backgroundColor: '#1DCFC3',
                  color: '#ffffff',
                  borderColor: '#1DCFC3',
                  marginLeft: '10px',
                  position: 'relative'
                }"
              >
              </el-button>
            </el-popover>
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
              <i v-if="scope.row.isShop" class="shoppingCartActive"></i>
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
import { mapState } from "vuex";
export default {
  name: "Table",
  props: {
    table: Object
  },
  computed: {
    ...mapState(["userInfo", "myShoppingCartCount"]),
    ...mapState(["typeId"])
  },
  data() {
    return {
      isShopping: false,
      isShoppingUpdate: false,
      canClick: true,
      templates: {},
      item: null,
      isShowMoreBtn: [],
      openDelay: 0,
      closeDelay: 200
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
    isString(img) {
      if (Array.isArray(img)) {
        return img[0];
      } else {
        return img;
      }
    },
    // 图片是数组或字符串
    isArray(img) {
      if (Array.isArray(img)) {
        return img;
      } else if (typeof img == "string") {
        return [img];
      } else {
        return [];
      }
    },
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
    //厂商跳转
    handleDetail(v) {
      this.$emit("handleDetail", v);
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
      if (item.isShop) {
        this.removeShopping(item);
      } else {
        if (this.myShoppingCartCount >= 500 && !this.item.isShop) {
          this.$common.handlerMsgState({
            msg: "购物车已满500条",
            type: "warning"
          });
          return;
        }
        if (this.canClick) {
          this.canClick = false;
          this.callbackShopping(item);
          setTimeout(() => {
            this.canClick = true;
          }, 500);
        } else {
          this.$common.handlerMsgState({
            msg: "操作过于频繁",
            type: "danger"
          });
        }
      }
    },
    // 加购事件
    async callbackShopping(item) {
      const fd = {
        userID: this.userInfo.userInfo.id,
        companyNumber: this.userInfo.commparnyList[0].companyNumber,
        sourceFrom: "active",
        number: 1,
        currency: "￥",
        Price: 0,
        shopType: "companysamples",
        productNumber: item.productNumber
      };
      const res = await this.$http.post("/api/AddShoppingCart", fd);
      if (res.data.result.code === 200) {
        item.isShop = !item.isShop;
        eventBus.$emit("resetProductIsShop", item);
        this.$store.commit("handlerShoppingCartCount", res.data.result.item);
        this.$common.handlerMsgState({
          msg: "加购成功",
          type: "success"
        });
      } else {
        this.$common.handlerMsgState({
          msg: "加购失败",
          type: "danger"
        });
      }
    },
    // 删除当前购物车产品
    async removeShopping(item) {
      const fd = {
        userID: this.userInfo.userInfo.id,
        companyNumber: this.userInfo.commparnyList[0].companyNumber,
        sourceFrom: "active",
        shopType: "companysamples",
        productNumber: item.productNumber
      };
      const res = await this.$http.post("/api/RemoveShoppingCart", fd);
      if (res.data.result.code === 200) {
        item.isShop = !item.isShop;
        this.$store.commit("handlerShoppingCartCount", res.data.result.item);
        this.$common.handlerMsgState({
          msg: "取消加购",
          type: "warning"
        });
      } else {
        this.$common.handlerMsgState({
          msg: "取消失败",
          type: "danger"
        });
      }
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
      this.$emit("selectionChange", val);
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
  font-size: 13px !important;
  .cell {
    padding: 0 5px;
  }
  .el-table__body-wrapper {
    .cell {
      padding: 8px 0;
    }
  }
  .el-table__row {
    .el-tooltip {
      font-size: 12px;
    }
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
  @{deep}.infoBox {
    width: 190px;
    height: 60px;
    margin-left: 10px;
    div {
      line-height: 25px;
    }
    .name {
      margin-top: 5px;
      cursor: pointer;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
      .spanName {
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap; /*不换行*/
        text-overflow: ellipsis; /*超出部分文字以...显示*/
      }
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
.nameBox {
  width: 300px;
  display: flex;
  align-items: center;
  .el-avatar {
    color: #3368a9;
    img {
      width: 40px;
      min-height: 40px;
    }
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
.more_btn {
  position: absolute;
  // right: 80px;
  // top: 12px;
  // width: 120px;
  right: -5px;
  top: 0;
  width: 80px;
  background-color: #fff;
  color: #333333;
  font-size: 15px;
  border-radius: 4px;
  z-index: 200;
  box-shadow: 0px 4px 15px 0px rgba(42, 69, 116, 0.25);
  .more_btn_panel {
    padding: 10px 8px 0px 12px;
    .more_btn_item {
      margin-bottom: 10px;
    }
  }
  &::after {
    position: absolute;
    content: "";
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-left-color: white;
    right: -15px;
    top: 5px;
  }
}
</style>
