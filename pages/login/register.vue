<template>
	<view>
		<view class="main">
			<view class="center">
				<view class="logo">
					<image mode="widthFix" src="../../static/logo.jpg"></image>
				</view>
				<view class="form">
					<input placeholder="请输入手机号" v-model="phoneNumber" placeholder-style="color: rgba(255,255,255,0.8);" />
					<input placeholder="请输入密码" v-model="password" password=true placeholder-style="color: rgba(255,255,255,0.8);" />
					<view class="btn" @tap="doReg">立即注册</view>
					<view class="res">
						<view @tap="toLogin">已有账号立即登录</view>
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
				phoneNumber: "",
				code: '',
				password: "",
				getCodeText: '获取验证码',
				getCodeBtnColor: "#ffffff",
				getCodeisWaiting: false
			}
		},
		onLoad() {

		},
		methods: {
			doReg() {
				uni.hideKeyboard()
				//模板示例部分验证规则
				if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber))) {
					uni.showToast({
						title: '请填写正确手机号码',
						icon: "none"
					});
					return false;
				}
				uni.showLoading({
					title: '提交中...'
				})
				const data = {
					phoneNumber: this.phoneNumber,
					password: md5(this.password),
					code: this.code
				}
				uni.request({
					url: taskUrl + "/user/signUp",
					method: 'POST',
					data: data
				}).then((res) => {
					res = res[1]
					uni.hideLoading()
					console.log(res)
					if (res.data.code == 0 && res.data.data.token) {
						uni.setStorage({
							key: 'token',
							data: res.data.data.token,
							success: function() {
								uni.reLaunch({
									url: '../index/index'
								})
							}
						})
					} else {
						uni.showToast({
							title: res.data.data,
							icon: "none"
						})
					}
				})
			},
			toLogin() {
				uni.redirectTo({
					url: 'login'
				});
			}
		}
	}
</script>

<style lang="scss">
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
</style>
