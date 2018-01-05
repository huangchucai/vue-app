/**
 * Created by Z7 on 2017/12/7.
 */
/*
 * action的2大用途
 * 1. 异步加载数据
 * 2. 多个mutations同时提交
 * */
import * as types from './mutations-types'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'
import {saveSearch, deleteSearch, clearSearch, savePlay, savaFavorite, deleteFavorite} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    // 找到随机模式后的歌曲对应的索引
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_CURRENT_INDEX, index)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  const randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 搜索列表点击歌曲加入播放列表
export const insertSong = function ({commit, state}, song) {
  let playlist = [...state.playlist] // 当前播放列表
  let sequenceList = [...state.sequenceList]
  let currentIndex = state.currentIndex // 当前播放的索引
  let currentSong = playlist[currentIndex]
  // 寻找当前播放列表是否有传递过来的歌曲
  let fdIndex = findIndex(playlist, song)
  // 在当前播放歌曲的后面添加传递过来的歌曲
  currentIndex++
  // 插入传递过来的歌曲
  playlist.splice(currentIndex, 0, song)
  // 判定当前播放的列表是否有传递过来的歌曲
  if (fdIndex > -1) {
    // 当前插入的歌曲在已有歌曲的后面
    if (currentIndex > fdIndex) {
      playlist.splice(fdIndex, 1)
      // 数组的长度发生了变化，所有对于的索引也要变化
      currentIndex--
    } else {
      playlist.splice(fdIndex + 1, 1)
    }
  }
  // 这里来操作队列sequenceList
  let currentSIndex = findIndex(sequenceList, currentSong) + 1 // 要插入歌曲的位置索引
  let fsIndex = findIndex(sequenceList, song) // 查找播放队列是否有插入的歌曲
  sequenceList.splice(currentSIndex, 0, song)  // 插入歌曲
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  // 开始提交数据
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 存放搜索历史到本地
export const saveHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除单个搜索
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 删除全部
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}
// 删除单个歌曲
export const deleteSong = function ({commit, state}, song) {
  let playlist = [...state.playlist] // 当前播放列表
  let sequenceList = [...state.sequenceList]
  let currentIndex = state.currentIndex // 当前播放的索引
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (pIndex < currentIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  // 如果没有歌曲的时候
  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}
// 删除全部播放列表
export const deleteAllSong = function({commit}) {
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_PLAYING_STATE, false)
}

// 添加播放歌曲到播放历史
export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 添加我喜欢的歌曲
export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, savaFavorite(song))
}

// 删除我喜欢的歌曲
export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
