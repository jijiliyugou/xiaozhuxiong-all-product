<template>
  <div class="myProduct">
    <div class="searchWarp">
      <div class="searchBox">
        <div class="search_item">
          选择展厅：<el-select
            v-model="searchForm.hall"
            @change="changeHall"
            clearable
            style="width:200px;"
            size="medium"
            placeholder="请选择"
          >
            <template v-for="item in hallList">
              <el-option
                :key="item.hallNumber"
                :label="item.hallName"
                :value="item.hallNumber"
              >
              </el-option>
            </template>
          </el-select>
        </div>
        <div class="search_item">
          选择厂商：<el-select
            v-model="searchForm.supplier"
            style="width:200px;"
            clearable
            size="medium"
            placeholder="请选择"
          >
            <template v-for="item in supplierList">
              <el-option
                :key="item.keyGuid"
                :label="item.client_na"
                :value="item.keyGuid"
              >
              </el-option>
            </template>
          </el-select>
        </div>
        <div class="search_item">
          关键词：<el-input
            v-model="searchForm.keyword"
            style="width:200px;"
            @keyup.native.enter="search"
            clearable
            size="medium"
            placeholder="请选择"
          >
          </el-input>
        </div>
        <div class="search_item">
          产品状态：<el-select
            v-model="searchForm.state"
            style="width:200px;"
            clearable
            size="medium"
            placeholder="请选择"
          >
            <template v-for="item in stateList">
              <el-option :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </template>
          </el-select>
        </div>
        <el-button
          size="medium"
          @click="search"
          icon="el-icon-search"
          type="primary"
          style="width: 90px;"
        >
          搜索
        </el-button>
      </div>
      <div class="btns">
        <el-button
          size="medium"
          @click="openAdd"
          icon="el-icon-plus"
          type="primary"
        >
          新增产品
        </el-button>
        <el-button
          size="medium"
          type="primary"
          @click.stop="openIsShowPi"
          style="background-color: #2D7FE4;"
        >
          批量设置
        </el-button>
        <div class="batchBox" v-show="isShowPi">
          <div class="item" @click="openPi({ title: '推荐类型', id: 1 })">
            <div class="left">
              <i class="icon pi_tui"></i>
              <span>批量推荐</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="item" @click="openPi({ title: '修改价格', id: 2 })">
            <div class="left">
              <i class="icon pi_gai"></i>
              <span>批量改价</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="item" @click="openPi({ title: '批量公开', id: 3 })">
            <div class="left">
              <i class="icon pi_gong"></i>
              <span>批量公开</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="item" @click="openPi({ title: '批量隐藏', id: 4 })">
            <div class="left">
              <i class="icon pi_yin"></i>
              <span>批量隐藏</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="item" @click="openPi({ title: '批量上架', id: 5 })">
            <div class="left">
              <i class="icon pi_shang"></i>
              <span>批量上架</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="item" @click="openPi({ title: '批量下架', id: 6 })">
            <div class="left">
              <i class="icon pi_xia"></i>
              <span>批量下架</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="item" @click="openPi({ title: '批量删除', id: 7 })">
            <div class="left">
              <i class="icon pi_shan"></i>
              <span>批量删除</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="item" @click="openPi({ title: '批量设置区域', id: 8 })">
            <div class="left">
              <i class="icon pi_she"></i>
              <span>批量设置区域</span>
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="tableBox">
      <myTable :table="tableData" @selectionChange="selectionChange" />
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
    <!-- 新增产品 -->
    <el-dialog
      :title="productDialogTitle"
      :close-on-click-modal="false"
      :visible.sync="addProductDialog"
      v-if="addProductDialog"
      width="900"
      top="60px"
    >
      <editProduct
        :isEdit="isEdit"
        :currentRow="currentRow"
        @close="close"
        @subEdit="subEdit"
      />
    </el-dialog>
    <!-- 批量产弹框 -->
    <el-dialog
      :title="pi_option.title"
      :close-on-click-modal="false"
      :visible.sync="pi_dialog"
      v-if="pi_dialog"
      width="532px"
      top="250px"
    >
      <dialogComponents
        @close="pi_dialog = false"
        @subm="pi_subm"
        :areaList="areaList"
        :selectionList="selectionList"
        :pi_option="pi_option"
      />
    </el-dialog>
  </div>
</template>

