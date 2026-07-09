from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    path('catalog/<str:product_class>/', views.product_list, name='list'),
    path('detail/<str:product_class>/<int:pk>/', views.product_detail, name='detail'),
    path('review/add/<str:product_class>/<int:pk>/', views.add_review, name='add_review'),
]
