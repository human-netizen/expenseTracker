'use client'

import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import EditExpenseForm from '../components/EditExpenseForm';
import ExpenseStats from '../components/ExpenseStats';

type Expense = {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  type?: 'personal' | 'joint';
};

export default function DashboardPage() {
  const { user, expenses, addExpense } = useAppContext();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addExpense({
      name: user!.username,
      category,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(amount),
      type: 'joint'
    });
    setCategory('');
    setAmount('');
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === new Date().getMonth() && 
           expenseDate.getFullYear() === currentYear;
  });

  // Calculate totals
  const jointExpenses = currentMonthExpenses.filter(expense => expense.type === 'joint');
  const totalJointExpenses = jointExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const niloyPersonalExpenses = currentMonthExpenses.filter(expense => 
    expense.name === 'niloy' && expense.type === 'personal'
  );
  const totalNiloyPersonal = niloyPersonalExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const sejutiPersonalExpenses = currentMonthExpenses.filter(expense => 
    expense.name === 'sejuti' && expense.type === 'personal'
  );
  const totalSejutiPersonal = sejutiPersonalExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.username}! 👋</h1>
        <p className="opacity-90">Track and manage your expenses efficiently.</p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Joint Expenses Overview</h2>
          <ExpenseStats expenses={expenses} type="joint" />
        </div>

        {user?.username === 'niloy' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Personal Expenses</h2>
            <ExpenseStats expenses={expenses} type="personal" username="niloy" />
          </div>
        )}

        {user?.username === 'sejuti' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Personal Expenses</h2>
            <ExpenseStats expenses={expenses} type="personal" username="sejuti" />
          </div>
        )}
      </div>

      {/* Add Expense Section */}
      <div className="card bg-white border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Joint Expense</h2>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4">
        {/* Joint Expenses Card */}
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Joint Expenses Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-blue-600 mb-1">Total Joint Expenses</h4>
              <p className="text-2xl font-bold text-blue-700">${totalJointExpenses.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-600 mb-1">Niloy's Contribution</h4>
              <p className="text-xl font-bold text-blue-700">
                ${jointExpenses.filter(e => e.name === 'niloy').reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
              </p>
              <p className="text-sm text-blue-600">
                {((jointExpenses.filter(e => e.name === 'niloy').reduce((sum, e) => sum + e.amount, 0) / totalJointExpenses) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-600 mb-1">Sejuti's Contribution</h4>
              <p className="text-xl font-bold text-blue-700">
                ${jointExpenses.filter(e => e.name === 'sejuti').reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
              </p>
              <p className="text-sm text-blue-600">
                {((jointExpenses.filter(e => e.name === 'sejuti').reduce((sum, e) => sum + e.amount, 0) / totalJointExpenses) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Personal Expenses Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card bg-gradient-to-br from-green-50 to-green-100">
            <h3 className="text-lg font-semibold mb-2 text-green-800">Niloy's Personal</h3>
            <p className="text-2xl font-bold text-green-600">${totalNiloyPersonal.toFixed(2)}</p>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
            <h3 className="text-lg font-semibold mb-2 text-purple-800">Sejuti's Personal</h3>
            <p className="text-2xl font-bold text-purple-600">${totalSejutiPersonal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Recent Joint Expenses Table */}
      <div className="card bg-white border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Joint Expenses</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jointExpenses.slice(0, 5).map(expense => (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">{expense.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${expense.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setEditingExpense(expense)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
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
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Expense</h3>
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
