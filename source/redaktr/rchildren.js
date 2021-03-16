(function ($) {
  "use strict";
  $.extend($, {
    /**
     * Получение массива дочерних объектов
     * @param {Object} options - The shape is the same as SpecialType above
     * @param {string} options.hash - Строка пути относительно корня сайта
     * @param {Object} options.that - Указатель на текущий объект
     * @param {string} [options.attr=""] - Путь xpath
     * @param {boolean} [options.ancestor=false] - Заведует включением параметра xpath - ancestor-or-self
     * @return {Object[]} - Массив дочерних объектов 
     */
    rchildren: function (options) {
      /**
       * Пути через запятую, по кторым ищутся дочерние элементы
       * @type {(string|string[])}
       */
      var dataHashes = $.trim(options.that.data("path"));
      /**
       * Возвращаемый массив дочерних объектов
       * @type {Object[]}
       */
      var dataChildren = [];
      /**
       * Флаг, указывающий что нужно искать все подобъекты
       * @const {(number|boolean)}
       */
      const deep = options.that.data("deep");
      /**
       * Флаг, указывающий сколько объектов следует извлекать
       * @const {number}
       */
      const length = options.that.data("length");
      /**
       * Флаг, указывающий нужно ли учитывать скрытые объекты
       * @const {(number|boolean)}
       */
      const reveal = options.that.data("reveal");
      options.attr = options.attr ? options.attr : "";
      dataHashes = dataHashes ? dataHashes : options.hash;
      dataHashes = $.map(dataHashes.split(","), function (value, key) {
        return decodeURIComponent($.trim(value)).replace(/\_/g, " ").replace(/\%2f/g, "/").replace(/\%2F/g, "/").replace(/\/+/g, "/").replace(/^\/+|\/+$/g, '')
      });
      $.each(dataHashes, function (key, dataHash) {
        try {
          //$.merge(dataChildren, $.map(jsel(options.index[0]).selectAll("/*" + (dataHash ? ("/data/*[@value='" + dataHash.split('/').join("']/data/*[@value='") + "']") : "") + (options.attr ? "/data" : "") + (deep && options.attr ? '/' : '') + (options.attr ? "/" : "") + options.attr), function(value, key) {
          $.merge(dataChildren, $.map(jsel(options.index[0]).selectAll("/*" + (dataHash ? ("/data/*[@value='" + dataHash.split('/').join("']/data/*[@value='") + "']") : "") + (options.attr && !options.ancestor ? "/data" : "") + (deep && options.attr && !options.ancestor ? '/' : '') + (options.attr ? "/" : "") + (options.ancestor ? 'ancestor-or-self::' : '') + options.attr + (options.attr && !options.ancestor && !reveal ? '[@visible=1]' : '')), function (value, key) {
            var calchash = function () {
              var curValue = value,
                localHash = [];
              while (curValue.$level > 2) {
                curValue = jsel(options.index[0]).select("//*[@id='" + curValue.$parent + "']");
                localHash.unshift(curValue.value.replace(/\s/g, "_"));
              }
              localHash = localHash.join('/');
              return (localHash ? localHash + '/' : '');
            },
              localHash = deep || options.ancestor ? calchash() : (dataHash ? dataHash.replace(/\s/g, "_") + '/' : '');
            value._href = '/' + localHash + ((options.attr || localHash) && value.$level > 1 ? (value.value.replace(/\s/g, "_") + '/') : '');
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
      if (options.that.data("random")) dataChildren.sort(function () {
        return 0.5 - Math.random()
      });
      return dataChildren;
    }
  });
}($));