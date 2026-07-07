'use client';

import Link from 'next/link';
import { Building2, ChefHat, Heart } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export function AboutSection() {
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Über uns
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Willkommen in unserer Taverna
                </p>
              </div>
            </div>

            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="text-lg leading-relaxed">
                {settings?.description || `
                  In unserer Taverna Zeus erleben Sie die authentische griechische Küche 
                  in einer warmen und einladenden Atmosphäre. Seit unserer Gründung 
                  haben wir uns der Tradition und Qualität verschrieben.
                `}
              </p>

              <p className="leading-relaxed">
                Unsere Köche bereiten jeden Tag frische Zutaten nach traditionellen 
                Rezepten zu, die von Generation zu Generation weitergegeben wurden. 
                Ob Sie Lust auf klassische Moussaka, frischen Fisch oder unsere 
                hausgemachten Mezze haben – bei uns finden Sie eine große Auswahl 
                an griechischen Spezialitäten.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <ChefHat className="w-8 h-8 mx-auto mb-2 text-primary-600 dark:text-primary-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Traditionelle Rezepte
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Authentische griechische Küche
                </p>
              </div>

              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Herzliche Atmosphäre
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Familienfreundliches Ambiente
                </p>
              </div>

              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Building2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Frische Zutaten
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Täglich frisch zubereitet
                </p>
              </div>
            </div>

            <Link
              href="/ueber-uns"
              className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Mehr über uns erfahren
              <span className="ml-2">→</span>
            </Link>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
              {settings?.hero_image_url ? (
                <img
                  src={settings.hero_image_url}
                  alt="Taverna Zeus Innenansicht"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 flex items-center justify-center">
                  <div className="text-center">
                    <Building2 className="w-16 h-16 mx-auto mb-4 text-primary-600 dark:text-primary-400 opacity-50" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Restaurant Bild
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Decorative overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}