<template>
    <!-- 搜索组件 -->
    <div class="seach">
        <!-- 搜索框 -->
        <div class="search-box-wrapper">
            <searchBox ref="searchBox" v-on:queryEvent="searchData"></searchBox>
        </div>
        <!-- 热门推荐 -->
        <div class="shortcut-wrapper" v-show="!search.length>0">
            <div class="shortcut">
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                        <li v-for="(item,index) in hotKey " v-bind:key="index"   @click="setKey(item)" class="item">
                            <span> {{ item.name }} </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 搜索列表 -->
        <div class="searchList">
            <searchlist  @select="selectItem" v-show="search.length"></searchlist>
        </div>
    </div>
</template>

<script>
    import result from "../../api/index"; // 请求数据接口
    import searchBox from "../base/search-box";
    import searchlist from "../search-list";
    import { mapActions } from 'vuex';
    import { mapMutations } from 'vuex';
    import { mapGetters } from "vuex";
    import {mapState} from "vuex";

    export default {
        name: "seach",
        data() {
            return {
                hotKey: [],  // 热门歌曲
                nowKey: '',  // 当前关键字
            }
        },
        computed: {
            ...mapGetters([ // search 数据
                "search",
            ]),
        },
        methods: {
            ...mapActions([
                "selectPlay",
                "questSearch"
            ]),
            ...mapMutations({
                setSearch: "SET_SEARCH"
            }),

            setKey(item){
                // console.log(item);
                this.$refs.searchBox.setQuery(item.name);
            },
            // 子传父组件事件
            searchData(newQuery) {
                let keyword =  newQuery.trim();  // 清除前后空格
                console.log(keyword);
                // 当为空时不发送请求
                if(!this.search){
                    this.setSearch({})
                    return
                }
                if(!keyword){
                    this.questSearch({keyword:''});
                    return;  
                }else{   
                    this.questSearch({keyword});
                }
            },
            // 子传父事件
            selectItem(item, index) {
                this.selectPlay({ // 其他的就是默认的值
                    list: this.search,// 传入当前数据的歌曲列表
                    index: index,// 当前歌曲索引
                })
            },
        
        },
        components: {
            searchBox,
            searchlist,
        },
        created () {
            result.getHotKey()
            .then((data) => {
                // eslint-disable-next-line no-console
                // console.log(data.data);
                this.hotKey = data.data.slice(0,10);  // 获取热歌的前十条
                // console.log(this.hotKey);
            })
            .catch(err => {
                console.log("服务器异常~稍后再试")
            })
        }
    }
</script>


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
                margin: 0 auto 
                height: 50%
                width: 97%
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