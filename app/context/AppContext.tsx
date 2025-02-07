'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type User = {
  username: string;
  password: string;
};

type Expense = {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  type?: 'personal' | 'joint';
};

type AppContextType = {
  user: User | null;
  expenses: Expense[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
    } else {
      setExpenses(data || []);
    }
  };

  const login = async (username: string, password: string) => {
    const users: User[] = [
      { username: 'niloy', password: 'seju' },
      { username: 'sejuti', password: 'nilui' }
    ];

    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([expense])
      .select();

    if (error) {
      console.error('Error adding expense:', error);
    } else if (data) {
      setExpenses([...expenses, data[0]]);
    }
  };

  const updateExpense = async (expense: Expense) => {
    const { error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', expense.id);

    if (error) {
      console.error('Error updating expense:', error);
    } else {
      setExpenses(expenses.map(e => e.id === expense.id ? expense : e));
    }
  };

  return (
    <AppContext.Provider value={{ user, expenses, login, logout, addExpense, updateExpense }}>
      {children}
    </AppContext.Provider>
  );
};

