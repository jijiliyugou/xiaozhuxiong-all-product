<template>
  <!-- 新的好友 -->
  <div class="newFriends">
    <!-- 头部 -->
    <div class="newFriends_top">
      <div class="contacts_top_title">
        新的好友
      </div>
      <div class="contacts_top_search">
        <el-input
          size="small"
          v-model="keyword"
          placeholder="请输入关键词"
          @keyup.native.enter="searchFriends"
          clearable
        >
          <el-button
            slot="append"
            @click="searchFriends"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </div>
    </div>
    <!-- 内容区 -->
    <div class="newFriends_content">
      <el-scrollbar style="height: 620px;">
        <ul class="content_box">
          <li class="content_item" v-for="item in friendList" :key="item.id">
            <div class="item_left">
              <el-image
                class="header-img"
                @click.native.stop="examineBusiness(item)"
                style="width: 50px;height: 50px;border-radius: 50%;position:static;cursor: pointer;"
                :src="item.userImage"
                fit="contain"
              >
                <div
                  slot="placeholder"
                  class="image-slot"
                  style="width: 50px;height: 50px;border-radius: 50%;"
                >
                  <img
                    style="width: 50px;height: 50px;border-radius: 50%;"
                    :src="require('@/assets/images/imgError.png')"
                  />
                </div>
                <div
                  slot="error"
                  class="image-slot"
                  style="width: 50px;height: 50px;border-radius: 50%;"
                >
                  <img
                    style="width: 50px;height: 50px;border-radius: 50%;"
                    :src="require('@/assets/images/imgError.png')"
                  />
                </div>
              </el-image>
              <div class="dialogBusiness" v-if="dialogBusiness == item.id">
                <businessComponent
                  :userIdData="userIdData"
                  @successDeleteFriend="successDeleteFriend"
                ></businessComponent>
              </div>
            </div>
            <div class="item_nameBox">
              <p class="item_nameBox_name">{{ item.userName }}</p>
              <p class="item_nameBox_company">{{ item.companyName }}</p>
            </div>
            <div class="item_remarkBox">
              <span class="item_remark_title">申请备注：</span>
              <span class="item_remarkBox_remark">{{ item.content }}</span>
            </div>
            <div class="item_dateTime">
              <span class="item_dateTime_title">申请时间：</span>
              <span class="item_dateTime_remark">{{
                item.createdOn && item.createdOn.replace(/T/, " ")
              }}</span>
            </div>
            <div class="item_btn">
              <el-button
                type="success"
                @click="acceptEvent(item)"
                size="mini"
                v-if="item.state != 2"
              >
                接受
              </el-button>
              <el-button size="mini" disabled v-if="item.state == 2">
                已接受
              </el-button>
            </div>
          </li>
        </ul>
      </el-scrollbar>
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
  </div>
</template>

<script>
import eventBus from "@/assets/js/common/eventBus";
import businessComponent from "@/components/commonComponent/friendComponent/businessComponent.vue";
export default {
  props: ["dataOption"],
  components: {
    businessComponent
  },
  data() {
    return {
      userIdData: {},
      dialogBusiness: null,
      keyword: null,
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      friendList: []
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
      this.getNewFriendList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getNewFriendList();
    },
    // 删除好友成功
    successDeleteFriend() {
      this.dialogBusiness = null;
      // this.$emit("resetReadTotal");
    },
    // 点击头像
    async examineBusiness(item) {
      console.log(item);
      this.dialogBusiness = null;
      this.$nextTick(() => {
        this.userIdData = {
          companyId: item.senderCompanyId,
          id: item.senderPersonnelId
        };
        this.dialogBusiness = item.id;
      });
    },
    // 接受事件
    async acceptEvent(item) {
      console.log(item);
      const res = await this.$http.post("/api/CreateFriendAddressBook", {
        applyId: item.id
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "已同意",
          type: "success"
        });
        this.searchFriends();
        this.$emit("resetReadTotal");
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 查询好友通讯录
    searchFriends() {
      this.currentPage = 1;
      this.getNewFriendList();
    },
    // 获取新的好友列表
    async getNewFriendList() {
      const res = await this.$im_http.post("/api/AddressBook/ApplyList", {
        maxResultCount: this.pageSize,
        skipCount: this.currentPage,
        keyWord: this.keyword
      });
      if (res.data.result.code === 200) {
        this.friendList = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  },
  mounted() {
    this.getNewFriendList();
    // 名片弹框关闭
    eventBus.$on("handleDialogNewFriendsBusiness", () => {
      this.dialogBusiness = null;
    });
    // 刷新列表
    eventBus.$on("resetNewFriends", () => {
      this.currentPage = 1;
      this.getNewFriendList();
    });
  },
  beforeDestroy() {
    eventBus.$off("handleDialogNewFriendsBusiness");
    eventBus.$off("resetNewFriends");
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.newFriends {
  width: 80%;
  background-color: #fff;
  .newFriends_top {
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dcdfe6;
    box-sizing: border-box;
    padding: 0 20px;
    .contacts_top_title {
      font-weight: 700;
      font-size: 15px;
    }
    .contacts_top_search {
      width: 307px;
      height: 32px;
      background: #f1f3f6;
      border: 1px solid #dcdfe6;
      border-radius: 17px;
      overflow: hidden;
      @{deep} .el-input {
        background-color: #fff;
        input {
          border: none;
          border-radius: 17px;
        }
        .el-input-group__append {
          background-color: #fff;
          border: none;
          font-weight: 700;
          button {
            font-weight: 700;
            width: 50px;
            height: 32px;
          }
        }
      }
    }
  }
  .newFriends_content {
    height: 715px;
    box-sizing: border-box;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
    .content_box {
      width: 100%;
      .content_item {
        width: 100%;
        min-height: 80px;
        box-sizing: border-box;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        background: #ffffff;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        margin-bottom: 20px;
        .item_left {
          position: relative;
          .el-image {
            transition: all 1s;
          }
          .dialogBusiness {
            position: absolute;
            top: 60px;
            left: 0px;
            z-index: 99;
          }
        }
        .item_nameBox {
          margin-left: 15px;
          width: 280px;
          min-width: 280px;
          .item_nameBox_name,
          .item_nameBox_company {
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
          .item_nameBox_company {
            margin-top: 5px;
            color: #999;
          }
        }
        .item_remarkBox {
          margin-left: 20px;
          height: 100%;
          display: flex;
          align-items: center;
          width: 400px;
          min-width: 400px;
          .item_remark_title {
            color: #999;
            min-width: 70px;
          }
        }
        .item_dateTime {
          margin-left: 20px;
          height: 100%;
          display: flex;
          align-items: center;
          max-width: 400px;
          color: #999;
          .item_remark_title {
            min-width: 70px;
          }
        }
        .item_btn {
          flex: 1;
          display: flex;
          min-width: 200px;
          justify-content: flex-end;
        }
        &:hover {
          .item_left {
            .el-image {
              transform: scale(1.1);
            }
          }
        }
      }
    }
  }
}
</style>
