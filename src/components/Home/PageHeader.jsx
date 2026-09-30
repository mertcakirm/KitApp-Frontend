// src/components/PageHeader.jsx
import React from 'react';
import { Library } from 'lucide-react';

const PageHeader = ({ badgeText = "Zengin PDF Kütüphanesi", title, subtitle }) => {
  return (
    <div className="text-center space-y-3 md:space-y-4 max-w-2xl px-4 shrink-0 animate-fade-in mb-8">
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#A06A42]/10 border border-[#A06A42]/20 text-xs font-bold text-[#A06A42]">
        <Library size={13} className="text-[#A06A42] shrink-0" />
        {badgeText}
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#121A13] tracking-tight leading-tight">
        {title} <span className="text-[#A06A42] font-serif font-semibold block sm:inline">Anında Ulaşın.</span>
      </h1>
      <p className="text-xs sm:text-sm text-[#2B3B2E] font-medium max-w-lg mx-auto leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
};

export default PageHeader;
