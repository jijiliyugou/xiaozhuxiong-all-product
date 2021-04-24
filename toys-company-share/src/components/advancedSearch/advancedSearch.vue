<template>
  <div class="wrapBox">
    <div class="editionCenter">
      <div class="showTip">
        <div class="topTitle">
          <div class="left">
            {{ advancedSearchLang.comprehensiveInquiry }}
          </div>
          <div class="right" @click="openAdvancedSearch">
            {{ advancedSearchLang.advancedQuery }}
            <span style="margin-left:10px;">
              <i class="el-icon-arrow-down" v-show="isShowAdvancedSearch"></i>
              <i class="el-icon-arrow-up" v-show="!isShowAdvancedSearch"></i>
            </span>
          </div>
        </div>
        <div class="bottomInput">
          <div class="inputItem">
            <div class="title">{{ advancedSearchLang.productName + "：" }}</div>
            <div class="myInput">
              <el-input
                :placeholder="advancedSearchLang.pleaseInputTheContent"
                v-model="searchForm.name"
                @keyup.enter.native="search"
                clearable
              >
              </el-input>
            </div>
            <div class="unit"></div>
          </div>
          <div class="inputItem">
            <div class="title">
              {{ advancedSearchLang.exFactoryArticleNo + "：" }}
            </div>
            <div class="myInput">
              <el-input
                @keyup.enter.native="search"
                :placeholder="advancedSearchLang.pleaseInputTheContent"
                v-model="searchForm.fa_no"
                clearable
              >
              </el-input>
            </div>
            <div class="unit"></div>
          </div>
          <div class="inputItem">
            <div class="title">
              {{ advancedSearchLang.packingMethod + "：" }}
            </div>
            <div class="myInput">
              <!-- <el-input
                @keyup.enter.native="search"
                :placeholder="advancedSearchLang.pleaseInputTheContent"
                v-model="searchForm.ch_pa"
                clearable
              >
              </el-input> -->
              <el-select
                v-model="searchForm.pa_nu"
                clearable
                filterable
                :placeholder="advancedSearchLang.pleaseSelect"
              >
                <el-option
                  v-for="item in globalLang === 'zh-CN'
                    ? packingList
                    : ePackingList"
                  :key="item.value"
                  :label="
                    globalLang === 'zh-CN'
                      ? item.packChMethods
                      : item.packEnMethods
                  "
                  :value="JSON.stringify(item)"
                >
                </el-option>
              </el-select>
            </div>
            <div class="unit"></div>
          </div>
          <div class="inputItem" v-show="isShowAdvancedSearch">
            <div class="searchBtn">
              <el-button type="warning" @click="search" icon="el-icon-search">{{
                homeLang.search
              }}</el-button>
            </div>
          </div>
        </div>
        <el-collapse-transition>
          <div class="consistencyWrapBox" v-show="!isShowAdvancedSearch">
            <div class="consistencyBox">
              <div class="left">
                <div class="itemInput">
                  <div class="title">
                    {{ advancedSearchLang.priceRange + "：" }}
                  </div>
                  <div class="myInput">
                    <el-input
                      :placeholder="advancedSearchLang.miniPrice"
                      @keyup.enter.native="search"
                      v-model="searchForm.minPrice"
                    >
                    </el-input>
                    <span class="middleLine">-</span>
                    <el-input
                      :placeholder="advancedSearchLang.maxPrice"
                      @keyup.enter.native="search"
                      v-model="searchForm.maxPrice"
                    >
                    </el-input>
                  </div>
                  <div class="unit"></div>
                </div>
                <div class="itemInput">
                  <div class="title">
                    {{ advancedSearchLang.packageSpecification + "：" }}
                  </div>
                  <div class="myInput">
                    <el-input
                      :placeholder="advancedSearchLang.long"
                      @keyup.enter.native="search"
                      v-model="searchForm.in_le"
                    >
                    </el-input>
                    <span class="middleLine">-</span>
                    <el-input
                      :placeholder="advancedSearchLang.width"
                      @keyup.enter.native="search"
                      v-model="searchForm.in_wi"
                    >
                    </el-input>
                    <span class="middleLine">-</span>
                    <el-input
                      :placeholder="advancedSearchLang.height"
                      @keyup.enter.native="search"
                      v-model="searchForm.in_hi"
                    >
                    </el-input>
                  </div>
                  <div class="unit">
                    CM
                  </div>
                </div>
              </div>
              <div class="middle">
                <div class="itemInput">
                  <div class="title">
                    {{ advancedSearchLang.productSpecification + "：" }}
                  </div>
                  <div class="myInput">
                    <el-input
                      :placeholder="advancedSearchLang.long"
                      @keyup.enter.native="search"
                      v-model="searchForm.pr_le"
                    >
                    </el-input>
                    <span class="middleLine">-</span>
                    <el-input
                      :placeholder="advancedSearchLang.width"
                      @keyup.enter.native="search"
                      v-model="searchForm.pr_wi"
                    >
                    </el-input>
                    <span class="middleLine">-</span>
                    <el-input
                      :placeholder="advancedSearchLang.height"
                      @keyup.enter.native="search"
                      v-model="searchForm.pr_hi"
                    >
                    </el-input>
                  </div>
                  <div class="unit">
                    CM
                  </div>
                </div>
                <!-- <div class="itemInput">
                  <div class="title">
                    {{ advancedSearchLang.exFactoryArticleNo + "：" }}
                  </div>
                  <div class="myInput">
                    <el-input
                      :placeholder="advancedSearchLang.pleaseSelect"
                      @keyup.enter.native="search"
                      v-model="searchForm.fa_no"
                    >
                    </el-input>
                  </div>
                  <div class="unit"></div>
                </div> -->
                <div class="itemInput">
                  <div class="title">
                    {{ advancedSearchLang.dateOfIssue + "：" }}
                  </div>
                  <div class="myInput">
                    <el-select
                      v-model="datetime"
                      @change="getDateList"
                      filterable
                    >
                      <el-option
                        v-for="(item, i) in dateList"
                        :key="i"
                        :label="
                          globalLang === 'zh-CN' ? item.label : item.eLabel
                        "
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div class="unit"></div>
                </div>
              </div>
              <div class="right">
                <div class="itemInput">
                  <div class="title">
                    {{ advancedSearchLang.specificationOfOuterBox + "：" }}
                  </div>
                  <div class="myInput">
                    <el-input
                      :placeholder="advancedSearchLang.long"
                      @keyup.enter.native="search"
                      v-model="searchForm.ou_le"
                    >
                    </el-input>
                    <span class="middleLine">-</span>
                    <el-input
                      :placeholder="advancedSearchLang.width"
                      @keyup.enter.native="search"
                      v-model="searchForm.ou_wi"
                    >
                    </el-input>
                    <span class="middleLine">-</span>
                    <el-input
                      :placeholder="advancedSearchLang.height"
                      @keyup.enter.native="search"
                      v-model="searchForm.ou_hi"
                    >
                    </el-input>
                  </div>
                  <div class="unit">
                    CM
                  </div>
                </div>
                <div class="itemInput" style="height:40px;alignItem: center;">
                  <div class="title">
                    {{ advancedSearchLang.picture + "：" }}
                  </div>
                  <div class="myInput">
                    <el-radio v-model="searchForm.isUpInsetImg" :label="true">{{
                      advancedSearchLang.yes
                    }}</el-radio>
                    <el-radio
                      v-model="searchForm.isUpInsetImg"
                      :label="false"
                      >{{ advancedSearchLang.no }}</el-radio
                    >
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="pictureBox">
              <div class="itemInput">
                <div class="title">{{ advancedSearchLang.picture + "：" }}</div>
                <div class="myInput">
                  <el-radio v-model="searchForm.isUpInsetImg" :label="true">{{
                    advancedSearchLang.yes
                  }}</el-radio>
                  <el-radio v-model="searchForm.isUpInsetImg" :label="false">{{
                    advancedSearchLang.no
                  }}</el-radio>
                </div>
              </div>
            </div> -->
            <div class="btns">
              <el-button @click="resetForm">
                {{ advancedSearchLang.reset }}
              </el-button>
              <el-button class="myBtn" icon="el-icon-search" @click="search">{{
                homeLang.search
              }}</el-button>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      packingList: [],
      ePackingList: [],
      datetime: null,
      dateList: [
        { label: "全部", eLabel: "All", value: null },
        { label: "当天", eLabel: "Today", value: "today" },
        { label: "一周", eLabel: "A week", value: "lastOneWeek" },
        { label: "一个月", eLabel: "One month", value: "lastOneMonth" },
        { label: "三个月", eLabel: "Three month", value: "lastThreeMonth" },
        { label: "六个月", eLabel: "six month", value: "lastHalfYear" }
      ],
      isShowAdvancedSearch: true,
      activeNames: "activeNames"
    };
  },
  computed: {
    homeLang() {
      return this.$t("lang.home");
    },
    advancedSearchLang() {
      return this.$t("lang.advancedSearch");
    },
    ...mapState(["searchForm"]),
    ...mapState(["globalLang"])
  },
  methods: {
    // 重置事件
    resetForm() {
      this.$store.commit("handlerSearchForm", {
        // 产品搜索表单
        keyword: "", // 关键字
        name: "", // 产品名称
        ch_pa: "", // 包装方式
        pa_nu: "", // 包装方式
        fa_no: "", // 出厂货号
        minPrice: "", // 最低价格
        maxPrice: "", // 最高价格
        pr_le: "", // 产品规格 长
        pr_wi: "", // 产品规格 宽
        pr_hi: "", // 产品规格 高
        ou_le: "", // 外箱规格 长
        ou_wi: "", // 外箱规格 宽
        ou_hi: "", // 外箱规格 高
        in_le: "", // 包装规格 长
        in_wi: "", // 包装规格 长
        in_hi: "", // 包装规格 长
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        isUpInsetImg: true // 是否有图片
      });
      this.datetime = null;
    },
    // 获取包装方式list
    async getProductChpaList() {
      const res = await this.$http.get(
        "/api/WebsiteShare/GetProductPackMethods"
      );
      if (res.data.result.code === 200) {
        // for (let i = 0; i < res.data.result.data.length; i++) {
        //   if (!res.data.result.data[i].packEnMethods)
        //     res.data.result.data[i].packEnMethods = " ";
        // }
        this.packingList = res.data.result.data;
        this.ePackingList = res.data.result.data.filter(
          val => val.packEnMethods
        );
      } else {
        this.$message.error(res.data.result.message);
      }
    },
    // 格式化时间
    formatTime(param) {
      const y = param.getFullYear();
      let m = param.getMonth() + 1;
      let d = param.getDate();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    },
    // 选择时间
    getDateList(code) {
      if (code) {
        const date = new Date();
        const endTime = this.formatTime(date);
        const date1 = Date.parse(date);
        let start = "";
        const oneDay = 1000 * 3600 * 24;

        switch (code) {
          // 今天
          case "today":
            start = new Date();
            break;
          // 最近1周
          case "lastOneWeek":
            start = date1 - oneDay * 7;
            break;
          // 最近1月
          case "lastOneMonth":
            start = new Date();
            start.setMonth(start.getMonth() - 1);
            break;
          // 最近3月
          case "lastThreeMonth":
            start = new Date();
            start.setMonth(start.getMonth() - 3);
            break;
          // 最近半年
          case "lastHalfYear":
            start = date1 - oneDay * 183;
            break;
        }
        const dateFd = {
          startTime: this.formatTime(new Date(start)) + "T00:00:00",
          endTime: endTime + "T23:59:59"
        };
        this.$store.commit("handlerSearchDate", dateFd);
      } else {
        const fd = {
          startTime: null,
          endTime: null
        };
        this.$store.commit("handlerSearchDate", fd);
      }
    },
    // 高级搜索
    search() {
      if (this.$route.path.includes("/index/product"))
        this.$root.eventHub.$emit("resetProducts");
      else this.$router.push("/index/product?productType=1");
    },
    toLogin() {
      // this.$router.push({ path: '/login', query: { id: 'suo' }})
    },
    // 打开高级搜索
    openAdvancedSearch() {
      this.isShowAdvancedSearch = !this.isShowAdvancedSearch;
      if (this.isShowAdvancedSearch) {
        this.$store.commit("handlerSearchForm", {
          // 产品搜索表单
          minPrice: "", // 最低价格
          maxPrice: "", // 最高价格
          pr_le: "", // 产品规格 长
          pr_wi: "", // 产品规格 宽
          pr_hi: "", // 产品规格 高
          ou_le: "", // 外箱规格 长
          ou_wi: "", // 外箱规格 宽
          ou_hi: "", // 外箱规格 高
          in_le: "", // 包装规格 长
          in_wi: "", // 包装规格 长
          in_hi: "", // 包装规格 长
          startTime: "", // 开始时间
          endTime: "", // 结束时间
          isUpInsetImg: true // 是否有图片
        });
      }
    }
  },
  mounted() {
    this.getProductChpaList();
  },
  beforeDestroy() {
    this.$store.commit("handlerSearchForm", {
      // 产品搜索表单
      // name: "", // 产品名称
      // fa_no: "", // 出厂货号
      // ch_pa: "", // 包装方式
      minPrice: "", // 最低价格
      maxPrice: "", // 最高价格
      pr_le: "", // 产品规格 长
      pr_wi: "", // 产品规格 宽
      pr_hi: "", // 产品规格 高
      ou_le: "", // 外箱规格 长
      ou_wi: "", // 外箱规格 宽
      ou_hi: "", // 外箱规格 高
      in_le: "", // 包装规格 长
      in_wi: "", // 包装规格 长
      in_hi: "", // 包装规格 长
      startTime: "", // 开始时间
      endTime: "", // 结束时间
      isUpInsetImg: true // 是否有图片
    });
  }
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.wrapBox {
  width: 100%;
  .editionCenter {
    color: #333333;
    font-size: 14px;
    max-width: 1240px;
    margin: 0 auto;
    margin-top: 20px;
    padding: 20px 27px;
    box-sizing: border-box;
    background-color: #fff;
    .showTip {
      width: 100%;
      .topTitle {
        display: flex;
        justify-content: space-between;
        .left {
          font-weight: 600;
        }
        .right {
          cursor: pointer;
        }
      }
      // 第一行搜索
      .bottomInput {
        margin-top: 20px;
        display: flex;
        .inputItem {
          flex: 1;
          display: flex;
          margin: 10px 0;
          &:first-of-type {
            margin-left: 0;
          }
          .title {
            display: flex;
            width: 111px;
            align-items: center;
          }
          .myInput {
            width: 186px;
            align-items: center;
          }
          .unit {
            width: 40px;
            text-align: center;
          }
          .searchBtn {
            @{deep} .el-button {
              color: #fff;
              width: 120px;
              height: 40px;
              background: #ff760e;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              i {
                font-size: 18px;
              }
            }
          }
        }
      }
      // 折叠面板
      .consistencyWrapBox {
        .consistencyBox {
          width: 100%;
          display: flex;
          .left,
          .right,
          .middle {
            flex: 1;
            .itemInput {
              margin-top: 20px;
              display: flex;
              align-items: center;
              .title {
                display: flex;
                width: 111px;
                align-items: center;
              }
              .myInput {
                display: flex;
                width: 186px;
                align-items: center;
                .middleLine {
                  margin: 0 5px;
                }
              }
              .unit {
                width: 40px;
                text-align: center;
              }
            }
          }
          .middle {
            flex: 1;
            .itemInput {
              margin-top: 20px;
              display: flex;
              align-items: center;
              .title {
                display: flex;
                width: 111px;
                align-items: center;
              }
              .myInput {
                display: flex;
                width: 186px;
                align-items: center;
                .middleLine {
                  margin: 0 5px;
                }
              }
              .unit {
                width: 40px;
                text-align: center;
              }
            }
          }
          .right {
            flex: 1;
          }
        }
        .pictureBox {
          margin-top: 20px;
          .itemInput {
            width: 33.33%;
            display: flex;
            .title {
              display: flex;
              width: 111px;
              align-items: center;
            }
            .myInput {
              display: flex;
              width: 186px;
              align-items: center;
              .middleLine {
                margin: 0 5px;
              }
            }
          }
        }
        .btns {
          padding: 30px;
          display: flex;
          justify-content: center;
          .el-button {
            width: 120px;
            height: 40px;
            font-size: 16px;
            background-color: #ebebeb;
            border-color: #ebebeb;
            color: #666;
            &:last-of-type {
              margin-left: 24px;
              background-color: #ff760e;
              color: #fff;
              border-color: #ff760e;
            }
            &.myBtn {
              display: flex;
              align-items: center;
              justify-content: center;
              i {
                font-size: 18px;
              }
            }
          }
        }
      }
      @media screen and (max-width: 1024px) {
        .consistencyBox {
          flex-direction: column;
        }
        .bottomInput {
          flex-wrap: wrap;
        }
      }
    }
  }
}
</style>
