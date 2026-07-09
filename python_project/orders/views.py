from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from cart.cart import Cart
from .models import Order, OrderItem
from products.models import Book, Pen, Coupon
from .forms import OrderCreateForm
from django.contrib import messages
from decimal import Decimal

@login_required
def order_create(request):
    cart = Cart(request)
    if len(cart) == 0:
        return redirect('cart:cart_detail')

    coupon_code = request.GET.get('coupon', '')
    discount_amount = Decimal('0.00')
    if coupon_code:
        try:
            coupon = Coupon.objects.get(code=coupon_code.upper(), is_active=True)
            if cart.get_subtotal() >= coupon.min_spend:
                if coupon.discount_type == 'percentage':
                    discount_amount = cart.get_subtotal() * (coupon.value / 100)
                else:
                    discount_amount = coupon.value
        except Coupon.DoesNotExist:
            pass

    if request.method == 'POST':
        form = OrderCreateForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)
            order.user = request.user
            order.subtotal = cart.get_subtotal()
            order.tax = cart.get_tax()
            order.shipping = cart.get_shipping()
            order.discount_amount = discount_amount
            order.total = max(Decimal('0.00'), cart.get_subtotal() + cart.get_tax() + cart.get_shipping() - discount_amount)
            order.save()

            # Create OrderItem records and decrement stock
            for item in cart:
                if item['type'] == 'book':
                    book_p = Book.objects.get(id=item['id'])
                    OrderItem.objects.create(
                        order=order,
                        book=book_p,
                        price=Decimal(item['price']),
                        quantity=item['quantity']
                    )
                    book_p.stock = max(0, book_p.stock - item['quantity'])
                    book_p.save()
                else:
                    pen_p = Pen.objects.get(id=item['id'])
                    OrderItem.objects.create(
                        order=order,
                        pen=pen_p,
                        price=Decimal(item['price']),
                        quantity=item['quantity']
                    )
                    pen_p.stock = max(0, pen_p.stock - item['quantity'])
                    pen_p.save()

            # Clear session cart
            cart.clear()
            messages.success(request, f"Thank you! Your order {order.id} has been registered successfully.")
            return redirect('orders:history')
    else:
        # Pre-populate forms with existing User profile data
        profile = request.user.profile
        form = OrderCreateForm(initial={
            'shipping_fullName': f"{request.user.first_name} {request.user.last_name}",
            'shipping_addressLine': profile.address,
            'shipping_city': profile.city,
            'shipping_zipCode': profile.zip_code,
            'shipping_country': profile.country,
            
            'billing_fullName': f"{request.user.first_name} {request.user.last_name}",
            'billing_addressLine': profile.address,
            'billing_city': profile.city,
            'billing_zipCode': profile.zip_code,
            'billing_country': profile.country,
        })

    context = {
        'cart': cart,
        'form': form,
        'discount_amount': discount_amount,
        'grand_total': max(Decimal('0.00'), cart.get_subtotal() + cart.get_tax() + cart.get_shipping() - discount_amount)
    }
    return render(request, 'orders/checkout.html', context)


@login_required
def order_history(request):
    orders = Order.objects.filter(user=request.user).order_by('-date_placed')
    return render(request, 'orders/history.html', {'orders': orders})
