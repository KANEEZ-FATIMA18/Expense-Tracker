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
    <div className="p-6">
      {/* Handle - Mobile */}
      <div className="flex justify-center mb-6 md:hidden">
        <div className="w-12 h-1.5 bg-zinc-700 rounded-full"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          {expense ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormField('type', 'income')}
              className={`py-3 px-4 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                type === 'income'
                  ? 'bg-green-500 text-black'
                  : 'bg-zinc-800 text-gray-500 hover:bg-zinc-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Income
            </button>
            <button
              type="button"
              onClick={() => updateFormField('type', 'expense')}
              className={`py-3 px-4 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                type === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-zinc-800 text-gray-500 hover:bg-zinc-700'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              Expense
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Title
          </label>
          <div className="relative">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={title}
              onChange={(e) => updateFormField('title', e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 bg-black border rounded-xl focus:outline-none transition-all text-white text-sm placeholder:text-gray-600 ${
                validationErrors.title
                  ? 'border-red-500'
                  : 'border-zinc-800 focus:border-green-500'
              }`}
              placeholder="Transaction title"
            />
          </div>
          {validationErrors.title && (
            <p className="text-red-500 text-xs mt-2">{validationErrors.title}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="number"
              value={amount}
              onChange={(e) => updateFormField('amount', e.target.value)}
              min="0.01"
              step="0.01"
              className={`w-full pl-12 pr-4 py-3.5 bg-black border rounded-xl focus:outline-none transition-all text-white text-xl font-bold placeholder:text-gray-600 ${
                validationErrors.amount
                  ? 'border-red-500'
                  : 'border-zinc-800 focus:border-green-500'
              }`}
              placeholder="0.00"
            />
          </div>
          {validationErrors.amount && (
            <p className="text-red-500 text-xs mt-2">{validationErrors.amount}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Category
          </label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => updateFormField('category', cat)}
                className={`py-3 px-2 text-xs font-semibold rounded-xl transition-all ${
                  category === cat
                    ? 'bg-green-500 text-black'
                    : 'bg-zinc-800 text-gray-500 hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {validationErrors.category && (
            <p className="text-red-500 text-xs mt-2">{validationErrors.category}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={date}
              onChange={(e) => updateFormField('date', e.target.value)}
              className={`w-full pl-12 pr-4 py-3.5 bg-black border rounded-xl focus:outline-none transition-all text-white text-sm ${
                validationErrors.date
                  ? 'border-red-500'
                  : 'border-zinc-800 focus:border-green-500'
              }`}
            />
          </div>
          {validationErrors.date && (
            <p className="text-red-500 text-xs mt-2">{validationErrors.date}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 mt-6 ${
            type === 'income'
              ? 'bg-green-500 text-black hover:bg-green-400'
              : 'bg-red-500 text-white hover:bg-red-400'
          } active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Check className="w-5 h-5" />
              {expense ? 'Update' : 'Save'} {type === 'income' ? 'Income' : 'Expense'}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
