'use client';

import { useState } from 'react';

interface SignupFormProps {
  onSignupSuccess: () => void;
}

export function SignupForm({ onSignupSuccess }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [item, setItem] = useState('');
  const [itemCategory, setItemCategory] = useState<'food' | 'drinks' | 'supplies' | 'other'>('other');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [items, setItems] = useState<Array<{item: string; category: 'food' | 'drinks' | 'supplies' | 'other'; quantity: number}>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const addItem = () => {
    if (item.trim()) {
      setItems([...items, { item: item.trim(), category: itemCategory, quantity: itemQuantity }]);
      setItem('');
      setItemCategory('other');
      setItemQuantity(1);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add current item if there's one being typed
    if (item.trim()) {
      addItem();
    }

    if (items.length === 0) {
      setMessage('Please add at least one item you\'re bringing!');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          items,
          // Keep backward compatibility
          item: items[0]?.item || '',
          itemCategory: items[0]?.category || 'other',
        }),
      });

      if (response.ok) {
        setMessage('🎉 Thanks for signing up! See you at the beach!');
        setName('');
        setEmail('');
        setItem('');
        setItems([]);
        setItemCategory('other');
        onSignupSuccess();
      } else {
        setMessage('😕 Something went wrong. Please try again.');
      }
    } catch {
      setMessage('😕 Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        🙋‍♀️ Sign Up for the Beach BBQ! 🙋‍♂️
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What are you bringing? (You can add multiple items!)
          </label>
          
          {/* Added Items List */}
          {items.length > 0 && (
            <div className="mb-3 space-y-2">
              {items.map((addedItem, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <span className="text-sm">
                    {addedItem.quantity > 1 && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2">
                        {addedItem.quantity}x
                      </span>
                    )}
                    {addedItem.item} 
                    <span className="text-gray-500 ml-2">
                      ({addedItem.category === 'food' ? '🍔' : 
                        addedItem.category === 'drinks' ? '🥤' : 
                        addedItem.category === 'supplies' ? '🏖️' : '🎯'} {addedItem.category})
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Add Item Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Burgers, Chips, Beach Chairs..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
            />
            <input
              type="number"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Qty"
              min="1"
              title="Quantity"
            />
            <select
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value as 'food' | 'drinks' | 'supplies' | 'other')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="food">🍔 Food</option>
              <option value="drinks">🥤 Drinks</option>
              <option value="supplies">🏖️ Supplies</option>
              <option value="other">🎯 Other</option>
            </select>
            <button
              type="button"
              onClick={addItem}
              disabled={!item.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Signing you up...' : '🔥 Count Me In! 🔥'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-center ${
          message.includes('Thanks') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}