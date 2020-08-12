<template>
    <!-- 歌手组件 -->
    <div class="singer" ref="singer">
        <listview :data="singerlist" ref="list"  v-on:select="selectSinger"></listview>
        <!-- 使用ref 可以获取当前 dom 元素 -->
        <router-view></router-view> <!-- 子路由展示 -->
    </div>
</template>

<script>
    import result from "../../api/index";    // 导入接口
    import listview from "../base/listview";  // 导入歌手列表组件
    import { mapMutations } from "vuex";  // 取得工具函数
    import { playlistMixin } from "../../assets/js/mixin";

    export default {
        name: "singer",
        mixins: [playlistMixin],
        data () {
            return {
                singerlist : [], // 歌手列表
            }
        },
        components: {
            listview,
        },
        created () {
            // 获取歌手列表
            result.getSinger()
                .then(res=>{
                    this.singerlist = res.data
                })
                .catch(err=>{
                    console.log("服务器异常~请稍后再试");
                })
        },
        methods: {
            // 绑定对应的方法
            ...mapMutations({ 
                setsinger: "SET_SINGER"
            }),

            handlePlaylist(playlist){
                // 监听是否得到了 playlist 的值
                this.$refs.singer.style.bottom=playlist.length > 0 ? "70px" : "";
                this.$refs.list.refresh();
            },

            // 接受子组件数据设置路由
            selectSinger(singerItem){  // 由子组件的点击事件触发的父组件事件
                this.$router.push({
                    path:`/singer/${singerItem.singer_mid}` // 变更路由,触发子组件
                });
               
                this.setsinger(singerItem); // 存储数据,存储当前点击的基本的歌手信息到vuex
                // eslint-disable-next-line no-console
                console.log(singerItem); 
            },
            
        }
        
    }
</script>

<style lang="stylus" scoped>
    .singer        
        position: fixed        
        top: 88px        
        bottom: 0        
        width: 100% 
</style>