<template>
    <!-- 头部模块 -->
	<div class="m-header">
		<div class="icon"></div>
		<h1 class="text">染墨音乐</h1>
	</div>
</template>

<script>
export default {
    name: "m-header",
    data () {
        return {
            
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import "../../assets/stylus/variable";
    @import "../../assets/stylus/mixin";
    .m-header
        position: relative
        height: 44px
        text-align: center
        color: $color-theme
        font-size: 0
        background-color : $color-text-blue
        .icon
            display: inline-block
            vertical-align: top
            margin-top: 10px
            width: 25px
            height: 25px
            margin-right: 9px
            background-image url("../../assets/images/logo.png")
            background-size: 25px 25px
       .text
            display: inline-block
            vertical-align: top
            line-height: 44px
            font-size: $font-size-large
            .mine
                position: absolute
                top: 0
                right: 0
        .icon-mine
            display: block
            padding: 12px
            font-size: 20px
            color: $color-theme
</style>