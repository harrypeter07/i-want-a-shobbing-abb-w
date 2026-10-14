'use client';
import React from 'react';
import { X, Ruler, Check } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZE_CHART = [
  { usMen: '7.0', usWomen: '8.5', uk: '6.0', eu: '40.0', cm: '25.0' },
  { usMen: '7.5', usWomen: '9.0', uk: '6.5', eu: '40.5', cm: '25.5' },
  { usMen: '8.0', usWomen: '9.5', uk: '7.0', eu: '41.0', cm: '26.0' },
  { usMen: '8.5', usWomen: '10.0', uk: '7.5', eu: '42.0', cm: '26.5' },
  { usMen: '9.0', usWomen: '10.5', uk: '8.0', eu: '42.5', cm: '27.0' },
  { usMen: '9.5', usWomen: '11.0', uk: '8.5', eu: '43.0', cm: '27.5' },
  { usMen: '10.0', usWomen: '11.5', uk: '9.0', eu: '44.0', cm: '28.0' },
  { usMen: '10.5', usWomen: '12.0', uk: '9.5', eu: '44.5', cm: '28.5' },
  { usMen: '11.0', usWomen: '12.5', uk: '10.0', eu: '45.0', cm: '29.0' },
  { usMen: '11.5', usWomen: '13.0', uk: '10.5', eu: '45.5', cm: '29.5' },
  { usMen: '12.0', usWomen: '13.5', uk: '11.0', eu: '46.0', cm: '30.0' },
  { usMen: '13.0', usWomen: '14.5', uk: '12.0', eu: '47.5', cm: '31.0' },
];

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Shoe Sizing Guide & Conversion</h3>
              <p className="text-xs text-slate-400">Accurate sizing across US, UK, EU and Centimeter measurements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Measuring tips */}
        <div className="my-4 p-3.5 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-xs text-indigo-200 flex items-start gap-2.5">
          <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong>Pro Tip:</strong> Measure your feet in the afternoon when feet are naturally slightly expanded. If your measurement falls between two sizes, we recommend ordering the larger size.
          </span>
        </div>

        {/* Size table */}
        <div className="overflow-x-auto max-h-[380px] overflow-y-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 sticky top-0 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">US Men</th>
                <th className="py-3 px-4">US Women</th>
                <th className="py-3 px-4">UK</th>
                <th className="py-3 px-4">EU</th>
                <th className="py-3 px-4">Foot Length (CM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {SIZE_CHART.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-white">{row.usMen}</td>
                  <td className="py-2.5 px-4 text-indigo-300">{row.usWomen}</td>
                  <td className="py-2.5 px-4 text-slate-400">{row.uk}</td>
                  <td className="py-2.5 px-4 text-slate-300">{row.eu}</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-medium">{row.cm} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
