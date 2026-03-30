'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAppStore } from '@/lib/store';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'EA', href: '#ea-collection' },
  { label: 'Broker', href: '#broker' },
  { label: 'Contact', href: '#footer' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const setIsAdminOpen = useAppStore((s) => s.setIsAdminOpen);
  const clickTimes = useRef<number[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Hidden admin trigger: click logo 5 times within 2 seconds
  const handleLogoClick = () => {
    handleNavClick('#home');
    const now = Date.now();
    clickTimes.current = [...clickTimes.current, now].filter((t) => now - t < 2000);
    if (clickTimes.current.length >= 5) {
      clickTimes.current = [];
      setIsAdminOpen(true);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo — hidden admin trigger (5x click) */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#00FFB2]/10 border border-[#00FFB2]/30 flex items-center justify-center group-hover:glow-neon transition-all">
              <Bot className="w-5 h-5 text-[#00FFB2]" />
            </div>
            <span className="text-xl font-bold select-none">
              EA <span className="text-[#00FFB2]">Hub</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 text-sm font-medium text-[#9CA3AF] hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-[#9CA3AF] hover:text-white"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-72 bg-[#0B0F1A] border-[#1F2937]"
              >
                <SheetTitle className="text-white sr-only">Navigation Menu</SheetTitle>
                <div className="mt-8 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className="text-left px-4 py-3 text-[#9CA3AF] hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
