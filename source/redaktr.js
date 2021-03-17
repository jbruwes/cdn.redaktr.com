window.$ = $;
window.jQuery = jQuery;
import "./redaktr/rsidebar.js";
import "./redaktr/rmenu.js";
import "./redaktr/rlightcase.js";
import "./redaktr/rcont.js";
import "./redaktr/rhashchange.js";
import "./redaktr/rcorrector.js";
import "./redaktr/rhashcalc.js";
import { getChildren } from "./redaktr/children.js";
import { deck } from "./redaktr/deck.js";
/**
 * Объект c подгруженными пресетами для патиклов
 * @const {Object}
 */
const particles = {
  "default": require('./particles/default.json'),
  "bubble": require('./particles/bubble.json'),
  "nasa": require('./particles/nasa.json'),
  "snow": require('./particles/snow.json')
};
/**
 * Уникальная строка для обхода кеширования
 * @const {string}
 */
const search = window.location.hostname === "www.redaktr.com" ? "?" + window.btoa(Math.random()) : window.location.search.charAt(0) + window.btoa(unescape(encodeURIComponent(window.location.search)));
/**
 * Путь до корня сайта
 * @const {string}
 */
const pathname = window.location.hostname === "redaktr.com" || window.location.hostname === "m.redaktr.com" ? "/" + window.location.pathname.split("/")[1] + "/" : "/";
/**
 * Объект с промисами подгружаемых скриптов
 * @const {Object.<Deferred>}
 */
const scripts = {
  "kendo": $.getScript("https://kendo.cdn.telerik.com/2019.1.220/js/kendo.ui.core.min.js"),
  "lightcase": $.getScript('https://cdnjs.cloudflare.com/ajax/libs/lightcase/2.5.0/js/lightcase.min.js'),
  "lightslider": $.getScript('https://cdnjs.cloudflare.com/ajax/libs/lightslider/1.1.6/js/lightslider.min.js'),
  "semantic": $.getScript('https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.7/semantic.min.js'),
  "pure": $.getScript('https://cdnjs.cloudflare.com/ajax/libs/pure.js/2.83/pure.min.js'),
  "indexJs": $.Deferred(),
  "indexJson": $.Deferred(),
  "indexCdnJson": $.Deferred()
};
/**
 * AWS Website Id
 * @const {string}
 */
const xAmzMetaIdentity = encodeURIComponent($("base").attr("href").match(/[^\/]+(?=\/$|$)/));
/**
 * Структура вебсайта
 * @type {Object}
 */
var index = {};
/**
 * Массив промисов пользовательских подгружаемых скриптов
 * @type {Deferred[]}
 */
var usrScripts = [];
/**
 * Запуск пользовательского кода из index.js
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
 */
function usrCode(hash, sel) {
  $.when(scripts.indexJs).done(function () {
    if (typeof redaktr !== 'undefined' && $.isFunction(redaktr)) $.when(scripts.indexCdnJson).done(function () {
      $.when.apply($, $.merge($.map(scripts, function (value) {
        return value;
      }), usrScripts)).done(function () {
        redaktr.call(index);
      })
    })
  })
}
/**
 * Запуск rmenu
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
 */
function rMenu(hash, sel) {
  var rmenu = $("[data-id=rmenu]");
  if (rmenu.length) $.when(scripts.kendo).done(function () {
    rmenu.not("[contenteditable]").attr('contenteditable', 'false').empty().rmenu({
      "index": index,
      "pathname": pathname,
      "xAmzMetaIdentity": xAmzMetaIdentity
    });
    rmenu.rmenu("update", hash);
  })
}
/**
 * Запуск accordition
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
 */
