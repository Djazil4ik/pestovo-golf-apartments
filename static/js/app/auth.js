(function ($, window) {

    /**
     * Представление востановления пароля
     */
    App.View.RecoveryLinkSent = new Vue({
        el: "#recovery-link-sent",
        data: {
            email: null,
            showModal: false
        },
        methods: {
            close: function () {
                this.$refs.modal.close();
            }
        }
    });

    /**
     * Модель востановления пароля
     */
    App.Model.Recovery = Backbone.Model.extend({
        defaults: {
            email: ''
        },
        url: function(){
            return this.instanceUrl;
        },
        initialize: function(props){
            if (props !== undefined){
                this.instanceUrl = props.url;
            }
        }
    });

    /**
     * Представление востановления пароля
     */
    App.View.Recovery = new Vue({
        el: "#recovery",
        data: {
            email: null,
            emailError: null,
            alert: null,
            showModal: false
        },
        watch: {
            showModal: function (val) {
                if (val === false){
                    window.location.hash = '';
                    this.email = null;
                    this.alert = null;
                }
            }
        },
        computed: {
            emailHasError: function () {
                return this.emailError !== null;
            },
            hasAlert: function () {
                return (this.alert !== null);
            }
        },
        methods: {
            recovery: function (e) {
                var self = this;
                self.emailError = null;
                self.alert = null;
                var RecoveryModel = new App.Model.Recovery({'url': e.target.action});
                RecoveryModel.save({
                    email: this.email
                },{
                    success: function (model, response) {
                        self.openRecoveryLinkSent();
                        self.email = null;
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
                if (errors.email !== undefined) {
                    this.emailError = errors.email.shift();
                }
            },
            openSignIn: function () {
                this.showModal = false;
                App.View.SignIn.showModal = true;
            },
            openRecoveryLinkSent: function () {
                this.showModal = false;
                App.View.RecoveryLinkSent.email = this.email;
                App.View.RecoveryLinkSent.showModal = true;
            }
        }
    });

    /**
     * Модель авторизации
     */
    App.Model.SignIn = Backbone.Model.extend({
        defaults: {
            login: '',
            password: ''
        },
        url: function(){
            return this.instanceUrl;
        },
        initialize: function(props){
            if (props !== undefined){
                this.instanceUrl = props.url;
            }
        }
    });

    /**
     * Представление авторизации
     */
    App.View.SignIn = new Vue({
        el: "#sign-in",

        data: {
            login: null,
            loginError: null,
            password: null,
            passwordError: null,
            alert: null,
            showModal: false,
            link: null,
            afterSignIn: null
        },
        mounted: function () {
            if (parseBoolean(hash('sign-in')) === true){
                this.showModal = true;
            }
        },
        watch: {
            login: function () {
                this.loginError = null;
                this.alert = null;
            },
            password: function () {
                this.passwordError = null;
                this.alert = null;
            },
            showModal: function (val) {
                if (val === false){
                    window.location.hash = '';
                    this.login = null;
                    this.password = null;
                }
            }
        },
        computed: {
            loginHasError: function () {
                return this.loginError !== null;
            },
            passwordHasError: function () {
                return this.passwordError !== null;
            },
            hasAlert: function () {
                return this.alert !== null;
            }
        },
        methods: {
            signIn: function (e) {
                var self = this;
                self.passwordError = null;
                self.loginError = null;
                self.alert = null;
                var signInModel = new App.Model.SignIn({'url': e.target.action});
               signInModel.save({
                    login: this.login,
                    password: this.password
                }, {
                    success: function (model, response) {
                        if (self.afterSignIn != null){
                            self.afterSignIn();
                        }else if (self.link != null){
                            window.location.replace(self.link);
                        }else if (response.link !== undefined){
                            window.location.replace(response.link);
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
                if (errors.login !== undefined) {
                    this.loginError = errors.login.shift();
                }
                if (errors.password !== undefined) {
                    this.passwordError = errors.password.shift();
                }

            },
            openRecovery: function () {
                this.showModal = false;
                App.View.Recovery.showModal = true;
            }
        }
    });


})(jQuery, window);