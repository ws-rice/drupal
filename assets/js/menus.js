(function (Drupal, $, window) {
  Drupal.behaviors.menus = {
    attach: function (context, settings) {

      $(window, context).on('load', function(){
        if(navigator.userAgent.indexOf('MSIE')!==-1
          || navigator.appVersion.indexOf('Trident/') > -1){

          // Scroll event check
          $(window).scroll(function (event) {
            var scroll = $(window).scrollTop();

            // Activate sticky for IE if scrolltop is more than 20px
            if ( scroll > 20) {
              $('header').addClass( "sticky-top-ie" );
            }else{
              $('header').removeClass( "sticky-top-ie" );
            }
          });
        }
        scrollMenu();
      });

      $('.skip-to-content', context).click(function(){
        $('#main-content').attr('tabIndex', -1).focus();
      });

      $('#menu-button', context).click(function () {
        openMenu();
        setActiveMenu();
      });

      $('#menu-button-mobile', context).click(function () {
        openMenu();
        setActiveMenu();
      });

      // Closes main nav menu
      $('#close-button, #close-button-mobile', context).click(function () {
        closeMenu();
        backMenu();
      });

      // Opens sub-menu items with different behaviors for mobile and desktop
      $('.menu__sub-toggle > span, .menu__sub-toggle > button', context).click (function() {
        var w = window.matchMedia("(max-width: 1024px)");
        var $s = $(this).parent().siblings();
        var $p = $(this).parent();
        if ($(this).children().length == 0) {
          $($p).find('.menu__sub-items > a, .menu__sub-items > button').attr('tabindex', 0);
          $($s).find('.menu__sub-items a, .menu__sub-items button').attr('tabindex', -1);
          if(w.matches) {
            $s.addClass('hide@m');
            $p.addClass('mobile-active');
            $p.children('.menu--sub').removeClass('hide@m');
            $s.children('.menu--sub').addClass('hide@m');
            $s.removeClass('mobile-active');
            $('.menu__back').removeClass('hide@m');
          } else {
            $p.children('.menu--sub').addClass('fade');
            $s.children('.menu--sub').removeClass('fade');
            $s.removeClass('is-active');
            $p.addClass('is-active');
            $(".menu__bottom").css("max-height", "").removeClass("is-active");
            $(".menu__sub-items").children().removeClass('rotate');
            $(".menu__promo").removeClass('fade');
            $(".current").removeClass('current');
          }
        }
      });

      // Sliding bottom-level menu for main nav
      $('.menu__sub-items > span, .menu__sub-items > button', context).click(function(e) {
        var height = $(this).parent().children('.menu__bottom').prop('scrollHeight');
        var $menuBottom = $(this).parent().children('.menu__bottom');
        var $ps = $(this).parent().siblings();
        var $p = $(this).parent();

        $p.children().toggleClass('rotate');
        $menuBottom.toggleClass('is-active');
        if($menuBottom.hasClass('is-active')) {
          $menuBottom.css("max-height", height);
          $menuBottom.find("a").attr('tabindex', 0);
          $menuBottom.find(':first-child > a').focus();
        } else {
          $p.children('.menu__bottom').css("max-height", "");
          $menuBottom.find('.menu__bottom-items > a').attr('tabindex', -1);
        }

        $ps.children('.menu__bottom').removeClass('is-active').css("max-height", "");
        $ps.children().removeClass('rotate');
        $ps.find('.menu__bottom-items > a').attr('tabindex', -1);
        $ps.children().removeClass('current');
      });

      // Back button functionality for mobile menu
      $('.menu__back', context).click(function() {
        backMenu();
      });

      $('#share-button', context).on('keydown', function(e) {
        if (e.key === 'Tab') {
            if(e.shiftKey && $('div.menu--nav').hasClass("is-active")) {
              e.preventDefault();
              $('.menu__sub-toggle:last-child > button').focus();
            }
        }
      });

      // Share menu toggle
      $("#share-button", context).on ('click', function() {
        $(this).children().toggleClass('icon-active');
        $(".menu__share").toggleClass('fade');
        $(this).toggleClass('button--active');
        closeSearch();

        if ($(this).hasClass('button--active')) {
          $(".menu__share a").attr('tabindex', 0);
        } else {
          $(".menu__share a").attr('tabindex', -1);
        }
      });

      // Search bar toggle
      $("#search-button", context).on('click', function() {
        $(".menu__search").toggleClass('fade');
        $(this).children().toggleClass('icon-active');
        $(this).toggleClass('button--active');
        closeShare();
        if ($(this).children().hasClass('icon-active')) {
          $('.menu__search input, .menu__search button').attr('tabIndex', 0);
          $('.search-box').focus();
        } else {
          $('.search-box').blur();
        }
      });

      $(window, context).resize(Drupal.debounce(function() {
        if (window.matchMedia("(min-width: 425px)").matches){
          closeShare();
          closeSearch();
        }
        scrollMenu();
      }, 250));

      //Function to enable scroll for zoomed in screen
      function scrollMenu(){
        if (window.matchMedia("(max-width: 1024px)").matches){
            $('.menu--nav').css('overflow-y', 'auto');
        } else {
          $('.menu--nav').css('overflow-y', 'initial');
        }
      }

      //Function to Open Nav Menu
      function openMenu() {
        $(".menu--nav").addClass("is-active");
        $(".menu--image").addClass("is-active");
        $(".menu-button").addClass('hideim').removeClass('menu-end');
        //$(".menu-button").removeClass('menu-end');
        $('.close-button').removeClass('hideim').addClass('menu-end');
        //$('.close-button').addClass('menu-end');
        $('.menu-box').addClass('stick');
        $('.menu__search').addClass('stick');
        $('.menu__sub-items').addClass('remove-bg');
        setTimeout(function(){ $('.share-fade').addClass('share-show'); }, 400);
        $('.menu--main > li').each(function(i, e) {
          $(e).delay((i * 100) + 200).animate({
            'margin-left': 0,
            'opacity': 1
          }, 150);
        });
        $('html, body').addClass('lock');
        $('.menu__sub-toggle > button, .menu__sub-toggle > span > a').attr('tabIndex', 0);
        $('.menu__sub-toggle:first-child > button').focus();
      }

      function setActiveMenu() {
        if(location.pathname == '/') return;

        var url = $(location).attr('href');

        $('.menu__sub-items').each(function() {
          var href = $(this).children().attr('href');

          if(href == '/') {
            return;
          }

          if (~url.indexOf(href) ) {
            var $this = $(this);
            var $parentUpper = $this.parent().parent();
            var $parent = $this.parent();
            $parentUpper.addClass('current');
            $parent.addClass('current');
            $this.addClass('current');
            $parent.removeClass('hide@m');
            $('.menu__back').removeClass('hide@m');
            $parentUpper.siblings().addClass('hide@m');
            $('.menu__promo').removeClass('fade');
          }
        });

        $('.menu__sub-toggle').each(function() {
          var href = $(this).children().children().attr('href');

          if(href == '/') {
            return;
          }

          if (~url.indexOf(href) ) {
            var $this = $(this);
            $this.addClass('current');
            $('.menu__promo').removeClass('fade');
          }
        });

        $('.menu__bottom-items').each(function() {
          var href = $(this).children().attr('href');

          if(href == '/') {
            return;
          }

          if (~url.indexOf(href) ) {
            var $this = $(this);
            var $sibling = $this.parent().siblings('.arrow');
            var $parent = $this.parent();
            var $parentUpper = $this.parent().parent();
            var $parentUpper2 = $parentUpper.parent();
            var $parentUpper3 = $parentUpper2.parent();
            var height = $parent.prop('scrollHeight');
            $sibling.addClass('current');
            $parent.addClass('current').css('max-height', "2000px");
            $this.addClass('current');
            $parentUpper.addClass('current');
            $parentUpper2.addClass('current');
            $parentUpper3.addClass('current fade');
            $parentUpper2.removeClass('hide@m');
            $parentUpper3.siblings().addClass('hide@m');
            $('.menu__back').removeClass('hide@m');
            $('.menu__promo').removeClass('fade');
          }
        });
      }

      // Function to Close main nav menu and removes styling classes to reset menu
      function closeMenu() {
        $(".menu__promo").addClass('fade');
        $(".menu--nav").removeClass("is-active");
        $(".menu--image").removeClass("is-active");
        $(".menu--sub").removeClass("fade");
        $(".menu__sub-toggle").removeClass("is-active");
        $(".menu__bottom").css("max-height", "").removeClass("is-active");
        $(".arrow").removeClass('rotate');
        $(".menu__search").removeClass("menu-active");
        $(".menu__share").removeClass('menu-active');
        $(".menu-button").removeClass('hideim').addClass('menu-end');
        $('.close-button').addClass('hideim').removeClass('menu-end');
        $('.share-fade').removeClass('share-show');
        $('.logo-container').removeClass('hideim');
        $('.menu-box').removeClass('stick');
        $('.menu__search').removeClass('stick');
        $('.menu__sub-toggle button, .menu__sub-toggle a').attr('tabIndex', -1);
        setTimeout(function(){ $('.menu__sub-items').removeClass('remove-bg'); }, 400);
        $($('.menu--main > li').get().reverse()).each(function(i, e) {
          $(e).delay(i * 100).animate({
            'margin-left': '50px',
            'opacity': 0
          }, 250);
        });
        $('#menu-button').focus();
        $('#menu-button-mobile').focus();
        $('html, body').removeClass('lock');
      }

      function backMenu() {
        $(".menu--main > li").removeClass('hide@m');
        $(".menu--sub").addClass('hide@m');
        $(".menu__back").addClass('hide@m');
        $('.menu__bottom').removeClass('is-active').css("max-height", "");
        $('.arrow').removeClass('rotate');
        $('.menu__sub-toggle').removeClass('mobile-active');
        $('.arrow').attr('tabindex', '-1');
        $('.menu__bottom-items a').attr('tabindex', '-1');
      }

      // Close share menu and search bar when clicking outside of them
      $(document, context).mouseup(function(e) {
        var share = $(".menu__share");
        var search = $(".menu__search");
        var shareButton = $("#share-button");
        var searchButton = $("#search-button");

        if(!share.is(e.target) && share.has(e.target).length === 0 && !shareButton.is(e.target) && shareButton.has(e.target).length === 0) {
          closeShare();
        }
        if(!search.is(e.target) && search.has(e.target).length === 0 && !searchButton.is(e.target) && searchButton.has(e.target).length === 0) {
          closeSearch();
        }
      });

      // Close share menu
      function closeShare() {
        var share = $(".menu__share");
        var iconSocial = $(".icon-social");
        var shareButton = $("#share-button");

        share.removeClass('fade');
        shareButton.removeClass('button--active');
        iconSocial.removeClass('icon-active');
        $(".menu__share").children().each(function (i) { $(this).attr('tabindex', -1); });
      }

      // Close search bar
      function closeSearch() {
        var search = $(".menu__search");
        var iconSearch = $(".icon-search");
        var searchButton = $("#search-button");

        search.removeClass('fade');
        searchButton.removeClass('button--active');
        iconSearch.removeClass('icon-active');
        $('.menu__search input, .menu__search button').attr('tabIndex', -1);
        $('.search-box').blur();
      }

      $("#search-close", context).on('keydown', function(e) {
        if (e.keyCode === 9 ){
          e.preventDefault();
          $('input.search-box').focus();
        }
      });

      $("#search-close", context).on('click', function(e) {
        closeSearch();
        $('#search-button').focus();
      });

      $(".search-box", context).on('keydown', function(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey === true) {
            e.preventDefault();
            closeSearch();
            $('#search-button').focus();
          }
        }
      });

      $(".menu__share a:first-child", context).on('keydown', function(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey === true) {
            closeShare();
          }
        }
      });

      $(".menu__share a:last-child", context).on('keydown', function(e) {
        if (e.key === 'Tab') {
          closeShare();
        }
      });

      $("#close-button, #close-button-mobile", context).on('keydown', function(e) {
        if (e.key === 'Tab' ){
          e.preventDefault();
          if(!e.shiftKey) {$('.menu__sub-toggle:first-child > button').focus();}else{$('#search-button').focus();}
        }
      });

      $(".menu__sub-toggle:last-child > button", context).on('keydown', function(e) {
        if (e.key === 'Tab' ){
          if (!e.shiftKey) {
            e.preventDefault();
            if ($('div.menu--nav').hasClass("is-active")) {$('#share-button').focus();}
          }
        }
      });

      $(".menu__sub-items:last-child > a, .menu__sub-items:last-child > button", context).on('keydown', function(e) {
        if (e.key === 'Tab' && window.matchMedia("(max-width: 1024px)").matches){
          if (!e.shiftKey) {
            e.preventDefault();
            $('.menu__back').focus();
          }
        }
      });

      $(".menu__sub-items:last-child li.menu__bottom-items:last-child > a", context).on('keydown', function(e){
        if (e.key === 'Tab' && window.matchMedia("(max-width: 1024px)").matches){
          if (!e.shiftKey) {
            e.preventDefault();
            $('.menu__back').focus();
          }
        }
      });

      $("#search-button", context).on('keydown', function(e) {
        if ($('div.menu--nav').hasClass("is-active")) {
          if (e.key === 'Tab') {
            if(!e.shiftKey) {
              e.preventDefault();
              $('#close-button').focus();
              $('#close-button-mobile').focus();
            }
          }
        }
      });

      $(".search-box").on('focus', function(){
        $(this).val('');
      });

      /*Close menu, share menu, search bar if Esc key is pressed */
      $(document, context).keyup(function(e) {
        if (e.key === 'Escape') {
          if ($("div.menu__share").hasClass("fade")) {
            closeShare();
            $('#share-button').focus();
            return;
          }

          if ($("div.menu__search").hasClass("fade")) {
            closeSearch();
            $('#search-button').focus();
            return;
          }

          if ($("div.menu--nav").hasClass("is-active")) {
            closeMenu();
            backMenu();
            return;
          }
        }
      });

      window.addEventListener('hashchange',function(){
        closeMenu();
      });
    }

  };
} (Drupal, jQuery, this));
