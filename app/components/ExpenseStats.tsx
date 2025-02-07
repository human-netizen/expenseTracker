'use client'

import { useMemo } from 'react';

type Expense = {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  type?: 'personal' | 'joint';
};

type ExpenseStatsProps = {
  expenses: Expense[];
  type: 'joint' | 'personal';
  username?: string;
};

export default function ExpenseStats({ expenses, type, username }: ExpenseStatsProps) {
  const stats = useMemo(() => {
    const filteredExpenses = expenses.filter(expense => {
      if (type === 'personal') {
        return expense.type === 'personal' && expense.name === username;
      }
      return expense.type === 'joint';
    });

    // Category breakdown
    const categoryTotals = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Sort categories by amount
    const topCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    // Daily spending trend (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailySpending = last7Days.map(date => ({
      date,
      amount: filteredExpenses
        .filter(e => e.date === date)
        .reduce((sum, e) => sum + e.amount, 0)
    }));

    // Monthly total
    const currentMonth = new Date().getMonth();
    const monthlyTotal = filteredExpenses
      .filter(e => new Date(e.date).getMonth() === currentMonth)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      topCategories,
      dailySpending,
      monthlyTotal
    };
  }, [expenses, type, username]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Monthly Overview */}
      <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">Monthly Overview</h3>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-blue-600">
            ${stats.monthlyTotal.toFixed(2)}
          </div>
          <div className="text-sm text-blue-600">
            {new Date().toLocaleString('default', { month: 'long' })}
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
        <h3 className="text-lg font-semibold mb-2 text-purple-800">Top Spending Categories</h3>
        <div className="space-y-2">
          {stats.topCategories.map(([category, amount]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-purple-700">{category}</span>
              <span className="text-purple-800 font-medium">${amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Spending Trend */}
      <div className="card bg-gradient-to-br from-green-50 to-green-100">
        <h3 className="text-lg font-semibold mb-2 text-green-800">Daily Spending Trend</h3>
        <div className="h-32 flex items-end justify-between">
          {stats.dailySpending.map((day) => {
            const maxAmount = Math.max(...stats.dailySpending.map(d => d.amount));
            const height = maxAmount ? (day.amount / maxAmount) * 100 : 0;
            
            return (
              <div key={day.date} className="flex flex-col items-center">
                <div 
                  className="w-4 bg-green-500 rounded-t" 
                  style={{ height: `${height}%` }}
                  title={`$${day.amount.toFixed(2)}`}
                />
                <div className="text-xs text-green-800 mt-1">
                  {new Date(day.date).toLocaleDateString('default', { weekday: 'short' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}