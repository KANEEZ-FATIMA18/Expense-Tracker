import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, updateExpense, clearError, clearSuccessMessage } from '../store/expensesSlice';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Check,
  Tag,
  Calendar,
  DollarSign
} from 'lucide-react';

const ExpenseForm = ({ expense, onClose, userId }) => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.expenses);

  const getInitialFormData = () => {
    if (expense) {
      return {
        title: expense.title,
        amount: Math.abs(expense.amount).toString(),
        category: expense.category,
        date: expense.date,
        type: expense.amount > 0 ? 'income' : 'expense',
      };
    }
    return {
      title: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);
  const [validationErrors, setValidationErrors] = useState({});

  const { title, amount, category, date, type } = formData;

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccessMessage());
  }, [dispatch]);

  const updateFormField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!title.trim()) {
      errors.title = 'Title is required';
    } else if (title.trim().length < 2) {
      errors.title = 'Title must be at least 2 characters';
    }

    const parsedAmount = parseFloat(amount);
    if (!amount) {
      errors.amount = 'Amount is required';
    } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    } else if (parsedAmount > 999999999) {
      errors.amount = 'Amount is too large';
    }

    if (!category) {
      errors.category = 'Category is required';
    }

    if (!date) {
      errors.date = 'Date is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const parsedAmount = parseFloat(amount);
    const expenseData = {
      title: title.trim(),
      amount: type === 'expense' ? -Math.abs(parsedAmount) : Math.abs(parsedAmount),
      category,
      date,
      user_id: userId,
    };

    try {
      if (expense) {
        await dispatch(updateExpense({ id: expense.id, ...expenseData })).unwrap();
      } else {
        await dispatch(addExpense(expenseData)).unwrap();
      }
      onClose();
    } catch (err) {
      console.error('Error saving transaction:', err);
    }
  };

  const categories = [
    'Food', 'Transport', 'Shopping', 'Entertainment', 
    'Bills', 'Healthcare', 'Education', 'Other'
  ];

  return (
    <div className="p-5 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">
          {expense ? 'Edit Transaction' : 'New Transaction'}
        </h2>
        <button
          onClick={onClose}
          className="h-8 w-8 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2.5 rounded-lg mb-5 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-800/50 rounded-lg">
          <button
            type="button"
            onClick={() => updateFormField('type', 'income')}
            className={`py-2.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
              type === 'income'
                ? 'bg-emerald-500 text-black'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Income
          </button>
          <button
            type="button"
            onClick={() => updateFormField('type', 'expense')}
            className={`py-2.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
              type === 'expense'
                ? 'bg-red-500 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            Expense
          </button>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
            Title
          </label>
          <div className="relative">
            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="text"
              value={title}
              onChange={(e) => updateFormField('title', e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 bg-zinc-800/50 border rounded-lg focus:outline-none transition-all text-sm placeholder:text-zinc-600 ${
                validationErrors.title
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-zinc-700/50 focus:border-zinc-600'
              }`}
              placeholder="Transaction title"
            />
          </div>
          {validationErrors.title && (
            <p className="text-red-500 text-xs mt-1.5">{validationErrors.title}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
            Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="number"
              value={amount}
              onChange={(e) => updateFormField('amount', e.target.value)}
              min="0.01"
              step="0.01"
              className={`w-full pl-10 pr-4 py-2.5 bg-zinc-800/50 border rounded-lg focus:outline-none transition-all text-sm font-medium placeholder:text-zinc-600 ${
                validationErrors.amount
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-zinc-700/50 focus:border-zinc-600'
              }`}
              placeholder="0.00"
            />
          </div>
          {validationErrors.amount && (
            <p className="text-red-500 text-xs mt-1.5">{validationErrors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
            Category
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => updateFormField('category', cat)}
                className={`py-2 px-2 text-xs font-medium rounded-lg transition-all ${
                  category === cat
                    ? 'bg-emerald-500 text-black'
                    : 'bg-zinc-800/50 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {validationErrors.category && (
            <p className="text-red-500 text-xs mt-1.5">{validationErrors.category}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              type="date"
              value={date}
              onChange={(e) => updateFormField('date', e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 bg-zinc-800/50 border rounded-lg focus:outline-none transition-all text-sm ${
                validationErrors.date
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-zinc-700/50 focus:border-zinc-600'
              }`}
            />
          </div>
          {validationErrors.date && (
            <p className="text-red-500 text-xs mt-1.5">{validationErrors.date}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2 mt-6 ${
            type === 'income'
              ? 'bg-emerald-500 text-black hover:bg-emerald-400'
              : 'bg-red-500 text-white hover:bg-red-400'
          } active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Check className="w-4 h-4" />
              {expense ? 'Update' : 'Save'} {type === 'income' ? 'Income' : 'Expense'}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
