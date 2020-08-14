<template>
    <!-- 搜索查询的列表 -->
    <div class="search-result" ref="seach">
        <div class="suggest">
            <scroll :data="songs" class="searchlist" ref="searchlist">
                <ul class="suggest-list">
                    <li class="suggest-item" v-for="(item,index) in songs" :key="index"  @click="selectItem(item,index)">
                        <i class="icon"></i>
                        <p class="name">{{item.songName}} - {{item.singername}}</p>
                    </li>
                </ul>
            </scroll>
        </div>
    </div>
   
</template>

<script>
    import Scroll from "../base/scroll";
    import { playlistMixin } from "../../assets/js/mixin";

    export default {
        name: "search-result",
        mixins: [playlistMixin],
        props: {
            songs: {
                type: Array
            },
           
        },
        data () {
            return {
                
            }
        },
        methods: {
            // 
            selectItem(item,index){
                // 子传父发射事件，歌曲和当前索引传入父组件
                this.$emit("select",item,index);
            },

            handlePlaylist(playlist){
                // 监听是否得到了 playlist 的值
                this.$refs.seach.style.bottom = playlist.length > 0 ? "50px" : "";
                this.$refs.searchlist.refresh();
            },
        },
        components:{
            Scroll,
        },
        mounted () {
            console.log(this.songs);
        }
    }
</script>

<style lang="stylus" scoped>
    
        .suggest 
            height: 100%;
            overflow: hidden;

            .searchlist  
                height: 100%   // 这里设置很重要为滚动为基础
                overflow: hidden
                .suggest-list
                    padding: 0 30px;

                    .suggest-item
                        display : flex;
                        align-items: center;
                        padding-bottom: 20px;

                        .icon
                            flex: 0 0 30px;
                            width: 30px;
                            font-weight: 400;
                            font-size: 14px;
                            color: hsla(0,0%,100%,.3);
                            font-family: music-icon!important;
                            speak: none;
                            font-style: normal;
                            font-weight: 400;
                            font-variant: normal;
                            text-transform: none;
                            line-height: 1;

                        .icon:before 
                            content: "\E905";

                        .name
                            flex: 1;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            font-weight: 400;
                            font-size: 14px;
                            color: hsla(0,0%,100%,.3);
</style>