<template>
  <scroll
    ref="suggest"
    class="suggest"
    :data="result"
    :pullup="true"
    :beforeScroll="true"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>

    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
import { search, ERR_OK } from 'api/search'
import { createSong, isValidMusic, processSongsUrl } from 'common/song'
import { mapMutations, mapActions } from 'vuex'
import Singer from 'common/singer'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  components: {
    Scroll,
    Loading,
    NoResult
  },
  props: {
    showSinger: {
      type: Boolean,
      default: true
    },
    query: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      hasMore: true
    }
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'inserSong'
    ]),
    async _search () {
      this.page = 1
      this.$refs.suggest.scrollTo(0, 0)
      this.hasMore = true
      const res = await search(this.query, this.page, this.showSinger, perpage)
      console.log(res)
      if (res && res.code === ERR_OK) {
        this._genResult(res.data).then((result) => {
          this.result = result
          this._checkMore(res.data)
        })
      }
    },
    async searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      const res = await search(this.query, this.page, this.showSinger, perpage)
      if (res && res.code === ERR_OK) {
        this._genResult(res.data).then((result) => {
          this.result = this.result.concat(result)
          this._checkMore(res.data)
        })
      }
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.setSinger(singer)
        this.$router.push(`/search/${singer.id}`)
      } else {
        this.inserSong(item)
      }
      this.$emit('saveSearch')
    },
    listScroll () {
      this.$emit('listScroll')
    },
    refresh () {
      this.$refs.suggest.refresh()
    },
    _checkMore (data) {
      const song = data.song
      if (
        !song.list.length ||
        song.curnum + (song.curpage - 1) * perpage >= song.totalnum
      ) {
        this.hasMore = false
      }
    },
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      return processSongsUrl(this._normalizeSongs(data.song.list)).then(
        (songs) => {
          ret = ret.concat(songs)
          return ret
        }
      )
      // return ret
    },
    _normalizeSongs (list) {
      const ret = []
      console.log(list)
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    }
  },
  watch: {
    query (newVal, oldVal) {
      this._search()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~assets/styles/variable';
@import '~assets/styles/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
