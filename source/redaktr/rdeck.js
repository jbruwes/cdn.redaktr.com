(function($) {
  "use strict";
  $.fn.rdeck = function(options) {
    switch (options.action) {
      case 'render':
        return this.each(function() {
          var dataChildren = getChildren(options.index, options.hash, $(this), "*[string(@image)]"),
          //var dataChildren = $.rchildren({"that": $(this), "attr": "*[string(@image)]", "index": options.index, "hash": options.hash}),
            date = $(this).data("date"),
            description = $(this).data("description");
          if (dataChildren.length) {
            try {
              $(this).removeData('auto').removeAttr('data-auto').render(dataChildren, {
                'div.column': {
                  'i<-': {
                    'a.ui.button@href': 'i._href',
                    'img.ui.image@src': 'i.image',
                    //////////////////////
                    // Заголовок минимум
                    //////////////////////
                    '+span.ui': 'i._header',
                    'a.ui.header@href': 'i._href',
                    //'span.sub.header': 'i.description',
                    'span.sub.header': function(a) {
                      return description ? a.item.description : '';
                    },
                    //////////////////////
                    // Заголовок костыли
                    //////////////////////
                    'span.ui+': function(a) {
                      return date ? a.item._miniBasicDate : '';
                    },
                    'i.hvr-icon@style': 'vertical-align:top;padding-top:0.3em;',
                    'span.ui@class+': ' content',
                    //////////////////////
                    // Иконки
                    //////////////////////
                    'i.icon:not(.calendar)@class+': ' #{i._icon}'
                  }
                }
              });
            } catch (e) {
              console.log(e.message);
            }
          }
        });
        break;
      case 'lightSlider':
        return this.each(function() {
          var pager = $(this).data("pager"),
            controls = $(this).data("controls");
          try {
            $(this).lightSlider({
              item: 3,
              auto: true,
              loop: true,
              slideMargin: 0,
              pause: 6500,
              speed: 1000,
              pager: Boolean(pager),
              controls: Boolean(controls),
              onSliderLoad: function(el) {
                $(el).children('div').removeAttr('hidden');
              },
              responsive: [{
                  breakpoint: 992,
                  settings: {
                    item: 2
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    item: 1
                  }
                }
              ]
            });
          } catch (e) {
            console.log(e.message);
          }
        });
        break;
    }
  };
}($));