'use client';

import { useState, useEffect } from 'react';
import { SignupForm } from '@/components/SignupForm';
import { ItemList } from '@/components/ItemList';
import { SignupList } from '@/components/SignupList';

export interface SignUpEntry {
  name: string;
  email: string;
  item: string;
  itemCategory: 'food' | 'drinks' | 'supplies' | 'other';
  timestamp: string;
  quantity?: number;
  items?: Array<{
    item: string;
    category: 'food' | 'drinks' | 'supplies' | 'other';
    quantity?: number;
  }>;
}

export interface NeededItem {
  item: string;
  category: 'food' | 'drinks' | 'supplies' | 'other';
  taken: boolean;
  takenBy?: string;
  quantityNeeded?: number;
  quantityBrought?: number;
}

export default function Home() {
  const [signups, setSignups] = useState<SignUpEntry[]>([]);
  const [neededItems, setNeededItems] = useState<NeededItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdateHash, setLastUpdateHash] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (silent = false) => {
    if (silent) {
      setIsRefreshing(true);
    }
    
    try {
      const [signupsRes, itemsRes] = await Promise.all([
        fetch('/api/signup'),
        fetch('/api/needed-items')
      ]);

      if (signupsRes.ok && itemsRes.ok) {
        const [signupsData, itemsData] = await Promise.all([
          signupsRes.json(),
          itemsRes.json()
        ]);

        // Create a hash of the data to detect changes
        const currentHash = JSON.stringify({
          signups: signupsData.signups || [],
          items: itemsData.neededItems || []
        });

        // Only update if data has changed
        if (currentHash !== lastUpdateHash) {
          setSignups(signupsData.signups || []);
          setNeededItems(itemsData.neededItems || []);
          setLastUpdateHash(currentHash);
          
          // Show a subtle notification for background updates (except initial load)
          if (lastUpdateHash && silent) {
            console.log('🔄 Data updated automatically');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      if (!silent) {
        setLoading(false);
      } else {
        setTimeout(() => setIsRefreshing(false), 500); // Brief indicator
      }
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchData(true); // silent = true for background updates
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [lastUpdateHash]); // Re-run when lastUpdateHash changes

  const handleSignupSuccess = () => {
    fetchData();
  };

  const handleItemsChanged = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading beach vibes... 🏖️</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-6xl font-bold text-white">
              🔥 Beach Bonfire BBQ 🏖️
            </h1>
            {isRefreshing && (
              <div className="ml-4 flex items-center text-blue-200 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Syncing...
              </div>
            )}
          </div>
          <p className="text-xl text-blue-100 mb-2">
            Join us for an epic beach bonfire and BBQ!
          </p>
          <p className="text-lg text-blue-200">
            📅 Sunday, August 17th • 🕕 5:00 PM • 📍 Davenport Beach, Santa Cruz
          </p>
          <p className="text-sm text-blue-300 mt-2">
            🔄 Auto-refreshes every 10 seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Sign Up */}
          <div className="space-y-8">
            <SignupForm onSignupSuccess={handleSignupSuccess} />
            <SignupList signups={signups} />
          </div>

          {/* Right Column - Items */}
          <div>
            <ItemList neededItems={neededItems} onItemsChanged={handleItemsChanged} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-blue-100">
          <p className="text-lg mb-2">
            🌊 Can&apos;t wait to see everyone there! 🌊
          </p>
        </div>
      </div>
    </div>
  );
}
