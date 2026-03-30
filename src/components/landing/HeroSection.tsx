'use client';

import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const stats = [
  { value: '500+', label: 'EA Tersedia' },
  { value: '10K+', label: 'Download' },
  { value: '4.8', label: 'Rating' },
];

const candles = [
  { open: 40, close: 70, wickTop: 75, wickBottom: 35, green: true },
  { open: 55, close: 45, wickTop: 60, wickBottom: 40, green: false },
  { open: 45, close: 80, wickTop: 85, wickBottom: 40, green: true },
  { open: 70, close: 60, wickTop: 75, wickBottom: 55, green: false },
  { open: 60, close: 90, wickTop: 95, wickBottom: 55, green: true },
  { open: 85, close: 75, wickTop: 90, wickBottom: 70, green: false },
  { open: 75, close: 95, wickTop: 100, wickBottom: 70, green: true },
  { open: 90, close: 80, wickTop: 95, wickBottom: 75, green: false },
  { open: 80, close: 98, wickTop: 100, wickBottom: 75, green: true },
  { open: 95, close: 85, wickTop: 100, wickBottom: 80, green: false },
  { open: 85, close: 96, wickTop: 100, wickBottom: 80, green: true },
  { open: 92, close: 70, wickTop: 97, wickBottom: 65, green: false },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden grid-bg"
    >
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#00FFB2]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28 md:pt-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div>
              <Badge className="bg-[#00FFB2]/10 text-[#00FFB2] border-[#00FFB2]/30 px-4 py-1.5 text-sm font-medium">
                🆓 100% GRATIS — No Ribet!
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Download EA &amp; Indicator</span>
              <br />
              <span className="gradient-text">MT4/MT5 Gratis</span>
              <br />
              <span className="text-white">Tanpa Batas</span>
            </h1>

            <p className="text-lg md:text-xl text-[#9CA3AF] max-w-lg">
              Auto trading, no ribet. Tinggal pakai, gas cuan 🚀
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-[#00FFB2] text-[#0B0F1A] font-bold hover:bg-[#00cc8e] btn-neon px-8 py-6 text-base"
                onClick={() => {
                  document.getElementById('ea-collection')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Download Sekarang
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="border border-[#1F2937] text-white hover:bg-white/5 hover:border-[#00FFB2]/30 px-8 py-6 text-base"
                onClick={() => {
                  document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore EA →
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 pt-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#9CA3AF]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Decorative Trading Chart */}
          <div className="hidden lg:block animate-float">
            <div className="relative w-full aspect-[4/3] bg-[#111827] border border-[#1F2937] rounded-2xl p-6 chart-bg overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#00FFB2]" />
                  <span className="text-sm font-semibold text-white">EUR/USD</span>
                </div>
                <span className="text-[#00FFB2] text-sm font-bold">+2.34%</span>
              </div>

              <div className="relative h-[calc(100%-2rem)] flex items-end justify-around gap-1.5 px-2">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-t border-[#1F2937]/50 w-full" />
                  ))}
                </div>

                {candles.map((candle, i) => {
                  const bodyTop = Math.min(candle.open, candle.close);
                  const bodyHeight = Math.abs(candle.close - candle.open);
                  const color = candle.green ? '#00FFB2' : '#EF4444';
                  return (
                    <div key={i} className="relative flex flex-col items-center z-10" style={{ width: '24px' }}>
                      <div
                        className="absolute w-[2px]"
                        style={{
                          backgroundColor: color,
                          bottom: `${candle.wickBottom}%`,
                          top: `${100 - candle.wickTop}%`,
                          opacity: 0.6,
                        }}
                      />
                      <div
                        className="relative rounded-sm w-4 transition-all"
                        style={{
                          backgroundColor: color,
                          height: `${bodyHeight}%`,
                          opacity: 0.85,
                          marginTop: `${100 - bodyTop - bodyHeight}%`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              <svg className="absolute bottom-8 left-6 right-6 pointer-events-none" viewBox="0 0 400 120" fill="none" preserveAspectRatio="none" style={{ height: '40%' }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00FFB2" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00FFB2" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path d="M0,90 C30,80 60,85 90,70 C120,55 140,60 170,40 C200,20 230,35 260,25 C290,15 320,30 350,20 C380,10 400,15 400,12" stroke="#00FFB2" strokeWidth="2.5" fill="none" filter="url(#glow)" />
                <path d="M0,90 C30,80 60,85 90,70 C120,55 140,60 170,40 C200,20 230,35 260,25 C290,15 320,30 350,20 C380,10 400,15 400,12 L400,120 L0,120 Z" fill="url(#lineGradient)" />
              </svg>

              <div className="absolute top-4 right-4 glass rounded-lg px-3 py-2 text-xs">
                <div className="text-[#9CA3AF]">Profit</div>
                <div className="text-[#00FFB2] font-bold">+$1,234</div>
              </div>
              <div className="absolute bottom-4 left-4 glass rounded-lg px-3 py-2 text-xs">
                <div className="text-[#9CA3AF]">Win Rate</div>
                <div className="text-[#00FFB2] font-bold">78.5%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
