<template>
  <div class="bsNewsSystemMsg">
    <div class="head">
      <div class="headName">
        <p>全部（{{ totalCount }}）</p>
      </div>
    </div>
    <div class="main">
      <ul>
        <li v-for="item in infoList" :key="item.id">
          <div class="tableHead">
            <p>{{ item.title }}</p>
            <div class="tableHeadIcon" @click="removeInfo(item)">
              <img src="@/assets/images/delete.png" alt="" />
            </div>
          </div>
          <div class="tablemian">
            <div
              style="flex: 1;overflow: hidden;white-space: nowrap; text-overflow: ellipsis;"
            >
              {{ item.content }}
              <p style="margin-top: 14px;">
                时间：
                <span>
                  {{ item.createdOn && item.createdOn.replace(/T/, " ") }}
                </span>
              </p>
            </div>
            <div class="mianBtn">
              <el-button
                size="medium"
                @click="openDetails(item)"
                style="color:#3368A9;border-color: #3368A9;"
                >查看详情</el-button
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
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
  name: "bsNewsSystemMsg",
  props: ["dataOption"],
  data() {
    return {
      showInfoDetails: false,
      detailsOption: {},
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      infoList: []
    };
  },
  methods: {
    // 删除消息
    removeInfo(item) {
      this.$confirm("确定要删除吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const res = await this.$http.post("/api/DeleteNotify", {
            messageNotifyId: item.id
          });
          if (res.data.result.code === 200) {
            this.$common.handlerMsgState({
              msg: "删除成功",
              type: "success"
            });
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        })
        .catch(() => {
          this.$common.handlerMsgState({
            msg: "取消删除",
            type: "warning"
          });
        });
    },
    // 打开消息详情
    openDetails(item) {
      this.detailsOption = item;
      this.showInfoDetails = true;
    },
    // 获取系统消息列表
    async getSystemList() {
      const res = await this.$im_http.post("/api/Message/NotifyList", {
        businessType: this.dataOption.businessType,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize
      });
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
.bsNewsSystemMsg {
  width: 80%;
  .head {
    height: 56px;
    background-color: #fff;
    padding-left: 20px;
    display: flex;
    border-radius: 4px;
    .headName {
      width: 100px;
      font-size: 15px;
      font-weight: Bold;
      color: #3368a9;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .main {
    ul li {
      height: 146px;
      background-color: #fff;
      margin-top: 20px;
      border-radius: 4px;
    }
    ul li .tableHead {
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;
      font-size: 16px;
      color: #333;
      font-weight: 700;
      border-bottom: 2px solid #dcdfe6;
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
    ul li .tablemian {
      color: #666;
      padding: 0 20px;
      display: flex;
      height: 96px;
      align-items: center;
      justify-content: space-between;
      p {
        p {
          color: #666666;
          font-size: 14px;
          line-height: 34px;
        }
      }
      .mianBtn {
        width: 100px;
        min-width: 100px;
        margin-left: 20px;
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
}
</style>
