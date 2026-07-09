import React from 'react';
import { BookOpen, PenTool, Sparkles, MoveRight, HelpCircle } from 'lucide-react';

interface HeroProps {
  onExploreBooks: () => void;
  onExplorePens: () => void;
}

export default function Hero({ onExploreBooks, onExplorePens }: HeroProps) {
  return (
    <div id="hero-banner" className="relative bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white rounded-[2rem] overflow-hidden shadow-xl mb-12 border border-zinc-800">
      {/* Background Graphic Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Decorative colored glow spheres */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24 text-center">
        {/* Subtle tagline */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-mono tracking-wider font-medium text-gray-300">CURATED CRAFT &amp; ANALOG MINDSET</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-display text-white max-w-3xl mx-auto leading-tight mb-6">
          Craft Your Thoughts with <span className="font-serif italic font-normal text-amber-200">Precision</span> &amp; <span className="font-serif italic font-normal text-amber-300/80">Soul</span>
        </h1>

        {/* Hero Description */}
        <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto mb-10 leading-relaxed font-sans">
          Discover our handpicked collection of masterfully written literature and premium writing instruments. Elevate your desk, your thoughts, and your creative journeys.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="hero-cta-books"
            onClick={onExploreBooks}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-md group"
          >
            <BookOpen className="w-4 h-4 text-zinc-950" />
            <span>Browse Library</span>
            <MoveRight className="w-4 h-4 text-zinc-950 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            id="hero-cta-pens"
            onClick={onExplorePens}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer group"
          >
            <PenTool className="w-4 h-4 text-amber-400" />
            <span>Explore Fine Pens</span>
            <MoveRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-16 pt-10 border-t border-white/10 text-center text-gray-400">
          <div>
            <span className="block text-2xl md:text-3xl font-bold font-display text-white">100%</span>
            <span className="text-xs font-mono tracking-wider">Curated Quality</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-bold font-display text-white">48 Hour</span>
            <span className="text-xs font-mono tracking-wider">Secure Delivery</span>
          </div>
          <div className="col-span-2 md:col-span-1 border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
            <span className="block text-2xl md:text-3xl font-bold font-display text-white">Lifetime</span>
            <span className="text-xs font-mono tracking-wider">Instrument Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
