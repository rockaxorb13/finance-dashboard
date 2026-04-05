// src/components/InsightsBanner.jsx
import { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

const formatINR = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function InsightsBanner() {
  const { transactions } = useFinanceStore();

  const insights = useMemo(() => {
    if (transactions.length === 0) return { message: "Add transactions to generate smart insights.", type: 'neutral' };

    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');

    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

    if (expenses.length === 0) return { message: "Great job! You have no expenses recorded yet.", type: 'positive' };

    // 1. Calculate Highest Spending Category
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    // 2. Find the Biggest Single Expense
    const biggestExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0];

    // 3. Calculate Savings Rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    let message = '';
    let type = 'neutral';

    // The "Brain" of the Insights
    if (savingsRate < 10 && totalIncome > 0) {
       message = `Watch out! Your savings rate is low (${savingsRate.toFixed(1)}%). Your highest spend is on ${topCategory[0]} (${formatINR(topCategory[1])}).`;
       type = 'warning';
    } else if (biggestExpense.amount > (totalExpense * 0.4)) {
       message = `Heads up: A single transaction (${biggestExpense.description}) makes up ${(biggestExpense.amount / totalExpense * 100).toFixed(0)}% of all your expenses.`;
       type = 'warning';
    } else {
       message = `On track! Your highest spending category is ${topCategory[0]} (${formatINR(topCategory[1])}). You have a positive cash flow of ${formatINR(totalIncome - totalExpense)}.`;
       type = 'positive';
    }

    return { message, type };
  }, [transactions]);

  // Dynamic styling based on the health of the insight
  const bgColors = {
    positive: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: 'bg-orange-50 border-orange-200 text-orange-800',
    neutral: 'bg-indigo-50 border-indigo-200 text-indigo-800'
  };

  const icons = {
    positive: '✨',
    warning: '🚨',
    neutral: '💡'
  };

  return (
    <div className={`flex items-center gap-4 p-5 rounded-xl border shadow-sm ${bgColors[insights.type]} transition-colors duration-300`}>
      <div className="text-2xl drop-shadow-sm">{icons[insights.type]}</div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5 opacity-70">Smart Insight</h4>
        <p className="text-sm font-medium leading-relaxed">{insights.message}</p>
      </div>
    </div>
  );
}