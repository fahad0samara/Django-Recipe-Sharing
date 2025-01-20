from django import forms
from .models import Order, OrderItem

class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['total_amount']

class OrderItemForm(forms.ModelForm):
    class Meta:
        model = OrderItem
        fields = ['recipe', 'quantity', 'price']