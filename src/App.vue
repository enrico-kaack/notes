<template>
  <div id="app">
    <header>
      <md-button class="md-icon-button" @click="toggleLeftSidenav">
        <md-icon>menu</md-icon>
      </md-button>
      <span>Vue.js PWA</span>
    </header>
    <main>

      <md-sidenav md-swipeable=true class="md-left" ref="leftSidenav">
      <md-toolbar class="md-toolbar-container">
        <div class="md-toolbar-container">
          <h3 class="md-title">Tags</h3>
        </div>
      </md-toolbar>
        <div class="md-toolbar-container">
        <div v-for="tag in tags" has-ripple>
          <tag @close="closeLeftSideNav" :tag="tag.id"></tag>
        </div>
        </div>
      </md-sidenav>

      <router-view id="main-body"></router-view>
    </main>


  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
      return {
        tags: []
      }
  },
  mounted: function () {
      var vm = this;
    this.$config.tagDb.allDocs({include_docs: true}).then(function (results) {
      console.log(results.rows)
      results.rows.sort(function (a, b) {
        console.log(a.doc.count, b.doc.count)
        return a.doc.count - b.doc.count
      })
      console.log(results.rows)
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
    }

  }
}
</script>

<style>
  #main-body {
    width: 90%;

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
</style>
