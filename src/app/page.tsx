'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import SearchFilter from '@/components/landing/SearchFilter';
import FeaturedSection from '@/components/landing/FeaturedSection';
import CategoriesSection from '@/components/landing/CategoriesSection';
import BrokerSection from '@/components/landing/BrokerSection';
import KeunggulanSection from '@/components/landing/KeunggulanSection';
import TestimoniSection from '@/components/landing/TestimoniSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

// Dynamic import admin panel to prevent it from blocking page render
const AdminPanel = dynamic(() => import('@/components/admin/AdminPanel'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <SearchFilter />
        <FeaturedSection />
        <CategoriesSection />
        <BrokerSection />
        <KeunggulanSection />
        <TestimoniSection />
        <CTASection />
      </main>
      <Footer />
      <AdminPanel />
    </div>
  );
}
