(function (Drupal, $, window){
  Drupal.behaviors.RelatedNews = {
    attach: function (context, settings) {
      $(context).find('.js-related-news').each(function () {

        var self = $(this);
        var feedURL = self.data('feed-url');
        var perPage = self.data('per-page');
        var page = self.data('page');
        var categoryId = self.data('category-id');
        var tagId = self.data('tag-id');
        var params = {
          perPage: perPage,
          page: page,
          categoryId: categoryId,
          tagId: tagId,
        };

        $.getJSON(feedURL, params, function (response) {
          if ($.trim(response.data)) {
            $(self).html(_getNodes(response.data));
            $(self).html(_render(response.data));
            $(self).html(_paginate(response.data));
          }
        })
      });

      function _paginate(ref, options) {
        return function (response, textStatus, request) {
          ref.updatePagination(ref, options, response, request);
          if (typeof options.append !== 'undefined') {
            ref.$el.html(ref._getNodes(response, ref));
          } else {
            ref.$el.append(ref._getNodes(response, ref));
          }
          ref.fadeIn(ref);
        }
      }

      function _render(ref, options) {
        return function (response, textStatus, request) {
          ref.updatePagination(ref, options, response, request);
          ref.$el.html(ref._getNodes(response, ref));
          ref.fadeIn(ref);
        }
      }

      function _getNodes(response, ref) {

        var data = [];

        for (let i = 0; i < response.length; i++) {
          let node = response[i];

          var image = node.jetpack_featured_media_url !== '' ? node.jetpack_featured_media_url : '';

          if (image) {
            var alt = typeof node._embedded['wp:featuredmedia'] !== 'undefined' ? node._embedded['wp:featuredmedia'][0].alt_text : node.title.rendered;
            var $el =
              '<div class="article article--news grid-3 grid@m" data-set="' + ref.currentPage + '">' +
              '<div class="article__image col-1">' +
              '<a href="' + node.link + '" target="_blank"><img class="image-responsive" src="' + image + '" alt="' + alt + '"></a>' +
              '</div>' +
              '<div class="article__content col-2">' +
              '<a href="' + node.link + '" target="_blank" class="article__title"><strong>' + node.title.rendered + '</strong></a>' +
              '<p class="article__date">' + Text.formatDate(node.date, 'dddd, MMM. D, YYYY') + '</p>' +
              '<p class="article__summary">' + Text.trim(Text.stripHTML(node.excerpt.rendered), 150, ' ', ' ... ') + '</p>' +
              '</div>' +
              '</div>';
          } else {
            var $el =
              '<div class="article article--news grid" data-set="' + ref.currentPage + '">' +
              '<div class="article__content col">' +
              '<a href="' + node.link + '" target="_blank" class="article__title"><strong>' + node.title.rendered + '</strong></a>' +
              '<p class="article__date">' + Text.formatDate(node.date, 'dddd, MMM. D, YYYY') + '</p>' +
              '<p class="article__summary">' + Text.trim(Text.stripHTML(node.excerpt.rendered), 150, ' ', ' ... ') + '</p>' +
              '</div>' +
              '</div>';
          }
          data.push($el);
        }
        return data.join("").toString();
      }
    },
  };
}(Drupal, jQuery, this));
