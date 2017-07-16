<template>
  <div>



  <p class="listItem" v-for="item in list">
    <item :item="item.item"></item>
  </p>

    <md-speed-dial md-open="hover" md-direction="top" class="md-fab-bottom-right" md-theme="light-blue">
      <md-button class="md-fab" md-fab-trigger @click="routeToCreate">
        <md-icon md-icon-morph>+</md-icon>
        <md-icon>add</md-icon>
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
  watch: {
    $route: function () {
      this.refreshListData()
    }
  },

  created () {
    this.refreshListData()


  },
  methods: {
    setList: function (res) {
      this.$data.list = res.rows.map(function (currentValue) {
        return {
          item: currentValue
        }
      })
    },

    refreshListData: function () {
      var vm = this;
      if (this.$route.query.search === undefined || this.$route.query.search.length === 0) {
        this.$config.itemDb.allDocs({
          include_docs: true,
          descending: true
        }).then(function (results) {
          vm.setList(results)
        })
      }else if (this.$route.query.search !== undefined){
        //just filter by tag
        this.$config.itemDb.search({
          query: this.$route.query.search,
          fields: ['tags', 'rawMarkdown'],
          include_docs: true
        }).then(function (results) {
          vm.setList(results)
        }).catch(function (err) {
          console.error('Error searching for tag', err)
        })
      }
    },
    routeToCreate: function () {
      this.$router.push({name: 'Create'})
    }
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.listItem {
  width: 95%;
  margin-left: auto;
  margin-right: auto;
}

  #id {
  width: 90%;
  margin: auto;
}
</style>
