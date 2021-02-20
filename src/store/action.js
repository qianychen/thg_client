import {
  getGoodsByKeyword,
  getGoodsDetailById,
  getUserAddrById,
  delUserAddrById,
  addUserAddr,
  getUserAddrByAddrId,
  modifyUserAddr,
  insertShopCart,
  getShopCartInfo,
  modifyShopCartAmount,
  delShopCartGoods,
  generateOrder,
  getOrderInfoByOrderId,
  login,
  getUserInfoById,
  getOrderListById,
  recommendGoods
} from '@/api/index'

export default {
  // 登陆
  async login({
    commit
  }, params) {
    let result = await login(params)
    commit("setToken", result.token)
    commit("setUserInfo", result.userinfo)
    return result
  },
  // 通过用户id查询用户信息
  async getUserInfoById({
    commit
  }, params) {
    let result = await getUserInfoById(params)
    commit("setUserInfo", result.userInfo)
    return result
  },
  // 搜索获取商品列表
  async getGoodsByKeyword({
    commit
  }, params) {
    let result = await getGoodsByKeyword(params)
    return result
  },
  // 通过商品id获取商品详细信息
  async getGoodsDetailById({
    commit
  }, params) {
    let result = await getGoodsDetailById(params)
    return result
  },
  // 通过用户id获取用户地址
  async getUserAddrById({
    commit
  }, params) {
    let result = await getUserAddrById(params)
    if (result.status == 200) {
      commit('setUserAddr', result.address)
    }
    return result
  },
  // 通过用户地址id删除用户地址
  async delUserAddrById({
    commit
  }, params) {
    let result = await delUserAddrById(params)
    return result
  },
  // 添加用户地址
  async addUserAddr({
    commit
  }, params) {
    let result = await addUserAddr(params)
    return result
  },
  // 通过用户id获取用户地址
  async getUserAddrByAddrId({
    commit
  }, params) {
    let result = await getUserAddrByAddrId(params)
    return result
  },
  // 通过地址id修改用户地址
  async modifyUserAddr({
    commit
  }, params) {
    let result = await modifyUserAddr(params)
    return result
  },
  // 加入购物车
  async insertShopCart({
    commit
  }, params) {
    let result = await insertShopCart(params)
    return result
  },
  // 通过用户id获取购物车数据
  async getShopCartInfo({
    commit
  }, params) {
    let result = await getShopCartInfo(params)
    return result
  },
  // 通过购物车id改变商品数量
  async modifyShopCartAmount({
    commit
  }, params) {
    let result = await modifyShopCartAmount(params)
    return result
  },
  // 通过购物车id改变商品数量
  async delShopCartGoods({
    commit
  }, params) {
    let result = await delShopCartGoods(params)
    return result
  },
  // 生成订单
  async generateOrder({
    commit
  }, params) {
    let result = await generateOrder(params)
    return result
  },
  // 通过订单id获取订单信息
  async getOrderInfoByOrderId({
    commit
  }, params) {
    let result = await getOrderInfoByOrderId(params)
    return result
  },
  // 通过用户id获取订单列表
  async getOrderListById({
    commit
  }, params) {
    let result = await getOrderListById(params)
    commit("setOrder", result.result)
    return result
  },
  // 随机推荐商品
  async recommendGoods({
    commit
  }, params) {
    let result = await recommendGoods(params)
    return result
  },

}
