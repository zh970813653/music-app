import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Recommend',
    redirect: '/recommend'
  },
  {
    path: '/rank',
    name: 'Rank',
    component: () => import(/* webpackChunkName: "about" */ '../components/rank/rank.vue')
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import(/* webpackChunkName: "about" */ '../components/recommend/recommend.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "about" */ '../components/search/search.vue')
  },
  {
    path: '/singer',
    name: 'Singer',
    component: () => import(/* webpackChunkName: "about" */ '../components/singer/singer.vue'),
    children: [
      {
        path: ':id',
        component: () => import(/* webpackChunkName: "about" */ '../components/singer-detail/singer-detail.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
