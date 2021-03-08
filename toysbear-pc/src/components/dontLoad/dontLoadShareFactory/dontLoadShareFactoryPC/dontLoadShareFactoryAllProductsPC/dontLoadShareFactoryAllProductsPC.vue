<template>
  <div class="productWrao">
    <topComponent :title="topTitle" :companyInfo="companyInfo" />
    <div class="filterBox">
      <div class="filterTitle">
        <div class="left">
          <!-- 筛选 -->
          <div class="filterProduct">
            <p
              :class="{ filterItem: true, active: sortOrder === 3 }"
              @click="sortHot(3)"
            >
              热度<i v-show="isHot === 0" class="el-icon-d-caret"></i
              ><i class="el-icon-caret-bottom" v-show="isHot === 1"></i
              ><i v-show="isHot === 2" class="el-icon-caret-top"></i>
            </p>
            <p
              :class="{ filterItem: true, active: sortOrder === 1 }"
              @click="sortPrice(1)"
            >
              单价<i v-show="isPrice === 0" class="el-icon-d-caret"></i
              ><i class="el-icon-caret-bottom" v-show="isPrice === 1"></i
              ><i v-show="isPrice === 2" class="el-icon-caret-top"></i>
            </p>
            <p
              :class="{ filterItem: true, active: sortOrder === 2 }"
              @click="sortDate(2)"
            >
              时间<i v-show="isDate === 0" class="el-icon-d-caret"></i
              ><i class="el-icon-caret-bottom" v-show="isDate === 1"></i
              ><i v-show="isDate === 2" class="el-icon-caret-top"></i>
            </p>
            <p
              :class="{ filterItem: true, isActive: isScreen === 1 }"
              @click="sortScreen"
            >
              筛选<i v-show="isScreen === 0" class="el-icon-d-caret"></i
              ><i class="el-icon-caret-bottom" v-show="isScreen === 1"></i>
            </p>
            <!-- <p :class="{'filterItem': true, 'isActive': isCate === 1}" @click="sortCate">分类<i v-show="isCate === 0" class="el-icon-d-caret"></i><i class="el-icon-caret-bottom" v-show="isCate === 1"></i></p> -->
          </div>
        </div>
        <div class="right">
          <div class="keywordBox">
            <span class="title">关键字搜索：</span>
            <el-input
              size="mini"
              v-model="packingOptions.keyword"
              placeholder="请输入关键字搜索"
              @keyup.enter.native="getSupplierProductShare"
            >
              <el-button
                slot="append"
                @click="getSupplierProductShare"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </div>
          <div class="more">
            <i v-show="isList" class="list" @click="checkList"></i>
            <i v-show="!isList" class="square" @click="checkList"></i>
          </div>
        </div>
      </div>
      <!-- 高级搜索 -->
      <transition name="el-zoom-in-top">
        <div class="screens transition-box" v-show="isScreen === 1">
          <div class="contentWrap">
            <div class="item">
              <div class="left">
                <div class="title">价格区间：</div>
                <el-input
                  placeholder="最低"
                  cle
                  v-model="packingOptions.minPrice"
                >
                </el-input
                ><em style="margin:0 0.066667rem;">-</em
                ><el-input placeholder="最高" v-model="packingOptions.maxPrice">
                </el-input>
              </div>
              <div class="right">
                <div class="title">时间区间：</div>
                <el-select
                  v-model="packingDatetime"
                  @change="getDateList"
                  placeholder="全部"
                >
                  <el-option
                    v-for="(item, i) in dateList"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="packing">
              <div class="title">包装：</div>
              <el-select v-model="packingOptions.pa_nu" placeholder="全部">
                <el-option
                  v-for="item in packingList"
                  :key="item.value"
                  :label="item.ch_pa"
                  :value="item.pa_nu"
                >
                </el-option>
              </el-select>
            </div>
            <div class="selectImg">
              <div class="title">图片：</div>
              <el-radio v-model="packingOptions.isUpInsetImg" :label="true"
                >是</el-radio
              >
              <el-radio v-model="packingOptions.isUpInsetImg" :label="false"
                >否</el-radio
              >
            </div>
          </div>
          <div class="submitBtnList">
            <!-- <div class="reset">重置</div> -->
            <el-button class="reset" type="info" @click="resetPackingOptions"
              >重置</el-button
            >
            <el-button
              class="submit"
              type="info"
              @click="getSupplierProductShare"
              >确认</el-button
            >
          </div>
        </div>
      </transition>
      <!-- 分类高级搜索 -->
      <!-- <transition name="el-zoom-in-top">
        <div class="category" v-show="isCate === 1">
          <div class="contentWrap">
          <div class="leftCate">
            <ul class="cateItens">
              <li :class="{item: true, active:isActive === i}" @click="isActive = i;isItemActive = null;categoryChildren = item.children;allCateCount = item;currentCate = item;" v-for="(item, i) in categoryList" :key="i">{{ item.name }}</li>
            </ul>
          </div>
          <div class="rightCate">
            <p :class="{allCateCount:true, active: isItemActive === null}">{{ currentCate?allCateCount.name + '(' + allCateCount.count + ')':'全部' }}</p>
            <ul class="cateItens">
              <li :class="{item: true, active: isItemActive === i}" @click="isItemActive = i;currentCate = item;" v-for="(item, i) in categoryChildren" :key="i">
                {{ item.name }}({{ item.count }})
              </li>
            </ul>
          </div>
          </div>
          <div class="submitBtnList">
            <el-button class="reset" type="info" @click="resetCategory">重置</el-button>
            <el-button class="submit" type="info"  @click="search">确认</el-button>
          </div>
        </div>
      </transition> -->
    </div>
    <div class="productGongge" v-if="!isList">
      <div
        class="item"
        @click="toProductDetail(item)"
        v-for="(item, i) in productList"
        :key="i"
      >
        <el-image
          style="width: 282px; height: 211px; min-height: 211px;"
          :src="item.img"
          fit="contain"
        >
          <div
            slot="placeholder"
            class="image-slot"
            style="width: 100%;height: 100%;"
          >
            <img
              style="width: 100%;height: 100%; object-fit: contain;"
              class="errorImg"
              src="~@/assets/images/imgError.png"
              alt
            />
          </div>
          <div
            slot="error"
            class="image-slot"
            style="width: 100%;height: 100%;"
          >
            <img
              class="errorImg"
              style="width: 100%;height: 100%; object-fit: contain;"
              src="~@/assets/images/imgError.png"
              alt
            />
          </div>
        </el-image>
        <div class="context">
          <div class="productName">{{ item.name }}</div>
          <div class="textBox">
            <span>货号：{{ item.fa_no }}</span>
            <span
              >参考单价：<span class="price">￥{{ item.price }}</span></span
            >
          </div>
        </div>
      </div>
      <p class="kong"></p>
      <p class="kong"></p>
      <p class="kong"></p>
    </div>
    <div class="productList" v-else>
      <div
        class="item"
        @click="toProductDetail(item)"
        v-for="(item, i) in productList"
        :key="i"
      >
        <el-image :src="item.img" fit="contain">
          <div
            slot="placeholder"
            class="image-slot"
            style="width: 100%;height: 100%;"
          >
            <img
              style="width: 100%;height: 100%; object-fit: contain;"
              class="errorImg"
              src="~@/assets/images/imgError.png"
              alt
            />
          </div>
          <div
            slot="error"
            class="image-slot"
            style="width: 100%;height: 100%;"
          >
            <img
              class="errorImg"
              style="width: 100%;height: 100%; object-fit: contain;"
              src="~@/assets/images/imgError.png"
              alt
            />
          </div>
        </el-image>
        <div class="context">
          <div class="productName">{{ item.name }}</div>
          <div class="textBox">
            出厂货号：<span class="value">{{ item.fa_no }}</span>
          </div>
          <div class="textBox">
            包装：<span class="value">{{ item.packName }}</span>
          </div>
          <div class="textBox">
            装箱量：<span class="value">{{
              item.in_en + "/" + item.ou_lo + "(PCS)"
            }}</span>
          </div>
          <div class="textBox">
            样品规格：<span class="value">{{
              item.pr_le + " X " + item.pr_wi + " X " + item.pr_hi + "(CM)"
            }}</span>
          </div>
          <div class="textBox">
            包装规格：<span class="value">{{
              item.in_le + " X " + item.in_wi + " X " + item.in_hi + "(CM)"
            }}</span>
          </div>
          <div class="textBox">
            体积/材积：<span class="value">{{
              item.bulk_stere + "(CBM)" + "/" + item.bulk_feet + "(CUFT)"
            }}</span>
          </div>
          <div class="textBox">
            毛重/净重：<span class="value">{{
              item.gr_we + "/" + item.ne_we + "(kg)"
            }}</span>
          </div>
          <div class="textBox">
            参考单价：<span class="price">￥{{ item.price }}</span>
          </div>
        </div>
      </div>
    </div>
    <center style="padding-bottom: 20px;">
      <el-pagination
        background
        :page-sizes="[8, 16, 32, 40]"
        :page-size="30"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </center>
  </div>
