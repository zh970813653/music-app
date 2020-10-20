import { mapGetters } from 'vuex'
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
