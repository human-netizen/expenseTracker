"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "../context/AppContext"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HistoryPage() {
  const { expenses, fetchExpenses } = useAppContext()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

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
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div className="flex-1">
              {selectedDate ? (
                <>
                  <h3 className="text-lg font-semibold mb-4">Expenses for {format(selectedDate, "MMMM d, yyyy")}</h3>
                  {filteredExpenses.length > 0 ? (
                    <div className="space-y-6">
                      <div className="rounded-md border">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                              <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {filteredExpenses.map((expense) => (
                              <tr key={expense.id}>
                                <td className="px-4 py-3 text-sm">{expense.name}</td>
                                <td className="px-4 py-3 text-sm">{expense.category}</td>
                                <td className="px-4 py-3 text-sm">${expense.amount.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Total Expense by Niloy</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold text-primary">${totalExpenseNiloy.toFixed(2)}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Total Expense by Sejuti</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold text-primary">${totalExpenseSejuti.toFixed(2)}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No expenses found for this date.</p>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">Please select a date to view expenses.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

