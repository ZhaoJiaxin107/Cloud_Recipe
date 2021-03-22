// pages/detail/detail.js
import config from '../../utils/config'
import api from '../../utils/api'
let db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
      detailArr: [],
      isfollow: true, // true代表已经关注 false未关注
      currentId: "" // 当前的菜谱id
  },

  onLoad(options){
    // console.log(options)
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      currentId: options.id // 当前菜谱id
    })
    this._getDetail(options.id)
  },
  // 根据id请求菜谱详情数据
  async _getDetail(id){
    // console.log(id)
    // 更新views字段
    let res = await api.updateById(config.recipes, id, {
      views:db.command.inc(1)
    })
    
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
    // console.log(this.data.detailArr)
    // 判断用户是否登录
    let openid = wx.getStorageSync('openid') || null
    // console.log('openid', openid)
    if(openid == null) {
      this.setData({
        isfollow: false
      })
      return 
    }
    // 已经登录状态, 先去数据表re-follows中查询
    let msg = await api.findAll(config.follows, {_openid:openid, recipeID: id})
    // console.log('msg', msg)
    if(msg === null){
      this.setData({
        isfollow: false
      })
      return
    }
    this.setData({
      isfollow: true
    })
  },
  // 执行关注/未关注操作
  async _dofollow(){
    let openid = wx.getStorageSync('openid') || null
    if(openid == null){
      // 未登录
      wx.showToast({
        title: '请先去登录',
        icon: 'none'
      })
      return
    }
    // console.log("已登录")
    // isfollow true已经关注 false未关注
    if(this.data.isfollow){
      // 删除关注表中的数据
      let where = {
        _openid: openid,
        recipeID: this.data.currentId
      }
      let removeInfo = await api.delBywhere(config.follows, where)
      // 更新 follows 字段
      let updateInfo = await api.updateById(config.recipes,this.data.currentId,{
        follows:db.command.inc(-1)
     })
      this.setData({
        isfollow: false
      })
      // console.log(updateInfo)
      return
    }
    // 未关注
    // console.log("未关注")
     // 添加关注表中的数据
     let where2 = {
      recipeID: this.data.currentId
    }
    let addInfo = await api.add(config.follows, where2)
    // console.log(addInfo)
    if(addInfo._id){
      let updateInfo = await api.updateById(config.recipes, this.data.currentId, {
        follows: db.command.inc(1)
      })
      // console.log(updateInfo)
    }
    this.setData({
      isfollow: true
    })
  },
  // 联系客服
  _phone(){
    wx.makePhoneCall({
      phoneNumber: '025-88639876',
    })
  }
})