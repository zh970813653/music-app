<template>
  <transition appear name="slide">
    <music-list :rank="rank" :songs="songs" :bgImage="bgImage" :title="title"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { getMusicList, ERR_OK } from 'api/rank'
// import { ERR_OK } from 'api/config'
import { mapGetters } from 'vuex'
import { createSong, processSongsUrl } from 'common/song'

export default {
  computed: {
    ...mapGetters([
      'topList'
    ]),
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return this.topList.picUrl
    }
  },
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  created () {
    this._getMusicList()
  },
  mounted () {
    console.log(this.topList)
  },
  methods: {
    async _getMusicList () {
      if (!this.topList.id) {
        this.$router.go(-1)
        return
      }
      const res = await getMusicList(this.topList.id)
      if (res && res.code === ERR_OK) {
        console.log(res)
        processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
          this.songs = songs
        })
        // this.songs = res.songlist
        // console.log(this.songs)
      }
    },
    _normalizeSongs (list) {
      console.log(list)
      const ret = []
      list.forEach(item => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
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
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
