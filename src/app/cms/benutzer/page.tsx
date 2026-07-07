'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, Users, Plus, Trash2, Edit, Eye, Shield, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createBrowserClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'editor' | 'viewer';
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export default function UserManagementPage() {
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createBrowserClient();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // New user form state
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    name: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer',
    password: '',
    confirmPassword: '',
  });
  const [showNewUserForm, setShowNewUserForm] = useState(false);

  // Edit user form state
  const [editUserForm, setEditUserForm] = useState({
    id: '',
    email: '',
    name: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer',
    is_active: true,
  });
  const [showEditUserForm, setShowEditUserForm] = useState(false);

  const roleLabels = {
    admin: 'Administrator',
    editor: 'Editor',
    viewer: 'Betrachter',
  };

  const roleColors = {
    admin: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    editor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    viewer: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  };

  useEffect(() => {
    // Redirect if not authenticated or not authorized
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/cms/login');
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  useEffect(() => {
    // Fetch users from the database
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        setUsers(data || []);
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der Benutzer.');
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin, supabase]);

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setEditUserForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Validate form
      if (!newUserForm.email.trim()) {
        setError('Bitte geben Sie eine E-Mail-Adresse ein.');
        setIsLoading(false);
        return;
      }

      if (!newUserForm.email.includes('@')) {
        setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        setIsLoading(false);
        return;
      }

      if (!newUserForm.password) {
        setError('Bitte geben Sie ein Passwort ein.');
        setIsLoading(false);
        return;
      }

      if (newUserForm.password !== newUserForm.confirmPassword) {
        setError('Die Passwörter stimmen nicht überein.');
        setIsLoading(false);
        return;
      }

      if (newUserForm.password.length < 6) {
        setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
        setIsLoading(false);
        return;
      }

      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', newUserForm.email)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingUser) {
        setError('Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.');
        setIsLoading(false);
        return;
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUserForm.email,
        password: newUserForm.password,
        email_confirm: true,
      });

      if (authError) {
        throw authError;
      }

      // Create user in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user?.id || uuidv4(),
            email: newUserForm.email,
            name: newUserForm.name || null,
            role: newUserForm.role,
            is_active: true,
            last_login: null,
          },
        ])
        .select();

      if (userError) {
        throw userError;
      }

      setSuccess('Benutzer wurde erfolgreich erstellt.');
      setNewUserForm({
        email: '',
        name: '',
        role: 'viewer',
        password: '',
        confirmPassword: '',
      });
      setShowNewUserForm(false);

      // Refresh user list
      const { data: updatedUsers } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: true });

      setUsers(updatedUsers || []);
    } catch (err) {
      setError('Fehler beim Erstellen des Benutzers.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Validate form
      if (!editUserForm.email.trim()) {
        setError('Bitte geben Sie eine E-Mail-Adresse ein.');
        setIsLoading(false);
        return;
      }

      // Update user in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .update({
          email: editUserForm.email,
          name: editUserForm.name || null,
          role: editUserForm.role,
          is_active: editUserForm.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editUserForm.id)
        .select();

      if (userError) {
        throw userError;
      }

      setSuccess('Benutzer wurde erfolgreich aktualisiert.');
      setShowEditUserForm(false);

      // Refresh user list
      const { data: updatedUsers } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: true });

      setUsers(updatedUsers || []);
    } catch (err) {
      setError('Fehler beim Aktualisieren des Benutzers.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Möchten Sie diesen Benutzer wirklich löschen?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Delete user from our users table
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (userError) {
        throw userError;
      }

      setSuccess('Benutzer wurde erfolgreich gelöscht.');

      // Refresh user list
      const { data: updatedUsers } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: true });

      setUsers(updatedUsers || []);
    } catch (err) {
      setError('Fehler beim Löschen des Benutzers.');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditUserForm = (user: User) => {
    setEditUserForm({
      id: user.id,
      email: user.email,
      name: user.name || '',
      role: user.role,
      is_active: user.is_active,
    });
    setShowEditUserForm(true);
  };

  const handleCancel = () => {
    router.push('/cms');
  };

  if (authLoading || loading) {
    return <LoadingSpinner fullPage text="Lade Daten..." />;
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
                Benutzerverwaltung
              </h1>
            </div>
            <Button onClick={() => setShowNewUserForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Benutzer hinzufügen
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

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Benutzerliste ({users.length})
            </h2>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Keine Benutzer gefunden. Erstellen Sie den ersten Benutzer.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Benutzer
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Rolle
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Letzter Login
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem) => (
                    <tr
                      key={userItem.id}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {userItem.name || userItem.email}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {userItem.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${roleColors[userItem.role]}`}
                        >
                          {roleLabels[userItem.role]}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            userItem.is_active
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          }`}
                        >
                          {userItem.is_active ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {userItem.last_login
                            ? new Date(userItem.last_login).toLocaleDateString('de-DE')
                            : 'Noch nie'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditUserForm(userItem)}
                            disabled={isLoading}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(userItem.id)}
                            disabled={isLoading || userItem.id === user?.id}
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

        {/* New User Modal */}
        {showNewUserForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Neuer Benutzer
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewUserForm(false)}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    E-Mail *
                  </label>
                  <Input
                    id="newEmail"
                    type="email"
                    name="email"
                    placeholder="benutzer@beispiel.de"
                    value={newUserForm.email}
                    onChange={handleNewUserChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="newName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <Input
                    id="newName"
                    type="text"
                    name="name"
                    placeholder="Max Mustermann"
                    value={newUserForm.name}
                    onChange={handleNewUserChange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="newRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rolle *
                  </label>
                  <select
                    id="newRole"
                    name="role"
                    value={newUserForm.role}
                    onChange={handleNewUserChange}
                    className="w-full h-10 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="viewer">Betrachter</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Passwort *
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    name="password"
                    placeholder="Mindestens 6 Zeichen"
                    value={newUserForm.password}
                    onChange={handleNewUserChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="newConfirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Passwort bestätigen *
                  </label>
                  <Input
                    id="newConfirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Passwort erneut eingeben"
                    value={newUserForm.confirmPassword}
                    onChange={handleNewUserChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewUserForm(false)}
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
                        <span>Benutzer erstellen</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditUserForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <Edit className="w-5 h-5 mr-2" />
                  Benutzer bearbeiten
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditUserForm(false)}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label htmlFor="editEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    E-Mail *
                  </label>
                  <Input
                    id="editEmail"
                    type="email"
                    name="email"
                    placeholder="benutzer@beispiel.de"
                    value={editUserForm.email}
                    onChange={handleEditUserChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="editName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <Input
                    id="editName"
                    type="text"
                    name="name"
                    placeholder="Max Mustermann"
                    value={editUserForm.name}
                    onChange={handleEditUserChange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="editRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rolle *
                  </label>
                  <select
                    id="editRole"
                    name="role"
                    value={editUserForm.role}
                    onChange={handleEditUserChange}
                    className="w-full h-10 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="viewer">Betrachter</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={editUserForm.is_active}
                      onChange={handleEditUserChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Benutzer aktiv
                  </span>
                </div>
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditUserForm(false)}
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
                        <span>Benutzer speichern</span>
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