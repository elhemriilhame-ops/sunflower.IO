import { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  Leaf, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../../services/api';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
        trend === 'up' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-rose-700 bg-rose-50 border border-rose-100'
      }`}>
        {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        <span>{trendValue}</span>
      </div>
    </div>
    
    <div className="space-y-1">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <div className="flex items-baseline space-x-2">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
    </div>
  </motion.div>
);

const DashboardHome = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    nurseryRequests: 0,
    totalSales: '$4,285.50'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, applicationsRes] = await Promise.all([
          API.get('/admin/users'),
          API.get('/products'),
          API.get('/admin/pepinieres?status=pending')
        ]);

        setStats({
          users: usersRes.data.count || 0,
          products: productsRes.data.count || 0,
          nurseryRequests: applicationsRes.data.count || 0,
          totalSales: '$4,285.50'
        });
      } catch (err) {
        console.error('Error fetching stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/60 shadow-sm h-32 animate-pulse bg-slate-100/50"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time insights and system performance.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-2 text-xs font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all active:scale-[0.98]">Download Report</button>
          <button className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all active:scale-[0.98]">Insights</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          index={0}
          title="Total Customers" 
          value={stats.users} 
          icon={Users} 
          color="bg-emerald-600" 
          trend="up" 
          trendValue="+12.5%"
        />
        <StatCard 
          index={1}
          title="Store Items" 
          value={stats.products} 
          icon={Package} 
          color="bg-blue-600" 
          trend="up" 
          trendValue="+4.2%"
        />
        <StatCard 
          index={2}
          title="Pending Nursery" 
          value={stats.nurseryRequests} 
          icon={Leaf} 
          color="bg-amber-500" 
          trend="down" 
          trendValue="-2.1%"
        />
        <StatCard 
          index={3}
          title="Monthly Revenue" 
          value={stats.totalSales} 
          icon={TrendingUp} 
          color="bg-indigo-600" 
          trend="up" 
          trendValue="+18.7%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h4 className="font-bold text-slate-900">Recent System Activity</h4>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="p-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Nursery Application Received</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium italic">&quot;Green Valley&quot; submitted credentials for verification.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 group-hover:text-slate-500 transition-colors uppercase tracking-wider">2m ago</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50/50 text-center rounded-b-xl">
            <Link to="#" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center justify-center">
              View Audit Logs <ExternalLink size={12} className="ml-1.5" />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-emerald-900 rounded-xl border-none relative overflow-hidden"
        >
          <div className="p-8 relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20">
                <Leaf className="text-emerald-300" size={24} />
              </div>
              <h4 className="text-xl font-bold text-white tracking-tight leading-tight">System Infrastructure is Healthy</h4>
              <p className="text-emerald-100/70 text-sm mt-3 leading-relaxed font-medium">All services are currently operational. No active downtime reports found for the local cluster.</p>
            </div>
            
            <div className="mt-10 space-y-3">
              <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <span className="text-xs font-bold text-emerald-50 text-white/90">API Gateway</span>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <span className="text-xs font-bold text-emerald-50 text-white/90">Main Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Stable</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
