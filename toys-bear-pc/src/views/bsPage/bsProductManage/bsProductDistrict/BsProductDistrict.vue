<template>
  <div class="bsProductDistrict">
    <!-- 头部 -->
    <div class="top_title">
      <div class="titleLeft">
        <span>产品区域 ({{ totalCount }})</span>
      </div>
      <div class="right"></div>
    </div>
    <div class="searchBox">
      <div class="searchBox_left">
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
          区域：<el-select
            v-model="searchForm.areaRegionId"
            style="width:200px;"
            clearable
            size="medium"
            placeholder="请选择"
          >
            <template v-for="item in quyuList">
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
      <div class="searchBox_right">
        <el-button
          size="medium"
          @click="open_piShe"
          style="width: 119px;background-color: #2D7FE4;border-color: #2D7FE4;color:#fff;"
        >
          批量设置地区
        </el-button>
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
    <!-- 设置地区 -->
    <el-dialog
      title="设置地区"
      :close-on-click-modal="false"
      :visible.sync="she_dialog"
      v-if="she_dialog"
      width="532px"
      top="250px"
    >
      <dialogComponents
        @close="she_dialog = false"
        @subm="she_subm"
        :areaList="quyuList"
        :currentAreaRegion="currentAreaRegion"
        :is_pi="is_pi"
        :selectionList="selectionList"
      />
    </el-dialog>
  </div>
</template>

<script>
import myTable from "@/components/table.vue";
import dialogComponents from "./components/dialogComponents.vue";
export default {
  name: "",
  components: { myTable, dialogComponents },
  data() {
    return {
      currentAreaRegion: [],
      is_pi: false,
      she_dialog: false,
      searchForm: {
        keyword: null,
        areaRegionId: null
      },
      selectionList: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      quyuList: [],
      tableData: {
        selection: true,
        showLoading: false,
        isIndex: true,
        data: [],
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
            prop: "price",
            isHiden: true,
            label: "单价",
            color: "red",
            render: row => {
              return row.cu_de + row.price;
            }
          },
          {
            prop: "price",
            isHiden: true,
            label: "热销地区",
            color: "#2D7FE4",
            width: 300,
            render: row => {
              return this.filterAreaRegion(row.areaRegion);
            }
          }
        ],
        actions: [
          {
            type: "primary",
            textWrapper() {
              return "设置地区";
            },
            methods: row => {
              this.currentAreaRegion = row.areaRegion;
              this.selectionList = [row];
              this.is_pi = false;
              this.she_dialog = true;
            }
          }
        ]
      }
    };
  },
  created() {},
  mounted() {
    this.getVipRegions();
    this.getMyProductPage();
  },
  methods: {
    // 打开批量设置
    open_piShe() {
      this.is_pi = true;
      if (!this.selectionList.length) {
        this.$common.handlerMsgState({
          msg: "请选择产品",
          type: "danger"
        });
        return false;
      }
      this.she_dialog = true;
    },
    // 设置地区成功
    she_subm() {
      this.she_dialog = false;
      this.selectionList = [];
      this.getMyProductPage();
    },
    // 过滤专区
    filterAreaRegion(list) {
      let str = "";
      for (let i = 0; i < list.length; i++) {
        const current = this.quyuList.find(v => v.id === list[i]);
        str += current.name + "|";
      }
      return str && str.substr(0, str.length - 1);
    },
    // 选择发生变化
    selectionChange(list) {
      this.selectionList = list;
    },
    // 获取我的产品
    async getMyProductPage() {
      const fd = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.searchForm.keyword,
        areaRegionId: this.searchForm.areaRegionId
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/MyProductPage", fd);
      if (res.data.result.code === 200) {
        this.tableData.data = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取专区
    async getVipRegions() {
      const res = await this.$http.post("/api/getVipRegions", {});
      if (res.data.result.code === 200) {
        this.quyuList =
          (res.data.result.item.vipRegionItem &&
            res.data.result.item.vipRegionItem[0] &&
            res.data.result.item.vipRegionItem[0].items) ||
          [];
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
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
    // 搜索
    search() {
      this.currentPage = 1;
      this.getMyProductPage();
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsProductDistrict {
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 20px;
  .top_title {
    height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e5e5;
    .titleLeft {
      flex: 1;
    }
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
  .searchBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    .searchBox_left {
      display: flex;
      .search_item {
        width: 275px;
        margin-right: 20px;
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
