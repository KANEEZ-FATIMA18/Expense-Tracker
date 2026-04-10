import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn, signUp, clearError } from '../store/authSlice';
import { Wallet, Eye, EyeOff, Mail, Lock, ArrowRight, TrendingUp } from 'lucide-react';

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

    if (isLogin) {
      dispatch(signIn({ email, password }));
    } else {
      dispatch(signUp({ email, password }));
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      
      {/* ==================== MOBILE/TABLET LAYOUT (< 1024px) ==================== */}
      <div className="w-full lg:hidden flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-in-up">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mb-6">
              <Wallet className="w-7 h-7 text-black" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold mb-2 tracking-tight">Expense Tracker</h1>
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
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg focus:outline-none focus:border-zinc-600 transition-all text-sm placeholder:text-zinc-600"
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
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg focus:outline-none focus:border-zinc-600 transition-all text-sm placeholder:text-zinc-600"
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

      {/* ==================== DESKTOP LAYOUT (>= 1024px) ==================== */}
      <div className="hidden lg:flex w-full">
        {/* Left - Branding */}
        <div className="w-1/2 bg-zinc-900/30 border-r border-zinc-800/50 p-16 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">Expense Tracker</h1>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-zinc-800/50 rounded-lg flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Track Expenses</h3>
                  <p className="text-xs text-zinc-600">Monitor your spending patterns</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-zinc-800/50 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Analytics</h3>
                  <p className="text-xs text-zinc-600">Get detailed insights</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-700">© 2026 Expense Tracker</p>
        </div>

        {/* Right - Form */}
        <div className="w-1/2 flex items-center justify-center p-16">
          <div className="w-full max-w-sm">
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-2 tracking-tight">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-sm text-zinc-600">
                {isLogin ? 'Sign in to continue' : 'Start managing your finances'}
              </p>
            </div>

            <div className="flex bg-zinc-800/50 rounded-lg p-1 mb-8">
              <button
                type="button"
                onClick={() => { setIsLogin(true); dispatch(clearError()); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  isLogin ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); dispatch(clearError()); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  !isLogin ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500'
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2.5 rounded-lg mb-5 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg focus:outline-none focus:border-zinc-600 transition-all text-sm placeholder:text-zinc-600"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg focus:outline-none focus:border-zinc-600 transition-all text-sm placeholder:text-zinc-600"
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
    </div>
  );
};

export default AuthForm;
