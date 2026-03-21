import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Phone, 
  FileText, 
  ExternalLink,
  Loader2,
  Clock,
  User,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';

const NurseryRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/pepinieres?status=pending');
      setRequests(data.data);
    } catch (err) {
      console.error('Error fetching nursery requests', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setProcessing(id);
    try {
      await API.patch(`/admin/pepinieres/${id}/${action}`);
      setRequests(requests.filter(req => req._id !== id));
    } catch (err) {
      alert(`${action} failed: ` + (err.response?.data?.message || 'Error'));
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        {[1, 2].map(i => (
          <div key={i} className="admin-card h-80 animate-pulse bg-slate-50 border-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Nursery Approvals</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Verify and approve new partners joining the ecosystem.</p>
        </div>
        <div className="px-3 py-1.5 bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm shadow-amber-50">
          {requests.length} Pending Verification
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 p-20 flex flex-col items-center justify-center text-center bg-slate-50/50 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-100">
            <CheckCircle className="text-emerald-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Queue is empty</h3>
          <p className="text-slate-500 mt-2 max-w-sm text-sm font-medium leading-relaxed">All nursery applications have been processed. Great job!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnimatePresence>
            {requests.map((req, idx) => (
              <motion.div 
                key={req._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col transition-all group"
              >
                <div className="p-6 pb-0">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200 ring-4 ring-slate-50">
                        <User size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">{req.proprietaryName}</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">{req.email}</p>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">
                        <MapPin size={10} className="mr-1 text-emerald-600" /> Location
                      </p>
                      <p className="text-xs font-bold text-slate-700 truncate">{req.location}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">
                        <Phone size={10} className="mr-1 text-emerald-600" /> Contact
                      </p>
                      <p className="text-xs font-bold text-slate-700">{req.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                      <FileText size={12} className="mr-2 text-emerald-600" />
                      Legal Documentation ({req.certificates?.length || 0})
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {req.certificates && req.certificates.map((cert, idx) => (
                        <a 
                          key={idx}
                          href={import.meta.env.VITE_SERVER_URL ? `${import.meta.env.VITE_SERVER_URL}${cert}` : `http://localhost:5000${cert}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all group/cert text-xs font-bold text-slate-600 hover:text-emerald-700 shadow-sm"
                        >
                          <span>Cert_{idx + 1}.pdf</span>
                          <ExternalLink size={12} className="opacity-40 group-hover/cert:opacity-100 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 py-4 border-t border-slate-50 text-slate-500">
                    <p className="text-[10px] font-bold uppercase tracking-wider flex items-center">
                      <Clock size={12} className="mr-1.5 text-slate-400" /> Received 2 hours ago
                    </p>
                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                    <p className="text-[10px] font-bold uppercase tracking-wider flex items-center">
                      Submitted by <span className="text-slate-900 ml-1 truncate max-w-[100px]">{req.userId?.name || 'Partner Account'}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-auto p-4 bg-slate-50/80 group-hover:bg-slate-50 border-t border-slate-100 transition-colors flex items-center space-x-3">
                  <button 
                    onClick={() => handleAction(req._id, 'approve')}
                    disabled={processing === req._id}
                    className="flex-1 btn-saas-primary py-2.5"
                  >
                    {processing === req._id ? <Loader2 className="animate-spin" size={18} /> : (
                      <>
                        <CheckCircle size={18} className="mr-2" />
                        <span>Approve Application</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => handleAction(req._id, 'reject')}
                    disabled={processing === req._id}
                    className="btn-saas-secondary py-2.5 px-4 text-rose-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200"
                  >
                    {processing === req._id ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="admin-card bg-slate-950 border-none relative overflow-hidden group p-10">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl transition-transform duration-700 group-hover:rotate-12">
               <FileText size={32} className="text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white tracking-tight leading-tight">Review Security Protocols</h4>
              <p className="text-slate-400 text-sm mt-2 max-w-md font-medium leading-relaxed">All nursery partners must provide clear, legible PDFs of their state nursery licenses. Review the full criteria before final approval.</p>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-white text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-300 transition-colors shrink-0 shadow-xl ring-4 ring-white/10">
            View Policy Documentation
          </button>
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50 transition-opacity duration-1000 group-hover:opacity-100" />
      </div>
    </div>
  );
};

export default NurseryRequests;
