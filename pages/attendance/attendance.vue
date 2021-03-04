<template>
	<view>
		<view class="title">
			<text class="info" :class="[resultCode==1?'green':'red']" v-if="resultCode<2&&!isUploading">{{resultCode==1?'请上下点头并左右摇头':'未检测到人脸'}}</text>
			<text class="info" :class="[resultCode==3?'green':'red']" v-if="resultCode==2||resultCode==3||resultCode==4">{{resultCode==3?resultMap[resultCode]+":"+username:resultMap[resultCode]}}</text>
			<text class="info green" v-if="isUploading">正在验证</text>
			<text class="info red" v-if="resultCode==5">请先上传头像,再签到</text>
		</view>
		<view class="camera-wrapper">
			<camera class="camera" device-position="front" flash="off" @error="error"></camera>
		</view>
		<button type="primary" v-if="resultCode==2||resultCode==4" @click="rest">点击重试</button>
		<u-toast ref="uToast" />

	</view>
</template>
<script>
	import {
		upload
	} from '@/utils/api.js'
	import {
		mapState
	} from 'vuex'
	import {pyUrl} from '@/utils/env.js'
	
	export default {
		data() {
			return {
				camera: null,
				resultMap: {
					'0': '请将人脸移到框内',
					'1': '已检测到人脸',
					'2': '人脸不匹配',
					'3': '匹配成功',
					'4': '动作不匹配'
				},
				faceUrl:"",
				resultCode: 0,
				timer: 0,
				isUploading: false,
				username: "",
				uid: ""
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			this.takePhoto()
		},
		methods: {
			takePhoto() {
				const ctx = uni.createCameraContext();
				setInterval(() => {
					if (this.resultCode == 0 || this.resultCode == 1) {
						if (this.resultCode == 0) {
							ctx.takePhoto({
								quality: 'low',
								success: (res) => {
									upload(res.tempImagePath).then(res => {
										const url = JSON.parse(res[1].data).data.url
										
										uni.request({
											url:"http://192.168.31.112:5500/detect_face",
											method: 'POST',
											data: {
												"url": this.getImgPath(url, false)
											}
										}).then(res => {
											this.resultCode = res[1].data.code
											
											if(this.resultCode==1){
												this.faceUrl=this.getImgPath(url, false)
											}
										})
									})
								}
							});
						} else {
							if (this.timer == 2) {
								ctx.stopRecord({
									success: (res) => {
										this.isUploading = true
										upload(res.tempVideoPath).then(res => {
											const url = JSON.parse(res[1].data).data.url
											uni.request({
												url: 'http://192.168.31.112:5500/action',
												method: 'POST',
												data: {
													"url": this.getImgPath(url, false),
													"pose": 3,
													"face": this.faceUrl
												}
											}).then(res => {
												if (res[1].data.code == 3) {
													this.username = res[1].data.data.username
													this.uid = res[1].data.data.id
													this.sign()
												}
												this.resultCode = res[1].data.code
												this.isUploading = false
												this.timer = 0
											})
										})
									}
								})
							} else if (this.timer == 0) {
								ctx.startRecord({
									success: () => {

									}
								})
							}
							this.timer++
						}
					}
				}, 1500)
			},
			rest() {
				this.timer = 0
				this.resultCode = 0
				this.isUploading = false
			},
			sign() {
				this.$http("/at-attendance/sign", "get", {
					uid: this.uid
				}).then(res => {
					if (res.data.data == true) {
						this.$refs.uToast.show({
							title: '签到成功',
							type: 'success',
						})
					}
				})
			},
			error(e) {
				console.log(e.detail);
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
			width: 500rpx;
			height: 500rpx;
			border-radius: 50%;
		}
	}

	.title {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-bottom: 50rpx;

		.info {
			font-size: 40rpx;
			font-weight: bold;

			&.green {
				color: green;
			}

			&.red {
				color: red;
			}
		}
	}
</style>
