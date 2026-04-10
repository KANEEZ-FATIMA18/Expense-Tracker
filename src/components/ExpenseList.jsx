import { useDispatch } from 'react-redux';
import { deleteExpense } from '../store/expensesSlice';
import { TrendingUp, TrendingDown, Edit3, Trash2, Receipt } from 'lucide-react';

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
        day: 'numeric'
      });
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-dashed border-zinc-800 rounded-xl">
        <div className="w-12 h-12 bg-zinc-800/50 rounded-xl flex items-center justify-center mb-4">
          <Receipt className="w-6 h-6 text-zinc-600" />
        </div>
        <h3 className="text-sm font-medium mb-1">No transactions yet</h3>
        <p className="text-xs text-zinc-600">Add your first transaction to get started</p>
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
            <h4 className="text-xs font-medium text-zinc-600 uppercase tracking-wide">{dateLabel}</h4>
            <span className="text-xs text-zinc-700">
              {dateExpenses.length}
            </span>
          </div>

          {/* Transactions */}
          <div className="rounded-xl border border-zinc-800/50 overflow-hidden divide-y divide-zinc-800/50">
            {dateExpenses.map((expense) => {
              const isIncome = expense.amount > 0;

              return (
                <div
                  key={expense.id}
                  className="flex items-center gap-3 p-3.5 hover:bg-zinc-800/20 transition-colors group"
                >
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isIncome ? 'bg-emerald-500/10' : 'bg-red-500/10'
                  }`}>
                    {isIncome ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate text-sm mb-0.5">
                      {expense.title}
                    </h3>
                    <p className="text-xs text-zinc-600">{expense.category}</p>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <div className={`text-sm font-semibold tabular-nums ${
                      isIncome ? 'text-emerald-500' : 'text-zinc-300'
                    }`}>
                      {isIncome ? '+' : '-'}{formatCurrency(Math.abs(expense.amount))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="p-1.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
