import { useState, useEffect, useCallback } from 'react';
import { 
  Trash2, 
  Search, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  UserPlus,
  Shield,
  BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const url = roleFilter === 'all' ? '/admin/users' : `/admin/users?role=${roleFilter}`;
      const { data } = await API.get(url);
      setUsers(data.data);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user account permanently?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || 'Error'));
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await API.patch(`/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.message || 'Error'));
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage your platform members and their permissions.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all active:scale-[0.98]">
          <UserPlus size={18} className="mr-2" />
          Add Customer
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="input-field pl-10 h-10 text-sm shadow-none border-slate-200 focus:border-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Filter size={14} className="text-slate-400" />
            <select 
              className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-600 outline-none cursor-pointer"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="pepiniere_owner">Nursery Owner</option>
              <option value="admin">Admin</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="4" className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-sm font-medium text-slate-400 italic">No customers found matching your criteria.</td>
                  </tr>
                ) : filteredUsers.map((user, idx) => (
                  <motion.tr 
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm shadow-sm flex-shrink-0">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff&bold=true&size=64`} 
                            alt={user.name} 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight flex items-center">
                            {user.name}
                            {user.role === 'admin' && <Shield size={12} className="ml-1.5 text-indigo-500" />}
                            {user.role === 'pepiniere_owner' && <BadgeCheck size={12} className="ml-1.5 text-emerald-500" />}
                          </p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="text-xs font-bold text-slate-600">Active</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border font-sans outline-none cursor-pointer transition-all ${
                          user.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:border-indigo-300' :
                          user.role === 'pepiniere_owner' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-300' :
                          'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                        value={user.role}
                        onChange={(e) => handleChangeRole(user._id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="pepiniere_owner">Nursery</option>
                        <option value="delivery">Delivery</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {filteredUsers.length} Results
          </p>
          <div className="flex items-center space-x-2">
            <button className="p-1.5 border border-slate-200 rounded-md text-slate-400 hover:bg-white hover:text-emerald-600 disabled:opacity-30 transition-all">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center space-x-1">
              <button className="w-8 h-8 bg-white border border-emerald-500 text-emerald-700 rounded-md text-xs font-black shadow-sm ring-1 ring-emerald-500/10">1</button>
              <button className="w-8 h-8 text-slate-500 hover:bg-white rounded-md text-xs font-bold">2</button>
            </div>
            <button className="p-1.5 border border-slate-200 rounded-md text-slate-400 hover:bg-white hover:text-emerald-600 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
