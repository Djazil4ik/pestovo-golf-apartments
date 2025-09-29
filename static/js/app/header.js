(function ($, window) {

    var weatherComponent = {
        data: function () {
            return {
                loaded:false,
                city: 'Москва',
                icon: null,
                temperature: null
            }
        },
        mounted: function () {
            $.get('/weather', this.load);
        },
        methods: {
            load: function (data) {
                if (data.success === true){
                    var weather = JSON.parse(data.result.weather);
                    this.icon = 'https://openweathermap.org/img/w/' + weather.weather[0].icon + '.png';
                    this.temperature = Math.round(weather.main.temp);
                    //this.city = weather.name;
                    this.loaded = true;
                }
            }
        },
        template: '#weather-template'
    };

    new Vue({
        el: '#weather',
        components: {
            'weather': weatherComponent
        }
    });

    new Vue({
        el: '#weather-mobile',
        components: {
            'weather': weatherComponent
        }
    });

    App.View.Header = new Vue({
        el: '#user-bar',
        data: {
            avatar: null
        },
        mounted: function () {
            if (this.$refs.avatar !== undefined){
                this.avatar = this.$refs.avatar.dataset.value;
            }
        },
        methods: {
            signInModalOpen: function (e) {
                App.View.SignIn.showModal = true;
            },
            callbackModalOpen: function () {
                App.View.Callback.showModal = true;
            }
        }
    });

    App.View.MobileCallback = new Vue({
        el: '#mobile-callback',
        methods: {
            callbackModalOpen: function () {
                App.View.Callback.showModal = true;
            }
        }
    });

    App.View.MobileCallback = new Vue({
        el: '#web-callback',
        methods: {
            callbackModalOpen: function () {
                App.View.Callback.showModal = true;
            }
        }
    });

})(jQuery, window);