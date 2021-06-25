<template>
  <div class="removeGroupPerson">
    <el-scrollbar style="height: 520px;">
      <li class="content_item" v-for="item in groupList" :key="item.chatUserId">
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
          <p class="item_right_name">{{ item.linkman }}</p>
          <p class="item_right_company">{{ item.companyName }}</p>
        </div>
        <div class="item_right_btn">
          <el-button
            type="danger"
            plain
            size="mini"
            @click="removePerson(item)"
          >
            移除
          </el-button>
        </div>
      </li>
    </el-scrollbar>
    <center class="btns">
      <el-button type="primary" round @click="$emit('close')">完 成</el-button>
    </center>
  </div>
</template>

<script>
export default {
  props: ["groupList", "groupNumber"],
  data() {
    return {};
  },
  methods: {
    // 移除群成员
    async removePerson(item) {
      const res = await this.$im_http.post("/api/ChatGroup/Quit", {
        groupNumber: this.groupNumber,
        quitType: 2,
        chatUserIds: [item.chatUserId]
      });
      console.log(res);
      if (res.data.result.code === 200) {
        this.$emit("resetGroupList");
        this.$common.handlerMsgState({
          msg: "移除成功",
          type: "success"
        });
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less">
.removeGroupPerson {
  height: 580px;
  .content_item {
    width: 100%;
    height: 81px;
    opacity: 1;
    background: #ffffff;
    border-radius: 5px;
    // margin-right: 20px;
    // margin-bottom: 20px;
    box-sizing: border-box;
    padding: 15px 20px;
    display: flex;
    &:hover {
      background-color: #eff6ff;
    }
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
  .btns {
    height: 60px;
    padding-top: 20px;
    box-sizing: border-box;
    .el-button {
      width: 200px;
    }
  }
}
</style>
