// 封装数据库请求
let db = wx.cloud.database()
// 1.利用条件查询多条数据 where
const findAll = async (cname, where) => {
  // 小程序端最多查询20条数据, 如果是云端, 最多查询100条数据
  const MAX_LIMIT = 20
  // 先取出集合记录总数
  const countResult = await db.collection(cname).where(where).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(cname).where(where).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  if(tasks.length <=0) {
    return null;
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}

// 2.添加数据
const add = (cname, data={}) => {
  return db.collection(cname).add({
    data,
  })

}

export default {
  findAll,
  add
}