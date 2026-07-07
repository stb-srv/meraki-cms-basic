'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { MenuCategory, MenuItem } from '@/types/database';

export interface MenuState {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  loading: boolean;
  error: Error | null;
}

export function useMenu() {
  const [menuState, setMenuState] = useState<MenuState>({
    categories: [],
    menuItems: [],
    loading: true,
    error: null,
  });

  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Fetch categories and menu items in parallel
        const [categoriesRes, menuItemsRes] = await Promise.all([
          supabase
            .from('menu_categories')
            .select('*')
            .order('display_order', { ascending: true }),
          supabase
            .from('menu_items')
            .select('*')
            .order('display_order', { ascending: true }),
        ]);

        if (categoriesRes.error) {
          throw categoriesRes.error;
        }

        if (menuItemsRes.error) {
          throw menuItemsRes.error;
        }

        setMenuState({
          categories: categoriesRes.data || [],
          menuItems: menuItemsRes.data || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        setMenuState({
          categories: [],
          menuItems: [],
          loading: false,
          error: error as Error,
        });
      }
    };

    fetchMenu();
  }, [supabase]);

  // Refetch menu data
  const refetch = async () => {
    setMenuState((prev) => ({ ...prev, loading: true }));

    try {
      const [categoriesRes, menuItemsRes] = await Promise.all([
        supabase
          .from('menu_categories')
          .select('*')
          .order('display_order', { ascending: true }),
        supabase
          .from('menu_items')
          .select('*')
          .order('display_order', { ascending: true }),
      ]);

      if (categoriesRes.error) {
        throw categoriesRes.error;
      }

      if (menuItemsRes.error) {
        throw menuItemsRes.error;
      }

      setMenuState({
        categories: categoriesRes.data || [],
        menuItems: menuItemsRes.data || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      setMenuState({
        categories: menuState.categories,
        menuItems: menuState.menuItems,
        loading: false,
        error: error as Error,
      });
    }
  };

  // Get menu items by category
  const getMenuItemsByCategory = (categoryId: string) => {
    return menuState.menuItems.filter(
      (item) => item.category_id === categoryId && item.is_active
    );
  };

  // Get active categories
  const getActiveCategories = () => {
    return menuState.categories.filter((category) => category.is_active);
  };

  // Get active menu items
  const getActiveMenuItems = () => {
    return menuState.menuItems.filter((item) => item.is_active);
  };

  // Get featured menu items (recommended or new)
  const getFeaturedMenuItems = () => {
    return menuState.menuItems.filter(
      (item) => item.is_active && (item.is_recommended || item.is_new)
    );
  };

  // Search menu items
  const searchMenuItems = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return menuState.menuItems.filter(
      (item) =>
        item.is_active &&
        (item.name.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery) ||
          item.number.toLowerCase().includes(lowerQuery))
    );
  };

  // Filter menu items by dietary preferences
  const filterMenuItems = (filters: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    spicy?: boolean;
  }) => {
    return menuState.menuItems.filter((item) => {
      if (item.is_active === false) return false;
      if (filters.vegetarian && !item.is_vegetarian) return false;
      if (filters.vegan && !item.is_vegan) return false;
      if (filters.glutenFree && !item.is_gluten_free) return false;
      if (filters.spicy && !item.is_spicy) return false;
      return true;
    });
  };

  return {
    categories: menuState.categories,
    menuItems: menuState.menuItems,
    loading: menuState.loading,
    error: menuState.error,
    refetch,
    getMenuItemsByCategory,
    getActiveCategories,
    getActiveMenuItems,
    getFeaturedMenuItems,
    searchMenuItems,
    filterMenuItems,
  };
}

export default useMenu;