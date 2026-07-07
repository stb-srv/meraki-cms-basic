'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Leaf, Flame, AlertCircle } from 'lucide-react';
import { MenuItem, MenuCategory, Allergen, Additive } from '@/types/database';
import { useAllergens } from '@/hooks/useAllergens';
import { useAdditives } from '@/hooks/useAdditives';

interface MenuItemCardProps {
  item: MenuItem;
  categories: MenuCategory[];
  showCategory?: boolean;
  compact?: boolean;
  showImage?: boolean;
}

export function MenuItemCard({
  item,
  categories,
  showCategory = false,
  compact = false,
  showImage = true,
}: MenuItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { allergens } = useAllergens();
  const { additives } = useAdditives();

  // Find category name
  const category = categories.find((cat) => cat.id === item.category_id);

  // Find allergen and additive details
  const itemAllergens = allergens.filter((allergen) => 
    item.allergen_ids?.includes(allergen.id)
  );
  const itemAdditives = additives.filter((additive) => 
    item.additive_ids?.includes(additive.id)
  );

  const formatPrice = (price: number | null) => {
    if (price === null) return null;
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <div
      className={`menu-item-card relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden ${
        compact ? 'border border-gray-200 dark:border-gray-700' : 'shadow-sm'
      } transition-all duration-300`}
    >
      {/* Image */}
      {showImage && item.image_url && (
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col space-y-1">
            {item.is_new && (
              <span className="px-2 py-1 text-xs font-semibold bg-primary-600 text-white rounded-full">
                NEU
              </span>
            )}
            {item.is_recommended && (
              <span className="px-2 py-1 text-xs font-semibold bg-accent text-white rounded-full">
                ⭐ Empfohlen
              </span>
            )}
            {item.is_vegetarian && (
              <span className="px-2 py-1 text-xs font-semibold bg-green-600 text-white rounded-full">
                Vegetarisch
              </span>
            )}
            {item.is_vegan && (
              <span className="px-2 py-1 text-xs font-semibold bg-green-700 text-white rounded-full">
                Vegan
              </span>
            )}
            {item.is_spicy && (
              <span className="px-2 py-1 text-xs font-semibold bg-red-600 text-white rounded-full">
                Scharf
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`p-4 ${showImage && item.image_url ? '' : 'pt-4'}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            {showCategory && category && (
              <p className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
                {category.name}
              </p>
            )}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {item.number}.
              </span>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                {item.name}
              </h3>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            {item.price !== null && (
              <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(item.price)}
              </p>
            )}
            {item.price_note && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.price_note}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <div className="mb-4">
            <p
              className={`text-sm text-gray-600 dark:text-gray-300 ${
                isExpanded ? '' : 'line-clamp-2'
              }`}
            >
              {item.description}
            </p>
            {item.description.length > 100 && !compact && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline mt-1"
              >
                {isExpanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}
              </button>
            )}
          </div>
        )}

        {/* Allergens and Additives */}
        {(itemAllergens.length > 0 || itemAdditives.length > 0) && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Allergens */}
            {itemAllergens.map((allergen) => (
              <span
                key={allergen.id}
                className="allergen-icon allergen-{allergen.code}"
                title={`${allergen.name}: ${allergen.description || ''}`}
              >
                {allergen.code}
              </span>
            ))}

            {/* Additives */}
            {itemAdditives.map((additive) => (
              <span
                key={additive.id}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                title={`${additive.name}: ${additive.description || ''}`}
              >
                {additive.code}
              </span>
            ))}
          </div>
        )}

        {/* Dietary Icons */}
        <div className="flex items-center space-x-2 pt-4">
          {item.is_vegetarian && (
            <span
              className="p-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
              title="Vegetarisch"
            >
              <Leaf className="w-4 h-4" />
            </span>
          )}
          {item.is_vegan && (
            <span
              className="p-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
              title="Vegan"
            >
              <Leaf className="w-4 h-4" />
            </span>
          )}
          {item.is_spicy && (
            <span
              className="p-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
              title="Scharf"
            >
              <Flame className="w-4 h-4" />
            </span>
          )}
          {item.is_gluten_free && (
            <span
              className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              title="Glutenfrei"
            >
              <AlertCircle className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}