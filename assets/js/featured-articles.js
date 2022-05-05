(function (Drupal, $, window){
  Drupal.behaviors.FeaturedArticles = {
    attach: function (context, settings) {
      $(context).find('.js-featured-articles').each(function () {
        var self = $(this);
        var category = self.attr("data-category-name");
        var limit = self.attr("data-page-limit");
        var feedURL = self.data('feedUrl') + "?include=field_image,field_category&fields[file--file]=uri&filter[status][value]=1&sort=-created&filter[field_category.name]=" +category+ "&page[limit]=" +limit+ "&fields[node--article]=field_formatted_title,field_formatted_subtitle,path,field_image";
        var href = self.data('href');
        var newFeedURL = self.data('feedUrl') + "?include=field_image,field_category&fields[file--file]=uri&filter[status][value]=1&sort=-created&filter[field_category.name]=" +category+ "&fields[node--article]=field_formatted_title,field_formatted_subtitle,path,field_image";


        $.getJSON(feedURL, function (response) {
          $(self).html(getNodes(response));
        });

        function getNodes(response, ref, options) {
          var data = [];
          var response = response;


          var $row = $('<div>', {class: "grid-2 grid@m"});
          for (var i = 0; i < 2; i++) {
            var $node = _getNode(response, ref, i, true);
            $row.append($node);
          }
          data.push($row);
          response.data = response.data.slice(2);
          // response.included = response.included.slice(2);

          for (let i = 0; i < response.data.length; i++) {
            if (i % 3 == 0) {
              var $row = $('<div>', {class: "grid-3 grid@m"});
            }
            var $node = _getNode(response, ref, i, false);
            $row.append($node);
            data.push($row);
          }
          this.dataSet++;
          return data;
        }

        function _getNode(response, ref, index, offsetFirst) {
          var data = response.data[index];

          let imagePath = '';
          $.each(response.included, function(key, item){
            if (item.id === data.relationships.field_image.data[0].id){
              imagePath = item.attributes.uri.url;
              return false;
            }
          });


          var $node = $('<div>', { class: "col"});
          $node.attr('data-set', href.currentPage);
          $node.html(
            '<div class="block panel panel--featured ' + ' image-zoom">' +
            '<div class="image-background" style="background-image: url('+imagePath+');"></div>' +
            '<a class="panel__group" href="'+ data.attributes.path.alias +'" target="_blank">' +
            '<div class="overlay overlay--animate">' +
            '<div class="panel__content overlay__content overlay__content--bottomLeft">' +
            '<h3 class="article-h3-title">' + data.attributes.field_formatted_title.processed + '</h3>' +
            '<span class="article-link link">' +
            '<span class="link__text">'+ (data.attributes.field_formatted_subtitle.processed).toUpperCase() +'</span>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '</a>' +
            '</div>'
          );
          return $node;
        }
        //View More Code
        refreshFeed();

        function refreshFeed() {
          $('.js-featured-articles').next('.pagination').click(function(){
            $.getJSON(newFeedURL, function (response) {
              $(self).html(getNodes(response));
            });
            $('.js-featured-articles').next('.pagination').hide();
          });
        }
      })
    }
  }
}(Drupal, jQuery, this));
