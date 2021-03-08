<template>
  <div>
    <li class="myBox">
      <div class="CompanyTop"></div>
      <div class="CompanyBottom"></div>
      <div class="detailBox" v-if="CompanyDetail">
        <div class="CompanyDetail">
          <div class="CompanyName">
            <div class="text">
              <p>
                {{ CompanyDetail.orgCompany.companyName }}
              </p>
            </div>
            <div class="img">
              <el-image
                class="myAvatar"
                :src="CompanyDetail.orgCompany.companyLogo"
                fit="cover"
              >
                <div
                  slot="error"
                  class="image-slot"
                  style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space: nowrap;"
                >
                  {{ CompanyDetail.orgCompany.companyName }}
                </div>
              </el-image>
            </div>
          </div>

          <div class="evaluation" v-if="CompanyDetail.isMain">
            <p class="evaluationTitle">自身评价</p>
            <div class="tags">
              <el-button
                size="small"
                round
                icon="el-icon-edit"
                @click="dialogAddTag = true"
                >填写标签</el-button
              >
              <el-tag
                class="deleteTag"
                :type="tagsType[i]"
                v-for="(item, i) in CompanyDetail.companyLabel"
                :key="i"
                >{{ item.labelName }}</el-tag
              >
            </div>
          </div>
          <template v-else>
            <div class="evaluation">
              <p class="evaluationTitle">自身评价</p>
              <div class="tags">
                <template v-if="CompanyDetail.companyLabel">
                  <template v-for="(item, i) in CompanyDetail.companyLabel">
                    <el-tag
                      v-if="!item.isCompany"
                      :type="tagsType[i]"
                      :key="i"
                      >{{ item.labelName }}</el-tag
                    >
                  </template>
                </template>
              </div>
            </div>
            <div class="evaluation">
              <p class="evaluationTitle">我的评价</p>
              <div class="tags">
                <el-button
                  size="small"
                  round
                  icon="el-icon-edit"
                  @click="dialogAddTag = true"
                  >填写标签</el-button
                >
                <template v-if="CompanyDetail.companyLabel">
                  <template v-for="(item, i) in CompanyDetail.companyLabel">
                    <el-tag
                      v-if="item.isCompany"
                      :type="tagsType[i]"
                      :key="i"
                      >{{ item.labelName }}</el-tag
                    >
                  </template>
                </template>
              </div>
            </div>
          </template>
        </div>
        <div class="ContactInformation">
          <div class="ContactItem">
            <div class="title">电话</div>
            <div class="text">
              <span
                v-if="
                  CompanyDetail.orgCompany &&
                    CompanyDetail.orgCompany.phoneNumber
                "
                >{{ CompanyDetail.orgCompany.phoneNumber }}</span
              >
            </div>
          </div>
          <div class="ContactItem">
            <div class="title">邮箱</div>
            <div class="text">
              <template
                v-if="
                  CompanyDetail.orgCompany && CompanyDetail.orgCompany.e_mail
                "
                >{{ CompanyDetail.orgCompany.e_mail }}</template
              >
            </div>
          </div>
          <div class="ContactItem">
            <div class="title">地址</div>
            <div class="text">
              <template
                v-if="
                  CompanyDetail.orgCompany && CompanyDetail.orgCompany.address
                "
              >
                <div
                  class="address el-icon-location-information"
                  @click="openMap(CompanyDetail.orgCompany)"
                >
                  {{ CompanyDetail.orgCompany.address }}
                </div>
              </template>
            </div>
          </div>
          <center class="send">
            <el-button class="sendInfo" @click="companySend" round>
              <i class="el-icon-s-comment el-icon--left sendIcon"></i>
              立即沟通
            </el-button>
          </center>
        </div>
      </div>
    </li>
    <!-- 打标签 -->
    <el-dialog
      title="新增标签"
      :visible.sync="dialogAddTag"
      destroy-on-close
      width="400px"
    >
      <el-form label-position="left" label-width="80px">
        <el-form-item label="标签内容">
          <el-input
            v-model="tagValue"
            autocomplete="off"
            :maxlength="
              globalJson.Json.CompanyRestrictions &&
                globalJson.Json.CompanyRestrictions[0].itemCode
            "
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddTag = false">取 消</el-button>
        <el-button type="primary" @click="addTag">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 评论 -->
    <el-dialog :title="pinglunTitle" :visible.sync="dialogPinglun" width="30%">
      <el-form label-position="left" label-width="80px">
        <el-form-item label="评论内容">
          <el-input v-model="pinglunValue" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPinglun = false">取 消</el-button>
        <el-button type="primary" @click="addComment">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 公司地址定位地图 -->
    <el-dialog
      title="定位"
      :visible.sync="companyAddrMapDialog"
      v-if="companyAddrMapDialog"
      destroy-on-close
      width="50%"
    >
      <div class="companyAddrMapBox" v-if="companyAddr">
        <BMapComponent :addr="companyAddr"></BMapComponent>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BMapComponent from "@/components/map.vue";
