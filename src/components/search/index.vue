<template>
    <!-- 搜索组件 -->
    <div class="seach">
        <div class="search-box-wrapper">
            <searchBox></searchBox>
        </div>
    </div>
</template>

<script>
    import searchBox from "../base/search-box";
    export default {
        name: "seach",
        data() {
            return {
                
            }
        },
        components: {
            searchBox
        }
    }
</script>

<style scoped lang="stylus">
    .seach {
        color: #FFFFFF;
    }
</style>

<style lang="stylus"  scoped>
    @import "../../assets/stylus/variable.styl";
    @import "../../assets/stylus/mixin.styl";

    .search
        .search-box-wrapper
            margin: 20px
        .shortcut-wrapper
            position: fixed
            top: 178px
            bottom: 0
            width: 100%
            .shortcut
                height: 100%
                overflow: hidden
                .hot-key
                    margin: 0 20px 20px 20px
                    .title
                        margin-bottom: 20px
                        font-size: $font-size-medium
                        color: $color-text-l
                    .item
                        display: inline-block
                        padding: 5px 10px
                        margin: 0 20px 10px 0
                        border-radius: 6px
                        background: $color-highlight-background
                        font-size: $font-size-medium
                        color: $color-text-d
                .search-history
                    position: relative
                    margin: 0 20px
                    .title
                        display: flex
                        align-items: center
                        height: 40px
                        font-size: $font-size-medium
                        color: $color-text-l
                        .text
                            flex: 1
                        .clear
                            extend-click()
                            .icon-clear
                                font-size: $font-size-medium
                                color: $color-text-d
        .search-result
            position: fixed
            width: 100%
            top: 178px
            bottom: 0
</style>