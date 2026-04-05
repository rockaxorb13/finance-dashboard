// src/components/TransactionTable.jsx
import { useMemo, useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import AddTransactionModal from './AddTransactionModal';
import EditTransactionModal from './EditTransactionModal'; 

export default function TransactionTable() {
  const { 
    transactions, 
    role, 
    searchTerm, 
    setSearchTerm, 
    categoryFilter, 
    setCategoryFilter,
    deleteTransaction 
  } = useFinanceStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null); 

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, searchTerm, categoryFilter]);

  const categories = ['All', ...new Set(transactions.map(t => t.category))];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search transactions..."
            className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-900/5 transition-all w-full sm:max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="px-4 py-2 border border-gray-200 rounded-lg outline-none cursor-pointer"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            + Add Transaction
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
              <th className="py-4 px-2">Date</th>
              <th className="py-4 px-2">Description</th>
              <th className="py-4 px-2">Category</th>
              <th className="py-4 px-2">Amount</th>
              {role === 'admin' && <th className="py-4 px-2 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-2 text-sm text-gray-600">{t.date}</td>
                <td className="py-4 px-2 font-medium">{t.description}</td>
                <td className="py-4 px-2">
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                    {t.category}
                  </span>
                </td>
                <td className={`py-4 px-2 font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {/* Formatted with proper Indian comma placement */}
                  {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                {role === 'admin' && (
                  <td className="py-4 px-2 text-right">
                    {/* The NEW Edit Button */}
                    <button 
                      onClick={() => setEditingTx(t)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="text-rose-500 hover:text-rose-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 italic">No transactions found matching your criteria.</p>
          </div>
        )}
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <EditTransactionModal 
        isOpen={!!editingTx} 
        transaction={editingTx}
        onClose={() => setEditingTx(null)} 
      />
    </div>
  );
}