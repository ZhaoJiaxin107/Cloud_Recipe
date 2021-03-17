
import config from "../../utils/config"
import api from "../../utils/api"
// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [
    ]
  },
  // 1.接收index页面传来的数据
  onLoad(options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this._getData(options.typeid)
  },
  // 2.根据typeid请求相关的菜谱分类数据
  async _getData(id) {
    let result = await api.findAll(config.recipes, { recipeTypeId: id, status: 1 },
      { fild: "views", sort: "desc" })
    // console.log(result)
    if (result != null) {
      this.setData({
        lists: result.data
      })
    }

  }

})