import { playMode } from 'common/config'
import { loadSearch, loadPlay } from 'common/cache'
const state = {
  singer: {},
  playing: false, // 播放的状态
  fullScreen: false, // 播发器展开和收起
  playlist: [], // 播放列表
  sequenceList: [], // 随机播放列表
  mode: playMode.sequence, // 播放的模式
  currentIndex: -1, // 播放歌曲的下标
  disc: {},
  topList: {},
  searchHistory: loadSearch(), // 搜索历史
  playHistory: loadPlay() // 播放历史

}

export default state
