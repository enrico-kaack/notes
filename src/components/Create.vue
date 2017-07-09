<template>
  <div>
    <md-input-container>
      <md-textarea rows="50" v-model="rawInput"></md-textarea>
    </md-input-container>

    <md-button class="md-fab md-fab-bottom-right md-warn" @click="saveToDb">
      <md-icon>save</md-icon>
    </md-button>

  </div>

</template>

<script>
export default {
  name: 'create',
  data () {
    return {
      msg: 'Welcome to Your Vue.js PWA',
      rawInput: 'Enter markdown here'
    }
  },
  methods: {
      saveToDb: function () {
        var vm = this;

        this.$config.itemDb.put({
          _id: vm.getIdNow(),
          rawMarkdown: this.$data.rawInput
        }).then(function () {
          vm.$router.push('/')
        }).catch(function (err) {
          console.error('Error saving new item to database', err)
        })
      },

    getIdNow: function () {
      return new Date().getTime() + '' + Math.random()*10000;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
