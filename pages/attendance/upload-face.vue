<template>
	<view>
		<view class="camera-wrapper">
			<camera class="camera" device-position="front" flash="off" @error="error"></camera>
		</view>
		<view class="submit">
			<view class="exchange-form">
				<u-input v-model="username" type="text" :placeholder-style="'text-align:center'" class="input" placeholder="请输入姓名"></u-input>
				<u-button @click="doReg()" class="btn" :custom-style="customStyle" type="primary">上传</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		upload
	} from '@/utils/api.js'
	import {
		mapState
	} from 'vuex'
	import {cwUrl,pyUrl} from '@/utils/env.js'
	import md5 from "@/utils/md5.min.js";
	
	export default {
		data() {
			return {
				username: '',
				customStyle: {
					'background-color': 'rgb(68,122,208)'
				},
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			doReg() {
				const data = {
					username: this.username,
					password: md5('12345678'),
				}
				uni.request({
					url: cwUrl + "/user/signUp",
					method: 'POST',
					data: data
				}).then((res) => {
					this.uploadFace()
					res = res[1]
					if (res.data.code == 0 && res.data.data.token) {
					} else {
						uni.showToast({
							title: res.data.data,
							icon: "none"
						})
					}
				})
			},
			uploadFace() {
				const ctx = uni.createCameraContext();
				ctx.takePhoto({
					quality: 'high',
					success: (res) => {
						upload(res.tempImagePath).then(res => {
							const url = JSON.parse(res[1].data).data.url
							uni.request({
								url: pyUrl+'/upload_face',
								method: 'POST',
								data: {
									"url": this.getImgPath(url, false),
									"username": this.username
								}
							}).then(res => {
								uni.showToast({
									title: res[1].data
								})
							})
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.camera-wrapper {
		width: 100%;
		display: flex;
		justify-content: center;

		.camera {
			width: 400rpx;
			height: 400rpx;
			border-radius: 50%;
		}
	}

	.submit {
		width: 100%;
		margin-top: 100rpx;
		display: flex;
		justify-content: center;
		
		.exchange-form {
			margin: 50rpx 20rpx;
			// margin-top: 30rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
		
			.input {
				width: 390rpx;
				background-color: #d4d4d4;
				margin-bottom: 30rpx;
				padding: 10rpx 30rpx;
			}
		
			.btn {
				width: 450rpx;
			}
		
		}
	}
</style>
