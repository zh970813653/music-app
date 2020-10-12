<template>
  <div class="singer-cotainer">
    <!-- 这是singer -->
    <listview @selectItem="selectItem" :data="singers"></listview>
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getSingerList, ERR_OK } from 'api/singer'
import { mapMutations } from 'vuex'
import listview from 'base/listview/listview'
import Singer from 'common/singer'
// const
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  components: {
    listview
  },
  data () {
    return {
      singers: []
    }
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    async getSingerList () {
      const res = await getSingerList()
      if (res && res.code === ERR_OK) {
        console.log(res)
        this.singers = this._nomalizeSinger(res.data.list)
        console.log(this.singers)
        // this._nomalizeSinger(this.singers)
      }
    },
    selectItem (singer) {
      this.setSinger(singer)
      this.$router.push(`/singer/${singer.id}`)
    },
    _nomalizeSinger (list) {
      const map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })
          )
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(
          new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        )
      })
      const hot = []
      const ret = []
      for (const key in map) {
        const val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  },
  mounted () {
    this.getSingerList()
  }
}
</script>

<style lang="stylus" scoped>
.singer-cotainer {
  position: fixed;
  top: 88px;
  left: 0;
  right: 0;
  bottom: 0;
}

.v-enter-active, .v-leave-active
  transition: all 0.3s
.v-enter, .v-leave-to
  transform: translate3d(100%, 0, 0)
</style>
