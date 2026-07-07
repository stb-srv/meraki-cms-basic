'use client';

import Link from 'next/link';
import { Restaurant, ChefHat, Heart, Star, Users, Calendar, Award } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function AboutUsPage() {
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner fullPage text="Lade Informationen..." />
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
              <Restaurant className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Über uns
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Willkommen in der Taverna Zeus – wo griechische Tradition auf moderne 
              Gastfreundschaft trifft.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Unsere Geschichte
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    {settings?.description || `
                      Die Taverna Zeus wurde mit dem Traum gegründet, die authentische griechische 
                      Küche und Kultur nach [Stadtname] zu bringen. Seit unserer Eröffnung im Jahr 
                      [Jahr] haben wir uns der Tradition und Qualität verschrieben.
                    `}
                  </p>
                  <p>
                    Unser Gründer [Name] hatte eine Vision: Ein Restaurant zu schaffen, das nicht nur 
                    exzellentes Essen, sondern auch die warme, herzliche Atmosphäre Griechenlands 
                    bietet. Diese Vision leben wir jeden Tag.
                  </p>
                  <p>
                    Im Laufe der Jahre haben wir viele treue Gäste willkommen geheißen und sind 
                    stolz darauf, ein fester Bestandteil der [Stadtname]er Gastronomieszene geworden 
                    zu sein. Unsere Erfolggeschichte ist eng mit der Unterstützung unserer Gäste 
                    verbunden, für die wir sehr dankbar sind.
                  </p>
                </div>
              </div>
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
                {settings?.hero_image_url ? (
                  <img
                    src={settings.hero_image_url}
                    alt="Taverna Zeus Innenansicht"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-800/30 dark:to-primary-900/30">
                    <Restaurant className="w-16 h-16 text-primary-600 dark:text-primary-400 opacity-50" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Our Philosophy */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden order-2 lg:order-1">
                {settings?.hero_image_url ? (
                  <img
                    src={settings.hero_image_url}
                    alt="Griechische Küche"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-800/30 dark:to-green-900/30">
                    <ChefHat className="w-16 h-16 text-green-600 dark:text-green-400 opacity-50" />
                  </div>
                )}
              </div>
              <div className="order-1 lg:order-2">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Unsere Philosophie
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    In der Taverna Zeus glauben wir, dass gutes Essen Menschen zusammenbringt. 
                    Unsere Philosophie basiert auf drei Säulen:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Star className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Qualität
                        </h4>
                        <p className="text-sm">
                          Wir verwenden nur die frischesten Zutaten und traditionelle Rezepte, 
                          die von Generation zu Generation weitergegeben wurden.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Leidenschaft
                        </h4>
                        <p className="text-sm">
                          Unsere Liebe zur griechischen Küche treibt uns an, jeden Tag unser Bestes 
                          zu geben und unsere Gäste zu begeistern.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Users className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Gastfreundschaft
                        </h4>
                        <p className="text-sm">
                          In Griechenland ist Gastfreundschaft (Philoxenia) eine heilige Pflicht. 
                          Wir heißen jeden Gast willkommen wie einen alten Freund.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Unser Team
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Hinter jedem guten Restaurant steht ein großartiges Team. Lernen Sie die 
                Menschen kennen, die die Taverna Zeus zum Leben erwecken.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Team Member 1 */}
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  [Name des Inhabers]
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Inhaber & Chefkoch
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  [Kurze Beschreibung]
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ChefHat className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  [Name des Kochs]
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Küchenchef
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  [Kurze Beschreibung]
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  [Name des Serviceleiters]
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Serviceleitung
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  [Kurze Beschreibung]
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Cuisine */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Unsere Küche
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Entdecken Sie die Vielfalt der griechischen Küche – von traditionellen 
                Klassikern bis zu modernen Interpretationen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Restaurant className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Traditionelle Rezepte
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Unsere Gerichte basieren auf jahrhundertealten Rezepten, die von Generation 
                      zu Generation weitergegeben wurden. Wir bewahren diese Traditionen und 
                      bringen sie mit moderner Technik zur Vollendung.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Frische Zutaten
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Wir legen größten Wert auf die Qualität unserer Zutaten. Frisches Gemüse, 
                      hochwertiges Olivenöl, ausgewählte Kräuter und Gewürze – nur das Beste ist 
                      gut genug für unsere Gäste.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Hausgemachte Spezialitäten
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Viele unserer Gerichte werden nach traditionellen Rezepten von Grund auf 
                      frisch zubereitet. Dazu gehören unser hausgemachtes Tzatziki, frische 
                      Dolmades und viele andere Köstlichkeiten.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-700 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Für jeden Geschmack
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Ob Fleischliebhaber, Vegetarier oder Veganer – in unserer Speisekarte findet 
                      jeder etwas nach seinem Geschmack. Wir bieten eine große Auswahl an Gerichten, 
                      die alle Ernährungsbedürfnisse berücksichtigen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Restaurant className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Bildgalerie
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Ein paar Eindrücke von unserer Taverna
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden"
                >
                  {settings?.hero_image_url ? (
                    <img
                      src={settings.hero_image_url}
                      alt={`Galeriebild ${i}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-800/30 dark:to-primary-900/30">
                      <Restaurant className="w-8 h-8 text-primary-600 dark:text-primary-400 opacity-50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Bereit für ein kulinarisches Erlebnis?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Besuchen Sie uns und genießen Sie die authentische griechische Küche 
              in herzlicher Atmosphäre.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/standort"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Standort & Öffnungszeiten
              </Link>
              <Link
                href="/speisekarte"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Speisekarte ansehen
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}