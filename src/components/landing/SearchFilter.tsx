'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAppStore, type Category, type FilterType, type Platform } from '@/lib/store';

const categories: { label: string; value: Category }[] = [
  { label: 'All', value: 'all' },
  { label: 'Scalping', value: 'scalping' },
  { label: 'Auto Trading', value: 'auto-trading' },
  { label: 'Indicator', value: 'indicator' },
  { label: 'Tools', value: 'tools' },
];

const filterTypes: { label: string; value: FilterType }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'EA', value: 'ea' },
  { label: 'Indicator', value: 'indicator' },
];

const filterPlatforms: { label: string; value: Platform }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'MT4', value: 'mt4' },
  { label: 'MT5', value: 'mt5' },
];

export default function SearchFilter() {
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const activeCategory = useAppStore((s) => s.activeCategory);
  const setActiveCategory = useAppStore((s) => s.setActiveCategory);
  const filterType = useAppStore((s) => s.filterType);
  const setFilterType = useAppStore((s) => s.setFilterType);
  const filterPlatform = useAppStore((s) => s.filterPlatform);
  const setFilterPlatform = useAppStore((s) => s.setFilterPlatform);

  return (
    <section
      id="ea-collection"
      className="sticky top-16 md:top-18 z-40 glass py-4"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari EA atau Indicator..."
            className="pl-10 bg-[#111827] border-[#1F2937] text-white placeholder:text-[#9CA3AF] focus:border-[#00FFB2]/50 focus:ring-[#00FFB2]/20 h-10"
          />
        </div>

        {/* Filter rows */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {/* Category pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                  activeCategory === cat.value
                    ? 'bg-[#00FFB2] text-[#0B0F1A] shadow-[0_0_10px_rgba(0,255,178,0.3)]'
                    : 'bg-[#111827] text-[#9CA3AF] border border-[#1F2937] hover:border-[#00FFB2]/30 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px bg-[#1F2937]" />

          {/* Type pills */}
          <div className="flex flex-wrap gap-1.5">
            {filterTypes.map((ft) => (
              <button
                key={ft.value}
                onClick={() => setFilterType(ft.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                  filterType === ft.value
                    ? 'bg-[#3B82F6] text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                    : 'bg-[#111827] text-[#9CA3AF] border border-[#1F2937] hover:border-[#3B82F6]/30 hover:text-white'
                }`}
              >
                {ft.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px bg-[#1F2937]" />

          {/* Platform pills */}
          <div className="flex flex-wrap gap-1.5">
            {filterPlatforms.map((fp) => (
              <button
                key={fp.value}
                onClick={() => setFilterPlatform(fp.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                  filterPlatform === fp.value
                    ? 'bg-[#F59E0B] text-[#0B0F1A] shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-[#111827] text-[#9CA3AF] border border-[#1F2937] hover:border-[#F59E0B]/30 hover:text-white'
                }`}
              >
                {fp.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
