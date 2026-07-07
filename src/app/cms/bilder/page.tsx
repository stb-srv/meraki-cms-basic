'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, Image as ImageIcon, Upload, Trash2, Eye, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createBrowserClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface ImageUpload {
  id: string;
  name: string;
  path: string;
  url: string;
  thumbnail_url: string | null;
  size: number;
  mime_type: string;
  width: number | null;
  height: number | null;
  used_in: string[];
  created_at: string;
}

export default function ImageManagementPage() {
  const { user, isAuthenticated, isAdmin, isEditor, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createBrowserClient();

  const [images, setImages] = useState<ImageUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Redirect if not authenticated or not authorized
    if (!authLoading && (!isAuthenticated || (!isAdmin && !isEditor))) {
      router.push('/cms/login');
    }
  }, [isAuthenticated, isAdmin, isEditor, authLoading, router]);

  useEffect(() => {
    // Fetch images from the database and storage
    const fetchImages = async () => {
      try {
        // Get images from our tracking table
        const { data: dbImages, error: dbError } = await supabase
          .from('image_uploads')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbError) {
          console.error('Error fetching images from DB:', dbError);
        }

        // Get all files from storage bucket
        const { data: storageFiles, error: storageError } = await supabase.storage
          .from('restaurant-images')
          .list({ limit: 100 });

        if (storageError) {
          console.error('Error fetching files from storage:', storageError);
        }

        // Combine data
        const allImages: ImageUpload[] = [];

        // Add tracked images
        if (dbImages) {
          allImages.push(...dbImages);
        }

        // Add untracked files from storage
        if (storageFiles) {
          for (const file of storageFiles) {
            if (!file.metadata) continue; // Skip directories
            
            const existingImage = allImages.find(img => img.path === file.name);
            if (!existingImage) {
              // Get public URL
              const { data: urlData } = supabase.storage
                .from('restaurant-images')
                .getPublicUrl(file.name);

              allImages.push({
                id: uuidv4(),
                name: file.name.split('/').pop() || file.name,
                path: file.name,
                url: urlData.publicUrl,
                thumbnail_url: null,
                size: file.metadata.size || 0,
                mime_type: file.metadata.mimetype || '',
                width: null,
                height: null,
                used_in: [],
                created_at: file.created_at || new Date().toISOString(),
              });
            }
          }
        }

        setImages(allImages);
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der Bilder.');
        setLoading(false);
      }
    };

    if (isAuthenticated && (isAdmin || isEditor)) {
      fetchImages();
    }
  }, [isAuthenticated, isAdmin, isEditor, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccess(null);

    try {
      let uploadedCount = 0;
      const totalFiles = selectedFiles.length;

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `uploads/${new Date().toISOString().split('T')[0]}/${fileName}`;

        // Upload file
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('restaurant-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('restaurant-images')
          .getPublicUrl(filePath);

        // Track in database
        await supabase.from('image_uploads').insert([{
          id: uuidv4(),
          name: file.name,
          path: filePath,
          url: urlData.publicUrl,
          thumbnail_url: null,
          size: file.size,
          mime_type: file.type,
          width: null,
          height: null,
          used_in: [],
          created_at: new Date().toISOString(),
        }]);

        uploadedCount++;
        setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
      }

      setSuccess(`${selectedFiles.length} Bild(er) wurden erfolgreich hochgeladen.`);
      setSelectedFiles([]);
      setUploadProgress(0);

      // Refresh image list
      const { data: updatedImages } = await supabase
        .from('image_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      setImages(updatedImages || []);
    } catch (err) {
      setError('Fehler beim Hochladen der Bilder.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (image: ImageUpload) => {
    if (!confirm(`Möchten Sie das Bild "${image.name}" wirklich löschen?`)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('restaurant-images')
        .remove([image.path]);

      if (storageError) {
        throw storageError;
      }

      // Delete from tracking table
      const { error: dbError } = await supabase
        .from('image_uploads')
        .delete()
        .eq('id', image.id);

      if (dbError) {
        console.error('Error deleting from tracking table:', dbError);
      }

      setSuccess('Bild wurde erfolgreich gelöscht.');

      // Refresh image list
      const { data: updatedImages } = await supabase
        .from('image_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      setImages(updatedImages || []);
    } catch (err) {
      setError('Fehler beim Löschen des Bildes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredImages = images.filter((image) =>
    image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCancel = () => {
    router.push('/cms');
  };

  if (authLoading || loading) {
    return <LoadingSpinner fullPage text="Lade Bilder..." />;
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
                Bilder verwalten
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Bilder hochladen
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Laden Sie Bilder für Ihre Speisekarte, Kategorien und andere Inhalte hoch.
            </p>
          </div>

          <div className="mt-6">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {selectedFiles.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedFiles.slice(0, 5).map((file, index) => (
                        <div
                          key={index}
                          className="bg-primary-100 dark:bg-primary-900/30 px-3 py-1 rounded-lg text-sm text-primary-600 dark:text-primary-400"
                        >
                          {file.name}
                        </div>
                      ))}
                      {selectedFiles.length > 5 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          + {selectedFiles.length - 5} weitere
                        </span>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFiles([]);
                      }}
                      className="flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Auswahl aufheben</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Klicken Sie hier, um Bilder auszuwählen, oder ziehen Sie sie hierher
                    </p>
                    <Button type="button" variant="ghost" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Bilder auswählen
                    </Button>
                  </div>
                )}
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="flex items-center justify-end mt-4">
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                      <span>Lade hoch... {uploadProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      <span>{selectedFiles.length} Bild(er) hochladen</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Bildergalerie ({filteredImages.length})
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Bilder durchsuchen..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 w-48"
              />
            </div>
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Keine Bilder gefunden. Laden Sie Bilder hoch, um sie hier zu sehen.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600"
                >
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {image.url ? (
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {image.name}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {(image.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {image.path}
                    </p>
                    {image.used_in && image.used_in.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {image.used_in.slice(0, 2).map((usage, index) => (
                          <span
                            key={index}
                            className="text-xs px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded"
                          >
                            {usage}
                          </span>
                        ))}
                        {image.used_in.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{image.used_in.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => window.open(image.url, '_blank')}
                      className="h-6 w-6 p-0"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={() => handleDeleteImage(image)}
                      disabled={isLoading}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
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