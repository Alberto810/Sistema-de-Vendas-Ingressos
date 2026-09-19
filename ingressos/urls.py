from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path('comprar/', views.processar_compra, name='processar_compra'),
    path('buscar/<str:codigo>/', views.buscar_ingresso, name='buscar_ingresso'), # 4º Ponto
]