import config from "./config";
export default (url,data={},method="GET")=>{
    return new Promise((resolve, reject)=>{
        wx.request({
            url: config.host + url,
            // url: config.mobileHost + url,
            data,
            method,
            header: {
                cookie: (wx.getStorageSync('cookie') || []).toString()
            },
            // 请求成功 
            success: (res)=>{
                if(data.isLogin) {
                    // 把cookie保存到本地
                    wx.setStorage({
                        key: 'cookie',
                        data: res.cookies,
                    });
                }
                resolve(res.data)
            },
            // 请求失败
            fail: (error)=>{
                console.log('请求失败',error)
                reject(error)
            },
        });
    })
    
}