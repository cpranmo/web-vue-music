<template>
	<div id="app">
		<m-header></m-header>
		<tab></tab>
		<!-- 路由切换 -->
		<router-view></router-view> 
	</div>
</template>

<script>
	import MHeader from "./components/mheader";   
	import Tab from "./components/tab"; 

	export default {
		data () {
			return {
				
			}
		},
		components: {
			"m-header": MHeader,  // 组件标签尽量小写
			"tab": Tab,
		}
	}
</script>
<style lang="stylus">

</style>
