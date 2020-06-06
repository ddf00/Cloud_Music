import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取用户输入
  handleInput(event){
    let type = event.currentTarget.dataset.type
    this.setData({
      [type]: event.detail.value
    })
  },

  // 点击登录
  async login() {
    // 收集数据
    let {phone, password} = this.data
    // 前端验证
    if(!phone || !password) {
      // 前端验证不通过
      wx.showToast({
        // 错误提示信息
        title: '小婊砸手机号或密码不能为空!!',
        icon: 'none', //隐藏图标
      })
    }else {
      // 前端验证通过
      /* 
        状态码:
        200: 成功
        400: 手机号错误
        502: 密码错误
      */
      let result = await request(`/login/cellphone`, {phone, password, isLogin: true})
      const {code} = result
      if(code === 400) {
        wx.showToast({
          // 错误提示信息
          title: '手机号错误',
          icon: 'none', //隐藏图标
        })
      }else if(code === 502) {
        wx.showToast({
          // 错误提示信息
          title: '密码错误',
          icon: 'none', //隐藏图标
        })
      }else if(code === 200) {
        wx.showToast({
          // 错误提示信息
          title: '登录成功',
          success: ()=>{
            wx.switchTab({
              url: "/pages/personal/personal"
            });
            wx.setStorage({
              key: 'userInfo',
              data: JSON.stringify(result.profile),
            });
          }
        })
       
      }
    }
    // 后端验证
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