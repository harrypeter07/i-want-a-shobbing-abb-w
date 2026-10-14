'use client';
import React from 'react';
import { X, Package, Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { Order, Currency } from '@/types/shoe';
import { formatPrice } from '@/lib/utils';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currency: Currency;
}

export function OrdersModal({ isOpen, onClose, orders, currency }: OrdersModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">My Orders & Live Tracking</h3>
              <p className="text-xs text-slate-400">View real-time shipment updates & receipt history</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                <Package className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">No orders yet</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Once you complete checkout, your sneaker packages and tracking numbers will appear here.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const steps = [
                { label: 'Order Placed', completed: true },
                { label: 'Packed & Verified', completed: true },
                { label: 'In Transit', completed: order.status === 'Shipped' || order.status === 'Delivered' },
                { label: 'Delivered', completed: order.status === 'Delivered' },
              ];

              return (
                <div
                  key={order.id}
                  className="rounded-2xl bg-slate-950/70 border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-colors"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                    <div>
                      <span className="font-mono font-bold text-indigo-400 text-sm mr-2">{order.id}</span>
                      <span className="text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        Tracking: {order.trackingNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Timeline Progress */}
                  <div className="py-2">
                    <div className="flex justify-between items-center relative">
                      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />
                      {steps.map((st, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                              st.completed
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 ring-2 ring-indigo-400'
                                : 'bg-slate-900 border border-slate-700 text-slate-500'
                            }`}
                          >
                            {st.completed ? '✓' : i + 1}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 font-medium text-center">
                            {st.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Purchased Items List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-contain rounded-lg bg-slate-950 p-1"
                        />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="font-bold text-white truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            US {item.size} • {item.color} • Qty {item.quantity}
                          </p>
                          <p className="text-[11px] font-mono font-bold text-indigo-400">
                            {formatPrice(item.price * item.quantity, currency)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Address and Total Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>
                        Delivering to {order.shippingAddress.fullName} in {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span>Total Paid:</span>
                      <span className="text-base font-black text-white font-mono">
                        {formatPrice(order.total, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
