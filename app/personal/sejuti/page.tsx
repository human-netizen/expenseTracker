'use client'

import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import EditExpenseForm from '../../components/EditExpenseForm';
import ExpenseStats from '../../components/ExpenseStats';

type Expense = {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  type?: 'personal' | 'joint';
};

export default function SejutiPersonalPage() {
  const { expenses, addExpense } = useAppContext();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addExpense({
      name: 'sejuti',
      category,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(amount),
      type: 'personal'
    });
    setCategory('');
    setAmount('');
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const personalExpenses = expenses.filter(expense => 
    expense.name === 'sejuti' && 
    expense.type === 'personal' &&
    new Date(expense.date).getMonth() === new Date().getMonth() && 
    new Date(expense.date).getFullYear() === currentYear
  );

  const totalPersonalExpense = personalExpenses
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Personal Expense Management 💼</h1>
        <p className="opacity-90">Track and analyze your personal spending habits</p>
      </div>

      {/* Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Expense Analytics</h2>
        <ExpenseStats expenses={expenses} type="personal" username="sejuti" />
      </div>

      {/* Add Expense Section */}
      <div className="card bg-white border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Personal Expense</h2>
          <span className="text-sm text-gray-500">{currentMonth} {currentYear}</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="input-primary flex-grow"
            required
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="input-primary flex-grow"
            required
          />
          <button type="submit" className="btn-primary">
            Add Expense
          </button>
        </form>
      </div>

      {/* Total Card */}
      <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
        <h3 className="text-lg font-semibold mb-2 text-purple-800">Total Personal Expenses</h3>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-purple-600">${totalPersonalExpense.toFixed(2)}</p>
          <span className="text-sm text-purple-600">{currentMonth} {currentYear}</span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="card bg-white border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Personal Expenses</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {personalExpenses.map(expense => (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${expense.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setEditingExpense(expense)}
                      className="text-purple-600 hover:text-purple-900 font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Expense Modal */}
      {editingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Personal Expense</h3>
            <EditExpenseForm
              expense={editingExpense}
              onCancel={() => setEditingExpense(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}