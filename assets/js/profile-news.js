(function (Drupal, $, window) {
  Drupal.behaviors.profilesnews = {
    attach: function (context, settings) {

      /* Get publications of the person - SCOPUS */
      $(context).find('.profile-publications').each(function () {

        var authid = $(this).data('authid');

        if (authid) {
          $.getJSON('https://api.elsevier.com/content/search/scopus',
            {
              query: 'AU-ID(' + authid + ')',
              apiKey: 'ffbd9764577b2d48a17bbb958a81bb95',
              count: 5,
              sort: 'coverDate',
              suppressNavLinks: true,
              field: 'title,doi',
              httpAccept: 'application/json'
            },
            function (response) {
              if ($.trim(response['search-results'].entry)) {
                var items = '<p class="profile-details-title">Recent Publications</p>';
                $.each(response['search-results'].entry, function (i, entry) {
                  items += '<p class="profile-details-publications"><a href="https://www.doi.org/' +
                    entry['prism:doi'] + '" target="_blank">' + entry['dc:title'] + '</a></p>';
                });
                $('.profile-publications').append(items +
                  '<div class="profile-view-more"><a href="https://www.scopus.com/authid/detail.uri?authorId=' +
                  authid + '" target="_blank">view more...</a></div>');
              }
            });
        }
      });

      /* Get all news related to the person - Rice news */
      $(context).find('.profile-news-feed').each(function () {

        var feedURL = $(this).data('feedUrl');
        var perPage = $(this).data('perPage');
        var page = $(this).data('page');
        var categoryId = $(this).data('categoryId');
        var tagId = $(this).data('tagId');

        $.getJSON(feedURL,
          { categories: categoryId,
            tags: tagId,
            per_page: perPage,
            page: page
          },
          function (response) {
            if ($.trim(response)) {
              var items = '<p class="profile-details-title">Researcher News</p> <div>';
              $.each(response, function (i, node) {
                items += '<div class="profile-news">' +
                  '<a href="' + node.link + '" target="_blank" class="profile-news-title">' + node.title.rendered + '</a>' +
                  '<p class="profile-news-date"><span>' + formatDate(node.date) + '</span></p>' +
                  '<p class="profile-news-summary">' + trimText($(node.excerpt.rendered).text(), 100, ' ', '...') +
                  '</p>' + '</div>';
              });
              $('.profile-news-feed').append(items);
            }
          }
        );
      });

      /* Helper functions */
      function trimText(str, length, delim, appendix) {
        if (str.length <= length) return str;

        var trimmedStr = str.substr(0, length+delim.length);

        var lastDelimIndex = trimmedStr.lastIndexOf(delim);
        if (lastDelimIndex >= 0) trimmedStr = trimmedStr.substr(0, lastDelimIndex);

        if (trimmedStr) trimmedStr += appendix;
        return trimmedStr;
      }

      function formatDate(date){
        var d = new Date(date);
        var locale = 'en-US';

        return d.toLocaleDateString(locale,{weekday: 'long'}) + ', ' + d.toLocaleDateString(locale, {month: 'short'}) +
        '. ' + d.toLocaleDateString(locale, {day: '2-digit'}) + ' ' + d.toLocaleDateString(locale, {year: 'numeric'});

      }

    }
  };
} (Drupal, jQuery, this));
