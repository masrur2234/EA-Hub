'use client';

import { Zap, Bot, LineChart, Wrench, ArrowRight } from 'lucide-react';
import { useAppStore, type Category } from '@/lib/store';

const categories = [
  {
    icon: Zap,
    name: 'Scalping',
    value: 'scalping' as Category,
    description: 'EA khusus strategi scalping untuk profit cepat di time frame kecil',
    count: '25+ Tools',
    color: '#F59E0B',
    bgColor: 'rgba(245,158,11,0.1)',
  },
  {
    icon: Bot,
    name: 'Auto Trading',
    value: 'auto-trading' as Category,
    description: 'EA fully automated yang jalan 24/7 tanpa perlu monitor',
    count: '40+ Tools',
    color: '#00FFB2',
    bgColor: 'rgba(0,255,178,0.1)',
  },
  {
    icon: LineChart,
    name: 'Indicator',
    value: 'indicator' as Category,
    description: 'Technical indicator akurat untuk analisa market lebih tajam',
    count: '35+ Tools',
    color: '#3B82F6',
    bgColor: 'rgba(59,130,246,0.1)',
  },
  {
    icon: Wrench,
    name: 'Tools',
    value: 'tools' as Category,
    description: 'Utility tools untuk mempermudah aktivitas trading harian',
    count: '12+ Tools',
    color: '#8B5CF6',
    bgColor: 'rgba(139,92,246,0.1)',
  },
];

export default function CategoriesSection() {
  const setActiveCategory = useAppStore((s) => s.setActiveCategory);

  const handleCategoryClick = (value: Category) => {
    setActiveCategory(value);
    setTimeout(() => {
      document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Kategori Tools Trading
          </h2>
          <p className="text-[#9CA3AF] max-w-lg mx-auto">
            Pilih kategori yang sesuai dengan kebutuhan trading kamu
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className="card-hover cursor-pointer rounded-2xl border border-[#1F2937] bg-[#111827] p-6 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{ backgroundColor: cat.bgColor }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: cat.color }}
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {cat.name}
                </h3>
                <p className="text-sm text-[#9CA3AF] mb-4 leading-relaxed">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: cat.color }}
                  >
                    {cat.count}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 text-[#9CA3AF] group-hover:text-white group-hover:translate-x-1 transition-all"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
