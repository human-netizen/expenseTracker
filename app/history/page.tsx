'use client'

import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

type MonthlyStats = {
  jointTotal: number;
  niloyPersonal: number;
  sejutiPersonal: number;
  categories: Record<string, number>;
};

export default function HistoryPage() {
  const { expenses } = useAppContext();
  const [selectedMonth, setSelectedMonth] = useState('');

  const months = [...new Set(expenses.map(expense => {
    const date = new Date(expense.date);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }))].sort((a, b) => b.localeCompare(a));

  const filteredExpenses = selectedMonth
    ? expenses.filter(expense => expense.date.startsWith(selectedMonth))
    : [];

  // Calculate monthly statistics
  const monthlyStats: MonthlyStats = filteredExpenses.reduce((stats, expense) => {
    if (expense.type === 'joint') {
      stats.jointTotal += expense.amount;
    } else if (expense.name === 'niloy') {
      stats.niloyPersonal += expense.amount;
    } else if (expense.name === 'sejuti') {
      stats.sejutiPersonal += expense.amount;
    }

    // Update categories with type safety
    const currentAmount = stats.categories[expense.category] || 0;
    stats.categories = {
      ...stats.categories,
      [expense.category]: currentAmount + expense.amount
    };
    
    return stats;
  }, {
    jointTotal: 0,
    niloyPersonal: 0,
    sejutiPersonal: 0,
    categories: {} as Record<string, number>
  });

  // Sort categories by amount
  const topCategories = Object.entries(monthlyStats.categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Expense History 📊</h1>
        <p className="opacity-90">Analyze your spending patterns over time</p>
      </div>

      {/* Month Selector */}
      <div className="card bg-white border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Select Month</h2>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input-primary min-w-[200px]"
          >
            <option value="">Select a month</option>
            {months.map(month => (
              <option key={month} value={month}>
                {new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedMonth && (
        <>
          {/* Monthly Summary */}
          <div className="grid grid-cols-1 gap-4">
            {/* Joint Expenses Overview */}
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Joint Expenses Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-blue-600 mb-1">Total Joint Expenses</h4>
                  <p className="text-2xl font-bold text-blue-700">${monthlyStats.jointTotal.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-600 mb-1">Niloy&apos;s Contribution</h4>
                  {(() => {
                    const niloyJointAmount = filteredExpenses
                      .filter(e => e.type === 'joint' && e.name === 'niloy')
                      .reduce((sum, e) => sum + e.amount, 0);
                    const percentage = (niloyJointAmount / monthlyStats.jointTotal) * 100;
                    return (
                      <>
                        <p className="text-xl font-bold text-blue-700">${niloyJointAmount.toFixed(2)}</p>
                        <p className="text-sm text-blue-600">{percentage.toFixed(1)}%</p>
                      </>
                    );
                  })()}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-600 mb-1">Sejuti&apos;s Contribution</h4>
                  {(() => {
                    const sejutiJointAmount = filteredExpenses
                      .filter(e => e.type === 'joint' && e.name === 'sejuti')
                      .reduce((sum, e) => sum + e.amount, 0);
                    const percentage = (sejutiJointAmount / monthlyStats.jointTotal) * 100;
                    return (
                      <>
                        <p className="text-xl font-bold text-blue-700">${sejutiJointAmount.toFixed(2)}</p>
                        <p className="text-sm text-blue-600">{percentage.toFixed(1)}%</p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Personal Expenses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card bg-gradient-to-br from-green-50 to-green-100">
                <h3 className="text-lg font-semibold mb-2 text-green-800">Niloy&apos;s Personal</h3>
                <p className="text-2xl font-bold text-green-600">${monthlyStats.niloyPersonal.toFixed(2)}</p>
              </div>
              <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
                <h3 className="text-lg font-semibold mb-2 text-purple-800">Sejuti&apos;s Personal</h3>
                <p className="text-2xl font-bold text-purple-600">${monthlyStats.sejutiPersonal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className="card bg-white border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Spending Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {topCategories.map(([category, amount], index) => (
                <div key={category} className="p-4 rounded-lg bg-gray-50">
                  <div className="text-sm text-gray-600 mb-1">#{index + 1}</div>
                  <div className="font-medium text-gray-800">{category}</div>
                  <div className="text-lg font-bold text-blue-600">${amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Tables */}
          <div className="grid grid-cols-1 gap-8">
            {/* Joint Expenses */}
            <div className="card bg-white border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Joint Expenses</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredExpenses
                      .filter(expense => expense.type === 'joint')
                      .map(expense => (
                        <tr key={expense.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">{expense.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${expense.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Personal Expenses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Niloy's Personal */}
              <div className="card bg-white border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Niloy&apos;s Personal Expenses</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredExpenses
                        .filter(expense => expense.type === 'personal' && expense.name === 'niloy')
                        .map(expense => (
                          <tr key={expense.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${expense.amount.toFixed(2)}</td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sejuti's Personal */}
              <div className="card bg-white border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Sejuti&apos;s Personal Expenses</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredExpenses
                        .filter(expense => expense.type === 'personal' && expense.name === 'sejuti')
                        .map(expense => (
                          <tr key={expense.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${expense.amount.toFixed(2)}</td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
