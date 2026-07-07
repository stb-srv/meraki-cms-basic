'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { Additive } from '@/types/database';

export interface AdditivesState {
  additives: Additive[];
  loading: boolean;
  error: Error | null;
}

export function useAdditives() {
  const [additivesState, setAdditivesState] = useState<AdditivesState>({
    additives: [],
    loading: true,
    error: null,
  });

  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchAdditives = async () => {
      try {
        const { data, error } = await supabase
          .from('additives')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) {
          throw error;
        }

        setAdditivesState({
          additives: data || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        setAdditivesState({
          additives: [],
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchAdditives();
  }, [supabase]);

  // Refetch additives
  const refetch = async () => {
    setAdditivesState((prev) => ({ ...prev, loading: true }));

    try {
      const { data, error } = await supabase
        .from('additives')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      setAdditivesState({
        additives: data || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      setAdditivesState({
        additives: additivesState.additives,
        loading: false,
        error: error as Error,
      });
    }
  };

  // Get additive by ID
  const getAdditiveById = (id: string) => {
    return additivesState.additives.find((additive) => additive.id === id);
  };

  // Get active additives
  const getActiveAdditives = () => {
    return additivesState.additives.filter((additive) => additive.is_active);
  };

  return {
    additives: additivesState.additives,
    loading: additivesState.loading,
    error: additivesState.error,
    refetch,
    getAdditiveById,
    getActiveAdditives,
  };
}

export default useAdditives;