import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, History, ShieldCheck, LogOut, Calendar, TrendingUp, Users, ArrowRight, Trash2, Lock, 
  CheckCircle, AlertCircle, AlertTriangle 
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = 'https://lillhacqwjhrqklmtjtz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpbGxoYWNxd2pocnFrbG10anR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNTM5NjMsImV4cCI6MjA4MjgyOTk2M30.9CbTK64YnIPH53T3n2zolJFJDa-A18qg7yp6UORiCi4';

let supabase = null;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
  console.warn("Supabase client belum diinisialisasi dengan benar atau package hilang.", error);
}

// --- UTILS ---
const formatIDR = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getLocalDateString = (dateObj = new Date()) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isDateWeekend = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 6 || day === 0;
};

// --- STYLES & ANIMATION ---
const customStyles = `
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  .animate-enter { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .animate-enter-delay-1 { opacity: 0; animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; }
  .animate-enter-delay-2 { opacity: 0; animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; }
  .animate-slide-in { animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .animate-scale-up { animation: scaleIn 0.3s ease-out forwards; }
  .btn-hover-effect { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
  .btn-hover-effect:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); }
  .btn-hover-effect:active { transform: translateY(0) scale(0.98); }
  .glass-panel { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
`;

// --- UI COMPONENTS ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-enter border ${type === 'success' ? 'bg-zinc-900 text-white border-zinc-700' : 'bg-red-600 text-white border-red-500'}`}>
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-md transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform animate-scale-up border border-zinc-100">
        <div className="flex items-center justify-center w-12 h-12 bg-red-50 text-red-600 rounded-full mb-4 mx-auto animate-pulse">
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-lg font-bold text-center text-zinc-900 mb-2">{title}</h3>
        <p className="text-center text-zinc-500 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-colors text-sm">Batal</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-red-200">Ya, Hapus</button>
        </div>
      </div>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose, onConfirm, targetView }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => { if (isOpen) { setInput(''); setError(false); } }, [isOpen]);
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onConfirm(targetView, input)) {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform animate-scale-up border border-zinc-100">
        <div className="flex items-center justify-center w-12 h-12 bg-zinc-100 text-black rounded-full mb-4 mx-auto"><Lock size={24} /></div>
        <h3 className="text-lg font-bold text-center text-zinc-900 mb-1">{targetView === 'cashier' ? 'Login Kasir' : 'Login Pengawas'}</h3>
        <p className="text-center text-zinc-500 text-xs mb-6">Masukkan kata sandi untuk melanjutkan</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input type="password" value={input} onChange={(e) => { setInput(e.target.value); setError(false); }} placeholder="Password..." className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500 bg-red-50' : 'border-zinc-200 bg-zinc-50'} focus:outline-none focus:ring-1 text-center font-bold text-zinc-900 transition-all`} autoFocus />
            {error && <p className="text-red-500 text-xs text-center mt-2 font-medium animate-enter">Password salah.</p>}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition-colors text-sm">Batal</button>
            <button type="submit" className="flex-1 px-4 py-3 bg-black hover:bg-zinc-800 text-white font-bold rounded-xl transition-all text-sm shadow-lg">Masuk</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [view, setView] = useState('login'); 
  const [transactions, setTransactions] = useState([]);
  const [monitorDate, setMonitorDate] = useState(getLocalDateString());
  const [user, setUser] = useState(null); 
  
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, id: null });
  const [authModal, setAuthModal] = useState({ isOpen: false, targetView: null });

  // Inject Styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
    return () => { document.head.removeChild(styleSheet); };
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Auth & Data Sync
  useEffect(() => {
    if (!supabase) return;

    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('numericId', { ascending: false });
        
        if (error) {
          console.error("Error fetch:", error);
          // Fallback jika tabel belum ada atau RLS memblokir
        } else {
          setTransactions(data || []);
        }
      } catch (err) {
        console.error("Supabase error:", err);
      }
    };

    // Check Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session ? session.user : { role: 'anon_guest' }); 
    });

    fetchTransactions();

    // Realtime
    const channel = supabase
      .channel('realtime:transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchTransactions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auth Logic
  const handleAuthRequest = (target) => {
    setAuthModal({ isOpen: true, targetView: target });
  };

  const handleAuthVerify = (target, password) => {
    if (target === 'cashier' && password === 'bahagiaterus') {
      setView('cashier');
      setAuthModal({ isOpen: false, targetView: null });
      showToast('Akses Kasir Diberikan', 'success');
      return true;
    }
    if (target === 'monitor' && password === 'kolambahagia') {
      setView('monitor');
      setAuthModal({ isOpen: false, targetView: null });
      showToast('Akses Pengawas Diberikan', 'success');
      return true;
    }
    return false;
  };

  // Transaction Logic
  const handleAddVisitor = async () => {
    const now = new Date();
    const dateKey = getLocalDateString(now);
    const isWeekendNow = isDateWeekend(dateKey);
    const timestampId = Date.now();
    const newTransaction = {
      numericId: timestampId,
      timestamp: now.toISOString(),
      dateKey: dateKey,
      timeString: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      price: isWeekendNow ? 12000 : 10000,
      type: 'ENTRY'
    };

    // Optimistic UI Update (Agar terasa instan)
    setTransactions(prev => [newTransaction, ...prev]);

    if (supabase) {
      try {
        const { error } = await supabase.from('transactions').insert([newTransaction]);
        if (error) throw error;
        showToast(`Tiket Masuk: ${formatIDR(newTransaction.price)}`, 'success');
      } catch (error) {
        console.error("Error adding:", error);
        showToast("Gagal simpan ke cloud (Mode Offline)", 'error');
        // Rollback state jika perlu, tapi untuk UX kasir kita biarkan di layar
      }
    } else {
       showToast(`Tiket Masuk: ${formatIDR(newTransaction.price)} (Lokal)`, 'success');
    }
  };

  const initiateDelete = (id) => {
    setModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (modal.id) {
      // Optimistic UI
      setTransactions(prev => prev.filter(t => t.id !== modal.id && t.numericId !== modal.id)); // Handle both ID types
      setModal({ isOpen: false, id: null });
      showToast("Data dihapus", 'error');

      if (supabase) {
        try {
          const { error } = await supabase.from('transactions').delete().eq('id', modal.id); // Asumsi id adalah primary key supabase
          if (error) {
             // Coba delete by numericId jika id standar kosong (untuk data lokal)
             await supabase.from('transactions').delete().eq('numericId', modal.id);
          }
        } catch (error) {
          console.error("Error deleting:", error);
        }
      }
    }
  };

  // --- VIEWS ---

  const LoginView = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-zinc-900 font-sans selection:bg-black selection:text-white">
      <div className="max-w-md w-full space-y-12 animate-enter">
        <div className="space-y-2 border-l-4 border-black pl-6">
          <h1 className="text-4xl font-light tracking-tight text-black">KOLAM RENANG <span className="font-bold">BAHAGIA</span></h1>
        </div>

        <div className="grid gap-4 animate-enter-delay-1">
          <button onClick={() => handleAuthRequest('cashier')} className="group btn-hover-effect flex items-center justify-between w-full p-6 bg-white border-2 border-zinc-100 hover:border-black transition-all rounded-xl">
            <div className="text-left">
              <span className="block text-black font-bold text-lg group-hover:translate-x-1 transition-transform">Kasir</span>
              <span className="text-zinc-500 text-xs mt-1 group-hover:text-black transition-colors font-medium">INPUT TIKET & PENGUNJUNG</span>
            </div>
            <ArrowRight className="text-zinc-300 group-hover:text-black transition-colors transform group-hover:translate-x-1" size={24} />
          </button>

          <button onClick={() => handleAuthRequest('monitor')} className="group btn-hover-effect flex items-center justify-between w-full p-6 bg-zinc-50 border-2 border-zinc-100 hover:border-zinc-400 hover:bg-zinc-100 transition-all rounded-xl">
             <div className="text-left">
              <span className="block text-zinc-800 font-bold text-lg group-hover:translate-x-1 transition-transform">Dashboard Pengawas</span>
              <span className="text-zinc-500 text-xs mt-1 font-medium">LAPORAN & DATA HARIAN</span>
            </div>
            <ShieldCheck className="text-zinc-300 group-hover:text-zinc-600 transition-colors" size={24} />
          </button>
        </div>
        
        <div className="text-center text-[10px] text-zinc-400 pt-10 uppercase tracking-widest font-bold animate-enter-delay-2">
          Aman . Supabase Database . Real-time
        </div>
      </div>
    </div>
  );

  const CashierView = () => {
    const todayKey = getLocalDateString();
    const todayTransactions = transactions.filter(t => t.dateKey === todayKey);
    const todayCount = todayTransactions.length;
    const isWknd = isDateWeekend(todayKey);
    const currentPrice = isWknd ? 12000 : 10000;

    return (
      <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col md:flex-row selection:bg-zinc-200">
        <div className="flex-1 p-6 md:p-12 flex flex-col justify-between relative border-r border-zinc-100 animate-enter">
          <div className="flex justify-between items-start mb-8">
             <div>
               <div className="text-lg font-black text-black tracking-tight">KASIR<span className="text-zinc-300">.APP</span></div>
               <div className="flex items-center gap-2 mt-2">
                 <span className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                 <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{user ? 'Online' : 'Offline Mode'}</span>
               </div>
             </div>
             <button onClick={() => setView('login')} className="text-zinc-400 hover:text-black transition-colors p-3 hover:bg-zinc-100 rounded-full btn-hover-effect">
               <LogOut size={20} />
             </button>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase block mb-2">Harga Tiket Hari Ini</span>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                 <span className="text-xl text-zinc-400 font-bold transform -translate-y-4">Rp</span>
                 <h2 className="text-7xl md:text-8xl font-black text-black tracking-tighter">{formatIDR(currentPrice).replace('Rp', '')}</h2>
              </div>
              <div className={`mt-4 inline-flex items-center px-4 py-2 border text-xs font-bold uppercase tracking-wider rounded-full transition-colors ${isWknd ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-zinc-200 bg-zinc-50 text-zinc-600'}`}>
                {isWknd ? 'Tarif Akhir Pekan' : 'Tarif Hari Biasa'}
              </div>
            </div>

            <button onClick={handleAddVisitor} className="group relative w-full bg-black hover:bg-zinc-900 text-white p-8 md:p-10 rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-2xl shadow-zinc-200 overflow-hidden btn-hover-effect">
              <div className="relative z-10 flex items-center justify-between pointer-events-none">
                <div className="text-left">
                  <span className="block text-2xl md:text-3xl font-black mb-1 tracking-tight">TAMBAH 1 ORANG</span>
                  <span className="text-xs font-mono opacity-70 uppercase tracking-widest">Tiket Masuk Regular</span>
                </div>
                <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-colors duration-300"><Plus size={32} /></div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            </button>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-5 border border-zinc-100 bg-zinc-50/50 rounded-xl transition-colors hover:bg-zinc-100">
                <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Total Pengunjung</span>
                <span className="text-3xl text-black font-black font-mono">{todayCount}</span>
              </div>
               <div className="p-5 border border-zinc-100 bg-zinc-50/50 rounded-xl transition-colors hover:bg-zinc-100">
                <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Masuk Terakhir</span>
                <span className="text-3xl text-zinc-400 font-black font-mono">{todayTransactions.length > 0 ? todayTransactions[0].timeString : '--:--'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[420px] bg-zinc-50 border-l border-zinc-200 flex flex-col h-[500px] md:h-screen shadow-[inset_10px_0_20px_-10px_rgba(0,0,0,0.02)] animate-slide-in">
          <div className="p-6 border-b border-zinc-200 flex justify-between items-center sticky top-0 bg-zinc-50/95 backdrop-blur z-10">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Riwayat Masuk</span>
            <div className="bg-white p-2 rounded-lg border border-zinc-200 shadow-sm"><History size={16} className="text-zinc-400" /></div>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
            {todayTransactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4 animate-enter">
                <div className="w-16 h-16 border-2 border-zinc-200 rounded-full flex items-center justify-center bg-white"><span className="text-lg font-bold">0</span></div>
                <span className="text-[10px] uppercase tracking-wide font-bold">Siap Input Data</span>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {todayTransactions.map((t, i) => (
                  <div key={t.id || t.numericId} className="p-4 bg-white hover:bg-zinc-50 transition-colors flex items-center justify-between group animate-enter" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="flex items-center gap-4">
                      <span className="text-zinc-300 font-mono text-xs w-6 text-center font-bold">{todayCount - i}</span>
                      <div>
                        <span className="block text-zinc-900 text-sm font-bold">Reguler</span>
                        <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wide">#{t.numericId?.toString().slice(-4) || '----'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                         <span className="block text-black text-sm font-mono font-bold">{formatIDR(t.price)}</span>
                         <span className="text-[10px] text-zinc-500 font-medium">{t.timeString}</span>
                      </div>
                      <button onClick={() => initiateDelete(t.id || t.numericId)} className="w-10 h-10 flex items-center justify-center text-zinc-300 bg-zinc-50 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm active:scale-90" title="Hapus"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const MonitorView = () => {
    const filtered = useMemo(() => transactions.filter(t => t.dateKey === monitorDate), [transactions, monitorDate]);
    const revenue = filtered.reduce((acc, c) => acc + c.price, 0);
    const count = filtered.length;
    const isWknd = isDateWeekend(monitorDate);

    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
        <nav className="h-16 border-b border-zinc-200 flex items-center justify-between px-6 bg-white shadow-sm sticky top-0 z-30 glass-panel">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-zinc-100 rounded-lg"><ShieldCheck size={20} className="text-black"/></div>
             <span className="font-bold text-black tracking-tight">DASHBOARD<span className="text-zinc-400">.PENGAWAS</span></span>
           </div>
           <button onClick={() => setView('login')} className="text-xs font-bold text-zinc-500 hover:text-red-600 transition-colors px-4 py-2 hover:bg-red-50 rounded-lg">KELUAR</button>
        </nav>

        <div className="max-w-6xl mx-auto p-6 md:p-10 animate-enter">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm mb-8 flex flex-col md:flex-row gap-6 justify-between items-center transition-all hover:shadow-md">
            <div className="w-full md:w-auto">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 block font-bold">Pilih Tanggal Laporan</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                 <div className="relative w-full sm:w-auto">
                   <input type="date" value={monitorDate} onChange={(e) => setMonitorDate(e.target.value)} className="w-full bg-zinc-50 border border-zinc-300 text-black px-4 py-3 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-mono text-sm font-medium cursor-pointer hover:bg-zinc-100 transition-colors" />
                 </div>
                 <span className={`w-full sm:w-auto text-center px-4 py-3 text-xs uppercase font-bold border rounded-xl transition-colors ${isWknd ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>{isWknd ? 'Akhir Pekan' : 'Hari Biasa'}</span>
              </div>
            </div>
            <div className="w-full md:w-auto text-center md:text-right">
               <span className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1 font-bold">Total Pendapatan</span>
               <span className="text-4xl font-black text-black font-mono tracking-tight">{formatIDR(revenue)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-enter-delay-1">
            <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
               <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-black"><Users size={20} /></div>
               <div className="text-3xl text-black font-mono font-bold mb-1">{count}</div>
               <div className="text-xs text-zinc-500 font-bold uppercase tracking-wide">Total Pengunjung</div>
            </div>
             <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
               <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-black"><TrendingUp size={20} /></div>
               <div className="text-3xl text-zinc-600 font-mono font-bold mb-1">{count > 0 ? formatIDR(revenue / count).split(',')[0] : '0'}</div>
               <div className="text-xs text-zinc-500 font-bold uppercase tracking-wide">Rata-rata / Orang</div>
            </div>
             <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
               <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-black"><Calendar size={20} /></div>
               <div className="text-3xl text-zinc-600 font-mono font-bold mb-1">{isWknd ? '12.000' : '10.000'}</div>
               <div className="text-xs text-zinc-500 font-bold uppercase tracking-wide">Tarif Berlaku</div>
            </div>
          </div>

          <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-sm animate-enter-delay-2">
            <div className="px-6 py-5 border-b border-zinc-200 bg-zinc-50 flex justify-between items-center">
              <h3 className="text-sm font-black text-zinc-800 uppercase tracking-wide">Log Transaksi</h3>
              <span className="text-[10px] font-bold text-zinc-600 font-mono bg-white px-3 py-1 border border-zinc-200 rounded-full shadow-sm">{filtered.length} RECORD</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-100">
                    <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest bg-white">Waktu</th>
                    <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest bg-white">ID Transaksi</th>
                    <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-right bg-white">Nominal</th>
                    <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-center bg-white">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-zinc-400 text-xs italic font-medium">Tidak ada data untuk tanggal ini.</td></tr>
                  ) : (
                    filtered.map(t => (
                      <tr key={t.id || t.numericId} className="hover:bg-zinc-50 transition-colors group">
                        <td className="px-6 py-4 font-mono text-xs font-bold">{t.timeString} WIB</td>
                        <td className="px-6 py-4 font-mono text-xs text-zinc-400">#{t.numericId?.toString().slice(-6) || '----'}</td>
                        <td className="px-6 py-4 font-mono text-xs text-right font-bold text-black">{formatIDR(t.price)}</td>
                         <td className="px-6 py-4 text-center">
                          <button onClick={() => initiateDelete(t.id || t.numericId)} className="text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all p-2 rounded-lg transform active:scale-90" title="Hapus Data Ini"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal isOpen={modal.isOpen} onClose={() => setModal({ isOpen: false, id: null })} onConfirm={confirmDelete} title="Hapus Transaksi?" message="Data yang dihapus tidak dapat dikembalikan dan akan mengurangi total pendapatan hari ini." />
      <AuthModal isOpen={authModal.isOpen} onClose={() => setAuthModal({ isOpen: false, targetView: null })} onConfirm={handleAuthVerify} targetView={authModal.targetView} />
      {view === 'login' && <LoginView />}
      {view === 'cashier' && <CashierView />}
      {view === 'monitor' && <MonitorView />}
    </>
  );
};

export default App;