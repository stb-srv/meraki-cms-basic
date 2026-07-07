'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronDown, Utensils } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Button } from './ui/Button';

export function HeroSection() {
  const { settings, loading } = useSettings();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-preview');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="relative h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-primary-200 dark:bg-primary-800 rounded-full"></div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: settings?.hero_image_url
          ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${settings.hero_image_url})`
          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6">
            {settings?.name || 'Taverna Zeus'}
          </h1>

          <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 mb-8 max-w-2xl mx-auto">
            {settings?.short_description || 'Authentische griechische Küche in herzlicher Atmosphäre'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 border-2 border-white hover:border-gray-200 transition-all duration-300"
              onClick={scrollToMenu}
            >
              <Utensils className="w-5 h-5 mr-2" />
              Zur Speisekarte
            </Button>

            <Link
              href="/standort"
              className="px-6 py-3 rounded-lg border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 flex items-center"
            >
              Standort & Kontakt
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${
            scrollY > 100 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <button
            onClick={scrollToMenu}
            className="flex flex-col items-center text-white/60 hover:text-white transition-colors"
            aria-label="Nach unten scrollen"
          >
            <span className="text-sm mb-2">Scrollen</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
    </section>
  );
}