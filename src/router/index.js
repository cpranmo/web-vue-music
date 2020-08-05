import Vue from 'vue';
import VueRouter from 'vue-router';
import Recommend from "../components/recommend"; // 默认会导入目录中 index 文件
import Singer from "../components/singer";
import Rank from "../components/rank";
import Search from "../components/singer";


Vue.use(VueRouter); // 引入路由中间件

const routes = [
    // 根路由
    {
        path: "/",
        redirect: "/recomend", // 默认重定向到推荐页面
    },
    // 推荐路由
    {
        path: '/recomend',
        name: "recommend",
        component: Recommend,
    },
    // 歌手路由
    {
        path: "/singer",
        name: "singer",
        component: Singer,
    },
    // 排行路由
    {
        path: "/rank",
        name: "rank",
        component: Rank,
    },
    // 搜索路由
    {
        path: "/search",
        name: "search",
        component: Search
    },

]

const router = new VueRouter({
    // 点击路由自定义添加一个激活类名
    linkActiveClass: "active",
    mode: 'history', // 设置为 history 路由，记得后端要配置
    base: process.env.BASE_URL,
    routes
})

export default router