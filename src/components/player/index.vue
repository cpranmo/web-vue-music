<template>
    <div class="player" v-show="playlist.length > 0"> <!-- 根据当有播放列表展示是否显示播放组件-->
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
                <div class="middle"
                    @touchstart.prevent="middleTouchStart"
                    @touchmove.prevent="middleTouchMove"
                    @touchend="middleTouchEnd"
                ><!-- 增加touch事件, 使得歌曲CD的部分和歌词部分可以滑动切换 -->
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper"> <!-- 歌曲唱片设计 -->
                            <div class="cd" :class="cdClass">
                                <img :src="songData.songPic" alt="" class="image">
                            </div>
                        </div>
                        <!-- CD主界面下方的议题歌词 -->
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{ playingLyric }}</div>
                        </div>
                    </div>
                    <!-- 歌词模块 -->
                    <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines"> 
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">  <!-- 判断有没歌词 -->
                                <p ref="lyricLine"
                                    class="text"
                                    :class="{'current': currentLineNum === index }"
                                    v-for="(line,index) in currentLyric.lines" v-bind:key="index">{{ line.txt }}</p>
                            </div>
                        </div>
                    </Scroll>
                </div>
               
                <!-- 下边区 -->
                <div class="bottom">
                    <!-- 进度条 -->
                    <div class="progress-wrapper">
                        <span class="time time-l">{{ format(currentTime) }}</span>
                        <div class="progress-bar-wrapper">
                            <!-- 调用进度条组件 -->
                            <progressbar :percent="percent" @percentChange="onProgressBarChange"></progressbar>  
                        </div>
                        <span class="time time-r">{{ songData.playTime }}</span>
                    </div>
                    <!-- 控制按钮区 -->
                    <div class="operators">
                        <div class="icon i-left">
                            <i :class="iconMode"  @click="changeMode"></i><!-- 顺序播放 -->
                            <!-- 根据播放模式的不同, 我们设置不同的类名来改变里面的logo  点击更改播放模式-->
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
                    <progressCircle :radius="radius" :percent="percent">
                        <i :class="miniIcon" @click.stop="togglePlaying" class="icon-mini"></i>
                        <!-- 迷你播放器的播放按钮  阻止冒泡-->
                    </progressCircle> <!-- 引入圆形进度条 -->
                </div>
                <div class="control">
                    <div class="icon-playlist"></div>
                </div>
            </div>
        </transition>
        <!-- 引入音频 -->
        <audio v-bind:src="songData.m4aUrl" ref="audio" 
            @canplay="ready" 
            @error="error"
            @timeupdate="updateTime"
            @ended="end"></audio>
        <!--    增加几个监听事件: 是否可以开始播放, 是否音乐数据加载出错, 是否播放数据更新  是否结束  -->
    </div>
</template>

