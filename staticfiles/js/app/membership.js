"use strict";

(function ($, Vue, App, Backbone) {

    App.View.MembershipButton = new Vue({
        el: '#membershipBtn',
        methods: {
            membershipModalOpen: function () {
                App.View.Membership.showModal = true;
            }
        }
    });

    /**
     * Представление принятия заявки на членство
     */
    App.View.MembershipSent = new Vue({
        el: "#membership-sent",
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
     * Модель заявки на членство
     */
    App.Model.Membership = Backbone.Model.extend({
        defaults: {
            name: null,
            phone: null,
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
     * Представление заявки на членство
     */
    App.View.Membership = new Vue({
        el: "#membership",
        data: {
            name: null,
            nameError: null,
            email: null,
            emailError: null,
            phone: null,
            phoneError: null,
            confirm: null,
            confirmError: null,
            showModal: false,
            inputMaskMounted: false,
            alert: null
        },
        mounted: function () {

        },
        updated: function () {
            var self = this;
            if (this.showModal === true && this.inputMaskMounted === false){
                this.name = this.$refs.name.dataset.value;
                this.phone = this.$refs.phone.dataset.value;
                $(this.$refs.phone).inputmask('+7 (999) 999 99 99', {
                    oncomplete: function () {
                        self.phone = $(this).val();
                    }
                });
                this.inputMaskMounted = true;
            }
        },
        watch: {},
        computed: {
            nameHasError: function () {
                return this.nameError !== null;
            },
            emailHasError: function () {
                return this.emailError !== null;
            },
            phoneHasError: function () {
                return this.phoneError !== null;
            },
            confirmHasError: function () {
                return this.confirmError !== null;
            },
            hasAlert: function () {
                return this.alert !== null;
            }
        },
        methods: {
            membership: function (e) {
                var self = this;
                self.nameError = null;
                self.emailError = null;
                self.phoneError = null;
                self.confirmError = null;
                self.alert = null;
                var membership = new App.Model.Membership({'url': e.target.action});
                membership.save({
                    name: this.name,
                    email: this.email,
                    phone: this.phone,
                    confirm: this.confirm ? 1 : null
                }, {
                    success: function (model, response) {
                        if (response.alert !== undefined){
                            self.openMembershipSent();
                        }
                    },
                    error: function (model, response) {
                        if (response.status === 419){
                            self.setAlert({
                                type: 'warning',
                                title: '',
                                message: response.statusText
                            });
                        }
                        if (response.status >= 500){
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
                if (errors.phone !== undefined) {
                    this.phoneError = errors.phone.shift();
                }
                if (errors.confirm !== undefined) {
                    this.confirmError = errors.confirm.shift();
                }

            },
            openMembershipSent: function () {
                this.showModal = false;
                App.View.MembershipSent.showModal = true;
            }
        }
    });

})(jQuery, Vue, App, Backbone);