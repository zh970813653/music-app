import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/config'
import { shuffle } from 'utils/shuffle'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  methods: {
    handlePlaylist () {
    // this.handlePlaylist(this.playlist)
      throw new Error('component must implement handlePlaylist method')
    }
  },
  watch: {
    playlist (newV, oldV) {
      this.handlePlaylist(newV)
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters(
      [
        'sequenceList',
        'currentSong',
        'playlist',
        'currentIndex',
        'mode',
        'favoriteList'
      ]
    ),
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setPlayState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavorList'
    ]),
    toggleFavorite (song) {
      // 判断当前是否是收藏状态
      if (this.isFavorite(song)) {
        this.deleteFavorList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFavorite (song) {
      const index = this.favoriteList.findIndex(item => item.id === song.id)
      return index > -1
    },
    resetCurrentIndex (list) {
      const index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    }
  }
}

export const searchMixin = {
  data () {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ]),
    blurInput () {
      this.$refs.searchBox.blur()
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    onQueryChange (query) {
      this.query = query
    },
    addQuery (k) {
      this.$refs.searchBox.setQuery(k)
    },
    clearSearch () {
      this.$refs.confirm.show()
    }
  }
}
