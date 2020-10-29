import { mapGetters, mapMutations } from 'vuex'
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
        'mode'
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
