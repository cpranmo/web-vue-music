// 这样后期就可以通过对象属性的方式访问, 简单明了
import  * as types  from "./mutation-type";

const mutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer; // 存储歌手
    },
    [types.SET_PLAYING_STATE](state, flag) {
        state.playing = flag // 是否播放
    },
    [types.SET_FULL_SCREEN](state, flag) {
        state.fullScreen = flag // 是否全屏
    },
    [types.SET_PLAYLIST](state, list) {
        state.playlist = list // 播放列表
    },
    [types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list // 顺序播放
    },
    [types.SET_PLAY_MODE](state, mode) {
        state.playMode = mode // 播放模式
    },
    [types.SET_CURRENT_INDEX](state, index) {
        state.currentIndex = index // 当前播放
    },
}



export default mutations;