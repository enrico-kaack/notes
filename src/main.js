// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Item from './components/Item'
import Tag from './components/Tag.vue'
import router from './router/index'


Vue.config.productionTip = false
Vue.component('item', Item)
Vue.component('tag', Tag)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }

})
