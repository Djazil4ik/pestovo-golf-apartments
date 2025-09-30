"use strict";

(function ($, Vue, App, Backbone) {

    App.View.FeedbackButton = new Vue({
        el: '#miceBtn',
        methods: {
            miceModalOpen: function () {
                App.View.Mice.showModal = true;
            }
        }
    });

    /**
     * Представление принятия обратной связи
     */
    App.View.MiceSent = new Vue({
        el: "#mice-sent",
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
    App.Model.Mice = Backbone.Model.extend({
        defaults: {
            name: null,
            date: null,
            number: null,
            question: null,
            phone: null,
            email: null,
            whatsapp: null,
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
    App.View.Mice = new Vue({
        el: "#mice",
        data: {
            name: null,
            nameError: null,
            email: null,
            emailError: null,
            confirm: null,
            confirmError: null,
            question: null,
            questionError: null,
            phone: null,
            phoneError: null,
            whatsapp: null,
            whatsappError: null,
            date: null,
            dateError: null,
            number: null,
            numberError: null,
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
                this.phone = this.$refs.phone.dataset.value;
                this.whatsapp = this.$refs.whatsapp.dataset.value;
                this.date = null;
                this.number = null;
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
	    },
            phoneHasError: function () {
                return this.phoneError !== null;
            },
            numberHasError: function () {
                return this.numberError !== null;
            },
            dateHasError: function () {
                return this.dateError !== null;
            },
            whatsappHasError: function () {
                return this.whatsappError !== null;
            }
        },
        methods: {
            mice: function (e) {
                var self = this;
                self.nameError = null;
                self.emailError = null;
                self.questionError = null;
                self.confirmError = null;
                self.phoneError = null;
                self.numberError = null;
                self.dateError = null;
                self.whatsappError = null;
                self.alert = null;
                var mice = new App.Model.Mice({'url': e.target.action});
                mice.save({
                    name: this.name,
                    email: this.email,
                    date: this.date,
                    phone: this.phone,
                    number: this.number,
                    whatsapp: this.whatsapp,
                    question:  "Дата: " + this.date + "\n" + "Количество человек: " + this.number + "\n" + "Телефон: " + this.phone + "\n" + "WhatsApp: " + this.whatsapp + "\n" + "\n" + this.question,
                    confirm: this.confirm ? 1 : null
                }, {
                    success: function (model, response) {
                        if (response.alert !== undefined) {
                            self.openMiceSent();
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
                if (errors.date !== undefined) {
                    this.dateError = errors.date.shift();
                }
                if (errors.number !== undefined) {
                    this.numberError = errors.number.shift();
                }
                if (errors.phone !== undefined) {
                    this.phoneError = errors.phone.shift();
                }
                if (errors.whatsapp !== undefined) {
                    this.whatsappError = errors.whatsapp.shift();
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
            openMiceSent: function () {
                this.showModal = false;
                App.View.MiceSent.showModal = true;
            }
        }
    });

})(jQuery, Vue, App, Backbone);