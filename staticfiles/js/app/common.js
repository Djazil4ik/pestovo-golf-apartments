(function ($, window) {

    window.App = {
        Model: {},
        View: {},
        Collection: {}
    };

    var originalSync = Backbone.sync;
    Backbone.sync = function (method, model, options) {
        options.headers = options.headers || {};
        _.extend(options.headers, {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')});
        originalSync.call(model, method, model, options);
    };

    Vue.use(VueBackbone);

    Vue.component('modal', {
        template: '#modal-template',
        methods: {
            close: function() {
                this.$emit('close');
                $('body').removeClass('page_no-scroll');
            }
        },
        mounted: function () {
            $('body').addClass('page_no-scroll');
        }
    });

    Vue.component('lg-modal', {
        template: '#lg-modal-template',
        methods: {
            close: function() {
                this.$emit('close');
                $('body').removeClass('page_no-scroll');
            }
        },
        mounted: function () {
            $('body').addClass('page_no-scroll');
        }
    });

    window.hash = function (key) {
        var hash = {}, q;
        if (location.hash) {
            var arr = location.hash.slice(1).split('&');
            for (var i = 0; i < arr.length; i++) {
                if (q = arr[i].split('='))
                    hash[q[0]] = decodeURIComponent(q[1]) || null;
            }
        }
        return key
            ? hash.hasOwnProperty(key) ? hash[key] : null
            : hash;
    };

    window.parseBoolean = function(string) {
        if (string === null){
            return false;
        }
        var bool;
        bool = (function() {
            switch (false) {
                case string.toLowerCase() !== 'true':
                    return true;
                case string.toLowerCase() !== 'false':
                    return false;
            }
        })();
        if (typeof bool === "boolean") {
            return bool;
        }
        return void 0;
    };

    window.formatDate = function (date, lang) {
        if (lang === undefined){
            lang = 'en';
        }
        var months = {
            en: [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ],
            ru: [
                "Января", "Февраля", "Марта",
                "Апреля", "Мая", "Июня", "Июля",
                "Августа", "Сентября", "Октября",
                "Ноября", "Декабря"
            ]
        };
        var monthNames = months[lang];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }

})(jQuery, window);