<template>
  <div class="singer-cotainer">
    这是singer
  </div>
</template>

<script>
import { getSingerList, ERR_OK } from 'api/singer'
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  data () {
    return {
      singers: []
    }
  },
  methods: {
    async getSingerList () {
      const res = await getSingerList()
      if (res && res.code === ERR_OK) {
        console.log(res)
        this.singers = res.data.list
      }
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
          map.hot.items.push({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
            // avatar:
          })
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
      })
    }
  },
  mounted () {
    this.getSingerList()
  }
}
</script>

<style>

</style>
