'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Utensils, Search, Filter, Leaf, Flame, AlertCircle, Star } from 'lucide-react';
import { useMenu } from '@/hooks/useMenu';
import { useAllergens } from '@/hooks/useAllergens';
import { useAdditives } from '@/hooks/useAdditives';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MenuItemCard } from '@/components/MenuItemCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function MenuPage() {
  const { categories, menuItems, loading, getActiveCategories, getActiveMenuItems, searchMenuItems, filterMenuItems } = useMenu();
  const { allergens } = useAllergens();
  const { additives } = useAdditives();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    spicy: false,
  });
  const [showAllergens, setShowAllergens] = useState(false);

  useEffect(() => {
    // Scroll to category if hash is present in URL
    if (window.location.hash) {
      const categoryId = window.location.hash.substring(1);
      setSelectedCategory(categoryId);
      const element = document.getElementById(categoryId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [categories]);

  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const clearFilters = () => {
    setFilters({
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      spicy: false,
    });
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const activeCategories = getActiveCategories();
  const activeMenuItems = getActiveMenuItems();

  // Apply filters
  let filteredMenuItems = activeMenuItems;
  
  if (selectedCategory) {
    filteredMenuItems = filteredMenuItems.filter((item) => item.category_id === selectedCategory);
  }
  
  if (searchQuery) {
    filteredMenuItems = searchMenuItems(searchQuery);
  }
  
  if (Object.values(filters).some(Boolean)) {
    filteredMenuItems = filterMenuItems(filters);
  }

  // Group menu items by category
  const menuItemsByCategory: Record<string, typeof filteredMenuItems> = {};
  activeCategories.forEach((category) => {
    menuItemsByCategory[category.id] = filteredMenuItems.filter(
      (item) => item.category_id === category.id
    );
  });

  // Items without category
  const itemsWithoutCategory = filteredMenuItems.filter(
    (item) => !activeCategories.some((cat) => cat.id === item.category_id)
  );

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner fullPage text="Lade Speisekarte..." />
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Unsere Speisekarte
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Entdecken Sie unsere kulinarischen Köstlichkeiten – von traditionellen 
              griechischen Klassikern bis zu modernen Interpretationen.
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 bg-white dark:bg-gray-900 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Suche nach Gerichten..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="w-full h-10 pl-10 pr-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Alle Kategorien</option>
                    {activeCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dietary Filters */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFilterChange('vegetarian')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors flex items-center space-x-1 ${
                      filters.vegetarian
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                  >
                    <Leaf className="w-4 h-4" />
                    <span>Vegetarisch</span>
                  </button>
                  <button
                    onClick={() => handleFilterChange('vegan')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors flex items-center space-x-1 ${
                      filters.vegan
                        ? 'bg-green-700 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                  >
                    <Leaf className="w-4 h-4" />
                    <span>Vegan</span>
                  </button>
                  <button
                    onClick={() => handleFilterChange('glutenFree')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors flex items-center space-x-1 ${
                      filters.glutenFree
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Glutenfrei</span>
                  </button>
                  <button
                    onClick={() => handleFilterChange('spicy')}
                    className={`px-3 py-1 text-sm rounded-full transition-colors flex items-center space-x-1 ${
                      filters.spicy
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    <span>Scharf</span>
                  </button>
                  {(Object.values(filters).some(Boolean) || searchQuery || selectedCategory) && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Zurücksetzen
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Content */}
        <section className="py-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Navigation */}
            {activeCategories.length > 0 && (
              <div className="sticky top-24 z-20 bg-gray-50 dark:bg-gray-800 py-4 mb-8">
                <div className="flex flex-wrap justify-center gap-2">
                  {activeCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`#${category.id}`}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                      }`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Menu Categories */}
            <div className="space-y-8">
              {activeCategories.length > 0 ? (
                activeCategories.map((category) => {
                  const categoryItems = menuItemsByCategory[category.id];
                  
                  if (categoryItems.length === 0 && (searchQuery || Object.values(filters).some(Boolean))) {
                    return null;
                  }

                  return (
                    <div
                      key={category.id}
                      id={category.id}
                      className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden"
                    >
                      {/* Category Header */}
                      <div className="px-6 py-4 bg-primary-600 dark:bg-primary-800">
                        <h2 className="text-xl font-bold text-white">{category.name}</h2>
                        {category.description && (
                          <p className="text-primary-100 dark:text-primary-300 mt-1">{category.description}</p>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="divide-y divide-gray-200 dark:divide-gray-600">
                        {categoryItems.map((item) => (
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            categories={activeCategories}
                            showCategory={false}
                            showImage={true}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Utensils className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Keine Kategorien verfügbar.
                  </p>
                </div>
              )}

              {/* Items without category */}
              {itemsWithoutCategory.length > 0 && (
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-100 dark:bg-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Sonstige Gerichte
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-600">
                    {itemsWithoutCategory.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        categories={activeCategories}
                        showCategory={false}
                        showImage={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {activeCategories.length > 0 && 
               Object.values(menuItemsByCategory).every(arr => arr.length === 0) &&
               itemsWithoutCategory.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Keine Gerichte gefunden
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery 
                      ? `Keine Gerichte gefunden für: "${searchQuery}"`
                      : 'Keine Gerichte entsprechen den ausgewählten Filtern.'}
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-4"
                  >
                    Filter zurücksetzen
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Allergen Legend */}
        {showAllergens && allergens.length > 0 && (
          <section className="py-8 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Allergen-Legende
                  </h3>
                  <button
                    onClick={() => setShowAllergens(false)}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Ausblenden
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allergens.map((allergen) => (
                    <span
                      key={allergen.id}
                      className="allergen-icon allergen-{allergen.code} cursor-default"
                      title={`${allergen.name}: ${allergen.description || ''}`}
                    >
                      {allergen.code}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <strong>Hinweis:</strong> Trotz größter Sorgfalt können Spuren von Allergenen 
                    in unseren Gerichten enthalten sein.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {!showAllergens && allergens.length > 0 && (
          <div className="py-4 text-center">
            <button
              onClick={() => setShowAllergens(true)}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Allergen-Legende anzeigen
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Import Button component
import { Button } from '@/components/ui/Button';

// Add this to the imports at the top
// import { Button } from '@/components/ui/Button';

// This is already included in the code above