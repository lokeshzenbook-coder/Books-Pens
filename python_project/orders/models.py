from django.db import models
from django.contrib.auth.models import User
from products.models import Book, Pen

class Order(models.Model):
    STATUS_CHOICES = [
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    date_placed = models.DateTimeField(auto_now_add=True)
    subtotal = models.DecimalField(max_digits=8, decimal_places=2)
    tax = models.DecimalField(max_digits=6, decimal_places=2)
    shipping = models.DecimalField(max_digits=6, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=8, decimal_places=2)

    # Shipping Details
    shipping_fullName = models.CharField(max_length=150)
    shipping_addressLine = models.CharField(max_length=255)
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100)
    shipping_zipCode = models.CharField(max_length=20)
    shipping_country = models.CharField(max_length=100, default='United States')

    # Billing Details
    billing_fullName = models.CharField(max_length=150)
    billing_addressLine = models.CharField(max_length=255)
    billing_city = models.CharField(max_length=100)
    billing_state = models.CharField(max_length=100)
    billing_zipCode = models.CharField(max_length=20)
    billing_country = models.CharField(max_length=100, default='United States')

    payment_method = models.CharField(max_length=50, default='Credit Card')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Processing')
    tracking_number = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Order {self.id} for {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True, blank=True)
    pen = models.ForeignKey(Pen, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.IntegerField(default=1)

    @property
    def product_name(self):
        if self.book:
            return self.book.title
        elif self.pen:
            return f"{self.pen.brand} {self.pen.model}"
        return "Unknown Product"

    @property
    def item_total(self):
        return self.price * self.quantity

    def __str__(self):
        return f"Item {self.product_name} in Order {self.order.id}"
