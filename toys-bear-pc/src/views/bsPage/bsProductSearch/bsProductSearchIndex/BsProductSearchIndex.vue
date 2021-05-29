<template>
  <div>
    <div class="productSearch">
      <template v-if="!imageSearchValue">
        <div class="advancedSearchBox">
          <bsProductSearch
            ref="searchRef"
            :keyword="searchForm.keyword"
            :MyisGaoji="searchForm.MyisGaoji"
            v-model="searchForm.keyword"
            @handleIsgaoji="handleIsgaoji"
            @closeTag="closeTag"
            @handleSynthesis="handleSynthesis"
            @screeningShow="screeningShow"
          />
          <!-- 高级筛选 -->
          <div class="advancedScreening" v-show="screeningFlag == true">
            <div class="title">高级筛选:</div>
            <div class="queryCondition">
              <!-- <div>
              <span class="text">综合：</span>
              <el-checkbox
                v-model="synthesis"
                @change="handleSynthesis"
                style="margin-right: 30px;"
              >
                综合查询
              </el-checkbox>
            </div> -->
              <div class="item">
                <span class="text">搜索类型：</span>
                <el-checkbox
                  @change="handleCheckedScreensChange"
                  v-model="searchForm.fa_no"
                >
                  货号
                </el-checkbox>
                <el-checkbox
                  @change="handleCheckedScreensChange"
                  v-model="searchForm.name"
                >
                  名称
                </el-checkbox>
                <el-checkbox
                  @change="handleCheckedScreensChange"
                  v-model="searchForm.number"
                >
                  编号
                </el-checkbox>
              </div>
              <div class="item">
                <span class="text">是否精准：</span>
                <el-radio-group v-model="isAccurate" @change="handleIsAccurate">
                  <el-radio label="模糊"></el-radio>
                  <el-radio label="精准"></el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="parameter">
              <el-form :model="advancedFormdata">
                <div class="left">
                  <el-form-item label="产品规格：">
                    <el-input
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      size="medium"
                      placeholder="长"
                      style="width: 55px"
                      v-model="advancedFormdata.pr_le"
                    ></el-input
                    ><span class="hx">-</span>
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="宽"
                      style="width: 55px"
                      v-model="advancedFormdata.pr_wi"
                    ></el-input
                    ><span class="hx">-</span>
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="高"
                      style="width: 55px"
                      v-model="advancedFormdata.pr_hi"
                    ></el-input>
                    &nbsp;<span>CM</span>
                  </el-form-item>
                  <el-form-item label="外箱规格：">
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="长"
                      style="width: 55px"
                      v-model="advancedFormdata.ou_le"
                    ></el-input
                    ><span class="hx">-</span>
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="宽"
                      style="width: 55px"
                      v-model="advancedFormdata.ou_wi"
                    ></el-input
                    ><span class="hx">-</span>
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="高"
                      style="width: 55px"
                      v-model="advancedFormdata.ou_hi"
                    ></el-input>
                    &nbsp;<span>CM</span>
                  </el-form-item>
                  <el-form-item label="包装规格：" style="margin: 0">
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="长"
                      style="width: 55px"
                      v-model="advancedFormdata.in_le"
                    ></el-input
                    ><span class="hx">-</span>
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="宽"
                      style="width: 55px"
                      v-model="advancedFormdata.in_wi"
                    ></el-input
                    ><span class="hx">-</span>
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="高"
                      style="width: 55px"
                      v-model="advancedFormdata.in_hi"
                    ></el-input>
                    &nbsp;<span>CM</span>
                  </el-form-item>
                </div>
                <div class="left">
                  <el-form-item label="包装方式：">
                    <el-select
                      filterable
                      size="medium"
                      style="width: 200px; heigth: 35px"
                      clearable
                      v-model="advancedFormdata.ch_pa"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in chpaList"
                        :key="item.pa_nu"
                        :label="item.ch_pa"
                        :value="item.ch_pa"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="多媒体：" class="abbrLabel">
                    <el-checkbox v-model="isUpInsetImg">是否有图</el-checkbox>
                    <el-checkbox
                      v-model="addrSearch"
                      @change="handleraddrSearchChange"
                      >3D展示</el-checkbox
                    >
                  </el-form-item>
                  <el-form-item style="margin: 0" label="">
                    <el-button
                      type="primary"
                      size="mini"
                      style="color: #fff"
                      @click="confirmAdvanced"
                    >
                      确 定
                    </el-button>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
          <!-- 展厅分类 -->
          <div class="hallCate" v-if="searchHallCate">
            <div class="productClass">
              <span class="myLabel">产品分类:</span>
              <div :class="{ tags: true, showOneCate: isOneDownCate }">
                <div
                  @click="hallTagEvent(null)"
                  :class="{
                    itemTag: true,
                    isActive: searchForm.categoryNumber === null
                  }"
                >
                  全部
                </div>
                <div
                  @click="hallTagEvent(item)"
                  :class="{
                    itemTag: true,
                    isActive: searchForm.categoryNumber === item.categoryNumber
                  }"
                  v-for="item in searchHallCate.cateList"
                  :key="item.categoryNumber"
                >
                  {{ item.categoryName }}
                </div>
              </div>
              <div class="topLine">
                <div class="develop" @click="handlerOneCateLabel">
                  <span class="zhankai">{{
                    isOneDownCate ? "展开" : "隐藏"
                  }}</span>
                  <i v-show="isOneDownCate" class="el-icon-arrow-down"></i>
                  <i v-show="!isOneDownCate" class="el-icon-arrow-up"></i>
                </div>
              </div>
            </div>
          </div>
          <!-- 所有分类 -->
          <div class="allCate" v-else>
            <!--一级分类 -->
            <div class="productClass">
              <span class="myLabel">产品分类:</span>
              <div :class="{ tags: true, showOneCate: isOneDownCate }">
                <div
                  @click="oneTagEvent(null)"
                  :class="{ itemTag: true, isActive: oneCurrentTag === null }"
                >
                  全部
                </div>
                <div
                  @click="oneTagEvent(item)"
                  :class="{
                    itemTag: true,
                    isActive: oneCurrentTag && oneCurrentTag.id === item.id
                  }"
                  v-for="item in categoryList"
                  :key="item.id"
                >
                  {{ item.name }}
                </div>
              </div>
              <div class="topLine">
                <div class="develop" @click="handlerOneCateLabel">
                  <span class="zhankai">{{
                    isOneDownCate ? "展开" : "隐藏"
                  }}</span>
                  <i v-show="isOneDownCate" class="el-icon-arrow-down"></i>
                  <i v-show="!isOneDownCate" class="el-icon-arrow-up"></i>
                </div>
              </div>
            </div>
            <!-- 二级分类 -->
            <div class="twoLevelClass" v-if="oneCurrentTag">
              <span class="myLabel">二级分类:</span>
              <div :class="{ tags: true, showTwoCate: isTwoDownCate }">
                <div
                  @click="twoTagEvent(null)"
                  :class="{ itemTag: true, isActive: currentTwoTag === null }"
                >
                  全部
                </div>
                <div
                  @click="twoTagEvent(item.id)"
                  :class="{
                    itemTag: true,
                    isActive: currentTwoTag === item.id
                  }"
                  v-for="item in oneCurrentTag.children"
                  :key="item.id"
                >
                  {{ item.name }}
                </div>
              </div>
              <div class="topLine">
                <div class="develop" @click="handlerTwoCateLabel">
                  <span class="zhankai">{{
                    isTwoDownCate ? "展开" : "隐藏"
                  }}</span>
                  <i v-show="isTwoDownCate" class="el-icon-arrow-down"></i>
                  <i v-show="!isTwoDownCate" class="el-icon-arrow-up"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="productsWrap">
          <div class="screenBox">
            <div class="left">
              <div class="screenItem" @click="sortTypeEvent(null)">
                <span :class="{ screenLabel: true, active: sortOrder === null }"
                  >综合</span
                >
              </div>
              <div class="screenItem" @click="sortTypeEvent(3)">
                <span :class="{ screenLabel: true, active: sortOrder === 3 }"
                  >热度</span
                >
                <i v-show="isRedu === null" class="jiantou xiajiantouIcon"></i>
                <i v-show="isRedu === 1" class="jiantou xiaActiveIcon"></i>
                <i v-show="isRedu === 2" class="jiantou shangActiveIcon"></i>
              </div>
              <div class="screenItem" @click="sortTypeEvent(1)">
                <span :class="{ screenLabel: true, active: sortOrder === 1 }"
                  >单价</span
                >
                <i v-show="isPrice === null" class="jiantou xiajiantouIcon"></i>
                <i v-show="isPrice === 1" class="jiantou xiaActiveIcon"></i>
                <i v-show="isPrice === 2" class="jiantou shangActiveIcon"></i>
              </div>
              <div class="screenItem" @click="sortTypeEvent(2)">
                <span :class="{ screenLabel: true, active: sortOrder === 2 }">
                  时间
                </span>
                <i v-show="isTime === null" class="jiantou xiajiantouIcon"></i>
                <i v-show="isTime === 1" class="jiantou xiaActiveIcon"></i>
                <i v-show="isTime === 2" class="jiantou shangActiveIcon"></i>
              </div>
              <div class="screenItem dateTime">
                <span class="screenLabel">上架时间</span>
                <el-date-picker
                  size="mini"
                  value-format="yyyy-MM-ddTHH:mm:ss"
                  v-model="searchForm.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </div>
              <div class="screenItem priceUnit">
                <span class="screenLabel">价格区间</span>
                <div class="intervalPrice">
                  <el-input
                    size="mini"
                    v-model="searchForm.minPrice"
                    placeholder="最低"
                  ></el-input>
                  <span class="line">-</span>
                  <el-input
                    size="mini"
                    v-model="searchForm.maxPrice"
                    placeholder="最高"
                  ></el-input>
                </div>
              </div>
              <el-button
                @click="getProductList(false)"
                type="primary"
                style="margin-left: 10px"
                size="mini"
              >
                确定
              </el-button>
            </div>
            <div class="right">
              <div class="searchTime">
                查询用时：<span>{{ searchHttpTime }}</span
                >秒
              </div>
              <div
                :class="{ grid: true, active: isGrid === 'bsGridComponent' }"
                @click="handerIsGrid('bsGridComponent')"
              ></div>
              <div
                :class="{
                  column: true,
                  active: isGrid === 'bsColumnComponent'
                }"
                @click="handerIsGrid('bsColumnComponent')"
              ></div>
              <div class="line"></div>
              <div class="totalCount">
                <span class="totalCountText">{{ totalCount }}</span>
                <span>条数据</span>
              </div>
              <div class="myMinPagination">
                <div @click="firstEvent" class="first el-icon-arrow-left"></div>
                <div class="count">
                  <span class="pageIndex">{{ currentPage }}</span>
                  <span>/</span>
                  <span>{{ Math.ceil(totalCount / pageSize) }}</span>
                </div>
                <div @click="nextEvent" class="next el-icon-arrow-right"></div>
              </div>
            </div>
          </div>
          <div
            class="productListBox"
            :style="
              isGrid === 'bsColumnComponent'
                ? ' padding:20px'
                : ' padding:0 20px'
            "
          >
            <!-- 产品列表 -->
            <component
              ref="componentRef"
              :is="isGrid"
              :productList="productList"
            ></component>
            <!-- 分页 -->
            <center
              :class="{
                myPagination: true,
                leftCheckbox: isGrid === 'bsColumnComponent'
              }"
            >
              <div class="left" v-show="isGrid === 'bsColumnComponent'">
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="checkAll"
                  @change="handleCheckAllChange"
                >
                  全选
                </el-checkbox>

                <el-button
                  class="purchased"
                  size="small"
                  @click="handelrPurchased"
                >
                  <i class="selectionCart"></i>
                  <span>本页选中一键加购</span>
                </el-button>
              </div>
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[12, 24, 36, 48]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
              >
              </el-pagination>
            </center>
          </div>
        </div>
      </template>
      <!-- 图搜结果 -->
      <template v-if="imageSearchValue">
        <div class="advancedSearchBox">
          <bsProductSearch
            ref="searchRef"
            :keyword="searchForm.keyword"
            v-model="searchForm.keyword"
            @closeTag="closeTag"
            @handleSynthesis="handleSynthesis"
            @screeningShow="screeningShow"
          />
          <!-- 高级筛选 -->
          <div class="advancedScreening" v-show="screeningFlag == true">
            <div class="title">高级筛选:</div>
            <div class="queryCondition">
              <div class="item">
                <span class="text">搜索类型：</span>
                <el-checkbox
                  @change="handleCheckedScreensChange"
                  v-model="searchForm.fa_no"
                >
                  货号
                </el-checkbox>
                <el-checkbox
                  @change="handleCheckedScreensChange"
                  v-model="searchForm.name"
                >
                  名称
                </el-checkbox>
                <el-checkbox
                  @change="handleCheckedScreensChange"
                  v-model="searchForm.number"
                >
                  编号
                </el-checkbox>
              </div>
              <div class="item">
                <span class="text">是否精准：</span>
                <el-radio-group v-model="isAccurate" @change="handleIsAccurate">
                  <el-radio label="模糊"></el-radio>
                  <el-radio label="精准"></el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="parameter">
              <el-form :model="advancedFormdata">
                <div class="left">
                  <el-form-item label="产品规格：">
                    <el-input
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      size="medium"
                      placeholder="长"
                      style="width: 55px"
                      v-model="advancedFormdata.pr_le"
                    ></el-input
                    ><span class="hx">-</span>
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="宽"
                      style="width: 55px"
                      v-model="advancedFormdata.pr_wi"
                    ></el-input
                    ><span class="hx">-</span>
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="高"
                      style="width: 55px"
                      v-model="advancedFormdata.pr_hi"
                    ></el-input>
                    &nbsp;<span>CM</span>
                  </el-form-item>
                  <el-form-item label="外箱规格：">
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="长"
                      style="width: 55px"
                      v-model="advancedFormdata.ou_le"
                    ></el-input
                    ><span class="hx">-</span>
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="宽"
                      style="width: 55px"
                      v-model="advancedFormdata.ou_wi"
                    ></el-input
                    ><span class="hx">-</span>
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="高"
                      style="width: 55px"
                      v-model="advancedFormdata.ou_hi"
                    ></el-input>
                    &nbsp;<span>CM</span>
                  </el-form-item>
                  <el-form-item label="包装规格：" style="margin: 0">
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="长"
                      style="width: 55px"
                      v-model="advancedFormdata.in_le"
                    ></el-input
                    ><span class="hx">-</span>
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="宽"
                      style="width: 55px"
                      v-model="advancedFormdata.in_wi"
                    ></el-input
                    ><span class="hx">-</span>
                    <el-input
                      size="medium"
                      onkeyup="value=value.replace(/[^\d.]/g,'')"
                      placeholder="高"
                      style="width: 55px"
                      v-model="advancedFormdata.in_hi"
                    ></el-input>
                    &nbsp;<span>CM</span>
                  </el-form-item>
                </div>
                <div class="left">
                  <el-form-item label="包装方式：">
                    <el-select
                      filterable
                      size="medium"
                      style="width: 200px; heigth: 35px"
                      clearable
                      v-model="advancedFormdata.ch_pa"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in chpaList"
                        :key="item.pa_nu"
                        :label="item.ch_pa"
                        :value="item.ch_pa"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="多媒体：">
                    <el-checkbox v-model="isUpInsetImg">是否有图</el-checkbox>
                    <el-checkbox
                      v-model="addrSearch"
                      @change="handleraddrSearchChange"
                      >3D展示</el-checkbox
                    >
                  </el-form-item>
                  <el-form-item style="margin: 0" label="">
                    <el-button
                      type="primary"
                      size="mini"
                      style="color: #fff"
                      @click="confirmAdvanced"
                    >
                      确 定
                    </el-button>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
          <div class="productClass">
            <span class="myLabel">产品分类:</span>
            <div :class="{ tags: true, showOneCate: isOneDownCate }">
              <div
                @click="oneTagEvent(null)"
                :class="{ itemTag: true, isActive: oneCurrentTag === null }"
              >
                全部
              </div>
              <div
                @click="oneTagEvent(item)"
                :class="{
                  itemTag: true,
                  isActive: oneCurrentTag && oneCurrentTag.id === item.id
                }"
                v-for="item in categoryList"
                :key="item.id"
              >
                {{ item.name }}
              </div>
            </div>
            <div class="topLine">
              <div class="develop" @click="handlerOneCateLabel">
                <span class="zhankai">{{
                  isOneDownCate ? "展开" : "隐藏"
                }}</span>
                <i v-show="isOneDownCate" class="el-icon-arrow-down"></i>
                <i v-show="!isOneDownCate" class="el-icon-arrow-up"></i>
              </div>
            </div>
          </div>
          <div class="twoLevelClass" v-if="oneCurrentTag">
            <span class="myLabel">二级分类:</span>
            <div :class="{ tags: true, showTwoCate: isTwoDownCate }">
              <div
                @click="twoTagEvent(null)"
                :class="{ itemTag: true, isActive: currentTwoTag === null }"
              >
                全部
              </div>
              <div
                @click="twoTagEvent(item.id)"
                :class="{ itemTag: true, isActive: currentTwoTag === item.id }"
                v-for="item in oneCurrentTag.children"
                :key="item.id"
              >
                {{ item.name }}
              </div>
            </div>
            <div class="topLine">
              <div class="develop" @click="handlerTwoCateLabel">
                <span class="zhankai">{{
                  isTwoDownCate ? "展开" : "隐藏"
                }}</span>
                <i v-show="isTwoDownCate" class="el-icon-arrow-down"></i>
                <i v-show="!isTwoDownCate" class="el-icon-arrow-up"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="picSearchBox">
          <div class="resultTitle">搜索图片</div>
          <div class="resultBox">
            <div class="left">
              <!-- <p class="totalCountBox">
                <span class="title">搜索产品</span>
                <span class="total">
                  <span class="title">总记录：</span>
                  <span class="text"> {{ totalCount }} </span>条
                </span>
              </p> -->
            </div>
            <div class="middle">
              <!-- {{ searchImgPreview }} -->
              <div class="preview" v-if="searchImgPreview">
                <div class="imgBox">
                  <div class="miniImg">
                    <el-image
                      @click.native.stop.prevent="
                        openCubeImg(searchImgPreview.img)
                      "
                      :src="searchImgPreview.img"
                      fit="contain"
                    ></el-image>
                  </div>
                  <el-image
                    :src="searchImgPreview.baseImg"
                    @click.native.stop.prevent="
                      openCubeImg(searchImgPreview.baseImg)
                    "
                    fit="contain"
                  ></el-image>
                </div>
              </div>
            </div>
            <div class="right"></div>
          </div>
          <div class="screenBox">
            <div class="left">
              <div class="screenItem" @click="picSortTypeEvent(null)">
                <span :class="{ screenLabel: true, active: sortOrder === null }"
                  >综合</span
                >
              </div>
              <div class="screenItem" @click="picSortTypeEvent(3)">
                <span :class="{ screenLabel: true, active: sortOrder === 3 }"
                  >热度</span
                >
                <i v-show="isRedu === null" class="jiantou xiajiantouIcon"></i>
                <i v-show="isRedu === 1" class="jiantou xiaActiveIcon"></i>
                <i v-show="isRedu === 2" class="jiantou shangActiveIcon"></i>
              </div>
              <div class="screenItem" @click="picSortTypeEvent(1)">
                <span :class="{ screenLabel: true, active: sortOrder === 1 }"
                  >单价</span
                >
                <i v-show="isPrice === null" class="jiantou xiajiantouIcon"></i>
                <i v-show="isPrice === 1" class="jiantou xiaActiveIcon"></i>
                <i v-show="isPrice === 2" class="jiantou shangActiveIcon"></i>
              </div>
              <div class="screenItem" @click="picSortTypeEvent(2)">
                <span :class="{ screenLabel: true, active: sortOrder === 2 }">
                  时间
                </span>
                <i v-show="isTime === null" class="jiantou xiajiantouIcon"></i>
                <i v-show="isTime === 1" class="jiantou xiaActiveIcon"></i>
                <i v-show="isTime === 2" class="jiantou shangActiveIcon"></i>
              </div>
              <div class="screenItem dateTime">
                <span class="screenLabel">上架时间</span>
                <el-date-picker
                  size="mini"
                  value-format="yyyy-MM-ddTHH:mm:ss"
                  v-model="searchForm.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </div>
              <div class="screenItem priceUnit">
                <span class="screenLabel">价格区间</span>
                <div class="intervalPrice">
                  <el-input
                    size="mini"
                    v-model="searchForm.minPrice"
                    placeholder="最低"
                  ></el-input>
                  <span class="line">-</span>
                  <el-input
                    size="mini"
                    v-model="searchForm.maxPrice"
                    placeholder="最高"
                  ></el-input>
                </div>
              </div>
              <el-button
                @click="picGetProducts"
                type="primary"
                style="margin-left: 10px"
                size="mini"
              >
                确定
              </el-button>
            </div>
            <div class="right">
              <div class="searchTime">
                查询用时：<span>{{ searchHttpTime }}</span
                >秒
              </div>
              <div
                :class="{ grid: true, active: isGrid === 'bsGridComponent' }"
                @click="handerIsGrid('bsGridComponent')"
              ></div>
              <div
                :class="{
                  column: true,
                  active: isGrid === 'bsColumnComponent'
                }"
                @click="handerIsGrid('bsColumnComponent')"
              ></div>
              <div class="line"></div>
              <div class="totalCount" style="margin-right: 20px">
                <span>共</span>
                <span class="totalCountText">{{ totalCount }}</span>
                <span>条数据</span>
              </div>
              <!-- <div class="myMinPagination">
                <div @click="firstEvent" class="first el-icon-arrow-left"></div>
                <div class="count">
                  <span class="pageIndex">{{ currentPage }}</span>
                  <span>/</span>
                  <span>{{ Math.ceil(totalCount / pageSize) }}</span>
                </div>
                <div @click="nextEvent" class="next el-icon-arrow-right"></div>
              </div> -->
            </div>
          </div>
          <div
            class="picProductListBox"
            :style="
              isGrid === 'bsColumnComponent'
                ? ' padding:0'
                : ' padding:0 20px 65px'
            "
          >
            <!-- 产品列表 -->
            <component
              :is="isGrid"
              :productList="productList"
              :selection="selection"
              :typeId="typeId"
            ></component>
          </div>
        </div>
      </template>
      <!-- vueCropper 剪裁图片实现-->
      <el-dialog
        title="图片剪裁"
        :visible.sync="isShowCropper"
        destroy-on-close
      >
        <div class="cropperWrap">
          <div class="cropper-content">
            <div class="cropper" style="text-align: center">
              <vueCropper
                ref="cropper"
                :img="option.img"
                :outputSize="option.outputSize"
                :outputType="option.outputType"
                :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight"
                :canScale="option.canScale"
                :info="option.info"
                :full="option.full"
                :canMove="option.canMove"
                :canMoveBox="option.canMoveBox"
                :original="option.original"
                :autoCrop="option.autoCrop"
                :fixed="option.fixed"
                :fixedNumber="option.fixedNumber"
                :centerBox="option.centerBox"
                :infoTrue="option.infoTrue"
                :fixedBox="option.fixedBox"
                :mode="option.mode"
              ></vueCropper>
            </div>
          </div>
          <center slot="footer" class="dialog-footer">
            <!-- <el-button type="info" @click="cropperCancel">取 消</el-button>
        <el-button
          type="primary"
          class="el-icon-refresh-left"
          @click="$refs.cropper.rotateLeft()"
          >左 旋 转</el-button
        >
        <el-button
          type="primary"
          class="el-icon-refresh-right"
          @click="$refs.cropper.rotateRight()"
          >右 旋 转</el-button
        > -->
            <el-button
              class="submitBtn"
              type="primary"
              @click="onCubeImg"
              :loading="loading"
              >确认</el-button
            >
          </center>
        </div>
      </el-dialog>
    </div>
    <div class="footer" v-if="totalCount >= 7">
      <img src="@/assets/images/footerBg.png" alt="" />
    </div>
  </div>
