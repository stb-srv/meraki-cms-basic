'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { Allergen } from '@/types/database';

export interface AllergensState {
  allergens: Allergen[];
  loading: boolean;
  error: Error | null;
}

export function useAllergens() {
  const [allergensState, setAllergensState] = useState<AllergensState>({
    allergens: [],
    loading: true,
    error: null,
  });

  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchAllergens = async () => {
      try {
        const { data, error } = await supabase
          .from('allergens')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) {
          throw error;
        }

        setAllergensState({
          allergens: data || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        setAllergensState({
          allergens: [],
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchAllergens();
  }, [supabase]);

  // Refetch allergens
  const refetch = async () => {
    setAllergensState((prev) => ({ ...prev, loading: true }));

    try {
      const { data, error } = await supabase
        .from('allergens')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      setAllergensState({
        allergens: data || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      setAllergensState({
        allergens: allergensState.allergens,
        loading: false,
        error: error as Error,
      });
    }
  };

  // Get allergen by ID
  const getAllergenById = (id: string) => {
    return allergensState.allergens.find((allergen) => allergen.id === id);
  };

  // Get active allergens
  const getActiveAllergens = () => {
    return allergensState.allergens.filter((allergen) => allergen.is_active);
  };

  return {
    allergens: allergensState.allergens,
    loading: allergensState.loading,
    error: allergensState.error,
    refetch,
    getAllergenById,
    getActiveAllergens,
  };
}

export default useAllergens;