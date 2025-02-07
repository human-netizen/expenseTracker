"use client"

import { useState } from "react"
import { useAppContext } from "../context/AppContext"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"
import "react-day-picker/dist/style.css"

export default function HistoryPage() {
  const { expenses } = useAppContext()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const filteredExpenses = selectedDate
    ? expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return (
          expenseDate.getFullYear() === selectedDate.getFullYear() &&
          expenseDate.getMonth() === selectedDate.getMonth() &&
          expenseDate.getDate() === selectedDate.getDate()
        )
      })
    : []

  const totalExpenseNiloy = filteredExpenses
    .filter((expense) => expense.name === "niloy")
    .reduce((sum, expense) => sum + expense.amount, 0)

  const totalExpenseSejuti = filteredExpenses
    .filter((expense) => expense.name === "sejuti")
    .reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Expense History</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="border rounded-md p-4"
            />
          </div>
          <div className="flex-1">
            {selectedDate ? (
              <>
                <h3 className="text-lg font-semibold mb-2">Expenses for {format(selectedDate, "MMMM d, yyyy")}</h3>
                {filteredExpenses.length > 0 ? (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredExpenses.map((expense) => (
                            <tr key={expense.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{expense.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                              <td className="px-6 py-4 whitespace-nowrap">${expense.amount.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="card">
                        <h4 className="text-md font-semibold mb-2">Total Expense by Niloy</h4>
                        <p className="text-xl font-bold text-blue-600">${totalExpenseNiloy.toFixed(2)}</p>
                      </div>
                      <div className="card">
                        <h4 className="text-md font-semibold mb-2">Total Expense by Sejuti</h4>
                        <p className="text-xl font-bold text-blue-600">${totalExpenseSejuti.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No expenses found for this date.</p>
                )}
              </>
            ) : (
              <p className="text-gray-500">Please select a date to view expenses.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

