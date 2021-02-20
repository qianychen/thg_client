import ajax from './api'

// 登陆
export const login = (params) => ajax('/user/login', params, 'post').catch((err) => {
  console.log(err);
})
// 通过用户id查询用户信息
export const getUserInfoById = (params) => ajax('/user/getUserInfoById', params, 'post').catch((err) => {
  console.log(err);
})
// 通过用户id获取用户地址
export const getUserAddrById = (params) => ajax('/user/getUserAddrById', params, 'post').catch((err) => {
  console.log(err);
})
// 通过用户地址id删除用户地址
export const delUserAddrById = (params) => ajax('/user/delUserAddrById', params, 'post').catch((err) => {
  console.log(err);
})
// 添加用户地址
export const addUserAddr = (params) => ajax('/user/addUserAddr', params, 'post').catch((err) => {
  console.log(err);
})
// 通过地址id获取用户地址
export const getUserAddrByAddrId = (params) => ajax('/user/getUserAddrByAddrId', params, 'post').catch((err) => {
  console.log(err);
})
// 通过用户id修改用户地址
export const modifyUserAddr = (params) => ajax('/user/modifyUserAddr', params, 'post').catch((err) => {
  console.log(err);
})

// 通过关键词获取商品信息
export const getGoodsByKeyword = (params) => ajax('/goods/getGoodsByKeyword', params, 'post').catch((err) => {
  console.log(err);
})
// 通过商品id获取商品详细信息
export const getGoodsDetailById = (params) => ajax('/goods/getGoodsDetailById', params, 'post').catch((err) => {
  console.log(err);
})
// 加入购物车
export const insertShopCart = (params) => ajax('/goods/insertShopCart', params, 'post').catch((err) => {
  console.log(err);
})
// 通过用户id获取购物车数据
export const getShopCartInfo = (params) => ajax('/goods/getShopCartInfo', params, 'post').catch((err) => {
  console.log(err);
})
// 通过购物车id改变商品数量
export const modifyShopCartAmount = (params) => ajax('/goods/modifyShopCartAmount', params, 'post').catch((err) => {
  console.log(err);
})
// 通过购物车id删除购物车商品
export const delShopCartGoods = (params) => ajax('/goods/delShopCartGoods', params, 'post').catch((err) => {
  console.log(err);
})
// 通过购物车id删除购物车商品
export const recommendGoods = (params) => ajax('/goods/recommendGoods', params, 'post').catch((err) => {
  console.log(err);
})


// 生成订单
export const generateOrder = (params) => ajax('/order/generateOrder', params, 'post').catch((err) => {
  console.log(err);
})
// 通过订单id获取订单信息
export const getOrderInfoByOrderId = (params) => ajax('/order/getOrderInfoByOrderId', params, 'post').catch((err) => {
  console.log(err);
})
// 通过用户id获取订单列表
export const getOrderListById = (params) => ajax('/order/getOrderListById', params, 'post').catch((err) => {
  console.log(err);
})
