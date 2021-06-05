<template>
  <el-form label-width="100px" :model="synthesizeFromData">
    <div class="item">
      <el-form-item label="厂商名称:">
        <el-input
          size="small"
          style="width:160px"
          v-model="synthesizeFromData.ma_na"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系人:">
        <el-input
          size="small"
          style="width:160px"
          v-model="synthesizeFromData.linkman"
        ></el-input>
      </el-form-item>
      <el-form-item label="电话:">
        <el-input
          size="small"
          style="width:160px"
          v-model="synthesizeFromData.ma_ph_1"
        ></el-input>
      </el-form-item>
    </div>
    <div class="item">
      <el-form-item label="手机:">
        <el-input
          size="small"
          onkeyup="value=value.replace(/[^\d.]/g,'')"
          style="width:160px"
          v-model.number="synthesizeFromData.handset"
        ></el-input>
      </el-form-item>
      <el-form-item label="价格区间:">
        <div class="felxBox">
          <el-input
            size="small"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            style="width:68px"
            placeholder="最低"
            v-model="synthesizeFromData.minPrice"
          ></el-input>
          <p>-</p>
          <el-input
            size="small"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            style="width:68px"
            placeholder="最高"
            v-model="synthesizeFromData.maxPrice"
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="种类名称:">
        <el-select
          size="small"
          style="width:160px"
          v-model="synthesizeFromData.categoryNumber"
          placeholder="请选择"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </div>
    <div class="item">
      <el-form-item label="品名:">
        <el-input
          size="small"
          style="width:290px"
          v-model="synthesizeFromData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="英文品名:">
        <el-input
          size="small"
          style="width:290px"
          v-model="synthesizeFromData.eName"
        ></el-input>
      </el-form-item>
    </div>
    <div class="item">
      <el-form-item label="货号:">
        <el-input
          size="small"
          style="width:290px"
          placeholder="多货号查询以“，”隔开"
          v-model="synthesizeFromData.fa_no"
        ></el-input>
      </el-form-item>
      <el-form-item label="包装方式:">
        <el-select
          size="small"
          style="width:100px"
          v-model="synthesizeFromData.ch_pa"
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
      <el-form-item label="英文包装:" label-width="80px">
        <el-input
          size="small"
          style="width:100px"
          v-model="synthesizeFromData.en_pa"
        ></el-input>
      </el-form-item>
    </div>
    <div class="item">
      <el-form-item label="外箱装量:">
        <el-input
          size="small"
          onkeyup="value=value.replace(/[^\d.]/g,'')"
          style="width:100px"
          v-model="synthesizeFromData.ou_lo"
        ></el-input>
      </el-form-item>
      <el-form-item label="内盒个数:" label-width="80px">
        <el-input
          size="small"
          onkeyup="value=value.replace(/[^\d.]/g,'')"
          style="width:100px"
          v-model="synthesizeFromData.in_en"
        ></el-input>
      </el-form-item>
      <el-form-item label="证书认证:">
        <el-input
          size="small"
          style="width:290px"
          v-model="synthesizeFromData.certificateNumber"
        ></el-input>
      </el-form-item>
    </div>
    <div class="item">
      <el-form-item label="外箱毛重:">
        <el-input
          size="small"
          onkeyup="value=value.replace(/[^\d.]/g,'')"
          style="width:100px"
          v-model="synthesizeFromData.gr_we"
        ></el-input>
      </el-form-item>
      <el-form-item label="外箱净重:" label-width="80px">
        <el-input
          size="small"
          onkeyup="value=value.replace(/[^\d.]/g,'')"
          style="width:100px"
          v-model="synthesizeFromData.ne_we"
        ></el-input>
      </el-form-item>
      <el-form-item label="外箱材积:">
        <el-input
          size="small"
          onkeyup="value=value.replace(/[^\d.]/g,'')"
          style="width:100px"
          v-model="synthesizeFromData.bulk_feet"
        ></el-input>
      </el-form-item>
      <el-form-item label="外箱体积:" label-width="80px">
        <el-input
          size="small"
          onkeyup="value=value.replace(/[^\d.]/g,'')"
          style="width:100px"
          v-model="synthesizeFromData.bulk_stere"
        ></el-input>
      </el-form-item>
    </div>
    <div class="item">
      <el-form-item label="产品规格:">
        <div class="felxBox">
          <el-input
            size="small"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            style="width:80px"
            placeholder="长"
            v-model="synthesizeFromData.pr_le"
          ></el-input>
          <p>-</p>
          <el-input
            size="small"
            style="width:80px"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            placeholder="宽"
            v-model="synthesizeFromData.pr_wi"
          ></el-input>
          <p>-</p>
          <el-input
            size="small"
            style="width:80px"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            placeholder="高"
            v-model="synthesizeFromData.pr_hi"
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item label="时间:">
        <el-date-picker
          size="small"
          style="width:290px"
          value-format="yyyy-MM-ddTHH:mm:ss"
          v-model="synthesizeFromData.time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
    </div>
    <div class="item">
      <el-form-item label="包装规格:">
        <div class="felxBox">
          <el-input
            size="small"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            style="width:80px"
            placeholder="长"
            v-model="synthesizeFromData.iu_le"
          ></el-input>
          <p>-</p>
          <el-input
            size="small"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            style="width:80px"
            placeholder="宽"
            v-model="synthesizeFromData.iu_wi"
          ></el-input>
          <p>-</p>
          <el-input
            size="small"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            style="width:80px"
            placeholder="高"
            v-model="synthesizeFromData.iu_hi"
          ></el-input>
        </div>
      </el-form-item>
    </div>
    <div class="item">
      <el-form-item label="外箱规格:">
        <div class="felxBox">
          <el-input
            size="small"
            style="width:80px"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            placeholder="长"
            v-model="synthesizeFromData.ou_le"
          ></el-input>
          <p>-</p>
          <el-input
            size="small"
            style="width:80px"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            placeholder="宽"
            v-model="synthesizeFromData.ou_wi"
          ></el-input>
          <p>-</p>
          <el-input
            size="small"
            style="width:80px"
            onkeyup="value=value.replace(/[^\d.]/g,'')"
            placeholder="高"
            v-model="synthesizeFromData.ou_hi"
          ></el-input>
        </div>
      </el-form-item>
    </div>
    <div class="item">
      <el-form-item label="">
        <el-checkbox v-model="synthesizeFromData.isUpInsetImg"
          >是否有图</el-checkbox
        >
        <el-checkbox v-model="synthesizeFromData.isUpInset3D"
          >3D产品</el-checkbox
        >
        <el-checkbox v-model="synthesizeFromData.isNew">最新产品</el-checkbox>
        <el-checkbox v-model="synthesizeFromData.isHot">热销产品</el-checkbox>
        <el-checkbox v-model="synthesizeFromData.isVip">VIP产品</el-checkbox>
        <el-checkbox v-model="synthesizeFromData.isSpotGoods"
          >现货产品</el-checkbox
        >
      </el-form-item>
    </div>
    <div class="item">
      <div class="labelBox">查询历史:</div>
      <div class="text">
        <span v-for="(item, i) in historyText" :key="i"> {{ item }}, </span>
      </div>
    </div>
    <center style="margin-top:26px">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
        <el-button @click="handleClear">重 置</el-button>
      </span>
    </center>
  </el-form>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "",
  props: {
    categoryList: {
      type: Array
    },
    chpaList: {
      type: Array
    }
  },
  computed: {
    ...mapState(["historyText"])
  },
  data() {
    return {
      synthesizeFromData: {
        searchType: 1, //0-默认，1-综合搜索
        pa_nu: null, //包装编号
        productNumber: null, //产品编号
        ma_na: null, //厂名
        linkman: null, //联系人
        ma_ph_1: "", //电话
        handset: "", //手机
        minPrice: "", //最低价格
        maxPrice: "", //最高价格
        categoryNumber: "", //产品分类编号
        name: "", //品名
        eName: "", //英文品名
        fa_no: "", //出厂货号
        ch_pa: "", //包装名称
        en_pa: "", //英文包装名称
        ou_lo: "", //外箱装量
        in_en: "", //内盒个数
        certificateNumber: "", //证书认证编号
        gr_we: "", //外箱毛重
        ne_we: "", //外箱净重
        bulk_feet: "", //外箱材积
        bulk_stere: "", //外箱体积
        pr_le: "", //样品长度
        pr_wi: "", //样品宽度
        pr_hi: "", //样品高度
        time: "", //时间
        iu_le: "", //包装长
        iu_wi: "", //包装宽
        iu_hi: "", //包装高
        ou_le: "", //外箱长度
        ou_wi: "", //外箱宽度
        ou_hi: "", //外箱高度
        isUpInsetImg: true, //是否有图
        isUpInset3D: false, //是否有3D产品
        isNew: false, //最新产品
        isHot: false, //热销产品
        isVip: false, //vip产品
        isSpotGoods: false //现货产品
      },
      options: [],
      cities: []
    };
  },
  created() {},
  mounted() {},
  methods: {
    //   确定
    handleConfirm() {
      this.synthesizeFromData.startTime = this.synthesizeFromData.time.length
        ? this.synthesizeFromData.time[0]
        : null;
      this.synthesizeFromData.endTime = this.synthesizeFromData.time.length
        ? this.synthesizeFromData.time[0]
        : null;

      this.synthesizeFromData.fa_no = this.synthesizeFromData.fa_no.replace(
        /，/g,
        ","
      );
      this.$emit("handelSynthesize", this.synthesizeFromData);
    },
    //重置
    handleClear() {
      this.synthesizeFromData = {
        searchType: 1, //0-默认，1-综合搜索
        pa_nu: "", //包装编号
        productNumber: "", //产品编号
        ma_na: "", //厂名
        linkman: "", //联系人
        ma_ph_1: "", //电话
        handset: "", //手机
        minPrice: "", //最低价格
        maxPrice: "", //最高价格
        categoryNumber: "", //产品分类编号
        name: "", //品名
        eName: "", //英文品名
        fa_no: "", //出厂货号
        ch_pa: "", //包装名称
        en_pa: "", //英文包装名称
        ou_lo: "", //外箱装量
        in_en: "", //内盒个数
        certificateNumber: "", //证书认证编号
        gr_we: "", //外箱毛重
        ne_we: "", //外箱净重
        bulk_feet: "", //外箱材积
        bulk_stere: "", //外箱体积
        pr_le: "", //样品长度
        pr_wi: "", //样品宽度
        pr_hi: "", //样品高度
        time: "", //时间
        iu_le: "", //包装长
        iu_wi: "", //包装宽
        iu_hi: "", //包装高
        ou_le: "", //外箱长度
        ou_wi: "", //外箱宽度
        ou_hi: "", //外箱高度
        isUpInsetImg: false, //是否有图
        isUpInset3D: false, //是否有3D图
        isNew: false, //新品
        isHot: false, //热销
        isVip: false, //vip
        isSpotGoods: false //现货
      };
      this.$emit("handleIsSynthesizeSearch");
      this.$store.commit("claerHandlerSynthesizeSearchData", []);
    }
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-form-item {
    margin-bottom: 16px;
    .el-form-item__label {
      line-height: 32px;
    }
  }
  .labelBox {
    width: 100px;
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #333;
    line-height: 32px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  .text {
    width: 695px;
    min-height: 90px;
    line-height: 20px;
    padding: 8px;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
  }
  .felxBox {
    // width: 163px;
    display: flex;
    justify-content: space-between;
    p {
      margin: 0 9px;
    }
  }
}
@{deep} .el-input {
  input::-ms-input-placeholder {
    text-align: center;
  }

  input::-webkit-input-placeholder {
    text-align: center;
  }
}
</style>
