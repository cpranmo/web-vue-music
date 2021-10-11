// 批量操作数据
import * as types from "./mutation-type";
// 引入连个库文件
import { playMode } from "../assets/js/config";
import { shuffle } from "../assets/js/util";
// 导入请求api
import result from "../api/index";

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
    commit(types.SET_CURRENT_INDEX, 0); // 0 开始
    commit(types.SET_SEQUENCE_LIST, list);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
};


// 搜索列表设置
export const questSearch = function({ commit }, { keyword }) { // 请求关键字
    if (!keyword) {
        commit(types.SET_SEARCH, {});
    }
    result.getSearch(keyword)
        .then((data) => {
            // console.log(data.data.songlist);
            commit(types.SET_SEARCH, data.data.songlist); // 提交数据存储到 vuex 中
        })
        .catch(err => {
            console.log("服务器异常~稍后再试");

        });
}