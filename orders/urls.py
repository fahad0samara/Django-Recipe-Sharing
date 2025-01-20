from django.urls import path
from .views import order_views

urlpatterns = [
    path('', order_views.order_list, name='order_list'),
    path('<int:order_id>/', order_views.order_detail, name='order_detail'),
    path('create/', order_views.create_order, name='create_order'),
]