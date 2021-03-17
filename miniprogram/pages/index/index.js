import config from "../../utils/config"
import api from "../../utils/api"
Page({
    data: {
        types: [],
        recipes:[

        ]
    },
    onShow(){
      this._getHotRecipe()
      this._getType()
    },
    // 1.获取热门菜谱数据, 根据views进行排序
    async _getHotRecipe() {
        // console.log("热门菜谱")
        let result = await api.findAll(config.recipes,{status: 1}, {fild:"views", sort:"desc"})
        // console.log(result)
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
        console.log("arr1", arr1)

        result.data.map((item, index) => {
            return item.userInfo = arr1[index].data[0].userInfo
        })
        this.setData({
            recipes: result.data
        })
    },
    // 2.请求分类菜谱数据
    async _getType(){
      let result = await api.findAll(config.typesTable)
      // console.log(result)
      this.setData({
          types: result.data
      })
    },
    // 跳转list页面
    _goTypePage(){
      wx.navigateTo({
          url: '../type/type'
      })
    },
    // 跳转到列表页面
    _goListPage(e){
        console.log(e)
        let {title, typeid} = e.currentTarget.dataset
        wx.navigateTo({
          url: '../list/list?typeid='+typeid+'&title='+title
        })
    }

})