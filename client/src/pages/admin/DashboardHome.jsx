import { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Calendar,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';

/**
 * StatCard Component
 * High-end metric card with trend indicators and sleek shadows.
 */
const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, index }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 group relative overflow-hidden"
  >
    <div className="relative z-10 flex items-center justify-between mb-5">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-lg shadow-current/10 group-hover:scale-110 transition-transform duration-500 text-white`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
        trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
      }`}>
        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{trendValue}</span>
      </div>
    </div>
    
    <div className="relative z-10 space-y-1">
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
    </div>

    {/* Decorative background shape */}
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
  </motion.div>
);

/**
 * MiniChart Component
 * Minimal SVG Area chart using Framer Motion for a senior-dev feel.
 */
const MiniChart = ({ data, color }) => (
  <svg viewBox="0 0 100 30" className="w-full h-32 overflow-visible">
    <motion.path
      d={`M 0 30 ${data.map((d, i) => `L ${(i / (data.length - 1)) * 100} ${30 - d}`).join(' ')} L 100 30 Z`}
      fill={`url(#gradient-${color})`}
      initial={{ opacity: 0, pathLength: 0 }}
      animate={{ opacity: 0.1, pathLength: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    />
    <motion.path
      d={`M 0 ${30 - data[0]} ${data.map((d, i) => `L ${(i / (data.length - 1)) * 100} ${30 - d}`).join(' ')}`}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
    <defs>
      <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
  </svg>
);

const DashboardHome = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 124, // Mocked as orders model doesn't exist yet
    revenue: '$14,285.50' // Mocked revenue
  });
  const [loading, setLoading] = useState(true);

  // High-fidelity Mock Transaction Data
  const recentOrders = [
    { id: '#ORD-9281', customer: 'Alice Johnson', date: '21 Mar 2026', amount: '$145.00', status: 'Completed', color: 'emerald' },
    { id: '#ORD-9275', customer: 'Michael Chen', date: '20 Mar 2026', amount: '$420.50', status: 'Processing', color: 'amber' },
    { id: '#ORD-9264', customer: 'Sarah Miller', date: '20 Mar 2026', amount: '$85.00', status: 'Pending', color: 'slate' },
    { id: '#ORD-9259', customer: 'David Wilson', date: '19 Mar 2026', amount: '$210.00', status: 'Completed', color: 'emerald' },
    { id: '#ORD-9241', customer: 'Emma Thompson', date: '18 Mar 2026', amount: '$1,200.00', status: 'Flagged', color: 'rose' },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          API.get('/admin/users'),
          API.get('/products')
        ]);

        setStats(prev => ({
          ...prev,
          users: usersRes.data.count || 0,
          products: productsRes.data.count || 0,
        }));
      } catch (err) {
        console.error('Core metrics fetch failed. Using fallback defaults.', err);
      } finally {
        setTimeout(() => setLoading(false), 800); // Smooth loading transition
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-44 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/50 to-transparent -translate-x-full animate-shimmer" />
            </div>
          ))}
        </div>
        <div className="h-96 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm opacity-50" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none italic">
            Dashboard <span className="text-emerald-600 font-medium not-italic opacity-50 ml-1">v.2.0</span>
          </h1>
          <p className="text-slate-400 font-bold mt-3 uppercase tracking-[0.2em] text-[11px]">System Analytics & Ecosystem Insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 shadow-sm hover:shadow-md transition-all active:scale-95">
            <Filter size={16} /> Filters
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95">
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          index={0}
          title="Consolidated Revenue" 
          value={stats.revenue} 
          icon={DollarSign} 
          color="bg-emerald-600" 
          trend="up" 
          trendValue="+14.2%"
        />
        <StatCard 
          index={1}
          title="Authorized Clients" 
          value={stats.users} 
          icon={Users} 
          color="bg-slate-900" 
          trend="up" 
          trendValue="+8.1%"
        />
        <StatCard 
          index={2}
          title="Inventory Assets" 
          value={stats.products} 
          icon={Package} 
          color="bg-sunflower shadow-sunflower/20" 
          trend="up" 
          trendValue="+3.4%"
        />
        <StatCard 
          index={3}
          title="Total Transactions" 
          value={stats.orders} 
          icon={ShoppingBag} 
          color="bg-indigo-600" 
          trend="down" 
          trendValue="-1.2%"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Sales Chart Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">Revenue Dynamics</h4>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Global sales performance over 30 days</p>
            </div>
            <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100">
              <button className="px-5 py-1.5 bg-white text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm rounded-lg border border-slate-200">Weekly</button>
              <button className="px-5 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Monthly</button>
            </div>
          </div>

          <div className="mt-4">
             <MiniChart data={[10, 15, 8, 20, 18, 25, 23, 30]} color="#059669" />
          </div>

          <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-50 relative z-10">
            {[ {label: 'Conversion', val: '4.8%'}, {label: 'Avg Order', val: '$240'}, {label: 'Visits', val: '8.2k'}, {label: 'Goal', val: '92%'} ].map((item, i) => (
              <div key={i}>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                <p className="text-lg font-black text-slate-800 mt-1">{item.val}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Status Hub Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-emerald-950 rounded-[2.5rem] p-10 text-white relative flex flex-col justify-between overflow-hidden shadow-2xl shadow-emerald-900/40"
        >
          <div className="relative z-10">
            <div className="w-14 h-14 bg-emerald-800 rounded-2xl flex items-center justify-center mb-10 border border-white/10 shadow-xl">
               <TrendingUp className="text-emerald-400" size={28} />
            </div>
            <h4 className="text-2xl font-black tracking-tight leading-tight">Growth Projection <br/>is Currently <span className="text-emerald-400">Positive</span></h4>
            <p className="text-emerald-100/40 text-sm mt-4 font-medium leading-relaxed">System AI predicts a 12% increase in flower sales next quarter based on humidity trends in local regions.</p>
          </div>

          <div className="mt-20 space-y-3 relative z-10">
            <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95">
              Launch Detailed Scan
            </button>
          </div>

          {/* Decorative Orbs */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-sunflower/10 rounded-full blur-[60px] -translate-x-1/2 translate-y-1/2" />
        </motion.div>
      </div>

      {/* Recent Orders Table */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h4 className="text-xl font-black text-slate-900 tracking-tight">Recent Ecosystem Orders</h4>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest font-mono">Live synchronization active</p>
          </div>
          <button className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Name</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Fulfillment Date</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Value</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Delivery Status</th>
                <th className="px-10 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map((order, i) => (
                <tr key={i} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-10 py-6 text-sm font-black text-slate-400">{order.id}</td>
                  <td className="px-10 py-6">
                    <div className="font-black text-slate-900 text-sm">{order.customer}</div>
                  </td>
                  <td className="px-10 py-6 text-sm font-semibold text-slate-500">{order.date}</td>
                  <td className="px-10 py-6 text-sm font-black text-slate-900">{order.amount}</td>
                  <td className="px-10 py-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 
                      order.status === 'Processing' ? 'bg-amber-50 text-amber-700' :
                      order.status === 'Flagged' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                      {order.status}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-2 text-slate-300 group-hover:text-emerald-600 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-10 bg-slate-50/50 text-center border-t border-slate-50">
          <button className="text-xs font-black text-emerald-700 hover:text-emerald-900 uppercase tracking-widest transition-colors">
            Analyze All System Transactions
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Re-using component for ChevronRight not imported above
const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);

export default DashboardHome;
