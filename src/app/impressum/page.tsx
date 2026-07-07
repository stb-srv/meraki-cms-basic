'use client';

import Link from 'next/link';
import { useSettings } from '@/hooks/useSettings';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function ImpressumPage() {
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner fullPage text="Lade Impressum..." />
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Impressum
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Angaben gemäß § 5 TMG
              </p>
            </div>

            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                Betreiber der Website
              </h2>
              <p>
                <strong>{settings?.name || 'Taverna Zeus'}</strong>
                <br />
                {settings?.address}
                <br />
                {settings?.postal_code} {settings?.city}
                <br />
                {settings?.country}
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                Kontakt
              </h2>
              <p>
                Telefon: {settings?.phone}
                <br />
                E-Mail: {settings?.email}
                <br />
                {settings?.website && (
                  <>
                    Website: <Link href={settings.website} className="text-primary-600 dark:text-primary-400 hover:underline">{settings.website}</Link>
                    <br />
                  </>
                )}
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                Vertreten durch
              </h2>
              <p>
                [Name des Vertretungsberechtigten, z.B. Inhaber oder Geschäftsführer]
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                Registereintrag
              </h2>
              <p>
                Eintragung im Handelsregister.
                <br />
                Registergericht: [Name des Registergerichts]
                <br />
                Registernummer: [Registernummer]
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                Umsatzsteuer-ID
              </h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:
                <br />
                [Umsatzsteuer-ID]
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                Wirtschaftliche Berufsbezeichnung
              </h2>
              <p>
                [Berufsbezeichnung, z.B. Gastwirt, Restaurantbetreiber]
                <br />
                Verliehen durch: [Name der verleienden Institution]
                <br />
                Zulassungsregelung: [Zulassungsregelung]
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                Berufsrechtliche Regelungen
              </h2>
              <p>
                Es gelten folgende berufsrechtliche Regelungen:
                <br />
                [Name der Regelung]
                <br />
                Regelungen einsehbar unter: [Link oder Ort]
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <p>
                [Name und Anschrift des Verantwortlichen]
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                Streitbeilegung
              </h2>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren 
                vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                Haftung für Inhalte
              </h2>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf 
                diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 
                TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder 
                gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, 
                die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <p>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen 
                nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche 
                Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten 
                Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen 
                werden wir diese Inhalte umgehend entfernen.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                Haftung für Links
              </h2>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte 
                wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch 
                keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der 
                jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten 
                wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. 
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne 
                konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden 
                von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                Urheberrecht
              </h2>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten 
                unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, 
                Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes 
                bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. 
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen 
                Gebrauch gestattet.
              </p>
              <p>
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden 
                die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche 
                gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam 
                werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von 
                Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </p>

              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Quelle: <Link href="https://www.e-recht24.de" className="text-primary-600 dark:text-primary-400 hover:underline">eRecht24</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}