from .models import Close
from django.views.generic import TemplateView
from dotenv import load_dotenv
from core.settings import BASE_DIR
from apartments.models import Apartment
import os
import requests

load_dotenv(os.path.join(BASE_DIR, '.env'))

# Create your views here.


class HomeView(TemplateView):
    template_name = 'main/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Проверяем, закрыт ли сайт
        if Close.objects.filter(is_closed=True).exists():
            self.template_name = 'main/closed.html'
            return context

        # Берем первые 6 квартир
        apartments = Apartment.objects.all()[:6]
        context['apartments'] = apartments

        # Получаем погоду
        API_key = os.getenv('WEATHER_API_KEY')
        weather_data = requests.get(
            f'https://api.openweathermap.org/data/2.5/weather?q=Pestovo&appid={API_key}&units=metric&lang=ru'
        )

        if weather_data.status_code == 200:
            weather = weather_data.json()
            context['temp'] = round(weather['main']['temp'])
            context['weather'] = weather['weather'][0]['main']
        else:
            context['temp'] = None
            context['weather'] = None

        return context


