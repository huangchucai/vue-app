/**
 * Created by Z7 on 2017/12/25.
 */
import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15
// 插入搜索的历史
function insertArray(arr, item, compare, max) {
  const fdIndex = arr.findIndex(compare) // 找到是否已经有插入的历史
  // 已经存在，但是在第一个
  if (fdIndex === 0) {
    return
  }
  // 已经存在
  if (fdIndex > 0) {
    arr.splice(fdIndex, 1)
  }
  arr.unshift(item)
  // 判定是否长度超过
  if (max && arr.length > max) {
    // 向后退出一位
    arr.pop()
  }
}
// 存放搜索历史
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches) // 存放到本地
  return searches
}
// 载入本地存放的搜索历史
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}
