(function (Drupal, $, window) {
  Drupal.behaviors.profiles = {
    attach: function (context, settings) {

      /* Get profile info - Profiles site */
      $(context).find('.js-profiles').each(function () {
        var self = $(this);
        var feedURL = 'https://web-api2.rice.edu/profiles/search';
        var tags = self.data('tags').trim().split(", ").join();
        var netids = self.data('sortNetid').trim().split(", ").join();
        var params = {
          tag: tags,
          netid: netids
        };

        $.getJSON(feedURL, params, function (response) {
          if ($.trim(response.data)) {
            $(self).html(getNodes(response.data));
          }
        });


        $("#profile-search").submit(function (event) {
          event.preventDefault();
          let lname = $(".tagLookup").val();
          let keyword = $(".keywordLookup").val();
          var searchURL = feedURL + '?lname=' + lname + '&research=' + keyword + '&tags=' + tags + '&netids=' + netids;

          refreshProfiles();

          function refreshProfiles() {
            $(".js-profiles").empty();
            $.getJSON(searchURL, params, function (response) {
              if ($.trim(response.data)) {
                $(self).html(getNodes(response.data));
              }
            });
          }
        });
      });
      //Refresh Page on Click
      $(".reset-btn").click(function() {
        location.reload();
      });




      function getNodes(response){

        var $row = '<div class="grid-mw--1380 pb-5">';

        $.each(response, function(i, value){

          if (i === 0 || i % 3 === 0) {
            $row += '<div class="grid-3 grid@m grid-hg grid-vg grid-hg@m-rs border-t">';
          }
          var $nestedRow = (i % 3 === 2 || i === response.length-1) ? '<div class="col">' : '<div class="col border-r border@m-r-rs">';

          $row += $nestedRow;
          $row += (getNode(value) + '</div>');

          if (i % 3 === 2 || i === response.length - 1) {
            $row += '</div>' ;
          }

          if (!(i === response.length - 1)) { $row += '<hr class="hide block@m rule fl">' };
        });

        return $row + '</div>';
      }

      function getNode(data) {
        return '<div class="card card--bio">' +
            '<a href="' + data.profile_url + '" target="_blank"  class="card__image">' +
            '<img src="' + (data.img_url ? data.img_url : '') +
            '" style="width:186px" alt="' + (data.img_alt ? data.img_alt : 'No Photo') + '">' + '</a>' +
            '<div class="card__title">' + '<a href="' + data.profile_url + '" target="_blank" class="h6 link">' +
            data.fname + ' ' + data.lname + '</a>' + '<p class="body">' + data.title + '</p>' + '</div></div>';
      }


    }
  };
} (Drupal, jQuery, this));

