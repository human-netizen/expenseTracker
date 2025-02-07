"use client"

import type React from "react"
import { useState } from "react"

type Expense = {
  id: string
  name: string
  category: string
  date: string
  amount: number
}

type EditExpenseFormProps = {
  expense: Expense
  onCancel: () => void
  onSave: (expense: Expense) => Promise<void>
}

export default function EditExpenseForm({ expense, onCancel, onSave }: EditExpenseFormProps) {
  const [category, setCategory] = useState(expense.category)
  const [amount, setAmount] = useState(expense.amount.toString())
  const [date, setDate] = useState(expense.date)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave({
      ...expense,
      category,
      amount: Number.parseFloat(amount),
      date,
    })
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-primary"
          required
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-primary"
          required
        />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-primary"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save
        </button>
      </div>
    </form>
  )
}

