<template>
  <el-container>
    <el-header style="padding:0;">
      <bsTop></bsTop>
    </el-header>
    <el-main style="padding:0;overflow:visible;">
      <!-- 搜索 -->
      <div style="maxWidth:1200px;minWidth:1024px;margin:0 auto;">
        <div class="searchBox">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="关键字查询">
              <el-input
                clearable
                @keyup.enter.native="search"
                v-model="searchForm.keyword"
                placeholder="输入关键字"
                style="width: 90%"
              ></el-input>
            </el-form-item>
            <el-form-item label="货场类型：">
              <el-select
                clearable
                v-model="searchForm.yardType"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in yardTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间段搜索">
              <el-date-picker
                style="width:250px;"
                v-model="searchForm.dateTile"
                value-format="yyyy-MM-ddTHH:mm:ss"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="—"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
            </el-form-item>
            <el-form-item class="btnList">
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="primary" @click="openAddVersion">新增</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 列表 -->
        <div class="tableContent">
          <el-table
            :data="tableData"
            style="width: 100%"
            size="medium"
            :default-sort="{ prop: 'date', order: 'descending' }"
          >
            <el-table-column label="图片" width="70" align="center">
              <template slot-scope="scope">
                <el-image
                  style="width:50px;height:50px;"
                  :src="scope.row.imgUrl"
                  fit="contain"
                  :preview-src-list="[scope.row.imgUrl]"
                >
                  <div slot="placeholder" class="image-slot">
                    <img
                      class="errorImg"
                      src="~@/assets/images/placeholderImg.png"
                      style="width:50px;height:50px;"
                      alt
                    />
                  </div>
                  <div slot="error" class="image-slot">
                    <img
                      class="errorImg"
                      style="width:50px;height:50px;"
                      src="~@/assets/images/placeholderImg.png"
                      alt
                    />
                  </div>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column prop="yardName" label="货场名称"></el-table-column>
            <el-table-column prop="fileUrl" label="货场类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.yardType == 0">货场</span>
                <span v-else-if="scope.row.yardType == 1">货运站</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="contactsMan"
              label="联系人"
            ></el-table-column>
            <el-table-column prop="telephone" label="电话"></el-table-column>
            <el-table-column prop="phoneNumber" label="手机"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column
              prop="createdOn"
              label="时间"
              sortable
              align="center"
            >
              <template slot-scope="scope">
                {{
                  scope.row.createdOn && scope.row.createdOn.replace(/T/g, " ")
                }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button
                  style="margin-right:10px;"
                  size="mini"
                  type="primary"
                  @click="openEdit(scope.row)"
                  >编辑</el-button
                >
                <el-popconfirm
                  title="确定要删除该货场吗？"
                  @confirm="handleDelete(scope.row)"
                >
                  <el-button size="mini" slot="reference" type="danger"
                    >删除</el-button
                  >
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
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
    </el-main>
    <el-footer style="padding:0;" height="162px">
      <bsFooter></bsFooter>
    </el-footer>
  </el-container>
</template>

<script>
import bsTop from "@/components/BsTop";
import bsFooter from "@/components/oldFooter";
import addYard from "./addYard/addYard";
export default {
  components: { bsTop, bsFooter, addYard },
  name: "yardManage",
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
      tableData: [],
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
        this.tableData = res.data.result.item.items;
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
  mounted() {
    this.getAppVersionPage();
  },
  created() {}
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.searchBox {
  padding-top: 50px;
  .btnList {
    float: right;
  }
}
.tableContent {
  padding: 20px 0;
}
.txtWrap {
  padding: 0 0 13px 0;
  line-height: 0;
  @{deep} .el-input__count {
    line-height: 15px;
  }
}
</style>
