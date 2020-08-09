<template>
    <!-- 轮播组件 -->
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot> 
                <!-- 使用插槽存放图片 -->
            </slot>
        </div>
        <!-- 按钮 -->
        <div class="dots">
            <span class="dot" v-bind:class="{active: currentPageIndex === index }" 
                v-for="(item, index) in dots"
                v-bind:key="item" 
                v-bind:index="index">
            </span>
        </div>
    </div>
</template>

<script>
    import { addClass } from '../../assets/js/dom';
    import BScroll from 'better-scroll';
    export default {
        name: 'slider',
        props: {
            //循环轮播
            loop: {//默认不循环
                type: Boolean,
                default: false
            },
            //自动轮播
            autoPlay: {
                type: Boolean,
                default: true
            },
            //自动轮播的时间参数
            interval: {
                type: Number,
                default: 4000
            }
        },
        data() {
            return {
                dots: [],
                currentPageIndex: 0   // 当前轮播位置
            }
        },
        mounted() {
            // 设置定时器延迟触发只有当图片加载完才执行
            setTimeout(() => {
                this._setSliderWidth();
                this._initDots();
                this._initSlider();
               
                if (this.autoPlay) {  // 为真时执行
                    this._play();
                }
            }, 250);

            window.addEventListener('resize', () => {
                if (!this.slider) {
                    return;
                }
                this._setSliderWidth(true);
                this.slider.refresh();
            })
        },
        destroyed() {
            // 路由销毁时清除定时器
            clearTimeout(this.timer)
        },
        methods: {
            //设置slider的宽度
            _setSliderWidth(isResize) {
                this.children = this.$refs.sliderGroup.children;
                // console.log(this.children.length);
                // 拿到子元素的个数, 根据图片的个数渲染出对应的dot的个数
                let width = 0;// 默认宽度值为0, 后面再增加
                let sliderWidth = this.$refs.slider.clientWidth; // 获取整个的slider的宽度
                for (let i = 0; i < this.children.length; i++) {
                    let child = this.children[i];
                    addClass(child, 'slider-item');         // 设置对应好的样式名称,方便样式的装饰灯等
                    child.style.width = sliderWidth + 'px'; // 设置每张图片的宽度
                    width += sliderWidth;                   // 总宽度等于单个图片的宽度*个数
                }
                if (this.loop && !isResize) {
                    width += 2 * sliderWidth 
                }
                this.$refs.sliderGroup.style.width = width + 'px' // 设置整个滑动组件的总宽度
            },
            _initSlider() {
                // 初始化一个silder组件
                this.slider = new BScroll(this.$refs.slider, {
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    snap: true,
                    snapLoop: this.loop, // 是否循环
                    snapThreshold: 0.3,
                    snapSpeed: 400
                })
                // 监听滚动事件 当翻到下一页结束后,改变索引, 得到小圆点的变化效果
                this.slider.on('scrollEnd', () => {
                    // 获取当前的第几个子元素
                    let pageIndex = this.slider.getCurrentPage().pageX;

                    // console.log(this.slider.getCurrentPage());

                    this.currentPageIndex = pageIndex; // 存储一下当前的页面索引值

                    if (this.autoPlay) {  // 如果开启了自动播放, 那么就清楚定时器并手动再启动一次
                        clearTimeout(this.timer);
                        this._play()
                    }
                })
            },

            _initDots() {
                // 得到按钮个数
                this.dots = new Array(this.children.length);
            },
            
            _play() {
                  
                let pageIndex = this.currentPageIndex + 1;

                this.timer = setTimeout(() => {     
                    if(pageIndex >= this.children.length){
                        pageIndex = 0;
                    }   
                    this.slider.goToPage(pageIndex, 0, 400);
                }, this.interval);
            }
        }
    }
</script>

<style scoped lang="stylus">
    @import "../../assets/stylus/variable";

    .slider
        min-height: 1px

        .slider-group
            position: relative
            overflow: hidden
            white-space: nowrap

            .slider-item
                float: left
                box-sizing: border-box
                overflow: hidden
                text-align: center

                a
                    display: block
                    width: 100%
                    overflow: hidden
                    text-decoration: none

                img
                    display: block
                    width: 100%
                    background: center

        .dots
            position: absolute
            right: 0
            left: 0
            bottom: 12px
            text-align: center
            font-size: 0

            .dot
                display: inline-block
                margin: 0 4px
                width: 8px
                height: 8px
                border-radius: 50%
                background: $color-text-l

                &.active
                    width: 20px
                    border-radius: 5px
                    background: $color-text-ll
</style>