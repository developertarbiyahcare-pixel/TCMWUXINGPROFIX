
import React, { useState, useEffect } from 'react';
import { X, UserPlus, Trash2, Shield, User, AlertCircle, Save, Settings, Database, Key, MapPin, Phone, Zap } from 'lucide-react';
import { UserAccount, AppSettings, ApiKeyEntry } from '../types';
import { db } from '../services/db';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db as firestore, auth } from '../firebase';
import { updatePassword } from 'firebase/auth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
}

const UserManagementModal: React.FC<Props> = ({ isOpen, onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'profile'>('users');
  const [users, setPengguna] = useState<UserAccount[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPeran, setNewPeran] = useState<'SUPER_SAINT' | 'SUPER_USER' | 'ADMIN' | 'REGULAR'>('REGULAR');
  const [error, setError] = useState('');
  const [successMsg, setBerhasilMsg] = useState('');

  // Pengaturan state
  const [geminiKey, setGeminiKey] = useState('');
  const [geminiKeys, setGeminiKeys] = useState<ApiKeyEntry[]>([]);
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newOwnPassword, setNewOwnPassword] = useState('');
  const [confirmNewPassword, setKonfirmasiNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const s = await db.settings.get();
          if (s) {
            setGeminiKey(s.geminiApiKey || '');
            setGeminiKeys(s.geminiApiKeys || []);
            setClinicName(s.clinicName || '');
            setClinicAddress(s.clinicAddress || '');
            setClinicPhone(s.clinicPhone || '');
          }
        } catch (e) {
          console.warn("Fetch settings skipped:", e);
        }
      };
      
      fetchData();

      const loadPengguna = async () => {
        try {
          const userData = await db.users.getAll();
          setPengguna(userData);
        } catch (e) {
          console.warn("User fetch skipped:", e);
        }
      };
      loadPengguna();
    }
  }, [isOpen]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBerhasilMsg('');

    if (!newUsername.trim() || !newPassword.trim()) {
      setError('Username and password are required.');
      return;
    }

    const uid = Date.now().toString();
    
    // RBAC check for adding users
    if (currentUser.role !== 'SUPER_SAINT' && newPeran !== 'REGULAR') {
      setError('Hanya SUPER SAINT USER yang bisa membuat akun dengan role tinggi.');
      return;
    }

    const result = await db.users.add({
      uid,
      username: newUsername.trim(),
      password: newPassword.trim(),
      role: newPeran,
      createdAt: Date.now()
    });

    if (result) {
      setBerhasilMsg(`User ${newUsername} added successfully.`);
      setNewUsername('');
      setNewPassword('');
      setNewPeran('REGULAR');
    } else {
      setError("Failed to add user.");
    }
  };

  const handleSavePengaturan = async () => {
    setError('');
    setBerhasilMsg('');
    
    // Clean up empty keys
    const cleanedKeys = geminiKeys.filter(k => k.key.trim() !== "");
    console.log('Saving settings with keys:', cleanedKeys);

    const result = await db.settings.update({
      geminiApiKey: geminiKey,
      geminiApiKeys: cleanedKeys,
      clinicName,
      clinicAddress,
      clinicPhone
    });
    console.log('Save settings result:', result);
    if (result.success) {
      if (result.error) {
        setBerhasilMsg(`Pengaturan saved locally! (Note: ${result.error})`);
        // Longer timeout if there's a warning so they can read it
        setTimeout(() => window.location.reload(), 3000);
      } else {
        setBerhasilMsg("Pengaturan saved successfully.");
        setTimeout(() => window.location.reload(), 1000);
      }
    } else {
      setError(result.error || "Failed to save settings.");
    }
  };

  const addKeyField = () => {
    if (geminiKeys.length >= 10) {
      setError("Maksimal 10 API Key.");
      return;
    }
    setGeminiKeys([...geminiKeys, { key: '', isExhausted: false }]);
  };

  const removeKeyField = (index: number) => {
    setGeminiKeys(geminiKeys.filter((_, i) => i !== index));
  };

  const updateKeyField = (index: number, value: string) => {
    const newKeys = [...geminiKeys];
    newKeys[index].key = value;
    newKeys[index].isExhausted = false; // Atur Ulang status if key is edited
    setGeminiKeys(newKeys);
  };

  const toggleKeyExhausted = (index: number) => {
    const newKeys = [...geminiKeys];
    newKeys[index].isExhausted = !newKeys[index].isExhausted;
    setGeminiKeys(newKeys);
  };

  const resetAllKeys = async () => {
    const newKeys = geminiKeys.map(k => ({ ...k, isExhausted: false }));
    setGeminiKeys(newKeys);
    
    // Also save to DB immediately for convenience
    const result = await db.settings.update({
      geminiApiKey: geminiKey,
      geminiApiKeys: newKeys,
      clinicName,
      clinicAddress,
      clinicPhone
    });
    
    if (result.success) {
      setBerhasilMsg("Semua API Key telah di-reset dan disimpan.");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setError("Gagal menyimpan reset: " + result.error);
    }
  };

  const handleChangeOwnPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBerhasilMsg('');

    if (!newOwnPassword || !confirmNewPassword) {
      setError('Password baru Required diisi.');
      return;
    }

    if (newOwnPassword !== confirmNewPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsChangingPassword(true);
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newOwnPassword);
        await db.users.add({ ...currentUser, password: '' }); 
      } else {
        const updatedUser = { ...currentUser, password: newOwnPassword };
        const result = await db.users.add(updatedUser);
        if (!result) throw new Error("Gagal mengubah password.");
      }

      setBerhasilMsg('Password berhasil diubah. Silakan login kembali.');
      setTimeout(() => {
        localStorage.removeItem('tcm_active_session');
        if (auth.currentUser) auth.signOut();
        window.location.reload();
      }, 2000);
    } catch (e: any) {
      setError(e.message || 'Gagal mengubah password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteOwnAccount = async () => {
    if (currentUser.username === 'admin') {
      setError("Akun admin utama tidak dapat dihapus.");
      return;
    }

    if (!window.confirm("PERINGATAN: Menghapus akun akan menghapus semua akses Anda secara permanen. Lanjutkan?")) return;

    const uid = currentUser.uid;
    if (!uid) {
      setError("Gagal menemukan ID user.");
      return;
    }

    try {
      const result = await db.users.delete(uid);
      if (result) {
        localStorage.removeItem('tcm_active_session');
        if (auth.currentUser) {
          await auth.currentUser.delete();
        }
        window.location.reload();
      } else {
        setError("Gagal menghapus akun.");
      }
    } catch (e: any) {
      setError(e.message || "Gagal menghapus akun.");
    }
  };

  const handleDelete = async (username: string, uid?: string, role?: string) => {
    if (username === currentUser.username) {
      setError("You cannot delete your own account.");
      return;
    }

    // RBAC check for deleting users
    if (currentUser.role !== 'SUPER_SAINT' && (role === 'SUPER_SAINT' || role === 'SUPER_USER' || role === 'ADMIN')) {
      setError("Hanya SUPER SAINT USER yang bisa menghapus akun dengan role tinggi.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) return;

    if (!uid) {
        setError("Cannot delete user without UID.");
        return;
    }

    const result = await db.users.delete(uid);
    if (result) {
      setBerhasilMsg(`User ${username} deleted.`);
    } else {
      setError("Failed to delete user.");
    }
  };

  if (!isOpen) return null;

  const roleLabels: Record<string, string> = {
    SUPER_SAINT: 'SUPER SAINT USER',
    SUPER_USER: 'Super User',
    ADMIN: 'User Admin',
    REGULAR: 'Modul Biasa (Coba-coba)'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white border border-purple-100 w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-100 bg-purple-50 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-xl border border-purple-200">
               <Shield className="w-6 h-6 text-tcm-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-purple-950 uppercase tracking-tighter">Kendali Utama</h2>
              <p className="text-xs font-bold text-purple-500 uppercase tracking-widest">System Konfigurasi & Access</p>
            </div>
          </div>
          <button onClick={onClose} className="text-purple-400 hover:text-purple-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 bg-purple-50/50 border-b border-purple-100">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === 'users' ? 'border-tcm-primary text-tcm-primary' : 'border-transparent text-purple-400 hover:text-purple-600'}`}
          >
            User Management
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === 'settings' ? 'border-tcm-primary text-tcm-primary' : 'border-transparent text-purple-400 hover:text-purple-600'}`}
          >
            System Pengaturan
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-4 ${activeTab === 'profile' ? 'border-tcm-primary text-tcm-primary' : 'border-transparent text-purple-400 hover:text-purple-600'}`}
          >
            My Profile
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {error && (
              <div className="text-xs font-bold text-rose-500 flex items-center gap-2 bg-rose-50 p-3 rounded-xl border border-rose-100">
                 <AlertCircle className="w-4 h-4" /> {error}
              </div>
           )}
           {successMsg && (
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-2 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                 <AlertCircle className="w-4 h-4" /> {successMsg}
              </div>
           )}

           {activeTab === 'users' ? (
             <>
               {/* Tambah Pengguna Form */}
               <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 shadow-inner">
                  <h3 className="text-sm font-black text-tcm-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                     <UserPlus className="w-4 h-4" /> Add New User
                  </h3>
                  
                  <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                     <div>
                        <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-1 ml-1">Username</label>
                        <input 
                          type="text" 
                          value={newUsername}
                          onChange={e => setNewUsername(e.target.value)}
                          className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-sm text-purple-900 focus:border-tcm-primary outline-none shadow-sm transition-all"
                          placeholder="e.g. doctor1"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-1 ml-1">Password</label>
                        <input 
                          type="text" 
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-sm text-purple-900 focus:border-tcm-primary outline-none font-mono shadow-sm transition-all"
                          placeholder="Password"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-1 ml-1">Peran</label>
                        <select 
                           value={newPeran}
                           onChange={e => setNewPeran(e.target.value as any)}
                           className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-sm text-purple-900 focus:border-tcm-primary outline-none shadow-sm transition-all"
                        >
                           <option value="REGULAR">Modul Biasa</option>
                           <option value="ADMIN">User Admin</option>
                           <option value="SUPER_USER">Super User</option>
                           <option value="SUPER_SAINT">SUPER SAINT USER</option>
                        </select>
                     </div>
                     <div>
                        <button type="submit" className="w-full bg-tcm-primary hover:brightness-110 active:scale-95 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-purple-900/20">
                           <Save className="w-4 h-4" /> Tambah Pengguna
                        </button>
                     </div>
                  </form>
               </div>

               {/* User List */}
               <div>
                  <h3 className="text-sm font-black text-purple-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" /> Registered Pengguna ({users.length})
                  </h3>
                  <div className="border border-purple-100 rounded-2xl overflow-hidden shadow-sm bg-white overflow-x-auto">
                     <table className="w-full text-sm text-left min-w-[600px]">
                        <thead className="bg-purple-50 text-purple-500 font-black text-[10px] uppercase tracking-widest">
                           <tr>
                              <th className="px-6 py-4">Username</th>
                              <th className="px-6 py-4">Peran</th>
                              <th className="px-6 py-4">Password</th>
                              <th className="px-6 py-4 text-right">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-purple-50">
                           {users.map(u => (
                              <tr key={u.username} className="hover:bg-purple-50/50 transition-colors">
                                 <td className="px-6 py-4 font-bold text-purple-900 flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${u.role === 'SUPER_SAINT' ? 'bg-amber-100 text-amber-600' : u.role === 'SUPER_USER' ? 'bg-fuchsia-100 text-fuchsia-600' : 'bg-purple-100 text-purple-500'}`}>
                                      <User className="w-4 h-4" />
                                    </div>
                                    {u.username} 
                                    {u.username === currentUser.username && <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-1 rounded-md ml-2 font-black tracking-widest">YOU</span>}
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className={`text-[10px] px-3 py-1.5 rounded-lg uppercase font-black tracking-widest ${u.role === 'SUPER_SAINT' ? 'bg-amber-100 text-amber-700 border border-amber-200' : u.role === 'SUPER_USER' ? 'bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200' : 'bg-purple-100 text-purple-600 border border-purple-200'}`}>
                                       {roleLabels[u.role] || u.role}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 font-mono text-purple-400 text-xs">{u.password}</td>
                                 <td className="px-6 py-4 text-right">
                                    {u.username !== 'admin' && u.username !== currentUser.username && (
                                       <button 
                                          onClick={() => handleDelete(u.username, (u as any).uid, u.role)}
                                          className="text-purple-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-all"
                                          title="Delete User"
                                       >
                                          <Trash2 className="w-4 h-4" />
                                       </button>
                                    )}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
             </>
           ) : activeTab === 'settings' ? (
             <div className="space-y-6">
                 <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 space-y-4">
                  <h3 className="text-sm font-black text-tcm-primary uppercase tracking-wider flex items-center gap-2">
                    <Key className="w-4 h-4" /> Gemini AI Konfigurasi (Multi-Key Rotation)
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-purple-400 uppercase tracking-widest ml-1">Gemini API Keys (Max 10)</label>
                      <div className="flex gap-2">
                        {geminiKeys.some(k => k.isExhausted) && (
                          <button 
                            onClick={resetAllKeys}
                            className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg uppercase tracking-widest hover:bg-emerald-100 transition-all shadow-sm"
                          >
                            Atur Ulang All
                          </button>
                        )}
                        <button 
                          onClick={addKeyField}
                          className="text-[10px] font-black text-white bg-purple-600 px-3 py-1.5 rounded-lg uppercase tracking-widest hover:bg-purple-700 transition-all shadow-sm"
                        >
                          + Add Key
                        </button>
                      </div>
                    </div>
                    
                    {geminiKeys.length === 0 && (
                      <div className="text-center py-8 bg-white/50 rounded-xl border border-dashed border-purple-200">
                        <p className="text-xs font-bold text-purple-300 uppercase tracking-widest">No API Keys Added</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      {geminiKeys.map((keyEntry, idx) => (
                        <div key={idx} className="flex gap-2 items-center animate-fade-in">
                          <div className="flex-1 relative">
                            <input 
                              type="password" 
                              value={keyEntry.key}
                              onChange={e => updateKeyField(idx, e.target.value)}
                              className={`w-full bg-white border ${keyEntry.isExhausted ? 'border-rose-200 bg-rose-50/30' : 'border-purple-200'} rounded-xl px-4 py-3 text-sm text-purple-900 focus:border-tcm-primary outline-none shadow-sm transition-all font-mono`}
                              placeholder={`API Key #${idx + 1}`}
                            />
                            {keyEntry.isExhausted && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-rose-500 uppercase tracking-widest bg-rose-100 px-1.5 py-0.5 rounded">
                                Exhausted
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => toggleKeyExhausted(idx)}
                            className={`p-3 rounded-xl border transition-all ${keyEntry.isExhausted ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}
                            title={keyEntry.isExhausted ? "Mark as Active" : "Mark as Exhausted"}
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => removeKeyField(idx)}
                            className="p-3 bg-white text-purple-300 border border-purple-100 rounded-xl hover:text-rose-500 hover:border-rose-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-white/50 rounded-xl border border-purple-100">
                      <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest leading-relaxed">
                        <Zap className="w-3 h-3 inline mr-1 text-amber-500" />
                        Sistem akan merotasi kunci di atas secara otomatis. Jika satu kunci mencapai limit (Error 429/Quota), sistem akan beralih ke kunci berikutnya yang tersedia.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 space-y-4">
                  <h3 className="text-sm font-black text-tcm-primary uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-4 h-4" /> Clinic Information (Invoice)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-1 ml-1">Clinic Name</label>
                      <input 
                        type="text" 
                        value={clinicName}
                        onChange={e => setClinicName(e.target.value)}
                        className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-sm text-purple-900 focus:border-tcm-primary outline-none shadow-sm transition-all"
                        placeholder="TCM Clinic Name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-1 ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                        <input 
                          type="text" 
                          value={clinicPhone}
                          onChange={e => setClinicPhone(e.target.value)}
                          className="w-full bg-white border border-purple-200 rounded-xl px-12 py-3 text-sm text-purple-900 focus:border-tcm-primary outline-none shadow-sm transition-all"
                          placeholder="+62..."
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-1 ml-1">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3 w-4 h-4 text-purple-300" />
                      <textarea 
                        value={clinicAddress}
                        onChange={e => setClinicAddress(e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-purple-200 rounded-xl px-12 py-3 text-sm text-purple-900 focus:border-tcm-primary outline-none shadow-sm transition-all resize-none"
                        placeholder="Clinic Address"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSavePengaturan}
                  className="w-full bg-tcm-primary hover:brightness-110 active:scale-95 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-xl shadow-purple-900/20"
                >
                  <Save className="w-5 h-5" /> Save All Pengaturan
                </button>
             </div>
           ) : activeTab === 'profile' ? (
             <div className="space-y-6">
                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 space-y-4">
                  <h3 className="text-sm font-black text-tcm-primary uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" /> Account Info
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Username</p>
                      <p className="text-sm font-bold text-purple-900">{currentUser.username}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Peran</p>
                      <p className="text-sm font-bold text-purple-900">{roleLabels[currentUser.role]}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 space-y-4">
                  <h3 className="text-sm font-black text-tcm-primary uppercase tracking-wider flex items-center gap-2">
                    <Key className="w-4 h-4" /> Ganti Password
                  </h3>
                  <form onSubmit={handleChangeOwnPassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-1 ml-1">Password Baru</label>
                      <input 
                        type="password" 
                        value={newOwnPassword}
                        onChange={e => setNewOwnPassword(e.target.value)}
                        className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-sm text-purple-900 focus:border-tcm-primary outline-none shadow-sm transition-all"
                        placeholder="Masukkan password baru"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-purple-400 uppercase tracking-widest mb-1 ml-1">Konfirmasi Password Baru</label>
                      <input 
                        type="password" 
                        value={confirmNewPassword}
                        onChange={e => setKonfirmasiNewPassword(e.target.value)}
                        className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-sm text-purple-900 focus:border-tcm-primary outline-none shadow-sm transition-all"
                        placeholder="Ulangi password baru"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isChangingPassword}
                      className="w-full bg-tcm-primary hover:brightness-110 active:scale-95 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-xl shadow-purple-900/20 disabled:opacity-50"
                    >
                      {isChangingPassword ? 'Processing...' : 'Update Password'}
                    </button>
                  </form>
                </div>

                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 space-y-4">
                  <h3 className="text-sm font-black text-rose-600 uppercase tracking-wider flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Danger Zone
                  </h3>
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest leading-relaxed">
                    Menghapus akun akan menghapus semua akses Anda ke sistem ini. Tindakan ini tidak dapat dibatalkan.
                  </p>
                  <button 
                    onClick={handleDeleteOwnAccount}
                    className="w-full bg-white text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                  >
                    <Trash2 className="w-5 h-5" /> Hapus Akun Saya Permanen
                  </button>
                </div>
             </div>
           ) : null}
        </div>
      </div>
    </div>
  );
};

export default UserManagementModal;
