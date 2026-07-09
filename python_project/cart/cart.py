from decimal import Decimal
from django.conf import settings
from products.models import Book, Pen

class Cart:
    def __init__(self, request):
        """
        Initialize the cart.
        """
        self.session = request.session
        cart = self.session.get(settings.CART_SESSION_ID if hasattr(settings, 'CART_SESSION_ID') else 'cart')
        if not cart:
            # save an empty cart in the session
            cart = self.session['cart'] = {}
        self.cart = cart

    def add(self, product_id, product_type, quantity=1, override_quantity=False):
        """
        Add a product to the cart or update its quantity.
        """
        product_key = f"{product_type}_{product_id}"
        
        # Verify product exists and read price/discount details
        price = Decimal('0.00')
        image_url = ''
        name = ''
        stock = 0

        if product_type == 'book':
            try:
                p = Book.objects.get(id=product_id)
                price = p.final_price
                image_url = p.image.url if p.image else 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600'
                name = p.title
                stock = p.stock
            except Book.DoesNotExist:
                return
        else:
            try:
                p = Pen.objects.get(id=product_id)
                price = p.final_price
                image_url = p.image.url if p.image else 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=600'
                name = f"{p.brand} {p.model}"
                stock = p.stock
            except Pen.DoesNotExist:
                return

        if product_key not in self.cart:
            self.cart[product_key] = {
                'id': str(product_id),
                'type': product_type,
                'name': name,
                'quantity': 0,
                'price': str(price),
                'image': image_url,
                'stock': stock
            }

        if override_quantity:
            self.cart[product_key]['quantity'] = min(stock, quantity)
        else:
            self.cart[product_key]['quantity'] = min(stock, self.cart[product_key]['quantity'] + quantity)
            
        self.save()

    def save(self):
        # mark the session as "modified" to make sure it gets saved
        self.session.modified = True

    def remove(self, product_id, product_type):
        """
        Remove a product from the cart.
        """
        product_key = f"{product_type}_{product_id}"
        if product_key in self.cart:
            del self.cart[product_key]
            self.save()

    def __iter__(self):
        """
        Iterate over the items in the cart and get the products from the database.
        """
        for key, item in self.cart.items():
            item['price'] = Decimal(item['price'])
            item['total_price'] = item['price'] * item['quantity']
            yield item

    def __len__(self):
        """
        Count all items in the cart.
        """
        return sum(item['quantity'] for item in self.cart.values())

    def get_subtotal(self):
        return sum(Decimal(item['price']) * item['quantity'] for item in self.cart.values())

    def get_tax(self):
        # 8% standard tax
        return Decimal('0.08') * self.get_subtotal()

    def get_shipping(self):
        # Free shipping over $50, otherwise $4.99
        subtotal = self.get_subtotal()
        if subtotal == 0 or subtotal >= 50:
            return Decimal('0.00')
        return Decimal('4.99')

    def get_total(self):
        return self.get_subtotal() + self.get_tax() + self.get_shipping()

    def clear(self):
        # remove cart from session
        if 'cart' in self.session:
            del self.session['cart']
        self.save()
