import axios from 'axios'

export default function ajax(url, params = {}, type = "get") {
  let Promises;
  return new Promise((resolve, reject) => {
    if (type == "get") {
      Promises = axios.get(url, {
        params: params
      })
    } else if (type == "post") {
      Promises = axios.post(url, params)
    }
    return Promises.then(res=>{
        resolve(res.data)
    },err=>{
        reject(err)
    })
  })
}
