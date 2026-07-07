'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Navigation, Star, Heart, Restaurant } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { isCurrentlyOpen, getCurrentGermanDayName } from '@/lib/utils';

export default function LocationPage() {
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner fullPage text="Lade Standortinformationen..." />
        <Footer />
      </>
    );
  }

  const currentDay = getCurrentGermanDayName();
  const currentHours = settings?.opening_hours?.find(hour => hour.day === currentDay);
  const isOpen = isCurrentlyOpen(settings?.opening_hours || []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Unser Standort
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Besuchen Sie uns in unserem Restaurant und genießen Sie die authentische 
              griechische Atmosphäre.
            </p>
          </div>
        </section>

        {/* Location Content */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                {/* Status */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      {isOpen ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {isOpen ? 'Geöffnet' : 'Geschlossen'}
                      </h3>
                      {currentHours && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Heute: {currentHours.is_open ? (
                            currentHours.all_day ? 'Ganztägig' : `${currentHours.open} - ${currentHours.close}`
                          ) : 'Geschlossen'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

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
                        {settings?.name || 'Taverna Zeus'}
                        <br />
                        {settings?.address}
                        <br />
                        {settings?.postal_code} {settings?.city}
                        <br />
                        {settings?.country}
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
                            {settings?.phone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">
                            {settings?.email}
                          </span>
                        </div>
                        {settings?.website && (
                          <div className="flex items-center space-x-2">
                            <Navigation className="w-4 h-4 text-gray-400" />
                            <Link href={settings.website} className="text-primary-600 dark:text-primary-400 hover:underline">
                              {settings.website}
                            </Link>
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
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${settings?.address}, ${settings?.postal_code} ${settings?.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Navigation className="w-5 h-5 mr-2" />
                    Route planen
                  </a>
                  <a
                    href={`tel:${settings?.phone?.replace(/\s/g, '')}`}
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Anrufen
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Warum uns besuchen?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Erleben Sie die authentische griechische Gastfreundschaft
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Restaurant className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Authentische Atmosphäre
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Traditionelles griechisches Ambiente mit modernem Komfort
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Bewertungen
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Von Gästen für Qualität und Service empfohlen
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Familienfreundlich
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ideal für Familienfeiern und besondere Anlässe
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Parking Information */}
        <section className="py-8 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Parkmöglichkeiten
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                [Informationen zu Parkmöglichkeiten in der Nähe des Restaurants]
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Bitte beachten Sie die örtlichen Parkbestimmungen.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}