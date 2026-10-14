'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  Package,
  X,
  Sparkles,
  Flame,
  ChevronDown,
  Percent,
} from 'lucide-react';
import { Currency } from '@/types/shoe';
import { formatPrice } from '@/lib/utils';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrders: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGender: string;
  onGenderChange: (g: string) => void;
  shoeNames: string[];
}

export function Navbar({
  cartCount,
  cartTotal,
  wishlistCount,
  currency,
  onCurrencyChange,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  searchQuery,
  onSearchChange,
  selectedGender,
  onGenderChange,
  shoeNames,
}: NavbarProps) {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut '/' or 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && document.activeElement !== searchInputRef.current)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter suggestions
  const suggestions = shoeNames
    .filter((name) =>
      searchQuery ? name.toLowerCase().includes(searchQuery.toLowerCase()) : false
    )
    .slice(0, 5);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-all">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900/60 border-b border-indigo-500/10 px-4 py-1.5 text-xs text-center text-slate-300 flex items-center justify-center gap-3 overflow-hidden">
        <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>SPRING26 DROP: Use code <strong className="text-white underline decoration-indigo-400 font-mono tracking-wider">KICKS20</strong> for 20% off</span>
        </span>
        <span className="hidden sm:inline-block text-slate-600">•</span>
        <span className="hidden sm:inline-block text-slate-400">
          Free Express Shipping over $150 & 30-Day Guaranteed Returns
        </span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white font-sans">
                  SOLE<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-300">VAULT</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  SHOBBING ABB
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 font-medium hidden sm:block">
                Curated High-Performance & Lifestyle Kicks
              </p>
            </div>
          </div>
        </div>

        {/* Gender Tabs */}
        <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium">
          {['All', 'Men', 'Women', 'Unisex'].map((gender) => (
            <button
              key={gender}
              onClick={() => onGenderChange(gender)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedGender === gender
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md hidden sm:block" ref={dropdownRef}>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search kicks by model, brand, color, tag..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-16 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  onSearchChange('');
                  setShowSearchDropdown(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-0.5 text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                <span>⌘</span>
                <span>K</span>
              </div>
            )}
          </div>

          {/* Autocomplete dropdown */}
          {showSearchDropdown && searchQuery && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in duration-150">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Matching Shoes
              </div>
              {suggestions.map((name, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSearchChange(name);
                    setShowSearchDropdown(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm text-slate-200 hover:bg-slate-800/80 flex items-center gap-2 group transition-colors"
                >
                  <Search className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="truncate">{name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Action Icons & Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Toggle */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <span className="font-mono font-semibold">{currency}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-24 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs">
                {(['USD', 'EUR', 'GBP'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onCurrencyChange(c);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 font-mono transition-colors ${
                      currency === c ? 'text-indigo-400 font-bold bg-slate-800/40' : 'text-slate-300'
                    }`}
                  >
                    {c} {c === 'USD' ? '($)' : c === 'EUR' ? '(€)' : '(£)'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Orders Tracking */}
          <button
            onClick={onOpenOrders}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors relative group"
            title="My Orders & Tracking"
          >
            <Package className="w-5 h-5 group-hover:scale-105 transition-transform" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-rose-500/30 transition-colors relative group"
            title="Saved Wishlist"
          >
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/25 transition-all group active:scale-95"
            title="Open Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 group-hover:rotate-6 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-slate-950">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-mono font-bold">
              {formatPrice(cartTotal, currency)}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search input row */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search shoes by name, brand..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
