// pages/my/my.js
import config from '../../utils/config'
import api from '../../utils/api'
import admin from '../../utils/admin'
// console.log(admin)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: "0",
    userInfo:"", // 存储用户信息
    isLogin: false, //是否登录。 false 未登录  true，已经登录
    recipes: [
    ],
    types: [
    ],
    lists: [
    ],
  },
  // 处理遮罩层显示问题
  _delStyle(e) {
    // 获取索引
    let index = e.currentTarget.dataset.index;
    // 将所有的列表都设置不显示
    this.data.recipes.map((item) => {
      item.opacity = 0;
    })
    // 将长按的列表项设置为选中
    this.data.recipes[index].opacity = 1;
    this.setData({
      recipes: this.data.recipes
    })
  },
  // 执行删除操作
  _doDelete(e){
    let index = e.currentTarget.dataset.index;
    // 如果没有显示删除图标，点击删除，直接返回
    if(!this.data.recipes[index].opacity) return;
    let _this = this;
    wx.showModal({
       title:"删除提示",
       content:"您确定删除么？",
       async success(res){
            if(res.confirm){
              //执行删除
              // console.log('执行删除')
              // 做的是删除，其实代码是修改, status为0
              let id = _this.data.recipes[index]._id
              console.log(id)
              let result = await api.updateById(config.recipes, id, {status:0})
              // console.log(result)
              // 查看菜单数据
              _this._getrecipes()
            }else{
              //取消删除
              _this.data.recipes[index].opacity = 0;
              _this.setData({
                recipes: _this.data.recipes
              })
            }
       }
    })
  },
  // 1.检测是否授权——可以获取用户信息
  onShow(){
    let that  = this
    wx.getSetting({
     success(res){
       // console.log(this)
       if(res.authSetting["scope.userInfo"]){
         console.log("已经授权")
         let userInfo = wx.getStorageSync('userInfo')
         that.setData({
           isLogin: true,
           userInfo
         })
         // 登录成功之后调取菜单数据
         that._getrecipes()
       }else{
         // 未授权——提示用户授权
         wx.showToast({
           title: "未授权",
           icon: "none"
         }),
         that.setData({
           isLogin: false
         })
       }
     }
    })
  },
   // 2.去登录
   _doLogin(e){
    // console.log(e)
    let that = this
    if(e.detail.errMsg == "getUserInfo:fail auth deny"){
      // 拒绝
      wx.showToast({
        title: '登录失败!',
        icon: 'none'
      })
      return
    }
    // 授权成功
    wx.cloud.callFunction({
      name: "login",
      async success(res){
        // console.log(res)
        let openid = res.result.openid
        let userInfo = e.detail.userInfo
        // console.log(userInfo)
        // 利用openid查询数据库users, 判断是否是新用户, 如果是新用户，
        // 则存于数据表再存入缓存中, 如果是老用户，直接缓存信息
        let result =await api.findAll(config.userTable, {_openid:openid})
        // console.log(result)
        // 新用户
        if(result == null) {
          // 插入数据表
          let result = await api.add(config.userTable, {userInfo})
          // console.log(result)
        }
        // 老用户 把openid和用户数据都存入缓存中
        that.setData({
          isLogin: true,
          userInfo
        })
        wx.setStorageSync('userInfo', userInfo),
        wx.setStorageSync('openid', openid)
        // 登录之后获取数据
        that._getrecipes()
      }
    })
   },
   // 跳转分类页面
   _goCate () {
     let openid = wx.getStorageSync('openid')
     if(openid!=admin){
       wx.showToast({
         title: '您不是管理员！！',
         icon: 'none'
       })
       return
     }
     // 管理员
     wx.navigateTo({
       url: '../category/category'
     })
   },
   // 切换选项卡样式
   _changeActive (e) {
     let index = e.currentTarget.dataset.index
     // console.log(index)
     this.setData({
       currentIndex: index
     })
   },
   // 跳转到发布菜谱页面
   _goPbrecipe(){
     wx.navigateTo({
       url: '../pbrecipe/pbrecipe'
     })
   },
   // 获取菜单数据
   async _getrecipes(){
     console.log("菜单数据")
     // 根据openid进行查询数据, status为1
     let openid = wx.getStorageSync('openid')
     let result = await api.findAll(config.recipes, {_openid: openid, status: 1},{fild:"time", sort:"desc"})
     // console.log(result)
     // 处理透明度数据
     result.data.map((item, index) => {
       return item.opacity = 0
     })
     // 数据排序，后发布的显示在前面
     this.setData({
       recipes: result.data
     })
   }
})
