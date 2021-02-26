export const share= {
    onShareAppMessage(res) { //发送给朋友
        return {}
    },
    onShareTimeline(res) {//分享到朋友圈
        return {}
    },
}
export const getImgPath = {
	methods: {
		getImgPath(url, resize = true, type = 0) {
			if(url.startsWith("http")){
				return url
			}
			if (type == 0) {
				if (resize) {
					return 'https://www.jarcheng.top' + url + '?x-oss-process=image/resize,w_1000';
				} else {
					return 'https://www.jarcheng.top' + url
				}
			} else {
				if (resize) {
					return 'https://my-community.oss-cn-qingdao.aliyuncs.com' + url.replace("/resource","") + '?x-oss-process=image/resize,w_200';
				} else {
					return 'https://my-community.oss-cn-qingdao.aliyuncs.com' + url.replace("/resource","")
				}
			}
		}
	}
}
