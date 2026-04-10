import { useDispatch } from 'react-redux';
import { deleteExpense } from '../store/expensesSlice';
import { TrendingUp, TrendingDown, Edit2, Trash2, Receipt } from 'lucide-react';

const ExpenseList = ({ expenses, onEdit }) => {
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteExpense(id));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
          <Receipt className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-base font-semibold mb-2">No transactions yet</h3>
        <p className="text-sm text-gray-500">Add your first transaction to get started</p>
      </div>
    );
  }

  // Group by date
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const dateLabel = formatDate(expense.date);
    if (!acc[dateLabel]) {
      acc[dateLabel] = [];
    }
    acc[dateLabel].push(expense);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedExpenses).map(([dateLabel, dateExpenses]) => (
        <div key={dateLabel}>
          {/* Date Header */}
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-400">{dateLabel}</h4>
            <span className="text-xs text-gray-600">
              {dateExpenses.length} transaction{dateExpenses.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Transactions */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            {dateExpenses.map((expense, idx) => {
              const isIncome = expense.amount > 0;

              return (
                <div
                  key={expense.id}
                  className={`flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-colors ${
                    idx !== dateExpenses.length - 1 ? 'border-b border-zinc-800' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isIncome ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}>
                    {isIncome ? (
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-500" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate text-sm mb-1">
                      {expense.title}
                    </h3>
                    <p className="text-xs text-gray-500">{expense.category}</p>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <div className={`text-sm font-bold tabular-nums mb-1 ${
                      isIncome ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {isIncome ? '+' : '-'}{formatCurrency(Math.abs(expense.amount))}
                    </div>
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-xs text-gray-500 hover:text-green-500 transition-colors"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
