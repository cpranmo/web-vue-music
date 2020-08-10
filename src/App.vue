<template>
	<div id="app">
		<m-header></m-header>
		<tab></tab>
		<!-- 路由切换 -->
		<keep-alive>
			<router-view></router-view> 
		</keep-alive>
		<player></player>
	</div>
</template>

<script>
	import MHeader from "./components/mheader";   
	import Tab from "./components/tab"; 
	import Player from "./components/player";  // 播放器

	export default {
		data () {
			return {
				
			}
		},
		components: {
			"m-header": MHeader,  // 组件标签尽量小写
			Tab,
			Player,
		}
	}
</script>
<style lang="stylus">

</style>
