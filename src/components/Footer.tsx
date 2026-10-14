'use client';
import React, { useState } from 'react';
import { Flame, ShieldCheck, Truck, RotateCcw, Headphones, Send, Sparkles, Check } from 'lucide-react';
import { useToast } from './Toast';

export function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      return;
    }
    setIsSubscribed(true);
    toast({
      type: 'success',
      message: 'Welcome to the Vault Club!',
      description: 'Your $20 welcome code has been sent to your inbox.',
    });
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-20">
      {/* Guarantees Strip */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">100% Verified Authentic</h5>
              <p className="text-[11px] text-slate-500">Every pair inspected by master specialists</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Free Express Shipping</h5>
              <p className="text-[11px] text-slate-500">On all orders over $150 with fast tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">30-Day Hassle-Free Returns</h5>
              <p className="text-[11px] text-slate-500">Free prepaid return labels included</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">24/7 Sneaker Concierge</h5>
              <p className="text-[11px] text-slate-500">Live chat assistance for fit & styling</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-400 flex items-center justify-center text-white">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-white font-sans">
                SOLE<span className="text-indigo-400">VAULT</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              &quot;i want a shobbing abb w&quot; — Built with Next.js 14 App Router, Tailwind CSS, TypeScript, and MongoDB. The premier destination for performance runners, rare court drops, and iconic streetwear kicks.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Join the Drop Alert & Save $20
              </p>
              {isSubscribed ? (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>You&apos;re subscribed to VIP release alerts!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Join</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Footwear</h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li className="hover:text-white cursor-pointer transition-colors">Marathon Racing</li>
              <li className="hover:text-white cursor-pointer transition-colors">Court Basketball</li>
              <li className="hover:text-white cursor-pointer transition-colors">Retro Lifestyle</li>
              <li className="hover:text-white cursor-pointer transition-colors">Trail & Gorpcore</li>
              <li className="hover:text-white cursor-pointer transition-colors">Skate Classics</li>
              <li className="hover:text-white cursor-pointer transition-colors">Limited Vault Releases</li>
            </ul>
          </div>

          {/* Brands */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Top Brands</h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li className="hover:text-white cursor-pointer transition-colors">Nike Running</li>
              <li className="hover:text-white cursor-pointer transition-colors">Air Jordan Retro</li>
              <li className="hover:text-white cursor-pointer transition-colors">New Balance 99X</li>
              <li className="hover:text-white cursor-pointer transition-colors">Salomon Advanced</li>
              <li className="hover:text-white cursor-pointer transition-colors">Asics Gel Collection</li>
              <li className="hover:text-white cursor-pointer transition-colors">Hoka Glide & Bondi</li>
            </ul>
          </div>

          {/* Stack & Info */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Tech Specifications</h5>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p>• Framework: Next.js 14 App Router</p>
              <p>• Styling: Tailwind CSS & Dark Glassmorphism</p>
              <p>• Icons: Lucide React</p>
              <p>• Language: TypeScript Strict</p>
              <p>• Database: MongoDB Mongoose + In-Memory Fallback</p>
              <p>• State: Reactive Cart, Wishlist, Orders & Filter Engine</p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 SOLEVAULT. All rights reserved. Built for &quot;i want a shobbing abb w&quot;.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Authenticity Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
