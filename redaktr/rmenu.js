(function($) {
  "use strict";
  /*requirejs.config({
    "waitSeconds": 0,
    "baseUrl": "//cdn.redaktr.com",
    "paths": {
      "jquery": "//cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min",
      "kendo.menu.min": "//kendo.cdn.telerik.com/2019.1.220/js/kendo.menu.min",
      "kendo.popup.min": "//kendo.cdn.telerik.com/2019.1.220/js/kendo.popup.min",
      "kendo.core.min": "//kendo.cdn.telerik.com/2019.1.220/js/kendo.core.min",
      "kendo.data.min": "//kendo.cdn.telerik.com/2019.1.220/js/kendo.data.min",
      "kendo.data.odata.min": "//kendo.cdn.telerik.com/2019.1.220/js/kendo.data.odata.min",
      "kendo.data.xml.min": "//kendo.cdn.telerik.com/2019.1.220/js/kendo.data.xml.min",
      "rhashchange": "redaktr/rhashchange.min"
    }
  });*/
  var deffereds = null,
    methods = {
      init: function(options) {
        var defaults = {
          onInit: function() {},
        };
        deffereds = [];
        return this.each(function() {
          var that = $(this),
            i = null,
            a = null,
            deffered = $.Deferred();
          deffereds.push(deffered);

          function rmenujson(e, a) {
            if (a && "object" === typeof a && !$.isArray(a)) {
              var t = {};
              for (var n in a) {
                if (Object.hasOwnProperty.call(a, n)) {
                  switch (n) {
                    case "value":
                      t.text = a[n];
                      break;
                    case "id":
                    case "visible":
                      t[n] = a[n];
                      break;
                    case "data":
                      t.items = a[n];
                      break;
                  }
                }
              }
              return t;
            }
            return a && "object" === typeof a && $.isArray(a) && !a.length ? void 0 : a;
          }

          function hideVisible(pIndex, pPath, pId) {
            if (pIndex) {
              var index = pIndex.length - 1,
                id = null,
                path = null;
              while (index >= 0) {
                if (pIndex[index].visible === undefined || pIndex[index].visible) {
                  id = pId + (pId ? ' ' : '') + pIndex[index].id.toString().replace(/\s/g, "_");
                  path = pPath + encodeURIComponent(pIndex[index].text.replace(/\s/g, "_"));
                  path = path + '/';
                  pIndex[index].attr = {};
                  pIndex[index].attr['data-path'] = pIndex[index].id === options.index[0].id ? "/" : path;
                  pIndex[index].attr['data-id'] = pIndex[index].id === options.index[0].id ? id.toString().replace(/\s/g, "_") : id;
                  if (pIndex[index].visible !== undefined) delete pIndex[index].visible;
                  if (pIndex[index].items) {
                    hideVisible(pIndex[index].items, path, id);
                    if (pIndex[index].items.length === 0) delete pIndex[index].items;
                  }
                } else pIndex.splice(index, 1);
                index -= 1;
              }
            }
          }
          //if (that.length && options.index[0].data && options.index[0].data.length) {
          if (that.length) {
            if (options.index[0].visible) {
              if (!options.index[0].data) options.index[0].data = [];
              options.index[0].data.unshift({
                id: options.index[0].id,
                value: options.index[0].value,
                visible: options.index[0].visible
              });
            }
            if (options.index[0].data && options.index[0].data.length) {
              i = $.parseJSON(JSON.stringify(options.index[0].data, rmenujson));
              hideVisible(i, '', '');
              a = $("<ul></ul>");
              that.css('overflow', 'visible');
              that.parent().css('overflow', 'visible');
              that.append(a);
              //require(['jquery', 'kendo.menu.min'], function($, kendo) {
                try {
                  a.kendoMenu({
                    scrollable: typeof that.data("scrollable") === "undefined" ? true : that.data("scrollable"),
                    animation: typeof that.data("animation") === "undefined" ? {} : (that.data("animation") === true ? {} : that.data("animation")),
                    closeOnClick: typeof that.data("close-on-click") === "undefined" ? true : that.data("close-on-click"),
                    direction: typeof that.data("direction") === "undefined" ? "default" : that.data("direction"),
                    hoverDelay: typeof that.data("hover-delay") === "undefined" ? 100 : that.data("hover-delay"),
                    openOnClick: typeof that.data("open-on-click") === "undefined" ? false : that.data("open-on-click"),
                    orientation: typeof that.data("orientation") === "undefined" ? "horizontal" : that.data("orientation"),
                    popupCollision: typeof that.data("popup-collision") === "" ? "horizontal" : that.data("popup-collision") === true ? "" : that.data("popup-collision"),
                    dataSource: i,

                    // пока нет параметра loadOnDemand: false, фиксируем версию на 2019.1.220

                    select: function(e) {
                      history.pushState(null, null, (window.location.origin + options.pathname + $(e.item).data('path').replace(/^\/$/, '')).replace(/\s/g, "_") + window.location.search);
                      //require(['jquery', 'rhashchange'], function($) {
                        $.rhashchange({
                          "index": options.index,
                          "pathname": options.pathname,
                          "xAmzMetaIdentity": options.xAmzMetaIdentity
                        });
                      //});
                    }
                  });
                } catch (e) {
                  console.log(e.message);
                }
                deffered.resolve();
              //});
            } else deffered.resolve();
          } else deffered.resolve();
        });
      },
      update: function(hash) {
        $.when.apply($, deffereds).then(function() {
          $(".k-item").removeClass("k-state-selected");
          $('.k-item[data-path="' + encodeURI(hash.replace(/\s/g, "_")) + '/"]').each(function() {
            $.each($(this).data("id").toString().split(' '), function(index, value) {
              $('.k-item[data-id$="' + value + '"]').addClass("k-state-selected");
            });
          });
        });
      }
    };
  $.fn.rmenu = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Метод с именем ' + method + ' не существует для jQuery.rmenu');
    }
  };
}($));