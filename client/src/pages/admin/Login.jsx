import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LogIn, 
  Mail, 
  Lock, 
  AlertCircle, 
  Loader2,
  Leaf
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/auth/login', { email, password });
      
      if (data.user.role !== 'admin') {
        setError('Unauthorized: Admin access only.');
        setLoading(false);
        return;
      }

      login(data.user, data.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 sm:p-8">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600 mb-6 shadow-sm">
            <Leaf size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 mt-2">Enter your credentials to access the admin portal</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl mb-6 flex items-start space-x-3 border border-rose-100 animate-in fade-in duration-300">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="input-field pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-saas-primary text-base py-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>Sign in</span>
                  <LogIn size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-400 font-medium">
            SunFlower.IO &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
