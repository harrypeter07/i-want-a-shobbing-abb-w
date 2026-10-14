'use client';
import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, RotateCcw, Truck, Award } from 'lucide-react';
import { Shoe, Currency } from '@/types/shoe';
import { formatPrice } from '@/lib/utils';

interface HeroBannerProps {
  featuredShoe: Shoe;
  currency: Currency;
  onSelectShoe: (shoe: Shoe) => void;
  onExploreClick: () => void;
}

export function HeroBanner({
  featuredShoe,
  currency,
  onSelectShoe,
  onExploreClick,
}: HeroBannerProps) {
  const BRANDS = [
    'NIKE',
    'JORDAN',
    'ADIDAS',
    'NEW BALANCE',
    'SALOMON',
    'ASICS',
    'HOKA ONE ONE',
    'ON RUNNING',
    'PUMA',
  ];

  return (
    <div className="relative overflow-hidden pt-6 pb-12 sm:pb-16 border-b border-slate-800/60 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>SPRING 2026 DROP NOW LIVE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08] uppercase">
              Speed Redefined. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                Limitless Flight.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Discover authentic performance sneakers and grail streetwear silhouettes.
              Featuring featherweight carbon propulsion plates, responsive superfoams, and
              curated heritage icons.
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 group transition-all"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onSelectShoe(featuredShoe)}
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm backdrop-blur-md transition-all flex items-center gap-2"
              >
                <span>Spotlight: {featuredShoe.name}</span>
                <span className="font-mono text-indigo-400">
                  {formatPrice(featuredShoe.price, currency)}
                </span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 max-w-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">100% Authentic</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Free 2-Day Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-violet-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">30-Day Returns</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Spotlight Shoe Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative group cursor-pointer" onClick={() => onSelectShoe(featuredShoe)}>
              {/* Glow backdrop */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-25 blur-xl group-hover:opacity-40 transition-opacity" />

              <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl backdrop-blur-xl overflow-hidden">
                {/* Header tag */}
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-rose-400" />
                    Flagship Pick
                  </span>
                  <span className="text-xs font-mono text-slate-400">SKU: {featuredShoe.sku}</span>
                </div>

                {/* Main Shoe Image with smooth hover zoom */}
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-950/60 my-3 flex items-center justify-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredShoe.images[0]}
                    alt={featuredShoe.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500"
                  />
                  {/* Floating Tech Pill */}
                  <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-300 backdrop-blur-md">
                    ⚡ {featuredShoe.specs.weight} • {featuredShoe.specs.heelDrop}
                  </div>
                </div>

                {/* Shoe Details Footer */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-indigo-400 tracking-wider">
                      {featuredShoe.brand} • {featuredShoe.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      <span>★</span>
                      <span className="font-bold text-white">{featuredShoe.rating}</span>
                      <span className="text-slate-400">({featuredShoe.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {featuredShoe.name}
                  </h3>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white font-mono">
                        {formatPrice(featuredShoe.price, currency)}
                      </span>
                      {featuredShoe.originalPrice && (
                        <span className="text-sm text-slate-500 line-through font-mono">
                          {formatPrice(featuredShoe.originalPrice, currency)}
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-indigo-400 group-hover:underline font-semibold flex items-center gap-1">
                      Quick View & Specs
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand ticker strip */}
        <div className="mt-12 pt-6 border-t border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest text-center mb-4">
            Official Retailer & Authenticated Stocks From Global Brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70">
            {BRANDS.map((brand, i) => (
              <span
                key={i}
                className="text-xs sm:text-sm font-black tracking-widest text-slate-400 hover:text-white transition-colors cursor-default"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
