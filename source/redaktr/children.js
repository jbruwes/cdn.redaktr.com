/**
 * Получение массива дочерних объектов
 * @param {Object} index Структура сайта
 * @param {string} hash Строка пути относительно корня сайта
 * @param {(number | boolean)} deep Флаг использования рекурсии по дочерним объектам
 * @param {number} length Количество дочерних объектов для изъятия
 * @param {(number | boolean)} reveal Флаг указывающий показывать ли скрытые объекты
 * @param {(number | boolean)} random Флаг указывающий на необходимость перемешать результат
 * @param {string} path CSV путей до дочерних объектов
 * @param {string} [attr=""] Путь xpath
 * @param {boolean} [ancestor=false] Заведует включением параметра xpath - ancestor-or-self
 * @returns {Object[]} Массив дочерних объектов
 */
export function getChildren(index, hash, deep, length, reveal, random, path, attr, ancestor) {
    /**
     * Пути через запятую, по кторым ищутся дочерние элементы
     * @type {(string|string[])}
     */
    var dataHashes = $.trim(path);
    /**
     * @type {Array}
     */
    var dataChildren = [];
    /**
     * 
     * @param {*} value 
     * @param {*} key 
     * @returns 
     */
    function mapDataHash(value, key) {
        return decodeURIComponent($.trim(value))
            .replace(/\_/g, " ")
            .replace(/\%2f/g, "/")
            .replace(/\%2F/g, "/")
            .replace(/\/+/g, "/")
            .replace(/^\/+|\/+$/g, "");
    }
    /**
     * 
     * @param {*} key 
     * @param {*} dataHash 
     */
    function eachDataHash(key, dataHash) {
        /**
         * 
         * @param {*} value 
         * @param {*} key 
         * @returns 
         */
        function mapDataChildren(value, key) {
            /**
             * 
             */
            var localHash =
                deep || ancestor
                    ? calchash()
                    : dataHash
                        ? dataHash.replace(/\s/g, "_") + "/"
                        : "";
            /**
             * 
             * @returns 
             */
            function calchash() {
                /**
                 * 
                 */
                var curValue = value;
                /**
                 * 
                 */
                var localHash = [];
                while (curValue.$level > 2) {
                    curValue = jsel(index[0]).select(
                        "//*[@id='" + curValue.$parent + "']"
                    );
                    localHash.unshift(curValue.value.replace(/\s/g, "_"));
                }
                localHash = localHash.join("/");
                return localHash ? localHash + "/" : "";
            }
            value._href =
                "/" +
                localHash +
                ((attr || localHash) && value.$level > 1
                    ? value.value.replace(/\s/g, "_") + "/"
                    : "");
            value._header = value.title ? value.title : value.value;
            value._icon = value.icon ? value.icon : "linkify";
            value._backgroundImage = value.image
                ? "background-image:url(" + value.image + ");"
                : "";
            value._miniBasicDate =
                '<span class="ui mini basic label" style="margin:0"><i class="calendar alternate outline icon"></i>' +
                new Date(
                    value.date ? value.date : value.lastmod
                ).toLocaleDateString() +
                "</span>";
            value._date =
                '<span class="ui label"><i class="calendar alternate outline icon"></i>' +
                new Date(
                    value.date ? value.date : value.lastmod
                ).toLocaleDateString() +
                "</span>";
            return value;
        }
        try {
            $.merge(
                dataChildren,
                $.map(
                    jsel(index[0]).selectAll(
                        "/*" +
                        (dataHash
                            ? "/data/*[@value='" +
                            dataHash.split("/").join("']/data/*[@value='") +
                            "']"
                            : "") +
                        (attr && !ancestor ? "/data" : "") +
                        (deep && attr && !ancestor ? "/" : "") +
                        (attr ? "/" : "") +
                        (ancestor ? "ancestor-or-self::" : "") +
                        attr +
                        (attr && !ancestor && !reveal ? "[@visible=1]" : "")
                    ), mapDataChildren
                )
            );
        } catch (e) {
            console.log(e.message);
        }
    }
    /**
     * 
     * @returns 
     */
    function sortDataChildren() {
        return 0.5 - Math.random();
    }
    attr = attr ? attr : "";
    dataHashes = dataHashes ? dataHashes : hash;
    dataHashes = $.map(dataHashes.split(","), mapDataHash);
    $.each(dataHashes, eachDataHash);
    if (length && !isNaN(Number(length)) && length > 0 && length < dataChildren.length) dataChildren = dataChildren.slice(0, length);
    if (random) dataChildren.sort(sortDataChildren);
    return dataChildren;
}