<template>
    <!-- 排行榜组件 -->
    <div class="rank" ref="rank">
        <scroll :data="topList" class="toplist" ref="toplist">
            <ul>
                <li @click="selectItem(item)" class="item" v-for="(item,index) in topList" v-bind:key="index">
                    <div class="icon">
                        <img width="100" height="100" :src="item.picUrl"/> <!-- 排行榜类别的图片 -->
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song,index) in item.songlist"  v-bind:key="index">
                            <span>{{index + 1}} </span>
                            <span>{{song.songName}}-{{song.singer_name}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading-container" v-show="!topList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script >
    import result from "../../api/index"; // 接口导入
    import Scroll from "../base/scroll";
    import Loading from '../base/loading';
    import { playlistMixin } from '../../assets/js/mixin';
    import { mapMutations } from 'vuex';

    export default {
        name: "rank",
        mixins: [playlistMixin],
        data() {
            return {
                topList: []
            }
        },
        methods: {
            ...mapMutations({
                setTopList:"SET_TOPLIST"
            }),
            // 防止播放挡住底部
            handlePlaylist(playlist) {
                const bottom = playlist.length > 0 ? '60px' : ''
                this.$refs.rank.style.bottom = bottom;
                this.$refs.toplist.refresh()
            },
            selectItem(item) {
                // console.log(item);

                result.getRankDetail(item.topId)
                    .then((data)=>{
                        // 编程式路由改变
                        this.$router.push({
                            path: `/rank/${item.topId}`
                        });
                        // eslint-disable-next-line no-console
                        // console.log(data.data);
                        this.setTopList(data.data);

                    }).catch(err=>{
                        console.log("服务器异常~稍后再试");
                    });

                    

            }
             
            
        },
        // watch: {
        //     topList() {
        //         setTimeout(() => {

        //             // console.log(this);
        //             // this.$Lazyload.lazyLoadHandler();
        //         }, 20)
        //     }
        // },
        created() {
            result.getRank()
                .then((data)=>{
                    // eslint-disable-next-line no-console
                    // console.log(data.data);
                    this.topList = data.data;
                })
                .catch(err=>{
                    console.log("服务器异常~稍后再试");
                });
        },
        components: {
            Scroll,
            Loading
        }
    }
</script>

<style scoped lang="stylus">

    @import "../../assets/stylus/variable.styl"
    @import "../../assets/stylus/mixin.styl"

    .rank
        position: fixed
        width: 100%
        top: 88px
        bottom: 0

        .toplist
            height: 100%
            overflow: hidden

            .item
                display: flex
                margin: 0 20px
                padding-top: 20px
                height: 100px

                &:last-child
                    padding-bottom: 20px

                .icon
                    flex: 0 0 100px
                    width: 100px
                    height: 100px

                .songlist
                    flex: 1
                    display: flex
                    flex-direction: column
                    justify-content: center
                    padding: 0 20px
                    height: 100px
                    overflow: hidden
                    background: $color-highlight-background
                    color: $color-text-d
                    font-size: $font-size-small

                    .song
                        no-wrap()
                        line-height: 26px

            .loading-container
                position: absolute
                width: 100%
                top: 50%
                transform: translateY(-50%)
</style>