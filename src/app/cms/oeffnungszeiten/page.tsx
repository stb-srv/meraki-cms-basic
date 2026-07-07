'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, Clock, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createBrowserClient } from '@/lib/supabase/client';

export default function OpeningHoursPage() {
  const { user, isAuthenticated, isAdmin, isEditor, loading: authLoading } = useAuth();
  const { settings, loading: settingsLoading, refetch } = useSettings();
  const router = useRouter();
  const supabase = createBrowserClient();

  const [openingHours, setOpeningHours] = useState<{
    day: string;
    open: string | null;
    close: string | null;
    is_open: boolean;
    all_day: boolean;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const daysOfWeek = [
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
    'Sonntag',
  ];

  useEffect(() => {
    // Redirect if not authenticated or not authorized
    if (!authLoading && (!isAuthenticated || (!isAdmin && !isEditor))) {
      router.push('/cms/login');
    }
  }, [isAuthenticated, isAdmin, isEditor, authLoading, router]);

  useEffect(() => {
    // Load opening hours from settings
    if (settings?.opening_hours) {
      // Ensure we have all 7 days
      const allDays = daysOfWeek.map((day) => {
        const existingDay = settings.opening_hours.find((oh: any) => oh.day === day);
        return existingDay || {
          day,
          open: null,
          close: null,
          is_open: false,
          all_day: false,
        };
      });
      setOpeningHours(allDays);
    } else {
      // Initialize with default values
      const defaultHours = daysOfWeek.map((day) => ({
        day,
        open: day === 'Samstag' || day === 'Freitag' ? '12:00' : '12:00',
        close: day === 'Samstag' || day === 'Freitag' ? '23:00' : '22:00',
        is_open: true,
        all_day: false,
      }));
      setOpeningHours(defaultHours);
    }
  }, [settings]);

  const handleChange = (dayIndex: number, field: string, value: string | boolean) => {
    setOpeningHours((prev) => {
      const newHours = [...prev];
      const day = newHours[dayIndex];
      
      if (field === 'all_day') {
        newHours[dayIndex] = {
          ...day,
          all_day: value as boolean,
          open: value ? '00:00' : day.open,
          close: value ? '23:59' : day.close,
        };
      } else if (field === 'is_open') {
        newHours[dayIndex] = {
          ...day,
          is_open: value as boolean,
          open: value ? day.open : null,
          close: value ? day.close : null,
        };
      } else {
        newHours[dayIndex] = {
          ...day,
          [field]: value,
        };
      }
      
      return newHours;
    });
  };

  const handleTimeChange = (dayIndex: number, field: 'open' | 'close', value: string) => {
    setOpeningHours((prev) => {
      const newHours = [...prev];
      newHours[dayIndex] = {
        ...newHours[dayIndex],
        [field]: value,
      };
      return newHours;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Validate that at least one day is open
      const hasOpenDay = openingHours.some((day) => day.is_open);
      if (!hasOpenDay) {
        setError('Mindestens ein Tag muss geöffnet sein.');
        setIsLoading(false);
        return;
      }

      // Update restaurant settings with new opening hours
      const { data, error } = await supabase
        .from('restaurant_settings')
        .update({
          opening_hours: openingHours,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings?.id || '880e8400-e29b-41d4-a716-446655440000')
        .select();

      if (error) {
        throw error;
      }

      setSuccess('Öffnungszeiten wurden erfolgreich aktualisiert.');
      refetch();

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Fehler beim Speichern der Öffnungszeiten.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to default opening hours
    const defaultHours = daysOfWeek.map((day) => ({
      day,
      open: day === 'Samstag' || day === 'Freitag' ? '12:00' : '12:00',
      close: day === 'Samstag' || day === 'Freitag' ? '23:00' : '22:00',
      is_open: true,
      all_day: false,
    }));
    setOpeningHours(defaultHours);
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
                Öffnungszeiten verwalten
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
                <Clock className="w-5 h-5 mr-2" />
                Öffnungszeiten pro Tag
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Konfigurieren Sie die Öffnungszeiten für jeden Wochentag. Sie können einzelne Tage schließen oder als ganztägig geöffnet markieren.
              </p>
            </div>

            {/* Opening Hours Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tag
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Öffnung
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Schließung
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {openingHours.map((day, index) => (
                    <tr
                      key={day.day}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        {day.day}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={day.is_open}
                              onChange={(e) => handleChange(index, 'is_open', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Geöffnet
                            </span>
                          </label>
                          {day.is_open && (
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={day.all_day}
                                onChange={(e) => handleChange(index, 'all_day', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                Ganztägig
                              </span>
                            </label>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {day.is_open && !day.all_day ? (
                          <Input
                            type="time"
                            value={day.open || ''}
                            onChange={(e) => handleTimeChange(index, 'open', e.target.value)}
                            className="w-24"
                            disabled={day.all_day}
                          />
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {day.is_open && !day.all_day ? (
                          <Input
                            type="time"
                            value={day.close || ''}
                            onChange={(e) => handleTimeChange(index, 'close', e.target.value)}
                            className="w-24"
                            disabled={day.all_day}
                          />
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    <span>Öffnungszeiten speichern</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-8">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Vorschau - Öffnungszeiten
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {openingHours.map((day) => (
              <div
                key={day.day}
                className={`p-4 rounded-lg ${
                  day.is_open
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{day.day}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      day.is_open
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {day.is_open ? (day.all_day ? 'Ganztägig geöffnet' : 'Geöffnet') : 'Geschlossen'}
                  </span>
                </div>
                {day.is_open && !day.all_day && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {day.open} - {day.close} Uhr
                  </div>
                )}
                {day.is_open && day.all_day && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    00:00 - 23:59 Uhr
                  </div>
                )}
              </div>
            ))}
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