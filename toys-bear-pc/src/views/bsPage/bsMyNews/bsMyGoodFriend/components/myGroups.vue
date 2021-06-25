<template>
  <!-- 常联系人 -->
  <div class="myGroups">
    <div class="myGroups_top">
      <div class="contacts_top_title">
        我的群组
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
    <div class="myGroups_content">
      <el-scrollbar style="height: 620px;">
        <ul class="content_box">
          <li
            class="content_item"
            @click="toGroupNews(item)"
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
            </div>
            <div class="item_right">
              <p class="item_right_name">{{ item.linkName }}</p>
              <p class="item_right_company">{{ item.groupUserCount }}人</p>
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
export default {
  props: ["dataOption"],
  data() {
    return {
      keyword: null,
      currentPage: 1,
      pageSize: 20,
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
      this.getMyFriendList();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getMyFriendList();
    },
    // 去群聊
    toGroupNews(item) {
      const fd = {
        name: item.groupNumber + item.id,
        linkUrl: "/bsIndex/bsNews",
        component: "bsNews",
        refresh: true,
        label: item.linkName || item.groupNumber,
        value: {
          targetId: item.groupNumber,
          type: 3
        }
      };
      this.$store.commit("myAddTab", fd);
    },
    // 查询好友通讯录
    searchFriends() {
      this.currentPage = 1;
      this.getMyFriendList();
    },
    // 获取好友通讯录
    async getMyFriendList() {
      const res = await this.$http.post("/api/GetMyGroupMessagePage", {
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
    this.getMyFriendList();
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.myGroups {
  width: 80%;
  background-color: #fff;
  .myGroups_top {
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
  .myGroups_content {
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
          .el-image {
            transition: all 1s;
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
