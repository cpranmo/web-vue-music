import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import VueLazyload from 'vue-lazyload';  // 引入赖加载
import attachFastClick from "fastclick"; // 引入fastclick解决移动端300ms延迟问题
import "./assets/stylus/index.styl"; // 引入主stylus文件
attachFastClick.attach(document.body) // 应用把该插件作用于整个body上
Vue.config.productionTip = false; // 阻止生产日志信息


Vue.use(VueLazyload);
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/loading/default.png'),   // 加载失败图片
  loading: require('./assets/loading/default.png'),  // 加载中默认图片
  attempt: 1,
  listenEvents:['scroll','wheel'], 
});


new Vue({
    router, // 调用路由
    store,
    render: h => h(App)
}).$mount('#app')