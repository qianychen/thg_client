export default{
    // 保存token
    setToken(state, token){
        state.token = token
    },
    // 清除token
    clearToken(state){
        state.token = ''
        state.userInfo = ''
        state.userAddr = ''
        state.address = ''
    },
    // 保存用户信息
    setUserInfo(state, userInfo){
        state.userInfo = userInfo
    },
    // 保存用户地址
    setUserAddr(state, userAddr){
        state.address = userAddr
    },
    // 保存用户订单列表
    setOrder(state, orderList){
        state.orderList = orderList
    }

}