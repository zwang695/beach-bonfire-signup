'use client';

import { useState } from 'react';

interface NeededItem {
  item: string;
  category: 'food' | 'drinks' | 'supplies' | 'other';
  taken: boolean;
  takenBy?: string;
}

interface ItemListProps {
  neededItems: NeededItem[];
  onItemsChanged: () => void;
}

const categoryEmojis = {
  food: '🍔',
  drinks: '🥤',
  supplies: '🏖️',
  other: '🎯'
};

const categoryColors = {
  food: 'bg-green-100 text-green-800',
  drinks: 'bg-blue-100 text-blue-800',
  supplies: 'bg-yellow-100 text-yellow-800',
  other: 'bg-purple-100 text-purple-800'
};

export function ItemList({ neededItems, onItemsChanged }: ItemListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState<'food' | 'drinks' | 'supplies' | 'other'>('supplies');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const groupedItems = neededItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NeededItem[]>);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/needed-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item: newItem.trim(),
          category: newCategory,
        }),
      });

      if (response.ok) {
        setNewItem('');
        setIsAdding(false);
        onItemsChanged();
      }
    } catch {
      // Handle error silently
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = async (itemName: string) => {
    try {
      const response = await fetch('/api/needed-items', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item: itemName,
        }),
      });

      if (response.ok) {
        onItemsChanged();
      }
    } catch {
      // Handle error silently
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        📋 What We Need for the Party! 📋
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Green = taken care of • Red = still needed
      </p>

      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
              <span className="text-2xl mr-2">
                {categoryEmojis[category as keyof typeof categoryEmojis]}
              </span>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>
            
            <div className="grid gap-2">
              {items.map((item, index) => (
                <div
                  key={`${category}-${index}`}
                  className={`p-3 rounded-lg border transition-all ${
                    item.taken
                      ? 'bg-green-50 border-green-200 opacity-75'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${
                      item.taken ? 'text-green-800 line-through' : 'text-red-800'
                    }`}>
                      {item.item}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        categoryColors[item.category as keyof typeof categoryColors]
                      }`}>
                        {category}
                      </span>
                      {item.taken ? (
                        <span className="text-green-600 font-medium">✓</span>
                      ) : (
                        <span className="text-red-600 font-medium">○</span>
                      )}
                      <button
                        onClick={() => handleRemoveItem(item.item)}
                        className="text-gray-400 hover:text-red-500 text-sm ml-2"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  {item.taken && item.takenBy && (
                    <p className="text-sm text-green-600 mt-1">
                      Thanks, {item.takenBy}! 🎉
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="text-center">
          {!isAdding ? (
            <div>
              <p className="text-blue-800 text-sm mb-2">
                💡 Don&apos;t see something we need? Add it to the list!
              </p>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                + Add Item to List
              </button>
            </div>
          ) : (
            <form onSubmit={handleAddItem} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="What do we need?"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                  autoFocus
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as 'food' | 'drinks' | 'supplies' | 'other')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="food">🍔 Food</option>
                  <option value="drinks">🥤 Drinks</option>
                  <option value="supplies">🏖️ Supplies</option>
                  <option value="other">🎯 Other</option>
                </select>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting || !newItem.trim()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {isSubmitting ? 'Adding...' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewItem('');
                  }}
                  disabled={isSubmitting}
                  className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}