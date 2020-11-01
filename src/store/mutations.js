import * as type from './mutaions-type'

const mutations = {

  [type.SET_SINGER] (state, singer) {
    state.singer = singer
  },

  [type.SET_PLAYING_STATE] (state, playing) {
    state.playing = playing
  },

  [type.SET_FULL_SCREEN] (state, fullScreen) {
    state.fullScreen = fullScreen
  },

  [type.SET_PLAYLIST] (state, playlist) {
    state.playlist = playlist
  },

  [type.SET_SEQUENCE_LIST] (state, sequenceList) {
    state.sequenceList = sequenceList
  },

  [type.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },

  [type.SET_CURRENT_INDEX] (state, currentIndex) {
    state.currentIndex = currentIndex
  },
  [type.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [type.SET_TOP_LIST] (state, topList) {
    state.topList = topList
  },
  [type.SET_SEARCH_HISTORY] (state, searchHistory) {
    state.searchHistory = searchHistory
  },
  [type.SET_PLAY_HISTORY] (state, playHistory) {
    state.playHistory = playHistory
  },
  [type.SET_FAVORITE_LIST] (state, favoriteList) {
    state.favoriteList = favoriteList
  }

}

export default mutations
