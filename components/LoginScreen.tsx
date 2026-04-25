
import React, { useState } from 'react';
import { Lock, User, LogIn, Database, Zap, Chrome, Mail, UserPlus } from 'lucide-react';
import { login, register, loginWithGoogle } from '../services/authService';
import { UserAccount } from '../types';
import { DEFAULT_ADMIN } from '../services/db';

interface Props {
  onLoginBerhasil: (user: UserAccount) => void;
}

const LoginScreen: React.FC<Props> = ({ onLoginBerhasil }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setBerhasil] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBerhasil('');
    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const user = await login(email, password);
        if (user) {
          onLoginBerhasil(user);
          localStorage.setItem('tcm_active_session', JSON.stringify(user));
        } else {
          setError('Email atau password salah.');
        }
      } else {
        if (!email.trim() || !password.trim() || !fullName.trim()) {
          setError('Semua field Required diisi.');
          return;
        }
        const result = await register(email, password, fullName);
        if (result.success) {
          setBerhasil(result.message);
          setActiveTab('login');
          setPassword('');
        } else {
          setError(result.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        onLoginBerhasil(user);
        localStorage.setItem('tcm_active_session', JSON.stringify(user));
      } else {
        setError('Gagal login dengan Google.');
      }
    } catch (err: any) {
      console.error("Auth Error Details:", err);
      if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('unauthorized-domain'))) {
        const currentDomain = window.location.hostname;
        setError(`Domain Tidak Diizinkan: "${currentDomain}" belum terdaftar di Firebase Console. \n\nLangkah Perbaikan:\n1. Buka Firebase Console > Authentication > Settings\n2. Tambahkan "${currentDomain}" ke daftar "Authorized Domains"`);
      } else if (err.message && (err.message.includes('auth/network-request-failed') || err.message.includes('auth/popup-blocked'))) {
        setError('Popup terblokir atau jaringan bermasalah. Mohon klik ikon "Buka di tab baru" di sudut kanan atas untuk login Google.');
      } else if (err.message && err.message.includes('auth/popup-closed-by-user')) {
        setError('Login dibatalkan oleh pengguna.');
      } else {
        setError(err.message || 'Gagal login dengan Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAccess = () => {
    onLoginBerhasil(DEFAULT_ADMIN);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#F3E8FF] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
             <Database className="w-10 h-10 text-[#7C3AED]" />
          </div>
          <h1 className="text-3xl font-black text-[#4C1D95] uppercase tracking-tight mb-1">TCM WuXing Pro</h1>
          <p className="text-[#A78BFA] text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Clinical Decision Support System</p>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-white border border-[#EDE9FE] text-[#4C1D95] font-black py-4 rounded-2xl shadow-sm hover:bg-[#F9F5FF] hover:border-[#C4B5FD] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mb-6"
        >
          <Chrome className="w-5 h-5 text-[#7C3AED]" />
          {isLoading ? 'Processing...' : 'Login dengan Google'}
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-[#EDE9FE] flex-1"></div>
          <span className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-widest">Atau Mode Offline</span>
          <div className="h-px bg-[#EDE9FE] flex-1"></div>
        </div>

        <div className="bg-[#F9F5FF] p-1.5 rounded-2xl flex mb-8">
          <button 
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'login' ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-[#A78BFA] hover:text-[#7C3AED]'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'register' ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-[#A78BFA] hover:text-[#7C3AED]'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'register' && (
            <div className="relative">
              <UserPlus className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C4B5FD]" />
              <input 
                type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white border border-[#EDE9FE] rounded-2xl py-5 pl-14 pr-5 text-[#4C1D95] placeholder-[#C4B5FD] focus:border-[#7C3AED] outline-none transition-all shadow-sm"
                placeholder="Nama Lengkap / Klinik"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C4B5FD]" />
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-[#EDE9FE] rounded-2xl py-5 pl-14 pr-5 text-[#4C1D95] placeholder-[#C4B5FD] focus:border-[#7C3AED] outline-none transition-all shadow-sm"
              placeholder="Email Klinik"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C4B5FD]" />
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-[#EDE9FE] rounded-2xl py-5 pl-14 pr-5 text-[#4C1D95] placeholder-[#C4B5FD] focus:border-[#7C3AED] outline-none transition-all shadow-sm"
              placeholder="Password"
              required
            />
          </div>
          {error && <p className="text-rose-500 text-[10px] font-bold text-center uppercase tracking-wider">{error}</p>}
          {success && <p className="text-emerald-500 text-[10px] font-bold text-center uppercase tracking-wider">{success}</p>}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#7C3AED] text-white font-black py-5 rounded-2xl shadow-xl shadow-purple-200 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest text-sm disabled:opacity-50"
          >
             {isLoading ? 'Processing...' : activeTab === 'login' ? 'Login Offline' : 'Daftar Offline'}
          </button>
        </form>

        <div className="pt-8 space-y-6">
           <div className="space-y-3">
             <p className="text-[9px] text-center font-black text-[#A78BFA] uppercase tracking-widest">
               Info: Login dengan Google (email developer) otomatis akses Super Admin.
             </p>
             <p className="text-[9px] text-center font-black text-[#A78BFA] uppercase tracking-widest">
               Default Akun Lokal: admin / admin123
             </p>
           </div>
           
           <div className="flex justify-center">
             <button 
               onClick={handleQuickAccess}
               className="text-[10px] font-black text-[#7C3AED] uppercase tracking-widest hover:underline"
             >
               Quick Access (admin/admin123)
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
