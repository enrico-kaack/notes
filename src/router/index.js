import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import List from '@/components/List'
import Item from '@/components/Item'
import Create from '@/components/Create'
import 'vue-material/dist/vue-material.css'

var VueMaterial = require('vue-material')
Vue.use(VueMaterial)
Vue.use(Router)

var PouchDB = require('pouchdb-browser');
var db = new PouchDB('items');
var MarkdownIt = require('markdown-it')

var md = new MarkdownIt({
  breaks: true
})
  .use(require('markdown-it-checkbox'));


const vueConfig = require('vue-config')
const configs = {
  itemDb: db,
  md: md
}
Vue.use(vueConfig, configs)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'List',
      component: List
    },
    {
      path: '/create',
      name: 'Create',
      component: Create
    }
  ]
})
