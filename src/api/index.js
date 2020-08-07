// 所有的接口文件使用(局部导入)
import axios from "axios" // es6的写法

// 匹配默认的参数
axios.defaults.baseURL = "http://localhost:3200"; // 默认访问的地址
// 跨域引许带cookie
axios.defaults.withCredentials = true;
// 设置post请求格式
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";


// 默认导出所有接口的集合
export default {

    // 推荐请求发送
    getrecommend() {
        return axios.get("/recommend");
    },








}