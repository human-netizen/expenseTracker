'use client'

import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

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

  const totalExpenseNiloy = filteredExpenses
    .filter(expense => expense.name === 'niloy')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalExpenseSejuti = filteredExpenses
    .filter(expense => expense.name === 'sejuti')
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Expense History</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="input-primary"
        >
          <option value="">Select a month</option>
          {months.map(month => (
            <option key={month} value={month}>
              {new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </option>
          ))}
        </select>
      </div>

      {selectedMonth && (
        <>
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">
              Expenses for {new Date(selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
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
                  {filteredExpenses.map(expense => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{expense.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${expense.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Total Expense by Niloy</h3>
              <p className="text-2xl font-bold text-blue-600">${totalExpenseNiloy.toFixed(2)}</p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Total Expense by Sejuti</h3>
              <p className="text-2xl font-bold text-blue-600">${totalExpenseSejuti.toFixed(2)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

