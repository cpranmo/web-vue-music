<template>
    <!-- 推荐组件 -->
   <div class="recommend" ref="recommend">
        <scroll class="recommend-content" v-bind:data="disclist" ref="list">
            <div><!-- 滚动插件里面需要加一个子元素, 让内部的元素撑开高度 -->
                <!-- 轮播区域 -->
                <div class="slider-wrapper" ref="sliderWrapper">
                    <slider>
                        <div v-for="item in sliderRecommends" v-bind:key="item.id"  v-on:click="selectItem(item)">
                            <a>
                                <img v-bind:src="item.cover" alt="">
                            </a>
                        </div>
                    </slider>
                </div>
                <!-- 热门推荐 -->
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li v-for="item in disclist" v-bind:key="item.id" class="item" v-on:click="selectItem(item)">
                            <div class="icon">
                                <img width="60" height="60" v-lazy="item.cover">
                            </div>
                            <div class="text">
                                <h2 class="name" v-html="item.title"></h2>
                                <p class="desc" >播放量：{{ fatNum(item.cnt) }}万</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container" v-show="!disclist.length"><!-- 在获取到数据之前加载 -->
                <loading></loading>
            </div>
        </scroll>
        <!-- 二级路由容器 -->
        <router-view></router-view> 
    </div>
</template>
<script>
    import result from "../../api/index";
    import Slider from "../base/slider";
    import Scroll from "../base/scroll";
    import Loading from "../base/loading";
    import { playlistMixin } from "../../assets/js/mixin";
    import { mapMutations } from "vuex";
    export default {
        mixins:[playlistMixin],  // 防止播放挡住底部区
        data() {
            return {
                sliderRecommends: [], // 存放轮播的推荐信息
                disclist: []          // 存储下面列表信息的推荐信息
            }
        },
        beforeCreate() {
            // 推荐请求获取
            result.getrecommend()
            .then((data) => {
                // console.log(data);
                // 第最后个歌单列表的前六条数据作为轮播图的部分
                this.sliderRecommends = data.data.pop().categoryList.splice(0,7);
                // console.log(this.sliderRecommends);
                data.data.forEach(item => {      // 剩余的数据 作为剩下的列表部分
                    item.categoryList.forEach(item1 => {   // 获取列表里面的核心数据
                        // 每个单独的数据,保存一下这个歌单的父类数据
                        item1.category = item.category;   

                        this.disclist.push(item1);
                        
                    });
                });
                // console.log(this.disclist);
            })
            .catch(err=>{
                console.log("数据库出错"+ err);
            })
        },
        methods:{
            ...mapMutations({
                setDisc:"SET_DISC"
            }),
            handlePlaylist(playlist){
                // 监听是否得到了 playlist 的值
                this.$refs.recommend.style.bottom = playlist.length > 0 ? "50px" : "";
                this.$refs.list.refresh();
            },
            selectItem(item){
                
                result.getrecommendDetail(item.id)
                .then(res=>{
                    // console.log(res);
                    // 编程路由改变路径
                    this.$router.push(`/recomend/${item.id}`);// 更改路由
                    // 存储数据到 vuex
                    this.setDisc(res.data);
                })
                .catch(err=>{
                    comsole.log("服务器异常~稍后再试");
                })
                

            },

            // 格式化数据
            fatNum(num){
                let result = num / 10000;
                return result.toFixed(1);
            }
        },
        components: {
            Slider,
            Scroll,
            Loading
        }
    }

</script>
<style scoped lang="stylus">
    @import "../../assets/stylus/variable.styl"

    .recommend
        position: fixed
        width: 100%
        top: 88px
        bottom: 0

        .recommend-content
            height: 100%
            overflow: hidden

            .slider-wrapper
                position: relative
                width: 100%
                overflow: hidden
                height: 160px

            .recommend-list
                .list-title
                    height: 65px
                    line-height: 65px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-theme

                .item
                    display: flex
                    box-sizing: border-box
                    align-items: center
                    padding: 0 20px 20px 20px

                    .icon
                        flex: 0 0 60px
                        width: 60px
                        padding-right: 20px

                    .text
                        display: flex
                        flex-direction: column
                        justify-content: center
                        flex: 1
                        line-height: 20px
                        overflow: hidden
                        font-size: $font-size-medium

                        .name
                            margin-bottom: 10px
                            color: $color-text

                        .desc
                            color: $color-text-d

            .loading-container
                position: absolute
                width: 100%
                top: 80%
                transform: translateY(-50%)
</style>