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
      images: [],

    }
  },

  computed: {
      parsedMarkdown: function () {
        this.$config.md.renderer.rules.image = this.renderImage;
        this.$config.md.renderer.rules.hashtag_open = this.renderTagLinks;
        return this.$config.md.render(this.item.doc.rawMarkdown)
      }
  },
  mounted: function () {
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
        }

  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
