'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Filter,
  Grid3X3,
  ListFilter,
  Sparkles,
  RotateCcw,
  ShoppingBag,
  SlidersHorizontal,
  Flame,
  Check,
  TrendingUp,
  Tag,
  Heart,
  LayoutGrid,
  Rows3,
} from 'lucide-react';

import { Shoe, CartItem, Order, Currency, ShoeReview } from '@/types/shoe';
import { INITIAL_SHOES } from '@/data/shoes';
import { ToastProvider, useToast } from '@/components/Toast';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { FilterSidebar, FilterState } from '@/components/FilterSidebar';
import { ShoeCard } from '@/components/ShoeCard';
import { ShoeDetailModal } from '@/components/ShoeDetailModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { WishlistDrawer } from '@/components/WishlistDrawer';
import { OrdersModal } from '@/components/OrdersModal';
import { SizeGuideModal } from '@/components/SizeGuideModal';
import { Footer } from '@/components/Footer';
import { formatPrice } from '@/lib/utils';

export default function Page() {
  return (
    <ToastProvider>
      <ShoeStoreContent />
    </ToastProvider>
  );
}

function ShoeStoreContent() {
  const { toast } = useToast();

  // Primary Data State
  const [shoes, setShoes] = useState<Shoe[]>(INITIAL_SHOES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Shoe[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');

  // View state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('All');
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    brand: 'All',
    selectedSize: null,
    maxPrice: 450,
    minPrice: 0,
    inStockOnly: false,
    tag: 'All',
    sortBy: 'featured',
  });

  // Modals & Drawers State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);

  // Checkout transfer state
  const [checkoutPromo, setCheckoutPromo] = useState<string | undefined>('KICKS20');
  const [checkoutDiscountPercent, setCheckoutDiscountPercent] = useState<number>(20);

  const productSectionRef = useRef<HTMLDivElement>(null);

  // Load saved state from LocalStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('solevault_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('solevault_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem('solevault_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedCurrency = localStorage.getItem('solevault_currency') as Currency;
      if (savedCurrency) setCurrency(savedCurrency);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Try fetching live shoes & initial orders from backend API
    fetch('/api/shoes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setShoes(data.data);
        }
      })
      .catch((err) => console.warn('Shoe fetch error, using initial dataset:', err));

    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders && data.orders.length > 0) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.warn('Orders fetch error:', err));
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('solevault_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Save Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('solevault_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  // Save Orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('solevault_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  // Save Currency to LocalStorage
  const handleCurrencyChange = (c: Currency) => {
    setCurrency(c);
    try {
      localStorage.setItem('solevault_currency', c);
    } catch (e) {}
    toast({
      type: 'info',
      message: `Currency switched to ${c}`,
    });
  };

  // Distinct Brands and Categories for filters
  const availableBrands = useMemo(() => {
    return Array.from(new Set(shoes.map((s) => s.brand))).sort();
  }, [shoes]);

  const availableCategories = useMemo(() => {
    return Array.from(new Set(shoes.map((s) => s.category))).sort();
  }, [shoes]);

  const shoeNames = useMemo(() => {
    return shoes.map((s) => s.name);
  }, [shoes]);

  // Filtering & Sorting Engine
  const filteredShoes = useMemo(() => {
    let result = [...shoes];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.brand.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.colors.some((c) => c.name.toLowerCase().includes(q))
      );
    }

    // Gender filter
    if (selectedGender !== 'All') {
      result = result.filter(
        (s) => s.gender === selectedGender || s.gender === 'Unisex'
      );
    }

    // Category filter
    if (filters.category !== 'All') {
      result = result.filter(
        (s) => s.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Brand filter
    if (filters.brand !== 'All') {
      result = result.filter(
        (s) => s.brand.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    // Size filter
    if (filters.selectedSize !== null) {
      result = result.filter((s) => s.sizes.includes(filters.selectedSize as number));
    }

    // Max Price filter
    result = result.filter((s) => s.price <= filters.maxPrice);

    // In Stock Only
    if (filters.inStockOnly) {
      result = result.filter((s) => s.inStock && s.stockCount > 0);
    }

    // Special Tag filter
    if (filters.tag !== 'All') {
      result = result.filter((s) => s.tag === filters.tag);
    }

    // Sort
    if (filters.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'reviews') {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => (b.releaseYear || 2025) - (a.releaseYear || 2025));
    }

    return result;
  }, [shoes, searchQuery, selectedGender, filters]);

  // Cart Handlers
  const handleAddToCart = (
    shoe: Shoe,
    size: number,
    color: string,
    quantity: number = 1
  ) => {
    const cartItemId = `${shoe.id}-${size}-${color}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.id === cartItemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          shoeId: shoe.id,
          name: shoe.name,
          brand: shoe.brand,
          price: shoe.price,
          image: shoe.images[0],
          size,
          color,
          quantity,
        },
      ];
    });
  };

  const handleQuickAddToCart = (shoe: Shoe, size: number, color: string) => {
    handleAddToCart(shoe, size, color, 1);
    toast({
      type: 'success',
      message: `Added ${shoe.name} to cart!`,
      description: `Size: US ${size} • ${color}`,
    });
  };

  const handleBuyNow = (shoe: Shoe, size: number, color: string) => {
    handleAddToCart(shoe, size, color, 1);
    setSelectedShoe(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity: newQty } : i))
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    toast({
      type: 'info',
      message: 'Item removed from shoe bag',
    });
  };

  const handleClearCart = () => {
    setCart([]);
    toast({
      type: 'info',
      message: 'Shoe bag cleared',
    });
  };

  // Wishlist Handlers
  const handleToggleWishlist = (shoe: Shoe) => {
    const isSaved = wishlist.some((s) => s.id === shoe.id);
    if (isSaved) {
      setWishlist((prev) => prev.filter((s) => s.id !== shoe.id));
      toast({
        type: 'info',
        message: `Removed ${shoe.name} from wishlist`,
      });
    } else {
      setWishlist((prev) => [...prev, shoe]);
      toast({
        type: 'success',
        message: `Saved ${shoe.name} to wishlist!`,
      });
    }
  };

  const handleRemoveFromWishlist = (shoeId: string) => {
    setWishlist((prev) => prev.filter((s) => s.id !== shoeId));
  };

  const handleMoveWishlistToCart = (shoe: Shoe) => {
    handleAddToCart(shoe, shoe.sizes[0], shoe.colors[0]?.name || 'Default', 1);
    handleRemoveFromWishlist(shoe.id);
  };

  const handleMoveAllWishlistToCart = () => {
    wishlist.forEach((shoe) => {
      handleAddToCart(shoe, shoe.sizes[0], shoe.colors[0]?.name || 'Default', 1);
    });
    setWishlist([]);
    toast({
      type: 'success',
      message: 'All wishlist items moved to your shoe bag!',
    });
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  // Checkout Handlers
  const handleProceedToCheckout = (promo?: string, discountPct: number = 0) => {
    setCheckoutPromo(promo);
    setCheckoutDiscountPercent(discountPct);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
  };

  // Reviews submission
  const handleAddReview = async (
    shoeId: string,
    reviewData: Omit<ShoeReview, 'id' | 'date' | 'verified'>
  ) => {
    const newRev: ShoeReview = {
      id: `rev-${Date.now()}`,
      author: reviewData.author,
      rating: reviewData.rating,
      date: 'Just now',
      title: reviewData.title,
      comment: reviewData.comment,
      verified: true,
      fitFeedback: reviewData.fitFeedback,
    };

    setShoes((prev) =>
      prev.map((s) => {
        if (s.id === shoeId) {
          const updatedReviews = [newRev, ...s.reviews];
          const newAvgRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...s,
            reviews: updatedReviews,
            reviewCount: s.reviewCount + 1,
            rating: Math.round(newAvgRating * 10) / 10,
          };
        }
        return s;
      })
    );

    if (selectedShoe && selectedShoe.id === shoeId) {
      setSelectedShoe((prev) =>
        prev
          ? {
              ...prev,
              reviews: [newRev, ...prev.reviews],
              reviewCount: prev.reviewCount + 1,
            }
          : null
      );
    }

    try {
      await fetch(`/api/shoes/${shoeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
    } catch (e) {
      console.warn('API review sync error:', e);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      brand: 'All',
      selectedSize: null,
      maxPrice: 450,
      minPrice: 0,
      inStockOnly: false,
      tag: 'All',
      sortBy: 'featured',
    });
    setSelectedGender('All');
    setSearchQuery('');
    toast({
      type: 'info',
      message: 'All search filters reset.',
    });
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        cartCount={cartItemCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        currency={currency}
        onCurrencyChange={handleCurrencyChange}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedGender={selectedGender}
        onGenderChange={setSelectedGender}
        shoeNames={shoeNames}
      />

      {/* Hero Showcase Banner */}
      <HeroBanner
        featuredShoe={shoes[0]}
        currency={currency}
        onSelectShoe={(shoe) => setSelectedShoe(shoe)}
        onExploreClick={() => {
          productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Catalog Section */}
      <main
        ref={productSectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1"
      >
        {/* Category Pills Bar */}
        <div className="flex items-center justify-between gap-4 pb-6 overflow-x-auto border-b border-slate-800/80 mb-8">
          <div className="flex items-center gap-2">
            {['All', ...availableCategories].map((cat) => {
              const isActive = filters.category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilters({ ...filters, category: cat })}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Mobile Filter Sheet Trigger & View Mode Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span>Filters</span>
            </button>

            {/* Grid / List switch */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Detailed list view"
              >
                <Rows3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout: Filters Sidebar + Shoe Cards Grid */}
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={handleResetFilters}
            currency={currency}
            totalResults={filteredShoes.length}
            availableBrands={availableBrands}
            availableCategories={availableCategories}
            isMobileOpen={isMobileFilterOpen}
            onMobileClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Products Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Active Filters Bar */}
            {(filters.category !== 'All' ||
              filters.brand !== 'All' ||
              filters.selectedSize !== null ||
              filters.tag !== 'All' ||
              selectedGender !== 'All' ||
              searchQuery) && (
              <div className="flex items-center flex-wrap gap-2 mb-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">Active Filters:</span>

                {searchQuery && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white flex items-center gap-1.5">
                    Search: &ldquo;{searchQuery}&rdquo;
                    <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-white">
                      ×
                    </button>
                  </span>
                )}

                {selectedGender !== 'All' && (
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center gap-1.5">
                    Gender: {selectedGender}
                    <button
                      onClick={() => setSelectedGender('All')}
                      className="text-indigo-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.category !== 'All' && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white flex items-center gap-1.5">
                    Category: {filters.category}
                    <button
                      onClick={() => setFilters({ ...filters, category: 'All' })}
                      className="text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.brand !== 'All' && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white flex items-center gap-1.5">
                    Brand: {filters.brand}
                    <button
                      onClick={() => setFilters({ ...filters, brand: 'All' })}
                      className="text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.selectedSize !== null && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white flex items-center gap-1.5 font-mono">
                    Size: US {filters.selectedSize}
                    <button
                      onClick={() => setFilters({ ...filters, selectedSize: null })}
                      className="text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )}

                {filters.tag !== 'All' && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white flex items-center gap-1.5">
                    Drop: {filters.tag}
                    <button
                      onClick={() => setFilters({ ...filters, tag: 'All' })}
                      className="text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )}

                <button
                  onClick={handleResetFilters}
                  className="ml-auto text-rose-400 hover:text-rose-300 font-semibold underline text-xs"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredShoes.length === 0 ? (
              <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Flame className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">No sneakers matched your filters</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Try clearing some filters or searching for another silhouette, brand or size.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid Layout (3 columns on desktop, 2 on tablet, 1 on mobile) */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredShoes.map((shoe) => (
                  <ShoeCard
                    key={shoe.id}
                    shoe={shoe}
                    currency={currency}
                    isWishlisted={wishlist.some((s) => s.id === shoe.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onOpenDetail={(s) => setSelectedShoe(s)}
                    onQuickAddToCart={handleQuickAddToCart}
                  />
                ))}
              </div>
            ) : (
              /* Detailed List View */
              <div className="space-y-4">
                {filteredShoes.map((shoe) => {
                  const isWish = wishlist.some((s) => s.id === shoe.id);
                  return (
                    <div
                      key={shoe.id}
                      onClick={() => setSelectedShoe(shoe)}
                      className="group flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer"
                    >
                      <div className="w-full sm:w-48 h-40 bg-slate-950 rounded-xl p-3 flex items-center justify-center shrink-0 border border-slate-800 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={shoe.images[0]}
                          alt={shoe.name}
                          className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5 w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                            {shoe.brand} • {shoe.category}
                          </span>
                          {shoe.tag && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold uppercase">
                              {shoe.tag}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {shoe.name}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {shoe.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
                          <span>Drop: {shoe.specs.heelDrop}</span>
                          <span>•</span>
                          <span>Weight: {shoe.specs.weight}</span>
                          <span>•</span>
                          <span className="text-amber-400">★ {shoe.rating.toFixed(1)} ({shoe.reviewCount})</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        <div className="text-right">
                          <span className="text-xl font-black text-white font-mono block">
                            {formatPrice(shoe.price, currency)}
                          </span>
                          {shoe.originalPrice && (
                            <span className="text-xs text-slate-500 line-through font-mono">
                              {formatPrice(shoe.originalPrice, currency)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleWishlist(shoe)}
                            className={`p-2.5 rounded-xl border transition-colors ${
                              isWish
                                ? 'bg-rose-500/20 text-rose-500 border-rose-500/40'
                                : 'bg-slate-900 text-slate-400 hover:text-rose-400 border-slate-800'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleQuickAddToCart(shoe, shoe.sizes[0], shoe.colors[0].name)}
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals & Drawers */}
      <ShoeDetailModal
        shoe={selectedShoe}
        isOpen={Boolean(selectedShoe)}
        onClose={() => setSelectedShoe(null)}
        currency={currency}
        isWishlisted={Boolean(selectedShoe && wishlist.some((s) => s.id === selectedShoe.id))}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onAddReview={handleAddReview}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        currency={currency}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={handleMoveWishlistToCart}
        onMoveAllToCart={handleMoveAllWishlistToCart}
        currency={currency}
        onOpenShoe={(shoe) => setSelectedShoe(shoe)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={currency}
        appliedPromo={checkoutPromo}
        discountPercent={checkoutDiscountPercent}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        currency={currency}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}