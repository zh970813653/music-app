import * as types from './mutaions-type'
import { playMode } from 'common/config'
import { shuffle } from 'utils/shuffle'

function findIndex (list, songs) {
  return list.findIndex(item => {
    return item.id === songs.id
  })
}

export const selectPlay = ({ commit, state }, { list, index }) => {
  commit(types.SET_SEQUENCE_LIST, list)
  // 说明当前是随机播放
  if (state.mode === playMode.random) {
    const randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  // 记录播放的下标
  commit(types.SET_CURRENT_INDEX, index)
  // 展开全屏播放器
  commit(types.SET_FULL_SCREEN, true)
  // 播放状态
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = ({ commit }, { list }) => {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  const randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
