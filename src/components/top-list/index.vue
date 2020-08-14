<template>
    <!-- 排行歌曲列表 -->
    <transition name="slide">
        <music-list  :rank="rank" :title="title" :bg-image="bgImage" :songList="songs"></music-list>
    </transition>
</template>

<script>
    import MusicList from '../music-list/index';
    import { mapGetters } from "vuex";

    export default {
        computed: {
            ...mapGetters([
                "topList",
            ]),
            title() {
                return this.topList.titleDetail;
            },
            bgImage() {
                if (this.songs.length) {
                    return this.topList.musichallPicUrl;
                }
                return ''
            }
        },
        data() {
            return {
                songs: [],
                rank: true,  // 控制是否显示排行图标
            }
        },
        created() {
            this.songs = this.topList.songlist;
            // eslint-disable-next-line no-console
            // console.log(this.songs);
        },
        components: {
            MusicList
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s ease

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>