function rAccordion(hash, sel) {
  $.when(scripts.semantic).done(function () {
    $(sel + ' .ui.accordion').accordion();
  });
}
/**
 * Запуск carousel
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
*/
function rCarousel(hash, sel) {
  $(sel + ' [data-id=carousel][data-auto]').each(function () {
    var dataChildren = getChildren(index, hash, $(this).data("deep"), $(this).data("length"), $(this).data("reveal"), $(this).data("random"), $(this).data("path"), "*[string(@image)]"),
    //var dataChildren = $.rchildren({"that": $(this), "attr": "*[string(@image)]", "index": index, "hash": hash}),
      date = $(this).data("date"),
      description = $(this).data("description");
    if (dataChildren.length) {
      try {
        $(this).removeData('auto').removeAttr('data-auto').render(dataChildren, {
          'div.segment': {
            'i<-': {
              '@style+': 'i._backgroundImage',
              //////////////////////
              // Заголовок минимум
              //////////////////////
              '+span.ui': 'i._header',
              'a.ui.header@href': 'i._href',
              //'span.sub.header': 'i.description',
              'span.sub.header': function (a) {
                return description ? a.item.description : '';
              },
              //////////////////////
              // Заголовок костыли
              //////////////////////
              'span.ui+': function (a) {
                return date ? a.item._date : '';
              },
              'a.ui.header@class+': ' massive inverted icon',
              //////////////////////
              // Иконки
              //////////////////////
              'i.icon:not(.calendar)@class+': ' #{i.icon}'
            }
          }
        });
      } catch (e) {
        console.log(e.message);
      }
    }
  });
  $(sel + ' [data-id=carousel]').rcorrector({
    "index": index,
    "pathname": pathname,
    "xAmzMetaIdentity": xAmzMetaIdentity,
    "hash": hash
  });
  $.when(scripts.lightslider).done(function () {
    $(sel + ' [data-id=carousel]:not([contenteditable])').attr('contenteditable', 'false').each(function () {
      var pager = $(this).data("pager"),
        controls = $(this).data("controls");
      try {
        $(this).lightSlider({
          item: 1,
          auto: true,
          loop: true,
          slideMargin: 0,
          pause: 6500,
          speed: 1000,
          pager: Boolean(pager),
          controls: (typeof controls === "undefined" || Boolean(controls)),
          onSliderLoad: function (el) {
            $(el).children('div').removeAttr('hidden');
          }
        });
      } catch (e) {
        console.log(e.message);
      }
    });
  });
}
/**
 * Запуск cardgrid
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
 */
