let formatTime = (curTime, type) => {
  if (!curTime) {
    return ''
  }
  var nd = new Date(curTime)
  var y = nd.getFullYear()
  var mm = nd.getMonth() + 1
  var d = nd.getDate()
  var h = nd.getHours()
  var m = nd.getMinutes()
  if (mm < 10) {
    mm = '0' + mm
  }
  if (d < 10) {
    d = '0' + d
  }
  if (h < 10) {
    h = '0' + h
  }
  if (m < 10) {
    m = '0' + m
  }
  if (type == 'MM-DD') {
    return mm + '-' + d
  } else if (type == 'yyyy-MM-dd') {
    return y + '-' + mm + '-' + d
  } else if (type == 'week') {
    return y + '-' + mm + '-' + d + '-　' + weekDay[nd.getDay()]
  } else if (type == 'MM-DD&week') {
    return mm + '-' + d + '　' + weekDay[nd.getDay()]
  } else if (type == 'MM-DD&hh:mm') {
    return mm + '-' + d + ' ' + h + ':' + m
  } else if (type == '年月日') {
    return y + '-' + mm + '-' + d + '-　'
  }
  return y + '-' + mm + '-' + d + ' ' + h + ':' + m
}

let formatPhone = (val) => {
  let str = String(val)
  let start = str.substr(0, 3)
  let end = str.substr(7, 4)
  return start + '****' + end
}

let formatRealName = (val) => {
  let str = String(val)
  let start = str.substr(0, 1)
  let end = str.substr(2, 1)
  return start + '*' + end
}

let formatIdCardNo = (val) => {
  let str = String(val)
  let start = str.substr(0, 1)
  let end = str.substr(17, 1)
  return start + '****************' + end
}
let formatGoodsName = (value) => {
  const cNumber = '30' // 设置限定字数
  if (!value) return ''
  if (value.length > cNumber) {
    return value.slice(0, cNumber) + '...'
  }
  return value
}
let formatUserMoney = (num) => {
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}
export default {
  formatTime,
  formatPhone,
  formatRealName,
  formatIdCardNo,
  formatGoodsName,
  formatUserMoney
}
