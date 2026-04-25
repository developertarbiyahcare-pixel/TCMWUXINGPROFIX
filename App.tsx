
import React, { useState, useRef, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Send, Activity, MessageSquare, Stethoscope, Archive, Compass, GraduationCap, Shield, ClipboardList, Loader2, Menu, X, LayoutGrid, Scale, Paperclip, Image as ImageIcon, Zap, ChevronDown, ChevronRight, AlertCircle, History, UserPlus, LogOut, Settings, User, Globe } from 'lucide-react';
import { Language, ChatMessage, UserAccount, TcmDiagnosisResult, AppSettings } from './types';
import { sendMessageToGeminiStream } from './services/geminiService';
import { analyzePatient } from './services/tcmLogic';
import { db, DEFAULT_ADMIN } from './services/db';
import DiagnosisCard from './components/DiagnosisCard';
import PatientFormModal from './components/PatientFormModal';
import WuXingVisualizerModal from './components/WuXingVisualizerModal';
import ScoringAndPointsHub from './components/ScoringAndPointsHub';
import WuXingMasterPanel from './components/WuXingMasterPanel';
import LoginScreen from './components/LoginScreen';
import UserManagementModal from './components/UserManagementModal';
import UkomPracticePanel from './components/UkomPracticePanel';
import PatientArchivePanel from './components/PatientArchivePanel';
import SyndromeAtlasWindow from './components/SyndromeAtlasWindow';
import AcupuncturePointsPanel from './components/AcupuncturePointsPanel';
import WuXingEducationPage from './components/WuXingEducationPage';
import ConsentModal from './components/ConsentModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import PatientDashboard from './components/PatientDashboard';

