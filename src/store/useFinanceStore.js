// src/store/useFinanceStore.js
import { create } from 'zustand';
import { initialTransactions } from '../data/mockData';

export const useFinanceStore = create((set) => ({
  // --- STATE ---
  transactions: initialTransactions,
  role: 'viewer', // Toggles between 'viewer' and 'admin'
  searchTerm: '',
  categoryFilter: 'All',

  // --- ACTIONS (Mutations) ---
  
  // Switch roles for the UI requirement
  setRole: (newRole) => set({ role: newRole }),

  // Update the search filter
setSearchTerm: (term) => set({ searchTerm: term }),
setCategoryFilter: (category) => set({ categoryFilter: category }),

  // Admin action: Add a new transaction
  addTransaction: (newTransaction) => set((state) => ({
    // Spreading the existing array and adding the new one at the top
    transactions: [newTransaction, ...state.transactions]
  })),

  // Admin action: Delete a transaction
  deleteTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter(transaction => transaction.id !== id)
  })),

  // Admin action: Edit an existing transaction
  updateTransaction: (updatedTransaction) => set((state) => ({
    transactions: state.transactions.map(transaction => 
      transaction.id === updatedTransaction.id ? updatedTransaction : transaction
    )
  }))
}));