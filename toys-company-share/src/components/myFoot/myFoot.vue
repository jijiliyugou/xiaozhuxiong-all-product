<template>
  <div class="footBox">
    <div class="footWrap">
      <div class="item" v-if="currentLang.companyName">
        {{ currentLang.companyName }}
      </div>
      <div class="item">
        <span v-if="currentLang.telephone">
          Tel: {{ currentLang.telephone }}
        </span>
        <span v-if="currentLang.phoneNumber">
          Mobile: {{ currentLang.phoneNumber }}
        </span>
        <span v-if="currentLang.email">e-mail: {{ currentLang.email }}</span>
      </div>
      <div class="item" v-if="currentLang.contactAddress">
        Address: {{ currentLang.contactAddress }}
      </div>
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
    ...mapState(["currentLang"])
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
      span {
        margin: 0 5px;
      }
    }
  }
}
</style>
