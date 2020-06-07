import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    topList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取轮播图数据
    let bannerListData = await request('/banner', {
      type: 2
    })
    this.setData({
      bannerList: bannerListData.banners
    })

    // 获取推荐数据
    let recommendListData = await request('/personalized')
    this.setData({
      recommendList: recommendListData.result
    })

    // 获取排行榜
    let idxs = [0, 1, 2, 3] //获取排行参数
    let index = 0 // 指针
    let toListArr = []
    while(index < idxs.length) {
      let topListResult = await request(`/top/list?idx=${index++}`)
      let topListObj = {
        name: topListResult.playlist.name,
        tracks: topListResult.playlist.tracks.slice(0 ,3)
      }
      toListArr.push(topListObj)
      this.setData({
        topList: toListArr
      })
    }
    
  },

  // 点击区每日推荐
  toRecommend(){
      wx.navigateTo({
        url: '/pages/recommend/recommend',
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