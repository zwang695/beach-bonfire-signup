'use client';

interface SignUpEntry {
  name: string;
  email: string;
  item: string;
  itemCategory: 'food' | 'drinks' | 'supplies' | 'other';
  timestamp: string;
}

interface SignupListProps {
  signups: SignUpEntry[];
}

const categoryEmojis = {
  food: '🍔',
  drinks: '🥤',
  supplies: '🏖️',
  other: '🎯'
};

export function SignupList({ signups }: SignupListProps) {
  // Group signups by person (email) to show multiple items per person
  const groupedSignups = signups.reduce((acc, signup) => {
    const existing = acc.find(entry => entry.email === signup.email);
    if (existing) {
      existing.items.push({
        item: signup.item,
        category: signup.itemCategory
      });
    } else {
      acc.push({
        name: signup.name,
        email: signup.email,
        timestamp: signup.timestamp,
        items: [{
          item: signup.item,
          category: signup.itemCategory
        }]
      });
    }
    return acc;
  }, [] as Array<{
    name: string;
    email: string;
    timestamp: string;
    items: Array<{item: string; category: 'food' | 'drinks' | 'supplies' | 'other'}>;
  }>);

  const sortedSignups = groupedSignups.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const totalItems = signups.length;
  const uniquePeople = groupedSignups.length;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        🎉 Who&apos;s Coming? 🎉
      </h2>
      
      {sortedSignups.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            Be the first to sign up! 🏃‍♀️💨
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-600 text-center mb-4">
            {uniquePeople} awesome people signed up bringing {totalItems} items!
          </p>
          
          {sortedSignups.map((signup) => (
            <div
              key={`${signup.email}-${signup.timestamp}`}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    👋 {signup.name}
                  </p>
                  <div className="text-sm text-gray-600 mt-1">
                    <p className="font-medium">Bringing:</p>
                    <div className="mt-1 space-y-1">
                      {signup.items.map((item, index) => (
                        <p key={index} className="flex items-center">
                          <span className="mr-2">
                            {categoryEmojis[item.category]}
                          </span>
                          <span className="font-medium">{item.item}</span>
                          <span className="text-gray-400 ml-2 text-xs">({item.category})</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(signup.timestamp).toLocaleDateString()}
                  </p>
                  {signup.items.length > 1 && (
                    <p className="text-xs text-blue-600 font-medium">
                      {signup.items.length} items
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg">
          <p className="text-orange-800 font-medium">
            🔥 The more the merrier! Invite your friends! 🔥
          </p>
        </div>
      </div>
    </div>
  );
}