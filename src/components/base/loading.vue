<template>
    <div class="loading">
        <img width="24" height="24" src="../../assets/images/loading.gif">
        <p class="desc">{{title}}</p>
    </div>
</template>
<script >
    export default {
        //支持传入自定义的文案
        props: {
            title: {
                type: String,
                default: '臣妾知道了...'
            }
        }
    }
</script>
<style scoped lang="stylus">
    @import "../../assets/stylus/variable";

    .loading
        width: 100%
        text-align: center
        .desc
            line-height: 20px
            font-size: $font-size-small
            color: $color-text-l
</style>
