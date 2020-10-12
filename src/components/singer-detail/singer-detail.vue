<template>
  <div class="singer-detail">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail, ERR_OK } from 'api/singer'
import { createSong, processSongsUrl } from 'common/song'
import MusicList from 'components/music-list/music-list'
export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ]),
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    }
  },
  methods: {
    async getSingerDetail () {
      const res1 = await getSingerDetail(this.singer.id)
      if (res1 && res1.code === ERR_OK) {
        // console.log(res1)
        const songs = await processSongsUrl(this._nomalizeSongs(res1.data.list))
        this.songs = songs
        // console.log(this.songs)
      }
    },
    _nomalizeSongs (list) {
      const ret = []
      list.forEach(item => {
        const { musicData } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  mounted () {
    if (!this.singer.id) {
      this.$router.push('/singer')
    }
    this.getSingerDetail()
  }
}
</script>

<style lang="stylus" scoped>
@import '~assets/styles/variable';
.singer-detail{
  position: fixed;
  z-index: 500;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color $color-background
}
</style>
