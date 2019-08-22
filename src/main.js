import Vue from 'vue'
import FastClick from 'fastclick'
import 'vux/src/styles/reset.less';
import "@/assets/sass/style.scss"

FastClick.attach(document.body)
Vue.config.productionTip = false

import VueRouter from 'vue-router'
import App from './App'
import Home from './components/Hello'
// import ChatDemo from './pages/messagedemo'
Vue.use(VueRouter)
const routes = [
{
  path: '/',
  component: Home
},
{
  path: '/demo',
  // component: ()=>import('./pages/messagedemo')
  component: () => import('@/pages/messagedemo'),
  // component:ChatDemo
},
]
const router = new VueRouter({
  routes
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')