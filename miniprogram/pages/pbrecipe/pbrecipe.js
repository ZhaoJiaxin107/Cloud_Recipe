// pages/pbrecipe/pbrecipe.js
import api from "../../utils/api"
import config from "../../utils/config"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typesList: [],
    filesList: [] // 当前图片列表
  },
  onLoad() {
    this._getData()
  },
  // 1.先获取菜谱分类数据
  async _getData() {
    let result = await api.findAll(config.typesTable)
    console.log(result)
    this.setData({
      typesList: result.data
    })
  },
  // 选择图片
  _selectImage(e) {
    // console.log(e.detail.tempFilePaths)
    let tempFilePaths = e.detail.tempFilePaths

    // 处理数据格式
    let result = tempFilePaths.map((item, index) => {
      return { url: item }
    })
    result = this.data.filesList.concat(result)
    this.setData({
      filesList: result
    })
  },
  // 删除图片
  _deleteImage(e) {
    let index = e.detail.index
    // console.log(index)
    this.data.filesList.splice(index, 1)
    this.setData({
      filesList: this.data.filesList
    })
  },
  // 4.发布
  // 1.获取菜单名称、菜谱分类、图片(要获取fileid)和菜品做法
  async fbcd(e) {
    let files = this.data.filesList
    let result =await  this._uploadFile(files)
    // console.log(result)
    // 上传到数据库
    // console.log(e)
    let {recipeName, recipeTypeId, recipesMakes} = e.detail.value
    let views = 0
    let follows = 0
    let status = 1 // 1是正常 0是删除
    let time = new Date().getTime()
    let uploadData = await api.add(config.recipes, {
      recipeName,
      recipeTypeId,
      recipesMakes,
      fileID: result,
      views,
      follows,
      status,
      time
    })
    //console.log(uploadData)
    // 判断数据是否为空
    if(recipeName == "" || recipeTypeId=="" || recipesMakes=="" || this.data.filesList.length == 0){
      wx.showToast({
        title: "内容不能为空",
        icon: "none"
      })
      return
    }
    if(uploadData._id){
      wx.showToast({
        title: '发布成功',
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '../my/my',
        })
      }, 2000)
    }
  },
  // 上传图片到存储, 获取fileid
  async _uploadFile(files) {
    // console.log(files[0].url)
    let filesID = []
    files.map((item, index) => {
      let extname = item.url.split(".").pop()
      let cloudPath = new Date().getTime() + index +'.' + extname
      let res = wx.cloud.uploadFile({
        cloudPath: "cloud_recipe/" + cloudPath,// 云端的文件路径
        filePath: item.url, // 图片的临时路径
        // success(res) {
        //   console.log(res)
        //   filesID.push(res.fileID)
        // }
      })
      filesID.push(res)
    })
    let list = await Promise.all(filesID)
    list = list.map((item, index) => {
      return item.fileID
    })
    return list
  }

})