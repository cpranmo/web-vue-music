import Vue from 'vue';
import Vuex from 'vuex';
import state from "./state";
import mutations from "./mutations";
import * as getters from "./getter";
import * as actions from "./actions";
// 这是一个vuex的小插件, 可以提示我们 state的值在改变前后的变化 
import createLogger from "vuex/dist/logger";

Vue.use(Vuex);
// 开启调试工具, 在非生成编译的时候就启用
const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    strict: debug, // 开启debug 选项
    plugins: debug ? [createLogger()] : []
});