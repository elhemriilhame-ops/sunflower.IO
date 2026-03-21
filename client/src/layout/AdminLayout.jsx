import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Leaf, 
  Package, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ to, icon: Icon, label, active, collapsed }) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2.5 mb-1.5 rounded-lg transition-all duration-200 group relative ${
      active 
        ? 'bg-emerald-50 text-emerald-700 font-semibold' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon size={20} className={`${active ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors flex-shrink-0`} />
    {!collapsed && (
      <motion.span 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="ml-3 text-sm whitespace-nowrap"
      >
        {label}
      </motion.span>
    )}
    {!collapsed && active && (
      <div className="absolute left-0 w-1 h-6 bg-emerald-600 rounded-r-full" />
    )}
  </Link>
);

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Customers' },
    { to: '/admin/pepiniere-requests', icon: Leaf, label: 'Nursery Approvals' },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/articles', icon: FileText, label: 'Blog Content' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-50 flex flex-col ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <div className="h-16 px-6 flex items-center border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex-shrink-0 flex items-center justify-center shadow-sm">
          <Leaf className="text-white" size={18} />
        </div>
        {!collapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-3 text-lg font-bold text-slate-900 tracking-tight"
          >
            Sunflower<span className="text-emerald-600 font-black">.io</span>
          </motion.span>
        )}
      </div>

      <nav className="flex-1 px-3 py-6">
        <div className="mb-4 px-3">
          <p className={`text-[10px] font-black uppercase tracking-widest text-slate-400 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? 'Main' : 'Management'}
          </p>
        </div>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            {...item}
            active={location.pathname === item.to}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2.5 text-slate-500 hover:bg-white hover:text-rose-600 rounded-lg transition-all duration-200 group"
        >
          <LogOut size={20} className="group-hover:text-rose-600" />
          {!collapsed && <span className="ml-3 text-sm font-medium">Log out</span>}
        </button>
      </div>
    </aside>
  );
};

const Navbar = ({ onToggleSidebar, sidebarCollapsed }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
        >
          {sidebarCollapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
        
        <div className="h-8 w-px bg-slate-200 hidden sm:block mx-2" />
        
        <div className="relative group hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search dashboard..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg relative transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-all hidden sm:block">
          <Settings size={18} />
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2" />
        
        <div className="flex items-center space-x-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{user?.role || 'Full Access'}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center overflow-hidden shadow-sm ring-2 ring-white">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'A'}&background=10b981&color=fff&bold=true`} 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar collapsed={sidebarCollapsed} />
      
      <main 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[72px]' : 'ml-64'
        }`}
      >
        <Navbar 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-10 max-w-[1600px] w-full mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;
