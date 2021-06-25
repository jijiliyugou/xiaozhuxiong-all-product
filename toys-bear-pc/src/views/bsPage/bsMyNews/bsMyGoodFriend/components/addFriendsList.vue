<template>
  <!-- 常联系人 -->
  <div class="myFriends">
    <div class="myFriends_top">
      <div class="contacts_top_title">
        添加好友
      </div>
    </div>
    <div class="myFriends_searchBox">
      <span style="font-size: 15px;">查找用户</span>
      <el-input
        style="width:307px;margin: 0 15px;"
        size="medium"
        v-model="keyword"
        placeholder="请输入关键词"
        @keyup.native.enter="searchFriends"
        clearable
      >
      </el-input>
      <el-button size="medium" @click="searchFriends" type="primary">
        搜索
      </el-button>
    </div>
    <div class="myFriends_content">
      <el-scrollbar style="height: 100%;">
        <ul class="content_box" v-if="totalCount > 0">
          <li
            class="content_item"
            v-for="item in friendList"
            :key="item.id + item.companyId"
          >
            <div class="item_left">
              <el-image
                class="header-img"
                style="width: 50px;height: 50px;border-radius: 50%;position:static;"
                :src="item.userImage"
                :preview-src-list="[item.userImage]"
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
            </div>
            <div class="item_right">
              <p class="item_right_name">{{ item.linkman }}</p>
              <p class="item_right_company">{{ item.companyName }}</p>
            </div>
            <div class="item_right_btn">
              <el-button type="primary" size="mini" @click="openAdd(item)">
                添加
              </el-button>
            </div>
          </li>
        </ul>
        <center v-else style="color: #999;padding: 20px;box-sizing:border-box;">
          请输入完成电话或用户名查找用户
        </center>
      </el-scrollbar>
    </div>
    <el-dialog
      title="申请理由"
      :visible.sync="applyDialog"
      v-if="applyDialog"
      width="400px"
    >
      <reasonsForApplication
        @submitAddFriend="subAdd"
        @closeAddFriend="closeAddFriend"
      />
    </el-dialog>
  </div>
</template>

<script>
import reasonsForApplication from "@/components/commonComponent/reasonsForApplication/reasonsForApplication.vue";
import { mapState } from "vuex";
export default {
  props: ["dataOption"],
  components: {
    reasonsForApplication
  },
  data() {
    return {
      applyDialog: false,
      keyword: null,
      currentPage: 1,
      pageSize: 28,
      totalCount: 0,
      friendList: [],
      currentPerson: null
    };
  },
  methods: {
    // 关闭添加好友
    closeAddFriend() {
      this.applyDialog = false;
    },
    // 提交添加好友
    async subAdd(text) {
      console.log(text, this.userData);
      const res = await this.$im_http.post("/api/AddressBook/Apply", {
        senderCompanyId: this.userInfo.commparnyList[0].commparnyId,
        senderPersonnelId: this.userInfo.userInfo.id,
        content: text,
        remark: "",
        recipientCompanyId: this.currentPerson.companyId,
        recipientPersonnelId: this.currentPerson.id,
        source: "账号搜索"
      });
      if (res.data.result.code === 200) {
        this.$common.handlerMsgState({
          msg: "发送好友验证",
          type: "success"
        });
        this.applyDialog = false;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
      this.applyDialog = false;
    },
    // 打开添加好友
    openAdd(item) {
      this.currentPerson = item;
      this.applyDialog = true;
    },
    // 查询好友通讯录
    searchFriends() {
      this.currentPage = 1;
      this.getMyFriendList();
    },
    // 获取查找用户列表
    async getMyFriendList() {
      const res = await this.$http.post("/api/GetUserByPhoneOrNamePage", {
        maxResultCount: this.pageSize,
        skipCount: this.currentPage,
        keyword: this.keyword
      });
      if (res.data.result.code === 200) {
        console.log(res.data.result.item);
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
    this.getMyFriendList();
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.myFriends {
  width: 80%;
  background-color: #fff;
  .myFriends_top {
    height: 54px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dcdfe6;
    box-sizing: border-box;
    padding: 0 20px;
    .contacts_top_title {
      font-weight: 700;
      font-size: 15px;
    }
  }
  .myFriends_searchBox {
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #dcdfe6;
  }
  .myFriends_content {
    height: 638px;
    box-sizing: border-box;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
    .content_box {
      // display: flex;
      // flex-wrap: wrap;
      .content_item {
        width: 100%;
        height: 81px;
        opacity: 1;
        background: #ffffff;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        margin-right: 20px;
        margin-bottom: 20px;
        box-sizing: border-box;
        padding: 15px 20px;
        display: flex;
        .item_left {
          width: 50px;
          min-width: 50px;
          height: 50px;
          .el-image {
            transition: all 1s;
            cursor: pointer;
          }
        }
        .item_right {
          flex: 1;
          box-sizing: border-box;
          padding-left: 15px;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
          .item_right_name {
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
          .item_right_company {
            margin-top: 10px;
            color: #999;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
        }
        .item_right_btn {
          width: 80px;
          min-width: 80px;
          display: flex;
          align-items: center;
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
