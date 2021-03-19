
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
    // console.log(options)
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this._getData(options.typeid, options.tag)
  },
  // 2.根据typeid请求相关的菜谱分类数据
  async _getData(id, tag) {
    // console.log(tag)
    let where = []
    let orderBy = []
    switch (tag) {
      case 'normal':
        where = {
          recipeTypeId: id,
          status: 1
        }
        orderBy = {
          fild: 'views',
          sort: 'desc'
        }
        break;
      case "hot":
        where = {
          status: 1
        }
         orderBy = {
          fild: "views",
          sort: "desc"
        }
        break;
      default:
        break
    }
   
    let result = await api.findAll(config.recipes, where, orderBy)
    // 处理用户信息问题
     // 获取相对应的数据
     let arr = []
     result.data.map((item, index) => {
         // console.log(item._openid)
         let resList = api.findAll(config.userTable, {
             _openid: item._openid
         })
         arr.push(resList)
     })
     let arr1 = await Promise.all(arr)
     // console.log("arr1", arr1)

     result.data.map((item, index) => {
         return item.userInfo = arr1[index].data[0].userInfo
     })
    // console.log("list", result)
    if (result != null) {
      this.setData({
        lists: result.data
      })
    }

  }

})