'use client';
import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        Generated with AI Studio
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
        i want a  shobbing abb w
      </h1>
      <p className="text-slate-400 max-w-lg mb-8 text-sm sm:text-base">
        i want a  shobbing abb with shoes listed fully wrokng 
      </p>
    </main>
  );
}