"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "../context/AppContext"
import { useRouter } from "next/navigation"
import EditExpenseForm from "../components/EditExpenseForm"

type Expense = {
  id: string
  name: string
  category: string
  date: string
  amount: number
}

export default function DashboardPage() {
  const { user, expenses, addExpense, updateExpense, deleteExpense, fetchExpenses } = useAppContext()
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    } else {
      fetchExpenses()
    }
  }, [user, router, fetchExpenses])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addExpense({
      name: user!.username,
      category,
      date: new Date().toISOString().split("T")[0],
      amount: Number.parseFloat(amount),
    })
    setCategory("")
    setAmount("")
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      await deleteExpense(id)
    }
  }

  const currentMonth = new Date().toLocaleString("default", { month: "long" })
  const currentYear = new Date().getFullYear()

  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === new Date().getMonth() && expenseDate.getFullYear() === currentYear
  })

  const totalExpenseNiloy = currentMonthExpenses
    .filter((expense) => expense.name === "niloy")
    .reduce((sum, expense) => sum + expense.amount, 0)

  const totalExpenseSejuti = currentMonthExpenses
    .filter((expense) => expense.name === "sejuti")
    .reduce((sum, expense) => sum + expense.amount, 0)

  if (!user) return null

  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
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

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">
          Expenses for {currentMonth} {currentYear}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentMonthExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${expense.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setEditingExpense(expense)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(expense.id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
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

      {editingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Expense</h3>
            <EditExpenseForm expense={editingExpense} onCancel={() => setEditingExpense(null)} onSave={updateExpense} />
          </div>
        </div>
      )}
    </div>
  )
}

