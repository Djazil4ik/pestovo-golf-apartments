from django.shortcuts import render
from django.views import View

# Create your views here.


class ApartmentListView(View):
    def get(self, request):
        # Logic to retrieve and display a list of apartments
        return render(request, 'apartments/apartment_list.html', context={})
