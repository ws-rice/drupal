(function (Drupal, $, window) {
  Drupal.behaviors.calendar = {
    attach: function (context, settings) {
      $(context).find('.js-calendar-slick').each(function () {
        var self = $(this);
        var url = self.data('feed-url');
        var params = '/max/4';

        $.getJSON(url + params, function(response) {
          $(self).append(getNodes(response));
          slickItems(self);
        });

        $(window, context).resize(Drupal.debounce(function() {
          self.slick('resize');
        }, 250));
      });

      function getNodes(_data) {
        var data = [];

        /*Todo - Temporary fix for calendar to be removed later */
        let eventpath = "https://events.rice.edu/#!view/event/event_id/";

        for(let i = 0; i < _data.length; i ++) {

          //var startDate = getStartDate(_data[i]);

          /*Todo - Temporary fix for calendar - Restore this later */
          /*var $el =
          '<div class="calendar__event">' +
            '<a href="'+_data[i].url+'" target="_blank">' +
              '<h3>'+this._getDates(_data[i])+'</h3>' +
              '<hr>' +
              '<p class="summary">'+_data[i].title.toUpperCase()+'</p>' +
            '</a>' +
          '</div>'; */

          /*Todo - Temporary fix for calendar to be removed later */
          var $el =
            '<div class="calendar__event">' +
            '<a href="'+eventpath + _data[i].id+'" target="_blank">' +
            '<h3>'+ getDates(_data[i])+'</h3>' +
            '<hr>' +
            '<p class="summary">'+_data[i].title.toUpperCase()+'</p>' +
            '</a>' +
            '</div>';

          data.push($el);
        }

        // Hack for sliders with different number of items to keep them in sync when grouped
        if(_data.length < 4) {
          var diff = 4 - _data.length;
          for(let i = 0; i < diff; i ++) {
            data.push('<div class="calendar__event"></div>');
          }
        }

        return data.join("").toString();
      }

      // Get event start date
      function getStartDate(_data) {

        var cleanDate = _data.date.split("<");
        var startDate = cleanDate[0].split(" ");
        var startMonth = startDate[0].substring(0, 3);
        var startDay = startDate[1];

        return { month: startMonth, day: startDay };
      }

      // Get event end date
      function getEndDate(_data) {
        if(_data.repeats_until) {
          var cleanDate = _data.repeats_until.split("<");
          var endDate = cleanDate[0].split(" ");
          //var endDate = _data.repeats_until.split(" ");
          var endMonth = endDate[0].substring(0, 3);
          var endDay = endDate[1];

          return { month: endMonth, day: endDay };
        }
      }

      // Get and concat event dates
      function getDates(_data) {

        var startDate = getStartDate(_data);
        var endDate = getEndDate(_data);

        var str = '<strong>'+startDate.month+'</strong> ';

        if(typeof endDate !== 'undefined') {
          if(endDate.month == startDate.month && parseInt(endDate.day, 10) > parseInt(startDate.day, 10)) {
            return str + '<br>' + startDate.day + "–" + endDate.day;
          }
          if(endDate.month == startDate.month && parseInt(endDate.day, 10) === parseInt(startDate.day, 10)) {
            return str + '<br>' + startDate.day;
          }
          if(endDate.month !== startDate.month) {
            return str + startDate.day + '<br>' + '<strong>'+endDate.month+'</strong> ' + endDate.day;
          }
        } else {
          return str + '<br>' + startDate.day;
        }
      }

      function slickItems(self){
        var $first = groupCalendars(self);

        self.on('init', function(slick) {
          var trackHeight = self.find('.slick-track').outerHeight();
          self.find('.calendar__title').css('height', trackHeight);
        });

        self.on('beforeChange', function(event, slick, currentSlide, nextSlide){
          $first.next('.calendar').find('.js-calendar-slick').slick('slickGoTo', nextSlide);
          $first.next('.calendar').prev('.calendar').find('.js-calendar-slick').slick('slickGoTo', nextSlide);
        });

        self.slick({
          mobileFirst: false,
          arrows: true,
          infinite: true,
          fade: false,
          speed: 500,
          cssEase: 'ease',
          slidesToShow: 5,
          slidesToScroll: 2,
          responsive: [{
            breakpoint: 2000,
            settings: {
              arrows: false,
            }
          },
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
              },
            }]
        });
      }

      function groupCalendars(self) {
        var $calendars = self.parent('.calendar').parent().find('.calendar');
        var $first = $calendars.first();

        if($first.next('.calendar').length) {
          if(!$('.calendar-group').length) {
            $calendars.wrapAll($('<div>').addClass('calendar-group'));
          }
        }
        return $first;
      }
    }

  };

}(Drupal, jQuery, this));
