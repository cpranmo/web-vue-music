// 这样后期就可以通过对象属性的方式访问, 简单明了
import  * as types  from "./mutation-type";

const mutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer; // 存储歌手
    },
}



export default mutations;