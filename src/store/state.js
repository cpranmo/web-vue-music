import { playMode } from "../assets/js/config";
const state = {
    singer: {}, // 歌手信息
    playing: false, // 播放器状态是否播放
    fullScreen: false, // 播放器界面, 是否全屏
    playlist: [], // 播放列表
    sequenceList: [], // 顺序播放列表
    playMode: playMode.sequence, // 播放模式, 我们在common目录下的js目录下新建一个config文件, 存储一些配置信息,默认顺序
    currentIndex: -1, // 当前播放的歌曲, 默认不播放设置为-1
    topList: {}, // 排行歌单详细列表
}

export default state; // 默认导出