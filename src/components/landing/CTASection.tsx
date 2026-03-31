'use client';

import { useEffect, useState } from 'react';
import { Rocket, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ctaStats = [
  { value: '500+', label: 'EA' },
  { value: '10K+', label: 'Downloads' },
  { value: '100%', label: 'Free' },
];

const DEFAULT_SAWERIA_URL = 'https://saweria.co/dewakupas';

export default function CTASection() {
  const [saweriaUrl, setSaweriaUrl] = useState(DEFAULT_SAWERIA_URL);

  useEffect(() => {
    fetch(`/api/site-config?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.saweriaUrl) {
          setSaweriaUrl(data.saweriaUrl);
        }
      })
      .catch(() => {
        setSaweriaUrl(DEFAULT_SAWERIA_URL);
      });
  }, []);

  return (
    <section
      id="cta"
      className="py-20 md:py-28 relative overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FFB2]/[0.03] to-transparent" />
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Decorative orbs */}
      <div className="absolute top-10 left-1/4 w-64 h-64 bg-[#00FFB2]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className="space-y-8">
          {/* Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-glow-neon text-white">
            Siap Gas Profit?
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[#9CA3AF] max-w-2xl mx-auto">
            Join ribuan trader yang sudah menggunakan EA dari EA Hub
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#00FFB2] to-[#00cc8e] text-[#0B0F1A] font-bold btn-neon px-10 py-7 text-lg shadow-[0_0_30px_rgba(0,255,178,0.3)] hover:shadow-[0_0_50px_rgba(0,255,178,0.4)]"
              onClick={() => {
                document
                  .getElementById('ea-collection')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Rocket className="w-6 h-6 mr-2" />
              Download EA Gratis Sekarang
            </Button>

            {/* Saweria Donation Button */}
            <a
              href={saweriaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                color: '#0B0F1A',
                boxShadow: '0 0 20px rgba(251, 191, 36, 0.3), 0 4px 15px rgba(0,0,0,0.3)',
              }}
            >
              <Coffee className="w-5 h-5" />
              Support us via Saweria
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-6">
            {ctaStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#00FFB2]">
                  {stat.value}
                </div>
                <div className="text-sm text-[#9CA3AF]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
