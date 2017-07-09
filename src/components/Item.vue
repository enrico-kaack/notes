<template>
<md-card md-with-hover>
  <md-card-content v-html="parsedMarkdown"></md-card-content>
</md-card>
</template>

<script>
  import marked from 'marked'
  marked.setOptions({
    gfm: true
  })
export default {
  name: 'item',
  props: ['item'],
  data () {
    return {
      msg: 'Welcome to Your Vue.js PWA',

    }
  },

  computed: {
      parsedMarkdown: function () {
        return this.$config.md.render(this.item.rawMarkdown)
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