function rCardgrid(hash, sel) {
  $(sel + ' [data-id=cardgrid][data-auto]').each(function () {
    var dataChildren = getChildren(index, hash, $(this).data("deep"), $(this).data("length"), $(this).data("reveal"), $(this).data("random"), $(this).data("path"), "*[string(@image)]"),
    //var dataChildren = $.rchildren({"that": $(this), "attr": "*[string(@image)]", "index": index, "hash": hash}),
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
              'span.sub.header': function (a) {
                return description ? a.item.description : '';
              },
              //////////////////////
              // Заголовок костыли
              //////////////////////
              'span.ui+': function (a) {
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
  $(sel + ' [data-id=cardgrid]').rcorrector({
    "index": index,
    "pathname": pathname,
    "xAmzMetaIdentity": xAmzMetaIdentity,
    "hash": hash
  });
  $.when(scripts.semantic).done(function () {
    $(sel + ' [data-id=cardgrid] div.image:not([contenteditable])').attr('contenteditable', 'false').dimmer({
      transition: 'fade up',
      on: 'hover'
    });
  });
}
/**
 * Запуск particles 
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
 */
function rParticles(hash, sel) {
  $(sel + ' [data-id=particles][data-auto]').each(function () {
    var dataChildren = getChildren(index, hash, $(this).data("deep"), $(this).data("length"), $(this).data("reveal"), $(this).data("random"), $(this).data("path")),
    //var dataChildren = $.rchildren({"that": $(this), "index": index, "hash": hash}),

      date = $(this).data("date"),
      description = $(this).data("description"),
      unlink = $(this).data("path");
    if (dataChildren.length) {
      try {
        $(this).removeData('auto').removeAttr('data-auto').render(dataChildren[0], {
          '@style+': '_backgroundImage',
          //////////////////////
          // Заголовок минимум
          //////////////////////
          '+span.ui': '_header',
          //'a.ui.header@href': '_href',
          'a.ui.header@href': function (a) {
            return unlink ? a.context._href : '';
          },
          //'span.sub.header': 'description',
          'span.sub.header': function (a) {
            return description ? a.context.description : '';
          },
          //////////////////////
          // Заголовок костыли
          //////////////////////
          'span.ui+': function (a) {
            return date ? a.context._date : '';
          },
          'a.ui.header@class+': ' massive inverted icon',
          //////////////////////
          // Иконки
          //////////////////////
          'i.icon:not(.calendar)@class+': ' #{icon}'
        });
      } catch (e) {
        console.log(e.message);
      }
    }
  });
  $(sel + ' [data-id=particles]').rcorrector({
    "index": index,
    "pathname": pathname,
    "xAmzMetaIdentity": xAmzMetaIdentity,
    "hash": hash
  });
  $(sel + '  [data-id=particles]:not([contenteditable])').attr('contenteditable', 'false').each(function () {
    try {
      //tsParticles.loadJSON(this.id, "//cdn.redaktr.com/particles/" + ($(this).data("particles") ? $(this).data("particles") : "default") + ".json");
      tsparticles.tsParticles.load(this.id, particles[($(this).data("particles") ? $(this).data("particles") : "default")]);
    } catch (e) {
      console.log(e.message);
    }
  });
}
/**
 * Запуск list
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
 */
function rList(hash, sel) {
  $(sel + ' [data-id=list][data-auto]').each(function () {
    var dataChildren = getChildren(index, hash, $(this).data("deep"), $(this).data("length"), $(this).data("reveal"), $(this).data("random"), $(this).data("path"), "*[string(@image)]"),
    //var dataChildren = $.rchildren({"that": $(this), "attr": "*[string(@image)]", "index": index, "hash": hash}),

      date = $(this).data("date"),
      description = $(this).data("description");
    if (dataChildren.length) {
      try {
        $(this).removeData('auto').removeAttr('data-auto').render(dataChildren, {
          'div.item': {
            'i<-': {
              'a.ui.button@href': 'i._href',
              'img.ui.image@src': 'i.image',
              //////////////////////
              // Заголовок минимум
              //////////////////////
              '+span.ui': 'i._header',
              'a.ui.header@href': 'i._href',
              //'span.sub.header': 'i.description',
              'span.sub.header': function (a) {
                return description ? a.item.description : '';
              },
              //////////////////////
              // Заголовок костыли
              //////////////////////
              'span.ui+': function (a) {
                return date ? a.item._miniBasicDate : '';
              },
              'i.hvr-icon@style': 'vertical-align:top;padding-top:0.3em;',
              'span.ui@class+': ' content',
              'div.content@data-aos': function () {
                return 'fade-left'
              },
              //////////////////////
              // Картинка костыли
              //////////////////////
              'div.ui.image@data-aos': function () {
                return 'fade-left'
              },
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
  $(sel + ' [data-id=list]').rcorrector({
    "index": index,
    "pathname": pathname,
    "xAmzMetaIdentity": xAmzMetaIdentity,
    "hash": hash
  });
  $.when(scripts.semantic).done(function () {
    $(sel + ' [data-id=list] div.image:not([contenteditable])').attr('contenteditable', 'false').dimmer({
      transition: 'fade up',
      on: 'hover'
    });
  });
}
/**
 * Запуск header
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
 */
function rHeader(hash, sel) {
  $(sel + ' [data-id=header][data-auto]').each(function () {
    var dataChildren = getChildren(index, hash, $(this).data("deep"), $(this).data("length"), $(this).data("reveal"), $(this).data("random"), $(this).data("path")),
    //var dataChildren = $.rchildren({"that": $(this), "index": index, "hash": hash}),

      date = $(this).data("date"),
      description = $(this).data("description"),
      unlink = $(this).data("path");
    if (dataChildren.length) {
      try {
        $(this).removeData('auto').removeAttr('data-auto').render(dataChildren[0], {
          //////////////////////
          // Заголовок минимум
          //////////////////////
          '+span.ui': '_header',
          'a.ui.header@href': function (a) {
            return unlink ? a.context._href : '';
          },
          //'span.sub.header': 'description',
          'span.sub.header': function (a) {
            return description ? a.context.description : '';
          },
          //////////////////////
          // Заголовок костыли
          //////////////////////
          'div.content+': function (a) {
            return date ? a.context._miniBasicDate : '';
          },
          'i.hvr-icon@style': 'vertical-align:top;padding-top:0.3em;',
          'span.ui@class+': ' content',
          'a.ui.header@class+': ' massive dividing fluid container',
          //////////////////////
          // Иконки
          //////////////////////
          'i.icon:not(.calendar)@class+': ' #{_icon}'
        });
      } catch (e) {
        console.log(e.message);
      }
    }
  });
  $(sel + ' [data-id=header]').rcorrector({
    "index": index,
    "pathname": pathname,
    "xAmzMetaIdentity": xAmzMetaIdentity,
    "hash": hash
  });
}
/**
 * Запуск сетки с иконками
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
 */
function rIcongrid(hash, sel) {
  $(sel + ' [data-id=icongrid][data-auto]').each(function () {
    var dataChildren = getChildren(index, hash, $(this).data("deep"), $(this).data("length"), $(this).data("reveal"), $(this).data("random"), $(this).data("path"), '*[string(@id)]'),
    //var dataChildren = $.rchildren({"that": $(this), "attr": "*[string(@id)]", "index": index, "hash": hash}),

      date = $(this).data("date"),
      description = $(this).data("description");
    if (dataChildren.length) {
      try {
        $(this).removeData('auto').removeAttr('data-auto').render(dataChildren, {
          'div.column': {
            'i<-': {
              //////////////////////
              // Заголовок минимум
              //////////////////////
              '+span.ui': 'i._header',
              'a.ui.header@href': 'i._href',
              //'span.sub.header': 'i.description',
              'span.sub.header': function (a) {
                return description ? a.item.description : '';
              },
              //////////////////////
              // Заголовок костыли
              //////////////////////
              'span.ui+': function (a) {
                return date ? a.item._miniBasicDate : '';
              },
              'a.ui.header@class+': ' icon',
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
  $(sel + ' [data-id=icongrid]').rcorrector({
    "index": index,
    "pathname": pathname,
    "xAmzMetaIdentity": xAmzMetaIdentity,
    "hash": hash
  });
}
/**
 *  Запуск breadcrumbs
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
 */
function rBreadcrumbs(hash, sel) {
  $(sel + ' [data-id=breadcrumbs][data-auto]').each(function () {
    var dataChildren = getChildren(index, hash, $(this).data("deep"), $(this).data("length"), $(this).data("reveal"), $(this).data("random"), $(this).data("path"), '*[string(@id)]', true),
    //var dataChildren = $.rchildren({"that": $(this), "attr": "*[string(@id)]", "ancestor": true, "index": index, "hash": hash})

      date = $(this).data("date"),
      description = $(this).data("description"),
      reveal = $(this).data("reveal");
    if (dataChildren.length) {
      try {
        $(this).removeData('auto').removeAttr('data-auto').render(dataChildren, {
          'a.step': {
            'i<-': {
              //////////////////////
              // Заголовок минимум
              //////////////////////                        
              '+span.ui:not(.header)': 'i._header',
              '.@href': function (a) {
                return a.items.length - 1 > a.pos && (reveal || a.item.visible) ? a.item._href : ''
              },
              'span.sub.header': function (a) {
                return description ? a.item.description : '';
              },
              //////////////////////
              // Иконки
              //////////////////////
              'i.icon:not(.calendar)@class+': ' #{i._icon}',
              //////////////////////
              // Последний шаг активный
              //////////////////////
              '.@class+': function (a) {
                return a.items.length - 1 > a.pos ? (reveal || a.item.visible ? '' : ' disabled') : ' active'
              }
            }
          }
        });
      } catch (e) {
        console.log(e.message);
      }
    }
  });
  $(sel + ' [data-id=breadcrumbs]').rcorrector({
    "index": index,
    "pathname": pathname,
    "xAmzMetaIdentity": xAmzMetaIdentity,
    "hash": hash
  });
}
/**
 * Запуск embed
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
 */
function rEmbed(hash, sel) {
  $.when(scripts.semantic).done(function () {
    $(sel + " .ui.embed:not([contenteditable])")
      .attr("contenteditable", "false")
      .embed();
  });
}
/**
 * Запуск sidebar
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
 */
function rSidebar(hash, sel) {
  var rsidebar = $("#content").data("turbomenu");
  if (typeof rsidebar === "undefined" || Boolean(rsidebar)) $.when(scripts.semantic).done(function () {
    $.rsidebar("update", hash);
  });
}
/**
 * Запуск AOS
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
 */
function rAos(hash, sel) {
  $("img").on("load", function () {
    AOS.refresh();
  });
  AOS.refresh();
}
/**
 * 
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
 */
function onhashchange(hash, sel) {
  /**
   * 
   */
  function runComponents() {
    rCarousel(hash, sel);
    deck(scripts, index, pathname, xAmzMetaIdentity, hash, sel);
    rCardgrid(hash, sel);
    rParticles(hash, sel);
    rList(hash, sel);
    rHeader(hash, sel);
    rIcongrid(hash, sel);
    rBreadcrumbs(hash, sel);
  }
  sel = sel || "#content";
  $.when(scripts.pure).done(runComponents);
  rAccordion(hash, sel);
  rEmbed(hash, sel);
  rSidebar(hash, sel);
  usrCode();
  rMenu(hash, sel);
  rAos(hash, sel);
  //console.log($(sel + ' [data-paroller-factor]:not([contenteditable])'));
  //$(sel + ' [data-paroller-factor]:not([contenteditable])').attr('contenteditable', 'false').paroller();
  //$('[data-paroller-factor]').paroller();
};
/**
 * 
 * @param {*} data 
 */
function defIndexCdnJsonDone(data) {
  usrScripts = $.map(data, function (val) {
    if(val.hasOwnProperty('url') && val.url) return $.getScript(val.url);
  });
}
/**
 * 
 * @param {*} data 
 */
function defIndexJsonDone(data) {
  index = data;
}
if (!window.location.origin) window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
$("<link>").appendTo("head").attr({ type: "text/css", rel: "stylesheet" }).attr("href", "index.cdn.css" + search);
$("<link>").appendTo("head").attr({ type: "text/css", rel: "stylesheet" }).attr("href", "index.css" + search);
$.ajaxSetup({ cache: true });
$.getScript("index.js" + search).done(scripts.indexJs.resolve).fail(function () {
  $.getScript("/" + xAmzMetaIdentity + ".js" + search).always(scripts.indexJs.resolve);
});
$.getJSON("index.json" + search, defIndexJsonDone).done(scripts.indexJson.resolve).fail(function () {
  $.getJSON("/" + xAmzMetaIdentity + ".json" + search, defIndexJsonDone).always(scripts.indexJson.resolve);
});
$.getJSON("index.cdn.json" + search, defIndexCdnJsonDone).done(scripts.indexCdnJson.resolve).fail(function () {
  $.getJSON("/" + xAmzMetaIdentity + ".cdn.json" + search, defIndexCdnJsonDone).always(scripts.indexCdnJson.resolve);
});
$(function () {
  $.when(scripts.lightcase).done(function () {
    $("body").rlightcase();
  });
  AOS.init();
  $.when(scripts.indexJson).done(function () {
    $.rhashchange.defaults.onhashchange = onhashchange;
    var rsidebar = $("#content").data("turbomenu");
    if (typeof rsidebar === "undefined" || Boolean(rsidebar)) $.when(scripts.semantic).done(function () {
      $("body>.ui.main.menu").removeAttr("hidden");
      $.rsidebar({
        "index": index,
        "pathname": pathname,
        "xAmzMetaIdentity": xAmzMetaIdentity
      });
    });
    $(window).on("popstate", function () {
      $.rhashchange({
        index: index,
        pathname: pathname,
        xAmzMetaIdentity: xAmzMetaIdentity,
      });
    });
    if (window.location !== window.parent.location)
      $(window).trigger("popstate");
    $.rhashchange.defaults.onhashchange(
      $.rhashcalc(pathname),
      "body>.pusher"
    );
    $("body>div.pusher").rcorrector({
      index: index,
      pathname: pathname,
      xAmzMetaIdentity: xAmzMetaIdentity,
      hash: $.rhashcalc(pathname),
    });
  });
});