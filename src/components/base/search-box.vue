<template>
    <!-- 搜索框组件 -->
    <div class="search-box">
        <i class="icon-search"></i> <!-- 搜索图标 -->
        <input ref="query" v-model="query" class="box" :placeholder="placeholder"/> <!-- 搜索框 -->
        <i @click="clear" v-show="query" class="icon-dismiss"></i> <!-- 取消按钮 -->
    </div>
</template>

<script >

    export default {
        props: {
            placeholder: {  // 这里采用父组件传值给子组件提示信息
                type: String,
                default: '搜索歌曲、歌手' 
            }
        },
        data() {
            return {
                query: '' // 搜索关键字
            }
        },
        methods: {
            // 点击情况框内容
            clear() {
                this.query = ''
            },
            // 获取属性上的方法
            setQuery(query) {
                this.query = query;
                // console.log(this.query);
            },
     
        },
        watch:{
            // 监听关键字
            query(newQuery){
                // console.log(newQuery); 
                this.$emit('queryEvent', newQuery)
            }
        }
    }
</script>

<style scoped lang="stylus" >
    @import "../../assets/stylus/variable.styl";

    .search-box
        display: flex
        align-items: center
        box-sizing: border-box
        margin : 20px auto 0
        width: 97%
        padding: 0 6px
        height: 40px
        background: $color-highlight-background
        border-radius: 6px
        .icon-search
            font-size: 24px
            color: $color-background
        .box
            flex: 1
            margin: 0 8px
            line-height: 18px
            background: $color-highlight-background
            color: $color-text
            font-size: $font-size-medium
            outline: none
            &::placeholder
                color: $color-text-d
        .icon-dismiss
            font-size: 16px
            color: $color-background
</style>