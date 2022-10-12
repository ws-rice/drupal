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

  function assignTableData(context) {
    $(document, context).find('table').each(function(){
      let tableHeaders = $(this).find('thead th');
      let tableRows = $(this).find('tbody tr');
      let tableHeadersArr = $.makeArray(tableHeaders);
      let tableRowsArr = $.makeArray(tableRows);

      for (var i = 0; i < tableHeadersArr.length; i++) {
        tableHeadersArr[i].setAttribute('scope', 'col');
      }

      for (var i = 0; i < tableRowsArr.length; i++) {
        tableRowsArr[i].setAttribute('scope', 'row');

        var td = tableRowsArr[i].querySelectorAll('td');
        var tdCollection = Array.from(td);

        for (var j = 0; j < tdCollection.length; j++) {
          if (j === tableHeadersArr.length) {
            continue;
          }
          var headerLabel = tableHeadersArr[j].innerHTML;
          tdCollection[j].setAttribute('data-label', headerLabel);
        }
      }
      
    });
  }


  Drupal.behaviors.extras = {
    attach: function (context, settings) {
      accordionToggler(context);
      checkUserAgents(context);
      assignTableData(context);

      $(document, context).on("keydown","button.fancybox-button--arrow_right", function(e) {
        if (e.key === 'Tab' ){
          e.preventDefault();
          $('.fancybox-button--close').focus();
        }
      });
    }
  };
} (Drupal, jQuery));

