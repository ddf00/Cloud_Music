import request from "../../utils/request";
import moment from "moment";
const appInstance = getApp()
import Pubsub from "pubsub-js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    musicId: '', // 音乐的唯一Id
    song: {},
    musicLink: '', // 音频链接
    currentTimeFormat: '00:00', //音乐播放开始进度的时间
    durationTimeFormat: '00:00', // 当前音乐的总时长
    currentWidth: 0, //实时进度条长度
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId
    this.getMusicInfoById(musicId)
    this.backAudioManager = wx.getBackgroundAudioManager();
    this.backAudioManager.onTimeUpdate(()=>{
      // 动态计算实时进度条的宽度
      this.setData({
        currentTimeFormat: moment(this.backAudioManager.currentTime * 1000).format('mm:ss'),
        currentWidth: this.backAudioManager.currentTime / this.backAudioManager.duration * 450,
      })
    })

    // 监听音乐bb播放结束
    this.backAudioManager.onEnded(()=>{

      // 重置和播放的时间
      this.setData({
        currentWidth: 0,
        currentTimeFormat: '00:00'
      })

      Pubsub.publish('swichType', 'next')
      // 切换至写一首
    })
    
    // 判断当前页面音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      // 当页面在播放, 修改播放状态
      this.setData({
        isPlay: true
      })
    }
    // 监听音乐播放 / 暂停 / 停止
    wx.onBackgroundAudioPlay(() => {
      this.changeMusicPlay(true)
    });

    wx.onBackgroundAudioPause(() => {
      this.changeMusicPlay(false)
    });

    wx.onBackgroundAudioStop(() => {
      this.changeMusicPlay(false)
    });

    // 订阅recommend 发送的musicId 消息
    Pubsub.subscribe('musicId', (_, musicId) => {

      this.getMusicInfoById(musicId)
      this.musicControl(true, musicId)
    })
  },

  // 封装修改状态的功能函数
  changeMusicPlay(isPlay){
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
  },

  // 封装根据音乐Id获取音乐详情
  async getMusicInfoById(musicId) {
    // 获取音乐信息, 根据musicId
    let songData = await request('/song/detail', {
      ids: musicId
    })

    let durationTimeFormat = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      musicId,
      durationTimeFormat
    })
    // 动态修改状态栏窗口标签
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },


  // 点击播放
  handlePlay() {
    let isPlay = !this.data.isPlay
    this.setData({
      isPlay
    })
    let {
      musicId,
      musicLink
    } = this.data
    this.musicControl(isPlay, musicId, musicLink)
  },
  // 控制音乐播放和暂停
  async musicControl(isPlay, musicId, musicLink) {
    // 播放
    if (isPlay) {
      // 从未播放过再去拿link
      if (!musicLink) {
        // 发请求  根据musicId获取音乐的播放链接
        let musicLink = await request('/song/url', {
          id: musicId
        })
        this.setData({
          musicLink: musicLink.data[0].url
        })
        // 播放音乐
        // this.backAudioManager = wx.getBackgroundAudioManager();
        this.backAudioManager.src = this.data.musicLink
        this.backAudioManager.title = this.data.song.name
        appInstance.globalData.musicId = musicId
          if(this.data.musicId !== appInstance.globalData.musicId) {
            this.setData({
              currentWidth: 0,
              currentTimeFormat: '00:00'
            })
          }
      } else {
        // 音乐暂停再播放
        this.backAudioManager.play()
      }

    } else {
      // 暂停
      this.backAudioManager.pause()
      appInstance.globalData.isMusicPlay = false
    }
  },

  // 上一首下一首
  swichSong(event) {
    let type = event.currentTarget.id

    // 停止当前音乐的播放
    this.backAudioManager.stop()
    Pubsub.publish('swichType', type)

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