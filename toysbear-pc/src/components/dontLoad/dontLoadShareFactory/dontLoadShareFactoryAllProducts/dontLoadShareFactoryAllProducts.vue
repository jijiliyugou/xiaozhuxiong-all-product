<template>
  <div class="baojia">
    <!-- @scroll="baojiaScroll"
    v-infinite-scroll="load"
    infinite-scroll-disabled="disabled" -->
    <div class="searchBox">
      <div class="keyWordSearch">
        <el-input
          v-model="keyword"
          clearable
          @keyup.enter.native="search"
          placeholder="请输入搜索关键字"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="search" round>搜索</el-button>
      </div>
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
          :class="{ filterItem: true, active: isScreen === 1 }"
          @click="sortScreen"
        >
          筛选<i v-show="isScreen === 0" class="el-icon-d-caret"></i
          ><i class="el-icon-caret-bottom" v-show="isScreen === 1"></i>
        </p>
        <p
          :class="{ filterItem: true, active: isCate === 1 }"
          @click="sortCate"
        >
          分类<i v-show="isCate === 0" class="el-icon-d-caret"></i
          ><i class="el-icon-caret-bottom" v-show="isCate === 1"></i>
        </p>
        <div class="more">
          <i v-show="isList" class="list" @click="checkList"></i>
          <i v-show="!isList" class="square" @click="checkList"></i>
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
                  size="mini"
                  placeholder="最低"
                  cle
                  v-model="packingOptions.minPrice"
                >
                </el-input
                ><em style="margin:0 0.066667rem;">-</em
                ><el-input
                  size="mini"
                  placeholder="最高"
                  v-model="packingOptions.maxPrice"
                >
                </el-input>
              </div>
              <div class="right">
                <div class="title">时间区间：</div>
                <el-select
                  v-model="packingDatetime"
                  @change="getDateList"
                  size="mini"
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
              <el-select
                v-model="packingOptions.pa_nu"
                size="mini"
                placeholder="全部"
              >
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
              <el-radio
                size="mini"
                v-model="packingOptions.isUpInsetImg"
                :label="true"
                >是</el-radio
              >
              <el-radio
                size="mini"
                v-model="packingOptions.isUpInsetImg"
                :label="false"
                >否</el-radio
              >
            </div>
          </div>
          <div class="submitBtnList">
            <!-- <div class="reset">重置</div> -->
            <el-button class="reset" type="info" @click="resetPackingOptions"
              >重置</el-button
            >
            <el-button class="submit" type="info" @click="search"
              >确认</el-button
            >
          </div>
        </div>
      </transition>
      <!-- 分类高级搜索 -->
      <transition name="el-zoom-in-top">
        <div class="category" v-show="isCate === 1">
          <div class="contentWrap">
            <div class="leftCate">
              <ul class="cateItens">
                <li
                  :class="{ item: true, active: isActive === i }"
                  @click="
                    isActive = i;
                    isItemActive = null;
                    categoryChildren = item.children;
                    allCateCount = item;
                    currentCate = item;
                  "
                  v-for="(item, i) in categoryList"
                  :key="i"
                >
                  {{ item.name }}
                </li>
              </ul>
            </div>
            <div class="rightCate">
              <p :class="{ allCateCount: true, active: isItemActive === null }">
                {{
                  currentCate
                    ? allCateCount.name + "(" + allCateCount.count + ")"
                    : "全部"
                }}
              </p>
              <!-- <p :class="{allCateCount:true, active: isItemActive === null}" v-show="!currentCate">全部</p> -->
              <ul class="cateItens">
                <li
                  :class="{ item: true, active: isItemActive === i }"
                  @click="
                    isItemActive = i;
                    currentCate = item;
                  "
                  v-for="(item, i) in categoryChildren"
                  :key="i"
                >
                  {{ item.name }}({{ item.count }})
                </li>
              </ul>
            </div>
          </div>
          <div class="submitBtnList">
            <el-button class="reset" type="info" @click="resetCategory"
              >重置</el-button
            >
            <el-button class="submit" type="info" @click="search"
              >确认</el-button
            >
          </div>
        </div>
      </transition>
    </div>
    <!-- 产品简版 -->
    <div class="productBox" v-if="!isList">
      <div
        class="item"
        @click.stop="toProductDetail(item)"
        v-for="(item, i) in 10"
        :key="i"
      >
        <div class="myImgBox">
          <el-image
            class="myImg"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            fit="contain"
          ></el-image>
          <div class="newIcon"></div>
        </div>
        <div class="context">
          <p class="itemText name">积木飞机</p>
          <p class="itemText">出厂货号：<span>HS0046642</span></p>
          <p class="itemText">参考单价：<span class="price">￥10</span></p>
        </div>
        <div class="iconBox">
          <div class="vipIcon"></div>
          <div class="presentIcon"></div>
          <div class="cardIcon"></div>
        </div>
      </div>
    </div>
    <!-- 产品全版 -->
    <div class="productListBox" v-else>
      <div
        class="itemBox"
        @click.stop="toProductDetail(item)"
        v-for="(item, i) in 5"
        :key="i"
      >
        <div class="top">
          <div class="left">
            <el-image
              class="myImg"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
              fit="contain"
            ></el-image>
            <div class="newIcon"></div>
          </div>
          <div class="right">
            <p class="productName">实色拉线飞机</p>
            <p class="item">出厂货号：<span class="value">8188B</span></p>
            <p class="item">包装：<span class="value">吸板</span></p>
            <p class="item">装箱量：<span class="value">2/72(PCS)</span></p>
            <p class="item">样品规格：<span class="value">19*19*5(CM)</span></p>
            <p class="item">包装规格：<span class="value">1</span></p>
            <p class="item">
              外箱规格：<span class="value">86*53.5*73(CM)</span>
            </p>
            <p class="item">
              体积/材积：<span class="value">0.336(CBM)/ 11.85(CUFT)</span>
            </p>
            <p class="item">
              毛重/净重：<span class="value">9.6/11.6(KG)</span>
            </p>
            <p class="item">参考单价：<span class="price">￥3.8</span></p>
          </div>
        </div>
        <div class="bottom">来源：凤新样品房</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
      sortOrder: 0,
      sortType: null,
      isList: false,
      isPrice: 0,
      isDate: 0,
      isHot: 0,
      isCate: 0,
      isScreen: 0,
      // 高级搜索
      packingOptions: {
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
      categoryChildren: []
    };
  },
  methods: {
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
    // 切换列表
    checkList() {
      this.isList = !this.isList;
    },
    // 热度排序
    sortHot(number) {
      this.sortOrder = number;
      this.sortType = this.isHot = this.isHot === 1 ? 2 : 1;
      this.isDate = this.isPrice = 0;
      this.currentPage = 1;
      this.search();
    },
    // 价格排序
    sortPrice(number) {
      this.sortOrder = number;
      this.sortType = this.isPrice = this.isPrice === 1 ? 2 : 1;
      this.isScreen = this.isCate = this.isHot = this.isDate = 0;
      this.currentPage = 1;
      this.search();
    },
    // 时间排序
    sortDate(number) {
      this.sortOrder = number;
      this.sortType = this.isDate = this.isDate === 1 ? 2 : 1;
      this.isScreen = this.isCate = this.isHot = this.isPrice = 0;
      this.currentPage = 1;
      this.search();
    },
    // 点击筛选事件
    sortScreen() {
      this.isCate = 0;
      // this.sortOrder = 0
      this.isScreen = this.isScreen === 1 ? 0 : 1;
      // this.isCate = this.isDate = this.isHot = this.isPrice = 0
    },
    // 点击分类事件
    sortCate() {
      this.isScreen = 0;
      // this.isActive = null
      // this.allCateCount = 0
      // this.sortOrder = 0
      this.isCate = this.isCate === 1 ? 0 : 1;
      // this.isActive = this.isScreen = this.isDate = this.isHot = this.isPrice = 0
    },
    // 搜索产品
    search() {
      console.log(this.keyword);
    },
    // 查看产品详情
    toProductDetail(item) {
      this.$router.push(
        "/dontLoadProductDetails?product=" + JSON.stringify(item)
      );
    },
    // 呼叫联系人
    // callContact () {
    //   const link = document.createElement('a')
    //   link.href = 'tel'
    //   link.value = '17603033458'
    //   link.click()
    // },
    // 获取所有分类
    async getProductCategoryList() {
      // this.$store.commit('updateAppLoading', true)
      // const res = await this.$http.post('/api/SelectProductCategory', { companyNumber: this.productInfo.companyNumber })
      // if (res.data.result.code === 200) {
      //   this.categoryList = res.data.result.item
      //   // this.categoryChildren = this.categoryList[0].children
      // } else {
      //   this.$message.error(res.data.result.msg)
      // }
      // this.$store.commit('updateAppLoading', false)
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
    console.log(this.$route.query);
    document.title = "所有产品";
    // this.getProductCategoryList()
  },
  beforeDestroy() {
    document.title = "小竹熊 云科技";
  },
  computed: {
    noMore() {
      return this.totalCount <= this.productList.length;
    },
    disabled() {
      return this.$store.state.vueElementLoading || this.noMore;
    }
  },
  mounted() {
    // if (this.$store.state.screenWidth > 1024) this.$router.push('/offerSharingPC?id=' + this.$route.query.id)
  }
};
</script>
<style scoped lang="less">
@import "./dontLoadShareFactoryAllProducts.less";
</style>
