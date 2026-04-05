// src/components/AddTransactionModal.jsx
import { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

const STANDARD_CATEGORIES = ['Food', 'Subscriptions', 'Housing', 'Loans', 'Shopping', 'Essentials', 'Transport', 'Utilities', 'General'];

export default function AddTransactionModal({ isOpen, onClose }) {
  const { addTransaction } = useFinanceStore();

  // State to track if the user wants to type a custom category
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'General',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTx = {
      id: `tx_${Date.now()}`,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date
    };

    addTransaction(newTx);
    
    // Reset the form back to default for the next time it opens
    setShowCustomCategory(false);
    setFormData({
      description: '', amount: '', category: 'General', type: 'expense', date: new Date().toISOString().split('T')[0]
    });
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Add Transaction</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input 
                required
                type="number" 
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                required
                type="date" 
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select 
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 cursor-pointer"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            
            {/* THE NEW SMART CATEGORY INPUT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              {!showCustomCategory ? (
                <select 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 cursor-pointer"
                  value={formData.category}
                  onChange={(e) => {
                    if (e.target.value === 'ADD_NEW') {
                      setShowCustomCategory(true);
                      setFormData({...formData, category: ''}); // Clear it so they can type
                    } else {
                      setFormData({...formData, category: e.target.value});
                    }
                  }}
                >
                  <option value="ADD_NEW" className="font-semibold text-gray-900">✨ + Add New Category</option>
                  <option disabled>──────────</option>
                  {STANDARD_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              ) : (
                <div className="flex gap-2">
                  <input 
                    required
                    autoFocus
                    type="text" 
                    placeholder="Type category..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowCustomCategory(false);
                      setFormData({...formData, category: 'General'});
                    }}
                    className="px-2 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 border border-transparent rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
            >
              Save Transaction
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}