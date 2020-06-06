import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], //视频导航标签数据
    navId: "", // 导航的标识Id
    videoList: [],  //视频数据
    triggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // let cookie =  wx.getStorageSync('cookie')
    // let isLogin = !!cookie
    // if(!isLogin) {
    //   wx.redirectTo({
    //     url: '/pages/login/login',
    //   });
    //   return
    // }
    let videoGroupListData = await request('/video/group/list')
    let videoGroupList = videoGroupListData.data.slice(0, 15)
    this.setData({
      videoGroupList,
      navId: videoGroupList[0].id
    })

    this.getVideoList(this.data.navId)
  },

    // 获取视频播放列表数据
    async getVideoList(navId){
      let VideoListData = await request('/video/group', {id: navId})
      console.log(VideoListData)
      this.setData({
        videoList: VideoListData.datas,
        triggered: false
      })
    },

  // 获取导航的标识Id
  changeNavId(event) {
    // >>> 位移  二进制 0000 0011  >>>0  向右位移0为 在字符串中使用会转化成number
    let navId = event.currentTarget.dataset.id >>> 0
    this.setData({
      navId
    })
    this.getVideoList(this.data.navId)
  },

  // 下拉刷新
  handleRefresherRefresh() {
    this.getVideoList(this.data.navId)
  },

  // 视频播放, 继续播放的回调
  handlePlay(event) {
    let {id} = event.currentTarget
    
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