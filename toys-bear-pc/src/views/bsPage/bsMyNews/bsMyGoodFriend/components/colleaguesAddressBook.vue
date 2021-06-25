<template>
  <!-- 常联系人 -->
  <div class="colleaguesAddressBook">
    <div class="colleaguesAddressBook_top">
      <div class="contacts_top_title">
        同事通讯录
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
    <div class="colleaguesAddressBook_content">
      <el-scrollbar style="height: 100%;">
        <ul class="content_box" v-if="totalCount > 0">
          <li
            class="content_item"
            @click.stop="examineBusiness(item)"
            v-for="item in friendList"
            :key="item.id"
          >
            <div class="item_left">
              <el-image
                class="header-img"
                style="width: 50px;height: 50px;border-radius: 50%;position:static;"
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
            <div class="item_right">
              <p class="item_right_name">{{ item.linkman }}</p>
              <p class="item_right_company">{{ companyInfo.companyName }}</p>
            </div>
          </li>
        </ul>
        <center v-else>
          暂无好友
        </center>
      </el-scrollbar>
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
      pageSize: 28,
      totalCount: 0,
      friendList: [],
      companyInfo: {}
    };
  },
  methods: {
    // 删除好友成功
    successDeleteFriend() {
      this.dialogBusiness = null;
      // this.$emit("resetReadTotal");
    },
    // 点击头像
    async examineBusiness(item) {
      this.dialogBusiness = null;
      this.$nextTick(() => {
        this.userIdData = {
          companyId: this.companyInfo.id,
          id: item.id
        };
        this.dialogBusiness = item.id;
      });
    },
    // 查询好友通讯录
    searchFriends() {
      this.currentPage = 1;
      this.getMyFriendList();
    },
    // 获取好友通讯录
    async getMyFriendList() {
      const res = await this.$http.post("/api/OrgList", {
        keyword: this.keyword
      });
      if (res.data.result.code === 200) {
        this.friendList = res.data.result.item.personnes || [];
        this.companyInfo = res.data.result.item.orgCompany;
        this.totalCount = res.data.result.item.personnes
          ? res.data.result.item.personnes.length
          : 0;
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
    // 名片弹框关闭
    eventBus.$on("handleDialogColleaguesAddressBookBusiness", () => {
      this.dialogBusiness = null;
    });
  },
  beforeDestroy() {
    eventBus.$off("handleDialogColleaguesAddressBookBusiness");
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.colleaguesAddressBook {
  width: 80%;
  background-color: #fff;
  .colleaguesAddressBook_top {
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
  .colleaguesAddressBook_content {
    height: 715px;
    box-sizing: border-box;
    padding-left: 20px;
    padding-top: 20px;
    .content_box {
      display: flex;
      flex-wrap: wrap;
      .content_item {
        width: 305px;
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
        cursor: pointer;
        .item_left {
          width: 50px;
          min-width: 50px;
          height: 50px;
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
        .item_right {
          flex: 1;
          box-sizing: border-box;
          padding-left: 15px;
          overflow: hidden; /*超出部分隐藏*/
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
          .item_right_name {
            margin-top: 5px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
          .item_right_company {
            margin-top: 5px;
            color: #999;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
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
