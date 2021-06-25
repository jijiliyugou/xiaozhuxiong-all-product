<template>
  <div>
    <!-- 敬请期待 -->
    <bsaa :im="im" />
  </div>
</template>

<script>
import bsaa from "./Bsaa.vue";
export default {
  name: "bsMyGoodFriend",
  components: {
    bsaa
  },
  props: ["im"],
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style scoped lang="less"></style>
