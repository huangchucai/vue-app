import originJson from 'jsonp'
// url 地址
// data  传递的参数 对象 只有一层
// option jsonp需要的参数
export default function jsonp(url, data, option) {
  url = url + (~url.indexOf('?') ? '' : '?') + formatData(data)
  return new Promise((resolve, reject) => {
    originJson(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function formatData(data) {
  let param = Object.keys(data).reduce((memo, key) => {
    memo += `& ${key}=${data[key] ? encodeURIComponent(data[key]) : ''}`
    return memo
  }, '')
  return param.substring(1)
}
