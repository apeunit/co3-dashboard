import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Beneficiaries from '../views/Beneficiaries.vue'
import Merchants from '../views/Merchants.vue'
import CoopBoxes from '../views/CoopBoxes.vue'
// import Admins from '../views/Admins.vue'
// import Settings from '../views/Settings.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/beneficiaries',
    name: 'Beneficiaries',
    component: Beneficiaries
  },
  {
    path: '/merchants',
    name: 'Merchants',
    component: Merchants
  },
  {
    path: '/coop-boxes',
    name: 'CoopBoxes',
    component: CoopBoxes
  },
  // {
  //   path: '/admins',
  //   name: 'Admins',
  //   component: Admins
  // },
  // {
  //   path: '/settings',
  //   name: 'Settings',
  //   component: Settings
  // },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (['Home','Settings'].indexOf(to.name) === -1 && !store.state.isAuthenticated) next({ name: 'Home' })
  else next()
})

export default router
