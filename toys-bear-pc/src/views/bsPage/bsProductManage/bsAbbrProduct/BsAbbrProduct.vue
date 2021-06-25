<template>
  <div class="bsAbbrProduct">
    <div class="title">3D产品({{ totalCount }})</div>
    <div class="searchBox">
      <div class="left">
        <div class="item">
          <span class="label">关键字：</span>
          <el-input
            v-focus
            type="text"
            size="medium"
            clearable
            v-model="keyword"
            placeholder="请输入关键词"
            @keyup.native.enter="search"
          ></el-input>
        </div>
        <div class="item">
          <el-button
            @click="search"
            type="primary"
            icon="el-icon-search"
            size="medium"
          >
            搜索
          </el-button>
        </div>
      </div>
    </div>
    <div class="tableBox">
      <Table :table="tableData"></Table>
      <center style="padding: 20px 0">
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
    <x-dialog
      :visible.sync="dialogVisibleThreeD"
      v-if="dialogVisibleThreeD"
      width="1264px"
      top="10vh"
      @close="open3D(false)"
      :fullscreen="threeDFullscreen"
      class="three_d"
    >
      <div slot="title" class="el-dialog__header_right">
        <i class="el-icon-full-screen" @click="isThreeDFullscreen"></i>
      </div>
      <div :class="[threeDFullscreen ? 'lg_panel' : 'sm_panel']">
        <iframe
          :src="threeDimensional"
          id="map"
          scrolling="no"
          frameborder="0"
          :class="[threeDFullscreen ? 'lg_iframe' : 'sm_iframe']"
        ></iframe>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import Table from "@/components/table";
import XDialog from "@/components/public/xDialog";
export default {
  name: "bsProductManage",
  components: {
    Table,
    XDialog
  },
  data() {
    return {
      keyword: null,
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      dialogVisibleThreeD: false, //是否显示3d弹窗
      threeDFullscreen: false, //3d是否全屏
      tableData: {
        data: [],
        showLoading: false,
        sizeMini: "mini",
        isIndex: true,
        columns: [
          {
            prop: "name",
            label: "产品",
            width: 300,
            color: "#3368a9",
            align: "left",
            // isHiden: true,
            infoBox: true,
            productInfo: true,
            cartInfoIcon: true,
            elImage: row => {
              return row.img;
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

          { prop: "fa_no", label: "出厂货号", isHiden: true },
          {
            prop: "createdOn",
            label: "时间",
            width: 150,
            render: row => {
              return row.createdOn && row.createdOn.replace(/T.*/, "");
            }
          },
          { prop: "price", label: "单价" },
          {
            prop: "threeDimensional",
            label: "3D",
            threeDimensional: true,
            threeDimensionalUrl: row => {
              return row.threeDimensional;
            }
          }
        ],
        btnWidth: 100,
        actions: [
          {
            classWrapper: () => {
              return "primary";
            },
            textWrapper: () => {
              return "预览";
            },
            methods: row => {
              this.threeDimensional = row.threeDimensional;
              this.open3D(true);
            }
          }
        ]
      }
    };
  },
  created() {},
  mounted() {
    this.getMyProductPage();
  },
  methods: {
    // 搜索
    search() {
      this.currentPage = 1;
      this.getMyProductPage();
    },
    // 获取我的产品
    async getMyProductPage() {
      const fd = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        keyword: this.keyword,
        isUpInset3D: true
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
    // 打开3D效果
    open3D(value) {
      this.dialogVisibleThreeD = value;
      if (!value) {
        this.threeDFullscreen = false;
      }
    },
    //3d是否全屏
    isThreeDFullscreen() {
      this.threeDFullscreen = this.threeDFullscreen ? false : true;
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
    }
  }
};
</script>
<style scoped lang="less">
.bsAbbrProduct {
  min-height: 100%;
  background-color: #fff;
  padding: 0 20px;
  .title {
    height: 55px;
    line-height: 55px;
    font-size: 15px;
    font-weight: 700;
    padding-left: 15px;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #e5e5e5;
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
    height: 76px;
    display: flex;
    align-items: center;
    .left {
      flex: 1;
      display: flex;
      align-items: center;
      .item {
        display: flex;
        align-items: center;
        max-width: 290px;
        margin-right: 20px;
        .label {
          width: 58px;
          min-width: 58px;
        }
      }
    }
  }
  .three_d {
    // transform: rotateY(180deg);
    display: none;
    transition: 0.5s;
    perspective: 12064px;
    .sm_panel {
      width: 100%;
      height: 671px;
    }
    .sm_iframe {
      position: absolute;
      top: 50px;
      left: 0px;
      right: 0px;
      bottom: 10px;
      width: 100%;
      height: 711px;
    }
    .lg_panel {
      width: 100%;
      height: 845px;
    }
    .lg_iframe {
      position: absolute;
      top: 50px;
      left: 0px;
      right: 0px;
      bottom: 10px;
      width: 100%;
      height: 885px;
    }
  }
}
</style>
