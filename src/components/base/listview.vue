<template>
    <scroll
            :listen-scroll="listenScroll"
            :probe-type="probeType"
            :data="data"     
            class="listview"
            ref="listview">
        <uL>
            <!-- 循环每个歌手列表 -->
            <li v-for="item in data"  @click="selectItem(item)"  v-bind:key="item.singer_mid" class="list-group-item"  
                ref="listGroup">
                <img class="avatar" v-bind:src="item.singer_pic">
                <span class="name">{{item.singer_name}}</span>
            </li>
        </uL>
        <div v-show="!data.length" class="loading-container"> <!-- 加载效果-->
            <loading></loading>
        </div>
    </scroll>
</template>

<script>
    import Scroll from './scroll';   // 导入移动组件
    import Loading from './loading'; // 导入加载组件
    export default {
        name: "listview",
        props: {  // 子组件获取父组件的值
            data: {
                type: Array
            }
        },
        created() {
            this.probeType = 3;
            this.listenScroll = true;
        },
        methods: {
            selectItem(item) {
                this.$emit('select', item);// 给父组件传入当前点击的数据
            },
            refresh() {// 控制重新渲染
                this.$refs.listview.refresh()
            },
            _calculateHeight() {// 计算高度
                this.listHeight = [];
                const list = this.$refs.listGroup;// 获取元素列表
                // eslint-disable-next-line no-console
                // console.log(this.$refs);
                let height = 0//初始高度
                this.listHeight.push(height)
                for (let i = 0; i < list.length; i++) {
                    let item = list[i]
                    height += item.clientHeight// 叠加
                    this.listHeight.push(height)// 获得列表的总高度
                }
            }
        },
        watch: {
            data() {
                setTimeout(() => {// 获得数据后重新更新数据
                    this._calculateHeight()
                }, 20)
            }
        },
        components: {
            Scroll,
            Loading
        }
    }

</script>

<style scoped lang="stylus">
    @import "../../assets/stylus/variable.styl"
    .listview
        position: relative
        width: 100%
        height: 100%
        overflow: hidden
        background: $color-background

        .list-group-item
            display: flex
            align-items: center
            padding: 20px 0 0 30px
                
            .avatar
                width: 50px
                height: 50px
                border-radius: 50%

            .name
                margin-left: 20px
                color: $color-text-l
                font-size: $font-size-medium


        .loading-container
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>
