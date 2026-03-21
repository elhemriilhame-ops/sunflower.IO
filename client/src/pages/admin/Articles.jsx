import { useState, useEffect } from 'react';
import { 
  FileText, 
  Trash2,
  Edit3, 
  Search, 
  Calendar, 
  User, 
  ArrowRight,
  Loader2,
  FilePlus,
  X,
  PlusCircle,
  ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';

const ArticlesManagement = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [imageFile, setImageFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/articles');
      setArticles(data.data);
    } catch (err) {
      console.error('Error fetching articles', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (article = null) => {
    if (article) {
      setEditingArticle(article);
      setFormData({ title: article.title, content: article.content });
    } else {
      setEditingArticle(null);
      setFormData({ title: '', content: '' });
    }
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingArticle) {
        await API.put(`/articles/${editingArticle._id}`, data);
      } else {
        await API.post('/articles', data);
      }
      fetchArticles();
      setShowModal(false);
    } catch (err) {
      alert('Operation failed: ' + (err.response?.data?.message || 'Error'));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article permanently?')) return;
    try {
      await API.delete(`/articles/${id}`);
      setArticles(articles.filter(a => a._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Blog Content</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage your educational articles and news updates.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-saas-primary"
        >
          <FilePlus size={18} className="mr-2" />
          Create Post
        </button>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16} />
        <input
          type="text"
          placeholder="Filter articles..."
          className="input-field pl-10 h-10 text-sm shadow-none border-slate-200 focus:border-emerald-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2].map(i => (
            <div key={i} className="admin-card h-32 animate-pulse bg-slate-50 border-slate-100" />
          ))
        ) : filteredArticles.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 p-20 flex flex-col items-center justify-center text-center bg-slate-50/50 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-100">
              <FileText className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No articles found</h3>
            <p className="text-slate-500 mt-2 max-w-sm text-sm font-medium leading-relaxed">The archive is currently empty or matches no filters.</p>
          </div>
        ) : filteredArticles.map((article, idx) => (
          <motion.div 
            key={article._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col sm:flex-row items-center gap-6 group hover:border-emerald-200"
          >
            <div className="w-full sm:w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200 shadow-sm">
              <img 
                src={article.image ? (import.meta.env.VITE_SERVER_URL ? `${import.meta.env.VITE_SERVER_URL}${article.image}` : `http://localhost:5000${article.image}`) : 'https://images.unsplash.com/photo-1545231027-63b6f0a3e267?q=80&w=400&auto=format&fit=crop'} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt={article.title}
              />
            </div>
            <div className="flex-1 space-y-1.5 overflow-hidden">
              <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className="flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {new Date(article.createdAt).toLocaleDateString()}
                </span>
                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="flex items-center text-emerald-600">
                  <User size={12} className="mr-1" />
                  {article.author?.name || 'Admin'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-1">{article.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{article.content}</p>
            </div>
            <div className="flex sm:flex-col gap-2">
              <button 
                onClick={() => handleOpenModal(article)}
                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(article._id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingArticle ? 'Edit Article' : 'New Publication'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Fill in the details for your blog post.</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto overflow-x-hidden">
                <form id="article-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                      <PlusCircle size={12} className="mr-2 text-emerald-500" />
                      Headline
                    </label>
                    <input 
                      type="text" 
                      className="input-field font-bold text-lg text-slate-800 placeholder:text-slate-300"
                      placeholder="Enter a compelling title..."
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                      <ImageIcon size={12} className="mr-2 text-emerald-500" />
                      Header Image
                    </label>
                    <div className="relative group rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 p-8 flex flex-col items-center justify-center transition-all cursor-pointer">
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => setImageFile(e.target.files[0])}
                      />
                      <div className="text-center">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md border border-slate-100 text-emerald-600 group-hover:scale-110 transition-transform">
                          <ImageIcon size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-700">
                          {imageFile ? imageFile.name : 'Upload cover photo'}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center">
                      <FileText size={12} className="mr-2 text-emerald-500" />
                      Content Story
                    </label>
                    <textarea 
                      rows="8"
                      className="input-field min-h-[200px] py-4 leading-relaxed font-medium text-slate-600 placeholder:text-slate-300 resize-none"
                      placeholder="Share your botanical knowledge..."
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      required
                    />
                  </div>
                </form>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-saas-secondary py-2"
                >
                  Cancel
                </button>
                <button 
                  form="article-form"
                  type="submit" 
                  disabled={formLoading}
                  className="btn-saas-primary py-2 px-8"
                >
                  {formLoading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <span>{editingArticle ? 'Save Changes' : 'Publish Post'}</span>
                      <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArticlesManagement;
