'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Utensils, Star, Leaf, Flame } from 'lucide-react';
import { useMenu } from '@/hooks/useMenu';
import { Button } from './ui/Button';
import { MenuItemCard } from './MenuItemCard';

export function MenuPreview() {
  const { categories, menuItems, loading } = useMenu();
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);

  useEffect(() => {
    if (menuItems.length > 0) {
      // Get recommended and new items for preview
      const featured = menuItems.filter(
        (item) => item.is_recommended || item.is_new
      ).slice(0, 6);
      
      // If not enough featured items, add some random ones
      if (featured.length < 6 && menuItems.length > 6) {
        const remainingItems = menuItems.filter(
          (item) => !item.is_recommended && !item.is_new
        );
        const additionalItems = remainingItems
          .sort(() => 0.5 - Math.random())
          .slice(0, 6 - featured.length);
        setFeaturedItems([...featured, ...additionalItems]);
      } else {
        setFeaturedItems(featured);
      }
    }
  }, [menuItems]);

  if (loading) {
    return (
      <section id="menu-preview" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu-preview" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Utensils className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Unsere Speisekarte
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Entdecken Sie unsere kulinarischen Köstlichkeiten – von traditionellen 
            griechischen Klassikern bis zu modernen Interpretationen.
          </p>
        </div>

        {/* Featured Categories Navigation */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/speisekarte#${category.id}`}
                className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                {category.name}
              </Link>
            ))}
            {categories.length > 4 && (
              <Link
                href="/speisekarte"
                className="px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Alle Kategorien
              </Link>
            )}
          </div>
        )}

        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              categories={categories}
              showCategory={true}
              compact={true}
            />
          ))}
        </div>

        {/* Special Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Vegetarisch & Vegan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Viele Gerichte für vegetarische und vegane Gäste
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Empfohlene Gerichte
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Unsere beliebtesten Spezialitäten
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flame className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Scharf & Würzig
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Für Freunde intensiver Aromen
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/speisekarte">
              Komplette Speisekarte anzeigen
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}