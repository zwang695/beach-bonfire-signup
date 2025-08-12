'use client';

interface NeededItem {
  item: string;
  category: 'food' | 'drinks' | 'supplies' | 'other';
  taken: boolean;
  takenBy?: string;
}

interface ItemListProps {
  neededItems: NeededItem[];
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

export function ItemList({ neededItems }: ItemListProps) {
  const groupedItems = neededItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NeededItem[]>);

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
        <p className="text-blue-800 text-sm text-center">
          💡 Don't see what you want to bring? Add it when you sign up!
        </p>
      </div>
    </div>
  );
}