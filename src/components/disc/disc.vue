<template>
  <transition appear name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { getSongList, ERR_OK } from 'api/recommend'
import { mapGetters } from 'vuex'
import { createSong, processSongsUrl } from 'common/song'

export default {
  computed: {
    ...mapGetters([
      'disc'
    ]),
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    }
  },
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getSongList()
  },
  methods: {
    async _getSongList () {
      if (!this.disc.dissid) {
        this.$router.go(-1)
      }
      const res = await getSongList(this.disc.dissid)
      if (res && res.code === ERR_OK) {
        console.log(res)
        processSongsUrl(this._nomaliseSongs(res.cdlist[0].songlist)).then((songs) => {
          this.songs = songs
        })
      }
    },
    _nomaliseSongs (list) {
      if (!list) {
        return new Error('list is not defind')
      }
      const ret = []
      list.forEach(item => {
        if (item.songid && item.albumid) {
          ret.push(createSong(item))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
