(function() {
  var search = window.location.hostname === "www.redaktr.com" ? "?" + window.btoa(Math.random()) : window.location.search.charAt(0) + window.btoa(unescape(encodeURIComponent(window.location.search))),
    pathname = (window.location.hostname === 'redaktr.com' || window.location.hostname === 'm.redaktr.com') ? '/' + window.location.pathname.split('/')[1] + '/' : '/';
  if (!window.location.origin) window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

  function complete() {
    $.ajaxSetup({
      cache: true
    });
    var scripts = {
        "kendo": $.getScript("https://kendo.cdn.telerik.com/2019.1.220/js/kendo.ui.core.min.js"),
        "lightcase": $.getScript('https://cdnjs.cloudflare.com/ajax/libs/lightcase/2.5.0/js/lightcase.min.js'),
        "lightslider": $.getScript('https://cdnjs.cloudflare.com/ajax/libs/lightslider/1.1.6/js/lightslider.min.js'),
        "semantic": $.getScript('https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.7/semantic.min.js'),
        "jsel": $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jsel/1.1.6/jsel.min.js'),
        "pure": $.getScript('https://cdnjs.cloudflare.com/ajax/libs/pure.js/2.83/pure.min.js'),
        "aos": $.getScript('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js'),
        "tsparticles": $.getScript('https://cdnjs.cloudflare.com/ajax/libs/tsparticles/1.18.12/tsparticles.min.js'),
        "rsidebar": $.getScript('https://cdn.redaktr.com/redaktr/rsidebar.min.js'),
        "rmenu": $.getScript('https://cdn.redaktr.com/redaktr/rmenu.min.js'),
        "rlightcase": $.getScript('https://cdn.redaktr.com/redaktr/rlightcase.min.js'),
        "rcont": $.getScript('https://cdn.redaktr.com/redaktr/rcont.min.js'),
        "rhashchange": $.getScript('https://cdn.redaktr.com/redaktr/rhashchange.min.js'),
        "rcorrector": $.getScript('https://cdn.redaktr.com/redaktr/rcorrector.min.js'),
        "rhashcalc": $.getScript('https://cdn.redaktr.com/redaktr/rhashcalc.min.js'),
        "rchildren": $.getScript('https://cdn.redaktr.com/redaktr/rchildren.min.js'),
        "rdeck": $.getScript('https://cdn.redaktr.com/redaktr/rdeck.min.js'),
        "indexJs": $.Deferred(),
        "indexJson": $.Deferred(),
        "indexCdnJson": $.Deferred()
      },
      xAmzMetaIdentity = encodeURIComponent($('base').attr('href').match(/[^\/]+(?=\/$|$)/)),
      index = {},
      defIndexJsonDone = function(data) {
        index = data;
      },
      usrScripts = [],
      defIndexCdnJsonDone = function(data) {
        usrScripts = $.map(data, function(val) {
          return $.getScript(val.url);
        });
      };
    $('<link>').appendTo('head').attr({
      type: 'text/css',
      rel: 'stylesheet'
    }).attr('href', "index.cdn.css" + search);
    $('<link>').appendTo('head').attr({
      type: 'text/css',
      rel: 'stylesheet'
    }).attr('href', "index.css" + search);
    $.getScript("index.js" + search).done(scripts.indexJs.resolve).fail(function() {
      $.getScript("/" + xAmzMetaIdentity + ".js" + search).always(scripts.indexJs.resolve);
    });
    $.getJSON("index.json" + search, defIndexJsonDone).done(scripts.indexJson.resolve).fail(function() {
      $.getJSON("/" + xAmzMetaIdentity + ".json" + search, defIndexJsonDone).always(scripts.indexJson.resolve);
    });
    $.getJSON("index.cdn.json" + search, defIndexCdnJsonDone).done(scripts.indexCdnJson.resolve).fail(function() {
      $.getJSON("/" + xAmzMetaIdentity + ".cdn.json" + search, defIndexCdnJsonDone).always(scripts.indexCdnJson.resolve);
    });
    $.when($.ready).done(function() {
      var rsidebar = $("#content").data("turbomenu");
      if (typeof rsidebar === "undefined" || Boolean(rsidebar)) $.when(scripts.semantic, scripts.rsidebar, scripts.indexJson).done(function() {
        $("body>.ui.main.menu").removeAttr("hidden");
        $.rsidebar({
          "index": index,
          "pathname": pathname,
          "xAmzMetaIdentity": xAmzMetaIdentity
        });
      });
    });
    $.when(scripts.lightcase, scripts.rlightcase, $.ready).done(function() {
      $('body').rlightcase();
    });
    $.when(scripts.jsel, scripts.rhashchange).done(function() {
      $.rhashchange.defaults.onhashchange = function(hash, sel) {
        sel = sel || "#content";
        /**
         * Получение массива дочерних объектов.
         * @param {Object} that - Указатель на текущий объект.
         * @param {string} [attr=""] - Путь xpath.
         * @param {boolean} [ancestor=false] - Заведует включением параметра xpath - ancestor-or-self.
         */
        function getChildren(that, attr, ancestor) {
          var dataHashes = $.trim(that.data("path")),
            dataChildren = [],
            deep = that.data("deep"),
            length = that.data("length"),
            reveal = that.data("reveal");
          attr = attr ? attr : "";
          dataHashes = dataHashes ? dataHashes : hash;
          dataHashes = $.map(dataHashes.split(","), function(value, key) {
            return decodeURIComponent($.trim(value)).replace(/\_/g, " ").replace(/\%2f/g, "/").replace(/\%2F/g, "/").replace(/\/+/g, "/").replace(/^\/+|\/+$/g, '')
          });
          $.each(dataHashes, function(key, dataHash) {
            try {
              //$.merge(dataChildren, $.map(jsel(index[0]).selectAll("/*" + (dataHash ? ("/data/*[@value='" + dataHash.split('/').join("']/data/*[@value='") + "']") : "") + (attr ? "/data" : "") + (deep && attr ? '/' : '') + (attr ? "/" : "") + attr), function(value, key) {
              $.merge(dataChildren, $.map(jsel(index[0]).selectAll("/*" + (dataHash ? ("/data/*[@value='" + dataHash.split('/').join("']/data/*[@value='") + "']") : "") + (attr && !ancestor ? "/data" : "") + (deep && attr && !ancestor ? '/' : '') + (attr ? "/" : "") + (ancestor ? 'ancestor-or-self::' : '') + attr + (attr && !ancestor && !reveal ? '[@visible=1]' : '')), function(value, key) {
                var calchash = function() {
                    var curValue = value,
                      localHash = [];
                    while (curValue.$level > 2) {
                      curValue = jsel(index[0]).select("//*[@id='" + curValue.$parent + "']");
                      localHash.unshift(curValue.value.replace(/\s/g, "_"));
                    }
                    localHash = localHash.join('/');
                    return (localHash ? localHash + '/' : '');
                  },
                  localHash = deep || ancestor ? calchash() : (dataHash ? dataHash.replace(/\s/g, "_") + '/' : '');
                value._href = '/' + localHash + ((attr || localHash) && value.$level > 1 ? (value.value.replace(/\s/g, "_") + '/') : '');
                value._header = value.title ? value.title : value.value;
                //value._htmlicon = value.icon ? '<i class="' + value.icon + ' icon hvr-icon"></i>' : '';
                value._icon = value.icon ? value.icon : 'linkify';
                value._backgroundImage = value.image ? "background-image:url(" + value.image + ");" : "";
                value._miniBasicDate = '<span class="ui mini basic label" style="margin:0"><i class="calendar alternate outline icon"></i>' + (new Date(value.date ? value.date : value.lastmod)).toLocaleDateString() + '</span>';
                value._date = '<span class="ui label"><i class="calendar alternate outline icon"></i>' + (new Date(value.date ? value.date : value.lastmod)).toLocaleDateString() + '</span>';
                return value;
              }));
            } catch (e) {
              console.log(e.message);
            }
          });
          if (length && !isNaN(Number(length)) && length > 0 && length < dataChildren.length) {
            dataChildren = dataChildren.slice(0, length);
          }
          if (that.data("random")) dataChildren.sort(function() {
            return 0.5 - Math.random()
          });
          return dataChildren;
        };
        /** Запуск пользовательского кода из index.js */
        function usrCode() {
          $.when(scripts.indexJs).done(function() {
            if (typeof redaktr !== 'undefined' && $.isFunction(redaktr)) $.when(scripts.indexCdnJson).done(function() {
              $.when.apply($, $.merge([$.ready], $.merge($.map(scripts, function(value) {
                return value;
              }), usrScripts))).done(function() {
                redaktr.call(index);
              })
            })
          })
        }
        /** Запуск rmenu */
        function rMenu() {
          $.when($.ready).done(function() {
            var rmenu = $("[data-id=rmenu]");
            if (rmenu.length) $.when(scripts.kendo, scripts.rmenu, scripts.indexJson).done(function() {
              rmenu.not("[contenteditable]").attr('contenteditable', 'false').empty().rmenu({
                "index": index,
                "pathname": pathname,
                "xAmzMetaIdentity": xAmzMetaIdentity
              });
              rmenu.rmenu("update", hash);
            })
          })
        }
        /** Запуск accordition */
        function rAccordion() {
          $.when($.ready, scripts.semantic).done(function() {
            $(sel + ' .ui.accordion').accordion();
          });
        }
        /** Запуск carousel*/
        function rCarousel() {
          $.when($.ready, scripts.pure, scripts.indexJson).done(function() {
            $(sel + ' [data-id=carousel][data-auto]').each(function() {
              var dataChildren = getChildren($(this), "*[string(@image)]"),
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
                        'span.sub.header': function(a) {
                          return description ? a.item.description : '';
                        },
                        //////////////////////
                        // Заголовок костыли
                        //////////////////////
                        'span.ui+': function(a) {
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
            $.when(scripts.rcorrector, scripts.rhashcalc, scripts.rhashchange).done(function() {
              $(sel + ' [data-id=carousel]').rcorrector({
                "index": index,
                "pathname": pathname,
                "xAmzMetaIdentity": xAmzMetaIdentity,
                "hash": hash
              });
            });
            $.when(scripts.lightslider).done(function() {
              $(sel + ' [data-id=carousel]:not([contenteditable])').attr('contenteditable', 'false').each(function() {
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
                    onSliderLoad: function(el) {
                      $(el).children('div').removeAttr('hidden');
                    }
                  });
                } catch (e) {
                  console.log(e.message);
                }
              });
            });
          });
        }
        /** Запуск deck */
        function rDeck() {
          $.when($.ready, scripts.pure, scripts.indexJson, scripts.rdeck).done(function() {
            $.when(scripts.rchildren).done(function() {
              $(sel + ' [data-id=deck][data-auto]').rdeck({
                "action": "render",
                "index": index,
                "hash": hash
              });
              $.when(scripts.rcorrector, scripts.rhashcalc, scripts.rhashchange).done(function() {
                $(sel + ' [data-id=deck]').rcorrector({
                  "index": index,
                  "pathname": pathname,
                  "xAmzMetaIdentity": xAmzMetaIdentity,
                  "hash": hash
                });
              });
            });
            $.when(scripts.lightslider).done(function() {
              $(sel + ' [data-id=deck]:not([contenteditable])').attr('contenteditable', 'false').rdeck({
                "action": "lightSlider"
              });
            });
            $.when(scripts.semantic).done(function() {
              $(sel + ' [data-id=deck] div.image:not([contenteditable])').attr('contenteditable', 'false').dimmer({
                transition: 'fade up',
                on: 'hover'
              });
            });
          });
        }
        /** Запуск cardgrid */
        function rCardgrid() {
          $.when($.ready, scripts.pure, scripts.indexJson).done(function() {
            $(sel + ' [data-id=cardgrid][data-auto]').each(function() {
              var dataChildren = getChildren($(this), "*[string(@image)]"),
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
            $.when(scripts.rcorrector, scripts.rhashcalc, scripts.rhashchange).done(function() {
              $(sel + ' [data-id=cardgrid]').rcorrector({
                "index": index,
                "pathname": pathname,
                "xAmzMetaIdentity": xAmzMetaIdentity,
                "hash": hash
              });
            });
            $.when(scripts.semantic).done(function() {
              $(sel + ' [data-id=cardgrid] div.image:not([contenteditable])').attr('contenteditable', 'false').dimmer({
                transition: 'fade up',
                on: 'hover'
              });
            });
          });
        }
        /** Запуск particles */
        function rParticles() {
          $.when($.ready, scripts.pure, scripts.indexJson).done(function() {
            $(sel + ' [data-id=particles][data-auto]').each(function() {
              var dataChildren = getChildren($(this)),
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
                    'a.ui.header@href': function(a) {
                      return unlink ? a.context._href : '';
                    },
                    //'span.sub.header': 'description',
                    'span.sub.header': function(a) {
                      return description ? a.context.description : '';
                    },
                    //////////////////////
                    // Заголовок костыли
                    //////////////////////
                    'span.ui+': function(a) {
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
            $.when(scripts.rcorrector, scripts.rhashcalc, scripts.rhashchange).done(function() {
              $(sel + ' [data-id=particles]').rcorrector({
                "index": index,
                "pathname": pathname,
                "xAmzMetaIdentity": xAmzMetaIdentity,
                "hash": hash
              });
            });
            $.when(scripts.tsparticles).done(function() {
              $(sel + '  [data-id=particles]:not([contenteditable])').attr('contenteditable', 'false').each(function() {
                try {
                  tsParticles.loadJSON(this.id, "//cdn.redaktr.com/particles/" + ($(this).data("particles") ? $(this).data("particles") : "default") + ".json");
                } catch (e) {
                  console.log(e.message);
                }
              });
            });
          });
        }
        /** Запуск list */
        function rList() {
          $.when($.ready, scripts.pure, scripts.indexJson).done(function() {
            $(sel + ' [data-id=list][data-auto]').each(function() {
              var dataChildren = getChildren($(this), "*[string(@image)]"),
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
                        'div.content@data-aos': function() {
                          return 'fade-left'
                        },
                        //////////////////////
                        // Картинка костыли
                        //////////////////////
                        'div.ui.image@data-aos': function() {
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
            $.when(scripts.rcorrector, scripts.rhashcalc, scripts.rhashchange).done(function() {
              $(sel + ' [data-id=list]').rcorrector({
                "index": index,
                "pathname": pathname,
                "xAmzMetaIdentity": xAmzMetaIdentity,
                "hash": hash
              });
            });
            $.when(scripts.semantic).done(function() {
              $(sel + ' [data-id=list] div.image:not([contenteditable])').attr('contenteditable', 'false').dimmer({
                transition: 'fade up',
                on: 'hover'
              });
            });
          });
        }
        /** Запуск header */
        function rHeader() {
          $.when($.ready, scripts.pure, scripts.indexJson).done(function() {
            $(sel + ' [data-id=header][data-auto]').each(function() {
              var dataChildren = getChildren($(this)),
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
                    'a.ui.header@href': function(a) {
                      return unlink ? a.context._href : '';
                    },
                    //'span.sub.header': 'description',
                    'span.sub.header': function(a) {
                      return description ? a.context.description : '';
                    },
                    //////////////////////
                    // Заголовок костыли
                    //////////////////////
                    'div.content+': function(a) {
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
            $.when(scripts.rcorrector, scripts.rhashcalc, scripts.rhashchange).done(function() {
              $(sel + ' [data-id=header]').rcorrector({
                "index": index,
                "pathname": pathname,
                "xAmzMetaIdentity": xAmzMetaIdentity,
                "hash": hash
              });
            });
          });
        }
        /** Запуск сетки с иконками */
        function rIcongrid() {
          $.when($.ready, scripts.pure, scripts.indexJson).done(function() {
            $(sel + ' [data-id=icongrid][data-auto]').each(function() {
              var dataChildren = getChildren($(this), '*[string(@id)]'),
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
                        'span.sub.header': function(a) {
                          return description ? a.item.description : '';
                        },
                        //////////////////////
                        // Заголовок костыли
                        //////////////////////
                        'span.ui+': function(a) {
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
            $.when(scripts.rcorrector, scripts.rhashcalc, scripts.rhashchange).done(function() {
              $(sel + ' [data-id=icongrid]').rcorrector({
                "index": index,
                "pathname": pathname,
                "xAmzMetaIdentity": xAmzMetaIdentity,
                "hash": hash
              });
            });
          });
        }
        /** Запуск breadcrumbs */
        function rBreadcrumbs() {
          $.when($.ready, scripts.pure, scripts.indexJson).done(function() {
            $(sel + ' [data-id=breadcrumbs][data-auto]').each(function() {
              var dataChildren = getChildren($(this), '*[string(@id)]', true),
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
                        '.@href': function(a) {
                          return a.items.length - 1 > a.pos && (reveal || a.item.visible) ? a.item._href : ''
                        },
                        'span.sub.header': function(a) {
                          return description ? a.item.description : '';
                        },
                        //////////////////////
                        // Иконки
                        //////////////////////
                        'i.icon:not(.calendar)@class+': ' #{i._icon}',
                        //////////////////////
                        // Последний шаг активный
                        //////////////////////
                        '.@class+': function(a) {
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
            $.when(scripts.rcorrector, scripts.rhashcalc, scripts.rhashchange).done(function() {
              $(sel + ' [data-id=breadcrumbs]').rcorrector({
                "index": index,
                "pathname": pathname,
                "xAmzMetaIdentity": xAmzMetaIdentity,
                "hash": hash
              });
            });
          });
        }
        /** Запуск embed */
        function rEmbed() {
          $.when(scripts.semantic, $.ready).done(function() {
            $(sel + ' .ui.embed:not([contenteditable])').attr('contenteditable', 'false').embed();
          });
        }
        /** Запуск sidebar */
        function rSidebar() {
          $.when($.ready).done(function() {
            var rsidebar = $("#content").data("turbomenu");
            if (typeof rsidebar === "undefined" || Boolean(rsidebar)) $.when(scripts.semantic, scripts.rsidebar, scripts.indexJson).done(function() {
              $.rsidebar("update", hash);
            });
          });
        }
        /** Запуск AOS*/
        function rAos() {
          $.when($.ready).done(function() {
            $("img").on('load', function() {
              $.when(scripts.aos).done(function() {
                AOS.refresh()
              });
            });
          });
          $.when(scripts.aos, $.ready).done(function() {
            AOS.refresh()
          });
        }

        rAccordion();
        rCarousel();
        rDeck();
        rCardgrid();
        rParticles();
        rList();
        rHeader();
        rIcongrid();
        rBreadcrumbs();
        rEmbed();
        rSidebar();
        usrCode();
        rMenu();
        rAos();

        //console.log($(sel + ' [data-paroller-factor]:not([contenteditable])'));
        //$(sel + ' [data-paroller-factor]:not([contenteditable])').attr('contenteditable', 'false').paroller();
        //$('[data-paroller-factor]').paroller();
      };
      $.when(scripts.indexJson, scripts.rcont, scripts.rhashcalc, scripts.rhashchange, $.ready).done(function() {
        $(window).on('popstate', function() {
          $.rhashchange({
            "index": index,
            "pathname": pathname,
            "xAmzMetaIdentity": xAmzMetaIdentity
          })
        });
        if (window.location !== window.parent.location) $(window).trigger('popstate');
        $.rhashchange.defaults.onhashchange($.rhashcalc(pathname), "body>.pusher");
      });
    });
    $.when(scripts.indexJson, scripts.rcorrector, scripts.rhashcalc, scripts.rhashchange, $.ready).done(function() {
      $('body>div.pusher').rcorrector({
        "index": index,
        "pathname": pathname,
        "xAmzMetaIdentity": xAmzMetaIdentity,
        "hash": $.rhashcalc(pathname)
      });
    });
    $.when(scripts.aos, $.ready).done(function() {
      AOS.init()
    });
  }
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js";
  var done = false;
  script.onload = script.onreadystatechange = function() {
    if (!done && (!this.readyState ||
        this.readyState == "loaded" || this.readyState == "complete")) {
      done = true;
      complete();
      script.onload = script.onreadystatechange = null;
      head.removeChild(script);
    }
  };
  head.appendChild(script);
})();