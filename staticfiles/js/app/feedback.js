"use strict";

(function ($, Vue, App, Backbone) {

    App.View.FeedbackButton = new Vue({
        el: '#feedbackBtn',
        methods: {
            feedbackModalOpen: function () {
                App.View.Feedback.showModal = true;
            }
        }
    });

    /**
     * Представление принятия обратной связи
     */
    App.View.FeedbackSent = new Vue({
        el: "#feedback-sent",
        data: {
            showModal: false
        },
        methods: {
            close: function () {
                this.$refs.modal.close();
            }
        }
    });

    /**
     * Модель обратной связи
     */
    App.Model.Feedback = Backbone.Model.extend({
        defaults: {
            name: null,
            question: null,
            email: null,
            confirm: false
        },
        url: function () {
            return this.instanceUrl;
        },
        initialize: function (props) {
            if (props !== undefined) {
                this.instanceUrl = props.url;
            }
        }
    });

    /**
     * Представление обратной связи
     */
    App.View.Feedback = new Vue({
        el: "#feedback",
        data: {
            name: null,
            nameError: null,
            email: null,
            emailError: null,
            confirm: null,
            confirmError: null,
            question: null,
            questionError: null,
            showModal: false,
            fieldsReset: false,
            alert: null
        },
        mounted: function () {

        },
        updated: function () {
            if (this.showModal === true && this.fieldsReset === false) {
                this.name = this.$refs.name.dataset.value;
                this.email = this.$refs.email.dataset.value;
                this.question = null;
                this.confirm = null;
                this.fieldsReset = true;
            }
        },
        watch: {
            showModal: function (value) {
                if (value === false){
                    this.fieldsReset = false;
                }
            }
        },
        computed: {
            nameHasError: function () {
                return this.nameError !== null;
            },
            emailHasError: function () {
                return this.emailError !== null;
            },
            questionHasError: function () {
                return this.questionError !== null;
            },
            confirmHasError: function () {
                return this.confirmError !== null;
            },
            hasAlert: function () {
                return this.alert !== null;
            }
        },
        methods: {
            feedback: function (e) {
                var self = this;
                self.nameError = null;
                self.emailError = null;
                self.questionError = null;
                self.confirmError = null;
                self.alert = null;
                var feedback = new App.Model.Feedback({'url': e.target.action});
                feedback.save({
                    name: this.name,
                    email: this.email,
                    question: this.question,
                    confirm: this.confirm ? 1 : null
                }, {
                    success: function (model, response) {
                        if (response.alert !== undefined) {
                            self.openFeedbackSent();
                        }
                    },
                    error: function (model, response) {
                        if (response.status === 419) {
                            self.setAlert({
                                type: 'warning',
                                title: '',
                                message: response.statusText
                            });
                        }
                        if (response.status >= 500) {
                            self.setAlert({
                                type: 'error',
                                title: '',
                                message: response.statusText
                            });
                        }
                        if (response.responseJSON.errors !== undefined) {
                            self.setErrors(response.responseJSON.errors);
                        }
                        if (response.responseJSON.alert !== undefined) {
                            self.setAlert(response.responseJSON.alert);
                        }
                    }
                });
            },

            setAlert: function (alert) {
                this.alert = alert;
            },
            setErrors: function (errors) {
                if (errors.name !== undefined) {
                    this.nameError = errors.name.shift();
                }
                if (errors.email !== undefined) {
                    this.emailError = errors.email.shift();
                }
                if (errors.question !== undefined) {
                    this.questionError = errors.question.shift();
                }
                if (errors.confirm !== undefined) {
                    this.confirmError = errors.confirm.shift();
                }

            },
            openFeedbackSent: function () {
                this.showModal = false;
                App.View.FeedbackSent.showModal = true;
            }
        }
    });

})(jQuery, Vue, App, Backbone);