// 所有的接口文件使用(局部导入)
import axios from "axios"; // es6的写法

// 匹配默认的参数
// 服务器 http://114.215.201.232
axios.defaults.baseURL = "http://114.215.201.232:3344"; // 默认访问的地址
// 跨域引许带cookie
axios.defaults.withCredentials = true;
// 设置post请求格式
axios.defaults.headers.post["Content-Type"] =
	"application/x-www-form-urlencoded";

// 默认导出所有接口的集合
export default {
	// 推荐请求
	getrecommend() {
		return axios.get("/api/recommend");
	},

	// 推荐歌曲详细请求
	getrecommendDetail(id) {
		// console.log(id);
		return axios.get("/api/recommenddetail/" + id);
	},

	// 歌手列表请求
	getSinger() {
		return axios.get("/api/singer");
	},

	// 歌手详细歌曲请求
	getSingerDetail(mid) {
		// console.log(mid);
		return axios.post("/api/singerdetail", mid);
	},

	// 获取歌曲信息请求
	getSongdetail(mid) {
		// console.log(mid);
		return axios.post("/api/songdetail", mid);
	},

	// 获取歌曲的歌词请求
	getLyric(mid) {
		// console.log(mid);
		return axios.post("/api/lyric", mid);
	},

	// 获取排行信息请求
	getRank() {
		return axios.get("/api/rank");
	},

	// 获取排行歌曲请求
	getRankDetail(mid) {
		return axios.get("/api/rankdetail/" + mid);
	},

	// 获取热门歌曲请求
	getHotKey() {
		return axios.get("/api/hotkey");
	},

	// 获取搜索歌曲请求
	getSearch(mid) {
		// console.log(mid);
		return axios.get("/api/search/" + mid);
	},
};
