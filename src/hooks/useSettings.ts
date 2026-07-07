'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { RestaurantSettings } from '@/types/database';

export interface SettingsState {
  settings: RestaurantSettings | null;
  loading: boolean;
  error: Error | null;
}

export function useSettings() {
  const [settingsState, setSettingsState] = useState<SettingsState>({
    settings: null,
    loading: true,
    error: null,
  });

  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('restaurant_settings')
          .select('*')
          .single();

        if (error) {
          throw error;
        }

        setSettingsState({
          settings: data,
          loading: false,
          error: null,
        });
      } catch (error) {
        setSettingsState({
          settings: null,
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchSettings();
  }, [supabase]);

  // Refetch settings
  const refetch = async () => {
    setSettingsState((prev) => ({ ...prev, loading: true }));
    
    try {
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setSettingsState({
        settings: data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setSettingsState({
        settings: null,
        loading: false,
        error: error as Error,
      });
    }
  };

  // Update settings
  const updateSettings = async (updates: Partial<RestaurantSettings>) => {
    setSettingsState((prev) => ({ ...prev, loading: true }));

    try {
      const { data, error } = await supabase
        .from('restaurant_settings')
        .update(updates)
        .eq('id', settingsState.settings?.id || '1')
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSettingsState({
        settings: data,
        loading: false,
        error: null,
      });

      return { success: true, data };
    } catch (error) {
      setSettingsState({
        settings: settingsState.settings,
        loading: false,
        error: error as Error,
      });
      return { success: false, error: error as Error };
    }
  };

  return {
    settings: settingsState.settings,
    loading: settingsState.loading,
    error: settingsState.error,
    refetch,
    updateSettings,
  };
}

export default useSettings;