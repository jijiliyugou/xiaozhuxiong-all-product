<template>
  <div class="bsMyCollection">
    <div class="title">货场管理 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="item">
        <span class="label">关键词：</span>
        <el-input
          v-focus
          type="text"
          size="medium"
          clearable
          v-model="searchForm.keyword"
          placeholder="请输入关键词"
          @keyup.native.enter="search"
        ></el-input>
      </div>
      <div class="item">
        <span class="label">时间段：</span>
        <el-date-picker
          size="medium"
          value-format="yyyy-MM-ddTHH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="searchForm.dateTile"
        >
        </el-date-picker>
      </div>
      <div class="item">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="medium"
          @click="search"
        >
          搜索
        </el-button>
      </div>

      <div style="flex: 1;text-align: right;">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="medium"
          @click="openAddVersion"
          style="float:right"
        >
          新增
        </el-button>
      </div>
    </div>
    <div class="tableBox">
      <Table :table="tableData"></Table>
      <center style="margin-top:20px;">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          :total="totalCount"
          :current-page.sync="currentPage"
          @current-change="currentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </center>
    </div>

    <!-- 新增编辑货场 -->
    <el-dialog
      :title="yardTitle"
      :visible.sync="versionDialog"
      v-if="versionDialog"
      width="50%"
      top="60px"
    >
      <addYard :options="options" @success="success" @close="close"></addYard>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/table";
import addYard from "@/components/bsComponents/bsSystemSetComponent/addMsgTp/addYard";
export default {
  name: "bsLoginRecord",
  components: {
    Table,
    addYard
  },
  data() {
    return {
      options: {
        isEdit: false,
        item: {
          imgUrl: null,
          yardName: null,
          yardType: 0,
          contactsMan: null,
          telephone: null,
          phoneNumber: null,
          address: null,
          remark: null
        }
      },
      yardTypeList: [
        {
          label: "全部",
          value: null
        },
        {
          label: "货场",
          value: 0
        },
        {
          label: "货运站",
          value: 1
        }
      ],
      isUpLoad: false,
      versionDialog: false,
      yardTitle: "新增货场",
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      addVersionRules: {
        platForm: [
          { required: true, message: "请选择手机平台", trigger: "change" }
        ],
        forceUpdate: [
          { required: true, message: "请选择是否强制更新", trigger: "change" }
        ],
        vesion: [
          { required: true, message: "请输入版本号", trigger: "blur" },
          { min: 1, max: 9999, message: "请输入版本号", trigger: "blur" }
        ],
        fileUrl: [
          { required: true, message: "请输入链接地址", trigger: "blur" },
          { min: 1, max: 9999, message: "请输入链接地址", trigger: "blur" }
        ]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      searchForm: {
        keyword: null,
        yardType: null,
        dateTile: []
      },
      tableData: {
        data: [],
        sizeMini: "mini",
        columns: [
          {
            prop: "imgUrl",
            label: "图片",
            elImageUrl: true,
            style: "width: 50px; height: 50px;",
            elImage: row => {
              return row.imgUrl;
            }
          },
          { prop: "yardName", label: "货厂名称" },
          { prop: "contactsMan", label: "联系人" },
          { prop: "telephone", label: "电话" },
          { prop: "phoneNumber", label: "手机" },
          { prop: "address", label: "地址" },
          { prop: "remark", label: "备注" },
          {
            prop: "createdOn",
            label: "时间",
            render(row) {
              return row.createdOn.replace(/T/, " ");
            }
          }
        ],
        actions: [
          {
            type: "primary",
            textWrapper() {
              return "编辑";
            },
            methods: row => {
              this.openEdit(row);
            }
          },
          {
            type: "danger",
            textWrapper() {
              return "删除";
            },
            methods: row => {
              this.handleDelete(row);
            }
          }
        ]
      }
    };
  },
  methods: {
    // 新增编辑货场成功
    success() {
      this.versionDialog = false;
      this.getAppVersionPage();
    },
    // 关闭新增货场
    close() {
      this.versionDialog = false;
    },
    // 列表查询
    search() {
      this.currentPage = 1;
      this.getAppVersionPage();
    },
    // 获取货场列表
    async getAppVersionPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        endTime: this.searchForm.dateTile && this.searchForm.dateTile[1],
        startTime: this.searchForm.dateTile && this.searchForm.dateTile[0],
        keyword: this.searchForm.keyword,
        yardType: this.searchForm.yardType
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/ProductYardPage", fd);
      if (res.data.result.code === 200) {
        this.tableData.data = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      }
    },
    // 切换当前页
    currentChange(page) {
      this.currentPage = page;
      this.getAppVersionPage();
    },
    // 切换当前页条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (this.currentPage * pageSize > this.totalCount) return false;
      this.getAppVersionPage();
    },
    // 打开编辑窗口
    openEdit(row) {
      this.yardTitle = "编辑货场";
      this.options = {
        isEdit: true,
        item: row
      };
      this.versionDialog = true;
    },
    // 打开新增货场
    openAddVersion() {
      this.yardTitle = "新增货场";
      this.options = {
        isEdit: false,
        item: {
          imgUrl: null,
          yardName: null,
          yardType: 0,
          contactsMan: null,
          telephone: null,
          phoneNumber: null,
          address: null,
          remark: null
        }
      };
      this.versionDialog = true;
    },
    // 删除
    async handleDelete(row) {
      const res = await this.$http.post("/api/DeleteProductYard", {
        id: row.id
      });
      if (res.data.result.code === 200) {
        this.$message.success("删除成功");
        this.getAppVersionPage();
      } else {
        this.$message.error("删除失败,请检查网络！");
      }
    }
  },
  created() {
    this.getAppVersionPage();
  },
  mounted() {},
  computed: {}
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsMyCollection {
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
  @{deep} .tableBox {
    .el-table {
      font-size: 13px;
      .imgBox {
        text-align: left;
        display: flex;
        font-size: 14px;
        .productName {
          width: 190px;
          height: 60px;
          margin-left: 15px;
          .name,
          .factory {
            width: 190px;
            max-width: 190px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
          .factory {
            color: #3368a9;
          }
          .name {
            margin-top: 8px;
          }
        }
      }
    }
    .errorImg {
      img {
        width: 80px;
        height: 60px;
      }
    }
  }
}
</style>
