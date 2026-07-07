'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Utensils, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMenu } from '@/hooks/useMenu';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createBrowserClient } from '@/lib/supabase/client';
import { MenuCategory, MenuItem } from '@/types/database';

export default function MenuManagementPage() {
  const { user, isAuthenticated, isAdmin, isEditor, loading: authLoading } = useAuth();
  const { categories, menuItems, loading, refetch, getActiveCategories, getActiveMenuItems } = useMenu();
  const router = useRouter();
  const supabase = createBrowserClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Redirect if not authenticated or not authorized
    if (!authLoading && (!isAuthenticated || (!isAdmin && !isEditor))) {
      router.push('/cms/login');
    }
  }, [isAuthenticated, isAdmin, isEditor, authLoading, router]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Möchten Sie diese Kategorie wirklich löschen? Alle zugehörigen Speisen werden ebenfalls gelöscht!')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, delete all menu items in this category
      const { error: itemsError } = await supabase
        .from('menu_items')
        .delete()
        .eq('category_id', categoryId);

      if (itemsError) {
        throw itemsError;
      }

      // Then delete the category
      const { error: categoryError } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', categoryId);

      if (categoryError) {
        throw categoryError;
      }

      setSuccess('Kategorie und zugehörige Speisen wurden erfolgreich gelöscht.');
      refetch();
    } catch (err) {
      setError('Fehler beim Löschen der Kategorie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!window.confirm('Möchten Sie dieses Gericht wirklich löschen?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        throw error;
      }

      setSuccess('Gericht wurde erfolgreich gelöscht.');
      refetch();
    } catch (err) {
      setError('Fehler beim Löschen des Gerichts.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (type: 'category' | 'item', id: string, currentStatus: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      const table = type === 'category' ? 'menu_categories' : 'menu_items';
      const { error } = await supabase
        .from(table)
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setSuccess(`${type === 'category' ? 'Kategorie' : 'Gericht'} wurde erfolgreich aktualisiert.`);
      refetch();
    } catch (err) {
      setError(`Fehler beim Aktualisieren der ${type === 'category' ? 'Kategorie' : 'Gerichts'}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = async (type: 'category' | 'item', id: string, newOrder: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const table = type === 'category' ? 'menu_categories' : 'menu_items';
      const { error } = await supabase
        .from(table)
        .update({ display_order: newOrder })
        .eq('id', id);

      if (error) {
        throw error;
      }

      refetch();
    } catch (err) {
      setError(`Fehler beim Verschieben der ${type === 'category' ? 'Kategorie' : 'Gerichts'}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = getActiveCategories().filter((category) => {
    if (!showInactive && !category.is_active) return false;
    if (selectedCategory && selectedCategory !== category.id) return false;
    return category.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredMenuItems = getActiveMenuItems().filter((item) => {
    if (!showInactive && !item.is_active) return false;
    if (selectedCategory && item.category_id !== selectedCategory) return false;
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.number.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (authLoading || loading) {
    return <LoadingSpinner fullPage text="Lade Speisekarte..." />;
  }

  if (!isAuthenticated || (!isAdmin && !isEditor)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/cms')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Zurück zum Dashboard</span>
              </Button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Speisekarte verwalten
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild>
                <Link href="/cms/speisekarte/kategorie-hinzufuegen">
                  <Plus className="w-4 h-4 mr-2" />
                  Kategorie hinzufügen
                </Link>
              </Button>
              <Button asChild>
                <Link href="/cms/speisekarte/gericht-hinzufuegen">
                  <Plus className="w-4 h-4 mr-2" />
                  Gericht hinzufügen
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Suche nach Gerichten oder Kategorien..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full h-10 pl-10 pr-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Alle Kategorien</option>
                {getActiveCategories().map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Inaktive anzeigen
              </span>
            </label>
          </div>
        </div>

        {/* Categories and Menu Items */}
        <div className="space-y-6">
          {/* Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Kategorien
                </h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/cms/speisekarte/kategorie-hinzufuegen">
                    <Plus className="w-4 h-4 mr-2" />
                    Hinzufügen
                  </Link>
                </Button>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div key={category.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          {expandedCategories.has(category.id) ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        <div className="flex items-center space-x-2">
                          <Utensils className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </span>
                          {!category.is_active && (
                            <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                              Inaktiv
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {getActiveMenuItems().filter((item) => item.category_id === category.id).length} Gerichte
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive('category', category.id, category.is_active)}
                          className="p-1"
                        >
                          {category.is_active ? (
                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="p-1"
                        >
                          <Link href={`/cms/speisekarte/kategorie-bearbeiten/${category.id}`}>
                            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {expandedCategories.has(category.id) && (
                      <div className="mt-4 ml-8 space-y-3">
                        {/* Menu Items in this category */}
                        {getActiveMenuItems()
                          .filter((item) => item.category_id === category.id)
                          .map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  {item.number}.
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {item.name}
                                </span>
                                {!item.is_active && (
                                  <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                                    Inaktiv
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                  {item.price ? `€ ${item.price.toFixed(2)}` : 'Preis auf Anfrage'}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleActive('item', item.id, item.is_active)}
                                  className="p-1"
                                >
                                  {item.is_active ? (
                                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                  ) : (
                                    <EyeOff className="w-4 h-4 text-gray-400" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="p-1"
                                >
                                  <Link href={`/cms/speisekarte/gericht-bearbeiten/${item.id}`}>
                                    <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteMenuItem(item.id)}
                                  className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Utensils className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Keine Kategorien gefunden.</p>
                  <Button className="mt-4" asChild>
                    <Link href="/cms/speisekarte/kategorie-hinzufuegen">
                      <Plus className="w-4 h-4 mr-2" />
                      Erste Kategorie hinzufügen
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Menu Items not in categories */}
          {filteredMenuItems.filter((item) => !categories.some((cat) => cat.id === item.category_id)).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Gerichte ohne Kategorie
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMenuItems
                  .filter((item) => !categories.some((cat) => cat.id === item.category_id))
                  .map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {item.number}.
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </span>
                          {!item.is_active && (
                            <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                              Inaktiv
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {item.price ? `€ ${item.price.toFixed(2)}` : 'Preis auf Anfrage'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive('item', item.id, item.is_active)}
                            className="p-1"
                          >
                            {item.is_active ? (
                              <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="p-1"
                          >
                            <Link href={`/cms/speisekarte/gericht-bearbeiten/${item.id}`}>
                              <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Taverna Zeus CMS
          </p>
        </div>
      </footer>
    </div>
  );
}