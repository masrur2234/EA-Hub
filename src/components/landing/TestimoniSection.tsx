'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

const FALLBACK_TESTIMONIALS = [
  {
    name: 'Rizky F.',
    role: 'Forex Trader',
    comment: 'EA nya work bro! Auto profit konsisten 🔥',
    stars: 5,
    initials: 'RF',
    color: '#00FFB2',
  },
  {
    name: 'Ahmad D.',
    role: 'Scalper',
    comment: 'Gratis tapi kualitas premium. Mantap!',
    stars: 5,
    initials: 'AD',
    color: '#3B82F6',
  },
  {
    name: 'Budi S.',
    role: 'Pro Trader',
    comment: 'Sistem grid EA nya keren banget, recommended!',
    stars: 4,
    initials: 'BS',
    color: '#F59E0B',
  },
  {
    name: 'Dewi A.',
    role: 'Analyst',
    comment: 'Indicator-nya akurat, bisa buat EA sendiri juga',
    stars: 5,
    initials: 'DA',
    color: '#8B5CF6',
  },
  {
    name: 'Fajar M.',
    role: 'Beginner',
    comment: 'No ribet, tinggal download langsung pakai. Gas!',
    stars: 5,
    initials: 'FM',
    color: '#EF4444',
  },
];

const ROLE_COLORS = ['#00FFB2', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'fill-[#F59E0B] text-[#F59E0B]'
              : 'text-[#1F2937]'
          }`}
        />
      ))}
    </div>
  );
}

interface TestimonialItem {
  name: string;
  role: string;
  comment: string;
  stars: number;
  initials: string;
  color: string;
}

export default function TestimoniSection() {
  const apiRef = useRef<CarouselApi | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(FALLBACK_TESTIMONIALS);

  const setApi = useCallback((api: CarouselApi) => {
    apiRef.current = api;
  }, []);

  useEffect(() => {
    fetch('/api/reviews?approved=true&featured=true')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: TestimonialItem[] = data.map((r: { name: string; role: string; comment: string; rating: number }, i: number) => ({
            name: r.name,
            role: r.role,
            comment: r.comment,
            stars: r.rating,
            initials: r.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
            color: ROLE_COLORS[i % ROLE_COLORS.length],
          }));
          setTestimonials(mapped);
        }
      })
      .catch(() => {
        // Use fallback
      });
  }, []);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      if (apiRef.current) {
        apiRef.current.scrollNext();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            💬 Kata Mereka
          </h2>
          <p className="text-[#9CA3AF] max-w-lg mx-auto">
            Apa kata para trader yang sudah menggunakan EA dari EA Hub
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto px-8">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((t, i) => (
                <CarouselItem
                  key={i}
                  className="pl-4 md:basis-1/2 lg:basis-1/2"
                >
                  <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-6 h-full flex flex-col">
                    <Quote className="w-8 h-8 text-[#00FFB2]/20 mb-4" />
                    <p className="text-white text-sm leading-relaxed mb-4 flex-1">
                      &ldquo;{t.comment}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[#1F2937]">
                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: `${t.color}20`,
                          color: t.color,
                        }}
                      >
                        {t.initials}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">
                          {t.name}
                        </div>
                        <div className="text-xs text-[#9CA3AF]">{t.role}</div>
                      </div>
                      <StarRating rating={t.stars} />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Nav buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => apiRef.current?.scrollPrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 rounded-full bg-[#111827] border border-[#1F2937] text-white hover:bg-[#1F2937] hidden md:flex"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => apiRef.current?.scrollNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 rounded-full bg-[#111827] border border-[#1F2937] text-white hover:bg-[#1F2937] hidden md:flex"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