</template>

<script>
import topComponent from "@/components/shareFactoryTopComponent/shareFactoryTopComponent.vue";
export default {
  components: {
    topComponent
  },
  data() {
    return {
      topTitle: "所有产品",
      sortOrder: 0,
      sortType: 0,
      isList: false,
      isPrice: 0,
      isDate: 0,
      isHot: 0,
      isCate: 0,
      isScreen: 0,
      // 高级搜索
      packingOptions: {
        keyword: null,
        minPrice: null,
        maxPrice: null,
        pa_nu: null,
        isUpInsetImg: null,
        startTime: null,
        endTime: null
      },
      packingDatetime: null,
      dateList: [
        { label: "全部", value: "" },
        { label: "当天", value: "today" },
        { label: "一周", value: "lastOneWeek" },
        { label: "一个月", value: "lastOneMonth" },
        { label: "三个月", value: "lastThreeMonth" },
        { label: "六个月", value: "lastHalfYear" }
      ],
      packingList: [],
      categoryList: [],
      isItemActive: null,
      currentCate: null,
      productList: [],
      companyInfo: {},
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      categoryChildren: []
    };
  },
  methods: {
    // 产品详情
    toProductDetail(item) {
      sessionStorage.setItem("currentProduct", JSON.stringify(item));
      this.$router.push({ path: "/dontLoadProductDetailsPC" });
    },
    // 获取包装方式list
    async getProductChpaList() {
      const res = await this.$http.post("/api/GetProductChpaList", {
        supplierNumber: "HS0000006"
      });
      if (res.data.result.code === 200) {
        this.packingList = res.data.result.item;
      } else {
        this.$message.error(res.data.result.msg);
      }
    },
    // 获取厂商信息
    async getCompanyByIDShare() {
      const res = await this.$http.post("/api/CompanyByIDShare ", {
        companyNumber: "HS0000006"
      });
      if (res.data.result.code === 200) {
        this.companyInfo = res.data.result.item;
      } else this.$message.error(res.data.result.msg);
    },
    // 获取厂商所有产品
    async getSupplierProductShare() {
      const fd = {
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        companyNumber: "HS0000006",
        sortOrder: this.sortOrder,
        sortType: this.sortType,
        ...this.packingOptions
      };
      for (const key in fd) {
        if (fd[key] === undefined || fd[key] === null || fd[key] === "")
          delete fd[key];
      }
      const res = await this.$http.post("/api/SupplierProductShare", fd);
      if (res.data.result.code === 200) {
        this.productList = res.data.result.item.items;
        this.totalCount = res.data.result.item.totalCount;
        console.log(this.productList, this.totalCount);
      } else this.$message.error(res.data.result.msg);
    },
    // 搜索
    search() {
      console.log("search");
    },
    // 切换列表
    checkList() {
      this.isList = !this.isList;
    },
    // 热度排序
    sortHot(number) {
      this.sortOrder = number;
      this.sortType = this.isHot = this.isHot === 1 ? 2 : 1;
      this.isCate = this.isDate = this.isPrice = 0;
      this.currentPage = 1;
      this.getSupplierProductShare();
    },
    // 价格排序
    sortPrice(number) {
      this.sortOrder = number;
      this.sortType = this.isPrice = this.isPrice === 1 ? 2 : 1;
      this.isCate = this.isHot = this.isDate = 0;
      this.currentPage = 1;
      this.getSupplierProductShare();
    },
    // 时间排序
    sortDate(number) {
      this.sortOrder = number;
      this.sortType = this.isDate = this.isDate === 1 ? 2 : 1;
      // this.isScreen = this.isCate = this.isHot = this.isPrice = 0
      this.isCate = this.isHot = this.isPrice = 0;
      this.currentPage = 1;
      this.getSupplierProductShare();
    },
    // 点击筛选事件
    sortScreen() {
      this.isCate = 0;
      // this.sortOrder = 0
      this.isScreen = this.isScreen === 1 ? 0 : 1;
      if (!this.isScreen) this.resetPackingOptions();
      // this.isCate = this.isDate = this.isHot = this.isPrice = 0
    },
    // 重置分类搜索
    resetCategory() {
      this.isActive = null;
      this.isItemActive = null;
      this.currentCate = null;
      this.categoryChildren = null;
    },
    // 重置高级搜索
    resetPackingOptions() {
      this.packingOptions = {
        minPrice: null,
        maxPrice: null,
        pa_nu: null,
        isUpInsetImg: null,
        startTime: null,
        endTime: null
      };
      this.packingDatetime = null;
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
        this.packingOptions.startTime =
          this.formatTime(new Date(start)) + "T00:00:00";
        this.packingOptions.endTime = endTime + "T23:59:59";
      } else {
        this.packingOptions.startTime = null;
        this.packingOptions.endTime = null;
      }
    }
  },
  created() {
    this.getProductChpaList();
  },
  mounted() {
    this.getSupplierProductShare();
    this.getCompanyByIDShare();
  }
};
</script>
<style scoped lang="less">
@import "./dontLoadShareFactoryAllProductsPC.less";
</style>
