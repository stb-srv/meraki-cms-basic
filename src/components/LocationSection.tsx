'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Button } from './ui/Button';

export function LocationSection() {
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Unser Standort
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Besuchen Sie uns in unserem Restaurant und genießen Sie die authentische 
            griechische Atmosphäre.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Map */}
          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
            {settings?.google_maps_iframe ? (
              <iframe
                src={settings.google_maps_iframe}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Taverna Zeus Standort"
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-800/30 dark:to-primary-900/30">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-primary-600 dark:text-primary-400 opacity-50" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Google Maps wird geladen...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Address */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Adresse
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {settings?.address || 'Hauptstraße 1'}
                    <br />
                    {settings?.postal_code} {settings?.city || '10115 Berlin'}
                    <br />
                    {settings?.country || 'Deutschland'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Kontakt
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {settings?.phone || '+49 30 12345678'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {settings?.email || 'info@taverna-zeus.de'}
                      </span>
                    </div>
                    {settings?.website && (
                      <div className="flex items-center space-x-2">
                        <Navigation className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {settings.website}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Öffnungszeiten
                  </h3>
                  <div className="space-y-1 text-sm">
                    {settings?.opening_hours?.map((hour, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          {hour.day}
                        </span>
                        <span className={`font-medium ${
                          hour.is_open ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                        }`}>
                          {hour.is_open ? (
                            hour.all_day ? 'Ganztägig' : `${hour.open} - ${hour.close}`
                          ) : (
                            'Geschlossen'
                          )}
                        </span>
                      </div>
                    )) || (
                      <div className="text-gray-500 dark:text-gray-400">
                        Öffnungszeiten werden geladen...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/standort">
                  <Navigation className="w-5 h-5 mr-2" />
                  Route planen
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="tel:{settings?.phone || '+493012345678'}">
                  <Phone className="w-5 h-5 mr-2" />
                  Anrufen
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}