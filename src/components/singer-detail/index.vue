<template>
    <!-- 歌手歌曲页组件 -->
    <!-- 增加个转场动画 -->
    <transition name="slide">
         <music-list :rank="rank" :bgImage="bgImage" :title="title" :songList="songList"></music-list>
    </transition>
</template>

<script>
    import result from "../../api/index"; // 导入接口
    import MusicList from "../music-list/index";
    import {mapGetters} from 'vuex';

    export default {
        name: "slide",
        data () {
            return {
                songList:[],  // 具体的歌曲信息列表
                rank: false,  // 控制排行图标
            }
        },
        computed: {
            ...mapGetters([   //与store里面的getter进行绑定 
                "singer"
            ]),
            bgImage(){ // 歌手图片
                return this.singer.singer_pic;
            },
            mid(){     // 歌手mid
                return this.singer.singer_mid;
            },
            title(){// 歌手名称
                return this.singer.singer_name;
            },
        },
        methods: {
            // 发送歌手详情请求
            _getDetail(mid){
                let data = {
                    mid : mid
                };
                result.getSingerDetail(JSON.stringify(data))
                    .then(data=>{
                        // eslint-disable-next-line no-console
                        // console.log(data);
                        this.songList = data.data.songList;
                    })
                    .catch(err=>{
                        console.log("服务器异常~稍后再试");
                    })
            }
        },
        created () {
            //  把当前的歌手mid作为识别码传输到这个函数中间 
            this._getDetail(this.mid);
        },
       
        components: {
            MusicList,
        },
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>