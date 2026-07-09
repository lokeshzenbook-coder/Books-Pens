import React, { useState } from 'react';
import { CreditCard, Truck, CheckCircle, ArrowLeft, Printer, ShoppingBag, MapPin, ShieldCheck } from 'lucide-react';
import { CartItem, Coupon, Address, Order, OrderItem, User, Book, Pen } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  currentUser: User | null;
  onPlaceOrder: (order: Order) => void;
  onBackToCart: () => void;
  onClearCart: () => void;
}

export default function Checkout({
  cart,
  appliedCoupon,
  currentUser,
  onPlaceOrder,
  onBackToCart,
  onClearCart,
}: CheckoutProps) {
  // Address form states
  const [shippingName, setShippingName] = useState(currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '');
  const [shippingStreet, setShippingStreet] = useState(currentUser?.address || '');
  const [shippingCity, setShippingCity] = useState(currentUser?.city || '');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState(currentUser?.zipCode || '');
  const [shippingCountry, setShippingCountry] = useState(currentUser?.country || 'United States');

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const [billingName, setBillingName] = useState('');
  const [billingStreet, setBillingStreet] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [billingCountry, setBillingCountry] = useState('United States');

  // Payment States
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  // Confirmation state
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Math
  const subtotal = cart.reduce((acc, item) => {
    const discountedPrice = item.product.price * (1 - item.product.discount / 100);
    return acc + discountedPrice * item.quantity;
  }, 0);

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      couponDiscount = subtotal * (appliedCoupon.value / 100);
    } else {
      couponDiscount = appliedCoupon.value;
    }
  }

  const shippingFee = subtotal > 50 ? 0 : 4.99;
  const tax = (subtotal - couponDiscount) * 0.08;
  const total = subtotal - couponDiscount + shippingFee + tax;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const shippingAddress: Address = {
      fullName: shippingName,
      addressLine: shippingStreet,
      city: shippingCity,
      state: shippingState,
      zipCode: shippingZip,
      country: shippingCountry,
    };

    const billingAddress: Address = billingSameAsShipping
      ? shippingAddress
      : {
          fullName: billingName,
          addressLine: billingStreet,
          city: billingCity,
          state: billingState,
          zipCode: billingZip,
          country: billingCountry,
        };

    // Construct Order items list
    const orderItems: OrderItem[] = cart.map(item => ({
      id: item.id + '-ord',
      productId: item.product.id,
      name: item.product.type === 'book' ? (item.product as Book).title : `${(item.product as Pen).brand} ${(item.product as Pen).model}`,
      type: item.product.type,
      price: item.product.price * (1 - item.product.discount / 100),
      quantity: item.quantity,
      image: item.product.image,
    }));

    // Build the Order object
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = 'TRK' + Math.floor(100000000 + Math.random() * 900000000) + 'US';
    
    const newOrder: Order = {
      id: orderId,
      userId: currentUser?.id || 'guest-user',
      date: new Date().toISOString().split('T')[0],
      items: orderItems,
      subtotal,
      tax,
      shipping: shippingFee,
      discountAmount: couponDiscount,
      couponCode: appliedCoupon?.code,
      total,
      shippingAddress,
      billingAddress,
      paymentMethod: paymentMethod === 'credit_card' ? 'Credit Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery',
      status: 'Processing',
      trackingNumber,
    };

    // Save and send
    setCreatedOrder(newOrder);
    onPlaceOrder(newOrder);
  };

  // Render Order Confirmation Screen
  if (createdOrder) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    return (
      <div id="order-confirmation" className="max-w-2xl mx-auto text-center py-12 px-4 space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 ring-8 ring-emerald-50">
            <CheckCircle className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Order Placed Successfully!</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-md">
            Thank you for shopping with us. Your order <span className="font-mono font-bold text-gray-800">{createdOrder.id}</span> has been compiled and received.
          </p>
        </div>

        {/* Invoice details box */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-md text-left overflow-hidden">
          <div className="p-6 bg-gray-950 text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-mono tracking-wider text-gray-400">INVOICE NUMBER</p>
              <h4 className="text-base font-bold font-mono">{createdOrder.id}</h4>
            </div>
            <button 
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Delivery details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <p className="text-gray-400 font-medium uppercase tracking-wider text-[9px] mb-1">Shipping Address</p>
                <p className="font-bold text-gray-800">{createdOrder.shippingAddress.fullName}</p>
                <p className="text-gray-600 mt-0.5">{createdOrder.shippingAddress.addressLine}</p>
                <p className="text-gray-600">{createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.state} {createdOrder.shippingAddress.zipCode}</p>
                <p className="text-gray-600">{createdOrder.shippingAddress.country}</p>
              </div>

              <div>
                <p className="text-gray-400 font-medium uppercase tracking-wider text-[9px] mb-1">Estimated Arrival</p>
                <p className="font-bold text-gray-800">{formattedDelivery}</p>
                <p className="text-gray-400 font-medium uppercase tracking-wider text-[9px] mt-3.5 mb-1">Tracking Number</p>
                <p className="font-mono font-bold text-teal-700 bg-teal-50 border border-teal-100/50 px-2 py-0.5 rounded-md inline-block">
                  {createdOrder.trackingNumber}
                </p>
              </div>
            </div>

            {/* Items summary */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-gray-400 font-medium uppercase tracking-wider text-[9px] mb-3.5">Ordered Items</p>
              <div className="space-y-3">
                {createdOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-8 h-10 object-cover rounded bg-gray-50 border border-gray-100" />
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-gray-400 mt-0.5">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price block */}
            <div className="border-t border-gray-100 pt-4 flex flex-col items-end space-y-1.5 text-xs text-gray-600 font-sans">
              <div className="flex justify-between w-48">
                <span>Subtotal</span>
                <span className="font-mono text-gray-900">${createdOrder.subtotal.toFixed(2)}</span>
              </div>
              {createdOrder.discountAmount > 0 && (
                <div className="flex justify-between w-48 text-emerald-700">
                  <span>Discount</span>
                  <span className="font-mono font-semibold">-${createdOrder.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between w-48">
                <span>Shipping</span>
                <span className="font-mono text-gray-900">
                  {createdOrder.shipping === 0 ? 'FREE' : `$${createdOrder.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between w-48">
                <span>Tax</span>
                <span className="font-mono text-gray-900">${createdOrder.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between w-48 text-sm font-bold text-gray-900">
                <span>Total Paid</span>
                <span className="font-mono">${createdOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClearCart}
          className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl cursor-pointer shadow-md transition-all inline-flex items-center space-x-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
      </div>
    );
  }

  return (
    <div id="checkout-container" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Back to Cart anchor */}
      <button
        onClick={onBackToCart}
        className="flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Cart Summary</span>
      </button>

      <h2 className="text-xl md:text-2xl font-bold font-display text-gray-900 tracking-tight">Complete Checkout</h2>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Forms column (Left) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section: Shipping Address */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold font-display text-gray-900 flex items-center space-x-2 border-b border-gray-50 pb-3">
              <Truck className="w-4 h-4 text-gray-400" />
              <span>1. Shipping Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="md:col-span-2">
                <label className="block text-gray-500 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  placeholder="e.g., John Doe"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-500 font-medium mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingStreet}
                  onChange={(e) => setShippingStreet(e.target.value)}
                  placeholder="e.g., 123 Writers Lane"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-gray-500 font-medium mb-1">City</label>
                <input
                  type="text"
                  required
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  placeholder="e.g., Boston"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-500 font-medium mb-1">State / Prov</label>
                  <input
                    type="text"
                    required
                    value={shippingState}
                    onChange={(e) => setShippingState(e.target.value)}
                    placeholder="e.g., MA"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-medium mb-1">Zip Code</label>
                  <input
                    type="text"
                    required
                    value={shippingZip}
                    onChange={(e) => setShippingZip(e.target.value)}
                    placeholder="e.g., 02108"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-500 font-medium mb-1">Country</label>
                <select
                  value={shippingCountry}
                  onChange={(e) => setShippingCountry(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Billing Address */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h3 className="text-sm font-bold font-display text-gray-900 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>2. Billing Address</span>
              </h3>
              
              <label className="flex items-center space-x-1.5 cursor-pointer text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={billingSameAsShipping}
                  onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span>Same as shipping</span>
              </label>
            </div>

            {!billingSameAsShipping && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans animate-in slide-in-from-top-2 duration-150">
                <div className="md:col-span-2">
                  <label className="block text-gray-500 font-medium mb-1">Billing Name</label>
                  <input
                    type="text"
                    required={!billingSameAsShipping}
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    placeholder="e.g., John Doe"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-500 font-medium mb-1">Billing Street</label>
                  <input
                    type="text"
                    required={!billingSameAsShipping}
                    value={billingStreet}
                    onChange={(e) => setBillingStreet(e.target.value)}
                    placeholder="e.g., 123 Writers Lane"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 font-medium mb-1">City</label>
                  <input
                    type="text"
                    required={!billingSameAsShipping}
                    value={billingCity}
                    onChange={(e) => setBillingCity(e.target.value)}
                    placeholder="e.g., Boston"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-500 font-medium mb-1">State / Prov</label>
                    <input
                      type="text"
                      required={!billingSameAsShipping}
                      value={billingState}
                      onChange={(e) => setBillingState(e.target.value)}
                      placeholder="e.g., MA"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 font-medium mb-1">Zip Code</label>
                    <input
                      type="text"
                      required={!billingSameAsShipping}
                      value={billingZip}
                      onChange={(e) => setBillingZip(e.target.value)}
                      placeholder="e.g., 02108"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: Payment Options */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold font-display text-gray-900 flex items-center space-x-2 border-b border-gray-50 pb-3">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span>3. Payment Method</span>
            </h3>

            {/* Selection row */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 rounded-xl border flex flex-col items-center space-y-1 cursor-pointer transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-gray-900 bg-gray-50 font-bold text-gray-900'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('paypal')}
                className={`p-3 rounded-xl border flex flex-col items-center space-y-1 cursor-pointer transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-gray-900 bg-gray-50 font-bold text-gray-900'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                }`}
              >
                <span className="font-serif italic font-bold text-sky-800">PP</span>
                <span>PayPal</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border flex flex-col items-center space-y-1 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-gray-900 bg-gray-50 font-bold text-gray-900'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>On Delivery</span>
              </button>
            </div>

            {/* Credit Card Details container */}
            {paymentMethod === 'credit_card' && (
              <div className="space-y-3 p-4 bg-gray-50 rounded-2xl text-xs font-sans animate-in fade-in duration-150">
                <div>
                  <label className="block text-gray-500 font-medium mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required={paymentMethod === 'credit_card'}
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g., John Doe"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    required={paymentMethod === 'credit_card'}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="e.g., 4111 2222 3333 4444"
                    maxLength={19}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 font-mono focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 font-medium mb-1">Expiration Date</label>
                    <input
                      type="text"
                      required={paymentMethod === 'credit_card'}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 font-mono text-center focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 font-medium mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      required={paymentMethod === 'credit_card'}
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value)}
                      placeholder="e.g., 123"
                      maxLength={4}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 font-mono text-center focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="p-4 bg-sky-50 border border-sky-100/50 rounded-2xl text-xs text-center text-sky-800 font-sans animate-in fade-in duration-150">
                You will be securely redirected to PayPal to authorize payment after clicking &quot;Place Order&quot;.
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 bg-amber-50 border border-amber-100/50 rounded-2xl text-xs text-center text-amber-800 font-sans animate-in fade-in duration-150">
                Pay in cash, credit, or debit card directly upon secure delivery to your address.
              </div>
            )}
          </div>
        </div>

        {/* Checkout summary (Right) */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-100 shadow-md rounded-3xl p-6 space-y-6 sticky top-24">
            <h3 className="text-sm font-bold font-display text-gray-900 border-b border-gray-50 pb-3">
              Review Your Order
            </h3>

            {/* List of checkout items */}
            <div className="space-y-4 max-h-[180px] overflow-y-auto pr-1">
              {cart.map((item) => {
                const isBook = item.product.type === 'book';
                const finalPrice = item.product.price * (1 - item.product.discount / 100);
                return (
                  <div key={item.id} className="flex items-center justify-between text-xs font-sans">
                    <div className="flex items-center space-x-2.5">
                      <img src={item.product.image} alt={isBook ? (item.product as Book).title : (item.product as Pen).model} className="w-8 h-10 object-cover rounded bg-gray-50 border border-gray-100" />
                      <div>
                        <p className="font-semibold text-gray-800 line-clamp-1">{isBook ? (item.product as Book).title : (item.product as Pen).model}</p>
                        <p className="text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono font-medium text-gray-900">${(finalPrice * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            {/* Pricing calculations details */}
            <div className="border-t border-gray-50 pt-4 space-y-2.5 text-xs text-gray-600 font-sans">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono font-semibold">-${couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping fee</span>
                <span className="font-mono font-medium text-gray-900">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span className="font-mono font-medium text-gray-900">${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-100 pt-3 flex justify-between text-sm font-bold text-gray-900">
                <span>Total to Pay</span>
                <span className="font-mono text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-start space-x-2.5 text-[10px] text-gray-400 font-sans">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p>Your connection is secured with industry-standard hashing protocols. Payments are securely compiled, and card data is never stored on raw servers.</p>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl cursor-pointer shadow-md active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <span>Place Secure Order</span>
              <span>•</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
