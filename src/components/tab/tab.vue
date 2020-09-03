<template>
  <div class="tab-container">
    <router-link v-for="(item,index) in routerList" :key="index" tag="div" class="tab-container-item" :to="item.path">
      <span  class="tab-link">{{item.text}}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      routerList: [
        {
          path: '/recommend',
          text: '推荐'
        },
        {
          path: '/singer',
          text: '歌手'
        },
        {
          path: '/rank',
          text: '排行'
        },
        {
          path: '/search',
          text: '搜索'
        }
      ]
    }
  },
  methods: {
    changeCurrent (index) {
      console.log(index)
      this.current = index
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/variable";
@import "~assets/styles/mixin";
  .tab-container
    display flex
    height 44px
    // line-height 44px
    font-size $font-size-medium
    &-item
      flex 1
      flex-center()
      .tab-link
        padding-bottom 8px
        color $color-text-l
      &.router-link-active
         .tab-link
            color $color-theme
            border-bottom 2px solid $color-theme
</style>
