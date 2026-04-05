
import { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

export default function SummaryCards() {
  const { transactions } = useFinanceStore();

 
  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') {
          acc.income += curr.amount;
        } else {
          acc.expenses += curr.amount;
        }
        return acc;
      },
      { income: 0, expenses: 0 } 
    );
  }, [transactions]);

  const balance = totals.income - totals.expenses;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Balance Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-sm font-medium text-gray-500 mb-1">Total Balance</p>
        <h3 className="text-2xl font-bold text-gray-900">
          ₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h3>
      </div>

      {/* Income Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-sm font-medium text-gray-500 mb-1">Total Income</p>
        <h3 className="text-2xl font-bold text-emerald-600">
          +₹{totals.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h3>
      </div>

      {/* Expenses Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-sm font-medium text-gray-500 mb-1">Total Expenses</p>
        <h3 className="text-2xl font-bold text-rose-600">
          -₹{totals.expenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h3>
      </div>
    </div>
  );
}