export default {
  components: {
    BMapComponent
  },
  props: ["options"],
  data() {
    return {
      tagsType: [
        "",
        "success",
        "warning",
        "danger",
        "info",
        "",
        "success",
        "warning",
        "danger",
        "info"
      ],
      pinglunValue: "",
      dialogPinglun: false,
      pinglunTitle: "",
      dialogAddTag: false,
      CompanyDetail: undefined,
      CompanyList: [],
      totalCount: 0,
      skipCount: 1,
      maxResultCount: 10,
      showCollection: {
        type: null,
        active1: null,
        infoItem: null,
        active: null
      },
      companyAddr: "",
      companyAddrMapDialog: false,
      tagValue: ""
    };
  },
  methods: {
    // 点击公司地址打开定位
    openMap(addr) {
      this.companyAddr = addr;
      this.companyAddrMapDialog = true;
    },
    // 立即沟通
    companySend() {
      const options = {
        componentName: "personalChatComponent",
        isGroup: true,
        linkName: this.CompanyDetail.orgCompany.companyName,
        userImage: this.CompanyDetail.orgCompany.companyLogo,
        companyID: this.CompanyDetail.orgCompany.id,
        groupNumber: this.CompanyDetail.groupNumber
      };
      this.$emit("openTwoView", options);
    },
    // 获取公司详情
    async getCompanyDetails() {
      const res = await this.$http.post("/api/OrgCompanyLableListByID", {
        CompanyId: this.options.companyId
      });
      if (res.data.result.code === 200)
        this.CompanyDetail = res.data.result.item;
      else this.$message.error(res.data.result.msg);
    },
    // 添加标签
    async addTag() {
      const res = await this.$http.post("/api/CreateCompanyLabel", {
        companyID: this.CompanyDetail.orgCompany.id,
        companyName: this.CompanyDetail.orgCompany.companyName,
        labelName: this.tagValue,
        isCompany: true,
        companyCode: this.CompanyDetail.orgCompany.companyNumber
      });
      if (res.data.result.code === 200) {
        this.getCompanyDetails();
        this.$message.success("添加标签成功");
      }
      this.dialogAddTag = false;
    },
    // 评论
    async addComment() {
      let data;
      if (this.pinglunTitle === "回复评论") {
        data = {
          noticeNumber: this.huifuPinglun.noticeNumber,
          interactionType: "Reply",
          userName: this.userInfo.userInfo.linkman,
          comment: this.pinglunValue,
          replyCompanyID: this.replyToUserName
            ? this.huifuPinglun.replyCompanyID
            : this.huifuPinglun.companyID,
          replyToUser: this.replyToUserName
            ? this.huifuPinglun.replyToUser
            : this.huifuPinglun.createdBy,
          replyToUserName: this.replyToUserName || this.huifuPinglun.userName
        };
      } else {
        data = {
          noticeNumber: this.pinglunForm.bearNotice.noticeNumber,
          companyID: this.userInfo.userInfo.id,
          userName: this.userInfo.userInfo.linkman,
          interactionType: "Comment",
          comment: this.pinglunValue
        };
      }
      const res = await this.$http.post("/api/CreateNoticeInteraction", data);
      if (res.data.result.code === 200) {
        this.skipCount = 1;
        this.maxResultCount =
          this.dataList.length >= 100 ? 10 : this.dataList.length;
        this.getDataList();
        // 重新调用子路由查看公告
        this.$root.eventHub.$emit("UpdateFind");
        this.dialogPinglun = false;
        this.$message.success("评论成功");
      }
      this.pinglunValue = "";
      this.pinglunTitle = "";
    }
  },
  created() {
    this.getCompanyDetails();
  },
  mounted() {},
  computed: {
    ...mapState(["globalJson"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.myBox {
  width: 100%;
  background-color: #fff;
  // height: 827px;
  box-sizing: border-box;
  display: flex;
  position: relative;
  flex-direction: column;
  // 公司详情页样式
  .CompanyTop {
    background: url("~@/assets/images/bg.png") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 200px;
  }
  .CompanyBottom {
    width: 100%;
    height: 625px;
    background-color: #eeeeed;
  }
  .detailBox {
    position: absolute;
    width: 100%;
    height: 825px;
    left: 0;
    top: 0;
    overflow: auto;
    .CompanyDetail {
      margin: 100px auto 20px auto;
      width: 95%;
      background-color: #fff;
      border-radius: 10px;
      padding: 30px 10px 0 10px;
      box-sizing: border-box;
      .CompanyName {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .img {
          @{deep} .el-image {
            width: 80px;
            height: 80px;
            background-color: #165af7;
            color: #fff;
            border-radius: 50%;
          }
        }
      }
      .evaluation {
        font-size: 14px;
        margin-top: 5px;
        padding-bottom: 20px;
        .evaluationTitle {
          color: #89898a;
        }
        .tags {
          margin-top: 10px;
          width: 100%;
          .el-tag {
            margin: 5px;
            border-radius: 20px;
          }
        }
      }
    }
    .ContactInformation {
      width: 95%;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 10px;
      padding: 30px 10px 20px 10px;
      box-sizing: border-box;
      .ContactItem {
        .title {
          color: #8d8d8e;
          font-size: 14px;
          padding-top: 5px;
        }
        .text {
          padding: 10px 0;
          border-bottom: 1px solid #8d8d8e;
          width: 100%;
          .address {
            width: 100%;
            cursor: pointer;
            &:hover {
              color: #165af7;
            }
          }
        }
      }
      center {
        margin-top: 20px;
        .sendInfo {
          background-color: #165af7;
          color: #fff;
          width: 250px;
          .sendIcon {
            font-size: 16px;
            vertical-align: middle;
          }
        }
      }
    }
  }
}
.companyAddrMapBox {
  height: 500px;
}
</style>
