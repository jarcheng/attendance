<template>
	<view>
		<view class="nav" @click="goback">
			<u-icon name="arrow-left" size="45" color="#e7e7e7"></u-icon>
		</view>
		<view class="main">
			<view class="center">
				<view class="logo">
					<image mode="widthFix" src="../../static/logo.jpg"></image>
				</view>
				<view class="form">
					<input placeholder="手机号" v-model="loginData.username" placeholder-style="color: rgba(255,255,255,0.8);" />
					<input placeholder="请输入密码" v-model="loginData.password" password=true placeholder-style="color: rgba(255,255,255,0.8);" />
					<button class="btn" @tap="doLogin">登录</button>
					<view class="res">
						<view @tap="toReg">去注册</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import md5 from "@/utils/md5.min.js";
	import {
		cwUrl
	} from '@/utils/env.js'
	export default {
		data() {
			return {
				loginData: {
					username: '游客',
					phoneNumber: null,
					password: '12345678'
				},
			}
		},
		methods: {
			goback() {
				uni.navigateBack()
			},
			toReg() {
				uni.redirectTo({
					url: 'register'
				});
			},
			doLogin() {
				// uni.hideKeyboard();
				//验证手机号码
				if ((/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.loginData.username))) {
					this.loginData.phoneNumber = this.loginData.username
					this.loginData.username = null
				}
				this.loginData.password = md5(this.loginData.password)
				uni.showLoading({
					title: '提交中...'
				})
				uni.request({
					url: cwUrl + '/user/login',
					method: 'POST',
					data: this.loginData
				}).then((res) => {
					res = res[1]
					uni.hideLoading()
					if (res.data.code == 0 && res.data.data.token) {
						uni.setStorage({
							key: 'token',
							data: res.data.data.token,
							success: function() {
								uni.reLaunch({
									url: '../user/user'
								})
							}
						})
					} else {
						uni.showToast({
							title: res.data.message,
							icon: "none"
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: linear-gradient(to bottom, #f06c7a 0%, #f06c7a 100%);
		height: 100%;
	}

	.nav {
		margin-left: 20rpx;
		position: absolute;
		z-index: 1;
		top: 60rpx;
	}

	.main {
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;

		.center {
			margin-top: 300rpx;
			width: 500rpx;
			height: 500rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.logo {
				display: flex;
				justify-content: center;

				image {
					box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
					width: 230rpx;
					height: 230rpx;
					border-radius: 50%;
					margin-bottom: 50rpx;
				}
			}

			.form {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.res {
					width: 80%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 100upx;
					color: rgba($color: #ffffff, $alpha: 0.8);
				}

				input {
					margin-bottom: 20rpx;
					color: rgba($color: #ffffff, $alpha: 0.8);
					width: 100%;
					height: 50upx;
					background-color: rgba($color: #ffffff, $alpha: 0.1);
					padding: 20rpx 30rpx;
					border-radius: 45upx;
				}

				.btn {
					margin: 0;
					color: #000;
					// width: 200rpx;
					width: 80%;
					height: 90upx;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 45upx;
					background-color: #fff;
					font-size: 40upx;
				}
			}
		}
	}



	.background {
		left: -40vw;
		position: absolute;
		width: 100vh;
		z-index: -1;
		height: 100vh;
	}
</style>
