<template>
  <div id="app">

      <md-toolbar class="md-toolbar-container">
        <md-button class="md-icon-button" @click="toggleLeftSidenav">
          <md-icon>menu</md-icon>
        </md-button>

        <h3 class="md-title">Notes</h3>

        <md-input-container class="searchContainer" md-inline md-clearable>
          <md-icon>search</md-icon>
          <md-input @keyup.enter.native="search" v-model="searchQuery"></md-input>
        </md-input-container>
      </md-toolbar>

      <md-sidenav class="md-left" ref="leftSidenav" md-swipeable>
        <md-toolbar class="md-toolbar-container">
          <md-button class="md-icon-button" @click="toggleLeftSidenav">
            <md-icon>menu</md-icon>
          </md-button>

          <h3 class="md-title">Tags</h3>

        </md-toolbar>

        <div class="md-toolbar-container">
        <div v-for="tag in tags" has-ripple>
          <tag @close="closeLeftSideNav" :tag="tag.id"></tag>
        </div>
        </div>
      </md-sidenav>

      <router-view id="main-body"></router-view>


  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
      return {
        searchQuery: '',
        tags: []
      }
  },

  watch: {
    $route: function(){
      this.setSearchQuery()
    },
    searchQuery:function () {

        if (this.searchQuery.length === 0) this.search()
    }
  },
  mounted: function () {
      var vm = this;

      this.setSearchQuery()

    this.$config.tagDb.allDocs({include_docs: true}).then(function (results) {
      console.log(results.rows)
      results.rows.sort(function (a, b) {
        return a.doc.count - b.doc.count
      })
      vm.tags = results.rows

    }).catch(function (err) {
      console.error('Error loading tags from database', err)
    })
  },
  methods: {
    toggleLeftSidenav() {
      this.$refs.leftSidenav.toggle();
    },
    closeLeftSideNav(){
        this.$refs.leftSidenav.close();
    },
    setSearchQuery: function () {
      this.searchQuery = this.$route.query.search
    },
    search: function () {
      this.$router.push({name: 'List' , query: {search: this.searchQuery}})
    }

  }
}
</script>

<style>
  #main-body {
    width: 100%;

  }
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
.searchContainer {
  width: calc(100% - 200px);
  min-width: 75px;
  max-width: 300px;
}
</style>
