<template>
<md-card md-with-hover>
  <md-speed-dial md-open="click" md-direction="left" class="md-fab-top-right" md-theme="light-blue">
    <md-button class="md-fab md-mini" md-fab-trigger>
      <md-icon md-icon-morph>more_horiz</md-icon>
      <md-icon>more_horiz</md-icon>
    </md-button>

    <md-button @click="editItem" class="md-fab md-primary md-mini md-clean">
      <md-icon>mode_edit</md-icon>
    </md-button>

    <md-button @click="deleteItem"  class="md-fab md-primary md-mini md-clean">
      <md-icon>delete</md-icon>
    </md-button>
  </md-speed-dial>

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
  props: ['item', 'index'],
  data () {
    return {
      images: [],

    }
  },

  computed: {
      parsedMarkdown: function () {
        this.$config.md.renderer.rules.image = this.renderImage;
        this.$config.md.renderer.rules.hashtag_open = this.renderTagLinks;
        var rendered = this.$config.md.render(this.item.doc.rawMarkdown);
        return rendered;
      }
  },
  updated: function () {

  },
  mounted: function () {
    this.setListenerForCheckboxes()

    //as soon as item is set, load attachments
    var vm = this;
    var async = require("async");

    var imageRenderer = {
        render(element){
          vm.$config.itemDb.getAttachment(vm.item.doc._id, element.id)
            .then(function (result) {
              var reader = new FileReader();
              reader.onload = function(){
                element.src = reader.result

              };
              reader.readAsDataURL(result);

            }).catch(function (err) {
            console.error('Error loading image attachment', err)
          })


        }

    }

    var imageElements = document.getElementsByClassName(vm.item.id);

    async.map(imageElements, imageRenderer.render.bind(imageRenderer), function (err, results) {
      if (err) console.error(err)
    })


  },
  methods: {
      renderImage: function (tokens, idx, options, env, self) {
        var token = tokens[idx];
        var srcIndex = token.attrIndex('src');
        var srcId = token.attrs[srcIndex][1];
        return '<div><img src="" id="' + srcId + '" alt="" class="imagesToLoad '+ this.item.id +'"></img></div>';

        },

        renderTagLinks: function (tokens, idx) {
          var tagName = tokens[idx].content.toLowerCase();
          return '<a href="/#/?search=' + tagName + '" class="tag">';
        },

    deleteItem: function () {
      this.$config.itemDb.remove(this.$props.item.id, this.$props.item.value.rev)
        .then(function (res) {
          console.log(res)
        })
    },
    editItem: function () {
      this.$router.push({name: 'Edit' , params: {id: this.$props.item.id}})
    },
    setListenerForCheckboxes: function () {
      var vm = this;
      var async = require("async");
      var currentItem = document.getElementsByClassName('listItem')[this.index];
      var checkboxes = currentItem.querySelectorAll("input[type='checkbox']");

      async.each(checkboxes, function (box, callback) {
        box.addEventListener('click', vm.handleCheckboxTogle)
      })
    },
    handleCheckboxTogle: function (e) {
      var checkboxContent = document.querySelector('label[for="' + e.target.id +'"]').innerHTML;
      if (e.target.checked){ //needs to be set to checked
        this.item.doc.rawMarkdown = this.item.doc.rawMarkdown.replace('[ ] ' + checkboxContent, '[x] '+ checkboxContent)
      }else{
        this.item.doc.rawMarkdown = this.item.doc.rawMarkdown.replace('[x] ' + checkboxContent, '[ ] '+ checkboxContent)
      }

      this.updateDb()
    },
    updateDb: function () {
      var vm = this;
      this.$config.itemDb.upsert(this.item.id, function () {
        return vm.item.doc
      })
        .catch(function (err) {
          console.error(err)
        })
    }

  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
