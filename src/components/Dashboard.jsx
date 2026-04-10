import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOut, checkAuth } from '../store/authSlice';
import { fetchExpenses, clearError } from '../store/expensesSlice';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  LogOut
} from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { expenses } = useSelector((state) => state.expenses);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchExpenses(user.id));
    }
  }, [dispatch, user]);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExpense(null);
    dispatch(clearError());
  };

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate metrics
  const totalIncome = expenses.filter(e => e.amount > 0).reduce((s, e) => s + Math.abs(e.amount), 0);
  const totalExpense = expenses.filter(e => e.amount <= 0).reduce((s, e) => s + Math.abs(e.amount), 0);
  const balance = totalIncome - totalExpense;
  const totalFlow = totalIncome + totalExpense || 1;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-zinc-800 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Expense Tracker</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Manage your finances</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2.5 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 active:scale-95 transition-all flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
            <button 
              onClick={handleSignOut} 
              className="p-2.5 text-gray-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* Balance Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Total Balance</p>
              <h2 className="text-3xl md:text-4xl font-bold">{formatCurrency(balance)}</h2>
            </div>
            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center hidden sm:flex">
              <Wallet className="w-7 h-7 text-green-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-xs text-gray-500">Income</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</p>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-1000"
                  style={{ width: `${(totalIncome / totalFlow) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-black rounded-xl p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-xs text-gray-500">Expenses</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-red-500">{formatCurrency(totalExpense)}</p>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-1000"
                  style={{ width: `${(totalExpense / totalFlow) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Mobile */}
        <div className="grid grid-cols-2 gap-3 md:hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={() => setShowForm(true)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-green-500/50 transition-colors"
          >
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-sm font-medium">Add Income</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-red-500/50 transition-colors"
          >
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-sm font-medium">Add Expense</span>
          </button>
        </div>

        {/* Transactions */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg md:text-xl font-semibold">Recent Transactions</h3>
            <span className="text-sm text-gray-500">{expenses.length} total</span>
          </div>
          <ExpenseList expenses={expenses} onEdit={handleEdit} />
        </div>
      </main>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCloseForm}></div>
          <div className="relative z-10 w-full md:max-w-lg bg-zinc-900 md:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <ExpenseForm expense={editingExpense} onClose={handleCloseForm} userId={user?.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
