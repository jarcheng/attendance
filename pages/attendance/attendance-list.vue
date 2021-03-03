<template>
	<view>
		<u-calendar v-model="show" :mode="mode" @change="change"></u-calendar>
		<u-table>
			<u-tr class="u-tr">
				<u-th class="u-th">姓名</u-th>
				<u-th class="u-th">签到日期</u-th>
				<u-th class="u-th">是否签到</u-th>
			</u-tr>
			<u-tr class="u-tr" v-for="(row,index) in tableData">
				<u-td class="u-td">{{row.user.username}}</u-td>
				<u-td class="u-td">{{row.signTime?row.signTime.substring(10):row.signTime}}</u-td>
				<u-td class="u-td sign-td" :class="{'sign':row.isSign}">{{row.isSign}}</u-td>
			</u-tr>
		</u-table>
		<view class="btn-wrapper">
			<u-button type="primary" @click="show=true">选择日期</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				mode: 'date',
				tableData:[]
			}
		},
		methods: {
			change(e) {
				this.loadData(e.result)
			},
			loadData(day){
				this.$http("/at-attendance/listByDay","get",{day:day}).then(res=>{
					this.tableData=res.data.data
				})
			},
		}
	}
</script>

<style lang="scss">
	.sign-td{
		background-color: red;
	}
	.sign{
		background-color: #18B566;
	}
	.btn-wrapper{
		margin-top: 150rpx;
		width: 100%;
		display: flex;
		justify-content: center;
	}
</style>
