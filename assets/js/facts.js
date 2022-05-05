(function (Drupal, $, window){
  Drupal.behaviors.Facts = {
    attach: function (context) {
      $(context).find('.js-facts').each(function () {
        var self = $(this);
        var limit = self.attr("data-page-limit");
        var feedURL = self.data('feedUrl') + "?include=field_image&fields[file--file]=uri&filter[status][value]=1&sort=-created&page[limit]=" +limit;

        $.getJSON(feedURL, function (response) {
          $(self).html(getNodes(response));
        });

        function getNodes(response, ref, options) {
          var data = [];

          for(let i = 0; i < response.data.length; i ++) {
            var $node = _getNode(response, ref, i);

            if(i % 3 == 0) {
              var $row = $('<div>', { class: "grid-2 grid@m" });
            }
            if(i == 0 || i == 4) {
              var $nestedRow = $('<div>', { class: "col grid-2 grid@m" });
              $row.append($nestedRow);
            }

            if(i == 0 || i == 1 || i == 4 || i == 5) {
              $nestedRow.append($node);
            }
            else {
              $row.append($node);
            }

            data.push($row);
          }
          return data;
        }

        function _getNode(response, ref, index) {
          var data = response.data[index];
          var included = response.included[index];

          var $node = $('<div>', { class: "col" });
          $node.html(
            '<div class="panel panel-fact col" data-set="">' +
            '<div class="image-background" style="background-image: url('+included.attributes.uri.url+');"></div>' +
            '<div class="panel-overlay overlay--extraDark">' +
            '<div class="overlay__content overlay__content--center">' +
            data.attributes.field_body.processed +
            '</div>' +
            '</div>' +
            '</div>'
          );
          return $node;
        }

      })
    }
  }
}(Drupal, jQuery, this));
