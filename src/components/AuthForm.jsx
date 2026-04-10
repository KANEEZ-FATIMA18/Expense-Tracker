import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signUp, clearError } from '../store/authSlice';
import { Wallet, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());

    const action = isLogin ? signIn({ email, password }) : signUp({ email, password });
    
    dispatch(action).then((result) => {
      if (result.type.endsWith('/fulfilled')) {
        toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      } else {
        toast.error(result.payload || 'Something went wrong');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500 rounded-xl mb-6">
            <Wallet className="w-7 h-7 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Expense Tracker</h1>
          <p className="text-sm text-zinc-600">Manage your finances</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
          {/* Toggle */}
          <div className="flex bg-zinc-800/50 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); dispatch(clearError()); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                isLogin
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'text-zinc-500'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); dispatch(clearError()); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                !isLogin
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'text-zinc-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2.5 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg focus:outline-none focus:border-zinc-600 transition-all text-sm placeholder:text-zinc-600 text-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg focus:outline-none focus:border-zinc-600 transition-all text-sm placeholder:text-zinc-600 text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-500 text-black font-medium text-sm rounded-lg hover:bg-emerald-400 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