import InvoiceGeneratorPanel from './components/InvoiceGeneratorPanel';
import BMIKomplitPanel from './components/BMIKomplitPanel';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };
  props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-rose-100 text-center">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="w-10 h-10 text-rose-600" />
            </div>
            <h1 className="text-2xl font-black text-rose-900 uppercase tracking-tight mb-4">Sistem Eror</h1>
            <p className="text-sm text-rose-600 mb-8 font-medium">
              Terjadi kesalahan pada Mesin TCM. Silakan muat ulang halaman.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
            >
              Muat Ulang Aplikasi
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-8 p-4 bg-rose-50 rounded-xl text-[10px] text-rose-800 text-left overflow-auto max-h-40 font-mono">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import { auth, db as firestore } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [settings, setPengaturan] = useState<AppSettings | null>(null);

  const lastUidRef = useRef<string | null>(null);

  useEffect(() => {
    // Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: any) => {
      const currentUid = fbUser?.uid || null;
      if (lastUidRef.current !== currentUid) {
        setMessages([
          { 
            id: 'welcome', 
            role: 'model', 
            text: `Selamat datang di TCM PRO Indonesia! 👋\n\nSaya asisten AI pakar Akupunktur & Herbal Anda. \n\n💡 **Cara Mulai:**\n1. Ketik keluhan pasien (contoh: "ada pasien stroke, lidah kaku, nadi tegang")\n2. Atau klik **"Input Pasien Baru"** di menu samping untuk data lengkap.\n\n${fbUser ? '✅ Akun Terhubung: Data Anda tersimpan aman di Cloud.' : '⚠️ Mode Lokal: Data hanya di HP ini. Silakan Login untuk sinkronisasi.'}`, 
            timestamp: new Date() 
          }
        ]);
        lastUidRef.current = currentUid;
      }

      if (fbUser) {
        // Find existing session to keep role if available
        const saved = localStorage.getItem('tcm_active_session');
        let role = 'REGULAR';
        if (saved) {
          try { role = JSON.parse(saved).role; } catch (e) {}
        }

        // Fetch latest role from Firestore if possible
        try {
          const userSnap = await getDoc(doc(firestore, 'users', fbUser.uid));
          if (userSnap.exists()) {
            role = userSnap.data().role || role;
          }
          
          // Failsafe upgrade for developer emails
          const BOOTSTRAP_EMAILS = ['developertarbiyahcare@gmail.com', 'nvardi75@gmail.com'];
          if (fbUser.email && BOOTSTRAP_EMAILS.includes(fbUser.email) && role !== 'SUPER_SAINT') {
            role = 'SUPER_SAINT';
          }
        } catch (e) {
          console.error("Role sync error:", e);
        }

        const newUser: UserAccount = {
          uid: fbUser.uid,
          username: fbUser.email || '',
          password: '',
          role: role as any,
          createdAt: Date.now(),
          provider: 'google'
        };
        setCurrentUser(newUser);
        localStorage.setItem('tcm_active_session', JSON.stringify(newUser));
      } else {
        // If not a google user, check if there's a local session
        const saved = localStorage.getItem('tcm_active_session');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.provider === 'local') {
              setCurrentUser(parsed);
            } else {
              setCurrentUser(null);
            }
          } catch (e) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const handleResetKeys = async () => {
    if (!settings) return;
    const newKeys = (settings.geminiApiKeys || []).map(k => ({ ...k, isExhausted: false }));
    const newPengaturan = { ...settings, geminiApiKeys: newKeys };
    setPengaturan(newPengaturan);
    await db.settings.update(newPengaturan);
    window.location.reload();
  };

  // Persist user session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tcm_active_session', JSON.stringify(currentUser));
    } else if (isAuthReady) {
      localStorage.removeItem('tcm_active_session');
    }
  }, [currentUser, isAuthReady]);

  useEffect(() => {
    const loadPengaturan = async () => {
      const s = await db.settings.get();
      if (s) {
        setPengaturan(s);
      } else {
        setPengaturan({
          geminiApiKey: '',
          geminiApiKeys: [],
          clinicName: 'TCM Clinic',
          clinicAddress: '',
          clinicPhone: ''
        });
      }
    };
    loadPengaturan();
  }, []);


  const [activePanel, setActivePanel] = useState<'chat' | 'diagnosis' | 'wuxing' | 'wuxing-education' | 'ukom' | 'patients' | 'atlas' | 'invoice' | 'bmi' | 'acupuncture' | 'history'>('chat');
  const [appLanguage, setAppLanguage] = useState<Language>(Language.INDONESIAN);
  
  const [showConsent, setShowConsent] = useState(true);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const consentAccepted = localStorage.getItem('consent_accepted');
    if (consentAccepted === 'true') {
      setShowConsent(false);
    }
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', text: 'Sistem Siap. Masukkan keluhan pasien untuk analisis cepat atau gunakan Form Input Pasien.', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedFile, setPilihedFile] = useState<{data: string, type: string, name: string} | null>(null);
  const [isMemuat, setIsMemuat] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [cdssResults, setCdssResults] = useState<ScoredSyndrome[]>([]);
  const [lastPatientForm, setLastPatientForm] = useState<any>(null);
  const [selectedAtlasId, setPilihedAtlasId] = useState<string | undefined>(undefined);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [showAcupunctureRef, setShowAcupunctureRef] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isMemuat]);

  const t = {
    chat: appLanguage === Language.ENGLISH ? "Chat Sindrom" : "Chat Sindrom",
    patients: appLanguage === Language.ENGLISH ? "Patient List" : "Daftar Pasien",
    diagnosis: appLanguage === Language.ENGLISH ? "Auto Analysis" : "Analisis Otomatis",
    acupuncture: appLanguage === Language.ENGLISH ? "Acupuncture Points" : "Titik Akupunktur",
    atlas: appLanguage === Language.ENGLISH ? "Syndrome Atlas" : "Atlas Penyakit",
    wuxing: appLanguage === Language.ENGLISH ? "Wu Xing Expert" : "Pakar Wu Xing",
    bmi: appLanguage === Language.ENGLISH ? "BMI & Nutrition" : "BMI & Gizi",
    invoice: appLanguage === Language.ENGLISH ? "Invoice/Receipt" : "Invoice/Kuitansi",
    history: appLanguage === Language.ENGLISH ? "History" : "Riwayat",
    settings: appLanguage === Language.ENGLISH ? "System Settings" : "System Pengaturan",
    newPatient: appLanguage === Language.ENGLISH ? "New Patient Intake" : "Input Pasien Baru",
    logout: appLanguage === Language.ENGLISH ? "Logout" : "Keluar Akun",
    analyzing: appLanguage === Language.ENGLISH ? "AI IS ANALYZING..." : "PAKAR SEDANG MENGANALISIS...",
    placeholder: appLanguage === Language.ENGLISH ? "Enter patient complaints or TCM questions..." : "Masukkan keluhan pasien atau pertanyaan TCM...",
    terhubung: appLanguage === Language.ENGLISH ? "Connected" : "Terhubung",
    offline: appLanguage === Language.ENGLISH ? "Offline" : "Luring"
  };

  const handleSendMessage = async (textOverride?: string, analysis?: ScoredSyndrome[], patientData?: any) => {
    const textToSend = textOverride || inputText;
    if ((!textToSend.trim() && !selectedFile) || isMemuat) return;

    setIsMemuat(true);
    const fileToSend = selectedFile?.data;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: textToSend, timestamp: new Date(), image: fileToSend || undefined };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setPilihedFile(null);

    const botMsgId = (Date.now() + 1).toString();
    const loadingText = appLanguage === Language.ENGLISH ? "Analyzing meridian patterns and syndromes..." : "Menganalisis pola meridian dan sindrom...";
    setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: loadingText, timestamp: new Date() }]);

    try {
      const result = await sendMessageToGeminiStream(
        textToSend, 
        fileToSend || undefined, 
        messages, 
        appLanguage, 
        false, 
        analysis || cdssResults,
        settings?.geminiApiKeys,
        undefined, // onChunk
        async (exhaustedKey) => {
          if (settings) {
            const updatedKeys = settings.geminiApiKeys.map(k => 
              k.key === exhaustedKey ? { ...k, isExhausted: true } : k
            );
            const newPengaturan = { ...settings, geminiApiKeys: updatedKeys };
            setPengaturan(newPengaturan);
            await db.settings.update(newPengaturan);
          }
        }
      );
      
      const response = result.data;
      
      setMessages(prev => prev.map(m => m.id === botMsgId ? { 
        ...m, 
        text: response.conversationalResponse || "Analisis Selesai.", 
        tcmResult: response.diagnosis 
      } : m));

      // Save to database if this was triggered by a patient form submission
      if (patientData && response.diagnosis) {
        await db.patients.add({
          id: Date.now().toString(),
          patientName: patientData.patientName || 'Unknown',
          age: patientData.age || '',
          sex: patientData.sex || '',
          phone: patientData.phone || '',
          email: patientData.email || '',
          address: patientData.address || '',
          complaint: patientData.complaint || '',
          symptoms: patientData.symptoms || '',
          selectedSymptoms: patientData.selectedSymptoms || [],
          tongue: patientData.tongue || {},
          pulse: patientData.pulse || {},
          diagnosis: response.diagnosis,
          timestamp: Date.now(),
          medicalHistory: patientData.medicalHistory || '',
          biomedicalDiagnosis: patientData.biomedicalDiagnosis || '',
          icd10: patientData.icd10 || ''
        });
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      let errorMsg = appLanguage === Language.ENGLISH ? "Gagal memproses data. Mohon periksa koneksi API Anda." : "Gagal memproses data. Mohon periksa koneksi API Anda.";
      
      // If the error message is informative, show it
      if (error.message && !error.message.includes("429") && !error.message.includes("quota")) {
        errorMsg = error.message;
      }
      
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: errorMsg, isError: true } : m));
    } finally {
      setIsMemuat(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPilihedFile({
          data: reader.result as string,
          type: file.type,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: any) => {
    setLastPatientForm(data);
    const results = analyzePatient({ symptoms: data.symptoms, selectedSymptoms: data.selectedSymptoms, tongue: data.tongue, pulse: data.pulse });
    setCdssResults(results);
    setActivePanel('chat');
    const msg = `PATIENT: ${data.patientName}, AGE: ${data.age}, SEX: ${data.sex}, PHONE: ${data.phone || 'N/A'}, EMAIL: ${data.email || 'N/A'}, ADDRESS: ${data.address || 'N/A'}. COMPLAINT: ${data.complaint}. SYMPTOMS: ${data.symptoms} ${data.selectedSymptoms?.join(', ') || ''}. TONGUE: ${data.tongue.body_color}, Coat: ${data.tongue.coating_color} (${data.tongue.coating_quality}), Features: ${data.tongue.special_features?.join(', ') || 'Tidak ada'}. PULSE: ${data.pulse.qualities?.join(', ') || 'Tidak ada'}`;
    handleSendMessage(msg, results, data);
  };

  const toggleLanguage = () => {
    setAppLanguage(prev => prev === Language.INDONESIAN ? Language.ENGLISH : Language.INDONESIAN);
  };

  const handleAtlasPilih = (id: string) => {
    setPilihedAtlasId(id);
    setActivePanel('diagnosis');
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-tcm-primary animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">Loading Session...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) return <LoginScreen onLoginBerhasil={setCurrentUser} />;

  const SidebarTab = ({ id, label, icon: Icon }: { id: typeof activePanel, label: string, icon: any }) => {
    const isActive = activePanel === id;
    return (
      <button 
        onClick={() => {setActivePanel(id); setIsSidebarOpen(false);}} 
        className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
          isActive 
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
          : 'bg-transparent text-purple-600 hover:bg-purple-50 hover:text-purple-900'
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-500'}`} /> 
        {label}
      </button>
    );
  };

  return (
    <ErrorBoundary>
      <div className="flex h-[100dvh] bg-purple-50 text-purple-950 overflow-hidden font-sans">
      <PatientFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit} 
        settings={settings}
      />
      <WuXingVisualizerModal isOpen={isVisualizerOpen} onClose={() => setIsVisualizerOpen(false)} />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-purple-100 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col h-[100dvh] md:h-full shadow-2xl md:shadow-none`}>
        <div className="p-6 flex justify-between items-center border-b border-purple-100 shrink-0">
           <h1 className="text-2xl font-black text-tcm-primary flex items-center gap-2 tracking-tighter"><Activity className="w-8 h-8" /> TCM PRO</h1>
           <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 bg-purple-50 rounded-lg text-purple-400 hover:text-purple-950"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide bg-gradient-to-b from-white to-purple-50/30">
           <SidebarTab id="chat" label={t.chat} icon={MessageSquare} />
           <SidebarTab id="patients" label={t.patients} icon={User} />
           <SidebarTab id="diagnosis" label={t.diagnosis} icon={Stethoscope} />
           <SidebarTab id="acupuncture" label={t.acupuncture} icon={Zap} />
           <SidebarTab id="atlas" label={t.atlas} icon={LayoutGrid} />
           <SidebarTab id="wuxing" label={t.wuxing} icon={Compass} />
           <SidebarTab id="bmi" label={t.bmi} icon={Scale} />
           <SidebarTab id="invoice" label={t.invoice} icon={ClipboardList} />
           <SidebarTab id="history" label={t.history} icon={History} />
        </nav>
        <div className="p-4 border-t border-purple-100 shrink-0 bg-white space-y-3 mb-16 md:mb-0">
           {(currentUser?.role === 'SUPER_SAINT' || currentUser?.role === 'SUPER_USER' || currentUser?.role === 'ADMIN' || (currentUser?.username && ['developertarbiyahcare@gmail.com', 'nvardi75@gmail.com'].includes(currentUser.username))) && (
             <button 
               onClick={() => setIsUserModalOpen(true)}
               className="w-full py-3 bg-purple-50 text-purple-700 border border-purple-100 rounded-2xl font-bold text-[10px] uppercase tracking-wider hover:bg-purple-100 transition-all flex items-center justify-center gap-2 shadow-sm"
             >
               <Settings className="w-4 h-4" /> {t.settings}
             </button>
           )}
           <button onClick={() => setIsFormOpen(true)} className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-purple-200 transition-all active:scale-95 flex items-center justify-center gap-2">
             <UserPlus className="w-4 h-4" /> {t.newPatient}
           </button>
           <button 
             onClick={async () => {
               const { logout } = await import('./services/authService');
               await logout();
               setCurrentUser(null);
               localStorage.removeItem('tcm_active_session');
             }} 
             className="w-full py-2.5 text-gray-400 hover:text-rose-500 transition-colors font-medium text-[10px] flex items-center justify-center gap-1.5"
           >
             <LogOut className="w-3.5 h-3.5" /> {t.logout}
           </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full bg-purple-50 overflow-hidden relative">
        {/* Top Header with Language Toggle */}
        <header className="p-4 md:p-6 bg-white/80 border-b border-purple-50 flex justify-between items-center backdrop-blur-xl z-30 sticky top-0">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2.5 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-100 active:scale-90 transition-all">
                <Menu className="w-6 h-6" />
             </button>
             {currentUser?.provider === 'google' ? (
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">{t.terhubung}</span>
               </div>
             ) : (
               <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">{t.offline}</span>
               </div>
             )}
           </div>
           
            {/* Right side settings - ONLY FOR ADMINS */}
            <div className="flex items-center gap-2">
               {(currentUser?.role === 'SUPER_SAINT' || currentUser?.role === 'SUPER_USER' || currentUser?.role === 'ADMIN' || (currentUser?.username && ['developertarbiyahcare@gmail.com', 'nvardi75@gmail.com'].includes(currentUser.username))) && (
                 <button 
                  onClick={() => setIsUserModalOpen(true)}
                  className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl hover:bg-purple-100 transition-all border border-purple-100 active:scale-90 cursor-pointer"
                  title="System Settings"
                 >
                   <Settings className="w-5 h-5" />
                 </button>
               )}
               <button 
                 onClick={toggleLanguage}
                 className="flex items-center gap-2 px-3 md:px-4 py-2 bg-purple-50 text-purple-700 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-purple-100 hover:bg-purple-100 transition-all active:scale-90 cursor-pointer"
               >
                 <Globe className="w-4 h-4" /> <span>{appLanguage === Language.INDONESIAN ? 'ID' : 'EN'}</span>
               </button>
            </div>
         </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.05),transparent)] pb-24 md:pb-8">
          {activePanel === 'chat' && (
            <div className="max-w-4xl mx-auto space-y-6 pb-20">
              {/* API Key Peringatan Removed */}
              
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className="max-w-[95%] md:max-w-[85%]">
                    <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white border border-purple-100 text-purple-900 rounded-tl-none'}`}>
                      {msg.image && (
                        <div className="mb-3">
                          {msg.image.startsWith('data:image/') ? (
                            <img src={msg.image} alt="Uploaded" className="max-w-xs rounded-xl border border-white/20 shadow-md" />
                          ) : (
                            <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl border border-white/20 w-fit">
                              <Paperclip className="w-5 h-5" />
                              <span className="text-sm font-medium">Dokumen Terlampir</span>
                            </div>
                          )}
                        </div>
                      )}
                      {msg.text}
                    </div>
                    {msg.tcmResult && (
                      <DiagnosisCard 
                        diagnosis={msg.tcmResult} 
                        isPregnant={false} 
                        onShowVisualizer={() => setIsVisualizerOpen(true)} 
                        patientContext={lastPatientForm} 
                      />
                    )}
                  </div>
                </div>
              ))}
              {isMemuat && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-white border border-purple-100 p-4 rounded-3xl rounded-tl-none flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-tcm-primary animate-spin" />
                    <span className="text-xs font-bold text-purple-500 uppercase tracking-widest">
                      {t.analyzing}
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          {activePanel === 'patients' && <PatientDashboard language={appLanguage} />}
          {activePanel === 'diagnosis' && (
            <ScoringAndPointsHub 
              analysis={cdssResults} 
              onAnalyzeRequest={() => setIsFormOpen(true)} 
              patientContext={lastPatientForm} 
              initialSyndromeId={selectedAtlasId}
            />
          )}
          {activePanel === 'atlas' && (
            <SyndromeAtlasWindow onPilihSyndrome={handleAtlasPilih} />
          )}
          {activePanel === 'wuxing' && (
            <div className="space-y-8 max-w-6xl mx-auto">
              <WuXingMasterPanel />
            </div>
          )}
          {activePanel === 'history' && <PatientArchivePanel />}
          {activePanel === 'invoice' && <InvoiceGeneratorPanel />}
          {activePanel === 'bmi' && <BMIKomplitPanel />}
          {activePanel === 'acupuncture' && <AcupuncturePointsPanel />}
          {activePanel === 'ukom' && <UkomPracticePanel />}
          {activePanel === 'wuxing-education' && <WuXingEducationPage />}
        </main>

        {activePanel === 'chat' && (
          <div className="p-4 md:p-6 bg-white/80 backdrop-blur-xl border-t border-purple-100 shrink-0">
            <div className="max-w-4xl mx-auto flex flex-col gap-3">
              {selectedFile && (
                <div className="relative flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200 shadow-sm w-fit pr-12">
                  {selectedFile.type.startsWith('image/') ? (
                    <img src={selectedFile.data} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-purple-200" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                      <Paperclip className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-purple-900 truncate max-w-[200px]">{selectedFile.name}</span>
                    <span className="text-xs text-purple-500 uppercase tracking-wider">{selectedFile.type.split('/')[1] || 'File'}</span>
                  </div>
                  <button 
                    onClick={() => setPilihedFile(null)}
                    className="absolute top-1/2 -translate-y-1/2 right-3 bg-white text-purple-400 rounded-full p-1 hover:bg-purple-100 hover:text-purple-600 transition-colors shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex gap-3">
                <input 
                  type="file" 
                  accept="image/*,application/pdf" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 bg-purple-100 text-purple-600 rounded-2xl hover:bg-purple-200 active:scale-95 transition-all shadow-sm"
                  title="Unggah Gambar atau PDF"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  value={inputText} 
                  onChange={e => setInputText(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                  placeholder={t.placeholder} 
                  className="flex-1 bg-purple-50/50 border border-purple-200 rounded-2xl px-6 py-4 outline-none focus:border-tcm-primary focus:bg-white transition-all text-sm text-purple-950 shadow-inner" 
                />
                <button 
                  onClick={() => handleSendMessage()} 
                  disabled={isMemuat || (!inputText.trim() && !selectedFile)}
                  className="p-4 bg-tcm-primary text-white rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:grayscale"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Bottom Navigation - Ergonomic for Android */}
        <div className="md:hidden bg-white border-t border-purple-100 px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex justify-between items-center z-40 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => setActivePanel('chat')} 
            className={`flex flex-col items-center gap-1 ${activePanel === 'chat' ? 'text-purple-600' : 'text-purple-300'}`}
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Chat</span>
          </button>
          <button 
            onClick={() => setActivePanel('diagnosis')} 
            className={`flex flex-col items-center gap-1 ${activePanel === 'diagnosis' ? 'text-purple-600' : 'text-purple-300'}`}
          >
            <Stethoscope className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">CDSS</span>
          </button>
          <button 
            onClick={() => setActivePanel('patients')} 
            className={`flex flex-col items-center gap-1 ${activePanel === 'patients' ? 'text-purple-600' : 'text-purple-300'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Pasien</span>
          </button>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="flex flex-col items-center gap-1 text-purple-300"
          >
            <Menu className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Menu</span>
          </button>
        </div>

        {isUserModalOpen && (
          <UserManagementModal 
            isOpen={isUserModalOpen} 
            onClose={() => setIsUserModalOpen(false)} 
            currentUser={currentUser} 
          />
        )}
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default App;
