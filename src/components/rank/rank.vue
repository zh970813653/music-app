<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li @click="selectItem(top)" class="item" v-for="(top,topIndex) in topList" :key="topIndex">
          <div class="icon">
            <img width="100" height="100" v-lazy="top.picUrl"  />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in top.songList" :key="index">
              <span>{{index+1}} . </span>
              <span>{{song.songname}}-{{song.singgername}}</span>
            </li>
          </ul>
        </li>
      </ul>

    <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getTopList, ERR_OK } from 'api/rank'
import { playlistMixin } from 'common/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      topList: []
    }
  },
  created () {
    this._getTopList()
  },
  methods: {
    ...mapMutations(
      {
        setTopList: 'SET_TOP_LIST'
      }
    ),
    async _getTopList () {
      const res = await getTopList()
      if (res && res.code === ERR_OK) {
        console.log(res)
        this.topList = res.data.topList
      }
    },
    selectItem (item) {
      this.setTopList(item)
      this.$router.push(`/rank/${item.id}`)
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
      // console.log(this.$refs.toplist)
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~assets/styles/variable';
@import '~assets/styles/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .toplist {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;

        .song {
          no-wrap();
          line-height: 26px;
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
