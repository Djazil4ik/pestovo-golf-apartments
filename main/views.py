from django.shortcuts import render
from dotenv import load_dotenv
from core.settings import BASE_DIR
from apartments.models import Apartment
import os
import requests

load_dotenv(os.path.join(BASE_DIR, '.env'))

# Create your views here.


def home(request):
    apartments = Apartment.objects.all()[:6]
    API_key = os.getenv('WEATHER_API_KEY')
    weather_data = requests.get(f'https://api.openweathermap.org/data/2.5/weather?q=Pestovo&appid={API_key}&units=metric&lang=ru')
    if weather_data.status_code == 200:
        weather = weather_data.json()
        context = {
            'temp': round(weather['main']['temp']),
            'weather': weather['weather'][0]['main'],
            'apartments': apartments
        }
        return render(request, 'main/home.html', context)
    return render(request, 'main/home.html')
