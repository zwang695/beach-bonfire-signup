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
  const sortedSignups = [...signups].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

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
            {sortedSignups.length} awesome people signed up!
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
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <span className="mr-2">
                      {categoryEmojis[signup.itemCategory]}
                    </span>
                    Bringing: <span className="font-medium ml-1">{signup.item}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(signup.timestamp).toLocaleDateString()}
                  </p>
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