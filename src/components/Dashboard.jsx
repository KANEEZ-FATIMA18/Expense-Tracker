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
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';

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
    toast.success('Signed out successfully');
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
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <div className="w-10 h-10 border-2 border-zinc-800 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/50 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-base tracking-tight">Expense Tracker</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowForm(true)}
              className="h-9 px-4 bg-emerald-500 text-black font-medium text-sm rounded-lg hover:bg-emerald-400 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Add</span>
            </button>
            <button 
              onClick={handleSignOut} 
              className="h-9 w-9 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 md:p-8 animate-fade-in-up">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Total Balance</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{formatCurrency(balance)}</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-zinc-950/50 border border-zinc-800/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs text-zinc-500">Income</span>
                </div>
                <p className="text-lg font-semibold text-emerald-500">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="rounded-xl bg-zinc-950/50 border border-zinc-800/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs text-zinc-500">Expenses</span>
                </div>
                <p className="text-lg font-semibold text-red-500">{formatCurrency(totalExpense)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-xs text-zinc-500">Income Rate</span>
            </div>
            <p className="text-xl font-semibold">{Math.round((totalIncome / totalFlow) * 100)}%</p>
            <div className="w-full h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-1000"
                style={{ width: `${(totalIncome / totalFlow) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-xs text-zinc-500">Expense Rate</span>
            </div>
            <p className="text-xl font-semibold">{Math.round((totalExpense / totalFlow) * 100)}%</p>
            <div className="w-full h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-1000"
                style={{ width: `${(totalExpense / totalFlow) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 p-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-zinc-400" />
              </div>
              <span className="text-xs text-zinc-500">Transactions</span>
            </div>
            <p className="text-xl font-semibold">{expenses.length}</p>
            <p className="text-xs text-zinc-600 mt-1">Total records</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">Transactions</h3>
            {expenses.length > 0 && (
              <span className="text-xs text-zinc-600">{expenses.length} total</span>
            )}
          </div>
          <ExpenseList expenses={expenses} onEdit={handleEdit} />
        </div>
      </main>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseForm}></div>
          <div className="relative z-10 w-full md:max-w-md bg-zinc-900 md:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up border border-zinc-800/50">
            <ExpenseForm expense={editingExpense} onClose={handleCloseForm} userId={user?.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
