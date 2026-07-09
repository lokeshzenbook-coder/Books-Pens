from django.contrib import admin
from .models import Category, Book, Pen, Review, Coupon

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'product_class']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'price', 'stock', 'discount', 'featured', 'best_seller']
    list_filter = ['category', 'featured', 'best_seller']
    search_fields = ['title', 'author', 'isbn']


@admin.register(Pen)
class PenAdmin(admin.ModelAdmin):
    list_display = ['model', 'brand', 'price', 'stock', 'ink_color', 'featured', 'best_seller']
    list_filter = ['brand', 'ink_color', 'featured', 'best_seller']
    search_fields = ['model', 'brand', 'material']


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'pen', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_type', 'value', 'min_spend', 'is_active']
    list_filter = ['is_active', 'discount_type']
