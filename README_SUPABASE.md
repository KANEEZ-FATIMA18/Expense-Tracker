# Expense Tracker Implementation Summary

This project is a React-based Expense Tracker that uses Supabase for authentication and database services, with Redux Toolkit for state management.

## 🚀 Getting Started

### 1. Supabase Table Setup

To ensure the application works correctly, you need to execute the following SQL in your Supabase SQL Editor:

```sql
-- Create the expenses table
CREATE TABLE expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to view only their own expenses
CREATE POLICY "Users can view their own expenses" 
ON expenses FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Allow users to insert their own expenses
CREATE POLICY "Users can create their own expenses" 
ON expenses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to update their own expenses
CREATE POLICY "Users can update their own expenses" 
ON expenses FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Allow users to delete their own expenses
CREATE POLICY "Users can delete their own expenses" 
ON expenses FOR DELETE 
USING (auth.uid() = user_id);
```

### 2. Configuration (`.env`)

Ensure your `.env` file has the correct Supabase URL and Anon Key:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## 🛠️ Tech Stack Features

- **Authentication**: `AuthForm.jsx` handles both Login and Signup toggling, with state managed via `authSlice.js`.
- **State Management**: Redux Toolkit (Thunks) for all Supabase API interactions.
- **CRUD Operations**:
  - **CREATE**: `addExpense` thunk in `expensesSlice.js`.
  - **READ**: `fetchExpenses` thunk, ordered by `date` (descending) to show latest first.
  - **UPDATE**: `updateExpense` thunk and `ExpenseForm.jsx` (modal).
  - **DELETE**: `deleteExpense` thunk and confirmation dialog.
- **Dynamic Dashboard**: `Dashboard.jsx` calculates total expenses and displays a summary card.
- **Custom UI**: Premium Tailwind CSS design with glassmorphism, smooth gradients, and interactive animations.

## 📁 Key File Structure

- `/src/store/`: Redux slices (`authSlice`, `expensesSlice`) and store configuration.
- `/src/components/`: Modular UI components (`AuthForm`, `Dashboard`, `ExpenseForm`, `ExpenseList`).
- `/src/supabase-config.js`: Supabase client initialization.
- `/src/App.jsx`: Main routing logic (Auth vs Dashboard).
