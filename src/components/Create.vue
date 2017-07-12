<template>
  <div>
    <md-input-container>
      <md-textarea rows="50" v-model="rawInput"></md-textarea>
    </md-input-container>

    <md-input-container>
      <md-file placeholder="A nice input placeholder" accept="image/*" @selected="addImage"></md-file>
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
      rawInput: '',
      images: []
    }
  },
  methods: {
    saveToDb: function () {
      var vm = this;

      this.$config.itemDb.put({
        _id: vm.getIdNow(),
        rawMarkdown: this.$data.rawInput
      }).then(function (result) {
          vm.saveAllImagesToDb(result.id, result.rev)
      }).catch(function (err) {
        console.error('Error saving new item to database: ', err)
      })
    },

    saveAllImagesToDb: function (id, rev) {
      var vm = this;
    var revision = rev;

    this.images.forEach(function (item){
          vm.$config.itemDb.putAttachment(id, item.id, revision, item.data , item.type)
            .then(function (result) {
              revision = result.rev;
              console.debug('saved image' , result)
            }).catch(function (err) {
              console.error('Error saving image to db', item, err)
        })
      })




    },

    addImage: function (imageList) {
      var vm = this;
      var reader = new FileReader();
      var id = vm.getIdNow()
      reader.onload = function(){
        vm.images.push({
          data: btoa(reader.result),
          id: id,
          name: imageList[0].name,
          lastModified: imageList[0].lastModified,
          size: imageList[0].size,
          type: imageList[0].type
        })

        vm.rawInput += '![' + imageList[0].name + '](' + id + ')'
      };
      reader.readAsBinaryString(imageList[0]);

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
