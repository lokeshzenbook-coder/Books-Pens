import React, { useState } from 'react';
import { Settings, BarChart3, BookOpen, PenTool, ClipboardList, Tag, Plus, Edit3, Trash2, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { Product, Book, Pen, Coupon, Order, CATEGORIES, BRANDS } from '../types';

interface AdminDashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  coupons: Coupon[];
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  onProductUpdated: () => void;
}

export default function AdminDashboard({
  products,
  setProducts,
  orders,
  setOrders,
  coupons,
  setCoupons,
  onProductUpdated,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons'>('overview');

  // Form states for creating/editing a product
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formType, setFormType] = useState<'book' | 'pen'>('book');

  // Shared fields
  const [pId, setPId] = useState('');
  const [pPrice, setPPrice] = useState(10);
  const [pDiscount, setPDiscount] = useState(0);
  const [pStock, setPStock] = useState(20);
  const [pDescription, setPDescription] = useState('');
  const [pImage, setPImage] = useState('');

  // Book fields
  const [bTitle, setBTitle] = useState('');
  const [bAuthor, setBAuthor] = useState('');
  const [bCategory, setBCategory] = useState('Fiction');
  const [bPublisher, setBPublisher] = useState('');
  const [bIsbn, setBIsbn] = useState('');

  // Pen fields
  const [pBrand, setPBrand] = useState('Nightingale');
  const [pModel, setPModel] = useState('');
  const [pInkColor, setPInkColor] = useState('Midnight Blue');
  const [pTipSize, setPTipSize] = useState('Medium (0.7mm)');
  const [pMaterial, setPMaterial] = useState('Metal');

  // Form states for coupons
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponMinSpend, setNewCouponMinSpend] = useState(15);

  // Statistics calculation
  const totalSales = orders.reduce((acc, o) => o.status !== 'Cancelled' ? acc + o.total : acc, 0);
  const activeOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length;
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setFormType(product.type);
    
    // Populate shared fields
    setPId(product.id);
    setPPrice(product.price);
    setPDiscount(product.discount);
    setPStock(product.stock);
    setPDescription(product.description);
    setPImage(product.image);

    if (product.type === 'book') {
      const b = product as Book;
      setBTitle(b.title);
      setBAuthor(b.author);
      setBCategory(b.category);
      setBPublisher(b.publisher);
      setBIsbn(b.isbn);
    } else {
      const p = product as Pen;
      setPBrand(p.brand);
      setPModel(p.model);
      setPInkColor(p.inkColor);
      setPTipSize(p.tipSize);
      setPMaterial(p.material);
    }
    setShowProductForm(true);
  };

  const handleCreateProductClick = () => {
    setEditingProduct(null);
    setShowProductForm(true);
    
    // Clear / Reset fields
    setPId('p_' + Math.floor(1000 + Math.random() * 9000));
    setPPrice(15);
    setPDiscount(0);
    setPStock(20);
    setPDescription('');
    setPImage('https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600');

    setBTitle('');
    setBAuthor('');
    setBCategory('Fiction');
    setBPublisher('');
    setBIsbn('');

    setPBrand('Nightingale');
    setPModel('');
    setPInkColor('Midnight Blue');
    setPTipSize('Medium (0.7mm)');
    setPMaterial('Metal');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    let finalProduct: Product;

    if (formType === 'book') {
      finalProduct = {
        id: editingProduct ? editingProduct.id : pId,
        type: 'book',
        title: bTitle,
        author: bAuthor,
        category: bCategory,
        publisher: bPublisher,
        isbn: bIsbn || 'ISBN-MOCK-' + Math.floor(100000 + Math.random() * 900000),
        price: Number(pPrice),
        discount: Number(pDiscount),
        stock: Number(pStock),
        description: pDescription || 'A beautifully curated masterpiece.',
        rating: editingProduct ? editingProduct.rating : 4.5,
        image: pImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
        reviews: editingProduct ? editingProduct.reviews : [],
      };
    } else {
      finalProduct = {
        id: editingProduct ? editingProduct.id : pId,
        type: 'pen',
        brand: pBrand,
        model: pModel,
        inkColor: pInkColor,
        tipSize: pTipSize,
        material: pMaterial,
        price: Number(pPrice),
        discount: Number(pDiscount),
        stock: Number(pStock),
        description: pDescription || 'A writing instrument of exceptional build.',
        rating: editingProduct ? editingProduct.rating : 4.5,
        image: pImage || 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=600',
        reviews: editingProduct ? editingProduct.reviews : [],
      };
    }

    if (editingProduct) {
      // Edit existing
      setProducts(prev => prev.map(p => p.id === finalProduct.id ? finalProduct : p));
    } else {
      // Create new
      setProducts(prev => [finalProduct, ...prev]);
    }

    setShowProductForm(false);
    setEditingProduct(null);
    onProductUpdated();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product? This is irreversible.')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      onProductUpdated();
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled') => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCouponCode.trim().toUpperCase();
    if (!trimmed) return;

    if (coupons.some(c => c.code === trimmed)) {
      alert('Coupon code already exists.');
      return;
    }

    const newCoupon: Coupon = {
      code: trimmed,
      discountType: newCouponType,
      value: Number(newCouponValue),
      minSpend: Number(newCouponMinSpend),
      isActive: true,
    };

    setCoupons(prev => [...prev, newCoupon]);
    setNewCouponCode('');
  };

  const handleToggleCouponStatus = (code: string) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, isActive: !c.isActive } : c));
  };

  const handleReplenishStock = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: p.stock + 20 } : p));
    onProductUpdated();
  };

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-gray-900 flex items-center space-x-2">
            <Settings className="w-6 h-6 text-amber-500 animate-spin-slow" />
            <span>Administrator Console</span>
          </h2>
          <p className="text-xs text-gray-400 font-sans mt-0.5">Manage stock levels, categories, promotional discount coupons, and verify active orders.</p>
        </div>

        {/* Console view toggle buttons */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-950'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === 'products' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-950'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Products</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-950'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              activeTab === 'coupons' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-950'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Coupons</span>
          </button>
        </div>
      </div>

      {/* VIEW: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Bento stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Total Revenue Sales</span>
              <p className="text-2xl font-bold font-mono text-gray-900 mt-1">${totalSales.toFixed(2)}</p>
              <div className="mt-2.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm inline-block">
                +14.2% from last week
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Total Placed Orders</span>
              <p className="text-2xl font-bold font-mono text-gray-900 mt-1">{orders.length}</p>
              <span className="text-[10px] text-gray-400 font-sans block mt-2.5">
                {activeOrders} active shipping orders
              </span>
            </div>

            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Active Inventory Sku</span>
              <p className="text-2xl font-bold font-mono text-gray-900 mt-1">{products.length}</p>
              <span className="text-[10px] text-gray-400 font-sans block mt-2.5">
                Categories: {CATEGORIES.books.length - 1} books, {CATEGORIES.pens.length - 1} pens
              </span>
            </div>

            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Stock Warnings</span>
              <p className={`text-2xl font-bold font-mono mt-1 ${lowStockCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
                {lowStockCount} Sku
              </p>
              <div className={`mt-2.5 text-[10px] px-2 py-0.5 rounded-sm inline-block font-bold ${lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                {lowStockCount > 0 ? 'Replenish immediate stock' : 'Inventory levels optimal'}
              </div>
            </div>
          </div>

          {/* Low Stock Alerts & Sales chart mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sales Chart Mockup */}
            <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-gray-400">Weekly Revenue Flow</h3>
              
              {/* Graphic container using pure CSS barcharts */}
              <div className="h-48 flex items-end justify-between pt-4 font-mono text-[9px] text-gray-400 px-4">
                <div className="flex flex-col items-center space-y-2 w-10">
                  <div className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-t-md w-full h-16 relative group">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded px-1.5 py-0.5 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">$140</span>
                  </div>
                  <span>Mon</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-10">
                  <div className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-t-md w-full h-24 relative group">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded px-1.5 py-0.5 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">$280</span>
                  </div>
                  <span>Tue</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-10">
                  <div className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-t-md w-full h-36 relative group">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded px-1.5 py-0.5 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">$420</span>
                  </div>
                  <span>Wed</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-10">
                  <div className="bg-gray-900 hover:bg-gray-800 transition-colors rounded-t-md w-full h-44 relative group">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded px-1.5 py-0.5 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">$520</span>
                  </div>
                  <span>Thu</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-10">
                  <div className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-t-md w-full h-28 relative group">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded px-1.5 py-0.5 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">$330</span>
                  </div>
                  <span>Fri</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-10">
                  <div className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-t-md w-full h-32 relative group">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded px-1.5 py-0.5 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">$390</span>
                  </div>
                  <span>Sat</span>
                </div>
                <div className="flex flex-col items-center space-y-2 w-10">
                  <div className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-t-md w-full h-12 relative group">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded px-1.5 py-0.5 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">$90</span>
                  </div>
                  <span>Sun</span>
                </div>
              </div>
            </div>

            {/* Critical Low Stock list */}
            <div className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-gray-400">Critical Stock Replenish</h3>
              
              {products.filter(p => p.stock <= 5).length === 0 ? (
                <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100/50 p-4 rounded-xl">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>All inventory Sku are fully stocked!</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {products.filter(p => p.stock <= 5).map(p => {
                    const isBook = p.type === 'book';
                    return (
                      <div key={p.id} className="flex items-center justify-between p-3 border border-red-50/50 rounded-xl bg-red-50/10">
                        <div className="flex items-center space-x-2.5">
                          <img src={p.image} alt={p.id} className="w-8 h-10 object-cover rounded border border-gray-100" />
                          <div className="text-xs">
                            <p className="font-bold text-gray-800 line-clamp-1">
                              {isBook ? (p as Book).title : (p as Pen).model}
                            </p>
                            <p className="text-[10px] text-red-500 font-bold font-mono">Stock level: {p.stock}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleReplenishStock(p.id)}
                          className="px-2.5 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-[9px] font-bold tracking-wider flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                          <span>+20 Units</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: PRODUCTS LIST & MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold font-display text-gray-900">Manage Sku Inventory ({products.length})</h3>
            <button
              onClick={handleCreateProductClick}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Interactive Form for Product Create/Edit */}
          {showProductForm && (
            <form onSubmit={handleSaveProduct} className="bg-gray-50 rounded-3xl border border-gray-200 p-6 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-gray-600">
                  {editingProduct ? 'Modify Product Specifications' : 'Create New Product Specification'}
                </h4>
                <div className="flex gap-2">
                  {!editingProduct && (
                    <div className="flex bg-gray-200 rounded-lg p-0.5 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setFormType('book')}
                        className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                          formType === 'book' ? 'bg-white text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        Book
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormType('pen')}
                        className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                          formType === 'pen' ? 'bg-white text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        Pen
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="text-xs text-gray-400 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Dynamic Form fields based on product type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                {formType === 'book' ? (
                  <>
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">Book Title</label>
                      <input
                        type="text"
                        required
                        value={bTitle}
                        onChange={(e) => setBTitle(e.target.value)}
                        placeholder="e.g., Code &amp; Coffee"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">Author</label>
                      <input
                        type="text"
                        required
                        value={bAuthor}
                        onChange={(e) => setBAuthor(e.target.value)}
                        placeholder="e.g., Alan Turing"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">Category</label>
                      <select
                        value={bCategory}
                        onChange={(e) => setBCategory(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                      >
                        {CATEGORIES.books.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">Publisher</label>
                      <input
                        type="text"
                        value={bPublisher}
                        onChange={(e) => setBPublisher(e.target.value)}
                        placeholder="e.g., MIT Press"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">ISBN Code</label>
                      <input
                        type="text"
                        value={bIsbn}
                        onChange={(e) => setBIsbn(e.target.value)}
                        placeholder="e.g., 978-012-345"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 font-mono focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">Pen Brand</label>
                      <select
                        value={pBrand}
                        onChange={(e) => setPBrand(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                      >
                        {BRANDS.filter(b => b !== 'All').map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">Model Name</label>
                      <input
                        type="text"
                        required
                        value={pModel}
                        onChange={(e) => setPModel(e.target.value)}
                        placeholder="e.g., Carbon Bolt-Action"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">Ink Color</label>
                      <input
                        type="text"
                        value={pInkColor}
                        onChange={(e) => setPInkColor(e.target.value)}
                        placeholder="e.g., Emerald Green"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">Tip Size</label>
                      <input
                        type="text"
                        value={pTipSize}
                        onChange={(e) => setPTipSize(e.target.value)}
                        placeholder="e.g., Fine (0.5mm)"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-medium mb-1">Material</label>
                      <input
                        type="text"
                        value={pMaterial}
                        onChange={(e) => setPMaterial(e.target.value)}
                        placeholder="e.g., Polished Carbon"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                      />
                    </div>
                  </>
                )}

                {/* Shared Product Fields */}
                <div>
                  <label className="block text-gray-500 font-medium mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 font-mono focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-medium mb-1">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={pDiscount}
                    onChange={(e) => setPDiscount(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 font-mono focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-medium mb-1">Stock Level</label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 font-mono focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-gray-500 font-medium mb-1">Image URL</label>
                  <input
                    type="text"
                    value={pImage}
                    onChange={(e) => setPImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 font-mono focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-gray-500 font-medium mb-1">Product Description</label>
                  <textarea
                    rows={3}
                    value={pDescription}
                    onChange={(e) => setPDescription(e.target.value)}
                    placeholder="Describe the aesthetic and functional properties of this item..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                  ></textarea>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Sku Specifications
                </button>
              </div>
            </form>
          )}

          {/* Desktop Table of all products */}
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-mono uppercase tracking-wider">
                    <th className="p-4">SKU / Item</th>
                    <th className="p-4">Class</th>
                    <th className="p-4">Pricing</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-sans">
                  {products.map((p) => {
                    const isBook = p.type === 'book';
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 flex items-center space-x-3 max-w-[280px]">
                          <img src={p.image} alt="" className="w-8 h-10 object-cover rounded bg-gray-50 border border-gray-100 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate">
                              {isBook ? (p as Book).title : (p as Pen).model}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate">
                              {isBook ? `by ${(p as Book).author}` : `${(p as Pen).brand}`}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 uppercase font-mono tracking-wider text-[10px] text-gray-500">
                          {isBook ? 'Book' : 'Pen'}
                        </td>
                        <td className="p-4 font-mono">
                          <p className="font-bold text-gray-900">${p.price.toFixed(2)}</p>
                          {p.discount > 0 && <p className="text-[9px] text-red-500 font-semibold">{p.discount}% Off applied</p>}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                            p.stock <= 5
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100/50'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEditProductClick(p)}
                              className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-md transition-colors"
                              title="Edit specifications"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md transition-colors"
                              title="Delete SKU"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ORDER LISTS */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <h3 className="text-sm font-bold font-display text-gray-900">Review Customer Orders ({orders.length})</h3>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-xs text-gray-500 font-semibold">No placed customer orders yet.</p>
            </div>
          ) : (
            <div className="space-y-4 font-sans text-xs">
              {orders.map((o) => (
                <div key={o.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs">
                  {/* Order header row */}
                  <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                    <div className="flex items-center space-x-4">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-gray-400 block">ORDER ID</span>
                        <span className="font-mono font-bold text-gray-900">{o.id}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-gray-400 block">ORDER DATE</span>
                        <span className="font-bold text-gray-800">{o.date}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-gray-400 block">GRAND TOTAL</span>
                        <span className="font-mono font-bold text-gray-900">${o.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Status updater */}
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 uppercase text-[9px] font-bold">Status:</span>
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-bold border ${
                          o.status === 'Processing'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : o.status === 'Shipped'
                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                            : o.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Order contents block */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Items ordered list */}
                    <div className="md:col-span-7 space-y-2.5">
                      <p className="text-gray-400 uppercase tracking-wider text-[9px] font-bold mb-1">Items Summary</p>
                      {o.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <img src={item.image} alt="" className="w-6 h-8 object-cover rounded border border-gray-100" />
                            <div>
                              <p className="font-bold text-gray-800 line-clamp-1">{item.name}</p>
                              <p className="text-[10px] text-gray-400">{item.quantity} x ${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <span className="font-mono font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Address & payment specifications */}
                    <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 space-y-2.5">
                      <div>
                        <p className="text-gray-400 uppercase tracking-wider text-[9px] font-bold mb-0.5">Shipping Address</p>
                        <p className="font-bold text-gray-800">{o.shippingAddress.fullName}</p>
                        <p className="text-gray-500 text-[11px] mt-0.5">{o.shippingAddress.addressLine}, {o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.zipCode}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 uppercase tracking-wider text-[9px] font-bold mb-0.5">Payment Details</p>
                        <p className="text-gray-800 font-semibold">{o.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: COUPONS CREATION & STATE */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300 font-sans text-xs">
          {/* Coupon Creation (Left) */}
          <div className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-display text-gray-900 border-b border-gray-50 pb-3">
              Create Promotional Coupon
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-gray-500 font-medium mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="e.g., WINTERSALE"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-mono uppercase focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-gray-500 font-medium mb-1">Discount Class</label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-gray-900 focus:outline-hidden"
                >
                  <option value="percentage">Percentage Discount (%)</option>
                  <option value="fixed">Fixed Cash Discount ($)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 font-medium mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-mono focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-medium mb-1">Min Spend ($)</label>
                  <input
                    type="number"
                    value={newCouponMinSpend}
                    onChange={(e) => setNewCouponMinSpend(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-mono focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Register Promo Coupon
              </button>
            </form>
          </div>

          {/* Active Coupons List (Right) */}
          <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-display text-gray-900 border-b border-gray-50 pb-3">
              Active Promos &amp; Coupons
            </h3>

            <div className="space-y-3">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className={`flex items-center justify-between p-3 border rounded-2xl transition-all ${
                    c.isActive
                      ? 'bg-emerald-50/20 border-emerald-100 text-gray-800'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Tag className={`w-5 h-5 ${c.isActive ? 'text-emerald-500' : 'text-gray-300'}`} />
                    <div>
                      <p className="font-mono font-bold text-sm tracking-wide">{c.code}</p>
                      <p className="text-[10px] mt-0.5">
                        Discount: {c.discountType === 'percentage' ? `${c.value}%` : `$${c.value}`} • Min Spend: ${c.minSpend || 0}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleCouponStatus(c.code)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                      c.isActive
                        ? 'bg-red-50 text-red-600 hover:bg-red-100/50'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100/50'
                    }`}
                  >
                    {c.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
