(function ($, window, App, Backbone, moment) {


    App.Model.Album = Backbone.Model.extend();
    App.Collection.Albums = Backbone.Collection.extend({
        model: App.Model.Album,
        baseUrl: '/gallery_albums',
        initialize: function () {
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
            if (response === undefined) {
                return;
            }
            this.page = response.list.current_page;
            this.perPage = response.list.per_page;
            this.total = response.list.total;
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
                pages: this.total > 0 ? Math.ceil(this.total / this.perPage) : 0,
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

    var albums = new App.Collection.Albums();

    App.View.Albums = new Vue({
        el: "#albums",

        bb: function () {
            return {
                albums: albums
            };
        },

        data: {
            language: null,
            albumsList: [],
            hasMoreAlbums: true
        },
        mounted: function () {
            this.language = this.$refs.language.dataset.value;
            var url = new URL(window.location);
            this.albums.fetch({language: this.language, success: this.afterFetch});

        },
        methods: {
            afterFetch: function () {
                this.checkMoreAlbums();
            },
            checkMoreAlbums: function () {
                var pageInfo = this.albums.pageInfo();
                this.hasMoreAlbums = !(pageInfo.total <= Math.ceil(pageInfo.page * pageInfo.perPage));
            },
            loadMore: function () {
                this.albums.nextPage({language: this.language, success: this.appendCard});
            },
            showDetails: function (url) {
                window.location = url;
            },
            appendCard: function () {
                this.checkMoreAlbums();
                var self = this;
                this.albums.each(function (model) {
                    self.albumsList.push({
                        url: ((self.language === 'en') ? '/en/' : '/') + 'gallery_albums/' + model.get('url'),
                        image: model.get('image'),
                        title: (self.language === 'ru') ? model.get('title') : model.get('title_en'),
                        date: formatDate(new Date(model.get('created_at').replace(/\s/, 'T')), self.language),
                        imagesCount: model.get('images_count')
                    });
                });
            }
        }
    });

})(jQuery, window, App, Backbone, moment);