<template>
    <!-- 推荐列表 -->
    <transition name="slide">
        <music-list :rank="rank" :title="title" :bg-image="bgImage" :songList="songlist"></music-list>
    </transition>
</template>

<script>
    import MusicList from '../music-list/index'
    import { mapGetters } from 'vuex'
    export default {
        name:"disc",
        computed: {
            title() {
                return this.disc.title
            },
            bgImage() {
                return this.disc.picurl
            },
            ...mapGetters([
                'disc'
            ])
        },
        data() {
            return {
                songlist: [],
                rank: true,  // 排行图标设置
            }
        },
        created() {
            this.songlist=this.disc.songlist;
            // eslint-disable-next-line no-console
            // console.log(this.songlist);
        },
        components: {
            MusicList
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>