// pages/type/type.js
import config from "../../utils/config"
import api from "../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types:[]
  }, 
  onLoad(){
    this._getTypeRecipe()
  },
  // 1.获取所有的分类菜谱数据
  async _getTypeRecipe(){
    let result = await api.findAll(config.typesTable)
    this.setData({
      types: result.data
    })
  },
  // 2.跳转列表页
  _goListPage(e){
    let {title, typeid} = e.currentTarget.dataset
    wx.navigateTo({
      url:'../list/list?typeid='+typeid+'&title='+title
    })
  }
})