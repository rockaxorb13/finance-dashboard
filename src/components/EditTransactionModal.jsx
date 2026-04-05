// src/components/EditTransactionModal.jsx
import { useState, useEffect } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

const STANDARD_CATEGORIES = ['Food', 'Subscriptions', 'Housing', 'Loans', 'Shopping', 'Essentials', 'Transport', 'Utilities', 'General'];

export default function EditTransactionModal({ isOpen, onClose, transaction }) {
  const { updateTransaction } = useFinanceStore();
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Initialize form data, but update it whenever a new transaction is clicked
  const [formData, setFormData] = useState({
    description: '', amount: '', category: '', type: 'expense', date: ''
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
        date: transaction.date
      });
      // If the category isn't standard, show the custom input
      setShowCustomCategory(!STANDARD_CATEGORIES.includes(transaction.category));
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedTx = {
      ...transaction, // Keep the same ID!
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date
    };

    updateTransaction(updatedTx);
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Edit Transaction</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input required type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              {/* FIXED: Rupee Symbol */}
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input required type="number" step="0.01" min="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input required type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              {!showCustomCategory ? (
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  value={formData.category}
                  onChange={(e) => {
                    if (e.target.value === 'ADD_NEW') {
                      setShowCustomCategory(true);
                      setFormData({...formData, category: ''});
                    } else {
                      setFormData({...formData, category: e.target.value});
                    }
                  }}>
                  <option value="ADD_NEW" className="font-semibold text-gray-900">✨ + Add New Category</option>
                  <option disabled>──────────</option>
                  {/* Ensure the current category is in the list even if it's not standard */}
                  {!STANDARD_CATEGORIES.includes(formData.category) && formData.category && (
                    <option value={formData.category}>{formData.category}</option>
                  )}
                  {STANDARD_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              ) : (
                <div className="flex gap-2">
                  <input required autoFocus type="text" placeholder="Type category..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                  <button type="button" onClick={() => { setShowCustomCategory(false); setFormData({...formData, category: 'General'}); }}
                    className="px-2 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg">
                    Back
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 border border-transparent rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}