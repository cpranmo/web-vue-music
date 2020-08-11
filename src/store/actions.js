// 批量操作数据
import * as types from "./mutation-type";
// 引入连个库文件
import { playMode } from "../assets/js/config";
import { shuffle } from "../assets/js/util";

export const selectPlay = function({ commit }, { list, index }) {
    commit(types.SET_PLAYLIST, list);
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_SEQUENCE_LIST, list);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
}

// 歌曲头部随机播放设置
export const randomPlay = function({ commit }, { list }) {
    commit(types.SET_PLAY_MODE, playMode.random); // 播放类型
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList); // 随机歌单
    commit(types.SET_CURRENT_INDEX, 0); // 0开始
    commit(types.SET_SEQUENCE_LIST, list);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
};