'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, PackageOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore, type TradingTool } from '@/lib/store';
import EACard from '@/components/ea/EACard';
import EADetailModal from '@/components/ea/EADetailModal';

const shimmerCard = (
  <div className="rounded-2xl border border-[#1F2937] bg-[#111827] overflow-hidden">
    <Skeleton className="h-40 w-full bg-[#1F2937]" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-5 w-3/4 bg-[#1F2937]" />
      <Skeleton className="h-4 w-full bg-[#1F2937]" />
      <Skeleton className="h-4 w-2/3 bg-[#1F2937]" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-12 rounded-full bg-[#1F2937]" />
        <Skeleton className="h-5 w-16 rounded-full bg-[#1F2937]" />
      </div>
      <div className="pt-2 border-t border-[#1F2937] flex justify-between">
        <Skeleton className="h-4 w-24 bg-[#1F2937]" />
        <Skeleton className="h-4 w-16 bg-[#1F2937]" />
      </div>
      <Skeleton className="h-10 w-full bg-[#1F2937] rounded-lg" />
    </div>
  </div>
);

export default function FeaturedSection() {
  const [tools, setTools] = useState<TradingTool[]>([]);
  const [loading, setLoading] = useState(true);

  const searchQuery = useAppStore((s) => s.searchQuery);
  const activeCategory = useAppStore((s) => s.activeCategory);
  const filterType = useAppStore((s) => s.filterType);
  const filterPlatform = useAppStore((s) => s.filterPlatform);
  const selectedTool = useAppStore((s) => s.selectedTool);
  const setSelectedTool = useAppStore((s) => s.setSelectedTool);
  const dataVersion = useAppStore((s) => s.dataVersion);

  const fetchTools = async () => {
    try {
      const res = await fetch(`/api/tools?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setTools(data);
      }
    } catch (err) {
      console.error('Failed to fetch tools:', err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when dataVersion changes (from admin save)
  useEffect(() => {
    fetchTools();
  }, [dataVersion]);

  // Also listen for custom event from admin panel (backup refresh mechanism)
  useEffect(() => {
    const handleToolsUpdated = () => {
      fetchTools();
    };
    window.addEventListener('tools-updated', handleToolsUpdated);
    return () => window.removeEventListener('tools-updated', handleToolsUpdated);
  }, []);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          (tool.tags && tool.tags.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // Category
      if (activeCategory !== 'all' && tool.category !== activeCategory) {
        return false;
      }

      // Type
      if (filterType !== 'all' && tool.type !== filterType) {
        return false;
      }

      // Platform
      if (filterPlatform !== 'all' && tool.platform !== filterPlatform) {
        return false;
      }

      return true;
    });
  }, [tools, searchQuery, activeCategory, filterType, filterPlatform]);

  return (
    <section id="featured" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            🔥 Koleksi EA &amp; Indicator Terbaik
          </h2>
          <p className="text-[#9CA3AF] max-w-lg mx-auto">
            Temukan EA dan indicator yang cocok untuk strategi trading kamu
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i}>{shimmerCard}</div>
            ))}
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#111827] border border-[#1F2937] flex items-center justify-center mb-4">
              <PackageOpen className="w-10 h-10 text-[#9CA3AF]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Tidak ada hasil
            </h3>
            <p className="text-[#9CA3AF] text-sm max-w-sm">
              Coba ubah filter atau kata kunci pencarian untuk menemukan EA atau indicator yang kamu cari.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <div key={tool.id}>
                <EACard tool={tool} onSelect={setSelectedTool} />
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <EADetailModal
          tool={selectedTool}
          open={!!selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      </div>
    </section>
  );
}
