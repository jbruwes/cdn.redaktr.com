(function($) {
  "use strict";
  $.extend($, {
    rhashchange: function(options) {
      var settings = $.extend({}, $.rhashchange.defaults, options);
      var hash = $.rhashcalc(settings.pathname);
      $('#content>main').rcont({
        "index": settings.index,
        "pathname": settings.pathname,
        "xAmzMetaIdentity": settings.xAmzMetaIdentity,
        "hash": hash,
        "onInit": function() {
          var that = this;
          that.rlightcase();
          $('#content>main').rcorrector({
            "index": settings.index,
            "pathname": settings.pathname,
            "xAmzMetaIdentity": settings.xAmzMetaIdentity,
            "hash": hash
          });
          settings.onhashchange(hash);
          if (!window.location.hash) $(window).scrollTop(0);
        }
      });
    }
  });
  $.rhashchange.defaults = {
    "onhashchange": function(hash, sel) {}
  };
}($));