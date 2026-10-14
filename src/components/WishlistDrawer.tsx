'use client';
import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Shoe, Currency } from '@/types/shoe';
import { formatPrice } from '@/lib/utils';
import { useToast } from './Toast';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Shoe[];
  onRemoveFromWishlist: (shoeId: string) => void;
  onMoveToCart: (shoe: Shoe) => void;
  onMoveAllToCart: () => void;
  currency: Currency;
  onOpenShoe: (shoe: Shoe) => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onMoveToCart,
  onMoveAllToCart,
  currency,
  onOpenShoe,
}: WishlistDrawerProps) {
  const { toast } = useToast();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Saved Wishlist</span>
                <span className="text-xs font-mono font-normal text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                  {wishlist.length}
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">No saved kicks yet</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Tap the heart on any shoe to save it to your personal wishlist for later.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all"
              >
                Explore Sneakers
              </button>
            </div>
          ) : (
            wishlist.map((shoe) => (
              <div
                key={shoe.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer group"
                onClick={() => {
                  onOpenShoe(shoe);
                  onClose();
                }}
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-slate-950 p-2 flex items-center justify-center shrink-0 border border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shoe.images[0]}
                    alt={shoe.name}
                    className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    {shoe.brand}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate">{shoe.name}</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-mono font-bold text-sm text-white">
                      {formatPrice(shoe.price, currency)}
                    </span>
                    {shoe.originalPrice && (
                      <span className="font-mono text-[10px] text-slate-500 line-through">
                        {formatPrice(shoe.originalPrice, currency)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      onMoveToCart(shoe);
                      toast({
                        type: 'success',
                        message: `Moved ${shoe.name} to cart!`,
                      });
                    }}
                    className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(shoe.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-2">
            <button
              onClick={onMoveAllToCart}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Cart ({wishlist.length})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
