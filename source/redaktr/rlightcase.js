(function($) {
  "use strict";
  $.fn.rlightcase = function() {
    return this.each(function() {
      var that = $(this);
      $.expr[':'].regex = function(elem, index, match) {
        var matchParams = match[3].split(','),
          validLabels = /^(data|css):/,
          attr = {
            method: matchParams[0].match(validLabels) ? matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels, '')
          },
          regexFlags = 'ig',
          regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
        return regex.test(jQuery(elem)[attr.method](attr.property));
      };
      that.find("a:regex('href," +
        "(^data:image\\/.*,)|" +
        "(\\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\\?|#).*)?$)" +
        "')").each(function() {
        $(this).attr('href', encodeURI(decodeURI($(this).attr('href'))));
      }).data('rel', "lightcase:" + that.prop('nodeName')).attr('data-rel', "lightcase:" + that.prop('nodeName'));
      that.find("a:regex('href," +
        "((youtube\\.com|youtu\\.be|youtube-nocookie\\.com)\\/(watch\\?v=|v\\/|u\\/|embed\\/?)?(videoseries\\?list=(.*)|[\\w-]{11}|\\?listType=(.*)&list=(.*)).*)" +
        "')").data('rel', "lightcase").attr('data-rel', "lightcase");
      try {
        that.find('a[data-rel^=lightcase]').lightcase({
          maxWidth: 'auto',
          maxHeight: 'auto'
        });
      } catch (e) {
        console.log(e.message);
      }
    });
  };
}($));