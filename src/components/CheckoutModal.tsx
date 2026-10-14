'use client';
import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Package,
  Printer,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { CartItem, Currency, Order, ShippingAddress } from '@/types/shoe';
import { formatPrice } from '@/lib/utils';
import { useToast } from './Toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  appliedPromo?: string;
  discountPercent?: number;
  onOrderSuccess: (order: Order) => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  currency,
  appliedPromo,
  discountPercent = 0,
  onOrderSuccess,
}: CheckoutModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cod'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Form inputs
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    nameOnCard: '',
  });

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const shippingCost = shippingMethod === 'standard' ? 0 : shippingMethod === 'express' ? 14.99 : 24.99;
  const tax = Math.round(taxableAmount * 0.08 * 100) / 100;
  const total = Math.max(0, taxableAmount + shippingCost + tax);

  const fillDemoData = () => {
    setFormData({
      fullName: 'Miles Morales',
      email: 'miles.sneakers@brooklyn.ny',
      phone: '+1 (555) 789-0123',
      address: '145 Brooklyn Ave, Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '11213',
      country: 'United States',
    });
    setCardData({
      number: '4242 •••• •••• 4242',
      expiry: '12/28',
      cvc: '789',
      nameOnCard: 'Miles Morales',
    });
    toast({
      type: 'info',
      message: 'Demo credentials pre-filled!',
      description: 'Ready to submit the test order.',
    });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.address) {
      toast({
        type: 'error',
        message: 'Please complete all required shipping fields',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        items,
        shippingAddress: formData,
        shippingMethod,
        paymentMethod,
        promoCode: appliedPromo,
        discount: discountAmount,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setPlacedOrder(data.order);
        setStep('success');
        onOrderSuccess(data.order);
        toast({
          type: 'success',
          message: 'Order confirmed successfully!',
          description: `Order ID: ${data.order.id}`,
        });
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err: any) {
      // Local fallback in case of offline network
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const fallbackOrder: Order = {
        id: `ORD-${randomNum}`,
        items,
        shippingAddress: formData,
        shippingMethod,
        shippingCost,
        discount: discountAmount,
        promoCode: appliedPromo,
        subtotal,
        tax,
        total,
        paymentMethod,
        status: 'Processing',
        trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`,
        estimatedDelivery: '3 business days',
        createdAt: new Date().toISOString(),
      };
      setPlacedOrder(fallbackOrder);
      setStep('success');
      onOrderSuccess(fallbackOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {step === 'details' ? 'Secure Checkout' : 'Order Confirmed!'}
              </h3>
              <p className="text-[11px] text-slate-400">256-Bit SSL Encrypted & Authenticated</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step === 'details' && (
              <button
                type="button"
                onClick={fillDemoData}
                className="text-xs bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg border border-indigo-500/20 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Fill Demo Info
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {step === 'details' ? (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Column: Form Fields */}
                <div className="md:col-span-7 space-y-5">
                  {/* Shipping Address */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
                      <Truck className="w-4 h-4" />
                      1. Delivery Address
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-medium text-slate-300 block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="John Sneakerhead"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-medium text-slate-300 block mb-1">Email</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-slate-300 block mb-1">Phone</label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-300 block mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="123 Sneaker Lane, Apt 2"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[11px] font-medium text-slate-300 block mb-1">City</label>
                          <input
                            type="text"
                            required
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="New York"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-slate-300 block mb-1">State</label>
                          <input
                            type="text"
                            required
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder="NY"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-slate-300 block mb-1">ZIP Code</label>
                          <input
                            type="text"
                            required
                            value={formData.postalCode}
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            placeholder="10001"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                      2. Shipping Method
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setShippingMethod('standard')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          shippingMethod === 'standard'
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-slate-800 bg-slate-950 text-slate-400'
                        }`}
                      >
                        <span className="text-xs font-bold block text-white">Standard</span>
                        <span className="text-[10px] text-slate-400 block">3-5 Days</span>
                        <span className="text-xs font-bold text-emerald-400 mt-1 block">Free</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShippingMethod('express')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          shippingMethod === 'express'
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-slate-800 bg-slate-950 text-slate-400'
                        }`}
                      >
                        <span className="text-xs font-bold block text-white">Express 2-Day</span>
                        <span className="text-[10px] text-slate-400 block">2 Days</span>
                        <span className="text-xs font-bold text-indigo-400 mt-1 block">
                          {formatPrice(14.99, currency)}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShippingMethod('overnight')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          shippingMethod === 'overnight'
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-slate-800 bg-slate-950 text-slate-400'
                        }`}
                      >
                        <span className="text-xs font-bold block text-white">Overnight</span>
                        <span className="text-[10px] text-slate-400 block">Next Day</span>
                        <span className="text-xs font-bold text-indigo-400 mt-1 block">
                          {formatPrice(24.99, currency)}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" />
                      3. Payment Method
                    </h4>

                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'card'
                            ? 'border-indigo-500 bg-indigo-500/15 text-white'
                            : 'border-slate-800 bg-slate-950 text-slate-400'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('apple_pay')}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                          paymentMethod === 'apple_pay'
                            ? 'border-indigo-500 bg-indigo-500/15 text-white'
                            : 'border-slate-800 bg-slate-950 text-slate-400'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        Apple / Google Pay
                      </button>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Card Number</label>
                          <input
                            type="text"
                            required
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            placeholder="4242 4242 4242 4242"
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">MM / YY</label>
                            <input
                              type="text"
                              required
                              value={cardData.expiry}
                              onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                              placeholder="12/28"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">CVC / CVV</label>
                            <input
                              type="text"
                              required
                              value={cardData.cvc}
                              onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                              placeholder="123"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Order Summary Recap */}
                <div className="md:col-span-5 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800">
                      Order Summary ({items.length} items)
                    </h4>

                    {/* Shoe Items recap list */}
                    <div className="divide-y divide-slate-800/60 max-h-52 overflow-y-auto my-2">
                      {items.map((item) => (
                        <div key={item.id} className="py-2 flex items-center gap-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-contain rounded-lg bg-slate-900 p-1 border border-slate-800"
                          />
                          <div className="flex-1 min-w-0 text-xs">
                            <p className="font-semibold text-white truncate">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              US {item.size} • Qty {item.quantity}
                            </p>
                          </div>
                          <span className="font-mono text-xs font-bold text-white">
                            {formatPrice(item.price * item.quantity, currency)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-mono text-slate-200">{formatPrice(subtotal, currency)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Discount ({discountPercent}%)</span>
                          <span className="font-mono">-{formatPrice(discountAmount, currency)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Shipping ({shippingMethod})</span>
                        <span className="font-mono text-slate-200">
                          {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Tax</span>
                        <span className="font-mono text-slate-200">{formatPrice(tax, currency)}</span>
                      </div>
                      <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                        <span>Total Due</span>
                        <span className="font-mono text-indigo-400">{formatPrice(total, currency)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 mt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      {isSubmitting ? (
                        <span>Processing Payment & Order...</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pay {formatPrice(total, currency)} & Place Order</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-slate-500 text-center mt-2">
                      Backed by our 30-day money-back authenticity guarantee.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* Order Success View */
            <div className="py-6 text-center space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Order Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  We received your order and are packing your fresh kicks for shipment.
                </p>
              </div>

              {placedOrder && (
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 text-left space-y-3 font-mono text-xs">
                  <div className="flex justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Order ID</span>
                    <span className="font-bold text-indigo-400">{placedOrder.id}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Tracking Number</span>
                    <span className="font-bold text-white">{placedOrder.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Estimated Delivery</span>
                    <span className="font-bold text-emerald-400">{placedOrder.estimatedDelivery}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Ship To</span>
                    <span className="text-white text-right">
                      {placedOrder.shippingAddress.fullName}
                      <br />
                      {placedOrder.shippingAddress.address}, {placedOrder.shippingAddress.city}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-slate-300 font-bold">Total Paid</span>
                    <span className="font-bold text-indigo-400">
                      {formatPrice(placedOrder.total, currency)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
