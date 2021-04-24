<template>
  <div class="footBox">
    <div class="footWrap">
      <div class="item">
        {{ userInfo.companyName }}
      </div>
      <div class="item">
        Tel: {{ userInfo.companyTel }} Mobile:
        {{ userInfo.companyPhoneNumber }} e-mail: {{ userInfo.companyEmail }}
      </div>
      <div class="item">Address: {{ userInfo.companyAddress }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {},
  mounted() {},
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>

<style lang="less" scoped>
.footBox {
  width: 100%;
  height: 143px;
  background-color: #3f434d;
  color: #ffffff;
  font-size: 14px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  .footWrap {
    .item {
      text-align: center;
      margin-top: 10px;
      &:first-of-type {
        margin-top: 0;
      }
    }
  }
}
</style>
