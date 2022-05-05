(function (Drupal, $, window) {
  Drupal.behaviors.news = {
    attach: function (context, settings) {
      /* Get Rice news */
      $(context).find('.js-rice-news').each(function () {
        var params = [];
        var self = $(this);
        var feedURL = self.data('feedUrl');
        var domain = (feedURL.indexOf('https://') === 0) ? ("https://" + (new URL(feedURL)).host) : '';
        var numRows = self.data('perPage')/4;
        var tags = self.data('tag').trim().split(",");

        createQuery(params, self.data('category'), self.data('perPage'));
        if (tags !== '') {
          params.push('filter[tag-grp][group][conjunction]=OR');
          $.each(tags, function (index, value) {
            if ($.trim(value)) {
              params.push('filter[tag' + (index + 1) + '][condition][path]=field_tags.name');
              params.push('filter[tag' + (index + 1) + '][condition][value]=' + $.trim(value));
              params.push('filter[tag' + (index + 1) + '][condition][memberOf]=tag-grp');
            }
          });
        }
        //params.push(addParam('filter[field_tags.name]', tags));
        params.push(addParam('include','field_image,field_featured_image,field_featured_image.field_media_image,field_tags'));

        $.getJSON(feedURL+ buildUrl(params), function (response) {
            if ($.trim(response)) {
              self.html(getNodes(response, domain));
              slickItems(self, numRows);
            }
          }
        );

        $(window, context).resize(Drupal.debounce(function() {
          self.slick('resize');
        }, 250));
      });

      /* Get current news */
      $(context).find('.js-current-news').each(function () {
        var params = [];
        var self = $(this);
        var feedURL = self.data('feedUrl');
        var domain = (feedURL.indexOf('https://') === 0) ? ("https://" + (new URL(feedURL)).host) : '';
        var numRows = self.data('perPage')/4;

        createQuery(params, self.data('category'), self.data('perPage'));
        if(self.data('tag') !== '') {params.push(addParam('filter[field_tags.name]', self.data('tag')))};
        params.push(addParam('include','field_image,field_tags'));

        $.getJSON(feedURL+ buildUrl(params), function (response) {
            if ($.trim(response)) {
              self.html(getNodes(response, domain));
              slickItems(self, numRows);
            }
          }
        );

        $(window, context).resize(Drupal.debounce(function() {
          self.slick('resize');
        }, 250));
      });

      $(context).find('.js-view-current-news').each(function () {
        var numRows = 2;
        slickItems($(this), numRows);
      });

      /* Get press contacts info - Profiles site */
      $(context).find('.js-profiles-press-contacts').each(function () {
        var feedURL = 'https://profiles.rice.edu/api/press_contacts/';
        var netId = $(this).data('netId').join();

        $.getJSON(feedURL+netId, function (response) {
          if ($.trim(response)) {
            var data = [];
            for (let i=0; i < response.length; i++){
              var node = response[i];
              var $el = ((i === 0) ? '<div class="col press">' : '<div class="col press lastCol">') +
                '<span class="pressContact">' + node.first_name + ' ' + node.last_name +
                '</span><br><span class="pressPhone">' + node.phone + '</span><br><span class="pressEmail">'
                + node.email + '</span></div>';
              data.push($el);
            }
            $('.js-profiles-press-contacts').prepend(data.join('').toString());
          }
        });
      });

      /* Get authors info - Kinder site */
      $(context).find('.js-profiles-urbanedge').each(function () {
        var self = this;
        var feedURL = 'https://profiles.rice.edu/api/press_contacts/';
        var netId = $(this).data('netId');

        if(netId) {
          netId = netId.join();
          $.getJSON(feedURL + netId, function (response) {
            if ($.trim(response)) {
              $.each(response, function (index, value) {
                var lastItem = index === response.length - 1, secondToLast = index === response.length - 2;
                var $el = '<a href="' + response[index].link + '" target="_blank" style="color:#034ea1;">' +
                  response[index].first_name.toUpperCase() + ' ' + response[index].last_name.toUpperCase() + '</a>';
                $(self).find('.small').append($el);
                if (!lastItem) {
                  $(self).find('.small').append(secondToLast ? ' and ' : ', ');
                }
              });
            }
          });
        }
      });

      /* Get contributor info - Kinder site */
      $(context).find('.js-urbanedge-contributor').each(function () {
        var feedURL = 'https://profiles.rice.edu/api/press_contacts/';
        var self = $(this);
        var netId = $(self).data('netId');
        var path = $(self).data('path');

        if(netId) {
          netId = netId.join();
          $.getJSON(feedURL + netId, function (response) {
            if ($.trim(response)) {
              $.each(response, function (index, value) {

                var node = response[index];
                var $el = '<div class="article__author"><div class="col-1"><div class="article__author-image">' +
                  '<img class="image-responsive" src="' + node.image + '" alt="' + node.image_alt + '"></div></div>' +
                  '<div class="col-10"><p class="author-name"><strong>' +
                  'ABOUT ' + node.first_name.toString().toUpperCase() + ' ' + node.last_name.toString().toUpperCase() +
                  '</strong></p><p class="author-summary">' + node.summary + '</p>' +
                  '<p class="author-details">' +
                  '<a class="twitter" href="https://twitter.com/' + node.twitter + '">' + node.twitter + '</a>' +
                  '<a class="email" href="mailto:' + node.email + '">' + node.email + '</a>' +
                  '<a class="author-link" href="' + node.link + '">Profile</a>' +
                  '<a href="' + path + node.net_id + '">Posts</a> ' +
                  '</p></div></div>';

                $(self).append($el);
              });
            }
          });
        }
      });

      /* Get article author info - Profiles site */
      $(context).find('.js-profiles-header').each(function () {

        var feedURL = $(this).data('feedUrl');
        var netId = $(this).data('netId');

        $.getJSON(feedURL, {netId: netId}, function (response) {
          if ($.trim(response)) {
            var data = response[0];
            $('.js-profiles-header').html('<a href="' + data.net_id + '" target="_blank"><strong>' +
              data.first_name + ' ' + data.last_name + '</strong></a> - ');

            $('.js-profiles-footer').html('<a href="' + data.net_id + '" target="_blank">' +
              '<div class="article__author-image">' +
              '<img class="image-responsive" src="' + data.image + '" alt="' + data.image_alt + '">' +
              '</div><div class="article__author-bio">' +
              '<p><strong>ABOUT ' + data.first_name.toString().toUpperCase() + ' ' + data.last_name.toString().toUpperCase() +
              '</strong></p><hr><p>' + data.summary + '</p>' +
              '</div></a>');
          }
        });

      });

      /* Get press contacts info - Profiles site */
      $(context).find('.js-professor-profile').each(function () {
        var self=$(this);
        var feedURL = "https://profiles.rice.edu/api/press_contacts/";
        var netIds = self.data('netid');

        $.getJSON(feedURL + netIds, function (response) {
          if ($.trim(response)) {self.html(generateHTML(response));}
        });
      });

      function generateHTML(nodes){
        var dataCount = nodes.length;
        var $row = '<div class="grid-mw--1380 pb-5">';

        $.each(nodes, function(i, value){
          if (i === 0 || i % 3 === 0) {$row += '<div class="grid-3 grid@m grid-hg grid-vg grid-hg@m-rs border-t">';}
          var $nestedRow = (i % 3 === 2 || i === dataCount-1) ? '<div class="col">' : '<div class="col border-r border@m-r-rs">';
          $row += $nestedRow;

          $row += '<div class="card card--bio">' +
            '<a href="' + value.link + '" target="_blank"  class="card__image">' +
            '<img src="' + value.image +
            '" style="width:186px" alt="' + value.image_alt + '">' + '</a>' +
            '<div class="card__title">' +
            '<a href="' + value.link + '" target="_blank" class="h6 link">' +
            value.first_name + ' ' + value.last_name + '</a>' +
            '<p class="body">' + value.title + '</p>' +
            '</div></div></div>';

          if (i % 3 === 2 || i === dataCount - 1) {$row += '</div>' ;}
          if (!(i === dataCount - 1)) { $row += '<hr class="hide block@m rule fl">' }
        });
        return $row + '</div>';
      }

      function slickItems(self, numRows){
        self.slick({
          mobileFirst: false,
          arrows: true,
          infinite: true,
          fade: false,
          speed: 500,
          cssEase: 'ease',
          responsive: [{
            breakpoint: 10000,
            settings: {
              arrows: false,
              rows: numRows,
              slidesPerRow: 4,
            }
          },
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
              }
            },
            {
              breakpoint: 512,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              }
            }]
        });
      }

      function createQuery(params, category, limit) {
        params.push(addParam('fields[node-—article]','title,field_subtitle,path,body,field_image,field_featured_image,field_tags,field_category,created'));
        params.push(addParam('fields[file--file]' ,'uri'));
        params.push(addParam('fields[taxonomy_term--news_categories]', 'name'));
        params.push(addParam('filter[status][value]', 1));
        if(category !== '') {params.push(addParam('filter[field_category.name]', category))};
        params.push(addParam('page[limit]', limit));
        params.push(addParam('sort','-created'));
      }

      function addParam(name, value) {
        if(typeof value === 'undefined' || value === '') {return;}
        return name+"="+value;
      }

      function buildUrl(params) {
        var query='';
        for(let i = 0; i < params.length; i ++) {
          if(i == 0) {query = "?" + params[i];}else{query += "&" + params[i];}
        }
        return query;
      }

      function getNodes(response, domain) {
        var data = [];
        for(let i = 0; i < response.data.length; i ++) {
          var node = response.data[i], imagePath = '';
          if ($.trim(node.relationships.field_image.data)){
            imagePath = domain + getImage(node.relationships.field_image.data[0].id, response.included);
          } else if ($.trim(node.relationships.field_featured_image.data)){
            imagePath = domain + getImage(node.relationships.field_featured_image.data.id, response.included, true);
          }

          var summary = '';
          if (node.attributes.field_subtitle.length){ summary = node.attributes.field_subtitle}
          else if (node.attributes.body.summary){summary = node.attributes.body.summary}

          let $el =
            '<div class="card card--stacked col">' +
            '<div class="card__content">' +
            '<div class="card__image">' +
            '<div class="image-background" style="background-image: url('+ imagePath +');"></div>' +
            '<div class="card-overlay">' +
            '<div class="card-overlay__content overlay__content--bottomLeft">' +
            '<p class="card__info"><span class="card__date">'+ formatDate(node.attributes.created) +'</span></p>' +
            '<a href="'+domain+node.attributes.path.alias + '" class="card__title">'+node.attributes.title+'</a>' +
            '</div></div></div>' +
            '<div class="card__summary">' +
            '<p class="summary summary-tall">' +
            trimText(summary, 150, ' ', ' ... ') +
            '</p></div></div></div>';
          //$row.append($el);
          data.push($el);
        }
        return data;
      }

      function getImage(imageId, included, medialib=false){
        var url;
        if (!medialib) {
          $.each(included, function (key,item) {if (item.id === imageId){url=item.attributes.uri.url;return false;}});
        } else {
          var mediaimageid;
          $.each(included, function (key,item) {if (item.id === imageId){mediaimageid=item.relationships.field_media_image.data.id;return false;}});
          $.each(included, function (key, item) {if (item.id === mediaimageid){url=item.attributes.uri.url;return false;}});
        }
        return url;
      }

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
