<template>
    <div class="player" v-show="playlist.length > 0"> <!-- 根据播放列表展示是否显示播放组件-->
        <!-- 添加动画特效 -->
        <transition name="normal"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
            @after-leave="afterLeave"
        > <!-- 配置钩子 方便实现更复杂的动画效果，这些钩子就是模拟组件加载过程 -->
            <!-- 全屏播放器 全屏迷你播放器只能不同同时出现--> 
            <div class="normal-player" v-show="fullScreen"> <!-- 是否展示全屏-->
                <!-- 背景图 -->
                <div class="background">
                    <!-- 大的背景图 占据所有  大的背景图 占据所有 数据就用songData里面的songPic -->
                    <img :src="songData.songPic" alt="" width="100%" height="100%">
                </div>
                <!-- 顶部区 -->
                <div class="top">
                    <div class="back" @click="back"><!-- 返回按钮  绑定一个事件, 点击是缩小为迷你播放-->
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="songData.songName"></h1><!-- 歌曲名称 -->
                    <h2 class="subtitle"  v-html="singer.singer_name"></h2><!-- 歌手名称 -->
                </div>
                <!-- 中间区 -->
                <div class="middle">
                    <div class="middle-l">
                        <div class="cd-wrapper" ref="cdWrapper"> <!-- 歌曲唱片设计 -->
                            <div class="cd" :class="cdClass">
                                <img :src="songData.songPic" alt="" class="image">
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 下边区 -->
                <div class="bottom">
                    <div class="operators"><!-- 控制按钮区 -->
                        <div class="icon i-left">
                            <i class="icon-sequence"></i><!-- 顺序播放 -->
                        </div>
                        <div class="icon i-left" :class="disableCls">
                            <i class="icon-prev" @click="prev"></i><!-- 上一首 -->
                        </div>
                        <div class="icon i-center" :class="disableCls">
                            <i :class="playIcon" @click="togglePlaying"></i><!-- 播放按钮 -->
                        </div>
                        <div class="icon i-right" :class="disableCls">
                            <i class="icon-next" @click="next"></i><!-- 下一首 -->
                        </div>
                        <div class="icon i-right">
                            <i class="icon icon-not-favorite"></i><!-- 上一首 -->
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <!-- 迷你播放器 -->
            <div class="mini-player"  v-show="!fullScreen"  @click="open">
                <!-- 小图标 -->
                <div class="icon">
                    <img :src="songData.songPic" alt="" width="40" height="40" :class="cdClass">  <!-- 小型唱片 也添加一个cdClass -->
                </div>
                <!-- 文本区 -->
                <div class="text">
                    <h2 class="name"  v-html="songData.songName"></h2>
                    <p class="desc" v-html="singer.singer_name"></p>
                </div>
                <!-- 播放区 -->
                <div class="control">
                    <!-- 迷你播放器的播放按钮  阻止冒泡-->
                    <i :class="miniIcon" @click.stop="togglePlaying"></i> 
                </div>
                <div class="control">
                    <div class="icon-playlist"></div>
                </div>
            </div>
        </transition>
        <!-- 引入音频 -->
        <audio v-bind:src="songData.m4aUrl" ref="audio" @canplay="ready" @error="error"></audio>
    </div>
</template>

