import config from "../../utils/config"
import api from "../../utils/api"
Page({
    data: {
        types: [
            {
                src: "../../imgs/index_07.jpg",
                typename: "营养菜谱"
            },
            {
                src: "../../imgs/index_09.jpg",
                typename: "儿童菜谱"
            },
        ],
        recipes:[
        ]
    },
    onShow(){
      this._getHotRecipe()
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
    }

})