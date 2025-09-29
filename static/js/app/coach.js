"use strict";

(function ($, Vue, App, Backbone) {

    App.Model.Coach = Backbone.Model.extend({
        defaults: {
            title: null,
            title_en: null,
            department: null,
            department_en: null,
            phone: null,
            details: null,
            details_en: null,
            image: null
        },
        urlRoot: "/trainer",
        url: function () {
            return ((this.instanceLanguage === 'en') ? '/en' : '') + this.urlRoot + '/' + this.id;
        },
        initialize: function (props) {
            if (props !== undefined) {
                this.instanceLanguage = props.language;
            }
        }
    });

    App.View.Coach = new Vue({
        el: "#coach",
        data: {
            showModal: false,
            trainer: {
                title: null,
                title_en: null,
                department: null,
                department_en: null,
                phone: null,
                details: null,
                details_en: null,
                image: null
            }
        }
    });

    App.View.CoachButton = new Vue({
        el: '.academy-page__slider-section',
        data: {
            language: null
        },
        mounted: function () {
            this.language = this.$refs.language.dataset.value;
        },
        methods: {
            coachModalOpen: function (id) {
                var coach = new App.Model.Coach({language: this.language, id: id});

                coach.fetch({
                    success: function (model, data) {
                        App.View.Coach.trainer = data;
                    }
                });

                App.View.Coach.showModal = true;
            }
        }
    });
})(jQuery, Vue, App, Backbone);