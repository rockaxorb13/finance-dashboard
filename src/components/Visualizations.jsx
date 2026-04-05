// src/components/Visualizations.jsx
import { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, AreaChart, Area
} from 'recharts';

const EXPENSE_COLORS = ['#1e1b4b', '#312e81', '#4338ca', '#4f46e5', '#6366f1', '#818cf8'];
const INCOME_EXPENSE_COLORS = ['#10b981', '#f43f5e']; 

// Helper function to format INR cleanly
const formatINR = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function Visualizations() {
  const { transactions } = useFinanceStore();

  // 1. Prepare Balance Data and Dynamic Colors
  const { balanceData, themeColor, gradTop } = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let runningBalance = 0;
    
    const data = sorted.map(t => {
      runningBalance += t.type === 'income' ? t.amount : -t.amount;
      return { date: t.date, balance: runningBalance };
    });

    // Determine the peak and current balance to set the chart color
    const maxBalance = Math.max(...data.map(d => d.balance), 1); // Avoid division by zero
    const currentBalance = data.length > 0 ? data[data.length - 1].balance : 0;
    const healthRatio = currentBalance / maxBalance;

    // Default: Catchy Green line, Dark Green gradient top
    let strokeColor = '#22c55e'; 
    let gradientTop = '#065f46'; 

    if (healthRatio <= 0.20) {
      // Critical: Poppy Red line, Dark Red gradient
      strokeColor = '#ef4444'; 
      gradientTop = '#991b1b';
    } else if (healthRatio <= 0.40) {
      // Warning: Orange line, Dark Orange gradient
      strokeColor = '#f97316'; 
      gradientTop = '#c2410c';
    }

    return { balanceData: data, themeColor: strokeColor, gradTop: gradientTop };
  }, [transactions]);

  // 2. Prepare Category Data
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    return Object.keys(grouped).map(key => ({ name: key, value: grouped[key] })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  // 3. Prepare Income vs Expense Data
  const incomeVsExpenseData = useMemo(() => {
    const totals = transactions.reduce((acc, curr) => {
      if (curr.type === 'income') acc.income += curr.amount;
      else acc.expense += curr.amount;
      return acc;
    }, { income: 0, expense: 0 });
    return [
      { name: 'Income', value: totals.income },
      { name: 'Expenses', value: totals.expense }
    ];
  }, [transactions]);

  // 4. Prepare Cash Flow Data
  const cashFlowData = useMemo(() => {
    const grouped = transactions.reduce((acc, curr) => {
      if (!acc[curr.date]) acc[curr.date] = { date: curr.date, income: 0, expense: 0 };
      if (curr.type === 'income') acc[curr.date].income += curr.amount;
      else acc[curr.date].expense += curr.amount;
      return acc;
    }, {});
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  // Custom label renderer adjusted to prevent clipping
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
    if (percent < 0.04) return null; 
    const radius = outerRadius * 1.3; // Push labels out
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="#4b5563" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[11px] font-medium tracking-tight">
        {name} ({(percent * 100).toFixed(0)}%)
      </text>
    );
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      
      {/* 1. TOP: Dynamic Running Balance */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full min-h-[300px] flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Total Balance Over Time</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {/* Added left margin to fix axis overlap */}
            <AreaChart data={balanceData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradTop} stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} dy={10} />
              {/* Added width={80} to give currency string room */}
              <YAxis width={80} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(val) => formatINR(val)} />
              <Tooltip formatter={(val) => formatINR(val)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="balance" stroke={themeColor} strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. MIDDLE: Pie Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[300px]">
        {/* Pie 1: Categories */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col relative">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-gray-400 font-medium">Top Spend</span>
              <span className="text-sm font-bold text-gray-800">{categoryData[0]?.name || 'N/A'}</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              {/* Added generous margins to prevent text clipping */}
              <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                {/* Shrunk radii slightly to make room for labels */}
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none" label={renderCustomizedLabel} labelLine={false}>
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => formatINR(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie 2: Cash In vs Out */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col relative">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Cash In vs Out</h3>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-gray-400 font-medium">Net Ratio</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <Pie data={incomeVsExpenseData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none" label={renderCustomizedLabel} labelLine={false}>
                  {incomeVsExpenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={INCOME_EXPENSE_COLORS[index % INCOME_EXPENSE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => formatINR(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM: Cash Flow Bar Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full min-h-[300px] flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Daily Cash Flow</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis width={80} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(val) => formatINR(val)} />
              <Tooltip formatter={(val) => formatINR(val)} cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}