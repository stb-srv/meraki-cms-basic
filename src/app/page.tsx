import { Suspense } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { MenuPreview } from '@/components/MenuPreview';
import { LocationSection } from '@/components/LocationSection';
import { OpeningHours } from '@/components/OpeningHours';
import { AboutSection } from '@/components/AboutSection';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <Suspense fallback={<LoadingSpinner fullPage />}>
        <HeroSection />
      </Suspense>

      {/* About Section */}
      <Suspense fallback={<LoadingSpinner fullPage />}>
        <AboutSection />
      </Suspense>

      {/* Menu Preview */}
      <Suspense fallback={<LoadingSpinner fullPage />}>
        <MenuPreview />
      </Suspense>

      {/* Location Section */}
      <Suspense fallback={<LoadingSpinner fullPage />}>
        <LocationSection />
      </Suspense>

      {/* Opening Hours */}
      <Suspense fallback={<LoadingSpinner fullPage />}>
        <OpeningHours />
      </Suspense>
    </main>
  );
}