<script>
    import result from "../../api/index";
    import { mapGetters } from "vuex";
    import { mapMutations } from "vuex";
    import animations from "create-keyframe-animation"; // 引入动画库

    export default {
        name: "player",
        data () {
            return {
                songData:{}, // 歌曲信息
                songReady: false ,// 歌曲是否可以开始播放, 默认为零不可以
            }
        },
        computed: {
            // 得到基本参数, 当传入的播放列表的时候展开播放器, 并根据播放器的fullscreen参数的不同,选择全屏或是迷你播放器
            ...mapGetters([
                "fullScreen",
                "playlist", // 播放列表
                'currentSong',// 获取当前歌曲数据
                'singer', // 歌手信息
                'playing',  // 点击状态
                "currentIndex"  // 当前播放歌曲
            ]),

            // 更改播放按钮的logo图, 每次playing的值发生变化,就返回一个新的字符串, 改变元素的类名
            playIcon(){ 
                return this.playing ? 'icon-pause' : 'icon-play'
            },

            // 更改 mini 播放器的播放按钮的logo图, 每次playing的值发生变化,就返回一个新的字符串, 改变元素的类名
            miniIcon(){
                return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
            },

            // 通过控制类名 来控制cd图的旋转, 全屏播放器和迷你播放器都要转起来
            cdClass(){ 
                return this.playing ? "play" : "play pause";
            },
            
            // 禁止点击
            disableCls() {
                return this.songReady ? "" : "disable";
            }
        },
        watch: {
            // 监听是否为当前歌曲
            currentSong(){ 
                // 当 currentSong数据更新之后, 我们就利用当前的 song 里面的数据,来发送进一步的请求,得到具体的歌曲数据
                // console.log(this.currentSong.songMid);
                let data = {
                    mid: this.currentSong.songMid
                };
                // 发送请求
                result.getSongdetail(JSON.stringify(data))
                    .then(res=>{
                        // console.log(res);
                        // 部分接口返回的是一个数组,表示有多个版本
                        if(Array.isArray(res.data)){
                            this.songData = res.data[0]
                        }else {
                            this.songData = res.data; // 单独版本的话就直接设置就好
                        }
                    })
                    .catch(err=>{
                        console.log("服务器异~请稍后再试");
                    })
            },

            // 监听歌词变化
            songData() {
                // eslint-disable-next-line no-console
                console.log("songData数据已更新");
                // eslint-disable-next-line no-console
                // console.log(this.songData.m4aUrl);

                // 回调
                this.$nextTick(()=>{
                    // 因为我们设置audio元素的src的瞬间, 资源还没加载好, 所以贸然直接播放是会出问题的
                    this.$refs.audio.play();
                })
            },

            // 监听点击改变的状态
            playing(newPlaying){
                let audio = this.$refs.audio;
                newPlaying ? audio.play() : audio.pause(); // 根据播放状态, 改变音乐播放情况
            }

        },
        created () {

            
        },
        methods: {
            // 获取vuex中方法
            ...mapMutations({
                setFullScreen: "SET_FULL_SCREEN",  // 改变歌是否全屏
                setPlayingState: "SET_PLAYING_STATE", // 改变当前歌播放状态
                setCurrentIndex: "SET_CURRENT_INDEX", // 改变当前歌索引
            }),

            // 退出全屏
            back(){
                this.setFullScreen(false);
            },

            // 点击迷你打开大图
            open(){
                this.setFullScreen(true);
            },

            // 改变播放状态
            togglePlaying(){
                if(!this.songReady){ // 当歌曲没有加载好的时候, 点击直接返回, 使之无效化
                    return;
                }
                this.setPlayingState(!this.playing); // 每点击一次, 变更播放状态.
            },

            // 上一首歌曲
            prev(){
                if(!this.songReady){ // 当歌曲没有加载好的时候, 点击直接返回, 使之无效化
                    return;
                }
                let nowIndex = this.currentIndex - 1;
                // 判断当小于第一首歌时
                if( nowIndex < 0 ){
                    nowIndex = this.playlist.length - 1;   // 播放到第一首了,就回到最后一首歌
                }
                this.setCurrentIndex(nowIndex); // 设置当前索引值
                if(!this.playing){
                    this.togglePlaying();
                    // 当我们的播放器处于暂停的时候, 我们点击下一首的时候,也把音乐设置为暂停的状态
                    // 因为在默认的情况下我们更改了currentIndex,那么currentSong也会变
                    // currentSong的变化就会触发新的请求,接着就是播放新的歌
                    // 这种情况就会变成, 无论当前的播放是啥, 下一首都是播放, 但是这个没有触发playing的值,自然播放按钮的logo就不会变
                }
                this.songReady = false;// 复位
            },

            // 下一首歌
            next() {
                if (!this.songReady) { // 当歌曲没有加载好的时候, 点击直接返回, 使之无效化
                    return;
                }
                let nowIndex = this.currentIndex + 1;
                if (nowIndex >= this.playlist.length) {
                    nowIndex = 0;// 播放到最后一首了,就回到第一首歌
                }
                this.setCurrentIndex(nowIndex);// 设置当前索引值
                if (!this.playing) {
                    this.togglePlaying();
                    
                }
                this.songReady = false;// 复位
            },

            // 音频上事件歌曲加载成功
            ready() {
                // 当audio元素激活了canplay之后, 自动把songready设置为 true
                this.songReady = true; 
            },

            // 音频上事件歌曲加载失败
            error() {
                // 万一歌曲加载失败了, 我们手动把this.songReady 也设置为true, 方便继续点击下一首
                this.songReady = false;
            },

            // 以下是设置动画函数
            // 获取基本位置
             _getPosAndScale() { 
                //定义小图元素的尺寸参数数据
                const targetWidth = 40;
                //定义小图元素的位置参数
                const paddingLeft = 40;
                const paddingBottom = 30;
                const paddingTop = 80;

                //定义大图尺寸
                const width = window.innerWidth * 0.8;
                const scale = targetWidth / width; // 计算大小图缩放比例
                const x = -(window.innerWidth / 2 - paddingLeft);// x偏移量  大图到小图, 移动负值
                const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
                // 向下移动,为正值 因为图形是原型, 所以高的一半也就是宽的一半
                return {
                    x,
                    y,
                    scale
                }
            },

            // 下面动画四个方法
            
            enter(el,done){
                // el:绑定的元素
                // done: 执行下一个钩子, 和express中间件的next逻辑一致
                // eslint-disable-next-line no-console
                // console.log(el,done);
                //获取基本参数
                const {x, y, scale} = this._getPosAndScale()

                //定义动画
                let animation = {
                    //从小图的位置, 挪动到大图的值
                    0: {
                        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                    },
                    60: {
                        transform: `translate3d(0,0,0) scale(1.1)`
                    },
                    100: {
                        transform: `translate3d(0,0,0) scale(1)`
                    }
                };

                animations.registerAnimation({
                    name: 'move', //动画名称
                    animation, //动画内容
                    presets: {
                        duration: 400, //动画时间
                        easing: 'linear' //动画速度
                    }
                });

                animations.runAnimation(this.$refs.cdWrapper, 'move', done);
                //激活动画 cdWrapper是middle元素里面的额class名称为 cd-wrapper的元素
            },

            
            afterEnter(){
                animations.unregisterAnimation('move');//执行完成动画后, 解除注册动画
                this.$refs.cdWrapper.style.animation = '' // 清除动画内容
            },

            leave(el,done){
                this.$refs.cdWrapper.style.transition = 'all 0.4s' ;// 设置基本的动画过渡时间
                const {x, y, scale} = this._getPosAndScale(); // 获取基本参数
                this.$refs.cdWrapper.style["transform"] = `translate3d(${x}px,${y}px,0) scale(${scale})`;// 从大到小
                this.$refs.cdWrapper.addEventListener('transitionend', done);// 监听动画是否结束, 结束之后执行下一步骤
            },

            afterLeave(){
                this.$refs.cdWrapper.style.transition = ''; // 清空过渡时间
                this.$refs.cdWrapper.style["transform"] = ''; // 清空动画
            }
        }
    }
