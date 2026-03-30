'use client';

import { useState, useEffect } from 'react';
import { Star, ExternalLink, Shield, Zap, Gift, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Broker } from '@/lib/store';

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sz} ${i < Math.round(rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#1F2937]'}`}
        />
      ))}
      <span className="text-xs text-[#9CA3AF] ml-1">{rating}</span>
    </div>
  );
}

export default function BrokerSection() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrokers() {
      try {
        const res = await fetch('/api/brokers');
        if (res.ok) {
          const data = await res.json();
          setBrokers(Array.isArray(data) ? data : []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchBrokers();
  }, []);

  return (
    <section id="broker" className="py-16 md:py-20 relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3B82F6]/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Title */}
        <div className="text-center mb-12">
          <Badge className="bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30 px-4 py-1.5 text-sm font-medium mb-4">
            🏢 Rekomendasi Broker
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Broker Terpercaya untuk Trading
          </h2>
          <p className="text-[#9CA3AF] max-w-lg mx-auto">
            Pilih broker yang direkomendasikan untuk hasil trading optimal
          </p>
        </div>

        {/* Broker Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 animate-shimmer" />
            ))}
          </div>
        ) : brokers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#9CA3AF]">Belum ada broker yang ditambahkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brokers.map((broker) => {
              const featureList = broker.features
                ? broker.features.split(',').map((f) => f.trim()).filter(Boolean)
                : [];

              return (
                <div
                  key={broker.id}
                  className="card-hover rounded-2xl border border-[#1F2937] bg-[#111827] overflow-hidden flex flex-col"
                >
                  {/* Top accent */}
                  {broker.isFeatured && (
                    <div className="h-1 bg-gradient-to-r from-[#00FFB2] to-[#3B82F6]" />
                  )}

                  <div className="p-6 flex flex-col flex-1 gap-4">
                    {/* Header: Logo + Name */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/[0.05] border border-[#1F2937] flex items-center justify-center shrink-0 overflow-hidden">
                        {broker.logoUrl ? (
                          <img
                            src={broker.logoUrl}
                            alt={broker.name}
                            className="w-full h-full object-contain p-1.5"
                          />
                        ) : (
                          <BuildingIcon className="w-7 h-7 text-[#3B82F6]/50" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-lg truncate">{broker.name}</h3>
                          {broker.isFeatured && (
                            <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30 text-[10px] px-1.5 shrink-0">
                              RECOMMENDED
                            </Badge>
                          )}
                        </div>
                        {broker.rating > 0 && <StarRating rating={broker.rating} />}
                      </div>
                    </div>

                    {/* Description */}
                    {broker.description && (
                      <p className="text-sm text-[#9CA3AF] leading-relaxed line-clamp-2">
                        {broker.description}
                      </p>
                    )}

                    {/* Features */}
                    {featureList.length > 0 && (
                      <div className="space-y-2">
                        {featureList.map((feature, fi) => (
                          <div key={fi} className="flex items-center gap-2 text-sm">
                            <ChevronRight className="w-3 h-3 text-[#00FFB2] shrink-0" />
                            <span className="text-[#9CA3AF]">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Bonus badge */}
                    {broker.bonusInfo && (
                      <div className="flex items-center gap-2 rounded-xl bg-[#00FFB2]/[0.07] border border-[#00FFB2]/20 px-3 py-2">
                        <Gift className="w-4 h-4 text-[#00FFB2] shrink-0" />
                        <span className="text-sm font-semibold text-[#00FFB2]">{broker.bonusInfo}</span>
                      </div>
                    )}

                    {/* CTA Button */}
                    {broker.affiliateUrl ? (
                      <a
                        href={broker.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button className="w-full bg-gradient-to-r from-[#00FFB2] to-[#00cc8e] text-[#0B0F1A] font-bold hover:opacity-90 btn-neon h-11 text-sm">
                          <ExternalLink className="w-4 h-4 mr-1.5" />
                          Buka Akun Sekarang
                        </Button>
                      </a>
                    ) : (
                      <Button
                        disabled
                        variant="outline"
                        className="w-full border-[#1F2937] text-[#9CA3AF] h-11 text-sm"
                      >
                        Segera Hadir
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10">
          {[
            { icon: Shield, label: 'Regulasi Resmi' },
            { icon: Zap, label: 'Eksekusi Cepat' },
            { icon: Gift, label: 'Bonus Deposit' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-2 text-[#9CA3AF]">
                <Icon className="w-4 h-4 text-[#00FFB2]/60" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
