<template>
    <!-- 歌曲页的详情列表 -->
    <div class="music-list">
        <div class="back" @click="goBack">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" ref="singerName">
            {{title}}
        </h1>
         <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper" v-show="!songList.lenght">
                <!-- 设置随机播放选项的按钮, 该按钮在songlist数据传输进来之后再显示出来 -->
                <div class="play" ref="playBtn"  @click="random">
                    <!-- 添加一个引用, 当蒙版移动到顶部的时候, 我们就对这个按钮做一些操作 -->
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter"></div> <!-- 模糊层 -->
        </div>
        <div class="bg-layer" ref="layer"></div> <!-- 新建一个蒙版元素, 加上ref值 -->
        <Scroll @scroll="scroll" :data="songList" class="list" ref="list" :probeType="probeType" :listenScroll="listenScroll">
            <!--  scroll事件就会冒泡上来 我们再监听一个scroll事件  传入自定义的数据, 激活scroll组件的功能-->
            <div>
                <!-- 传入数据, 使得scroll组件知道内容的量    设置该组件的top值-->
                <div class="song-list-wrapper">
                    <songlist v-bind:songs="songList"  v-bind:singername="title" ></songlist>
                </div>
            </div>
            <div class="loading-container" v-show="songList.lenght">
                <loading></loading>
            </div>
        </Scroll>
    </div>
</template>

<script>
    import Scroll from "../base/scroll";
    import Loading from "../base/loading";
    import songlist from "../base/song-list";

    export default {
        name: "music-list",
        data () {
            return {
                scrollY: 0,//配置,默认的Y轴偏移,
                // 设置一些scroll组件的参数, 使得scroll组件能够把滚动事件传回来而不是截住
                probeType: 3,// 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
                listenScroll: true,//是否派发滚动事件,
            }
        },
        components: {
            Scroll,
            Loading,
            songlist
        },
        props:{  // 接受传进来的props参数 
            bgImage:{  // 歌手图片
                type:String
            },
            songList:{ // 歌曲列表
                type: Array
            },
            title:{    // 歌手名称
                type:String
            }
        },
        computed: {
            bgStyle(){
                return `background-image:url(${this.bgImage})`;
            },
        },
        methods: {
            // 点击回到上级路由 
            goBack(){
                this.$router.go(-1);
            },
            // 设置当前的Y周偏移量
            scroll(pos){
                this.scrollY = pos.y;
            },
            // 随机播放
            random(){
                // eslint-disable-next-line no-console
                // console.log("随机播放全部按钮");
                this.randomPlay({
                    list:this.songList
                })
            },
        },
        watch:{
            scrollY(newY){
                // 当scrollY的值发生变化的时候, 我们就触发一个事件, 这个值的变化源自于scroll组件传递过来的数据
                // 做一个限制, 不要让遮盖全部滚上去了, 留一个顶部的歌手名称的位置
                // 那么 向上移动的限制就是 (图片的高度-文字的高度), 记住元素向上滑动,那么最终就是负值
                let maxTranslateY = Math.max(-this.translateY,newY);
                // 设置新的偏移量
                this.$refs.layer.style["transform"] = `translate3d(0,${maxTranslateY}px,0)`;
                if(newY < (-this.translateY)){
                    this.$refs.bgImage.style.zIndex = 10;
                    this.$refs.bgImage.style.paddingTop = 0;
                    this.$refs.bgImage.style.height = `${this.$refs.singerName.clientHeight}px`;
                    this.$refs.playBtn.style.display = "none";
                }else{
                    this.$refs.bgImage.style.zIndex = 0;
                    this.$refs.bgImage.style.paddingTop = "50%";
                    this.$refs.bgImage.style.height = 0;
                    this.$refs.playBtn.style.display = "block";
                }
            }
        },
        mounted () {
           
             // 设置一个偏移量, 使得下方的songlist组件不要把上面的歌手图片给遮住了           
             this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`;

            // 计算出蒙版上移的最高值
            this.translateY = this.$refs.bgImage.clientHeight-this.$refs.singerName.clientHeight;
        },
        created() {
            // 设置一些scroll组件的参数, 使得scroll组件能够把滚动事件传回来而不是截住
            this.probeType = 3;// 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
            this.listenScroll = true; // 是否派发滚动事件
        }
      
    }
</script>


<style scoped lang="stylus">
    @import "../../assets/stylus/variable.styl";
    @import "../../assets/stylus/mixin.styl";

    .music-list
        position: fixed
        z-index: 100
        top: 0
        left: 0
        bottom: 0
        right: 0
        background: $color-background
        .back
            position absolute
            top: 0px
            left: 5px
            z-index: 50

            .icon-back
                display: block
                padding: 10px
                font-size: $font-size-large-m
                color: $color-theme

        .title
            position: absolute
            top: 0
            left: 10%
            z-index: 40
            width: 80%
            no-wrap()
            text-align: center
            line-height: 40px
            font-size: $font-size-large
            color: $color-text

        .bg-image
            position: relative
            width: 100%
            height: 0
            padding-top: 50%
            transform-origin: top
            background-size: cover

            .play-wrapper
                position: absolute
                bottom: 20px
                z-index: 50
                width: 100%

                .play
                    box-sizing: border-box
                    width: 135px
                    padding: 7px 0
                    margin: 0 auto
                    text-align: center
                    border: 1px solid $color-theme
                    color: $color-theme
                    border-radius: 100px
                    font-size: 0

                    .icon-play
                        display: inline-block
                        vertical-align: middle
                        margin-right: 6px
                        font-size: $font-size-medium-x

                    .text
                        display: inline-block
                        vertical-align: middle
                        font-size: $font-size-small

            .filter
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
                background: rgba(7, 17, 27, 0.4)

        .bg-layer
            position: relative
            height: 100%
            background: $color-background         

        .list
            position: fixed
            top: 0
            bottom: 0
            width: 100%
            background: $color-background

            .song-list-wrapper
                padding: 20px 30px

            .loading-container
                position: absolute
                width: 100%
                top: 50%
                transform: translateY(-50%)
</style>