</script>

<style scoped lang="stylus">
    @import "../../assets/stylus/variable.styl";
    @import "../../assets/stylus/mixin.styl";
    .player
        .normal-player
            position: fixed
            left: 0
            right: 0
            top: 0
            bottom: 0
            z-index: 150
            background: $color-background

            .background
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                z-index: -1
                opacity: 0.6
                filter: blur(20px)

            .top
                position: relative
                margin-bottom: 25px

                .back
                    position absolute
                    top: 4px
                    left: 7px;
                    z-index: 50

                    .icon-back
                        display: block
                        padding: 9px
                        font-size: $font-size-large-x
                        color: $color-theme
                        transform: rotate(-90deg)

                .title
                    width: 70%
                    margin: 0 auto
                    line-height: 40px
                    text-align: center
                    no-wrap()
                    font-size: $font-size-large
                    color: $color-text

                .subtitle
                    line-height: 20px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-text

            .middle
                position: fixed
                width: 100%
                top: 80px
                bottom: 170px
                white-space: nowrap
                font-size: 0

                .middle-l
                    display: inline-block
                    vertical-align: top
                    position: relative
                    width: 100%
                    height: 0
                    padding-top: 80%

                    .cd-wrapper
                        position: absolute
                        left: 10%
                        top: 0
                        width: 80%
                        height: 100%

                        .cd
                            width: 100%
                            height: 100%
                            box-sizing: border-box
                            border: 10px solid rgba(255, 255, 255, 0.1)
                            border-radius: 50%

                            &.play
                                animation: rotate 20s linear infinite

                            &.pause
                                animation-play-state: paused

                            .image
                                position: absolute
                                left: 0
                                top: 0
                                width: 100%
                                height: 100%
                                border-radius: 50%

                    .playing-lyric-wrapper
                        width: 80%
                        margin: 30px auto 0 auto
                        overflow: hidden
                        text-align: center

                        .playing-lyric
                            height: 20px
                            line-height: 20px
                            font-size: $font-size-medium
                            color: $color-text-l

                .middle-r
                    display: inline-block
                    vertical-align: top
                    width: 100%
                    height: 100%
                    overflow: hidden

                    .lyric-wrapper
                        width: 80%
                        margin: 0 auto
                        overflow: hidden
                        text-align: center

                        .text
                            line-height: 32px
                            color: $color-text-l
                            font-size: $font-size-medium

                            &.current
                                color: $color-text

            .bottom
                position: absolute
                bottom: 50px
                width: 100%

                .dot-wrapper
                    text-align: center
                    font-size: 0

                    .dot
                        display: inline-block
                        vertical-align: middle
                        margin: 0 4px
                        width: 8px
                        height: 8px
                        border-radius: 50%
                        background: $color-text-l

                        &.active
                            width: 20px
                            border-radius: 5px
                            background: $color-text-ll

                .progress-wrapper
                    display: flex
                    align-items: center
                    width: 80%
                    margin: 0px auto
                    padding: 10px 0

                    .time
                        color: $color-text
                        font-size: $font-size-small
                        flex: 0 0 30px
                        line-height: 30px
                        width: 30px

                        &.time-l
                            text-align: left

                        &.time-r
                            text-align: right

                    .progress-bar-wrapper
                        flex: 1

                .operators
                    display: flex
                    align-items: center

                    .icon
                        flex: 1
                        color: $color-theme

                        &.disable
                            color: $color-theme-d

                        i
                            font-size: 30px

                    .i-left
                        text-align: right

                    .i-center
                        padding: 0 20px
                        text-align: center

                        i
                            font-size: 40px

                    .i-right
                        text-align: left

                    .icon-favorite
                        color: $color-sub-theme

            &.normal-enter-active, &.normal-leave-active
                transition: all 0.4s

                .top, .bottom
                    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)

            &.normal-enter, &.normal-leave-to
                opacity: 0

                .top
                    transform: translate3d(0, -100px, 0)

                .bottom
                    transform: translate3d(0, 100px, 0)

        .mini-player
            display: flex
            align-items: center
            position: fixed
            left: 0
            bottom: 0
            z-index: 180
            width: 100%
            height: 60px
            background: $color-highlight-background

            &.mini-enter-active, &.mini-leave-active
                transition: all 0.4s

            &.mini-enter, &.mini-leave-to
                opacity: 0

            .icon
                flex: 0 0 40px
                width: 40px
                padding: 0 10px 0 20px

                img
                    border-radius: 50%

                    &.play
                        animation: rotate 10s linear infinite

                    &.pause
                        animation-play-state: paused

            .text
                display: flex
                flex-direction: column
                justify-content: center
                flex: 1
                line-height: 20px
                overflow: hidden

                .name
                    margin-bottom: 2px
                    no-wrap()
                    font-size: $font-size-medium
                    color: $color-text

                .desc
                    no-wrap()
                    font-size: $font-size-small
                    color: $color-text-d

            .control
                flex: 0 0 30px
                width: 30px
                padding: 0 10px

                .icon-play-mini, .icon-pause-mini, .icon-playlist
                    font-size: 30px
                    color: $color-theme-d

                .icon-mini
                    font-size: 32px
                    position: absolute
                    left: 0
                    top: 0

    @keyframes rotate
        0%
            transform: rotate(0)
        100%
            transform: rotate(360deg)
</style>