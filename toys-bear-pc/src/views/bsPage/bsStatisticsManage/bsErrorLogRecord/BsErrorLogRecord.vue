<template>
  <div class="bsMyCollection">
    <div class="title">错误日志记录 ({{ totalCount }})</div>
    <div class="searchBox">
      <div class="item">
        <span class="label">关键词：</span>
        <el-input
          v-focus
          type="text"
          size="medium"
          v-model="keyword"
          clearable
          placeholder="请输入关键词"
          @keyup.native.enter="search"
        ></el-input>
      </div>
      <div class="item" style="width: 200px;">
        <span class="label">审核状态：</span>
        <el-select v-model="state" size="medium" clearable placeholder="请选择">
          <el-option
            v-for="(item, i) in [
              { label: '全部', value: '' },
              { label: '未处理', value: 0 },
              { label: '已处理', value: 1 }
            ]"
            :key="i"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <span class="label">时间段：</span>
        <el-date-picker
          size="medium"
          value-format="yyyy-MM-ddTHH:mm:ss"
          v-model="dateTile"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
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

    <el-dialog
      title="处理日志"
      :visible.sync="errorLogDialog"
      destroy-on-close
      width="50%"
    >
      <el-form
        ref="addVersionForm"
        label-width="100px"
        :model="errorLogFormData"
      >
        <el-form-item label="终端" prop="platform">
          <el-input v-model="errorLogFormData.platform" disabled></el-input>
        </el-form-item>
        <el-form-item label="日志类型" prop="logType">
          <!-- <el-tag :type="errorLogFormData.logType===0?'danger':errorLogFormData.logType===1?'warning':''" effect="plain">{{errorLogFormData.logType===0?'接口闪退':errorLogFormData.logType===1?'接口超时':'请求失败'}}</el-tag> -->
          <el-input v-model="errorLogFormData.logType" disabled></el-input>
        </el-form-item>
        <el-form-item label="日志标题" prop="title">
          <el-input
            type="textarea"
            autosize
            resize="none"
            v-model="errorLogFormData.title"
            disabled
          ></el-input>
          <!-- <el-tag>{{errorLogFormData.title}}</el-tag> -->
        </el-form-item>
        <el-form-item label="请求地址" prop="url">
          <el-input
            type="textarea"
            autosize
            resize="none"
            v-model="errorLogFormData.url"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="请求参数" prop="parameters">
          <el-input
            type="textarea"
            autosize
            resize="none"
            v-model="errorLogFormData.parameters"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="错误信息" prop="message">
          <el-input
            type="textarea"
            autosize
            resize="none"
            v-model="errorLogFormData.message"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="报错时间" prop="createdOn">
          <el-input
            type="textarea"
            autosize
            resize="none"
            v-model="errorLogFormData.createdOn"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="处理意见" prop="remark">
          <el-input
            type="textarea"
            placeholder="请输入处理意见"
            :rows="4"
            resize="none"
            v-model="errorLogFormData.remark"
          ></el-input>
        </el-form-item>
        <center>
          <template>
            <el-button type="primary" @click="subProcessingLog"
              >提 交</el-button
            >
            <el-button type="danger" @click="errorLogDialog = false"
              >取 消</el-button
            >
          </template>
        </center>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import { mapState } from "vuex";
import Table from "@/components/table";
export default {
  name: "bsErrorLogRecord",
  components: {
    Table
  },
  data() {
    return {
      isUpLoad: false,
      errorLogDialog: false,
      errorLogFormData: {
        platform: null,
        logType: null,
        title: null,
        message: null,
        createdOn: null,
        url: null,
        id: null,
        parameters: null,
        state: null,
        remark: null
      },
      state: "",
      keyword: "",
      dateTile: null,
      totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      tableData: {
        data: [],
        sizeMini: "mini",
        columns: [
          { prop: "platform", label: "终端" },
          {
            prop: "logType",
            label: "日志类型",
            render(row) {
              if (row.logType === 0) {
                return "<span>闪退</span>";
              } else if (row.logType === 1) {
                return "<span>请求超时</span>";
              } else if (row.logType === 2) {
                return "<span>请求失败</span>";
              }
            }
          },
          { prop: "title", label: "日志标题" },
          { prop: "processBy", label: "处理人" },
          { prop: "url", label: "地址" },
          { prop: "message", label: "错误信息" },
          {
            prop: "state",
            label: "处理状态",
            render(row) {
              if (row.state == 0) {
                return "<span style='color: #33a96a; '>未处理</span>";
              } else if (row.state == 1) {
                return "<span style='color: #33a96a; '>已处理</span>";
              }
            }
          },
          { prop: "remark", label: "处理意见" },
          {
            prop: "createdOn",
            label: "报错时间",
            render: row => {
              return row.createdOn.replace(/T/, " ");
            }
          }
        ],
        actions: [
          {
            classWrapper: () => {
              return "primary";
            },
            textWrapper: () => {
              return "处理错误";
            },
            methods: row => {
              this.openEdit(row);
            }
          }
        ]
      }
    };
  },
  methods: {
    // 处理错误日志
    async subProcessingLog() {
      const fd = {
        platform: null,
        logType: null,
        title: null,
        message: null,
        url: null,
        id: null,
        parameters: null,
        state: null,
        remark: null
      };
      for (const key in fd) {
        fd[key] = this.errorLogFormData[key];
      }
      fd.state = true;
      const res = await this.$http.post("/api/UpdateLogRecord", fd);
      if (res.data.result.code === 200) {
        await this.getLogErrorPage();
        this.errorLogDialog = false;
        this.$message.success("处理成功");
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    // 打开日志窗口
    openEdit(row) {
      for (const key in this.errorLogFormData) {
        this.errorLogFormData[key] = row[key];
      }
      this.errorLogDialog = true;
    },
    // 获取错误日志列表
    async getLogErrorPage() {
      const fd = {
        startTime: this.dateTile && this.dateTile[0],
        endTime: this.dateTile && this.dateTile[1],
        state: this.state,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.keyword
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      const res = await this.$http.post("/api/GetLogRecordPage", fd);
      if (res.data.result.code === 200) {
        this.tableData.data = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      }
    },
    // 切换当前页条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getLogErrorPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getLogErrorPage();
    },
    // 搜索
    search() {
      this.currentPage = 1;
      this.getLogErrorPage();
    }
  },
  created() {
    this.getLogErrorPage();
  },
  mounted() {}
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
        width: 70px;
        min-width: 70px;
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
