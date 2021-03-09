(function($) {
  "use strict";
  var timerId = null,
    deffered = null,
    methods = {
      init: function(options) {
        deffered = $.Deferred();

        function ddInit(index, phref, pid) {
          if (index.data && index.data.length) {
            var empty = true;
            $.each(index.data, function(i, val) {
              if (val.visible) empty = false;
              return empty;
            });
            if (!empty) {
              var item = $('<div>', {
                  "class": "item",
                  "data-id": pid
                }),
                title = $('<a>', {
                  "class": "title",
                  "html": '<i class="dropdown icon"></i><i class="folder open outline icon"></i>' + index.value
                }),
                content = $('<div>', {
                  "class": "content"
                }),
                fields = $('<div>', {
                  "class": "grouped fields"
                }),
                form = $('<div>', {
                  "class": "ui form"
                }),
                field = null,
                checkbox = null,
                href = null,
                id = null;
              $('body>.ui.sidebar').append(item);
              item.append(title);
              item.append(content);
              content.append(form);
              form.append(fields);
              $.each(index.data, function(i, val) {
                if (val.visible) {
                  href = phref + val.value + "/";
                  id = pid + " " + val.id.toString().replace(/\s/g, "_");
                  field = $('<div>', {
                    "class": "field"
                  });
                  empty = true;
                  if (val.data) $.each(val.data, function(i, v) {
                    if (v.visible) empty = false;
                    return empty;
                  });
                  checkbox = $('<div>', {
                    "class": "ui slider checkbox",
                    "html": '<input type="radio" name="' + index.value + '"><label><span><i class="' + (!empty ? 'folder outline' : 'file alternate outline') + ' icon"></i>' + val.value + '</span></label>',
                    "data-href": href,
                    "data-id": id
                  });
                  field.append(checkbox);
                  fields.append(field);
                  ddInit(val, href, id);
                }
              });
            }
          }
        }

        function sidebarVisibility(fade, timeout) {
          if ($("body>.ui.sidebar").sidebar("is hidden")) {
            clearTimeout(timerId);
            if (timeout) timerId = setTimeout(function() {
              $("body>.ui.main.menu").stop(true, true).fadeTo("fast", 0);
            }, timeout);
            $("body>.ui.main.menu").stop(true, true).fadeTo("fast", fade);
          }
        }

        function click(e) {
          var href = "";
          if (e) {
            if (!$(e.target).hasClass("item") && !$(e.target).hasClass("home")) href = $(e.target).parentsUntil('.ui.slider.checkbox').parent().data('href');
            $('body>.ui.sidebar').sidebar('hide');
          } else href = $(this).parent().data('href');
          history.pushState(null, null, (window.location.origin + options.pathname + href.replace(/^\/$/, '')).replace(/\s/g, "_") + window.location.search);
          //require(['jquery', 'rhashchange'], function($) {
          $.rhashchange({
            "index": options.index,
            "pathname": options.pathname,
            "xAmzMetaIdentity": options.xAmzMetaIdentity
          });
          //});
          return false;
        }
        //if (!$("body>.ui.main.menu").length) $("body").prepend('<div class="ui main menu fixed"><div class="ui container"><a class="launch icon item"><i class="content icon"></i></a></div></div>');
        //if (!$("body>.ui.sidebar.menu").length) $("body").prepend('<div class="ui sidebar vertical accordion menu"></div>');
        $('body>.ui.sidebar').sidebar('setting', {
          //transition: 'scale down',
          exclusive: true,
          scrollLock: true,
          returnScroll: true,
          onVisible: function() {
            $(window).off("scroll")
          },
          onHidden: function() {
            $(window).scroll(function() {
              sidebarVisibility(1, 1800)
            });
          }
        });
        if (options.index[0].visible) {
          $('body>.ui.sidebar').append($('<a>', {
            "class": "item",
            "data-href": "",
            "html": '<i class="home icon"></i>' + options.index[0].value
          }));
          $('body>.ui.sidebar.menu a.item').on('click', click);
        }
        ddInit(options.index[0], "", options.index[0].id.toString().replace(/\s/g, "_"));
        $('.ui.checkbox').checkbox({
          "onChecked": click
        });
        $(".ui.checkbox span").on('click', click);
        $('body>.ui.sidebar.accordion').accordion();
        //require(["jquery", "rhashcalc"], function($) {
        //	$.rsidebar("update", $.rhashcalc(options.pathname));
        //});
        $("body>.ui.main.menu").mouseenter(function() {
          sidebarVisibility(1)
        });
        $("body>.ui.main.menu").mouseleave(function() {
          sidebarVisibility(0)
        });
        $(window).scroll(function() {
          sidebarVisibility(1, 1800)
        });
        $("body>.ui.main.menu .launch").on("click", function() {
          sidebarVisibility(0);
          $('body>.ui.sidebar').sidebar('show');
        });
        sidebarVisibility(1, 1800);
        deffered.resolve();
        //});
      },
      update: function(hash) {
        $.when(deffered).then(function() {
          $("body>.ui.sidebar .ui.checkbox").checkbox("set unchecked");
          if (hash) {
            $('body>.ui.sidebar .ui.checkbox[data-href="' + hash + '/"]').each(function() {
              $("body>.ui.main.menu>.header.item").html($(this).text());
              var id = $(this).data("id").toString().split(' '),
                sel = $('body>.ui.sidebar .item[data-id$="' + id[id.length - 1] + '"]').index("body>.ui.sidebar .item[data-id]");
              if (sel < 0) sel = $('body>.ui.sidebar .item[data-id$="' + id[id.length - 2] + '"]').index("body>.ui.sidebar .item[data-id]");
              $("body>.ui.sidebar .item[data-id]").attr("hidden", true);
              $.each(id, function(index, value) {
                $('body>.ui.sidebar .ui.checkbox[data-id$="' + value + '"]').checkbox("set checked");
                $('body>.ui.sidebar .item[data-id$="' + value + '"]').attr("hidden", false);
              });
              $('body>.ui.sidebar.accordion').accordion("open", sel);
            });
          } else {
            var first = $("body>.ui.sidebar>div.item:first>.title");
            first = first.length ? first : $("body>.ui.sidebar>a.item");
            //$("body>.ui.main.menu>.header.item").html($("body>.ui.sidebar>div.item:first>.title").text());
            $("body>.ui.main.menu>.header.item").html(first.text());
            $('body>.ui.sidebar.accordion').accordion("open", 0);
            $("body>.ui.sidebar .item[data-id]").attr("hidden", true);
            $('body>.ui.sidebar .item[data-id]:first').attr("hidden", false);
          }
        });
      }
    };
  $.extend($, {
    rsidebar: function(method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method) {
        return methods.init.apply(this, arguments);
      } else {
        $.error('Метод с именем ' + method + ' не существует для jQuery.rsidebar');
      }
    }
  });
}($));