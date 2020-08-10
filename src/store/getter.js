// 获取数据
export  const singer = state => state.singer; // 歌手信息
export const playing = state => state.playing; // 播放器状态
export const playlist = state => state.playlist; // 播放列表
export const sequenceList = state => state.sequenceList; // 顺序播放列表
export const fullScreen = state => state.fullScreen; // 播放器是否全屏
export const playMode = state => state.playMode; // 播放模式
export const currentIndex = state => state.currentIndex; // 当前播放的歌曲
export const currentSong = (state) => {
    return state.playlist[state.currentIndex] || {}; // 类似于一个计算属性, 做一个防错处理, 
};