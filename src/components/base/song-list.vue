<template>
    <!-- 歌曲列表组件 -->
    <div class="song-list">
        <ul>
            <li v-for="(song,index) in songs" class="item"  v-bind:key="song.songMid"  @click="selectItem(song,index)">
                <div class="rank" v-show="rank">
                    <span class="icon" :class="{icon0: index===0 ? 'icon0' : '',
                    icon1: index===1 ? 'icon1' : '' , icon2: index===2 ? 'icon2' : ''
                    }"> {{ index + 1 }}</span> </div>
                <div class="content">
                    <h2 class="name">{{song.songName}}</h2>
                    <p class="desc">{{ song.singer[0].name }} -- {{song.songAlbumName}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            songs: {
                type: Array
            },
            rank:{
                type: Boolean,
            }
        },
        methods:{
            // 
            selectItem(item,index){
                // 子传父发射事件，歌曲和当前索引传入父组件
                this.$emit("select",item,index);
            }
        },
        mounted () {
            //  console.log(this.songs)        
        }   

    }
</script>

<style scoped lang="stylus">
    @import "../../assets/stylus/variable.styl"
    @import "../../assets/stylus/mixin.styl"

    .song-list
        .item
            display: flex
            align-items: center
            box-sizing: border-box
            height: 64px
            font-size: $font-size-medium

            .rank
                flex: 0 0 25px
                width: 25px
                margin-right: 30px
                text-align: center
                color: #AC8C2C
                font-weight bold
                font-size: 16px

                .icon
                    display: inline-block
                    width: 25px
                    height: 24px
                    background-size: 25px 24px

                    &.icon0
                        background-image :  url('../../assets/images/first.png')

                    &.icon1
                        background-image : url('../../assets/images/second.png')

                    &.icon2
                        background-image : url('../../assets/images/third.png')
                      

                .text
                    color: $color-theme
                    font-size: $font-size-large

            .content
                flex: 1
                line-height: 20px
                overflow: hidden

                .name
                    no-wrap()
                    color: $color-text

                .desc
                    no-wrap()
                    margin-top: 4px
                    color: $color-text-d
</style>