'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import { User } from '@/types/database';

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: Error | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session) {
            // Fetch user data from our users table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .single();

            if (userError && userError.code !== 'PGRST116') {
              // User doesn't exist in our table yet, create a basic user
              const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.name || null,
                    role: 'viewer',
                    is_active: true,
                  },
                ])
                .select()
                .single();

              if (createError) {
                console.error('Error creating user:', createError);
              }

              setAuthState({
                user: newUser || {
                  id: session.user.id,
                  email: session.user.email,
                  name: session.user.user_metadata?.name || null,
                  role: 'viewer',
                  is_active: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
                session,
                loading: false,
                error: null,
              });
            } else {
              setAuthState({
                user: userData || {
                  id: session.user.id,
                  email: session.user.email,
                  name: session.user.user_metadata?.name || null,
                  role: 'viewer',
                  is_active: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
                session,
                loading: false,
                error: null,
              });
            }
          } else {
            setAuthState({
              user: null,
              session: null,
              loading: false,
              error: null,
            });
          }
        } catch (error) {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: error as Error,
          });
        }
      }
    );

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single()
          .then(({ data: userData, error: userError }: { data: any | null; error: any | null }) => {
            if (userError && userError.code !== 'PGRST116') {
              setAuthState({
                user: {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: session.user.user_metadata?.name || null,
                  role: 'viewer',
                  is_active: true,
                  last_login: new Date().toISOString(),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
                session,
                loading: false,
                error: null,
              });
            } else {
              setAuthState({
                user: userData || {
                  id: session.user.id,
                  email: session.user.email,
                  name: session.user.user_metadata?.name || null,
                  role: 'viewer',
                  is_active: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
                session,
                loading: false,
                error: null,
              });
            }
          });
      } else {
        setAuthState({
          user: null,
          session: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        // User will be set by the auth state change listener
        return { success: true };
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
        return { success: false, error: error as Error };
      }
    },
    [supabase]
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });

        if (error) {
          throw error;
        }

        // Create user in our database
        if (data.user) {
          const { error: userError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                name,
                role: 'viewer',
                is_active: true,
              },
            ]);

          if (userError) {
            console.error('Error creating user:', userError);
          }
        }

        return { success: true };
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
        return { success: false, error: error as Error };
      }
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Redirect to home page
      router.push('/');
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
    }
  }, [supabase, router]);

  const resetPassword = useCallback(
    async (email: string) => {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/cms/reset-password`,
        });

        if (error) {
          throw error;
        }

        return { success: true };
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
        return { success: false, error: error as Error };
      }
    },
    [supabase]
  );

  const updatePassword = useCallback(
    async (newPassword: string) => {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          throw error;
        }

        return { success: true };
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: error as Error,
        }));
        return { success: false, error: error as Error };
      }
    },
    [supabase]
  );

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: !!authState.user,
    isAdmin: authState.user?.role === 'admin',
    isEditor: authState.user?.role === 'editor' || authState.user?.role === 'admin',
  };
}

export default useAuth;