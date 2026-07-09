from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ['book', 'pen']
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total', 'status', 'date_placed', 'tracking_number']
    list_filter = ['status', 'date_placed', 'payment_method']
    search_fields = ['id', 'user__username', 'shipping_fullName', 'tracking_number']
    inlines = [OrderItemInline]
