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
