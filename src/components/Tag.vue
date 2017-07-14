<template>
<md-button v-html="tag" @click="tagClick">
</md-button>
</template>

<script>
  import marked from 'marked'
  marked.setOptions({
    gfm: true
  })
export default {
  name: 'tag',
  props: ['tag'],
  data () {
    return {

    }
  },

  methods: {
      tagClick: function () {
        this.$router.push({name: 'List' , query: {search: this.$props.tag}})
        this.$emit('close');
      }
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
