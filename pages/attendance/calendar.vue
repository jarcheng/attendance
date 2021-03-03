<template>
	<view>
		<calendar @dateChange="loadSign" :dataSource="days"></calendar>
	</view>
</template>

<script>
	import calendar from '../../components/calendar.vue'
	export default {
		data() {
			return {
				days: []
			}
		},
		components: {
			calendar
		},
		onShow() {
			let month = new Date().getFullYear() + '-' + (new Date().getMonth() + 1)
			this.loadSign(month)
		},
		methods: {
			loadSign(month) {
				let splits = month.split("-")
				if(parseInt(splits[1])<10){
					splits[1]='0'+splits[1]
				}
				this.$http("/at-attendance/listByMonth", "get", {
					month: splits.join('-')
				}).then((res) => {
					res.data.data.forEach(value => this.days.push(value.createTime))
				})
			},
		}
	}
</script>

<style>

</style>
