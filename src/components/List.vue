<template>
  <div>



  <p v-for="item in list">
    <item :item="item.item"></item>
  </p>

    <md-speed-dial md-open="hover" md-direction="top" class="md-fab-bottom-right" md-theme="light-blue">
      <md-button class="md-fab" md-fab-trigger @click="routeToCreate">
        <md-icon md-icon-morph>+</md-icon>
        <md-icon>+</md-icon>
      </md-button>


    </md-speed-dial>

  </div>
</template>

<script>


export default {
  name: 'List',
  data () {
    return {
      list: []
    }
  },

  mounted: function () {
    var vm = this;
    this.$config.itemDb.allDocs({
      include_docs: true,
      descending: true
    }).then(function (results) {
        vm.$data.list = results.rows.map(function (currentValue) {
        return {
            item: currentValue
        }
      })
    })
  },
  methods: {
    routeToCreate: function () {
      this.$router.push('create')
    }
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#id {
  width: 90%;
  margin: auto;
}
</style>
