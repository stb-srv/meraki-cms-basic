'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, Settings, Image as ImageIcon, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createBrowserClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export default function SettingsPage() {
  const { user, isAuthenticated, isAdmin, isEditor, loading: authLoading } = useAuth();
  const { settings, loading: settingsLoading, refetch } = useSettings();
  const router = useRouter();
  const supabase = createBrowserClient();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    hero_image_url: '',
    logo_url: '',
  });
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated or not authorized
    if (!authLoading && (!isAuthenticated || (!isAdmin && !isEditor))) {
      router.push('/cms/login');
    }
  }, [isAuthenticated, isAdmin, isEditor, authLoading, router]);

  useEffect(() => {
    // Load settings data
    if (settings) {
      setFormData({
        name: settings.name || '',
        description: settings.description || '',
        short_description: settings.short_description || '',
        hero_image_url: settings.hero_image_url || '',
        logo_url: settings.logo_url || '',
      });
      if (settings.hero_image_url) {
        setHeroImagePreview(settings.hero_image_url);
      }
      if (settings.logo_url) {
        setLogoPreview(settings.logo_url);
      }
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setHeroImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
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
      // Upload hero image if selected
      let heroImageUrl = formData.hero_image_url;
      if (heroImageFile) {
        const fileExt = heroImageFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `restaurant/hero/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('restaurant-images')
          .upload(filePath, heroImageFile, {
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

        heroImageUrl = urlData.publicUrl;
      }

      // Upload logo if selected
      let logoUrl = formData.logo_url;
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `restaurant/logo/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('restaurant-images')
          .upload(filePath, logoFile, {
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

        logoUrl = urlData.publicUrl;
      }

      // Update restaurant settings
      const { data, error } = await supabase
        .from('restaurant_settings')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          short_description: formData.short_description.trim() || null,
          hero_image_url: heroImageUrl || null,
          logo_url: logoUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings?.id || '880e8400-e29b-41d4-a716-446655440000')
        .select();

      if (error) {
        throw error;
      }

      setSuccess('Einstellungen wurden erfolgreich aktualisiert.');
      refetch();

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Fehler beim Speichern der Einstellungen.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to current settings values
    if (settings) {
      setFormData({
        name: settings.name || '',
        description: settings.description || '',
        short_description: settings.short_description || '',
        hero_image_url: settings.hero_image_url || '',
        logo_url: settings.logo_url || '',
      });
      setHeroImagePreview(settings.hero_image_url || null);
      setLogoPreview(settings.logo_url || null);
      setHeroImageFile(null);
      setLogoFile(null);
    }
  };

  const handleCancel = () => {
    router.push('/cms');
  };

  if (authLoading || settingsLoading) {
    return <LoadingSpinner fullPage text="Lade Daten..." />;
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
                Einstellungen verwalten
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
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Allgemeine Einstellungen
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Konfigurieren Sie die grundlegenden Einstellungen Ihres Restaurants.
              </p>
            </div>

            {/* Restaurant Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Restaurantname
              </label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="z.B. Taverna Zeus"
                value={formData.name}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-1">
              <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Kurzbeschreibung
              </label>
              <Input
                id="short_description"
                type="text"
                name="short_description"
                placeholder="z.B. Authentische griechische Küche seit 1995"
                value={formData.short_description}
                onChange={handleChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kurze Beschreibung, die auf der Startseite angezeigt wird
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Beschreibung
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Detaillierte Beschreibung Ihres Restaurants..."
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ausführliche Beschreibung für die "Über uns" Seite
              </p>
            </div>

            {/* Hero Image */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Hero-Bild
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageChange}
                  className="hidden"
                  id="hero-image-upload"
                />
                <label htmlFor="hero-image-upload" className="cursor-pointer">
                  {heroImagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={heroImagePreview}
                        alt="Hero-Bild Vorschau"
                        className="mx-auto max-h-48 rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setHeroImageFile(null);
                          setHeroImagePreview(null);
                          setFormData((prev) => ({ ...prev, hero_image_url: '' }));
                        }}
                        className="flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Bild entfernen</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Klicken Sie hier, um ein Hero-Bild hochzuladen, oder ziehen Sie es hierher
                      </p>
                      <Button type="button" variant="ghost" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Hero-Bild auswählen
                      </Button>
                    </div>
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Dieses Bild wird auf der Startseite als Hintergrund angezeigt. Empfohlene Größe: 1920x1080 Pixel
              </p>
            </div>

            {/* Logo */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Logo
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  {logoPreview ? (
                    <div className="space-y-4">
                      <img
                        src={logoPreview}
                        alt="Logo Vorschau"
                        className="mx-auto max-h-24 rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLogoFile(null);
                          setLogoPreview(null);
                          setFormData((prev) => ({ ...prev, logo_url: '' }));
                        }}
                        className="flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Logo entfernen</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Klicken Sie hier, um ein Logo hochzuladen, oder ziehen Sie es hierher
                      </p>
                      <Button type="button" variant="ghost" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Logo auswählen
                      </Button>
                    </div>
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ihr Restaurant-Logo. Empfohlene Größe: 300x150 Pixel (transparenten Hintergrund bevorzugen)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
                <Trash2 className="w-4 h-4 mr-2" />
                Zurücksetzen
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                <X className="w-4 h-4 mr-2" />
                Abbrechen
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
                    <span>Einstellungen speichern</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-8">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Vorschau - Einstellungen
          </h3>

          <div className="space-y-6">
            {/* Restaurant Info Preview */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Restaurantname
              </h4>
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {formData.name || 'Restaurantname'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {formData.short_description || 'Kurzbeschreibung'}
              </p>
            </div>

            {/* Description Preview */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Beschreibung
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formData.description || 'Detaillierte Beschreibung Ihres Restaurants...'}
              </p>
            </div>

            {/* Images Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {heroImagePreview && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Hero-Bild
                  </h4>
                  <img
                    src={heroImagePreview}
                    alt="Hero-Bild Vorschau"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              {logoPreview && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Logo
                  </h4>
                  <img
                    src={logoPreview}
                    alt="Logo Vorschau"
                    className="h-16 mx-auto object-contain"
                  />
                </div>
              )}
            </div>
          </div>
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