import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-8 sm:p-12"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Log in to your SunFlowers account</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-plant"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-plant"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-plant focus:ring-plant" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-plant font-bold hover:underline">Forgot?</a>
          </div>

          <button className="w-full btn-secondary py-4 text-lg shadow-lg shadow-plant/20 flex items-center justify-center gap-3">
            Sign In <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-10">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400 uppercase tracking-widest">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" />
              <span className="font-semibold text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
              <Github className="w-5 h-5" />
              <span className="font-semibold text-gray-700">Github</span>
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-gray-500">
          Don't have an account? <Link to="/register" className="text-plant font-bold hover:underline">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
