<template>
  <div>
    <!-- 搜索条件 -->
    <div class="searchBox">
      <div class="item keyword">
        <span class="title">关键词：</span>
        <div class="content">
          <el-input
            placeholder="请输入关键词"
            @keyup.native.enter="getSystemList"
            size="medium"
            v-model="searchForm.keyword"
            clearable
          >
          </el-input>
        </div>
      </div>
      <div class="item date">
        <span class="title">时间段：</span>
        <div class="content">
          <el-date-picker
            v-model="searchForm.time"
            size="medium"
            value-format="yyyy-MM-ddTHH:mm:ss"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="btns">
        <el-button
          type="primary"
          @click="getSystemList"
          size="medium"
          icon="el-icon-search"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 消息列表 -->
    <ul class="infoBox">
      <li class="info_item" v-for="item in infoList" :key="item.id">
        <div class="tableHead">
          <p>{{ item.title }}</p>
        </div>
        <div class="tablemian">
          <div class="tablemian_left">
            <div class="tablemian_left_item">
              <span class="tablemian_left_content">
                {{ item.content }}
              </span>
            </div>
            <div class="tablemian_left_item">
              <div class="date">
                <span class="dateTitle">时间：</span>
                <span class="dateValue">
                  {{ item.createdOn && item.createdOn.replace(/T/, " ") }}
                </span>
              </div>
            </div>
          </div>
          <div class="mianBtn">
            <el-button
              size="small"
              @click="openDetails(item)"
              style="color:#3368A9;border-color: #3368A9;"
              >查看详情</el-button
            >
          </div>
        </div>
      </li>
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
    </ul>
    <el-dialog :visible.sync="showInfoDetails" width="800">
      <div class="infoDetailsBox">
        <div class="title">{{ detailsOption.title }}</div>
        <div class="dateBox">
          时间：
          <span>
            {{
              detailsOption.createdOn &&
                detailsOption.createdOn.replace(/T/, " ")
            }}
          </span>
        </div>
        <div class="content">
          {{ detailsOption.content }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      infoList: [],
      detailsOption: {},
      showInfoDetails: false,
      searchForm: {
        keyword: "",
        time: ""
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
      }
    };
  },
  methods: {
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.factoryTotalCount &&
        this.currentPage != 1
      )
        return false;
      this.getSystemList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getSystemList();
    },
    // 打开消息详情
    openDetails(item) {
      this.detailsOption = item;
      this.showInfoDetails = true;
    },
    // 获取系统消息列表
    async getSystemList() {
      const fd = {
        keyword: this.searchForm.keyword,
        startTime: this.searchForm.time && this.searchForm.time[0],
        endTime: this.searchForm.time && this.searchForm.time[1],
        businessType: this.options.businessType,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "")
          delete fd[key];
      }
      const res = await this.$im_http.post("/api/Message/NotifyList", fd);
      const { code, item, msg } = res.data.result;
      if (code === 200) {
        this.infoList = item.items;
        this.totalCount = item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
      }
    }
  },
  created() {},
  mounted() {
    this.getSystemList();
  }
};
</script>
<style scoped lang="less">
.searchBox {
  height: 71px;
  background-color: #fff;
  margin-top: 20px;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 17px 20px;
  display: flex;
  .item {
    display: flex;
    align-items: center;
    .title {
      width: 80px;
      min-width: 80px;
      text-align: right;
    }
    .content {
      .el-input {
        width: 160px;
      }
      .el-select {
        width: 130px;
      }
      .el-date-editor--datetimerange.el-input__inner {
        width: 250px;
      }
    }
  }
  .btns {
    margin-left: 20px;
  }
}
.infoBox {
  margin-top: 20px;
  .info_item {
    background-color: #fff;
    border-radius: 4px;
    height: 146px;
    margin-bottom: 20px;
    .tableHead {
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;
      font-size: 16px;
      color: #333;
      border-bottom: 1px solid #dcdfe6;
      .tableHeadIcon {
        width: 50px;
        min-width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        cursor: pointer;
      }
    }
    .tablemian {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      padding-top: 6px;
      box-sizing: border-box;
      .tablemian_left {
        flex: 1;
        .tablemian_left_item {
          margin-top: 14px;
          color: #666;
          max-width: 1300px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          .date {
            color: #999;
          }
        }
      }
      .mianBtn {
        margin-top: 20px;
        width: 100px;
        min-width: 100px;
      }
    }
  }
}
.infoDetailsBox {
  height: 600px;
  overflow-y: auto;
  .title {
    font-size: 20px;
    font-weight: 700;
    text-align: center;
  }
  .dateBox {
    color: #999;
    text-align: center;
    margin-top: 8px;
  }
  .content {
    color: #666;
    line-height: 24px;
    margin-top: 13px;
    border-top: 1px solid #e5e5e5;
    padding-top: 22px;
  }
}
</style>
