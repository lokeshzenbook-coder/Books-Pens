from django import forms
from .models import Order

class OrderCreateForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = [
            'shipping_fullName', 'shipping_addressLine', 'shipping_city',
            'shipping_state', 'shipping_zipCode', 'shipping_country',
            'billing_fullName', 'billing_addressLine', 'billing_city',
            'billing_state', 'billing_zipCode', 'billing_country',
            'payment_method'
        ]
        widgets = {
            'shipping_fullName': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., Jane Miller'}),
            'shipping_addressLine': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., 456 Beacon Hill'}),
            'shipping_city': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Boston'}),
            'shipping_state': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'MA'}),
            'shipping_zipCode': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '02108'}),
            'shipping_country': forms.TextInput(attrs={'class': 'form-control'}),
            
            'billing_fullName': forms.TextInput(attrs={'class': 'form-control'}),
            'billing_addressLine': forms.TextInput(attrs={'class': 'form-control'}),
            'billing_city': forms.TextInput(attrs={'class': 'form-control'}),
            'billing_state': forms.TextInput(attrs={'class': 'form-control'}),
            'billing_zipCode': forms.TextInput(attrs={'class': 'form-control'}),
            'billing_country': forms.TextInput(attrs={'class': 'form-control'}),
            
            'payment_method': forms.Select(choices=[('Credit Card', 'Credit Card'), ('PayPal', 'PayPal'), ('Apple Pay', 'Apple Pay')], attrs={'class': 'form-select'}),
        }
