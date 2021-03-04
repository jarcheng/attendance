<template>
	<view>
		<view class="user-head">
			<image class="background" src="../../static/img/background.jpg"></image>
			<view class="user-wrapper">
				<view class="user-section">
					<view class="user-info" @click="switchPage('user-edit')">
						<image mode="widthFix" :src="getImgPath(userInfo.portrait)" v-if="userInfo&&userInfo.portrait"></image>
						<image mode="widthFix" src="../../static/logo.jpg" v-else></image>
						<view class="username">
							<text class="name">{{userInfo?userInfo.nickname:"您还未登录,点击登录"}}</text>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="divider">
			<view class="front">我的服务</view>
			<view class="rear">MY SERVICE</view>
		</view>
		<view class="functions">
			<view class="function" @click="switchPage('../attendance/upload-face')">
				<image class="icon" src="../../static/icon/face.png"></image>
				<button class="name" size="mini" plain="">录入人脸</button>
			</view>
			<view class="function" @click="switchPage('../attendance/attendance')">
				<image class="icon" src="../../static/icon/sign.png"></image>
				<button class="name" size="mini" plain="">签到</button>
			</view>
			<view class="function" @click="switchPage('../attendance/attendance-list')">
				<image class="icon" src="../../static/icon/calendar.png"></image>
				<button class="name" size="mini" plain="">出勤情况</button>
			</view>
			<view class="function" @click="signOut" v-if="userInfo">
				<image class="icon" src="../../static/icon/signOut.png"></image>
				<button class="name" size="mini" plain>退出登录</button>
			</view>
		</view>
		<u-modal v-model="show" :show-cancel-button="true" title=" ">
			<view class="kefu-content">
				<image class="kefu" src="../../static/icon/kefu.jpg"></image>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		getUserInfo
	} from '@/utils/api.js'
	export default {
		computed: {
			...mapState(['userInfo'])
		},
		data() {
			return {
				show: false
			};
		},
		onShow() {
			//异步获取本地的token来判断用户是否登录,已经登录就加载“我的信息”。
			//如果一开始没登陆直接就getInfo肯定得不到信息,后台返回未登录。
			//又因为我在http.js里面对返回结果进行了统一处理,请求结果是没登陆,页面会直接定向到登录页面,
			//用户还没了解app就被强行要求登录,体验感不好,所以先判断本地有没有token,有token代表已经登录了
			//这时候发送请求就不会被重定向到登录页面。
			uni.getStorage({
				key: "token",
				success: () => {
					this.getInfo()
				}
			})
		},
		methods: {
			signOut() {
				this.$store.commit('setUserInfo', {})
				uni.removeStorage({
					key: 'token',
					success: () => {
						uni.navigateTo({
							url: '../login/login'
						})
					}
				})
			},
			switchPage(value) {
				if (value == 'user-edit' && !this.userInfo) {
					value = "../login/login"
				}
				uni.navigateTo({
					url: value
				})
			},
			switchTab(value) {
				uni.switchTab({
					url: value
				})
			},
			handleZixun() {
				uni.showToast({
					title: '待开发中',
					icon: 'loading'
				})
			},
			//获取用户的信息,refresh代表刷新token,延长使用登录时间
			getInfo() {
				getUserInfo({
					refresh: true
				}).then((res) => {
					if (!res.data.data.portrait) {
						if (!this.userInfo.portrait) {
							this.show = true
						}
					}
					this.userInfo = res.data.data
					this.$store.commit("setUserInfo", res.data.data)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fcfcfc;
	}

	.user-head {
		position: relative;

		.background {
			position: relative;
			max-width: 100%;
			max-height: 500.35upx;
			width: 100%;
		}

		.user-wrapper {
			position: absolute;
			width: 100%;
			display: flex;
			justify-content: center;
			bottom: -75rpx;

			.user-section {
				box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
				position: relative;
				width: 100%;
				height: 150rpx;
				background-color: white;
				float: right;
				margin: 20upx 40upx;
				padding: 20upx;
				border-radius: 10upx;

				.user-info {
					position: absolute;
					top: -60rpx;
					left: 70rpx;
					display: flex;
					align-items: flex-end;

					image {
						width: 140.67rpx;
						height: 140.67rpx;
						border-radius: 50%;
						margin-right: 50rpx;
						box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);

					}

					.username {
						margin-bottom: 20rpx;

						.name {
							font-weight: bold;
							font-size: 35rpx;
							margin-right: 20rpx;
						}
					}
				}
			}
		}

	}



	.functions {
		box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
		background-color: white;
		margin: 0 40upx;
		padding: 40upx 20upx;
		border-radius: 10upx;
		display: flex;
		// justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;

		.function {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 25%;

			.name {
				background-color: white;
				border: 0;
				padding: 10rpx 0;
				color: #9e9e9e;
				font-size: 25rpx;
				// padding: 0;
			}
		}
	}

	.icon {
		width: 55rpx;
		height: 50rpx;
	}

	.kefu-content {
		width: 100%;
		display: flex;
		justify-content: center;

		.kefu {
			width: 400rpx;
			height: 592rpx;
		}
	}

	.divider {
		margin-top: 70upx;
		display: flex;
		padding: 40rpx 0 10rpx 40rpx;
		align-items: flex-end;

		.front {
			font-size: 35rpx;
			font-weight: bold;
			margin-right: 10rpx;
		}

		.rear {
			font-size: 25rpx;
			color: #c3c3c3;
		}
	}
</style>
