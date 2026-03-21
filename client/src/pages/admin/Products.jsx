import { useState, useEffect } from 'react';
import { 
  Trash2, 
  Edit3, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Loader2,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products');
      setProducts(data.data);
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    setDeleteLoading(id);
    try {
      await API.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || 'Error'));
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage and monitor all marketplace products.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all active:scale-[0.98]">
          <Plus size={18} className="mr-2" />
          Add Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/10">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-10 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-none border-slate-200 focus:border-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <button className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black text-slate-500 hover:bg-white hover:text-emerald-600 transition-all flex items-center uppercase tracking-widest">
            <Filter size={12} className="mr-1.5" />
            Filters
          </button>
          <div className="h-6 w-px bg-slate-200 mx-1" />
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 h-80 animate-pulse bg-slate-50/50" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 p-20 flex flex-col items-center justify-center text-center bg-slate-50/50 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-100">
            <ShoppingBag className="text-slate-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Inventory is empty</h3>
          <p className="text-slate-500 mt-2 max-w-sm text-sm font-medium leading-relaxed">Try adjusting your filters or add your first product to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
          <AnimatePresence>
            {filteredProducts.map((p, idx) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img 
                    src={p.image ? (import.meta.env.VITE_SERVER_URL ? `${import.meta.env.VITE_SERVER_URL}${p.image}` : `http://localhost:5000${p.image}`) : 'https://images.unsplash.com/photo-1512423175373-ca40a6b57917?q=80&w=800&auto=format&fit=crop'} 
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">
                    <button className="p-2 bg-white/90 backdrop-blur shadow-xl rounded-lg text-slate-600 hover:text-emerald-600 transition-colors border border-white/20">
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(p._id)}
                      disabled={deleteLoading === p._id}
                      className="p-2 bg-white/90 backdrop-blur shadow-xl rounded-lg text-slate-600 hover:text-rose-600 transition-colors border border-white/20"
                    >
                      {deleteLoading === p._id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 bg-white shadow-sm border border-slate-100 rounded-lg text-xs font-black text-slate-900 leading-none">
                      ${p.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center space-x-1.5">
                    <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.stock} units left</span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight line-clamp-1">{p.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">{p.description}</p>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-slate-50">
                    <div className="flex items-center space-x-1 py-1 rounded-md text-[10px] font-black text-emerald-700 bg-emerald-50/50 border border-emerald-100 px-2 uppercase tracking-tight">
                       {p.pepiniereId?.proprietaryName || 'Sunflowers Ecosystem'}
                    </div>
                    <button className="text-slate-300 hover:text-emerald-600 transition-colors">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
