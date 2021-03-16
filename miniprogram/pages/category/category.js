// pages/category/category.js
import api from '../../utils/api'
import config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "",
    typeAllList: [], // 所有菜谱的分类
    setValue: "", // 修改的数据
    currentId: ""
  },
  // 1.获取输入框中的值
  _inputValue(e) {
    // console.log(e)
    let value = e.detail.value
    this.setData({
      inputValue: value
    })
  },
  // 2.添加
  async _add() {
    // console.log(this.data.inputValue)
    let typeName = this.data.inputValue
    // 判断一下数据库有没有该分类
    let typeAllList = this.data.typeAllList
    // 内容为空的时候
    if (typeName == "") {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      })
      return
    }
    // 4.判断一下数据库有没有该分类
    let index = typeAllList.findIndex((item, index) => {
      return item.typeName == typeName
    })
    // console.log(index)
    // 如果能找到，则返回下标，如果找不到, index的值应为-1
    if (index !== -1) {
      wx.showToast({
        title: '该类别已经存在',
        icon: 'none'
      })
      return
    }

    // 插入数据库
    let result = await api.add(config.typesTable, { typeName })
    // console.log(result)
    if (result._id) {
      wx.showToast({
        title: '添加成功',
      }),
        this.setData({
          inputValue: ""
        })
    }
    // 再次刷新页面数据
    this._getData()
  },
  // 3.获取所有菜谱分类
  async _getData() {
    let result = await api.findAll(config.typesTable)
    // console.log(result)
    this.setData({
      typeAllList: result.data
    })
  },
  // 4.删除功能
  async _del(e) {
    // console.log(e)
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认要删除吗?',
      async success(res) {
        if(res.confirm) {
            let id = e.currentTarget.dataset.id;
            // console.log(id)
            // 根据id删除数据库中的数据
            let result = await api.delById(config.typesTable, id)
            // console.log(result)
            if (result.stats.removed != 0) {
              that._getData()
            }
        } else if (res.cancel){
          return
        }
      } 
    })
  },
  // 5.获取修改的信息
  _set(e) {
    let index = e.currentTarget.dataset.index
    let name = this.data.typeAllList[index].typeName
    // console.log(name)
    this.setData({
      setValue: name,
      currentId: this.data.typeAllList[index]._id
    })
  },
  // 7.执行修改数据
  async _update(){
    let id = this.data.currentId
    let data = this.data.setValue
    if(data == ""){
      wx.showToast({
        title: "内容不能为空",
        icon: "none"
      })
    }
    // 修改数据库
    // console.log(this.data.setValue)
    // 先判断一下数据库中是否有该类别
    let typeAllList = this.data.typeAllList
    let index = typeAllList.findIndex((item, index) => {
      return item.typeName == data
    })
    if(index !== -1) {
      wx.showToast({
        title: '该类别已经存在',
        icon: 'none'
      })
      return
    }
    let result = await api.updateById(config.typesTable, id, {
      typeName: data
    })
    // console.log(result)
    if(result.stats.updated!=0){
      wx.showToast({
        title: '修改成功',
      })
      this.setData({
        setValue:""
      })
      this._getData()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getData()
  }
})