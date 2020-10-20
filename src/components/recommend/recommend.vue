<template>
  <div class="recommend">
    <div class="recommend-content">
      <div v-if="recommends.length" class="slider-wrapper">
        <slider >
          <div v-for="(item,index) in recommends" :key="index">
            <a :href="item.linkUrl">
              <img class="needclass" :src="item.picUrl" alt="">
            </a>
          </div>
        </slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <scroll class="scroll-wrapper" ref="recommendWrapper">
        <ul class="recommend-list-container">
          <li @click="selectItem(item)" class="recommend-list-container-item" v-for="(item,index) in discList" :key="index">
            <div class="item-left">
              <img v-lazy="item.imgurl" alt="">
            </div>
            <div class="item-right">
              <div class="item-right-title">{{item.creator.name}}</div>
              <div class="item-right-info">{{item.dissname}}</div>
            </div>
          </li>
        </ul>
        <v-loading v-show="!discList.length" class="recommend-loading"></v-loading>
        </scroll>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommend, getDiscList, ERR_OK } from 'api/recommend'
import { mapMutations } from 'vuex'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import VLoading from 'base/loading/loading'
import { playlistMixin } from 'common/mixin'

export default {
  mixins: [playlistMixin],
  components: {
    Slider,
    Scroll,
    VLoading
  },
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  methods: {
    ...mapMutations(
      {
        setDesc: 'SET_DISC'
      }
    ),
    async _getRecommend () {
      const res = await getRecommend()
      console.log(res)
      if (res && res.code === ERR_OK) {
        this.recommends = res.data.slider
      }
    },
    async _getDiscList () {
      const res = await getDiscList()
      console.log(res)
      if (res && res.code === ERR_OK) {
        this.discList = res.data.list
      }
    },
    selectItem (item) {
      this.setDesc(item)
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? 60 : ''
      this.$refs.recommendWrapper.$el.style.bottom = bottom + 'px'
      this.$refs.recommendWrapper.refresh()
    }
  },
  mounted () {
    this._getRecommend()
    this._getDiscList()
  }
}
</script>

<style lang="stylus" scoped>
@import '~assets/styles/variable';
.scroll-wrapper
  position absolute
  top 220px
  left 0
  right 0
  bottom 0
  overflow hidden
.recommend
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content
    height 100%
    overflow: hidden;
    .slider-wrapper

    .recommend-list
      .list-title
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      .recommend-list-container

        &-item
          padding 0 20px 20px 20px
          display flex
          .item-left
            width 60px
            height 60px
            img
              width 100%
              height 100%
          .item-right
            flex 1
            padding 10px 0 10px 20px
            &-title
              font-size 15px
              margin-bottom: 10px;
              color: #fff;
            &-info
              color: rgba(255,255,255,0.3);
              font-size 14px
              margin-top 15px
 .recommend-loading
   position absolute
   left 50%
   top 20px
   transform translateX(-50%)
</style>
