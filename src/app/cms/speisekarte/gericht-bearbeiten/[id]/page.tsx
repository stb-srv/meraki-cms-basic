'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Image as ImageIcon, 
  Upload,
  Leaf,
  Flame,
  AlertCircle,
  Star,
  Tag
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMenu } from '@/hooks/useMenu';
import { useAllergens } from '@/hooks/useAllergens';
import { useAdditives } from '@/hooks/useAdditives';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createBrowserClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export default function EditMenuItemPage() {
  const { user, isAuthenticated, isAdmin, isEditor, loading: authLoading } = useAuth();
  const { categories, menuItems, loading: menuLoading, refetch } = useMenu();
  const { allergens, loading: allergensLoading } = useAllergens();
  const { additives, loading: additivesLoading } = useAdditives();
  const router = useRouter();
  const params = useParams();
  const supabase = createBrowserClient();

  const [formData, setFormData] = useState({
    category_id: '',
    number: '',
    name: '',
    description: '',
    price: '',
    price_note: '',
    display_order: 1,
    is_active: true,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_spicy: false,
    is_new: false,
    is_recommended: false,
    allergen_ids: [] as string[],
    additive_ids: [] as string[],
    image_url: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [itemNotFound, setItemNotFound] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated or not authorized
    if (!authLoading && (!isAuthenticated || (!isAdmin && !isEditor))) {
      router.push('/cms/login');
    }
  }, [isAuthenticated, isAdmin, isEditor, authLoading, router]);

  useEffect(() => {
    // Load menu item data when available
    if (menuItems.length > 0 && categories.length > 0 && params.id) {
      const menuItem = menuItems.find((item) => item.id === params.id);
      if (menuItem) {
        setFormData({
          category_id: menuItem.category_id,
          number: menuItem.number || '',
          name: menuItem.name,
          description: menuItem.description || '',
          price: menuItem.price ? menuItem.price.toString().replace('.', ',') : '',
          price_note: menuItem.price_note || '',
          display_order: menuItem.display_order,
          is_active: menuItem.is_active,
          is_vegetarian: menuItem.is_vegetarian,
          is_vegan: menuItem.is_vegan,
          is_gluten_free: menuItem.is_gluten_free,
          is_spicy: menuItem.is_spicy,
          is_new: menuItem.is_new,
          is_recommended: menuItem.is_recommended,
          allergen_ids: menuItem.allergen_ids || [],
          additive_ids: menuItem.additive_ids || [],
          image_url: menuItem.image_url || '',
        });
        if (menuItem.image_url) {
          setImagePreview(menuItem.image_url);
        }
      } else {
        setItemNotFound(true);
      }
    }
  }, [menuItems, categories, params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAllergenChange = (allergenId: string) => {
    setFormData((prev) => {
      const newAllergenIds = prev.allergen_ids.includes(allergenId)
        ? prev.allergen_ids.filter((id) => id !== allergenId)
        : [...prev.allergen_ids, allergenId];
      return { ...prev, allergen_ids: newAllergenIds };
    });
  };

  const handleAdditiveChange = (additiveId: string) => {
    setFormData((prev) => {
      const newAdditiveIds = prev.additive_ids.includes(additiveId)
        ? prev.additive_ids.filter((id) => id !== additiveId)
        : [...prev.additive_ids, additiveId];
      return { ...prev, additive_ids: newAdditiveIds };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        setError('Bitte geben Sie einen Gerichtenamen ein.');
        setIsLoading(false);
        return;
      }

      if (!formData.category_id) {
        setError('Bitte wählen Sie eine Kategorie aus.');
        setIsLoading(false);
        return;
      }

      // Upload image if selected
      let imageUrl = formData.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `menu_items/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('restaurant-images')
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('restaurant-images')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      // Update menu item
      const { data, error } = await supabase
        .from('menu_items')
        .update({
          category_id: formData.category_id,
          number: formData.number.trim() || null,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          price: formData.price ? parseFloat(formData.price.replace(',', '.')) : null,
          price_note: formData.price_note.trim() || null,
          display_order: formData.display_order,
          is_active: formData.is_active,
          is_vegetarian: formData.is_vegetarian,
          is_vegan: formData.is_vegan,
          is_gluten_free: formData.is_gluten_free,
          is_spicy: formData.is_spicy,
          is_new: formData.is_new,
          is_recommended: formData.is_recommended,
          allergen_ids: formData.allergen_ids,
          additive_ids: formData.additive_ids,
          image_url: imageUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.id)
        .select();

      if (error) {
        throw error;
      }

      setSuccess('Gericht wurde erfolgreich aktualisiert.');
      refetch();

      // Redirect to menu management after a short delay
      setTimeout(() => {
        router.push('/cms/speisekarte');
      }, 1500);
    } catch (err) {
      setError('Fehler beim Aktualisieren des Gerichts.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Möchten Sie dieses Gericht wirklich löschen?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Delete menu item
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', params.id);

      if (error) {
        throw error;
      }

      setSuccess('Gericht wurde erfolgreich gelöscht.');
      refetch();

      // Redirect to menu management
      setTimeout(() => {
        router.push('/cms/speisekarte');
      }, 1500);
    } catch (err) {
      setError('Fehler beim Löschen des Gerichts.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/cms/speisekarte');
  };

  if (authLoading || menuLoading || allergensLoading || additivesLoading) {
    return <LoadingSpinner fullPage text="Lade Daten..." />;
  }

  if (!isAuthenticated || (!isAdmin && !isEditor)) {
    return null;
  }

  if (itemNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/cms/speisekarte')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Zurück zur Speisekarte</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            Gericht nicht gefunden.
          </div>
        </main>
      </div>
    );
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
                onClick={() => router.push('/cms/speisekarte')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Zurück zur Speisekarte</span>
              </Button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Gericht bearbeiten
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div className="space-y-1">
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Kategorie *
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full h-10 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Bitte wählen Sie eine Kategorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Number */}
            <div className="space-y-1">
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nummer
              </label>
              <Input
                id="number"
                type="text"
                name="number"
                placeholder="z.B. 1, 2a, 3"
                value={formData.number}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name *
              </label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="z.B. Moussaka, Souvlaki, Tzatziki"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Beschreibung
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Beschreibung des Gerichts (optional)"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preis (€)
                </label>
                <Input
                  id="price"
                  type="text"
                  name="price"
                  placeholder="z.B. 12.50"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="price_note" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preis-Hinweis
                </label>
                <Input
                  id="price_note"
                  type="text"
                  name="price_note"
                  placeholder="z.B. ab 12,50 €, auf Anfrage"
                  value={formData.price_note}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* Display Order */}
            <div className="space-y-1">
              <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sortierreihenfolge
              </label>
              <Input
                id="display_order"
                type="number"
                name="display_order"
                min="1"
                value={formData.display_order}
                onChange={handleChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Bestimmt die Reihenfolge in der Kategorie (niedrigere Zahlen werden zuerst angezeigt)
              </p>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center space-x-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Gericht aktiv
              </span>
            </div>

            {/* Dietary Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ernährungsinformationen
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_vegetarian"
                    checked={formData.is_vegetarian}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Vegetarisch
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_vegan"
                    checked={formData.is_vegan}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Vegan
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_gluten_free"
                    checked={formData.is_gluten_free}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Glutenfrei
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_spicy"
                    checked={formData.is_spicy}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Scharf
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_new"
                    checked={formData.is_new}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Neu
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_recommended"
                    checked={formData.is_recommended}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Empfohlen
                  </span>
                </label>
              </div>
            </div>

            {/* Allergens */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Allergene
              </h3>
              <div className="flex flex-wrap gap-2">
                {allergens.map((allergen) => (
                  <button
                    key={allergen.id}
                    type="button"
                    onClick={() => handleAllergenChange(allergen.id)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      formData.allergen_ids.includes(allergen.id)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                    }`}
                  >
                    {allergen.code} - {allergen.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Additives */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Zusatzstoffe
              </h3>
              <div className="flex flex-wrap gap-2">
                {additives.map((additive) => (
                  <button
                    key={additive.id}
                    type="button"
                    onClick={() => handleAdditiveChange(additive.id)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      formData.additive_ids.includes(additive.id)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                    }`}
                  >
                    {additive.code} - {additive.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Gerichtbild
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Vorschau"
                        className="mx-auto max-h-48 rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview(null);
                          setFormData((prev) => ({ ...prev, image_url: '' }));
                        }}
                        className="flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Bild entfernen</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Klicken Sie hier, um ein Bild hochzuladen, oder ziehen Sie es hierher
                      </p>
                      <Button type="button" variant="ghost" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Bild auswählen
                      </Button>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                <X className="w-4 h-4 mr-2" />
                Abbrechen
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
                <X className="w-4 h-4 mr-2" />
                Löschen
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    <span>Speichern...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    <span>Gericht speichern</span>
                  </>
                )}
              </Button>
            </div>
          </form>
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