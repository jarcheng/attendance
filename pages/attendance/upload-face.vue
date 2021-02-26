<template>
	<view>
		<view class="camera-wrapper">
			<camera class="camera" device-position="front" flash="off" @error="error"></camera>
		</view>
		<u-button @click="uploadFace">点击上传</u-button>
	</view>
</template>

<script>
	import {
		upload
	} from '@/utils/api.js'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			uploadFace() {
				const ctx = uni.createCameraContext();
				ctx.takePhoto({
					quality: 'high',
					success: (res) => {
						upload(res.tempImagePath).then(res => {
							const url = JSON.parse(res[1].data).data.url
							uni.request({
								url: 'http://192.168.31.112:5500/upload_face',
								method: 'POST',
								data: {
									"url": this.getImgPath(url, false),
									"id": this.userInfo.id
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
</style>
