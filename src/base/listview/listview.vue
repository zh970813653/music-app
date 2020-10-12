<template>
  <div class="list-container">
    <scroll
      @scroll="scroll"
      :data="data"
      :probeType="probeType"
      :listenScroll="listenScroll"
      class="listview"
      ref="listview"
    >
      <ul>
        <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
          <h2 class="list-group-title">{{group.title}}</h2>
          <ul>
            <li @click="selectItem(item)" v-for="(item,index) in group.items" :key="index" class="list-group-item">
              <img class="avatar" v-lazy="item.avatar" />
              <span class="name">{{item.name}}</span>
            </li>
          </ul>
        </li>
      </ul>

      <div class="list-fixed" v-show="fixedTitle" ref="fixedTitle">
        <h1 class="fixed-title">{{fixedTitle}}</h1>
      </div>
    </scroll>
    <div
      class="list-shortcut"
      @touchstart.stop.prevent="onShortTouchStart"
      @touchmove.stop.prevent="onShortTouchMove"
    >
      <ul>
        <li
          class="item"
          :class="{'current':currentIndex===index}"
          v-for="(item,index) in shortcutList"
          :key="index"
          :data-index="index"
        >{{item}}</li>
      </ul>
    </div>
    <loading v-if="!data.length" class="loading-container"></loading>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'utils/dom'
import Loading from 'base/loading/loading'
// import { getData } from 'common/js/dom'

const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18

export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      currentIndex: 0,
      scrollY: -1,
      diff: -1
    }
  },
  created () {
    this.touches = {}
    this.listHeight = []
    this.listenScroll = true
    this.probeType = 3
  },
  computed: {
    shortcutList () {
      return this.data.map((item) => item.title.substr(0, 1))
    },
    fixedTitle () {
      if (this.scrollY > 0) return ''
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    onShortTouchStart (e) {
      const anchorIndex = +getData(e.target, 'index')
      this.touches.anchorIndex = anchorIndex
      const firstTouch = e.touches[0]
      this.touches.y1 = firstTouch.pageY
      this._scrollTo(anchorIndex)
    },
    onShortTouchMove (e) {
      const firstTouch = e.touches[0]
      this.touches.y2 = firstTouch.pageY
      const delta = (this.touches.y2 - this.touches.y1) / ANCHOR_HEIGHT | 0
      const anchorIndex = this.touches.anchorIndex + delta
      this._scrollTo(anchorIndex)
    },
    selectItem (singer) {
      this.$emit('selectItem', singer)
    },
    _scrollTo (index) {
      // console.log(this.$refs.listview.scroll)
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 500)
      this.scrollY = this.$refs.listview.scroll.y
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        const dom = list[i]
        height += dom.clientHeight
        this.listHeight.push(height)
      }
    },
    refresh () {
      this.$refs.listview.refresh()
    },
    scroll (pos) {
      // console.log(pos)
      this.scrollY = pos.y
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newV) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY>0
      if (newV > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length; i++) {
        const height1 = listHeight[i]
        const height2 = listHeight[i + 1]
        if (-newV >= height1 && -newV < height2) {
          this.currentIndex = i
          this.diff = height2 + newV
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 1
    },
    diff (newVal) {
      const fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) return
      this.fixedTop = fixedTop
      this.$refs.fixedTitle.style.transform = `translate3d(0,${fixedTop}px,0)`
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

.list-container {
  height: 100%;
}

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

}

.list-shortcut {
  position: absolute;
  z-index: 30;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  padding: 20px 0;
  border-radius: 10px;
  text-align: center;
  background: $color-background-d;
  font-family: Helvetica;

  .item {
    padding: 3px;
    line-height: 1;
    color: $color-text-l;
    font-size: $font-size-small;

    &.current {
      color: $color-theme;
    }
  }
}

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
