from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User

class Category(models.Model):
    CLASS_CHOICES = [
        ('book', 'Book'),
        ('pen', 'Pen'),
    ]
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    product_class = models.CharField(max_length=10, choices=CLASS_CHOICES, default='book')

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return f"{self.name} ({self.get_product_class_display()})"


class Book(models.Model):
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='books')
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=150)
    publisher = models.CharField(max_length=150)
    isbn = models.CharField(max_length=20, unique=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    discount = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)]) # percentage discount
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    description = models.TextField()
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    image = models.ImageField(upload_to='books/', blank=True, null=True)
    featured = models.BooleanField(default=False)
    best_seller = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def final_price(self):
        if self.discount > 0:
            return self.price * (1 - self.discount / 100)
        return self.price

    def __str__(self):
        return self.title


class Pen(models.Model):
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='pens')
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=150)
    ink_color = models.CharField(max_length=50)
    tip_size = models.CharField(max_length=30) # e.g., "0.5mm", "0.7mm"
    material = models.CharField(max_length=100) # e.g., "Titanium", "Wood", "Brass"
    price = models.DecimalField(max_digits=8, decimal_places=2)
    discount = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    description = models.TextField()
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    image = models.ImageField(upload_to='pens/', blank=True, null=True)
    featured = models.BooleanField(default=False)
    best_seller = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def final_price(self):
        if self.discount > 0:
            return self.price * (1 - self.discount / 100)
        return self.price

    def __str__(self):
        return f"{self.brand} {self.model}"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    # Can review a book or a pen
    book = models.ForeignKey(Book, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')
    pen = models.ForeignKey(Pen, on_delete=models.CASCADE, null=True, blank=True, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        product_name = self.book.title if self.book else str(self.pen)
        return f"Review for {product_name} by {self.user.username}"


class Coupon(models.Model):
    COUPON_TYPES = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Discount ($)'),
    ]
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=COUPON_TYPES, default='percentage')
    value = models.DecimalField(max_digits=6, decimal_places=2)
    min_spend = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.code} - {self.value}"
