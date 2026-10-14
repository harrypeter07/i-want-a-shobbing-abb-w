'use client';
import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  Check,
  Truck,
} from 'lucide-react';
import { CartItem, Currency } from '@/types/shoe';
import { formatPrice } from '@/lib/utils';
import { useToast } from './Toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  currency: Currency;
  onProceedToCheckout: (appliedPromo?: string, discountPercent?: number) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currency,
  onProceedToCheckout,
}: CartDrawerProps) {
  const { toast } = useToast();
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>('KICKS20');
  const [discountPercent, setDiscountPercent] = useState<number>(20);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 150;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedPromo ? (subtotal * discountPercent) / 100 : 0;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || appliedPromo === 'FREESHIP';
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : 12;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const estimatedTax = items.length === 0 ? 0 : Math.round(taxableAmount * 0.08 * 100) / 100;
  const total = items.length === 0 ? 0 : Math.max(0, taxableAmount + shippingFee + estimatedTax);

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'KICKS20') {
      setAppliedPromo('KICKS20');
      setDiscountPercent(20);
      toast({
        type: 'success',
        message: 'Promo code KICKS20 applied!',
        description: 'Enjoy 20% off your footwear purchase.',
      });
      setPromoInput('');
    } else if (code === 'FREESHIP') {
      setAppliedPromo('FREESHIP');
      setDiscountPercent(0);
      toast({
        type: 'success',
        message: 'Free shipping promo activated!',
      });
      setPromoInput('');
    } else if (code === 'SOLE50') {
      setAppliedPromo('SOLE50');
      setDiscountPercent(50);
      toast({
        type: 'success',
        message: 'Super sneakerhead code applied: 50% OFF!',
      });
      setPromoInput('');
    } else {
      toast({
        type: 'error',
        message: 'Invalid promo code',
        description: 'Try using code KICKS20 or FREESHIP.',
      });
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setDiscountPercent(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Your Shoe Bag</span>
                <span className="text-xs font-mono font-normal text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                  {items.reduce((s, i) => s + i.quantity, 0)} items
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors px-2 py-1"
                title="Clear all cart items"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Free Shipping Tracker Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-5 py-3 text-xs">
          <div className="flex items-center justify-between text-slate-300 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-indigo-400" />
              {isFreeShipping ? (
                <span className="text-emerald-400 font-bold">You qualify for FREE Express Shipping!</span>
              ) : (
                <span>
                  Add <strong className="text-white font-mono">{formatPrice(amountToFreeShipping, currency)}</strong> more for free shipping
                </span>
              )}
            </span>
            <span className="font-mono text-[11px] text-slate-400">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isFreeShipping ? 'bg-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-violet-400'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">Your shoe bag is empty</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Looks like you haven&apos;t added any kicks yet. Check out the latest running and streetwear drops!
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xl bg-slate-950 p-2 flex items-center justify-center shrink-0 border border-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                          {item.brand}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate max-w-[170px]" title={item.name}>
                          {item.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                      <span className="bg-slate-800 px-1.5 py-0.5 rounded">US {item.size}</span>
                      <span className="truncate max-w-[90px]">{item.color}</span>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-mono font-bold text-white text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-sm text-white">
                      {formatPrice(item.price * item.quantity, currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Promos and Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-3">
            {/* Promo code form */}
            {appliedPromo ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    Promo <strong>{appliedPromo}</strong> applied ({discountPercent}% OFF)
                  </span>
                </div>
                <button
                  onClick={handleRemovePromo}
                  className="text-slate-400 hover:text-rose-400 text-[11px] underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (try KICKS20)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 uppercase tracking-wider focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-400 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-slate-200">{formatPrice(subtotal, currency)}</span>
              </div>
              {appliedPromo && discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="font-mono">-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono text-slate-200">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400 font-bold uppercase text-[10px]">Free</span>
                  ) : (
                    formatPrice(shippingFee, currency)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-mono text-slate-200">{formatPrice(estimatedTax, currency)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>Total</span>
                <span className="font-mono text-indigo-400">{formatPrice(total, currency)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => onProceedToCheckout(appliedPromo || undefined, discountPercent)}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
