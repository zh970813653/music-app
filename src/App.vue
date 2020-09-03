<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <router-view/>
  </div>
</template>
<script>
import MHeader from './components/m-header/m-header'
import MTab from './components/tab/tab'
export default {
  components: {
    MHeader,
    MTab
  }
}
</script>

<style lang="stylus">
#app {
  width: 100%;
  height: 100%;
}
</style>
