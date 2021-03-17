/**
* Получение массива дочерних объектов.
* @param {Object} index - Структура сайта
* @param {string} hash - Строка пути относительно корня сайта
* @param {Object} that - Указатель на текущий объект
* @param {string} [attr=""] - Путь xpath
* @param {boolean} [ancestor=false] - Заведует включением параметра xpath - ancestor-or-self
* @return {Array}
*/
function getChildren(index, hash, that, attr, ancestor) {
    /**
     * Пути через запятую, по кторым ищутся дочерние элементы
     * @type {(string|string[])}
     */
    var dataHashes = $.trim(that.data("path"));
    /**
     * @type {Array}
     */
    var dataChildren = [];
    var deep = that.data("deep");
    var length = that.data("length");
    var reveal = that.data("reveal");
    attr = attr ? attr : "";
    dataHashes = dataHashes ? dataHashes : hash;
    dataHashes = $.map(dataHashes.split(","), function (value, key) {
        return decodeURIComponent($.trim(value))
            .replace(/\_/g, " ")
            .replace(/\%2f/g, "/")
            .replace(/\%2F/g, "/")
            .replace(/\/+/g, "/")
            .replace(/^\/+|\/+$/g, "");
    });
    $.each(dataHashes, function (key, dataHash) {
        try {
            //$.merge(dataChildren, $.map(jsel(index[0]).selectAll("/*" + (dataHash ? ("/data/*[@value='" + dataHash.split('/').join("']/data/*[@value='") + "']") : "") + (attr ? "/data" : "") + (deep && attr ? '/' : '') + (attr ? "/" : "") + attr), function(value, key) {
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
                    ),
                    function (value, key) {
                        var calchash = function () {
                            var curValue = value,
                                localHash = [];
                            while (curValue.$level > 2) {
                                curValue = jsel(index[0]).select(
                                    "//*[@id='" + curValue.$parent + "']"
                                );
                                localHash.unshift(curValue.value.replace(/\s/g, "_"));
                            }
                            localHash = localHash.join("/");
                            return localHash ? localHash + "/" : "";
                        },
                            localHash =
                                deep || ancestor
                                    ? calchash()
                                    : dataHash
                                        ? dataHash.replace(/\s/g, "_") + "/"
                                        : "";
                        value._href =
                            "/" +
                            localHash +
                            ((attr || localHash) && value.$level > 1
                                ? value.value.replace(/\s/g, "_") + "/"
                                : "");
                        value._header = value.title ? value.title : value.value;
                        //value._htmlicon = value.icon ? '<i class="' + value.icon + ' icon hvr-icon"></i>' : '';
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
                )
            );
        } catch (e) {
            console.log(e.message);
        }
    });
    if (
        length &&
        !isNaN(Number(length)) &&
        length > 0 &&
        length < dataChildren.length
    ) {
        dataChildren = dataChildren.slice(0, length);
    }
    if (that.data("random"))
        dataChildren.sort(function () {
            return 0.5 - Math.random();
        });
    return dataChildren;
}