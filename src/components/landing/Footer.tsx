'use client';

import { Bot } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'EA Collection', href: '#ea-collection' },
  { label: 'Indicator', href: '#featured' },
];

const categories = [
  'Scalping',
  'Auto Trading',
  'Indicator',
  'Tools',
];



export default function Footer() {
  const handleQuickLinkClick = (href: string, isOnClick?: boolean) => {
    if (isOnClick) return;
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="mt-auto bg-[#070A12] border-t border-[#1F2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">
          {/* Logo & Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#00FFB2]/10 border border-[#00FFB2]/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#00FFB2]" />
              </div>
              <span className="text-lg font-bold">
                EA <span className="text-[#00FFB2]">Hub</span>
              </span>
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Platform download EA &amp; Indicator MT4/MT5 gratis terlengkap di Indonesia
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleQuickLinkClick(link.href, link.onClick)}
                    className="text-sm text-[#9CA3AF] hover:text-[#00FFB2] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <span className="text-sm text-[#9CA3AF] hover:text-[#00FFB2] transition-colors cursor-default">
                    {cat}
                  </span>
                </li>
              ))}
            </ul>
          </div>


        </div>

        {/* Divider */}
        <div className="border-t border-[#1F2937] mt-10 pt-8">
          {/* Disclaimer */}
          <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-xl px-4 py-3 mb-6">
            <p className="text-xs text-[#F59E0B]/80 text-center leading-relaxed">
              ⚠️ Trading memiliki risiko tinggi. Gunakan EA dengan bijak. Past performance is not indicative of future results.
            </p>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs text-[#9CA3AF]/60">
            © 2025 EA Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