<script>
    import result from "../../api/index";
    import { mapGetters } from "vuex";
    import { mapMutations } from "vuex";
    import animations from "create-keyframe-animation"; // 引入动画库
    import progressbar from "../base/progress-bar"; // 导入条形进度条组
    import progressCircle from "../base/progress-circle"; // 导入圆形进度条
    import  { playMode } from "../../assets/js/config"; // 导入播放模式的基本参数, 避免出错
    import { shuffle } from "../../assets/js/util";
    import Lyric from 'lyric-parser';  // 导入歌词解析模块
    import Scroll from "../base/scroll";

    import { prefixStyle } from "../../assets/js/dom";
    const transform = prefixStyle('transform');// 样式的兼容性处理
    const transitionDuration = prefixStyle('transitionDuration');// 样式的兼容性处理


    export default {
        name: "player",
        data () {
            return {
                songData:{}, // 歌曲信息
                songReady: false ,// 歌曲是否可以开始播放, 默认为零不可以
                currentTime: 0,// 默认的播放时间
                totalTime: 0,   // 歌曲总时间
                radius: 32,// 定义圆形的进度条组件的基本尺寸
                currentLyric: null,// 定义变量, 存储当前歌曲的歌词信息
                currentLineNum: 0,// 歌词所在行默认第一行
                playingLyric: "",// CD主界面的 单条歌词
                currentShow: "cd", // 当前显示专辑cd还是歌词,默认为cd
                touch: {}, // 存储后期手指滑动时的位置等参数
               
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
                "currentIndex", // 当前播放歌曲
                'playMode', // 歌曲的播放模式
                'sequenceList',// 获取默认的顺序列表
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
            },

            // 进度条百分比
            percent() {
                return this.currentTime / this.totalTime;
            },

            // 改变播放类型样式
            iconMode() {
                return this.playMode === playMode.sequence ? "icon-sequence" : this.playMode === playMode.loop ? "icon-loop" : "icon-random";
                //判断返回值
            }
        },
        watch: {
            // 监听是否为当前歌曲
            currentSong(newSong,oldSong){ 
                
                if(newSong.songMid === oldSong.songMid){
                    return ; // 如果改变后这个
                }

                // 判断当前是否有歌词
                if(this.currentLyric){
                    // 如果已经存在了歌词对象,那么就把之前存在的歌词定时器全部给停掉
                    this.currentLyric.stop();
                }
                
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

            // 监听歌曲变化
            songData(newData) {
                // console.log(newData);
                // eslint-disable-next-line no-console
                // console.log("songData数据已更新");
                // eslint-disable-next-line no-console
                // console.log(this.songData.m4aUrl);
                // 组合数据, 向后端发送请求
                let data = {
                    songMid: this.songData.songMid
                };
                // 发送请求获取歌词信息
                result.getLyric(JSON.stringify(data)) 
                    .then((data)=>{
                        // 将base64转化为字符串获得歌词
                        var lyric =  new Buffer(data.data.lyric, 'base64').toString();
                        // console.log(lyric);
                        this.currentLyric = new Lyric(lyric,this.handleLyric);//获得这个lyric的解析后的数据, 并设置一个回调函数
                        // eslint-disable-next-line no-console
                        // console.log(this.currentLyric)
                        if(this.playing){ // 当歌曲处于播放状态时, 播放歌词
                            this.currentLyric.play(); // 滚动歌词
                        }
                    });

                // 回调
                this.$nextTick(()=>{
                    // 因为我们设置audio元素的src的瞬间, 资源还没加载好, 所以贸然直接播放是会出问题的
                    this.$refs.audio.play();
                });

                // eslint-disable-next-line no-console
                // console.log("歌曲总时间的字符串值:", this.songData.playTime);
                // 设置总时间(这里不使用forEach 是因为 index 不一定按顺序有不确定性，是一个坑)
                this.totalTime = Number(this.songData.playTime.split(":")[0]) * 60 + Number(this.songData.playTime.split(":")[1]);
                // eslint-disable-next-line no-console
                // console.log("歌曲的总时间", this.totalTime);
            },

            // 监听点击改变的状态
            playing(newPlaying){
                let audio = this.$refs.audio;
                newPlaying ? audio.play() : audio.pause(); // 根据播放状态, 改变音乐播放情况
            }

        },
        components: {
            progressbar,
            progressCircle,
            Scroll,
        },

        methods: {
            // 获取vuex中方法
            ...mapMutations({
                setFullScreen: "SET_FULL_SCREEN",  // 改变歌是否全屏
                setPlayingState: "SET_PLAYING_STATE", // 改变当前歌播放状态
                setCurrentIndex: "SET_CURRENT_INDEX", // 改变当前歌索引
                setPlayMode: "SET_PLAY_MODE",  // 播放类型
                setPlayList: "SET_PLAYLIST"    // 播放列表
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
                // 当歌词存在的时候 ,一起切换状态
                if(this.currentLyric){
                   
                    this.currentLyric.togglePlay();  //切换状态播放暂停
                }
            },

            // 播放类型切换
            changeMode(){
                let nowMode = (this.playMode + 1) % 3;// 每点击一次值加一求模最大不超过 3 
                this.setPlayMode(nowMode); // 设置播放模式的值
                let list = null; // 定义一个空列表, 用来存储根据播放模式不同设置的不同的列表顺序数据
                // eslint-disable-next-line no-console
                console.log("nowMode", nowMode);  // 1 为顺序 , 2 为循环 ， 3 为随机
                // 判断当选择随机时
                if(nowMode === playMode.random){
                    // 打乱数组，这个打乱的功能咱们专门定义一个函数来实现
                    list = shuffle(this.sequenceList);
                }else {
                    list = this.sequenceList; // 顺序播不用设置 this.sequenceList 为备份数据
                }
                this.resetCurrentIndex(list, this.currentSong);
                // 但是重新设置之后, 咱们当前的歌曲的索引值
                this.setPlayList(list);  // 将打乱后列表设置到播放列表
            },

            resetCurrentIndex(list,song){
                // console.log(list);
                // console.log(song);
                let index = list.findIndex((item)=>{ 

                    return item.songMid === song.songMid;// 匹配当前听的歌曲 songMid 一致的值
                });
                // eslint-disable-next-line no-console
                // console.log(index);  
                this.setCurrentIndex(index);  // 设置打乱后歌的索引
                // 但是这里会有一些问题, 我们改变了index的值, 随之而来的currentsong也会重新激活, 那么就要重新播放
                // 所以我们监听一下, 当 currenSong 发现值变化了,但是 songMid 新旧刚好一致的情况下, 那么就不用变了
                // 所以就在watch里面修改一下currentSong 的逻辑
            },

            // 音频播放完成
            end(){
                // 判断是否循环
                if(this.playMode === playMode.loop){
                    //如果是循环模式
                    this.loop();//
                }else {
                    // 非循环模式
                    this.next();  // 直接调用点击下一首函数
                }

            },
            
            // 循环播放 
            loop(){
                console.log(this.$refs);
                this.$refs.audio.currentTime = 0;//播放时间归零
                this.$refs.audio.play(); // 重新播放
                // 歌词回到最开始的状态
                if(this.currentLyric){  
                    this.currentLyric.seek(0);
                }
            },

    
            // 上一首歌曲
            prev(){
                if(!this.songReady){ // 当歌曲没有加载好的时候, 点击直接返回, 使之无效化
                    return;
                }
                if (this.playlist.length === 1) {
                    // 只有一首歌,直接循环播放就行
                    this.loop();
                } else{
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
                }
                
                this.songReady = false;// 复位
            },

            // 下一首歌
            next() {
                if (!this.songReady) { // 当歌曲没有加载好的时候, 点击直接返回, 使之无效化
                    return;
                }
                if (this.playlist.length === 1) {
                    // 只有一首歌,直接循环播放就行
                    this.loop();
                } else{
                    let nowIndex = this.currentIndex + 1;
                    if (nowIndex >= this.playlist.length) {
                        nowIndex = 0;// 播放到最后一首了,就回到第一首歌
                    }
                    this.setCurrentIndex(nowIndex);// 设置当前索引值
                    if (!this.playing) {
                        this.togglePlaying();
                        
                    }
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

            format(time){
                // eslint-disable-next-line no-console
                // console.log(time)  // 获取的是小数
                let min = Math.floor(time / 60) ;  // 获取分向上取整
                let second = Math.floor(time % 60); // 获取秒

                // 对于只有一位数的, 前面补个 0 格式统一一下
                if(second < 10){
                    second = "0" + second;
                }
                if(min < 10){
                    min = "0" + min;
                }
                return `${min}:${second}`;
            },
            // 更新时间
            updateTime(ev){
                // console.log(ev);  // 获取 dom 元素
                this.currentTime = ev.target.currentTime;// 获取当前音乐的播放时间, 这个时间一直都是秒数
            },

            // 子传父
            onProgressBarChange(percent){
                // eslint-disable-next-line no-console
                console.log("player组件的百分比", percent);
                // eslint-disable-next-line no-console

                this.$refs.audio.currentTime = Math.floor(this.totalTime * percent);
                
                // 如果我们拉动进度的条的时候歌曲没有在播放, 那么就把它设置为播放
                if (!this.playing) { 
                    this.togglePlaying()
                }
                // 歌词开始实现歌曲的跳转, 单位得是毫秒
                if(this.currentLyric){
                    
                    this.currentLyric.seek(this.$refs.audio.currentTime * 1000);
                }
            },

            // 引入包歌词自带事件
            handleLyric({lineNum, txt }){
                this.currentLineNum = lineNum; // 设置当前的歌词行数,目的是为了在歌词模块里面实现高亮当前行的效果
                // eslint-disable-next-line no-console
                // console.log(lineNum); // 当前歌词行数
                // console.log(txt);     // 当前显示歌词
                // 设置歌词中间显示当大于5时
               
                if(lineNum > 5){
                    // console.log(this.$refs); // 获取当前Vue实例
                    let lineEl = this.$refs.lyricLine[lineNum - 5];// 当已经滚到了第5行的时候,  获取第一行的元素
                    this.$refs.lyricList.scrollToElement(lineEl,1000);// 往上滚动 滚到把lineEl遮住位置
                }else{
                    this.$refs.lyricList.scrollTo(0,0,1000);// 往上滚动 几行
                }
                // 保存当前行数的歌词, 设置为CD主界面的歌词
                this.playingLyric=txt;
            },

            // h5的手指滑动事件
            // 手指开始
            middleTouchStart(e){
                this.touch.initiated = true; //打开开关
                // 获取手指触摸位置
                const touch = e.touches[0];
                this.touch.startX = touch.pageX;
                this.touch.startY = touch.pageY;
            },
            // 手指移动
            middleTouchMove(e){
                if (!this.touch.initiated) { // 判断开关是否打开
                    return
                }
                // 获取手指滑动位置
                const touch = e.touches[0];
                // 获取手指滑动的 偏移量
                const deltaX = touch.pageX - this.touch.startX;
                const deltaY = touch.pageY - this.touch.startY;

                // 判断用户是水平还是垂直滑动, 垂直滑动则啥也不干
                if (Math.abs(deltaY) > Math.abs(deltaX)) {
                    return
                }

                // 确定是水平滑动的时候, 就判断当前是啥状态, 如果是cd的话, 说明没有移动,
                // 如果是歌词的话, 那么就是已经移动了负的屏幕宽度
                const left = this.currentShow === 'cd' ? 0 : - window.innerWidth;

                // 计算默认偏移量, 最小是不偏移, 最多偏移整个屏幕的宽度
                const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));

                // 计算偏移的百分比, 用来设置CD模块的透明度, 并存储起来
                this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
            
                this.$refs.middleL.style.opacity = 1 - this.touch.percent;
                this.$refs.middleL.style[transitionDuration] = 0;

                // //设置歌词部分的偏移量
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
                this.$refs.lyricList.$el.style[transitionDuration] = 0;

            },
            // 手指结束
            middleTouchEnd(){
                let offsetWidth;
                let opacity;
                if (this.currentShow === 'cd') {
                    if (this.touch.percent > 0.1) { //偏移超过10%, 则进行切换
                        offsetWidth = -window.innerWidth;
                        opacity = 0;
                        this.currentShow = 'lyric';
                    } else { // 不超过, 则不切换
                        offsetWidth = 0;
                        opacity = 1;
                    }
                } else {
                    if (this.touch.percent < 0.9) {//偏移超过10%, 则进行切换, 这是向右滑动, 实际偏移是变少了
                        offsetWidth = 0;
                        this.currentShow = 'cd';
                        opacity = 1;
                    } else {// 不超过, 则不切换
                        offsetWidth = -window.innerWidth;
                        opacity = 0;
                    }
                }
                //设置动画过渡时间
                const time = 300;
                //设置歌词部分的偏移量
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
                this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
                //设置CD部分的透明度和动画效果
                this.$refs.middleL.style.opacity = opacity;
                this.$refs.middleL.style[transitionDuration] = `${time}ms`;
                this.touch.initiated = false;
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
                        top: 20px
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
                        margin: 0 5px

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