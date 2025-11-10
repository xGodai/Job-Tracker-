from django.urls import path
from . import views


urlpatterns = [
    path('cv_checker/', views.cv_checker, name='cv_checker'),
    path('cover_letter_checker/', views.cover_letter_checker,
         name='cover_letter_checker'),
]
