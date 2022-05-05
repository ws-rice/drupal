(function (Drupal, $, window){
  Drupal.behaviors.events = {
    attach: function (context, settings) {
      /* Get Events */
      $(context).find('.js-events').each(function() {
        var self = $(this);
        var feedURL = self.data('feedUrl');
        var params = '/max/6';


        $.getJSON(feedURL, params, function (response) {
          $(self).html(_getNodes(response));
        });

        function _getNodes(_data) {
          var data = [];

          for(let i = 0; i < _data.length; i ++) {
            var $el =
              '<div class="col">' +
              '<a href="'+_data[i].url+'" target="_blank" class="article article--event border-b">' +
              '<p class="article__date">'+(_getDay(_data[i].date_utc)).toUpperCase()+'</p>' +
              '<h5 class="article__title">'+_data[i].title+'</h5>' +
              '<p class="article__time">'+_data[i].date_time+'</p>' +
              '</a>' +
              '</div>';

            data.push($el);
          };
          return data.join("").toString();
        }

        function _getDay(date) {
          var d = new Date(date);
          var locale = 'en-US';

          return d.toLocaleDateString(locale, {weekday: 'long'}) + ', ' + d.toLocaleDateString(locale, {month: 'short'}) + '. ' +
            d.toLocaleDateString(locale, {day: '2-digit'}) + ', ' + d.toLocaleDateString(locale, {year: 'numeric'});
        }
      })
    }
  };
}(Drupal, jQuery, this));
