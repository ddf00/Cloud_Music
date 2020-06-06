  let starY = 0;
  let moveY = 0;
  let moveDis = 0;
  import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recentPlayList: [], //播放记录
    coverTransform: "", // 位移
    coverTransition: "", // 过度
    userInfo: {}, // 用户信息
    recentPlayList: [], //最近播放列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息 储存到data中
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo)
      })
    }; 
    // 如果没有登录 就不发送请求 不继续往下执行
    if(!userInfo)  return
    // 获取uid
    const uid = this.data.userInfo.userId
    this.getPlayList(uid)
  },

  // 获取播放记录
  async getPlayList(uid) {
    let playList = await request('/user/record', {uid, type: 1})
    this.setData({
      recentPlayList: playList.weekData
    })
  },
  // 滑动回弹效果
  handleTouchStart(event){
    starY = event.touches[0].clientY
    this.setData({
      coverTransition: ""
    })
  },
  handleTouchMove(event){
    moveY = event.touches[0].clientY
    moveDis = moveY - starY
    if(moveDis < 0) return
    else if(moveDis > 80) moveDis = 80
    this.setData({
      coverTransform: `translateY(${moveDis}px)`,
      coverTransition: `transform 1s ease`
    })
  },
  handleTouchEnd(){
    this.setData({
      coverTransform: "",
      coverTransition: `transform 1s ease`
    })
  },

  // 点击去登录
  toLogin() {
    if(this.data.userInfo.nickname) return
    wx.redirectTo({
      url: '/pages/login/login',
    });
  },

  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})