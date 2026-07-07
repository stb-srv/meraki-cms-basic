'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Upload,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useMenu } from '@/hooks/useMenu';
import { useAllergens } from '@/hooks/useAllergens';
import { useAdditives } from '@/hooks/useAdditives';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createBrowserClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface MenuExportData {
  version: string;
  exported_at: string;
  restaurant_settings: any;
  menu_categories: any[];
  menu_items: any[];
  allergens: any[];
  additives: any[];
}

export default function ImportExportPage() {
  const { user, isAuthenticated, isAdmin, isEditor, loading: authLoading } = useAuth();
  const { settings, loading: settingsLoading } = useSettings();
  const { categories, menuItems, loading: menuLoading } = useMenu();
  const { allergens, loading: allergensLoading } = useAllergens();
  const { additives, loading: additivesLoading } = useAdditives();
  const router = useRouter();
  const supabase = createBrowserClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [exportData, setExportData] = useState<MenuExportData | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState<string>('');
  const [showImportForm, setShowImportForm] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated or not authorized
    if (!authLoading && (!isAuthenticated || (!isAdmin && !isEditor))) {
      router.push('/cms/login');
    }
  }, [isAuthenticated, isAdmin, isEditor, authLoading, router]);

  const handleExport = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Prepare export data
      const exportData: MenuExportData = {
        version: '1.0.0',
        exported_at: new Date().toISOString(),
        restaurant_settings: settings || null,
        menu_categories: categories || [],
        menu_items: menuItems || [],
        allergens: allergens || [],
        additives: additives || [],
      };

      setExportData(exportData);

      // Create download link
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `taverna-zeus-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess('Export erfolgreich. Die Datei wird heruntergeladen.');
    } catch (err) {
      setError('Fehler beim Exportieren der Daten.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportPreview(file.name);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    setError(null);
    setSuccess(null);
    setIsLoading(true);
    setImportProgress('Daten werden gelesen...');

    try {
      // Read file
      const reader = new FileReader();
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(importFile);
      });

      // Parse JSON
      let importData: MenuExportData;
      try {
        importData = JSON.parse(fileContent);
      } catch (parseError) {
        throw new Error('Ungültiges JSON-Format. Bitte wählen Sie eine gültige Export-Datei.');
      }

      // Validate version
      if (importData.version !== '1.0.0') {
        throw new Error(`Ununterstützte Version: ${importData.version}. Unterstützte Version: 1.0.0`);
      }

      setImportProgress('Daten werden validiert...');

      // Start transaction
      setImportProgress('Importiere Restaurant-Einstellungen...');

      // Import restaurant settings
      if (importData.restaurant_settings) {
        const { error: settingsError } = await supabase
          .from('restaurant_settings')
          .upsert([importData.restaurant_settings])
          .eq('id', settings?.id || '880e8400-e29b-41d4-a716-446655440000');

        if (settingsError) {
          console.error('Error importing settings:', settingsError);
        }
      }

      setImportProgress('Importiere Allergene...');

      // Import allergens
      if (importData.allergens && importData.allergens.length > 0) {
        const { error: allergensError } = await supabase
          .from('allergens')
          .upsert(importData.allergens.map((allergen: any) => ({
            ...allergen,
            id: allergen.id || uuidv4(),
            created_at: allergen.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })));

        if (allergensError) {
          console.error('Error importing allergens:', allergensError);
        }
      }

      setImportProgress('Importiere Zusatzstoffe...');

      // Import additives
      if (importData.additives && importData.additives.length > 0) {
        const { error: additivesError } = await supabase
          .from('additives')
          .upsert(importData.additives.map((additive: any) => ({
            ...additive,
            id: additive.id || uuidv4(),
            created_at: additive.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })));

        if (additivesError) {
          console.error('Error importing additives:', additivesError);
        }
      }

      setImportProgress('Importiere Kategorien...');

      // Import menu categories
      if (importData.menu_categories && importData.menu_categories.length > 0) {
        const { error: categoriesError } = await supabase
          .from('menu_categories')
          .upsert(importData.menu_categories.map((category: any) => ({
            ...category,
            id: category.id || uuidv4(),
            created_at: category.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })));

        if (categoriesError) {
          console.error('Error importing categories:', categoriesError);
        }
      }

      setImportProgress('Importiere Gerichte...');

      // Import menu items
      if (importData.menu_items && importData.menu_items.length > 0) {
        const { error: itemsError } = await supabase
          .from('menu_items')
          .upsert(importData.menu_items.map((item: any) => ({
            ...item,
            id: item.id || uuidv4(),
            category_id: item.category_id || null,
            allergen_ids: item.allergen_ids || [],
            additive_ids: item.additive_ids || [],
            created_at: item.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })));

        if (itemsError) {
          console.error('Error importing menu items:', itemsError);
        }
      }

      setImportProgress('Import abgeschlossen!');
      setSuccess('Daten wurden erfolgreich importiert. Die Seite wird neu geladen...');

      // Refresh all data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Importieren der Daten.');
      setImportProgress('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/cms');
  };

  if (authLoading || settingsLoading || menuLoading || allergensLoading || additivesLoading) {
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
                Import & Export
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Daten exportieren
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Exportieren Sie alle Ihre Daten (Einstellungen, Kategorien, Gerichte, Allergene, Zusatzstoffe) als JSON-Datei.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Export-Datei
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      taverna-zeus-export-{new Date().toISOString().split('T')[0]}.json
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                    JSON
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Enthält: Restaurant-Einstellungen, {categories.length} Kategorien, {menuItems.length} Gerichte, {allergens.length} Allergene, {additives.length} Zusatzstoffe
                </p>
              </div>

              <Button
                onClick={handleExport}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    <span>Export wird vorbereitet...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    <span>Jetzt exportieren</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Import Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Daten importieren
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Importieren Sie Daten aus einer zuvor exportierten JSON-Datei. Bestehende Daten werden überschrieben.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFileChange}
                  className="hidden"
                  id="import-file-upload"
                />
                <label htmlFor="import-file-upload" className="cursor-pointer">
                  {importPreview ? (
                    <div className="space-y-2">
                      <FileText className="w-12 h-12 mx-auto text-primary-600 dark:text-primary-400" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {importPreview}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImportFile(null);
                          setImportPreview(null);
                        }}
                        className="mt-2"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Datei entfernen
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Klicken Sie hier, um eine Datei auszuwählen, oder ziehen Sie sie hierher
                      </p>
                      <Button type="button" variant="ghost" size="sm" className="mt-2">
                        <Upload className="w-4 h-4 mr-2" />
                        Datei auswählen
                      </Button>
                    </div>
                  )}
                </label>
              </div>

              {importFile && (
                <Button
                  onClick={handleImport}
                  disabled={isLoading}
                  className="w-full"
                  variant="secondary"
                >
                  {isLoading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      <span>{importProgress || 'Import wird durchgeführt...'}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      <span>Jetzt importieren</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mt-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Wichtige Hinweise
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>
                  • Der Export enthält alle Ihre Daten in einem standardisierten JSON-Format.
                </li>
                <li>
                  • Beim Import werden bestehende Daten mit den gleichen IDs überschrieben.
                </li>
                <li>
                  • Neue Daten werden mit neuen IDs hinzugefügt.
                </li>
                <li>
                  • Der Import kann einige Sekunden dauern, je nach Datenmenge.
                </li>
                <li>
                  • Bilder werden nicht exportiert/importiert. Diese müssen separat verwaltet werden.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 mt-8">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
            <X className="w-4 h-4 mr-2" />
            Abbrechen
          </Button>
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