<template>
  <div>
    <!-- 搜索条件 -->
    <div class="searchBox">
      <div class="item keyword">
        <span class="title">关键词：</span>
        <div class="content">
          <el-input
            placeholder="请输入关键词"
            @keyup.native.enter="getERPOrderListByPage"
            size="medium"
            v-model="searchForm.keyword"
            clearable
          >
          </el-input>
        </div>
      </div>
      <div class="item type">
        <span class="title">类型：</span>
        <div class="content">
          <el-select
            v-model="searchForm.messageExt"
            @change="getERPOrderListByPage"
            size="medium"
            placeholder="请选择"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.title"
              :value="item.messageExt"
            >
            </el-option>
          </el-select>
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
          @click="getERPOrderListByPage"
          size="medium"
          icon="el-icon-search"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 消息列表 -->
    <ul class="infoBox">
      <li class="info_item" v-for="item in erpOrderList" :key="item.id">
        <div class="tableHead">
          <p class="tableHead_title">
            <el-badge :is-dot="!item.readStatusM">
              {{ item.fromCompanyName }}
            </el-badge>
          </p>
        </div>
        <div class="tablemian">
          <div class="tablemian_left">
            <div class="tablemian_left_item">
              <p class="left_item" v-if="filterTypes(item.messageExt)">
                <span class="title">类型：</span>
                <span> {{ filterTypes(item.messageExt) }} </span>
              </p>
              <p class="left_item" v-if="item.the_nu">
                <span class="title">代号：</span>
                <span>{{ item.the_nu }}</span>
              </p>
              <p
                :class="{
                  left_item: true,
                  red: item.orderStatus == '0',
                  blue: item.orderStatus == '1',
                  green: item.orderStatus == '9',
                  gray: item.orderStatus == '99'
                }"
              >
                <span class="title">状态：</span>
                <span
                  v-if="
                    item.toCompanyNumer !=
                      userInfo.commparnyList[0].companyNumber &&
                      item.orderStatus == '0'
                  "
                  >对方未读</span
                >
                <span
                  v-else-if="
                    item.toCompanyNumer ==
                      userInfo.commparnyList[0].companyNumber &&
                      item.orderStatus == '0'
                  "
                  >--</span
                >
                <span
                  v-if="
                    item.toCompanyNumer !=
                      userInfo.commparnyList[0].companyNumber &&
                      item.orderStatus == '1'
                  "
                  >对方已读</span
                >
                <span
                  v-else-if="
                    item.toCompanyNumer ==
                      userInfo.commparnyList[0].companyNumber &&
                      item.orderStatus == '1'
                  "
                  >--</span
                >
                <span v-if="item.orderStatus == '9'">已完成</span>
                <span v-else-if="item.orderStatus == '99'">已取消</span>
              </p>
            </div>
            <div class="tablemian_left_item">
              <p class="left_item">
                <span class="title">时间：</span>
                <span>{{
                  item.createdOn && item.createdOn.replace(/T/, " ")
                }}</span>
              </p>
              <p class="left_item">
                <span class="title">内容：</span>
                <span>{{ item.pushContent }}</span>
              </p>
              <p class="left_item">
                <span class="title">单号：</span>
                <span>{{ item.orderNumber }}</span>
              </p>
            </div>
          </div>
          <div class="mianBtn">
            <el-button
              size="small"
              @click="openDetails(item)"
              style="color:#3368A9;border-color: #3368A9;"
              >查看详情</el-button
            >
            <el-button
              size="small"
              @click="toNews(item)"
              type="primary"
              icon="el-icon-chat-dot-round"
              >立即沟通</el-button
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import eventBus from "@/assets/js/common/eventBus.js";
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
      yewuDetails: null,
      erpOrderList: [],
      totalCount: 0,
      typeList: [],
      pageSize: 10,
      currentPage: 1,
      searchForm: {
        keyword: "",
        messageExt: -1,
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
    toNews(item) {
      console.log(item);
      this.$common.handlerMsgState({
        msg: "敬请期待",
        type: "warning"
      });
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.factoryTotalCount &&
        this.currentPage != 1
      )
        return false;
      this.getERPOrderListByPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getERPOrderListByPage();
    },
    // 查看业务消息详情
    openDetails(item) {
      // item.readStatusM = true;
      const fd = {
        name: "bsHallYewuDetails" + item.orderNumber || item.offerNumber,
        linkUrl: this.$router.path,
        component: "bsHallYewuDetails",
        refresh: true,
        label: item.orderNumber || item.offerNumber,
        value: {
          ...item,
          typeList: this.typeList
        }
      };
      this.$store.commit("myAddTab", fd);
    },
    // 过滤消息类型
    filterTypes(Ext) {
      const current = this.typeList.find(val => val.messageExt == Ext);
      if (current) return current.title;
      else return false;
    },
    // 获取消息类型
    async getMessageTeplateSettingsByPage() {
      const fd = {
        maxResultCount: 9999,
        messageModel: this.options.messageModel,
        skipCount: 1
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "")
          delete fd[key];
      }
      const res = await this.$http.post(
        "/api/PushSettings/MessageTeplateSettingsByPage",
        fd
      );
      if (res.data.result.code === 200) {
        this.typeList = res.data.result.item.items;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取业务消息表格数据
    async getERPOrderListByPage() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        keyword: this.searchForm.keyword,
        startTime: this.searchForm.time && this.searchForm.time[0],
        endTime: this.searchForm.time && this.searchForm.time[1],
        // readStatus: "-1",
        messageModel: this.options.messageModel,
        messageExt: this.searchForm.messageExt,
        sampleFrom: this.options.sampleFrom,
        sampleTo: this.options.sampleTo
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "")
          delete fd[key];
      }
      const res = await this.$http.post("/api/GetERPOrderListByPage", fd);
      if (res.data.result.code === 200) {
        this.erpOrderList = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
        console.log(this.erpOrderList);
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  },
  created() {},
  async mounted() {
    await this.getMessageTeplateSettingsByPage();
    await this.getERPOrderListByPage();
    eventBus.$on("resetHallList", () => {
      this.getERPOrderListByPage();
    });
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
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
        width: 235px;
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
    min-height: 146px;
    margin-bottom: 20px;
    padding-bottom: 10px;
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
      @{deep} .tableHead_title {
        .el-badge {
          .el-badge__content {
            top: 15px;
          }
        }
      }
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
      padding-top: 5px;
      .tablemian_left {
        flex: 1;
        .tablemian_left_item {
          display: flex;
          margin-top: 15px;
          .left_item {
            width: 370px;
            // line-height: 30px;
            color: #666;
            .title {
              color: #999;
            }
            &.red {
              color: #ff4848;
              .title {
                color: #ff4848;
              }
            }
            &.blue {
              color: #3368a9;
              .title {
                color: #3368a9;
              }
            }
            &.green {
              color: #33a96a;
              .title {
                color: #33a96a;
              }
            }
            &.gray {
              color: #999999;
              .title {
                color: #999999;
              }
            }
          }
          .left_content {
            flex: 1;
            // line-height: 30px;
            // margin-top: 10px;
            display: flex;
            margin-right: 20px;
            box-sizing: border-box;
            color: #666;
            // display: flex;
            .title {
              color: #999;
              white-space: nowrap;
            }
            .left_content_content {
              max-width: 820px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
      .mianBtn {
        width: 200px;
        min-width: 200px;
        margin-top: 25px;
      }
    }
  }
}
</style>
