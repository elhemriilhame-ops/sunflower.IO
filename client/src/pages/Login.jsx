import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LogIn, 
  Mail, 
  Lock, 
  AlertCircle, 
  Loader2,
  Leaf,
  ArrowRight,
  Github
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

/**
 * Unified Login Component
 * Handles both public user login and admin secure portal access.
 * @param {boolean} isAdminPage - Directs the theme and role-based validation.
 */
const Login = ({ isAdminPage = false }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default redirect paths
  const from = location.state?.from?.pathname || (isAdminPage ? '/admin' : '/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/auth/login', { email, password });
      
      // Role validation for Admin Portal
      if (isAdminPage && data.user.role !== 'admin') {
        setError('Access Denied: This portal requires administrator privileges.');
        setLoading(false);
        return;
      }

      // Successful login
      login(data.user, data.token);
      
      // Optimized redirect
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 transition-colors duration-500 ${isAdminPage ? 'bg-white' : 'bg-slate-50'}`}>
      <div className="w-full max-w-md">
        {/* Branding Header */}
        <div className="mb-10 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 shadow-md ${isAdminPage ? 'bg-emerald-600' : 'bg-slate-900'}`}
          >
            <Leaf size={28} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {isAdminPage ? 'Admin Portal' : 'Welcome back'}
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {isAdminPage ? 'Sign in to access the ecosystem management' : 'Enter your details to access your account'}
          </p>
        </div>

        {/* Login Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-10"
        >
          {error && (
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-rose-50 text-rose-600 p-4 rounded-xl mb-6 flex items-start space-x-3 border border-rose-100"
            >
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-tighter">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${
                isAdminPage 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' 
                  : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span>{isAdminPage ? 'Enter Registry' : 'Sign In Now'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {!isAdminPage && (
            <div className="mt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400"><span className="px-4 bg-white">Legacy Connect</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-xs font-bold text-slate-600 shadow-sm">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
                  <span>Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-xs font-bold text-slate-600 shadow-sm">
                  <Github className="w-4 h-4" />
                  <span>Github</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-12 text-center">
          {isAdminPage ? (
            <Link to="/login" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest">
              Return to Public Site
            </Link>
          ) : (
            <p className="text-sm text-slate-500 font-medium">
              Don&apos;t have an account? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Create one</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