</template>

<script>
import bsProductSearch from "@/components/bsComponents/bsProductSearchComponent/bsProductSearch";
// import bsColumnComponent from "@/components/bsComponents/bsProductSearchComponent/bsColumnComponent";
import bsGridComponent from "@/components/bsComponents/bsProductSearchComponent/bsGridComponent";
import bsColumnComponent from "@/components/bsComponents/bsProductSearchComponent/bsTableItem";
import eventBus from "@/assets/js/common/eventBus";
import { mapState } from "vuex";
import { VueCropper } from "vue-cropper";
export default {
  name: "bsProductSearchIndex",
  components: {
    bsProductSearch,
    bsColumnComponent,
    bsGridComponent,
    VueCropper
  },
  data() {
    return {
      loading: false,
      selection: true,
      baseImg: null,
      fileinfo: null,
      isShowCropper: false,
      selectTableData: null,
      isIndeterminate: false,
      checkAll: false,
      advancedFormdata: {
        fa_no: "",
        ch_pa: "",
        pr_le: "",
        pr_wi: "",
        pr_hi: "",
        ou_le: "",
        ou_wi: "",
        ou_hi: "",
        in_le: "",
        in_wi: "",
        in_hi: ""
      },
      isUpInsetImg: true,
      screeningFlag: false, //高级搜索条件
      isAccurate: "模糊",
      chpaList: [],
      // 裁剪组件的基础配置option
      option: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        full: false, // 是否输出原图比例的截图
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "jpeg", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 1000, // 默认生成截图框宽度
        autoCropHeight: 500, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [2, 1], // 截图框的宽高比例
        canMove: true, // 图片是否可移动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      oneCurrentTag: null,
      cateChildren: [],
      categoryList: [],
      isPrice: null,
      isTime: null,
      isRedu: null,
      sortOrder: null,
      sortType: null,
      synthesis: false,
      productList: [],
      isGrid: "bsGridComponent",
      currentPage: 1,
      pageSize: 12,
      totalCount: 0,
      searchForm: {
        companyNumber: null,
        keyword: "",
        minPrice: "",
        maxPrice: "",
        categoryNumber: null,
        time: [],
        MyisGaoji: false,
        fa_no: true,
        number: false,
        name: true,
        packName: false
      },
      currentTwoTag: null,
      isOneDownCate: true,
      isTwoDownCate: true,
      searchHttpTime: null
    };
  },
  methods: {
    // 重新切图
    openCubeImg(img) {
      this.isShowCropper = true;
      this.option.img = img;
    },
    // 图搜
    uploadPic(file) {
      const isLt5M = file.size / 1024 / 1024 < 3;
      if (!isLt5M) {
        this.$common.handlerMsgState({
          msg: "上传文件大小不能超过 3MB!",
          type: "danger"
        });
        this.option.img = "";
        this.$refs.uploadRef.value = "";
        return false;
      }
      this.isShowCropper = true;
      this.fileinfo = file;
      // 选择成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        const f = window.URL.createObjectURL(file.raw);
        this.baseImg = this.option.img = f;
        this.dialogVisible = true;
      });
    },
    // 文字搜
    textSearchProducts() {
      this.currentPage = 1;
      this.getProductList(false);
    },
    handleIsgaoji(val) {
      this.$set(this.searchForm, "MyisGaoji", val);
      this.advancedFormdata = {};
    },
    // 确定裁剪图片
    onCubeImg() {
      this.isGrid = "bsGridComponent";
      this.loading = true;
      let startDate = Date.now();
      // 获取cropper的截图的base64 数据
      this.$refs.cropper.getCropBlob(async file => {
        const urlPreView = window.URL.createObjectURL(file);
        this.option.img = urlPreView;
        this.$store.commit("handlerSearchImgPreview", {
          img: urlPreView,
          baseImg: this.baseImg
        });
        // 上传
        try {
          const companynumber =
            this.$store.state.userInfo.commparnyList[0] &&
            this.$store.state.userInfo.commparnyList[0].companyNumber;
          const fd = new FormData();
          if (
            this.searchHallCate &&
            this.searchHallCate.companyInfo &&
            this.searchHallCate.companyInfo.companyNumber
          ) {
            fd.append(
              "hallNumber",
              this.searchHallCate.companyInfo.companyNumber
            );
          }
          fd.append("companynumber", companynumber);
          fd.append("file", file);
          const res = await this.$http.post("/api/File/SearchPicture", fd);
          if (res.data.result.code === 200) {
            let endDate = Date.now();
            this.searchHttpTime = (endDate - startDate) / 1000;
            this.$store.commit("searchValues", res.data.result.object);
            this.selection = false;
            this.productList = res.data.result.object;
            this.totalCount = res.data.result.object.length;
            this.cropperCancel();
          } else {
            // this.$store.commit("searchValues", []);
            this.cropperCancel();
            this.$common.handlerMsgState({
              msg: res.data.result.message,
              type: "danger"
            });
          }
        } catch (error) {
          this.cropperCancel();
        }
      });
    },
    // 获取公司下的员工列表
    async getStaffList() {
      const res = await this.$http.post("/api/CompanyUserList", {
        orgCompanyID: this.currentComparnyId
      });
      if (res.data.result.code === 200) {
        this.staffList = res.data.result.item.personnels;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    // 取消裁剪
    cropperCancel() {
      this.$refs.cropper.clearCrop();
      this.isShowCropper = false;
      this.option.img = "";
      this.loading = false;
    },
    async picGetProducts() {
      let startDate = Date.now();
      const fd = {
        hallNumber: this.searchForm.companyNumber,
        minPrice: this.searchForm.minPrice,
        maxPrice: this.searchForm.maxPrice,
        startTime: this.searchForm.time.length ? this.searchForm.time[0] : null,
        endTime: this.searchForm.time.length ? this.searchForm.time[1] : null,
        sortOrder: this.sortOrder,
        sortType: this.sortType
      };
      fd.productNumberList = this.imageSearchValue.map(val => ({
        productNumber: val.productNumber,
        orderBy: val.orderBy
      }));
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "")
          delete fd[key];
      }
      const res = await this.$http.post("/api/SearchPictureSortScreen", fd);
      if (res.data.result.code === 200) {
        this.productList = res.data.result.item;
        this.totalCount = this.productList.length;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
      let endDate = Date.now();
      this.searchHttpTime = (endDate - startDate) / 1000;
    },
    // 图搜过滤类型
    picSortTypeEvent(type) {
      this.sortOrder = type;
      switch (type) {
        case 1:
          this.sortType = this.isPrice =
            this.isPrice === null ? 1 : this.isPrice === 1 ? 2 : null;
          this.sortType = null;
          this.isTime = null;
          this.isRedu = null;
          this.sortType = this.isPrice;
          this.sortType === null && (this.sortOrder = null);
          break;
        case 2:
          this.isTime = this.isTime === null ? 1 : this.isTime === 1 ? 2 : null;
          this.sortType = null;
          this.isPrice = null;
          this.isRedu = null;
          this.sortType = this.isTime;
          this.sortType === null && (this.sortOrder = null);
          break;
        case 3:
          this.isRedu = this.isRedu === null ? 1 : this.isRedu === 1 ? 2 : null;
          this.sortType = null;
          this.isPrice = null;
          this.isTime = null;
          this.sortType = this.isRedu;
          this.sortType === null && (this.sortOrder = null);
          break;
        default:
          this.isPrice = null;
          this.isTime = null;
          this.isRedu = null;
          this.sortType = null;
          this.sortOrder = null;
          break;
      }
      this.picGetProducts();
    },
    // 过滤类型
    sortTypeEvent(type) {
      this.sortOrder = type;
      switch (type) {
        case 1:
          this.sortType = this.isPrice =
            this.isPrice === null ? 1 : this.isPrice === 1 ? 2 : null;
          this.sortType = null;
          this.isTime = null;
          this.isRedu = null;
          this.sortType = this.isPrice;
          this.sortType === null && (this.sortOrder = null);
          break;
        case 2:
          this.isTime = this.isTime === null ? 1 : this.isTime === 1 ? 2 : null;
          this.sortType = null;
          this.isPrice = null;
          this.isRedu = null;
          this.sortType = this.isTime;
          this.sortType === null && (this.sortOrder = null);
          break;
        case 3:
          this.isRedu = this.isRedu === null ? 1 : this.isRedu === 1 ? 2 : null;
          this.sortType = null;
          this.isPrice = null;
          this.isTime = null;
          this.sortType = this.isRedu;
          this.sortType === null && (this.sortOrder = null);
          break;
        default:
          this.isPrice = null;
          this.isTime = null;
          this.isRedu = null;
          this.sortType = null;
          this.sortOrder = null;
          break;
      }
      this.getProductList(false);
    },
    // 获取产品列表请求
    async getProductList(flag) {
      this.$store.commit("searchValues", null);
      let startDate = Date.now();
      const fd = {
        name: this.searchForm.keyword,
        hallNumber: this.searchForm.companyNumber,
        skipCount: this.currentPage,
        maxResultCount: this.pageSize,
        categoryNumber: this.searchForm.categoryNumber,
        minPrice: this.searchForm.minPrice,
        maxPrice: this.searchForm.maxPrice,
        startTime: this.searchForm.time.length ? this.searchForm.time[0] : null,
        endTime: this.searchForm.time.length ? this.searchForm.time[1] : null,
        // precisionSearch: JSON.stringify({
        //   fa_no: this.searchForm.fa_no ? 1 : 0,
        //   number: this.searchForm.number ? 1 : 0,
        //   name: this.searchForm.name ? 1 : 0,
        //   packName: this.searchForm.packName ? 1 : 0
        // }),
        sortOrder: this.sortOrder,
        sortType: this.sortType,
        // 高级搜索条件
        isUpInsetImg: this.isUpInsetImg,
        isUpInset3D: this.addrSearch,
        fa_no: this.advancedFormdata.fa_no,
        ch_pa: this.advancedFormdata.ch_pa,
        pr_le: this.advancedFormdata.pr_le,
        pr_wi: this.advancedFormdata.pr_wi,
        pr_hi: this.advancedFormdata.pr_hi,
        ou_le: this.advancedFormdata.ou_le,
        ou_wi: this.advancedFormdata.ou_wi,
        ou_hi: this.advancedFormdata.ou_hi,
        in_le: this.advancedFormdata.in_le,
        in_wi: this.advancedFormdata.in_wi,
        in_hi: this.advancedFormdata.in_hi
      };
      switch (this.isAccurate) {
        case "精准":
          fd.precisionSearch = JSON.stringify({
            fa_no: this.searchForm.fa_no ? 2 : 0,
            name: this.searchForm.name ? 2 : 0,
            number: this.searchForm.number ? 2 : 0,
            packName: this.searchForm.packName ? 2 : 0
          });
          break;
        default:
          fd.precisionSearch = JSON.stringify({
            fa_no: this.searchForm.fa_no ? 1 : 0,
            name: this.searchForm.name ? 1 : 0,
            number: this.searchForm.number ? 1 : 0,
            packName: this.searchForm.packName ? 1 : 0
          });
          break;
      }
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "")
          delete fd[key];
      }

      const res = await this.$http.post("/api/SearchBearProductPage", fd);
      const { code, item, msg } = res.data.result;
      if (code === 200) {
        if (this.typeId === 1) {
          for (let i = 0; i < item.items.length; i++) {
            this.$set(item.items[i], "isShoppingUpdate", false);
            for (let j = 0; j < this.offerProductList.length; j++) {
              if (
                item.items[i].productNumber ===
                this.offerProductList[j].productNumber
              ) {
                this.$set(item.items[i], "isShoppingUpdate", true);
              }
            }
          }
        }
        if (Object.values(this.advancedFormdata).some(Boolean)) {
          this.$set(this.searchForm, "MyisGaoji", true);
        }
        this.productList = item.items;
        this.totalCount = item.totalCount;
        let endDate = Date.now();
        this.searchHttpTime = (endDate - startDate) / 1000;
      } else {
        this.totalCount = 0;
        this.$common.handlerMsgState({
          msg: msg,
          type: "danger"
        });
      }
      if (flag) {
        this.getProductCategoryList();
      }
    },
    // 切換頁容量
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      if (
        this.currentPage * pageSize > this.totalCount &&
        this.currentPage != 1
      )
        return false;
      this.getProductList(false);
    },
    // 修改当前页
    handleCurrentChange(page) {
      eventBus.$emit("toTop");
      this.currentPage = page;
      this.getProductList(false);
    },
    // 获取产品类目列表
    async getProductCategoryList() {
      const res = await this.$http.post("/api/ProductCategoryList", {});
      if (res.data.result.code === 200) {
        this.categoryList = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    //   获取包装方式
    async GetProductChpaList() {
      const res = await this.$http.post("/api/GetProductChpaList", {});
      if (res.data.result.code === 200) {
        this.chpaList = res.data.result.item;
      } else {
        this.$common.handlerMsgState({
          msg: res.data.result.msg,
          type: "danger"
        });
      }
    },
    handleraddrSearchChange(val) {
      this.$store.commit("handleraddrSearch", val);
    },
    // 选择综合
    async handleSynthesis() {
      this.synthesis = !this.synthesis;
      if (!this.synthesis) {
        this.isAccurate = "模糊";
        this.searchForm.number = false;
        this.searchForm.fa_no = true;
        this.searchForm.name = true;
        this.searchForm.packName = 0;
      } else {
        this.isAccurate = "精准";
        this.searchForm.fa_no = true;
        this.searchForm.name = true;
      }
    },
    // 选择筛选
    handleCheckedScreensChange(flag) {
      if (
        this.searchForm.fa_no === false &&
        this.searchForm.number === false &&
        this.searchForm.name === false
      ) {
        this.isAccurate = "模糊";
        this.$refs.searchRef.synthesis = false;
      }
      if (flag) {
        this.synthesis = false;
      }
    },
    //是否精准
    handleIsAccurate(flag) {
      this.isAccurate = flag;
      if (flag === "模糊") {
        this.searchForm.fa_no = true;
        this.searchForm.name = true;
        this.synthesis = false;
        this.$refs.searchRef.synthesis = false;
      } else {
        this.synthesis = true;
        this.searchForm.fa_no = true;
        this.searchForm.name = true;
        this.$refs.searchRef.synthesis = true;
      }
    },
    //高级搜索
    async screeningShow() {
      this.screeningFlag = !this.screeningFlag;
    },
    // 确认高级搜索
    confirmAdvanced() {
      // this.searchForm.keyword = this.$refs.searchRef.searchForm.keyword;
      this.getProductList(false);
    },
    // 切换产品列表样式
    handerIsGrid(type) {
      this.isGrid = type;
    },
    // 上一页
    firstEvent() {
      if (this.currentPage === 1) {
        this.$common.handlerMsgState({
          msg: "已经是第一页了",
          type: "danger"
        });
        return false;
      }
      this.currentPage--;
      this.getProductList(false);
    },
    // 下一页
    nextEvent() {
      const totalPage = Math.ceil(this.totalCount / this.pageSize);
      if (totalPage <= this.currentPage) {
        this.$common.handlerMsgState({
          msg: "已经是第最后一页了",
          type: "danger"
        });
        return false;
      }
      this.currentPage++;
      this.getProductList(false);
    },
    // 展厅分类点击事件
    hallTagEvent(item) {
      this.searchForm.categoryNumber = item ? item.categoryNumber : item;
      this.getProductList(false);
    },
    // 一级分类点击事件
    oneTagEvent(item) {
      this.currentTwoTag = null;
      this.oneCurrentTag = item;
      this.cateChildren = item ? item.children : [];
      this.searchForm.categoryNumber = item ? item.id : item;
      this.getProductList(false);
    },
    // 二级分类点击事件
    twoTagEvent(id) {
      this.currentTwoTag = id;
      this.searchForm.categoryNumber = id || this.oneCurrentTag.id;
      this.getProductList(false);
    },
    // 展开一级分类
    handlerOneCateLabel() {
      this.isOneDownCate = !this.isOneDownCate;
    },
    // 展开二级分类
    handlerTwoCateLabel() {
      this.isTwoDownCate = !this.isTwoDownCate;
    },
    clearRootEvent() {
      eventBus.$off("searchProducts");
      eventBus.$off("openUpload");
      eventBus.$off("addrsearchProducts");
      eventBus.$off("resetProductIsShop");
      eventBus.$off("handleSelectionChangeBus");
    },
    // 关闭关联搜索
    closeTag() {
      this.$store.commit("handlerHallSearchCate", null);
      this.searchForm.categoryNumber = null;
      this.searchForm.companyNumber = null;
      this.$common.handlerMsgState({
        msg: "关闭关联搜索",
        type: "warning"
      });
    },
    // 点击全选
    handleCheckAllChange(val) {
      let myTableRef = this.$refs.componentRef.$refs.bsTableItemRef.$refs
        .myTableRef;
      if (val) myTableRef.toggleAllSelection();
      else myTableRef.clearSelection();
      this.isIndeterminate = false;
    },
    // 一键加购
    handelrPurchased() {
      this.$confirm("确定要加购选中的产品吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          const selectProducts = this.$refs.componentRef.$refs.bsTableItemRef
            .$refs.myTableRef.selection;

          let productNumber = [];
          for (let i = 0; i < selectProducts.length; i++) {
            productNumber.push(selectProducts[i].productNumber);
          }
          const fd = {
            userID: this.userInfo.userInfo.id,
            companyNumber: this.userInfo.commparnyList[0].companyNumber,
            sourceFrom: "active",
            number: 1,
            currency: "￥",
            Price: 0,
            shopType: "companysamples",
            productNumber: productNumber.join()
          };
          const res = await this.$http.post("/api/AddShoppingCart", fd);
          if (res.data.result.code === 200) {
            this.$store.commit(
              "handlerShoppingCartCount",
              res.data.result.item
            );
            this.$common.handlerMsgState({
              msg: " 一键加购成功",
              type: "success"
            });
            this.getProductList(false);
          } else {
            this.$common.handlerMsgState({
              msg: " 一键加购失败",
              type: "danger"
            });
          }
        })
        .catch(() => {
          this.$common.handlerMsgState({
            msg: "已取消一键加购",
            type: "warning"
          });
        });
    }
  },
  created() {},
  mounted() {
    // 选择中的产品
    eventBus.$on("handleSelectionChangeBus", selection => {
      this.selectTableData = selection;
      if (selection.length) {
        if (selection.length === this.productList.length) {
          this.isIndeterminate = false;
          this.checkAll = true;
        } else this.isIndeterminate = true;
      } else {
        this.isIndeterminate = false;
        this.checkAll = false;
      }
    });

    // 点击搜索-文字搜索
    eventBus.$on("searchProducts", () => {
      this.currentPage = 1;
      this.getProductList(false);
    });
    // 图搜
    eventBus.$on("openUpload", file => {
      this.uploadPic(file);
    });
    // 取消或加购样式/刷新页面
    eventBus.$on("resetProductIsShop", item => {
      for (let i = 0; i < this.productList.length; i++) {
        if (this.productList[i].productNumber == item.productNumber) {
          this.productList[i].isShop = item.isShop;
        }
      }
    });

    // 取消收藏/刷新页面
    eventBus.$on("resetProductCollection", item => {
      // this.getProductList();
      for (let i = 0; i < this.productList.length; i++) {
        if (this.productList[i].productNumber == item.productNumber) {
          this.productList[i].isFavorite = item.isFavorite;
        }
      }
    });

    this.$nextTick(async () => {
      if (this.searchTxt != "") {
        // 首页文字搜索跳转
        this.searchForm.keyword = this.searchTxt;
        this.currentPage = 1;
        await this.getProductList(true);
        await this.GetProductChpaList();
        this.$store.commit("handlerSearchTxt", "");
      } else if (this.searchHallCate) {
        // 展厅主页带分类搜索
        this.currentPage = 1;
        this.searchForm.keyword = this.searchHallCate.keyword;
        this.searchForm.categoryNumber =
          this.searchHallCate.cate && this.searchHallCate.cate.categoryNumber;
        this.searchForm.companyNumber =
          this.searchHallCate.companyInfo &&
          this.searchHallCate.companyInfo.companyNumber;
        this.isOneDownCate = false;
        this.getProductList(false);
      } else if (this.imgSearch) {
        eventBus.$emit("imgSearchChange");
        this.GetProductChpaList();
        this.getProductCategoryList();
      } else {
        // 默认搜索
        this.currentPage = 1;
        await this.getProductList(true);
        await this.GetProductChpaList();
      }
    });
  },
  computed: {
    addrSearch: {
      get() {
        return this.$store.state.addrSearch;
      },
      set(val) {
        this.$store.commit("handleraddrSearch", val);
      }
    },
    ...mapState([
      "myColles",
      "searchTxt",
      "searchHallCate",
      "imgSearch",
      "typeId",
      "userInfo",
      "imageSearchValue",
      "offerProductList",
      "searchImgPreview",
      "currentComparnyId"
    ])
  },
  watch: {
    searchHallCate: {
      deep: true,
      handler(val) {
        if (val) {
          this.currentPage = 1;
          this.isOneDownCate = false;
          // 展厅主页带分类搜索
          this.searchForm.keyword = this.searchHallCate.keyword;
          this.searchForm.categoryNumber =
            this.searchHallCate.cate && this.searchHallCate.cate.categoryNumber;
          this.searchForm.companyNumber =
            this.searchHallCate.companyInfo &&
            this.searchHallCate.companyInfo.companyNumber;
          this.getProductList(true);
        }
      }
    },
    advancedFormdata: {
      deep: true,
      handler(val) {
        if (!Object.values(val).some(Boolean)) {
          this.$set(this.searchForm, "MyisGaoji", false);
        }
      }
    },

    "searchForm.time"(newVal) {
      if (newVal == null) {
        this.searchForm.time = [];
      }
    }
  },
  beforeDestroy() {
    this.clearRootEvent();
    this.$store.commit("handlerHallSearchCate", null);
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.productSearch {
  .advancedSearchBox {
    background-color: #fff;
    width: 100%;
    .advancedScreening,
    .standardScreening,
    .productClass,
    .twoLevelClass {
      padding: 20px;
      padding-top: 0;
      .myLabel {
        margin-right: 15px;
      }
    }
    @{deep} .standardScreening {
      display: flex;
      .el-checkbox {
        .el-checkbox__input {
          border-radius: 50%;
          .el-checkbox__inner {
            border-radius: 50%;
          }
        }
      }
    }
    @{deep} .advancedScreening {
      display: flex;
      height: 114px;

      .el-checkbox {
        .el-checkbox__input {
          border-radius: 50%;
          .el-checkbox__inner {
            border-radius: 50%;
          }
        }
      }
      .title {
        height: 114px;
        display: flex;
        align-items: center;
      }
      .queryCondition {
        width: 383px;
        height: 114px;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        padding: 20px 10px;
        margin: 0 20px;
        box-sizing: border-box;
        .item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          .text {
            width: 80px;
            text-align: right;
          }
        }
      }
      .parameter {
        height: 114px;
        width: 700px;
        form {
          display: flex;
          .abbrLabel {
            .el-form-item__label {
              width: 82px;
            }
          }
          .el-form-item {
            height: 30px;
            display: flex;
            align-items: center;
            color: #999999;
            text-align: center;
            margin-bottom: 12px;
            line-height: 30px;
            .el-form-item__label {
              height: 30px;
              line-height: 30px;
            }
            .el-form-item__content {
              line-height: 30px;
              .el-input--medium .el-input__inner {
                height: 30px;
                line-height: 30px;
              }
            }
          }
          .hx {
            text-align: center;
            padding: 0 6px;
          }
          .left {
            flex: 1;
            padding: 0 15px;
          }
        }
      }
    }
    .productClass,
    .twoLevelClass {
      display: flex;
      .myLabel {
        padding-top: 20px;
      }
      .topLine {
        border-top: 1px solid #dcdfe6;
        .develop {
          background: #ffffff;
          border: 1px solid #dcdfe6;
          border-radius: 5px;
          width: 68px;
          height: 30px;
          margin-top: 13px;
          line-height: 30px;
          text-align: center;
          box-sizing: border-box;
          cursor: pointer;
          .zhankai {
            margin-right: 5px;
          }
        }
      }
      .tags {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid #dcdfe6;
        padding-top: 13px;
        .itemTag {
          padding: 5px 12px;
          margin-bottom: 2px;
          border-radius: 4px;
          cursor: pointer;
          &.isActive {
            background-color: #3368a9;
            color: #fff;
          }
        }
        &.showOneCate {
          max-height: 61px;
          overflow: hidden;
        }
        &.showTwoCate {
          max-height: 30px;
          overflow: hidden;
        }
      }
    }
  }
  .productsWrap {
    margin-top: 20px;
    background-color: #fff;
    .screenBox {
      width: 100%;
      height: 50px;
      background-color: #f9fafc;
      display: flex;
      align-items: center;
      .left {
        flex: 1;
        display: flex;
        align-items: center;
        .screenItem {
          margin-left: 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 5px;
          &.priceUnit,
          &.dateTime {
            cursor: default;
            @{deep} .el-date-editor {
              width: 210px;
              box-sizing: border-box;
              padding-left: 16px;
              .el-icon-date {
                display: none;
              }
            }
          }
          .screenLabel {
            margin-right: 10px;
            &.active {
              color: #3368a9;
              font-weight: bold;
            }
          }
          .jiantou {
            width: 9px;
            height: 16px;
            opacity: 1;
          }
          .xiajiantouIcon {
            background: url("~@/assets/images/xiajiantou.png") no-repeat center;
            background-size: contain;
          }
          .xiaActiveIcon {
            background: url("~@/assets/images/xiaActive.png") no-repeat center;
            background-size: contain;
          }
          .shangActiveIcon {
            background: url("~@/assets/images/shangActive.png") no-repeat center;
            background-size: contain;
          }
          .el-date-editor {
            width: 210px;
          }
          .intervalPrice {
            width: 130px;
            display: flex;
            align-items: center;
            .line {
              margin: 0 5px;
            }
          }
        }
      }
      .right {
        width: 500px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .searchTime {
          margin-right: 40px;
          span {
            color: #3368a9;
          }
        }
        .grid,
        .column {
          width: 17px;
          height: 17px;
          margin-right: 25px;
          cursor: pointer;
        }
        .grid {
          background: url("~@/assets/images/gridIcon.png") no-repeat center;
          background-size: contain;
          &.active {
            background: url("~@/assets/images/gridActiveIcon.png") no-repeat
              center;
            background-size: contain;
          }
        }
        .column {
          background: url("~@/assets/images/columnIcon.png") no-repeat center;
          background-size: contain;
          &.active {
            background: url("~@/assets/images/columnActiveIcon.png") no-repeat
              center;
            background-size: contain;
          }
        }
        .line {
          width: 1px;
          height: 100%;
          opacity: 1;
          background: #e9e9e9;
        }
        .totalCount {
          margin-left: 15px;
          .totalCountText {
            color: #eb1515;
          }
        }
        .myMinPagination {
          width: 110px;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          margin-left: 20px;
          .first,
          .next {
            cursor: pointer;
          }
          .count {
            .pageIndex {
              color: #ff760e;
            }
          }
        }
      }
    }
    .productListBox {
      background-color: #fff;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .myPagination {
        padding: 30px 0;
      }
      .leftCheckbox {
        display: flex;
        align-items: center;
        width: 80%;

        .left {
          display: flex;
          align-items: center;
          padding: 0 300px 0 20px;
          .purchased {
            margin-left: 30px;
            color: #3368a9;
            border: 1px solid #3368a9;
            .selectionCart {
              display: inline-block;
              vertical-align: bottom;
              width: 14px;
              height: 14px;
              background: url("~@/assets/images/selectionCart.png") no-repeat
                center;
              background-size: contain;
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
  // 图搜样式
  .picSearchBox {
    background-color: #fff;
    padding: 20px;
    .screenBox {
      width: 100%;
      height: 50px;
      background-color: #f9fafc;
      display: flex;
      align-items: center;
      .left {
        flex: 1;
        display: flex;
        align-items: center;
        .screenItem {
          margin-left: 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 5px;
          &.priceUnit,
          &.dateTime {
            cursor: default;
            @{deep} .el-date-editor {
              width: 210px;
              box-sizing: border-box;
              padding-left: 16px;
              .el-icon-date {
                display: none;
              }
            }
          }
          .screenLabel {
            margin-right: 10px;
            &.active {
              color: #3368a9;
              font-weight: bold;
            }
          }
          .jiantou {
            width: 9px;
            height: 16px;
            opacity: 1;
          }
          .xiajiantouIcon {
            background: url("~@/assets/images/xiajiantou.png") no-repeat center;
            background-size: contain;
          }
          .xiaActiveIcon {
            background: url("~@/assets/images/xiaActive.png") no-repeat center;
            background-size: contain;
          }
          .shangActiveIcon {
            background: url("~@/assets/images/shangActive.png") no-repeat center;
            background-size: contain;
          }
          .el-date-editor {
            width: 210px;
          }
          .intervalPrice {
            width: 130px;
            display: flex;
            align-items: center;
            .line {
              margin: 0 5px;
            }
          }
        }
      }
      .right {
        width: 500px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .searchTime {
          margin-right: 40px;
          span {
            color: #3368a9;
          }
        }
        .grid,
        .column {
          width: 17px;
          height: 17px;
          margin-right: 25px;
          cursor: pointer;
        }
        .grid {
          background: url("~@/assets/images/gridIcon.png") no-repeat center;
          background-size: contain;
          &.active {
            background: url("~@/assets/images/gridActiveIcon.png") no-repeat
              center;
            background-size: contain;
          }
        }
        .column {
          background: url("~@/assets/images/columnIcon.png") no-repeat center;
          background-size: contain;
          &.active {
            background: url("~@/assets/images/columnActiveIcon.png") no-repeat
              center;
            background-size: contain;
          }
        }
        .line {
          width: 1px;
          height: 100%;
          opacity: 1;
          background: #e9e9e9;
        }
        .totalCount {
          margin-left: 15px;
          .totalCountText {
            color: #eb1515;
          }
        }
        .myMinPagination {
          width: 110px;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          margin-left: 20px;
          .first,
          .next {
            cursor: pointer;
          }
          .count {
            .pageIndex {
              color: #ff760e;
            }
          }
        }
      }
    }
    .searchInput {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .resultTitle {
      padding: 20px 0;
    }
    .resultBox {
      height: 170px;
      border-top: 1px solid #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
      box-sizing: border-box;
      padding: 10px 0;
      display: flex;
      .middle {
        flex: 1;
        .preview {
          width: 100%;
          height: 148px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          .imgBox {
            position: relative;
            right: 100px;
            .miniImg {
              position: absolute;
              right: -100px;
              top: 0;
              width: 100px;
              height: 100px;
              box-shadow: 0px 3px 9px 0px rgba(0, 59, 199, 0.2);
              background-color: #fff;
              z-index: 1;
              .el-image {
                width: 100%;
                height: 100%;
                cursor: pointer;
                @{deep} img {
                  transition: all 1s;
                  &:hover {
                    -webkit-transform: scale(1.1);
                    -moz-transform: scale(1.1);
                    -ms-transform: scale(1.1);
                    transform: scale(1.1);
                  }
                }
              }
            }
            .el-image {
              width: 200px;
              height: 100%;
              cursor: pointer;
              @{deep} img {
                transition: all 1s;
                &:hover {
                  -webkit-transform: scale(1.1);
                  -moz-transform: scale(1.1);
                  -ms-transform: scale(1.1);
                  transform: scale(1.1);
                }
              }
            }
          }
        }
      }
      .left,
      .right {
        width: 250px;
        min-width: 250px;
        .totalCountBox {
          margin-top: 128px;
          .total {
            margin-left: 40px;
            .text {
              color: #eb1515;
            }
          }
        }
      }
    }
  }
}
.footer {
  margin-top: 20px;
  background-color: #f1f3f6;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
