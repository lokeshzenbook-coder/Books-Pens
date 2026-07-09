import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, Tag, Bookmark } from 'lucide-react';
import { CartItem, Coupon, Product, Book, Pen } from '../types';

interface CartProps {
  cart: CartItem[];
  saveForLaterList: Product[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveFromCart: (id: string) => void;
  onSaveForLater: (item: CartItem) => void;
  onMoveToCartFromSaved: (product: Product) => void;
  onRemoveFromSaved: (id: string) => void;
  onClose: () => void;
  onCheckout: (appliedCoupon: Coupon | null) => void;
  activeCoupons: Coupon[];
}

export default function Cart({
  cart,
  saveForLaterList,
  onUpdateQuantity,
  onRemoveFromCart,
  onSaveForLater,
  onMoveToCartFromSaved,
  onRemoveFromSaved,
  onClose,
  onCheckout,
  activeCoupons,
}: CartProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const discountedPrice = item.product.price * (1 - item.product.discount / 100);
    return acc + discountedPrice * item.quantity;
  }, 0);

  // Apply Coupon discount
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.minSpend && subtotal < appliedCoupon.minSpend) {
      // Void coupon if subtotal falls below minimum spend
      setAppliedCoupon(null);
      setCouponSuccess('');
      setCouponError(`Min spend for ${appliedCoupon.code} is $${appliedCoupon.minSpend}`);
    } else {
      if (appliedCoupon.discountType === 'percentage') {
        couponDiscount = subtotal * (appliedCoupon.value / 100);
      } else {
        couponDiscount = appliedCoupon.value;
      }
    }
  }

  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 4.99;
  const tax = (subtotal - couponDiscount) * 0.08; // 8% sales tax
  const total = subtotal - couponDiscount + shipping + tax;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const trimmed = couponCode.trim().toUpperCase();
    if (!trimmed) return;

    const found = activeCoupons.find(c => c.code === trimmed && c.isActive);
    if (!found) {
      setCouponError('Invalid or expired coupon code.');
      return;
    }

    if (found.minSpend && subtotal < found.minSpend) {
      setCouponError(`Minimum spend of $${found.minSpend} required for this coupon.`);
      return;
    }

    setAppliedCoupon(found);
    setCouponSuccess(`Coupon ${found.code} applied: ${found.discountType === 'percentage' ? `${found.value}% off` : `$${found.value} off`}`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
  };

  return (
    <div id="cart-drawer" className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Drawer Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <ShoppingBag className="w-5 h-5 text-gray-900" />
          <h2 className="text-lg font-bold font-display text-gray-900">Your Shopping Cart</h2>
          <span className="text-xs font-mono px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
            {cart.length} item{cart.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
        {/* Cart items list (Left) */}
        <div className="lg:col-span-7 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">Your cart is empty.</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const isBook = item.product.type === 'book';
                const finalPrice = item.product.price * (1 - item.product.discount / 100);
                return (
                  <div
                    key={item.id}
                    id={`cart-item-${item.id}`}
                    className="flex items-center space-x-4 p-4 border border-gray-100 rounded-2xl bg-white hover:border-gray-200 transition-colors"
                  >
                    <img
                      src={item.product.image}
                      alt={isBook ? (item.product as Book).title : (item.product as Pen).model}
                      className="w-16 h-20 object-cover rounded-lg bg-gray-50 border border-gray-100"
                    />
                    
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-0.5">
                        {isBook ? (item.product as Book).category : (item.product as Pen).brand}
                      </p>
                      <h4 className="text-sm font-semibold font-display text-gray-900 truncate">
                        {isBook ? (item.product as Book).title : (item.product as Pen).model}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        {isBook ? `by ${(item.product as Book).author}` : `Tip: ${(item.product as Pen).tipSize}`}
                      </p>
                      
                      <div className="flex items-center space-x-3 text-xs">
                        <button
                          onClick={() => onSaveForLater(item)}
                          className="text-gray-400 hover:text-amber-600 flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save for later</span>
                        </button>
                        <span className="text-gray-200">|</span>
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          className="text-gray-400 hover:text-red-600 flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between h-20">
                      <span className="text-sm font-mono font-bold text-gray-900">
                        ${(finalPrice * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-1.5 border border-gray-200 rounded-lg p-0.5 bg-gray-50/50">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-1 rounded-md bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 rounded-md bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Save For Later section */}
          {saveForLaterList.length > 0 && (
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold font-display text-gray-800 flex items-center space-x-2 mb-4">
                <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Saved for Later ({saveForLaterList.length})</span>
              </h3>
              <div className="space-y-3">
                {saveForLaterList.map((product) => {
                  const isBook = product.type === 'book';
                  const finalPrice = product.price * (1 - product.discount / 100);
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={isBook ? (product as Book).title : (product as Pen).model}
                          className="w-10 h-12 object-cover rounded-md border border-gray-100"
                        />
                        <div>
                          <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">
                            {isBook ? (product as Book).title : (product as Pen).model}
                          </h4>
                          <p className="text-[10px] text-gray-400">
                            ${finalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => onMoveToCartFromSaved(product)}
                          className="px-2.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Move to Cart
                        </button>
                        <button
                          onClick={() => onRemoveFromSaved(product.id)}
                          className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                          title="Remove saved item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Order Summary sidebar (Right) */}
        <div className="lg:col-span-5">
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 space-y-6">
            <h3 className="text-sm font-bold font-display text-gray-900 border-b border-gray-200 pb-3">
              Order Summary
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs text-gray-600 font-sans">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 bg-emerald-50/50 p-1.5 rounded-md border border-emerald-100/55">
                  <span className="flex items-center space-x-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Discount ({appliedCoupon?.code})</span>
                  </span>
                  <span className="font-mono font-semibold">-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono font-medium text-gray-900">
                  {shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span className="font-mono font-medium text-gray-900">${tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between text-sm font-bold text-gray-900">
                <span>Grand Total</span>
                <span className="font-mono text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="border-t border-gray-200 pt-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">{appliedCoupon.code}</p>
                      <p className="text-[10px] text-emerald-600">{couponSuccess}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">Have a coupon code?</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="e.g., DISCOUNT10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-grow bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-500 font-medium">{couponError}</p>}
                  <p className="text-[9px] text-gray-400">Try testing code: <span className="font-mono bg-gray-100 px-1 rounded font-semibold text-gray-600">DISCOUNT10</span> or <span className="font-mono bg-gray-100 px-1 rounded font-semibold text-gray-600">PENLOVE</span></p>
                </form>
              )}
            </div>

            {/* Checkout Action Button */}
            <div className="pt-2">
              <button
                onClick={() => onCheckout(appliedCoupon)}
                disabled={cart.length === 0}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
                  cart.length === 0
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : 'bg-gray-900 hover:bg-gray-800 active:scale-98 shadow-md cursor-pointer'
                }`}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[10px] text-gray-400 mt-2.5">
                Free shipping on orders above $50.00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
