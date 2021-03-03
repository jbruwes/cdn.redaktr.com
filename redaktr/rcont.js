(function($) {
  "use strict";
  $.fn.rcont = function(options) {
    var defaults = {
      onInit: function() {},
    };
    var settings = $.extend(true, {}, defaults, options || {});
    return this.each(function() {
      var that = $(this),
        splitHash = settings.hash.split("/"),
        child = settings.index[0].data,
        value = settings.index[0].value,
        id = null,
        i = null;

      function findId(indexInArray, valueOfElement) {
        if (valueOfElement.value === splitHash[i]) {
          id = valueOfElement.id;
          value = valueOfElement.value;
          child = valueOfElement.data;
          return false;
        }
      }
      if (settings.hash)
        for (i = 0; i < splitHash.length; i += 1) {
          id = null;
          $.each(child, findId);
          if (!id) break;
        } else id = settings.index[0].id;
      if (id) {
        that.load("/" + settings.xAmzMetaIdentity + '/' + encodeURIComponent(id) + ".htm" + (window.location.hostname === "www.redaktr.com" ? "?" + window.btoa(Math.random()) : window.location.search.charAt(0) + window.btoa(unescape(encodeURIComponent(window.location.search)))), function() {
          document.title = value;
          settings.onInit.call(that);
        });
      }
    });
  };
}($));