<script>
import myTable from "@/components/table.vue";
import editProduct from "./editProduct.vue";
import eventBus from "@/assets/js/common/eventBus";
import { getCurrentTime } from "@/assets/js/common/common";
import dialogComponents from "./dialogComponents.vue";
export default {
  components: {
    myTable,
    editProduct,
    dialogComponents
  },
  data() {
    return {
      selectionList: [],
      areaList: [],
      pi_option: null,
      pi_dialog: false,
      isShowPi: false,
      productDialogTitle: "新增产品",
      currentRow: {},
      isEdit: 1,
      addProductDialog: false,
      stateList: [
        {
          name: "上架",
          id: 1
        },
        {
          name: "下架",
          id: 2
        },
        {
          name: "公开",
          id: 3
        },
        {
          name: "隐藏",
          id: 4
        }
      ],
      supplierList: [],
      hallList: [],
      tableData: {
        data: [],
        selection: true,
        showLoading: false,
        isIndex: true,
        columns: [
          {
            prop: "name",
            label: "产品信息",
            width: 300,
            color: "#3368a9",
            align: "center",
            infoBox: true,
            productInfo: true,
            cartInfoIcon: false,
            elImage: row => {
              return row.imgUrlList;
            },
            nameHtml: row => {
              return row.name;
            },
            fcatoryNameHtml: row => {
              return row.supplierName;
            }
          },
          {
            prop: "exhibitionName",
            isHiden: true,
            label: "资料来源"
          },
          {
            prop: "fa_no",
            isHiden: true,
            label: "出厂货号"
          },
          {
            prop: "createdOn",
            isHiden: true,
            label: "时间",
            render: row => {
              return row.createdOn && row.createdOn.replace(/T/, " ");
            }
          },
          {
            prop: "price",
            isHiden: true,
            label: "单价",
            color: "red",
            render: row => {
              return row.cu_de + row.price;
            }
          },
          {
            prop: "isRecommend",
            isHiden: true,
            isSwitch: true,
            activeColor: "#13ce66",
            inactiveColor: "#ff4949",
            label: "是否推荐",
            value: "isRecommend",
            handlerChange: row => {
              this.handlerIsRecommend(row);
            }
          },
          {
            prop: "isOpen",
            isHiden: true,
            isSwitch: true,
            label: "是否公开",
            activeValue: false,
            inactiveValue: true,
            value: "isOpen",
            handlerChange: row => {
              this.handlerIsOpen(row);
            }
          }
        ],
        actions: [
          {
            type: "success",
            textWrapper() {
              return "复制";
            },
            disabledWrapper(row) {
              // 条件禁用
              return row.companyNumber !== "HS0000002";
            },
            methods: row => {
              this.productDialogTitle = "复制产品";
              this.isEdit = 3;
              this.currentRow = row;
              this.addProductDialog = true;
            }
          },
          {
            type: "primary",
            disabledWrapper(row) {
              // 条件禁用
              return row.companyNumber !== "HS0000002";
            },
            textWrapper() {
              return "编辑";
            },
            methods: row => {
              this.productDialogTitle = "编辑产品";
              this.isEdit = 2;
              this.currentRow = row;
              this.addProductDialog = true;
            }
          },
          {
            type: "success",
            bgColor: "#2D7FE4",
            disabledWrapper(row) {
              // 条件禁用
              return row.companyNumber !== "HS0000002";
            },
            textWrapper(row) {
              return row.isStop === 1 ? "上架" : "下架";
            },
            methods: row => {
              this.upDown(row);
            }
          },
          {
            type: "danger",
            disabledWrapper(row) {
              // 条件禁用
              return row.companyNumber !== "HS0000002";
            },
            textWrapper() {
              return "删除";
            },
            methods: row => {
              this.removeMyProduct(row);
            }
          }
        ]
      },
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      searchForm: {
        hall: null,
        supplier: null,
        keyword: null,
        state: null
      }
    };
  },
  methods: {
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getMyProductPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getMyProductPage();
    },
    // 删除我的产品
    removeMyProduct(row) {
      this.$confirm("确定删除此产品吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post("/api/DeleteBearProduct", {
            productNumber: row.productNumber
          });
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
            this.getMyProductPage();
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 单个上/下架 0未下架 1 已下架
    upDown(row) {
      const title =
        "确定" + (row.isStop === 0 ? "上架" : "下架") + "此产品吗？";
      this.$confirm(title, {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post("/api/UpdateProductState", {
            productNumberList: [row.productNumber],
            isStop: row.isStop === 0 ? 1 : 0
          });
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "修改成功",
              type: "success"
            });
            this.getMyProductPage();
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 提交批量修改
    pi_subm() {
      this.pi_dialog = false;
      this.getMyProductPage();
    },
    // 选择发生变化
    selectionChange(list) {
      this.selectionList = list;
    },
    // 打开批量修改
    openIsShowPi() {
      this.pi_dialog = false;
      if (this.selectionList.length < 1) {
        this.$common.handlerMsgState({
          msg: "请选择产品",
          type: "danger"
        });
        return false;
      }
      this.$nextTick(() => {
        this.isShowPi = true;
      });
    },
    // 获取专区
    async getVipRegions() {
      const res = await this.$http.post("/api/getVipRegions", {});
      if (res.data.result.code === 200) {
        this.areaList =
          res.data.result.item.vipRegionItem &&
          res.data.result.item.vipRegionItem[0] &&
          res.data.result.item.vipRegionItem[0].items;
        console.log(this.areaList, 123456789);
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 点击批量事件
    openPi(option) {
      this.pi_dialog = false;
      this.pi_option = option;
      this.$nextTick(() => {
        this.pi_dialog = true;
      });
    },
    // 提交新增产品
    subEdit() {
      this.search();
      this.addProductDialog = false;
    },
    // 关闭新增
    close() {
      this.addProductDialog = false;
    },
    // 打开新增
    openAdd() {
      this.isEdit = 1;
      this.productDialogTitle = "新增产品";
      this.addProductDialog = true;
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getMyProductPage();
    },
    // 选择展厅
    changeHall(val) {
      this.searchForm.supplier = null;
      if (val) {
        const currentHall = this.hallList.find(v => v.hallNumber === val);
        this.supplierList = currentHall.supplierList;
      } else {
        this.supplierList = [];
      }
    },
    // 获取展厅下的厂商
    async getSupplierListByHall() {
      const res = await this.$http.post("/api/GetSupplierListByHall", {});
      if (res.data.result.code === 200) {
        this.hallList = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 修改是否推荐
    async handlerIsRecommend(row) {
      let api = "/api/CareteRecommendProduct",
        fd = {
          productNumberList: [row.productNumber],
          typeId: 0
        };
      if (!row.isRecommend) {
        (api = "/api/DeleteRecommendProductDetaileByProductNumber"),
          (fd = {
            productNumberList: [row.productNumber]
          });
      }
      const res = await this.$http.post(api, fd);
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "修改成功",
          type: "success"
        });
      } else {
        row.isRecommend = !row.isRecommend;
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 修改是否公开状态
    async handlerIsOpen(row) {
      const res = await this.$http.post("/api/UpdateProductState", {
        productNumberList: [row.productNumber],
        isOpen: row.isOpen ? 1 : 0,
        isStop: row.isStop
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "修改状态成功",
          type: "success"
        });
      } else {
        row.isOpen = false;
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取我的产品
    async getMyProductPage() {
      const fd = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.searchForm.keyword
      };
      switch (this.searchForm.state) {
        case 1:
          fd.isStop = 0;
          break;
        case 2:
          fd.isStop = 1;
          break;
        case 3:
          fd.isOpen = false;
          break;
        case 4:
          fd.isOpen = true;
          break;
      }
      if (this.searchForm.supplier) {
        fd.maKeyGuidList = [this.searchForm.supplier];
      }
      if (this.searchForm.hall) {
        fd.companyNumber = this.searchForm.hall;
      }
      console.log(getCurrentTime(Date.now()));
      const res = await this.$http.post("/api/MyProductPage", fd);
      if (res.data.result.code === 200) {
        console.log(getCurrentTime(Date.now()));
        this.tableData.data = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
        this.$nextTick(() => {
          console.log(getCurrentTime(Date.now()));
        });
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  },
  created() {},
  mounted() {
    this.getMyProductPage();
    this.getSupplierListByHall();
    this.getVipRegions();
    eventBus.$on("handlerShowPi", () => {
      this.isShowPi = false;
    });
  },
  beforeDestroy() {
    eventBus.$off("handlerShowPi");
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.myProduct {
  .searchWarp {
    display: flex;
    justify-content: space-between;
    .searchBox {
      display: flex;
      .search_item {
        width: 275px;
        margin-right: 20px;
      }
    }
    .btns {
      position: relative;
      .batchBox {
        position: absolute;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0px 4px 15px 0px rgba(42, 69, 116, 0.25);
        z-index: 1;
        right: 0;
        font-size: 15px;
        .item {
          padding: 0 21px;
          cursor: pointer;
          width: 200px;
          height: 50px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #dcdfe6;
          &:last-of-type {
            border-bottom: none;
          }
          &:hover {
            background-color: #eff6ff;
          }
          .left {
            display: flex;
            align-items: center;
            .icon {
              width: 18px;
              height: 18px;
              margin-right: 12px;
              &.pi_tui {
                background: url("~@/assets/images/pi_tui.png") no-repeat center;
              }
              &.pi_gai {
                background: url("~@/assets/images/pi_gai.png") no-repeat center;
              }
              &.pi_gong {
                background: url("~@/assets/images/pi_gong.png") no-repeat center;
              }
              &.pi_yin {
                background: url("~@/assets/images/pi_yin.png") no-repeat center;
              }
              &.pi_shang {
                background: url("~@/assets/images/pi_shang.png") no-repeat
                  center;
              }
              &.pi_xia {
                background: url("~@/assets/images/pi_xia.png") no-repeat center;
              }
              &.pi_shan {
                background: url("~@/assets/images/pi_shan.png") no-repeat center;
              }
              &.pi_she {
                background: url("~@/assets/images/pi_she.png") no-repeat center;
              }
              background-size: contain;
            }
          }
        }
      }
    }
  }
  .tableBox {
    margin-top: 20px;
    @{deep} .el-table {
      .el-table__header-wrapper .el-checkbox {
        display: block !important;
      }
    }
  }
}
</style>
