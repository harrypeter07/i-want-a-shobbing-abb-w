'use client';
import React, { useState } from 'react';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Ruler,
  CheckCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Send,
} from 'lucide-react';
import { Shoe, Currency, ShoeReview } from '@/types/shoe';
import { formatPrice } from '@/lib/utils';
import { useToast } from './Toast';

interface ShoeDetailModalProps {
  shoe: Shoe | null;
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (shoe: Shoe) => void;
  onAddToCart: (shoe: Shoe, size: number, color: string, quantity: number) => void;
  onBuyNow: (shoe: Shoe, size: number, color: string) => void;
  onOpenSizeGuide: () => void;
  onAddReview: (shoeId: string, review: Omit<ShoeReview, 'id' | 'date' | 'verified'>) => void;
}

export function ShoeDetailModal({
  shoe,
  isOpen,
  onClose,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onOpenSizeGuide,
  onAddReview,
}: ShoeDetailModalProps) {
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewFit, setReviewFit] = useState<'True to Size' | 'Runs Small' | 'Runs Large'>('True to Size');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!isOpen || !shoe) return null;

  const currentSize = selectedSize || shoe.sizes[0];
  const currentColor = shoe.colors[selectedColorIndex]?.name || shoe.colors[0]?.name;

  const handleAddToCart = () => {
    onAddToCart(shoe, currentSize, currentColor, quantity);
    toast({
      type: 'success',
      message: `Added ${shoe.name} to cart!`,
      description: `Size: US ${currentSize} • Color: ${currentColor}`,
    });
  };

  const handleBuyNow = () => {
    onBuyNow(shoe, currentSize, currentColor);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      toast({
        type: 'error',
        message: 'Please complete all review fields.',
      });
      return;
    }

    setIsSubmittingReview(true);
    setTimeout(() => {
      onAddReview(shoe.id, {
        author: reviewerName.trim() || 'Sneaker Enthusiast',
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
        fitFeedback: reviewFit,
      });

      toast({
        type: 'success',
        message: 'Review published!',
        description: 'Thank you for helping other sneakerheads find their fit.',
      });

      setShowReviewForm(false);
      setReviewTitle('');
      setReviewComment('');
      setIsSubmittingReview(false);
    }, 400);
  };

  const discountPercent =
    shoe.originalPrice && shoe.originalPrice > shoe.price
      ? Math.round(((shoe.originalPrice - shoe.price) / shoe.originalPrice) * 100)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              {shoe.brand}
            </span>
            <span className="text-xs text-slate-400">SKU: {shoe.sku}</span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Image Gallery */}
            <div className="md:col-span-6 space-y-4">
              {/* Main Featured Photo */}
              <div className="relative h-72 sm:h-80 w-full rounded-2xl bg-gradient-to-b from-slate-950/60 to-slate-950 p-6 flex items-center justify-center border border-slate-800 overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shoe.images[selectedImageIndex] || shoe.images[0]}
                  alt={shoe.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {shoe.tag && (
                    <span className="px-2.5 py-1 rounded-full bg-indigo-600/90 text-white text-[11px] font-bold tracking-wider uppercase">
                      {shoe.tag}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-bold">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails Row */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {shoe.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl bg-slate-950 border p-2 flex-shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                        : 'border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${shoe.name} angle ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>

              {/* Trust highlights */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free Express Delivery (2-3 business days)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>100% Authenticity Guaranteed by Experts</span>
                </div>
              </div>
            </div>

            {/* Right Column: Information, Selectors & Checkout */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                    {shoe.gender} • {shoe.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= Math.round(shoe.rating) ? 'fill-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-white font-mono">{shoe.rating.toFixed(1)}</span>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="text-slate-400 underline hover:text-white"
                    >
                      ({shoe.reviewCount} reviews)
                    </button>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-tight">
                  {shoe.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-3xl font-black text-white font-mono">
                    {formatPrice(shoe.price, currency)}
                  </span>
                  {shoe.originalPrice && (
                    <span className="text-base text-slate-500 line-through font-mono">
                      {formatPrice(shoe.originalPrice, currency)}
                    </span>
                  )}
                  <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    In Stock ({shoe.stockCount} left)
                  </span>
                </div>
              </div>

              {/* Colorway Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Color: <strong className="text-white">{currentColor}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {shoe.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColorIndex(i)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                        selectedColorIndex === i
                          ? 'border-indigo-500 bg-indigo-500/10 text-white font-semibold'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Select Size: <strong className="text-white">US {currentSize}</strong>
                  </span>
                  <button
                    onClick={onOpenSizeGuide}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Size Guide & Chart
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {shoe.sizes.map((sz) => {
                    const isSelected = currentSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2 text-center rounded-xl text-xs font-mono font-bold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                            : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        US {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Picker & Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-base"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-white text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(shoe.stockCount, quantity + 1))}
                      className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-base"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart • {formatPrice(shoe.price * quantity, currency)}</span>
                  </button>

                  {/* Wishlist toggle */}
                  <button
                    onClick={() => onToggleWishlist(shoe)}
                    className={`p-3 rounded-xl border transition-all ${
                      isWishlisted
                        ? 'bg-rose-500/20 text-rose-500 border-rose-500/40'
                        : 'bg-slate-950 text-slate-400 hover:text-rose-400 border-slate-800'
                    }`}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Instant Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  <span>Instant Buy Now (Fast Checkout)</span>
                </button>
              </div>

              {/* Installments note */}
              <p className="text-[11px] text-slate-400 text-center">
                Or 4 interest-free installments of{' '}
                <strong className="text-white font-mono">
                  {formatPrice(shoe.price / 4, currency)}
                </strong>{' '}
                with Klarna or Afterpay
              </p>
            </div>
          </div>

          {/* Bottom Tabs: Overview, Specs, Reviews */}
          <div className="mt-10 border-t border-slate-800 pt-6">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-2 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 border-b-2 transition-all ${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Overview & Story
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 border-b-2 transition-all ${
                  activeTab === 'specs'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Tech Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Customer Reviews</span>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full font-mono">
                  {shoe.reviews.length}
                </span>
              </button>
            </div>

            <div className="pt-4 text-slate-300 text-sm">
              {activeTab === 'overview' && (
                <div className="space-y-4 leading-relaxed">
                  <p>{shoe.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                      <span className="text-xs text-indigo-400 font-bold block mb-1">Cushioning</span>
                      <span className="text-xs text-slate-200">{shoe.specs.cushioning}</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                      <span className="text-xs text-indigo-400 font-bold block mb-1">Engineered Upper</span>
                      <span className="text-xs text-slate-200">{shoe.specs.upper}</span>
                    </div>
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                      <span className="text-xs text-indigo-400 font-bold block mb-1">Outsole Grip</span>
                      <span className="text-xs text-slate-200">{shoe.specs.traction}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Shoe Weight</span>
                    <span className="text-sm font-bold text-white font-mono">{shoe.specs.weight}</span>
                  </div>
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Heel-to-Toe Drop</span>
                    <span className="text-sm font-bold text-white font-mono">{shoe.specs.heelDrop}</span>
                  </div>
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Midsole Technology</span>
                    <span className="text-sm font-bold text-white">{shoe.specs.cushioning}</span>
                  </div>
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Upper Construction</span>
                    <span className="text-sm font-bold text-white">{shoe.specs.upper}</span>
                  </div>
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Lacing & Closure</span>
                    <span className="text-sm font-bold text-white">{shoe.specs.closure}</span>
                  </div>
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block mb-1">Outsole Traction</span>
                    <span className="text-sm font-bold text-white">{shoe.specs.traction}</span>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Reviews Summary Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-black text-white font-mono">{shoe.rating.toFixed(1)}</div>
                      <div>
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Based on {shoe.reviewCount} verified sneakerhead reviews
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
                    >
                      <span>Write a Review</span>
                    </button>
                  </div>

                  {/* Interactive Review Form */}
                  {showReviewForm && (
                    <form
                      onSubmit={handleSubmitReview}
                      className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-4 animate-in fade-in"
                    >
                      <h4 className="text-sm font-bold text-white">Share Your Experience</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">Your Name</label>
                          <input
                            type="text"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            placeholder="e.g. Jordan K."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">Rating</label>
                          <div className="flex items-center gap-2 pt-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setReviewRating(s)}
                                className="p-1 hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    s <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-xs text-amber-300 font-mono font-bold ml-2">
                              {reviewRating} Stars
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">Review Headline</label>
                          <input
                            type="text"
                            required
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            placeholder="e.g. Best daily running shoes!"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">Fit Feedback</label>
                          <select
                            value={reviewFit}
                            onChange={(e) => setReviewFit(e.target.value as any)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            <option value="Runs Small">Runs Small (Recommend 0.5 size up)</option>
                            <option value="True to Size">True to Size (Perfect fit)</option>
                            <option value="Runs Large">Runs Large (Recommend 0.5 size down)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Review Details</label>
                        <textarea
                          rows={3}
                          required
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="How do they feel? Cushioning, arch support, durability..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingReview}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSubmittingReview ? 'Submitting...' : 'Post Review'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {shoe.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">
                              {rev.author.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white text-xs">{rev.author}</span>
                                {rev.verified && (
                                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Verified Buyer
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500">{rev.date}</span>
                            </div>
                          </div>

                          <div className="flex items-center text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-700'}`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <h5 className="font-bold text-white text-xs">{rev.title}</h5>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300">
                            {rev.fitFeedback}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
