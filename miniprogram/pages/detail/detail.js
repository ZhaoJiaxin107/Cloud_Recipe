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
    // 根据菜谱id 查询菜谱名称
    let recipe = await api.findAll(config.typesTable, {_id: result.data.recipeTypeId})
    result.data.typeInfo = recipe.data[0]
    // console.log(result)
    // 根据openid, 查询用户userinfo
    let info = await api.findAll(config.userTable, {_openid: result.data._openid})
    result.data.userInfo = info.data[0].userInfo
    this.setData({
      detailArr: result.data
    })
    this.setData({
      detailArr: result.data
    })
    // console.log(this.data.detailArr)
  }
})