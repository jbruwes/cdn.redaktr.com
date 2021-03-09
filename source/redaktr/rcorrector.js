(function($) {
  "use strict";
  $.fn.rcorrector = function(options) {
    return this.each(function() {
      var that = $(this),
        a = $("<a>", {
          href: $('base').attr('href')
        })[0];
      $.expr[':'].regex = function(elem, index, match) {
        var matchParams = match[3].split(','),
          validLabels = /^(data|css):/,
          attr = {
            method: matchParams[0].match(validLabels) ? matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels, '')
          },
          regexFlags = 'ig',
          regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
        return regex.test($(elem)[attr.method](attr.property));
      };
      that.find(":not([id|='lightcase']) a:not(a:regex('href,(^\\/\\/)|(:\\/\\/)|(^javascript:)|(^tel:)|(^mailto:)|(^data:image\\/.*,)|(\\.\\w+((\\?|#).*)?$)'))").each(function() {
        if (this.href && this.href !== window.location.origin) {
          var regexp = new RegExp('^' + a.href),
            href = this.href.replace(regexp, '').replace(new RegExp('^' + window.location.origin + '/'), '').split("#");
          this.href = window.location.origin +
            (regexp.test(this.href) ? window.location.pathname : options.pathname) +
            href[0] +
            window.location.search +
            (href[1] ? '#' + href[1] : '');
        }
      });
      that.find("a:not([class|='lightcase']):not(a[target=_blank]):not(a:regex('href,(^mailto\\:)|(^tel\\:)|(^data:image\\/.*,)|(\\.\\w+((\\?|#).*)?$)'))").each(function() {
        if ($(this).attr('href')) this.addEventListener("click", function(e) {
          var href = $(e.target).attr('href');
          href = href ? href : $(e.target).parents('a[href]').attr('href');
          var a = $('<a>', {
            href: href
          });
          a.prop('search', window.location.search);
          if (!a.prop('hash')) {
            history.pushState(null, null, a.prop('href').replace(/\s/g, "_"));
            $.rhashchange({
              "index": options.index,
              "pathname": options.pathname,
              "xAmzMetaIdentity": options.xAmzMetaIdentity
            });
            e.preventDefault();
          }
        });
      });
    });
  };
}($));