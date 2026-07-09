from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import Book, Pen, Category, Review, Coupon
from django.db.models import Q

def home(request):
    featured_books = Book.objects.filter(featured=True)[:2]
    featured_pens = Pen.objects.filter(featured=True)[:2]
    bestseller_books = Book.objects.filter(best_seller=True)[:2]
    bestseller_pens = Pen.objects.filter(best_seller=True)[:2]
    
    context = {
        'featured_books': featured_books,
        'featured_pens': featured_pens,
        'bestseller_books': bestseller_books,
        'bestseller_pens': bestseller_pens,
    }
    return render(request, 'home.html', context)


def product_list(request, product_class='book'):
    """
    Renders books or pens catalogs with keyword search, categories, and price filtering.
    """
    search_query = request.GET.get('q', '')
    category_slug = request.GET.get('category', 'All')
    brand_filter = request.GET.get('brand', 'All')
    ink_filter = request.GET.get('ink', 'All')
    price_max = request.GET.get('price_max', '150')
    sort_by = request.GET.get('sort', 'popular')

    categories = Category.objects.filter(product_class=product_class)

    # Base query sets
    if product_class == 'book':
        queryset = Book.objects.all()
    else:
        queryset = Pen.objects.all()

    # Search filter
    if search_query:
        if product_class == 'book':
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(author__icontains=search_query) |
                Q(description__icontains=search_query)
            )
        else:
            queryset = queryset.filter(
                Q(model__icontains=search_query) |
                Q(brand__icontains=search_query) |
                Q(description__icontains=search_query)
            )

    # Category filters
    if category_slug != 'All':
        queryset = queryset.filter(category__slug=category_slug)

    # Brands (pens-only)
    if product_class == 'pen' and brand_filter != 'All':
        queryset = queryset.filter(brand=brand_filter)

    # Ink Colors (pens-only)
    if product_class == 'pen' and ink_filter != 'All':
        queryset = queryset.filter(ink_color=ink_filter)

    # Max Price threshold
    try:
        max_p = float(price_max)
        # Filters database price
        queryset = queryset.filter(price__lte=max_p)
    except ValueError:
        pass

    # Sort logic
    if sort_by == 'price-low':
        queryset = queryset.order_by('price')
    elif sort_by == 'price-high':
        queryset = queryset.order_by('-price')
    elif sort_by == 'newest':
        queryset = queryset.order_by('-created_at')
    else:
        queryset = queryset.order_by('-rating')

    # Pens extra filters helpers
    all_brands = ['Nightingale', 'Apex', 'WriteTech', 'DuraLead']
    all_inks = ['Midnight Blue', 'Charcoal Black', 'Forest Green', 'Crimson Red']

    context = {
        'products': queryset,
        'product_class': product_class,
        'categories': categories,
        'search_query': search_query,
        'category_slug': category_slug,
        'brand_filter': brand_filter,
        'ink_filter': ink_filter,
        'price_max': price_max,
        'sort_by': sort_by,
        'all_brands': all_brands,
        'all_inks': all_inks,
    }
    return render(request, 'products/catalog.html', context)


def product_detail(request, pk, product_class='book'):
    if product_class == 'book':
        product = get_object_or_404(Book, pk=pk)
        reviews = product.reviews.all().order_by('-created_at')
    else:
        product = get_object_or_404(Pen, pk=pk)
        reviews = product.reviews.all().order_by('-created_at')

    context = {
        'product': product,
        'product_class': product_class,
        'reviews': reviews,
    }
    return render(request, 'products/detail.html', context)


@login_required
def add_review(request, pk, product_class='book'):
    """
    Submits a user review for a product.
    """
    if request.method == 'POST':
        rating = int(request.POST.get('rating', 5))
        comment = request.POST.get('comment', '')

        review = Review(user=request.user, rating=rating, comment=comment)
        
        if product_class == 'book':
            book = get_object_or_404(Book, pk=pk)
            review.book = book
            review.save()
            # Recalculate average rating
            all_revs = book.reviews.all()
            book.rating = sum(r.rating for r in all_revs) / len(all_revs)
            book.save()
        else:
            pen = get_object_or_404(Pen, pk=pk)
            review.pen = pen
            review.save()
            # Recalculate average rating
            all_revs = pen.reviews.all()
            pen.rating = sum(r.rating for r in all_revs) / len(all_revs)
            pen.save()

    return redirect('products:detail', pk=pk, product_class=product_class)
