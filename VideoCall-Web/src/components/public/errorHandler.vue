<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: gaojiahao
 * @Date: 2020-10-28 10:36:16
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-12-04 16:28:23
-->
<template>
<!--<div style="background:#eee;padding: 20px">
    <Card :bordered="false">
        <p slot="title">页面加载出错</p>
        <p>页面不存在或者没有权限访问，请联系管理员！</p>
    </Card>
</div>-->
</template>

<script>
export default {
    name: 'errorHandler',
    methods: {
        handleSpinCustom() {
            this.$Spin.show({
                render: (h) => {
                    return h('div', [
                        h('Icon', {
                            'class': 'demo-spin-icon-load',
                            props: {
                                type: 'ios-loading',
                                size: 18
                            }
                        }),
                        h('div', '页面不存在或者没有权限访问，请联系管理员！')
                    ])
                }
            });
            setTimeout(() => {
                this.$Spin.hide();
                this.$store.commit('setMenuRouter', {});
                this.$router.replace('/');
            }, 2000);
        }
    },
    created() {
        this.handleSpinCustom();
    }
}
</script>

<style>
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
}
</style>
