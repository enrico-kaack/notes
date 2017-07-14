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
      images: [],
      tags: []
    }
  },
  methods: {
    saveToDb: function () {
      var vm = this;
      this.extractTags()
      this.$config.itemDb.put({
        _id: vm.getIdNow(),
        rawMarkdown: this.rawInput,
        tags: this.tags
      }).then(function (result) {
          vm.saveAllImagesToDb(result.id, result.rev)
          vm.saveTags(result.id)
      }).catch(function (err) {
        console.error('Error saving new item to database: ', err)
      })
    },

    saveTags: function (doc_id) {
      var vm = this;
      var async = require("async");
      var tagSaver =   {

          saveTag: function (tag, callback) {
            vm.$config.tagDb.upsert(tag, function (doc) {
              if (!doc.count) {
                doc.count = 0;
              }
              doc.count++;
              return doc;
            }).then(function (res) {
              callback(null, res)
            }).catch(function (err) {
              console.error('Error saving tag', tag, err)
            });
          }
      }

      async.mapSeries(this.tags, tagSaver.saveTag.bind(tagSaver), function (err, results) {
        console.log(results)
      })

    },

    extractTags: function(){
      var vm = this;
      this.$config.md.renderer.rules.hashtag_text = function hashtag_text(tokens, idx) {
        vm.tags.push(tokens[idx].content)
        return '#' + tokens[idx].content;
      }
      this.$config.md.render(this.rawInput)
    },

    saveAllImagesToDb: function (id, rev) {
      var async = require("async");
      var vm = this;

    var imageSaver = {
      revision: rev,
      saveImage(item, callback){
          console.log(item)
        var is_this = this;
        vm.$config.itemDb.putAttachment(id, item.id, this.revision, item.data , item.type)
          .then(function (result) {
            is_this.revision = result.rev;
            console.debug('saved image' , result)
            callback(null, item)
          }).catch(function (err) {
          console.error('Error saving image to db', item, err)
        })
      }

    }
  imageSaver.revision = rev;
   async.mapSeries(vm.images, imageSaver.saveImage.bind(imageSaver), function (err, results) {
     if (err) console.error(err)
     if (results) console.debug(results)
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
