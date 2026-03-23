import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Settings,
  ChevronRight,
  Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * SidebarItem Component
 * Renders an individual navigation link with active state and hover effects.
 */
const SidebarItem = ({ to, icon: Icon, label, active, collapsed }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-3 mb-1.5 rounded-xl transition-all duration-300 group relative ${
      active 
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={20} className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'} transition-colors flex-shrink-0`} />
    {!collapsed && (
      <motion.span 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="ml-3 text-sm font-semibold whitespace-nowrap"
      >
        {label}
      </motion.span>
    )}
    
    {!collapsed && active && (
      <motion.div 
        layoutId="active-pill"
        className="absolute right-2 w-1.5 h-1.5 bg-sunflower rounded-full shadow-[0_0_8px_rgba(255,199,44,0.8)]"
      />
    )}
  </Link>
);

/**
 * Sidebar Component
 * The main vertical navigation bar.
 */
const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Customers' },
    { to: '/admin/pepiniere-requests', icon: Leaf, label: 'Nursery Approvals' },
    { to: '/admin/products', icon: Package, label: 'Inventory' },
    { to: '/admin/articles', icon: FileText, label: 'Editorial' },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-slate-950 border-r border-white/5 transition-all duration-500 z-50 flex flex-col ${
        collapsed ? 'w-[88px]' : 'w-72'
      }`}
    >
      {/* Sidebar Header: Branding */}
      <div className="h-20 px-6 flex items-center border-b border-white/5 pb-4 mt-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-emerald-600/30">
          <Sun className="text-white" size={22} />
        </div>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-4"
          >
            <h2 className="text-lg font-black text-white tracking-tight leading-none uppercase">
              SunFlower<span className="text-emerald-500">.IO</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] mt-1">MANAGEMENT</p>
          </motion.div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 overflow-y-auto no-scrollbar">
        <div className="mb-6 px-4">
          <p className={`text-[10px] font-black uppercase tracking-widest text-slate-600 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? '•' : 'Main Menu'}
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

      {/* Sidebar Footer: Support & Logout */}
      <div className="p-4 border-t border-white/5 space-y-2">
         {!collapsed && (
          <div className="bg-emerald-900/20 rounded-xl p-4 mb-4 border border-emerald-500/10">
            <p className="text-xs font-bold text-white mb-1 leading-tight">Need Help?</p>
            <p className="text-[10px] text-emerald-400 font-medium leading-relaxed">Access documentation or contact support.</p>
          </div>
        )}
        
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          {!collapsed && <span className="ml-3 text-sm font-bold">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

/**
 * Navbar Component
 * Horizontal bar with search, notification, and profile management.
 */
const Navbar = ({ onToggleSidebar, sidebarCollapsed }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40 transition-all">
      <div className="flex items-center space-x-6">
        <button 
          onClick={onToggleSidebar}
          className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200"
        >
          {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
        
        <div className="relative group hidden lg:block w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search documents, users, or products..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 mr-4">
          <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl relative transition-all">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-1 ring-rose-500/20" />
          </button>
          <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all hidden sm:block">
            <Settings size={20} />
          </button>
        </div>
        
        <div className="h-8 w-px bg-slate-100 mx-2" />
        
        <div className="flex items-center space-x-4 pl-4 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-none">{user?.name || 'Admin User'}</p>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1.5 flex items-center justify-end">
              <span className="w-1 h-1 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
              {user?.role || 'SYSTEM ROOT'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 border-2 border-white ring-1 ring-slate-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-all">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'A'}&background=10b981&color=fff&bold=true&font-size=0.4`} 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

/**
 * Main Layout Container
 */
const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f9fafb] flex font-sans antialiased text-slate-900">
      {/* Sidebar Component */}
      <Sidebar collapsed={sidebarCollapsed} />
      
      {/* Main Panel */}
      <main 
        className={`flex-1 flex flex-col transition-all duration-500 ${
          sidebarCollapsed ? 'ml-[88px]' : 'ml-72'
        }`}
      >
        {/* Navigation Bar */}
        <Navbar 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
          sidebarCollapsed={sidebarCollapsed}
        />
        
        {/* Page Content with dynamic transitions */}
        <motion.div 
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="p-8 sm:p-12 lg:p-16 max-w-[1920px] w-full mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;
