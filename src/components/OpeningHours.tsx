'use client';

import { Clock } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export function OpeningHours() {
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const todayName = days[today];

  // Find today's opening hours
  const todayHours = settings?.opening_hours?.find(hour => hour.day === todayName);

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Öffnungszeiten
          </h2>
          {todayHours && (
            <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/20 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                Heute: {todayHours.is_open ? (
                  todayHours.all_day ? 'Ganztägig geöffnet' : `${todayHours.open} - ${todayHours.close}`
                ) : 'Geschlossen'}
              </span>
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Öffnungszeiten
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                {settings?.opening_hours?.map((hour, index) => (
                  <tr
                    key={index}
                    className={`transition-colors ${
                      hour.day === todayName
                        ? 'bg-primary-50 dark:bg-primary-900/10'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`font-medium ${
                          hour.day === todayName
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {hour.day}
                        </span>
                        {hour.day === todayName && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 rounded-full">
                            Heute
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${
                        hour.is_open
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {hour.is_open ? (
                          hour.all_day ? 'Ganztägig' : `${hour.open} - ${hour.close}`
                        ) : (
                          'Geschlossen'
                        )}
                      </span>
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Öffnungszeiten werden geladen...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            * Änderungen vorbehalten. Bitte rufen Sie uns bei Fragen an.
          </p>
        </div>
      </div>
    </section>
  );
}