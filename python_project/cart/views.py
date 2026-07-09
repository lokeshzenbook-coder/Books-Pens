from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from products.models import Book, Pen
from .cart import Cart

@require_POST
def cart_add(request, product_id, product_type):
    cart = Cart(request)
    quantity = int(request.POST.get('quantity', 1))
    override_quantity = request.POST.get('override_quantity', 'False') == 'True'
    cart.add(product_id=product_id, product_type=product_type, quantity=quantity, override_quantity=override_quantity)
    return redirect('cart:cart_detail')

def cart_remove(request, product_id, product_type):
    cart = Cart(request)
    cart.remove(product_id, product_type)
    return redirect('cart:cart_detail')

def cart_detail(request):
    cart = Cart(request)
    return render(request, 'cart/cart_detail.html', {'cart_obj': cart})
