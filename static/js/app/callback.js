(function ($, window) {

    /**
     * Представление принятия обратного звонка
     */
    App.View.CallbackSent = new Vue({
        el: "#callback-sent",
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
     * Модель обратного звонка
     */
    App.Model.Callback = Backbone.Model.extend({
        defaults: {
            name: null,
            phone: null,
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
     * Представление обратного звонка
     */
    App.View.Callback = new Vue({
        el: "#callback",
        data: {
            name: null,
            nameError: null,
            phone: null,
            phoneError: null,
            confirm: null,
            confirmError: null,
            showModal: false,
            inputMaskMounted: false,
            alert: null,
            recaptchaToken: null
        },
        mounted: function () {
            var self = this;
            this.$nextTick(function () {
                self.initRecaptcha();
            });
        },
        updated: function () {
            var self = this;
            if (this.showModal === true && this.inputMaskMounted === false) {
                this.name = this.$refs.name.dataset.value;
                this.phone = this.$refs.phone.dataset.value;
                this.confirm = null;
                $(this.$refs.phone).inputmask('+7 (999) 999 99 99', {
                    oncomplete: function () {
                        self.phone = $(this).val();
                    }
                });
                this.inputMaskMounted = true;
            }
        },
        watch: {
            showModal: function (val) {
                if (val === false) {
                    this.inputMaskMounted = false;
                } else {
                    this.initRecaptcha();
                }
            }
        },
        computed: {
            nameHasError: function () {
                return this.nameError !== null;
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
            initRecaptcha: function () {
                var self = this;
                grecaptcha.ready(function () {
                    grecaptcha.render(self.$refs.recaptcha, {
                        'sitekey': '6LeAvcAjAAAAAAydVnWTDwU7G7wYvmP-Dw6Vd-tW',
                        'callback': self.setRecaptchaToken
                    });
                });
            },
            setRecaptchaToken: function (token) {
                this.recaptchaToken = token;
            },
            callback: function (e) {
                var self = this;
                self.nameError = null;
                self.phoneError = null;
                self.confirmError = null;
                self.alert = null;

                if (!this.recaptchaToken) {
                    this.setAlert({
                        type: 'error',
                        title: '',
                        message: 'Пожалуйста, подтвердите, что вы не робот.'
                    });
                    return;
                }

                var callback = new App.Model.Callback({'url': e.target.action});
                callback.save({
                    name: this.name,
                    phone: this.phone,
                    confirm: this.confirm ? 1 : null,
                    'g-recaptcha-response': this.recaptchaToken
                }, {
                    success: function (model, response) {
                        if (response.alert !== undefined){
                            self.openCallbackSent();
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
                if (errors.phone !== undefined) {
                    this.phoneError = errors.phone.shift();
                }
                if (errors.confirm !== undefined) {
                    this.confirmError = errors.confirm.shift();
                }

            },
            openCallbackSent: function () {
                this.showModal = false;
                App.View.CallbackSent.showModal = true;
            }
        }
    });

})(jQuery, window);