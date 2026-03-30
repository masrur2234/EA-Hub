'use client';

import { Check, Zap, Download, Brain } from 'lucide-react';

const features = [
  {
    icon: Check,
    title: '100% Gratis',
    description: 'Semua EA & indicator bisa download tanpa biaya',
    emoji: '✅',
    color: '#00FFB2',
  },
  {
    icon: Zap,
    title: 'Update Rutin',
    description: 'Koleksi EA terupdate setiap minggu',
    emoji: '⚡',
    color: '#3B82F6',
  },
  {
    icon: Download,
    title: 'Unlimited Download',
    description: 'Download sepuas, tanpa batas apapun',
    emoji: '📥',
    color: '#F59E0B',
  },
  {
    icon: Brain,
    title: 'Support Semua Trader',
    description: 'Dari pemula sampai pro, semua bisa',
    emoji: '🧠',
    color: '#8B5CF6',
  },
];

export default function KeunggulanSection() {
  return (
    <section className="py-16 md:py-20 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FFB2]/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Kenapa Pilih EA Hub?
          </h2>
          <p className="text-[#9CA3AF] max-w-lg mx-auto">
            Platform terlengkap untuk kebutuhan trading kamu
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="text-center p-6 rounded-2xl border border-[#1F2937] bg-[#111827]/50"
              >
                {/* Icon circle */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 relative"
                  style={{
                    backgroundColor: `${feat.color}15`,
                    boxShadow: `0 0 20px ${feat.color}20`,
                  }}
                >
                  <span className="text-2xl">{feat.emoji}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#9CA3AF] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
