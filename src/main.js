import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import attachFastClick from "fastclick"; // 引入fastclick解决移动端300ms延迟问题
import "./assets/stylus/index.styl"; // 引入 主stylus文件

attachFastClick.attach(document.body) // 应用把该插件作用于整个body上
Vue.config.productionTip = false // 阻止生产日志信息

new Vue({
    router, // 调用路由
    store,
    render: h => h(App)
}).$mount('#app')