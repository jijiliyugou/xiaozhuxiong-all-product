<template>
  <div class="bsExhibitionHallHomeComponent">
    <div class="topLauot">
      <div class="left">
        <el-image
          style=" width: 100px;height: 100px;"
          fit="contain"
          :src="companyInfo.companyLogo"
          :preview-src-list="[companyInfo.companyLogo]"
        >
          <div slot="placeholder" class="image-slot">
            <img
              style=" width: 100px;height: 100px;object-fit:contain;"
              :src="require('@/assets/images/imgError.png')"
            />
          </div>
          <div slot="error" class="image-slot">
            <img
              style=" width: 100px;height: 100px;object-fit:contain;"
              :src="require('@/assets/images/imgError.png')"
            />
          </div>
        </el-image>
        <div class="context">
          <div class="companyName">{{ companyInfo.companyName }}</div>
          <div class="infos">
            <p class="infoItem">
              联系人：<span>{{ companyInfo.contactsMan }}</span>
            </p>
            <p class="infoItem">
              电话：<span>{{ companyInfo.telephoneNumber }}</span>
            </p>
            <p class="infoItem">
              手机：<span>{{ companyInfo.phoneNumber }}</span>
            </p>
            <p class="infoItem newIconBox" @click="toNews">
              <i class="newIcon"></i><span>在线咨询</span>
            </p>
          </div>
          <div class="address">
            地址：<span>{{ companyInfo.address }}</span>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="totalItem four">
          <p class="totalValue">{{ statisticsCount.hallTotalCount }}</p>
          <p class="totalTitle">择样统计</p>
        </div>
        <div class="totalItem three">
          <p class="totalValue">{{ statisticsCount.clientTotalCount }}</p>
          <p class="totalTitle">客户总数</p>
        </div>
        <div class="totalItem two">
          <p class="totalValue">{{ statisticsCount.firmTotalCount }}</p>
          <p class="totalTitle">厂商统计</p>
        </div>
        <div class="totalItem one">
          <p class="totalValue">{{ statisticsCount.productTotalCount }}</p>
          <p class="totalTitle">产品总数</p>
        </div>
      </div>
    </div>
    <div class="contentWrap">
      <div class="contentTitle">
        <p
          @click="changActiveName(1)"
          :class="{ titleText: true, active: activeName == 1 }"
        >
          入驻厂商 <span>({{ factoryTotalCount }})</span>
        </p>
        <p
          @click="changActiveName(2)"
          :class="{ titleText: true, active: activeName == 2 }"
        >
          展厅产品 <span>({{ statisticsCount.productTotalCount }})</span>
        </p>
      </div>
      <div class="manufactor" v-show="activeName == 1">
        <div class="searchBox">
          厂商搜索
          <el-input
            placeholder="请输入关键词"
            size="medium"
            v-model="factoryKeyword"
            @keyup.native.enter="getCompanyByHallPage"
            clearable
          >
          </el-input>
          <el-button
            size="medium"
            @click="getCompanyByHallPage"
            type="primary"
            icon="el-icon-search"
            >搜索</el-button
          >
        </div>
        <div class="factoryList">
          <div
            class="itemBox"
            v-for="(item, i) in factoryList"
            :key="i"
            @click="toFactory(item)"
          >
            <div class="imgBox">
              <el-image
                fit="contain"
                style="width: 70px; height: 70px;border-radius:50%;"
                :src="item.companyLogo"
                lazy
              >
                <div slot="placeholder" class="errorImg">
                  <img
                    style="width: 70px; height: 70px"
                    src="~@/assets/images/imgError.png"
                    alt
                  />
                </div>
                <div slot="error" class="errorImg">
                  <img
                    style="width: 70px; height: 70px"
                    src="~@/assets/images/imgError.png"
                    alt
                  />
                </div>
              </el-image>
            </div>
            <p class="name">{{ item.companyName }}</p>
          </div>
        </div>
        <!-- 分页 -->
        <center style="padding:20px 0;">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[16, 32, 64, 128]"
            background
            :total="factoryTotalCount"
            :page-size="pageSize"
            :current-page.sync="currentPage"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          ></el-pagination>
        </center>
      </div>
      <div class="products" v-show="activeName == 2">
        <div class="searchBox">
          产品搜索<el-input
            placeholder="请输入关键词"
            size="medium"
            v-model="productKeyword"
            @keyup.native.enter="toSearch"
            clearable
          >
          </el-input>
          <el-button
            size="medium"
            @click="toSearch"
            type="primary"
            icon="el-icon-search"
            >搜索</el-button
          >
        </div>
        <div class="productList">
          <div
            class="itemProduct"
            v-for="(item, i) in cateList"
            :key="i"
            @click="toSearchProduct(item)"
          >
            <span class="text">{{ item.categoryName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["item"],
  data() {
    return {
      activeName: 1,
      cateList: [],
      cateTotalCount: 0,
      currentPage: 1,
      pageSize: 32,
      factoryList: [],
      factoryTotalCount: 0,
      factoryKeyword: "",
      productKeyword: "",
      companyInfo: {},
      statisticsCount: {}
    };
  },
  methods: {
    // 去聊天
    toNews() {
      const fd = {
        name: this.companyInfo.companyNumber + "bsNews",
        linkUrl: "/bsIndex/bsNews",
        component: "bsNews",
        refresh: true,
        label: this.companyInfo.companyName,
        value: this.companyInfo
      };
      this.$store.commit("myAddTab", fd);
    },
    // 切换
    changActiveName(number) {
      this.activeName = number;
    },
    // 不带分类去查产品
    toSearch() {
      // const flag = this.tabList.find(
      //   val => val.name === "/bsIndex/bsProductSearchIndex"
      // );
      // console.log(flag);
      const fd = {
        name: "/bsIndex/bsProductSearchIndex",
        linkUrl: "/bsIndex/bsProductSearchIndex",
        component: "bsProductSearchIndex",
        refresh: true,
        label: "产品查询"
      };
      // flag || this.$router.push(fd.linkUrl);
      this.$store.commit("updateActiveTab", fd);
      const option = {
        companyInfo: this.companyInfo,
        keyword: this.productKeyword,
        cate: null,
        cateList: this.cateList
      };
      this.$store.commit("handlerimgSearch", false);
      this.$store.commit("handlerHallSearchCate", option);
    },
    // 带分类去查产品
    toSearchProduct(row) {
      // const flag = this.tabList.find(
      //   val => val.name === "/bsIndex/bsProductSearchIndex"
      // );
      // console.log(flag);
      const fd = {
        name: "/bsIndex/bsProductSearchIndex",
        linkUrl: "/bsIndex/bsProductSearchIndex",
        component: "bsProductSearchIndex",
        refresh: true,
        label: "产品查询"
      };
      // flag || this.$router.push(fd.linkUrl);
      this.$store.commit("updateActiveTab", fd);
      const option = {
        companyInfo: this.companyInfo,
        keyword: this.productKeyword,
        cate: row,
        cateList: this.cateList
      };
      this.$store.commit("handlerHallSearchCate", option);
    },
    // 去厂商
    toFactory(item) {
      const fd = {
        name: item.companyNumber,
        linkUrl: "/bsIndex/bsVendorQuery",
        component: "bsMyClientsDetail",
        refresh: true,
        noPush: true,
        label: item.companyName,
        value: {
          companyNumber: item.companyNumber,
          companyLogo: item.companyLogo,
          companyName: item.companyName,
          contactsMan: item.contactsMan,
          phoneNumber: item.phoneNumber,
          address: item.address
        }
      };
      this.$router.push("/bsIndex/bsVendorQuery");
      this.$store.commit("myAddTab", fd);
    },
    // 获取展厅分类
    async getProductClassPage() {
      const res = await this.$http.post("/api/GetProductClassPage", {
        skipCount: 1,
        maxResultCount: 9999,
        hallNumber: this.item.companyNumber || this.item.content
      });
      if (res.data.result.code === 200) {
        this.cateList = res.data.result.item.items;
        this.cateTotalCount = res.data.result.item.totalCount;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 获取入驻厂商
    async getCompanyByHallPage() {
      const res = await this.$http.post("/api/GetCompanyByHallPage", {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        hallNumber: this.item.companyNumber || this.item.content,
        companyName: this.factoryKeyword
      });
      if (res.data.result.code === 200) {
        this.factoryList = res.data.result.item.items;
        this.factoryTotalCount = res.data.result.item.totalCount;
        console.log(res.data.result.item);
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.factoryTotalCount &&
        this.currentPage != 1
      )
        return false;
      this.getCompanyByHallPage();
    },
    // 修改当前页
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getCompanyByHallPage();
    },
    // 获取统计数据
    async getHallStatisticsCount() {
      const res = await this.$http.post("/api/GetHallStatisticsCount", {
        hallNumber: this.item.companyNumber || this.item.content
      });
      if (res.data.result.code === 200) {
        this.statisticsCount = res.data.result.item;
        console.log(res.data.result.item);
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
      await this.getProductClassPage();
      await this.getCompanyByHallPage();
    },
    // 获取展厅资料
    async getCompanyByID() {
      const res = await this.$http.post("/api/CompanyByID", {
        companyNumber: this.item.companyNumber || this.item.content
      });
      if (res.data.result.code === 200) {
        this.companyInfo = res.data.result.item;
        console.log(res.data.result.item);
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
      this.getHallStatisticsCount();
    }
  },
  computed: {
    ...mapState(["tabList"])
  },
  created() {},
  mounted() {
    this.getCompanyByID();
    console.log(this.item);
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsExhibitionHallHomeComponent {
  .topLauot {
    background-color: #fff;
    display: flex;
    border-radius: 4px;
    .left {
      display: flex;
      flex: 1;
    }
    .left,
    .right {
      // display: flex;
      .el-image {
        margin: 30px;
      }
      .context {
        flex: 1;
        height: 100px;
        margin-top: 30px;
        .companyName {
          font-size: 24px;
        }
        .infos {
          margin-top: 13px;
          display: flex;
          align-items: center;
          .infoItem {
            display: flex;
            align-items: center;
            margin-right: 48px;
            &:last-of-type {
              margin-right: 0;
            }
            &.newIconBox {
              cursor: pointer;
            }
            .newIcon {
              display: block;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: url("~@/assets/images/onlineInfoIcon.png") center
                no-repeat;
              background-size: contain;
              margin-right: 10px;
            }
          }
        }
        .address {
          margin-top: 13px;
        }
      }
      .totalItem {
        margin-right: 20px;
        margin-top: 30px;
        width: 161px;
        height: 100px;
        background: #ebf3ff;
        border-radius: 4px;
        float: right;
        .totalValue {
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          color: #666666;
          margin-top: 23px;
        }
        .totalTitle {
          font-weight: 400;
          text-align: center;
          color: #999999;
          margin-top: 10px;
        }
        &.one {
          background: #ebf3ff;
        }
        &.two {
          background: #ffede6;
        }
        &.three {
          background: #e3f9ed;
        }
        &.one {
          background: #f0ecff;
        }
      }
    }
  }
  .contentWrap {
    margin-top: 20px;
    background-color: #fff;
    border-radius: 4px;
    .contentTitle {
      height: 56px;
      display: flex;
      .titleText {
        cursor: pointer;
        margin: 0 30px;
        line-height: 53px;
        border-bottom: 3px solid transparent;
        font-weight: 400;
        font-size: 15px;
        &.active {
          border-color: #3368a9;
          color: #3368a9;
          font-weight: 700;
          span {
            font-weight: 400;
          }
        }
      }
    }
    .manufactor,
    .products {
      box-sizing: border-box;
      padding: 20px;
      padding-right: 0;
      .searchBox {
        height: 36px;
        display: flex;
        align-items: center;
        .el-input {
          width: 340px;
          margin: 0 16px;
        }
      }
      .productList {
        &::after {
          content: "";
          display: block;
          width: 0px;
          height: 0px;
          clear: both;
        }
        .itemProduct {
          width: 161px;
          height: 80px;
          line-height: 80px;
          border-radius: 4px;
          text-align: center;
          margin-top: 20px;
          margin-right: 20px;
          float: left;
          cursor: pointer;
          overflow: hidden;
          white-space: nowrap; /*不换行*/
          text-overflow: ellipsis; /*超出部分文字以...显示*/
          .text {
            position: relative;
            &::after {
              width: 20px;
              height: 3px;
              content: "";
              position: absolute;
              margin-left: -10px;
              left: 50%;
              bottom: -10px;
            }
          }
          &:nth-child(4n + 1) {
            background-color: #f5f9ff;
            .text {
              &::after {
                background-color: #749cfc;
              }
            }
          }
          &:nth-child(4n + 2) {
            background-color: #fff6f2;
            .text {
              &::after {
                background-color: #f9bc6c;
              }
            }
          }
          &:nth-child(4n + 3) {
            background-color: #f1fcf6;
            .text {
              &::after {
                background-color: #fa7c7d;
              }
            }
          }
          &:nth-child(4n + 4) {
            background-color: #f7f5ff;
            .text {
              &::after {
                background-color: #72dbdf;
              }
            }
          }
        }
      }
      .factoryList {
        &::after {
          content: "";
          display: block;
          width: 0px;
          height: 0px;
          clear: both;
        }
        .itemBox {
          float: left;
          cursor: pointer;
          margin-right: 20px;
          width: 181px;
          height: 146px;
          opacity: 1;
          background: #ffffff;
          border: 1px solid #dcdfe6;
          border-radius: 5px;
          margin-top: 20px;
          .imgBox {
            margin-top: 20px;
            text-align: center;
          }
          .name {
            margin-top: 15px;
            font-size: 15px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
