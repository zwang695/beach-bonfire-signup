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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          item,
          itemCategory,
        }),
      });

      if (response.ok) {
        setMessage('🎉 Thanks for signing up! See you at the beach!');
        setName('');
        setEmail('');
        setItem('');
        setItemCategory('other');
        onSignupSuccess();
      } else {
        setMessage('😕 Something went wrong. Please try again.');
      }
    } catch (error) {
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
          <label htmlFor="item" className="block text-sm font-medium text-gray-700 mb-1">
            What are you bringing?
          </label>
          <input
            type="text"
            id="item"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. Burgers, Chips, Beach Chairs..."
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={itemCategory}
            onChange={(e) => setItemCategory(e.target.value as 'food' | 'drinks' | 'supplies' | 'other')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="food">🍔 Food</option>
            <option value="drinks">🥤 Drinks</option>
            <option value="supplies">🏖️ Supplies</option>
            <option value="other">🎯 Other</option>
          </select>
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