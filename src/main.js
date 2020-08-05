import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import attachFastClick from "fastclick" // 引入fastclick解决移动端300ms延迟问题


attachFastClick.attach(document.body) // 应用把该插件作用于整个body上
Vue.config.productionTip = false // 阻止生产日志信息

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')