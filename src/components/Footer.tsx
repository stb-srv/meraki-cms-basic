'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Utensils, MapPin, Info, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export function Footer() {
  const pathname = usePathname();
  const { settings } = useSettings();

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: '/', label: 'Startseite', icon: Home },
    { href: '/speisekarte', label: 'Speisekarte', icon: Utensils },
    { href: '/standort', label: 'Standort', icon: MapPin },
    { href: '/ueber-uns', label: 'Über uns', icon: Info },
  ];

  const legalLinks = [
    { href: '/impressum', label: 'Impressum' },
    { href: '/datenschutz', label: 'Datenschutz' },
  ];

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Twitter, label: 'Twitter' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 dark:bg-gray-800 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {settings?.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={settings?.name || 'Taverna Zeus'}
                  className="h-10 w-auto"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">TZ</span>
                </div>
              )}
              <div>
                <h3 className="text-white font-bold text-lg">{settings?.name || 'Taverna Zeus'}</h3>
                <p className="text-sm">{settings?.short_description || 'Griechisches Restaurant'}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>{settings?.address}, {settings?.postal_code} {settings?.city}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>{settings?.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>{settings?.email}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="social-icon p-2 rounded-full bg-gray-800 hover:bg-primary-600 text-white transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Schnellzugriff</h4>
            <nav className="space-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === link.href
                      ? 'bg-primary-600 text-white'
                      : 'hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-white font-semibold mb-4">Öffnungszeiten</h4>
            <div className="space-y-2 text-sm">
              {settings?.opening_hours?.map((hour, index) => (
                <div key={index} className="flex justify-between">
                  <span>{hour.day}</span>
                  <span>
                    {hour.is_open ? (
                      hour.all_day ? 'Ganztägig' : `${hour.open} - ${hour.close}`
                    ) : (
                      'Geschlossen'
                    )}
                  </span>
                </div>
              )) || (
                <div className="text-gray-500">Öffnungszeiten werden geladen...</div>
              )}
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Rechtliches</h4>
            <nav className="space-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© {currentYear} {settings?.name || 'Taverna Zeus'}. Alle Rechte vorbehalten.</p>
          <p className="mt-2">
            <Link href="/impressum" className="hover:text-primary-400 transition-colors">
              Impressum
            </Link>{' '}
            |{' '}
            <Link href="/datenschutz" className="hover:text-primary-400 transition-colors">
              Datenschutz
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}