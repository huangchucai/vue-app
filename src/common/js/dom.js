/**
 * Created by Z7 on 2017/12/5.
 */
export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  }
  return el.getAttribute(name)
}

// 给对应的浏览器属性添加前缀
let elStyle = document.createElement('div').style

// 判定浏览器的类型
let vendor = (elStyle => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformNames) {
    if (elStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})(elStyle)

export function prefixStyle(style) {
  // 什么浏览器都不是，有问题
  if (vendor === false) {
    return false
  }
  // 返回标准浏览器
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
