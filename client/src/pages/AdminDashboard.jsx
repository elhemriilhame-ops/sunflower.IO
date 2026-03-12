import { useState } from 'react';
import { Package, Users, ShoppingCart, Plus, Edit, Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');

  const stats = [
    { name: 'Total Products', value: '124', icon: Package, color: 'text-blue-500' },
    { name: 'Total Users', value: '1,240', icon: Users, color: 'text-plant' },
    { name: 'Total Orders', value: '3,500', icon: ShoppingCart, color: 'text-sunflower' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 hidden lg:block">
        <div className="p-8">
          <div className="text-2xl font-bold mb-10">Admin Panel</div>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'products' ? 'bg-plant text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Package className="w-5 h-5" /> Products
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'orders' ? 'bg-plant text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <ShoppingCart className="w-5 h-5" /> Orders
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'users' ? 'bg-plant text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Users className="w-5 h-5" /> Users
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8">
        <header className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 capitalize">{activeTab} Management</h2>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add New {activeTab === 'products' ? 'Product' : activeTab === 'orders' ? 'Order' : 'User'}
          </button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl bg-gray-50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-4xl font-bold">{stat.value}</div>
              </div>
              <div className="text-gray-500 uppercase tracking-widest text-xs font-bold">{stat.name}</div>
            </div>
          ))}
        </div>

        {/* Table Placeholder */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-left">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-bold">Recent {activeTab}</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full focus:ring-1 focus:ring-plant" />
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 font-mono text-xs text-gray-400">#743{i}</td>
                  <td className="px-8 py-6 font-bold text-gray-900">Sample {activeTab.slice(0, -1)} {i}</td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-plant"><Edit className="w-5 h-5" /></button>
                      <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
