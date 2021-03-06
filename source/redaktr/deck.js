import { getChildren } from "./children.js";
/**
 * Колода - карточки в ряд с горизонтальной прокруткой
 * @param {Object.<Deferred>} scripts Объект с промисами подгружаемых скриптов
 * @param {Object} index Структура сайта
 * @param {string} pathname Путь до корня сайта
 * @param {string} xAmzMetaIdentity AWS Website Id
 * @param {string} hash Строка пути относительно корня сайта
 * @param {string} sel Dom путь
 */
export function deck(scripts, index, pathname, xAmzMetaIdentity, hash, sel) {
    /**
     * Рендер каждой карточки по шаблону
     */
    function eachDeck() {
        /**
         * Массив дочерних объектов
         * @const {Object[]}
         */
        const dataChildren = getChildren(index, hash, $(this).data("deep"), $(this).data("length"), $(this).data("reveal"), $(this).data("random"), $(this).data("path"), "*[string(@image)]");
        /**
         * Флаг простановки даты
         * @const {(number | boolean)}
         */
        const date = $(this).data("date");
        /**
         * Флаг простановки описания
         * @const {(number | boolean)}
         */
        const description = $(this).data("description");
        /**
         * Подстановка описания в шаблон в зависимости от флага
         * @param {Object} Текущий объект требующий обшаблонивания
         */
        function spanSubHeader(a) {
            return description ? a.item.description : '';
        }
        /**
         * Подстановка даты в шаблон в зависимости от флага
         * @param {Object} Текущий объект требующий обшаблонивания
         */
        function spanUi(a) {
            return date ? a.item._miniBasicDate : '';
        }
        if (dataChildren.length) {
            try {
                $(this).removeData('auto').removeAttr('data-auto').render(dataChildren, {
                    'div.column': {
                        'i<-': {
                            'a.ui.button@href': 'i._href',
                            'img.ui.image@src': 'i.image',
                            // Заголовок минимум
                            '+span.ui': 'i._header',
                            'a.ui.header@href': 'i._href',
                            'span.sub.header': spanSubHeader,
                            // Заголовок костыли
                            'span.ui+': spanUi,
                            'i.hvr-icon@style': 'vertical-align:top;padding-top:0.3em;',
                            'span.ui@class+': ' content',
                            // Иконки
                            'i.icon:not(.calendar)@class+': ' #{i._icon}'
                        }
                    }
                });
            } catch (e) {
                console.log(e.message);
            }
        }
    }
    /**
     * Инициализация слайдера для каждого подходящего объекта
     */
    function eachLightslider() {
        /**
         * Флаг указывающий на использования точек для переключения между слайдами
         * @const {(number | boolean)}
         */
        const pager = $(this).data("pager");
        /**
         * Флаг указывающий на наличие кнопок вперед/назад
         * @const {(number | boolean)}
         */
        const controls = $(this).data("controls");
        /**
         * Показываем объект после загрузки слайдера
         * @param {Object} el Объект на который загружен слайдер
         */
        function onSliderLoad(el) {
            $(el).children('div').removeAttr('hidden');
        }
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
                onSliderLoad: onSliderLoad,
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
    }
    /**
     * Перебор объектов после загрузки скрипта слайдера
     */
    function doneLightslider() {
        $(sel + ' [data-id=deck]:not([contenteditable])').attr('contenteditable', 'false').each(eachLightslider);
    }
    /**
     * Перебор объектов для включения диммера после загрузки скрипта семантики
     */
    function doneSemantic() {
        $(sel + ' [data-id=deck] div.image:not([contenteditable])').attr('contenteditable', 'false').dimmer({
            transition: 'fade up',
            on: 'hover'
        });
    }
    $(sel + ' [data-id=deck][data-auto]').each(eachDeck);
    $(sel + ' [data-id=deck]').rcorrector({
        "index": index,
        "pathname": pathname,
        "xAmzMetaIdentity": xAmzMetaIdentity,
        "hash": hash
    });
    $.when(scripts.lightslider).done(doneLightslider);
    $.when(scripts.semantic).done(doneSemantic);
}