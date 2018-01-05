/**
 * Created by Z7 on 2017/12/25.
 */
import storage from 'good-storage'
// 索引历史的key
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15
// 播放历史的key
const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200
// 我喜欢的key
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200
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
// 从数组中删除选项
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
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
// 删除一个记录
export function deleteSearch(query) {
  const searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return query === item
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 删除全部搜索记录
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => song.id === item.id, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

// 存放我喜欢的歌曲列表
export function savaFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => song.id === item.id, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 删除喜欢列表中的歌曲
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => song.id === item.id)
  storage.set(FAVORITE_KEY, songs)
  return songs
}
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
