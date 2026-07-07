'use client';

import { useState, useEffect } from 'react';
import { Cookie, X, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import Cookies from 'universal-cookie';

export function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const cookies = new Cookies();

  useEffect(() => {
    // Check if user has already consented
    const consent = cookies.get('cookie_consent');
    if (!consent) {
      // Show banner after a short delay to avoid blocking content
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setHasConsented(true);
    }
  }, []);

  const handleAccept = () => {
    // Set cookie with consent
    cookies.set('cookie_consent', 'true', {
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    setIsOpen(false);
    setHasConsented(true);
  };

  const handleDecline = () => {
    // Set cookie without consent
    cookies.set('cookie_consent', 'false', {
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    setIsOpen(false);
    setHasConsented(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen || hasConsented) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none">
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 max-w-md w-full pointer-events-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Cookie className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Cookie-Einstellungen
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Diese Website verwendet Cookies, um die Benutzererfahrung zu verbessern 
              und die Nutzung der Website zu analysieren. Einige Cookies sind 
              essenziell für den Betrieb der Website, während andere uns helfen, 
              Inhalte und Anzeigen zu personalisieren.
            </p>

            {/* Details Section */}
            {showDetails && (
              <div className="space-y-3 mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span><strong>Essenziell:</strong> Notwendig für den Betrieb der Website</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span><strong>Funktionell:</strong> Ermöglicht zusätzliche Funktionen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span><strong>Analyse:</strong> Hilft uns, die Website zu verbessern</span>
                  </div>
                </div>
              </div>
            )}

            {/* Toggle Details */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline mb-4"
            >
              {showDetails ? 'Weniger anzeigen' : 'Details anzeigen'}
            </button>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
            <Button
              onClick={handleAccept}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
              size="sm"
            >
              <Check className="w-4 h-4 mr-2" />
              Alle akzeptieren
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <X className="w-4 h-4 mr-2" />
              Ablehnen
            </Button>
          </div>

          {/* Privacy Link */}
          <div className="px-4 pb-4 text-center">
            <a
              href="/datenschutz"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Datenschutzerklärung
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}