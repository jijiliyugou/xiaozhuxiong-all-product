<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Gabriel.gaojiahao
 * @Date: 2019-03-25 10:56:56
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-31 15:20:26
 -->
<template>
  <div v-show="show">
    <Spin fix :style="autoHeight">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>{{text}}</div>
    </Spin>
  </div>
</template>

<script>
export default {
  name: "FromLoading",
  data() {
    return {
      show: false,
      autoHeight: {
        height: ''
      },
      text:''
    };
  },
  watch:{
    show:{
      handler(val){
        if(val){
          this.getHeight();
        }
      }
    },
  },
  methods:{
    getHeight() {
      var obj = document.getElementById("app");
      var h = obj.offsetHeight;
      this.autoHeight.height = parseInt(h) + 'px';
    },
  }
};
</script>
<style scoped>
>>>.ivu-spin-fix {
  background-color: rgba(0,0,0,0.5);
  z-index: 11;
}
>>>.ivu-spin {
    color: #fff;
}
</style>
<style>
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
.demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
}
</style>
