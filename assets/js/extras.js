(function (Drupal, $) {

  function accordionToggler(context) {
    $(document, context).find('.ckeditor-accordion-toggler').each(function(){
      $(this, context).attr('href','ckeditor-accordion-container');
    });
  }

  function checkUserAgents(context) {
    var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

    if(isSafari) {
      $(".menu__sub-items", context).addClass('safari');
    }
  }

  Drupal.behaviors.extras = {
    attach: function (context, settings) {
      accordionToggler(context);
      checkUserAgents(context);

      $(document, context).on("keydown","button.fancybox-button--arrow_right", function(e) {
        if (e.key === 'Tab' ){
          e.preventDefault();
          $('.fancybox-button--close').focus();
        }
      });
    }
  };
} (Drupal, jQuery));

