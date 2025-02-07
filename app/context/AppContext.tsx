"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let supabase: SupabaseClient

const initSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing")
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

supabase = initSupabase()!

type User = {
  username: string
}

type Expense = {
  id: string
  name: string
  category: string
  date: string
  amount: number
}

type AppContextType = {
  user: User | null
  expenses: Expense[]
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>
  updateExpense: (expense: Expense) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  fetchExpenses: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const fetchExpenses = async () => {
    if (!supabase) {
      console.error("Supabase client is not initialized")
      return
    }

    try {
      const { data, error } = await supabase.from("expenses").select("*").order("date", { ascending: false })

      if (error) {
        console.error("Error fetching expenses:", error.message, error.details)
        return
      }

      setExpenses(data || [])
    } catch (error) {
      console.error("Unexpected error in fetchExpenses:", error)
    }
  }

  const login = async (username: string, password: string) => {
    const users = [
      { username: "niloy", password: "seju" },
      { username: "sejuti", password: "nilui" },
    ]

    const foundUser = users.find((u) => u.username === username && u.password === password)
    if (foundUser) {
      setUser({ username: foundUser.username })
      localStorage.setItem("user", JSON.stringify({ username: foundUser.username }))
      await fetchExpenses()
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    setExpenses([])
  }

  const addExpense = async (expense: Omit<Expense, "id">) => {
    if (!supabase) {
      console.error("Supabase client is not initialized")
      return
    }

    try {
      const { data, error } = await supabase.from("expenses").insert([expense]).select()

      if (error) {
        console.error("Error adding expense:", error.message, error.details)
        return
      }

      if (data) {
        setExpenses([...expenses, data[0]])
      }
    } catch (error) {
      console.error("Unexpected error in addExpense:", error)
    }
  }

  const updateExpense = async (expense: Expense) => {
    if (!supabase) {
      console.error("Supabase client is not initialized")
      return
    }

    try {
      const { error } = await supabase.from("expenses").update(expense).eq("id", expense.id)

      if (error) {
        console.error("Error updating expense:", error.message, error.details)
        return
      }

      setExpenses(expenses.map((e) => (e.id === expense.id ? expense : e)))
    } catch (error) {
      console.error("Unexpected error in updateExpense:", error)
    }
  }

  const deleteExpense = async (id: string) => {
    if (!supabase) {
      console.error("Supabase client is not initialized")
      return
    }

    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id)

      if (error) {
        console.error("Error deleting expense:", error.message, error.details)
        return
      }

      setExpenses(expenses.filter((e) => e.id !== id))
    } catch (error) {
      console.error("Unexpected error in deleteExpense:", error)
    }
  }

  return (
    <AppContext.Provider
      value={{ user, expenses, login, logout, addExpense, updateExpense, deleteExpense, fetchExpenses }}
    >
      {children}
    </AppContext.Provider>
  )
}

