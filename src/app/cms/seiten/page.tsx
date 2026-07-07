'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, FileText, Plus, Trash2, Edit, Eye, EyeOff, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createBrowserClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  is_active: boolean;
  show_in_navigation: boolean;
  navigation_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export default function PageManagementPage() {
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createBrowserClient();

  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // New page form state
  const [newPageForm, setNewPageForm] = useState({
    slug: '',
    title: '',
    content: '',
    is_active: true,
    show_in_navigation: false,
    navigation_order: 0,
    meta_title: '',
    meta_description: '',
  });
  const [showNewPageForm, setShowNewPageForm] = useState(false);

  // Edit page form state
  const [editPageForm, setEditPageForm] = useState({
    id: '',
    slug: '',
    title: '',
    content: '',
    is_active: true,
    show_in_navigation: false,
    navigation_order: 0,
    meta_title: '',
    meta_description: '',
  });
  const [showEditPageForm, setShowEditPageForm] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated or not authorized
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/cms/login');
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  useEffect(() => {
    // Fetch pages from the database
    const fetchPages = async () => {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .order('navigation_order', { ascending: true });

        if (error) {
          throw error;
        }

        setPages(data || []);
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der Seiten.');
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchPages();
    }
  }, [isAuthenticated, isAdmin, supabase]);

  const handleNewPageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setNewPageForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditPageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setEditPageForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Validate form
      if (!newPageForm.slug.trim()) {
        setError('Bitte geben Sie einen Slug ein.');
        setIsLoading(false);
        return;
      }

      if (!newPageForm.title.trim()) {
        setError('Bitte geben Sie einen Titel ein.');
        setIsLoading(false);
        return;
      }

      // Check if slug already exists
      const { data: existingPage, error: checkError } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', newPageForm.slug)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingPage) {
        setError('Eine Seite mit diesem Slug existiert bereits.');
        setIsLoading(false);
        return;
      }

      // Create page
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .insert([
          {
            id: uuidv4(),
            slug: newPageForm.slug.trim(),
            title: newPageForm.title.trim(),
            content: newPageForm.content,
            is_active: newPageForm.is_active,
            show_in_navigation: newPageForm.show_in_navigation,
            navigation_order: newPageForm.navigation_order,
            meta_title: newPageForm.meta_title.trim() || null,
            meta_description: newPageForm.meta_description.trim() || null,
          },
        ])
        .select();

      if (pageError) {
        throw pageError;
      }

      setSuccess('Seite wurde erfolgreich erstellt.');
      setNewPageForm({
        slug: '',
        title: '',
        content: '',
        is_active: true,
        show_in_navigation: false,
        navigation_order: 0,
        meta_title: '',
        meta_description: '',
      });
      setShowNewPageForm(false);

      // Refresh page list
      const { data: updatedPages } = await supabase
        .from('pages')
        .select('*')
        .order('navigation_order', { ascending: true });

      setPages(updatedPages || []);
    } catch (err) {
      setError('Fehler beim Erstellen der Seite.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Validate form
      if (!editPageForm.slug.trim()) {
        setError('Bitte geben Sie einen Slug ein.');
        setIsLoading(false);
        return;
      }

      if (!editPageForm.title.trim()) {
        setError('Bitte geben Sie einen Titel ein.');
        setIsLoading(false);
        return;
      }

      // Update page
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .update({
          slug: editPageForm.slug.trim(),
          title: editPageForm.title.trim(),
          content: editPageForm.content,
          is_active: editPageForm.is_active,
          show_in_navigation: editPageForm.show_in_navigation,
          navigation_order: editPageForm.navigation_order,
          meta_title: editPageForm.meta_title.trim() || null,
          meta_description: editPageForm.meta_description.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editPageForm.id)
        .select();

      if (pageError) {
        throw pageError;
      }

      setSuccess('Seite wurde erfolgreich aktualisiert.');
      setShowEditPageForm(false);

      // Refresh page list
      const { data: updatedPages } = await supabase
        .from('pages')
        .select('*')
        .order('navigation_order', { ascending: true });

      setPages(updatedPages || []);
    } catch (err) {
      setError('Fehler beim Aktualisieren der Seite.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Möchten Sie diese Seite wirklich löschen?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Delete page
      const { error: pageError } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);

      if (pageError) {
        throw pageError;
      }

      setSuccess('Seite wurde erfolgreich gelöscht.');

      // Refresh page list
      const { data: updatedPages } = await supabase
        .from('pages')
        .select('*')
        .order('navigation_order', { ascending: true });

      setPages(updatedPages || []);
    } catch (err) {
      setError('Fehler beim Löschen der Seite.');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditPageForm = (page: Page) => {
    setEditPageForm({
      id: page.id,
      slug: page.slug,
      title: page.title,
      content: page.content,
      is_active: page.is_active,
      show_in_navigation: page.show_in_navigation,
      navigation_order: page.navigation_order,
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
    });
    setShowEditPageForm(true);
  };

  const handleCancel = () => {
    router.push('/cms');
  };

  if (authLoading || loading) {
    return <LoadingSpinner fullPage text="Lade Seiten..." />;
  }

  if (!isAuthenticated || !isAdmin) {
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
                Seiten verwalten
              </h1>
            </div>
            <Button onClick={() => setShowNewPageForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Seite hinzufügen
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Pages Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Seitenliste ({pages.length})
            </h2>
          </div>

          {pages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Keine Seiten gefunden. Erstellen Sie die erste Seite.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Seite
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Slug
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Navigation
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr
                      key={page.id}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {page.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                              {page.content.replace(/<[^>]*>/g, '').substring(0, 50)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <code className="text-sm text-gray-600 dark:text-gray-400">
                          /{page.slug}
                        </code>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            page.is_active
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}
                        >
                          {page.is_active ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {page.show_in_navigation ? (
                            <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {page.navigation_order}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/${page.slug}`, '_blank')}
                          >
                            <Globe className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditPageForm(page)}
                            disabled={isLoading}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePage(page.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* New Page Modal */}
        {showNewPageForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Neue Seite
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewPageForm(false)}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <form onSubmit={handleCreatePage} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="newSlug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Slug *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                        /
                      </span>
                      <Input
                        id="newSlug"
                        type="text"
                        name="slug"
                        placeholder="ueber-uns"
                        value={newPageForm.slug}
                        onChange={handleNewPageChange}
                        required
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      URL: /{newPageForm.slug}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="newTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Titel *
                    </label>
                    <Input
                      id="newTitle"
                      type="text"
                      name="title"
                      placeholder="Über uns"
                      value={newPageForm.title}
                      onChange={handleNewPageChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="newContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Inhalt
                  </label>
                  <textarea
                    id="newContent"
                    name="content"
                    placeholder="HTML-Inhalt der Seite..."
                    value={newPageForm.content}
                    onChange={handleNewPageChange}
                    rows={8}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sie können HTML-Code verwenden
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="newMetaTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Meta-Titel
                    </label>
                    <Input
                      id="newMetaTitle"
                      type="text"
                      name="meta_title"
                      placeholder="Über uns - Taverna Zeus"
                      value={newPageForm.meta_title}
                      onChange={handleNewPageChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="newMetaDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Meta-Beschreibung
                    </label>
                    <Input
                      id="newMetaDescription"
                      type="text"
                      name="meta_description"
                      placeholder="Erfahren Sie mehr über unser Restaurant..."
                      value={newPageForm.meta_description}
                      onChange={handleNewPageChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={newPageForm.is_active}
                        onChange={handleNewPageChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Seite aktiv
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="show_in_navigation"
                        checked={newPageForm.show_in_navigation}
                        onChange={handleNewPageChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      In Navigation anzeigen
                    </span>
                  </div>
                </div>

                {newPageForm.show_in_navigation && (
                  <div className="space-y-1">
                    <label htmlFor="newNavigationOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Navigationsreihenfolge
                    </label>
                    <Input
                      id="newNavigationOrder"
                      type="number"
                      name="navigation_order"
                      min="0"
                      value={newPageForm.navigation_order}
                      onChange={handleNewPageChange}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Bestimmt die Reihenfolge in der Navigation (niedrigere Zahlen werden zuerst angezeigt)
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewPageForm(false)}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Abbrechen
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        <span>Erstellen...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        <span>Seite erstellen</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Page Modal */}
        {showEditPageForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <Edit className="w-5 h-5 mr-2" />
                  Seite bearbeiten
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditPageForm(false)}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <form onSubmit={handleUpdatePage} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="editSlug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Slug *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                        /
                      </span>
                      <Input
                        id="editSlug"
                        type="text"
                        name="slug"
                        placeholder="ueber-uns"
                        value={editPageForm.slug}
                        onChange={handleEditPageChange}
                        required
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      URL: /{editPageForm.slug}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Titel *
                    </label>
                    <Input
                      id="editTitle"
                      type="text"
                      name="title"
                      placeholder="Über uns"
                      value={editPageForm.title}
                      onChange={handleEditPageChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="editContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Inhalt
                  </label>
                  <textarea
                    id="editContent"
                    name="content"
                    placeholder="HTML-Inhalt der Seite..."
                    value={editPageForm.content}
                    onChange={handleEditPageChange}
                    rows={8}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sie können HTML-Code verwenden
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="editMetaTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Meta-Titel
                    </label>
                    <Input
                      id="editMetaTitle"
                      type="text"
                      name="meta_title"
                      placeholder="Über uns - Taverna Zeus"
                      value={editPageForm.meta_title}
                      onChange={handleEditPageChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="editMetaDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Meta-Beschreibung
                    </label>
                    <Input
                      id="editMetaDescription"
                      type="text"
                      name="meta_description"
                      placeholder="Erfahren Sie mehr über unser Restaurant..."
                      value={editPageForm.meta_description}
                      onChange={handleEditPageChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={editPageForm.is_active}
                        onChange={handleEditPageChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Seite aktiv
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="show_in_navigation"
                        checked={editPageForm.show_in_navigation}
                        onChange={handleEditPageChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      In Navigation anzeigen
                    </span>
                  </div>
                </div>

                {editPageForm.show_in_navigation && (
                  <div className="space-y-1">
                    <label htmlFor="editNavigationOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Navigationsreihenfolge
                    </label>
                    <Input
                      id="editNavigationOrder"
                      type="number"
                      name="navigation_order"
                      min="0"
                      value={editPageForm.navigation_order}
                      onChange={handleEditPageChange}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Bestimmt die Reihenfolge in der Navigation (niedrigere Zahlen werden zuerst angezeigt)
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditPageForm(false)}
                    disabled={isLoading}
                  >
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
                        <span>Seite speichern</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 mt-6">
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