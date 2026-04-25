
import React, { useState } from 'react';
import { Lock, User, LogIn, Database, Zap, Mail, UserPlus } from 'lucide-react';
import { login, register } from '../services/authService';
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
        if (user) onLoginBerhasil(user);
        else setError('Email atau password salah.');
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
      } else {
        setError('Gagal login dengan Google.');
      }
    } catch (err: any) {
      if (err.message && (err.message.includes('auth/network-request-failed') || err.message.includes('auth/popup-blocked'))) {
        setError('Popup terblokir atau jaringan bermasalah di dalam pratinjau. Mohon klik ikon "Open out" / Buka di tab baru di sudut kanan atas untuk login Google.');
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
               Mode Offline Aktif: Data pasien disimpan di perangkat ini.
             </p>
             <p className="text-[9px] text-center font-black text-[#A78BFA] uppercase tracking-widest">
               Privasi Penuh - Tanpa Sinkronisasi Cloud.
             </p>
           </div>
           
           <div className="flex justify-center">
             <button 
               onClick={handleQuickAccess}
               className="text-[10px] font-black text-[#7C3AED] uppercase tracking-widest hover:underline"
             >
               Quick Access (Demo Mode)
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
