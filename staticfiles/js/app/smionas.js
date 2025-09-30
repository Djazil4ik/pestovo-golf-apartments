(function ($, window) {


    Vue.component('news-card', {
        props: ['id', 'url', 'image', 'title', 'date', 'description', 'single'],
        template: '#news-card'
    });

    Vue.component('news-single-card', {
        props: ['url', 'image', 'title', 'date', 'description', 'text', 'all'],
        template: '#news-single-card'
    });

    /**
     * Модель списка новостей
     */
    App.Model.Smionas = Backbone.Model.extend({
        defaults : {
            translated_en: null,
            is_draft: null,
            title: null,
            description: null,
            text: null,
            type: null,
            title_en: null,
            description_en: null,
            text_en: null,
            image: null,
            site_url: null,
            galleries_id: null,
            is_published: null,
            created_at: null,
            updated_at: null,
            thumbFilePath: null
        }
    });


    App.Collection.AllSmionas = Backbone.Collection.extend({
        model: App.Model.Smionas
    });

    var allSmionas = new App.Collection.AllSmionas();

    /**
     * Коллекция новостей
     */
    App.Collection.Smionas = Backbone.Collection.extend({
        model: App.Model.Smionas,
        baseUrl: '/smionas',
        initialize: function (props) {
            _.bindAll(this, 'parse', 'url', 'pageInfo', 'nextPage', 'previousPage');
            typeof(options) !== 'undefined' || (options = {});
            this.page = 1;
            typeof(this.perPage) !== 'undefined' || (this.perPage = 10);
        },
        fetch: function (options) {
            typeof(options) !== 'undefined' || (options = {});
            this.trigger("fetching");
            var self = this;
            var success = options.success;
            options.success = function (resp) {
                self.trigger("fetched");
                if (success) {
                    success(self, resp);
                }
            };
            if (options.language !== undefined) {
                this.instanceLanguage = options.language;
            }
            return Backbone.Collection.prototype.fetch.call(this, options);
        },
        parse: function (response) {
            if (response === undefined){
                return;
            }
            this.page = response.list.current_page;
            this.perPage = response.list.per_page;
            this.total = response.list.total;
            allSmionas.add(response.list.data);
            return response.list.data;
        },
        url: function () {
            var privatePath = $('#isPrivate').val() === '1' ? '/private' : '';
            return ((this.instanceLanguage === 'en') ? '/en' : '') + this.baseUrl + privatePath + '?' + $.param({page: this.page, per_page: this.perPage});
        },
        pageInfo: function () {
            var info = {
                total: this.total,
                page: this.page,
                perPage: this.perPage,
                pages: Math.ceil(this.total / this.perPage),
                prev: false,
                next: false
            };

            var max = Math.min(this.total, this.page * this.perPage);

            if (this.total === this.pages * this.perPage) {
                max = this.total;
            }

            info.range = [(this.page - 1) * this.perPage + 1, max];

            if (this.page > 1) {
                info.prev = this.page - 1;
            }

            if (this.page < info.pages) {
                info.next = this.page + 1;
            }

            return info;
        },
        nextPage: function (options) {
            if (!this.pageInfo().next) {
                return false;
            }
            this.page = this.page + 1;
            if (options === undefined) {
                options = {};
            }
            return this.fetch(options);
        },
        previousPage: function (options) {
            if (!this.pageInfo().prev) {
                return false;
            }
            this.page = this.page - 1;
            if (options === undefined) {
                options = {};
            }
            return this.fetch(options);
        }
    });


    var smionas = new App.Collection.Smionas({language: 'en'});

    /**
     * Представление списка новостей
     */
    App.View.Smionas = new Vue({
        el: "#news",

        bb: function () {
            return {
                smionas: smionas,
                allSmionas: allSmionas
            };
        },

        data: {
            language: null,
            smionasList: [],
            singleSmionas: null,
            filter:null,
            singleShowed: false
        },
        mounted: function () {
            this.language = this.$refs.language.dataset.value;
            var url = new URL(window.location);
            this.filter = url.searchParams.get("created_at");
            this.smionas.fetch({language: this.language, data: { created_at:  this.filter}});
        },
        updated: function () {

        },
        computed: {
            hasMoreSmionas: function () {
                var pageInfo = this.smionas.pageInfo({language: this.language});
                return !(pageInfo.total <= Math.ceil(pageInfo.page * pageInfo.perPage));
            }
        },
        methods: {
            loadMore: function () {
                this.smionas.nextPage({language: this.language, data: { created_at:  this.filter}, success: this.appendCard});
            },
            appendCard: function () {
                var self = this;
                this.smionas.each(function (model) {
                    self.smionasList.push({
                        id: model.get('id'),
                        url: model.get('site_url'),
                        image: model.get('thumbFilePath'),
                        title: (self.language === 'ru') ? model.get('title') : model.get('title_en'),
                        date: formatDate(new Date(model.get('created_at').replace(/\s/, 'T')), self.language),
                        description: (self.language === 'ru') ? model.get('description') : model.get('description_en')
                    });
                });
            },
            showAll: function () {
                this.singleShowed = false;
            },
            showSingle: function (id) {
                var model = this.allSmionas.get(id);
                if (model === undefined){
                    return;
                }
                this.singleSmionas = {
                    id: model.get('id'),
                    url: model.get('site_url'),
                    image: model.get('image'),
                    title: (self.language === 'ru') ? model.get('title') : model.get('title_en'),
                    date: formatDate(new Date(model.get('created_at').replace(/\s/, 'T')), this.language),
                    description: (self.language === 'ru') ? model.get('description') : model.get('description_en'),
                    text: (self.language === 'ru') ? model.get('text') : model.get('text_en')
                };
                this.singleShowed = true;
            }
        }
    });



})(jQuery, window);