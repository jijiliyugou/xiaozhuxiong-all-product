<template>
  <div class="bsHallSampleDetails">
    <div class="bs_sample_detail" v-if="isShowSample">
      <div class="title">择样明细</div>
      <div class="bs_sample_detail_panel">
        <div class="bs_sample_detail_panel_title">
          {{
            userInfo.commparnyList[0] &&
              userInfo.commparnyList[0]["companyName"]
          }}
        </div>
        <div class="bs_sample_detail_panel_logo">
          <img
            :src="
              userInfo.commparnyList[0] &&
                userInfo.commparnyList[0]['companyLogo']
            "
          />
          <div class="sm_title">
            {{
              userInfo.commparnyList[0] &&
                userInfo.commparnyList[0]["companyName"]
            }}
          </div>
        </div>
        <div class="bs_sample_detail_panel_form">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="150px"
            class="add_bs_sample_detail"
          >
            <el-form-item label="">
              <div class="form_title">输入代号</div>
            </el-form-item>
            <el-form-item label="代号" prop="code">
              <el-input
                placeholder="请输入内容"
                v-model.trim="form.code"
                clearable
                :style="{ width: '300px' }"
              ></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="number">
              <el-input
                placeholder="请输入内容"
                @keyup.native.enter="goDetail"
                v-model.trim="form.number"
                clearable
                :style="{ width: '300px' }"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div class="add_hall_button">
                <el-button
                  type="primary"
                  @click="goDetail"
                  :style="{ width: '300px' }"
                  >查看明细</el-button
                >
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 明细列表 -->
    <template v-else>
      <sampleDetails
        :sampleOption="sampleOption"
        :the_nu="form.code"
        @checkCode="checkCode"
      />
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import sampleDetails from "./sampleDetails/SampleDetails";
export default {
  name: "bsSampleDetailed",
  components: {
    sampleDetails
  },
  data() {
    return {
      form: {
        code: null,
        number: null
      }, //表单数据
      rules: {
        code: [{ required: true, message: "请填写代号", trigger: "blur" }],
        number: [{ required: true, message: "请填写验证码", trigger: "blur" }]
      }, //表单规则
      isShowSample: true, //是否显示填写择样
      sampleOption: null //择样数据
    };
  },
  methods: {
    changeShowSample(value) {
      this.isShowSample = value;
      if (value) {
        this.form = {
          code: null,
          number: null
        };
      }
    },
    // 切换代号
    checkCode() {
      this.isShowSample = true;
    },
    // 去明细
    goDetail() {
      const fd = {
        the_nu: this.form.code,
        Verify_Code: this.form.number
      };
      for (const key in fd) {
        if (fd[key] === null || fd[key] === undefined || fd[key] === "") {
          delete fd[key];
        }
      }
      this.$refs.form.validate(async valid => {
        if (valid) {
          const res = await this.$http.post("/api/CheckThe_nuVerify_Code", fd);
          if (res.data.result.code === 200) {
            this.sampleOption = res.data.result.item;
            this.changeShowSample(false);
          } else {
            this.$common.handlerMsgState({
              msg: res.data.result.msg,
              type: "danger"
            });
          }
        }
      });
    }
  },
  created() {},
  filters: {},
  mounted() {},
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style scoped lang="less">
@deep: ~">>>";
.bsHallSampleDetails {
  .bs_sample_detail {
    height: 775px;
    background-color: #fff;
    padding: 0 20px;
    .title {
      height: 55px;
      line-height: 55px;
      font-size: 15px;
      font-weight: 700;
      padding-left: 15px;
      box-sizing: border-box;
      position: relative;
      border-bottom: 1px solid #e5e5e5;
      &::before {
        width: 4px;
        height: 14px;
        background-color: #3368a9;
        position: absolute;
        left: 0;
        top: 50%;
        content: "";
        transform: translate(0, -50%);
      }
    }
    .bs_sample_detail_panel {
      .bs_sample_detail_panel_title {
        width: 100px;
        height: 26px;
        opacity: 1;
        font-size: 20px;
        font-weight: 700;
        text-align: center;
        color: #333333;
        line-height: 30px;
        margin: 71px auto 50px auto;
      }
      .bs_sample_detail_panel_logo {
        width: 120px;
        height: 120px;
        margin: 0px auto 50px auto;
        img {
          width: 60px;
          height: 60px;
          opacity: 1;
          background: rgba(0, 0, 0, 0);
          margin: 16px 30px 11px 30px;
        }
        .sm_title {
          width: 70px;
          height: 19px;
          opacity: 1;
          font-size: 14px;
          font-weight: 400;
          text-align: center;
          color: #333333;
          margin: auto;
        }
      }
      .bs_sample_detail_panel_form {
        width: 600px;
        height: 322px;
        opacity: 1;
        border: 1px solid #ececec;
        margin: auto;
        .add_bs_sample_detail {
          padding: 20px;
          .form_title {
            width: 100px;
            text-align: center;
            margin-left: 75px;
            height: 26px;
            opacity: 1;
            font-size: 20px;
            font-weight: 700;
            color: #333333;
            line-height: 30px;
            margin-top: 38px;
            margin-bottom: 18px;
          }
        }
      }
    }
  }
  // .bs_sample_list {}
}
</style>
