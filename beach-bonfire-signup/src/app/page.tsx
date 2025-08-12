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

  const fetchData = async () => {
    try {
      const [signupsRes, itemsRes] = await Promise.all([
        fetch('/api/signup'),
        fetch('/api/needed-items')
      ]);

      if (signupsRes.ok) {
        const signupsData = await signupsRes.json();
        setSignups(signupsData.signups || []);
      }

      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setNeededItems(itemsData.neededItems || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          <h1 className="text-6xl font-bold text-white mb-4">
            🔥 Beach Bonfire BBQ 🏖️
          </h1>
          <p className="text-xl text-blue-100 mb-2">
            Join us for an epic beach bonfire and BBQ!
          </p>
          <p className="text-lg text-blue-200">
            📅 Saturday, August 17th • 🕕 5:00 PM • 📍 Davenport Beach, Santa Cruz
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
