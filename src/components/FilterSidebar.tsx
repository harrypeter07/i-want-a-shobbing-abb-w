'use client';
import React from 'react';
import { Filter, RotateCcw, Check, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Currency } from '@/types/shoe';
import { formatPrice } from '@/lib/utils';

export interface FilterState {
  category: string;
  brand: string;
  selectedSize: number | null;
  maxPrice: number;
  minPrice: number;
  inStockOnly: boolean;
  tag: string;
  sortBy: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  currency: Currency;
  totalResults: number;
  availableBrands: string[];
  availableCategories: string[];
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const ALL_SIZES = [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13];

const TAG_OPTIONS = ['All', 'Best Seller', 'New Drop', 'Sale', 'Limited Edition', 'Staff Pick'];

export function FilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  currency,
  totalResults,
  availableBrands,
  availableCategories,
  isMobileOpen,
  onMobileClose,
}: FilterSidebarProps) {
  const isFiltered =
    filters.category !== 'All' ||
    filters.brand !== 'All' ||
    filters.selectedSize !== null ||
    filters.maxPrice < 450 ||
    filters.inStockOnly ||
    filters.tag !== 'All';

  const content = (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Filters & Sort</h2>
        </div>

        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
        )}
      </div>

      {/* Sort By Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Sort Products
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
        >
          <option value="featured">Featured / Recommended</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated (★ 5.0)</option>
          <option value="reviews">Most Popular (Reviews)</option>
          <option value="newest">Newest Releases</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Category
        </label>
        <div className="flex flex-col gap-1">
          {['All', ...availableCategories].map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => onFilterChange({ ...filters, category: cat })}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Filters */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Brand
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {['All', ...availableBrands].map((brand) => {
            const isSelected = filters.brand === brand;
            return (
              <button
                key={brand}
                onClick={() => onFilterChange({ ...filters, brand })}
                className={`text-left px-2.5 py-1.5 rounded-lg text-xs truncate transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      {/* Shoe Sizes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            US Size
          </label>
          {filters.selectedSize && (
            <button
              onClick={() => onFilterChange({ ...filters, selectedSize: null })}
              className="text-[11px] text-indigo-400 hover:underline"
            >
              Clear size
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {ALL_SIZES.map((sz) => {
            const isSelected = filters.selectedSize === sz;
            return (
              <button
                key={sz}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    selectedSize: isSelected ? null : sz,
                  })
                }
                className={`py-1.5 text-center rounded-lg text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-300 uppercase tracking-wider">
            Max Price
          </label>
          <span className="font-mono font-bold text-indigo-400">
            {formatPrice(filters.maxPrice, currency)}
          </span>
        </div>
        <input
          type="range"
          min="80"
          max="500"
          step="10"
          value={filters.maxPrice}
          onChange={(e) =>
            onFilterChange({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>{formatPrice(80, currency)}</span>
          <span>{formatPrice(500, currency)}</span>
        </div>
      </div>

      {/* Special Tags / Drops */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Special Drops & Badges
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TAG_OPTIONS.map((tag) => {
            const isSelected = filters.tag === tag;
            return (
              <button
                key={tag}
                onClick={() => onFilterChange({ ...filters, tag })}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* In-Stock Toggle */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-300">In-Stock Only</span>
        <button
          onClick={() =>
            onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly })
          }
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            filters.inStockOnly ? 'bg-indigo-600' : 'bg-slate-800'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              filters.inStockOnly ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Results badge */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          Showing <strong className="text-white font-mono">{totalResults}</strong> kicks found
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-slate-950 border-l border-slate-800 p-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <span className="font-bold text-white text-base">Filter Shoes</span>
              <button
                onClick={onMobileClose}
                className="text-slate-400 hover:text-white px-2 py-1 text-sm font-medium"
              >
                Done
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
