'use client';
import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Shoe, Currency } from '@/types/shoe';
import { formatPrice } from '@/lib/utils';

interface ShoeCardProps {
  shoe: Shoe;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (shoe: Shoe) => void;
  onOpenDetail: (shoe: Shoe) => void;
  onQuickAddToCart: (shoe: Shoe, size: number, color: string) => void;
}

export function ShoeCard({
  shoe,
  currency,
  isWishlisted,
  onToggleWishlist,
  onOpenDetail,
  onQuickAddToCart,
}: ShoeCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickSizes, setShowQuickSizes] = useState(false);
  const [addedTemp, setAddedTemp] = useState(false);

  const discountPercent =
    shoe.originalPrice && shoe.originalPrice > shoe.price
      ? Math.round(((shoe.originalPrice - shoe.price) / shoe.originalPrice) * 100)
      : null;

  const currentImage =
    isHovered && shoe.images[1] ? shoe.images[1] : shoe.images[0];

  const handleSelectSize = (e: React.MouseEvent, size: number) => {
    e.stopPropagation();
    onQuickAddToCart(shoe, size, shoe.colors[selectedColorIndex].name);
    setShowQuickSizes(false);
    setAddedTemp(true);
    setTimeout(() => setAddedTemp(false), 1500);
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSizes(false);
      }}
    >
      {/* Top Badges & Wishlist Action */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 flex-wrap">
          {shoe.tag && (
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm ${
                shoe.tag === 'Best Seller'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : shoe.tag === 'Sale'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : shoe.tag === 'Limited Edition'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              }`}
            >
              {shoe.tag}
            </span>
          )}
          {discountPercent && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
              -{discountPercent}%
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(shoe);
          }}
          className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
              : 'bg-slate-950/60 text-slate-400 hover:text-rose-400 border border-slate-800'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Shoe Image Area */}
      <div
        className="relative h-60 w-full bg-gradient-to-b from-slate-900/50 to-slate-950/80 p-6 flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => onOpenDetail(shoe)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage}
          alt={shoe.name}
          className="w-full h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick View Hover Pill */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-4 py-2 rounded-xl bg-slate-900/90 text-white text-xs font-semibold border border-slate-700 shadow-xl backdrop-blur-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            Quick View Details
          </span>
        </div>
      </div>

      {/* Shoe Info Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-indigo-400 uppercase tracking-wider text-[11px]">
              {shoe.brand} • {shoe.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-white text-xs">{shoe.rating.toFixed(1)}</span>
              <span className="text-slate-500 text-[11px]">({shoe.reviewCount})</span>
            </div>
          </div>

          {/* Model Name */}
          <h3
            onClick={() => onOpenDetail(shoe)}
            className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-1"
            title={shoe.name}
          >
            {shoe.name}
          </h3>

          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {shoe.description}
          </p>
        </div>

        {/* Color swatches preview */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {shoe.colors.map((color, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIndex(idx);
                }}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedColorIndex === idx
                    ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-slate-950 scale-110 border-white'
                    : 'border-slate-700 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            <span className="text-[10px] text-slate-400 ml-1">
              {shoe.colors[selectedColorIndex]?.name}
            </span>
          </div>

          <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {shoe.stockCount} in stock
          </span>
        </div>

        {/* Price and Add to Cart Button */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 relative">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-white font-mono">
              {formatPrice(shoe.price, currency)}
            </span>
            {shoe.originalPrice && (
              <span className="text-xs text-slate-500 line-through font-mono">
                {formatPrice(shoe.originalPrice, currency)}
              </span>
            )}
          </div>

          {/* Quick Add Button or Size popover */}
          <div className="relative">
            {addedTemp ? (
              <button
                disabled
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                Added!
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickSizes(!showQuickSizes);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-700 hover:border-indigo-500"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>+ Cart</span>
              </button>
            )}

            {/* Quick Size Dropdown Popover */}
            {showQuickSizes && (
              <div
                className="absolute bottom-full right-0 mb-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2.5 z-30 animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <span>Select US Size</span>
                  <span className="text-indigo-400">{shoe.gender}</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {shoe.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={(e) => handleSelectSize(e, size)}
                      className="py-1 text-center rounded bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-mono font-medium transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
