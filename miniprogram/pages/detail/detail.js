// pages/detail/detail.js
import config from '../../utils/config'
import api from '../../utils/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      detailArr: []
  },

  onLoad(options){
    // console.log(options)
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this._getDetail(options.id)
  },
  // 根据id请求菜谱详情数据
  async _getDetail(id){
    // console.log(id)
    // 根据id查询数据
    let result = await api.findById(config.recipes, id)
    // console.log('detail', result.data)
    this.setData({
      detailArr: result.data
    })
    // console.log(this.data.detailArr)
  }
})