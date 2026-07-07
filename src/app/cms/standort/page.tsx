'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, MapPin, Phone, Mail, Globe, Building, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createBrowserClient } from '@/lib/supabase/client';

export default function LocationPage() {
  const { user, isAuthenticated, isAdmin, isEditor, loading: authLoading } = useAuth();
  const { settings, loading: settingsLoading, refetch } = useSettings();
  const router = useRouter();
  const supabase = createBrowserClient();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    google_maps_url: '',
    google_maps_iframe: '',
    latitude: '',
    longitude: '',
  });
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
        address: settings.address || '',
        city: settings.city || '',
        postal_code: settings.postal_code || '',
        country: settings.country || '',
        phone: settings.phone || '',
        email: settings.email || '',
        website: settings.website || '',
        google_maps_url: settings.google_maps_url || '',
        google_maps_iframe: settings.google_maps_iframe || '',
        latitude: settings.latitude ? settings.latitude.toString() : '',
        longitude: settings.longitude ? settings.longitude.toString() : '',
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        setError('Bitte geben Sie einen Restaurantsnamen ein.');
        setIsLoading(false);
        return;
      }

      if (!formData.address.trim()) {
        setError('Bitte geben Sie eine Adresse ein.');
        setIsLoading(false);
        return;
      }

      if (!formData.city.trim()) {
        setError('Bitte geben Sie eine Stadt ein.');
        setIsLoading(false);
        return;
      }

      // Update restaurant settings
      const { data, error } = await supabase
        .from('restaurant_settings')
        .update({
          name: formData.name.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postal_code: formData.postal_code.trim() || null,
          country: formData.country.trim() || null,
          phone: formData.phone.trim() || null,
          email: formData.email.trim() || null,
          website: formData.website.trim() || null,
          google_maps_url: formData.google_maps_url.trim() || null,
          google_maps_iframe: formData.google_maps_iframe.trim() || null,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings?.id || '880e8400-e29b-41d4-a716-446655440000')
        .select();

      if (error) {
        throw error;
      }

      setSuccess('Standort- und Kontaktdaten wurden erfolgreich aktualisiert.');
      refetch();

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Fehler beim Speichern der Standort- und Kontaktdaten.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to default values
    if (settings) {
      setFormData({
        name: settings.name || '',
        address: settings.address || '',
        city: settings.city || '',
        postal_code: settings.postal_code || '',
        country: settings.country || '',
        phone: settings.phone || '',
        email: settings.email || '',
        website: settings.website || '',
        google_maps_url: settings.google_maps_url || '',
        google_maps_iframe: settings.google_maps_iframe || '',
        latitude: settings.latitude ? settings.latitude.toString() : '',
        longitude: settings.longitude ? settings.longitude.toString() : '',
      });
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
                Standort & Kontakt verwalten
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
                <Building className="w-5 h-5 mr-2" />
                Restaurant-Informationen
              </h3>
            </div>

            {/* Restaurant Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Restaurantname *
              </label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="z.B. Taverna Zeus"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Adresse *
              </label>
              <Input
                id="address"
                type="text"
                name="address"
                placeholder="z.B. Hauptstraße 42"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            {/* City, Postal Code, Country */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stadt *
                </label>
                <Input
                  id="city"
                  type="text"
                  name="city"
                  placeholder="z.B. Berlin"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Postleitzahl
                </label>
                <Input
                  id="postal_code"
                  type="text"
                  name="postal_code"
                  placeholder="z.B. 10115"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Land
                </label>
                <Input
                  id="country"
                  type="text"
                  name="country"
                  placeholder="z.B. Deutschland"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Kontaktdaten
              </h3>
            </div>

            {/* Phone, Email, Website */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Telefon
                </label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="z.B. +49 30 12345678"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-Mail
                </label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="z.B. info@taverna-zeus.de"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Website
                </label>
                <Input
                  id="website"
                  type="url"
                  name="website"
                  placeholder="z.B. https://www.taverna-zeus.de"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* Google Maps */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Google Maps
              </h3>
            </div>

            {/* Google Maps URL */}
            <div className="space-y-1">
              <label htmlFor="google_maps_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Google Maps URL
              </label>
              <Input
                id="google_maps_url"
                type="url"
                name="google_maps_url"
                placeholder="z.B. https://www.google.com/maps/place/Taverna+Zeus"
                value={formData.google_maps_url}
                onChange={handleChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                URL zur Google Maps Seite Ihres Restaurants
              </p>
            </div>

            {/* Google Maps Iframe */}
            <div className="space-y-1">
              <label htmlFor="google_maps_iframe" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Google Maps Iframe-Code
              </label>
              <textarea
                id="google_maps_iframe"
                name="google_maps_iframe"
                placeholder='z.B. &lt;iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"&gt;&lt;/iframe&gt;'
                value={formData.google_maps_iframe}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Einbettungscode für die Google Maps Karte auf Ihrer Website
              </p>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Breitengrad (Latitude)
                </label>
                <Input
                  id="latitude"
                  type="text"
                  name="latitude"
                  placeholder="z.B. 52.520008"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Längengrad (Longitude)
                </label>
                <Input
                  id="longitude"
                  type="text"
                  name="longitude"
                  placeholder="z.B. 13.404954"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
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
                    <span>Standort & Kontakt speichern</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-8">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Vorschau - Standort & Kontakt
          </h3>

          <div className="space-y-6">
            {/* Restaurant Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                {formData.name || 'Restaurantname'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formData.address || 'Adresse'}{' '}
                {formData.postal_code && formData.city && `, ${formData.postal_code} ${formData.city}`}
                {formData.country && `, ${formData.country}`}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Kontaktdaten
              </h4>
              <div className="space-y-2">
                {formData.phone && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {formData.phone}
                  </p>
                )}
                {formData.email && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {formData.email}
                  </p>
                )}
                {formData.website && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    {formData.website}
                  </p>
                )}
              </div>
            </div>

            {/* Google Maps Preview */}
            {formData.google_maps_iframe && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Google Maps Karte
                </h4>
                <div
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: formData.google_maps_iframe }}
                />
              </div>
            )}

            {/* Coordinates Preview */}
            {(formData.latitude || formData.longitude) && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Koordinaten
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Breitengrad: {formData.latitude || 'N/A'}{' '}
                  Längengrad: {formData.longitude || 'N/A'}
                </p>
              </div>
            )}
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