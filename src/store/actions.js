/**
 * Created by Z7 on 2017/12/7.
 */
/*
* action的2大用途
* 1. 异步加载数据
* 2. 多个mutations同时提交
* */
import * as types from './mutations-types'
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
}
