
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../services/db';
import { SavedPatient } from '../types';
import { 
  Search, Trash2, User, Calendar, FileText, ChevronRight, Activity, X, RotateCcw, 
  BrainCircuit, MapPin, Stethoscope, Pill, Clipboard, TrendingUp, CheckCircle2, 
  PlusCircle, MinusCircle, AlertCircle, Clock, History, BarChart3, ShieldAlert, RefreshCw,
  Phone, Mail
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db as firestore, auth } from '../firebase';

interface Props {
  onLoadPatient: (patient: SavedPatient) => void;
}

const PatientArchivePanel: React.FC<Props> = ({ onLoadPatient }) => {
  const [patients, setPatients] = useState<SavedPatient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setPilihedPatient] = useState<SavedPatient | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Replaced Firebase onSnapshot with our standard db.patients.getAll fallback loader
    const fetchPatients = async () => {
      const data = await db.patients.getAll();
      setPatients(data);
    };
    fetchPatients();
  }, []);

  const loadPatients = async () => {
    setIsRefreshing(true);
    const data = await db.patients.getAll();
    setPatients(data);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Hapus data pasien ini secara permanen dari database lokal?')) {
      await db.patients.delete(id);
      await loadPatients();
      if (selectedPatient?.id === id) setPilihedPatient(null);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.complaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.biomedicalDiagnosis && p.biomedicalDiagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- HISTORICAL ANALYSIS LOGIC ---
  const allVisits = useMemo(() => {
    if (!selectedPatient) return [];
    return patients
        .filter(p => p.patientName.toLowerCase() === selectedPatient.patientName.toLowerCase())
        .sort((a, b) => b.timestamp - a.timestamp);
  }, [selectedPatient, patients]);

  const getSymptomEvolution = () => {
    if (!selectedPatient || allVisits.length < 2) return null;
    
    const currentIndex = allVisits.findIndex(v => v.id === selectedPatient.id);
    const previousVisit = allVisits[currentIndex + 1];
    
    if (!previousVisit) return null;

    const currentSymptoms = selectedPatient.selectedSymptoms || [];
    const previousSymptoms = previousVisit.selectedSymptoms || [];

    const persistent = currentSymptoms.filter(s => previousSymptoms.includes(s));
    const newSymptoms = currentSymptoms.filter(s => !previousSymptoms.includes(s));
    const resolved = previousSymptoms.filter(s => !currentSymptoms.includes(s));

    return { persistent, newSymptoms, resolved, previousTanggal: new Date(previousVisit.timestamp).toLocaleDateString() };
  };

  const evolution = getSymptomEvolution();

  // Calculate symptom frequency across all visits
  const symptomFrequency = useMemo(() => {
    const freq: Record<string, number> = {};
    allVisits.forEach(v => {
      (v.selectedSymptoms || []).forEach(s => {
        freq[s] = (freq[s] || 0) + 1;
      });
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]);
  }, [allVisits]);

  return (
    <div className="h-full flex flex-col md:flex-row bg-purple-50 text-purple-900 overflow-hidden animate-fade-in">
      {/* Sidebar Daftar Pasien */}
      <div className="w-full md:w-80 border-r border-purple-200 bg-white flex flex-col shrink-0 shadow-sm z-10">
        <div className="p-4 border-b border-purple-200 flex justify-between items-center bg-purple-50">
           <h2 className="text-xl font-bold text-tcm-primary">Arsip Pasien</h2>
           <button 
             onClick={loadPatients}
             className={`p-2 hover:bg-purple-100 rounded-lg transition-all ${isRefreshing ? 'animate-spin text-tcm-primary' : 'text-purple-400'}`}
           >
             <RefreshCw className="w-4 h-4" />
           </button>
        </div>
        <div className="p-4 border-b border-purple-200">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input 
                type="text" 
                placeholder="Cari nama / penyakit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-purple-50 border border-purple-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:border-tcm-primary focus:ring-1 focus:ring-tcm-primary outline-none transition-all placeholder-purple-300"
              />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
           {filteredPatients.map(p => (
             <button 
               key={p.id}
               onClick={() => setPilihedPatient(p)}
               className={`w-full text-left p-3 rounded-xl transition-all border ${
                 selectedPatient?.id === p.id 
                 ? 'bg-purple-100 border-purple-300 shadow-sm' 
                 : 'bg-white border-transparent hover:bg-purple-50'
               }`}
             >
                <div className="flex justify-between items-start">
                   <span className="font-bold text-purple-900">{p.patientName || 'Anonim'}</span>
                   <span className="text-[10px] text-purple-400">{new Date(p.timestamp).toLocaleDateString()}</span>
                </div>
                {p.biomedicalDiagnosis && (
                   <p className="text-[10px] text-purple-600 font-bold uppercase truncate">{p.biomedicalDiagnosis}</p>
                )}
                <p className="text-xs text-purple-500 mt-1 line-clamp-1 italic">"{p.complaint}"</p>
                <div className="flex justify-between items-center mt-2">
                   <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-tcm-primary uppercase font-bold tracking-tighter">
                      {p.diagnosis.patternId.replace(/_/g, ' ')}
                   </span>
                   <Trash2 
                    className="w-3.5 h-3.5 text-purple-300 hover:text-rose-500 cursor-pointer transition-colors" 
                    onClick={(e) => handleDelete(e, p.id)}
                   />
                </div>
             </button>
           ))}
           {filteredPatients.length === 0 && (
             <div className="text-center py-20 px-6">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                   <Activity className="w-8 h-8 text-purple-300" />
                </div>
                <p className="text-purple-400 text-sm italic">Belum ada pasien tersimpan.</p>
                <p className="text-[10px] text-purple-300 mt-2 uppercase">Gunakan tombol Disket pada hasil diagnosa untuk menyimpan.</p>
             </div>
           )}
        </div>
      </div>

      {/* Detail Pasien */}
      <div className="flex-1 overflow-y-auto bg-white p-6 md:p-10 relative scrollbar-hide">
         {!selectedPatient ? (
           <div className="h-full flex flex-col items-center justify-center text-purple-300">
              <User className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-xs">Pilih pasien untuk melihat rekam medis</p>
           </div>
         ) : (
           <div className="max-w-4xl mx-auto space-y-8 animate-slide-in-right">
              {/* Patient Profile Header */}
              <div className="flex flex-col md:flex-row justify-between items-start border-b border-purple-100 pb-6 gap-4">
                 <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-3xl font-black text-purple-900">{selectedPatient.patientName || 'Anonim'}</h1>
                      <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                         {allVisits.length} Visits
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-purple-500">
                       <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(selectedPatient.timestamp).toLocaleString()}</span>
                       <span>Umur: {selectedPatient.age} th</span>
                       <span className="uppercase font-semibold text-tcm-primary">{selectedPatient.sex}</span>
                       {selectedPatient.phone && (
                          <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {selectedPatient.phone}</span>
                       )}
                       {selectedPatient.email && (
                          <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {selectedPatient.email}</span>
                       )}
                       {selectedPatient.address && (
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedPatient.address}</span>
                       )}
                    </div>
                 </div>
                 <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => onLoadPatient(selectedPatient)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-sm transition-all border border-purple-500"
                    >
                        <BrainCircuit className="w-4 h-4" /> Muat ke CDSS
                    </button>
                    <button onClick={() => setPilihedPatient(null)} className="md:hidden p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"><X className="w-6 h-6"/></button>
                 </div>
              </div>

              {/* Medical Context Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-sm font-black text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <History className="w-4 h-4" /> Past Riwayat Medis
                    </h3>
                    <div className="bg-white p-4 rounded-xl border border-purple-100 min-h-[80px]">
                       <p className="text-xs text-purple-700 leading-relaxed">
                          {selectedPatient.medicalHistory || "Tidak ada catatan riwayat medis."}
                       </p>
                    </div>
                 </div>
                 <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-sm font-black text-rose-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <ShieldAlert className="w-4 h-4" /> Alergi / Catatan
                    </h3>
                    <div className="bg-white p-4 rounded-xl border border-purple-100 min-h-[80px]">
                       <p className="text-xs text-purple-700 leading-relaxed">
                          {selectedPatient.notes || "Tidak ada catatan alergi atau kontraindikasi."}
                       </p>
                    </div>
                 </div>
              </div>

              {/* Visit Waktuline Navigator */}
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl overflow-x-auto scrollbar-hide shadow-sm">
                <div className="flex gap-4 min-w-max">
                  {allVisits.map((visit, idx) => (
                    <button 
                      key={visit.id}
                      onClick={() => setPilihedPatient(visit)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                        selectedPatient.id === visit.id 
                        ? 'bg-tcm-primary border-tcm-primary shadow-sm' 
                        : 'bg-white border-purple-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <span className={`text-[9px] font-black uppercase ${selectedPatient.id === visit.id ? 'text-white' : 'text-purple-400'}`}>
                        {idx === 0 ? 'Current' : idx === 1 ? 'Last' : `Visit ${allVisits.length - idx}`}
                      </span>
                      <span className={`text-xs font-bold ${selectedPatient.id === visit.id ? 'text-white' : 'text-purple-900'}`}>
                        {new Date(visit.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptom Frequency & Persistence Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-purple-50 border border-purple-200 p-6 rounded-2xl shadow-sm">
                   <h3 className="text-sm font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                      <BarChart3 className="w-4 h-4" /> Chronic Symptom Profile
                   </h3>
                   <div className="space-y-4">
                      {symptomFrequency.slice(0, 5).map(([symptom, count]) => (
                        <div key={symptom}>
                           <div className="flex justify-between items-center mb-1.5">
                              <span className="text-xs font-bold text-purple-900">{symptom}</span>
                              <span className="text-[10px] text-purple-500 font-black uppercase tracking-widest">
                                 {Math.round((count / allVisits.length) * 100)}% Persistence
                              </span>
                           </div>
                           <div className="h-1.5 bg-white rounded-full overflow-hidden border border-purple-200">
                              <div 
                                className="h-full bg-amber-400 transition-all duration-1000" 
                                style={{ width: `${(count / allVisits.length) * 100}%` }}
                              />
                           </div>
                        </div>
                      ))}
                      {symptomFrequency.length === 0 && <p className="text-xs text-purple-400 italic">No persistent symptoms recorded.</p>}
                   </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl flex flex-col justify-center items-center text-center shadow-sm">
                   <div className="p-4 bg-purple-100 rounded-full border border-purple-200 mb-4">
                      <Clock className="w-8 h-8 text-purple-600" />
                   </div>
                   <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1">Observation Period</h4>
                   <p className="text-xl font-black text-purple-900">
                      {allVisits.length > 1 ? (
                        Math.round((allVisits[0].timestamp - allVisits[allVisits.length-1].timestamp) / (1000 * 60 * 60 * 24))
                      ) : 0} Haris
                   </p>
                   <p className="text-[10px] text-purple-400 mt-1 uppercase font-bold">Total care history duration</p>
                </div>
              </div>

              {/* Detailed Symptom Evolution (vs Previous) */}
              {evolution && (
                 <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                       <History className="w-20 h-20 text-purple-900" />
                    </div>
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-sm font-black text-tcm-primary uppercase tracking-widest flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" /> Comparison: Current vs {evolution.previousTanggal}
                       </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="bg-white p-5 rounded-2xl border border-purple-200 transition-all hover:border-emerald-300 shadow-sm">
                          <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase mb-4">
                             <CheckCircle2 className="w-4 h-4" /> Stable (Persistent)
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {evolution.persistent.length > 0 ? evolution.persistent.map(s => (
                               <span key={s} className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">{s}</span>
                             )) : <span className="text-[10px] text-purple-400 italic">No stable symptoms.</span>}
                          </div>
                       </div>
                       
                       <div className="bg-white p-5 rounded-2xl border border-purple-200 transition-all hover:border-rose-300 shadow-sm">
                          <div className="flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase mb-4">
                             <PlusCircle className="w-4 h-4" /> New Manifestations
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {evolution.newSymptoms.length > 0 ? evolution.newSymptoms.map(s => (
                               <span key={s} className="px-3 py-1 rounded-xl bg-rose-50 text-rose-700 text-[10px] font-black border border-rose-200">{s}</span>
                             )) : <span className="text-[10px] text-purple-400 italic">No new symptoms.</span>}
                          </div>
                       </div>

                       <div className="bg-white p-5 rounded-2xl border border-purple-200 transition-all hover:border-purple-400 shadow-sm">
                          <div className="flex items-center gap-2 text-purple-600 font-black text-[10px] uppercase mb-4">
                             <MinusCircle className="w-4 h-4" /> Resolved (Berhasil)
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {evolution.resolved.length > 0 ? evolution.resolved.map(s => (
                               <span key={s} className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 text-[10px] font-black border border-purple-200">{s}</span>
                             )) : <span className="text-[10px] text-purple-400 italic">No resolution observed.</span>}
                          </div>
                       </div>
                    </div>
                 </div>
              )}

              {/* Diagnostic Snapshot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-purple-50 border border-tcm-primary/30 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-sm font-black text-tcm-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Stethoscope className="w-4 h-4" /> Diagnosis Snapshot
                    </h3>
                    <div className="space-y-3">
                       <div className="bg-white p-4 rounded-xl border border-purple-200">
                          <span className="text-[9px] text-purple-500 uppercase font-black block mb-1">Western Biomedical</span>
                          <span className="text-lg font-black text-purple-900">{selectedPatient.biomedicalDiagnosis || 'General Wellness'}</span>
                          {selectedPatient.icd10 && (
                             <span className="ml-2 text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded border border-purple-200 font-black">ICD: {selectedPatient.icd10}</span>
                          )}
                       </div>
                       <div className="bg-white p-4 rounded-xl border border-purple-200">
                          <span className="text-[9px] text-purple-500 uppercase font-black block mb-1">Primary Complaint</span>
                          <p className="text-xs text-purple-700 italic leading-relaxed">"{selectedPatient.complaint}"</p>
                       </div>
                    </div>
                 </div>

                 <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-sm font-black text-tcm-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Activity className="w-4 h-4" /> TCM Pattern Analysis
                    </h3>
                    <div className="space-y-3">
                       <h4 className="text-xl font-black text-emerald-900 border-b border-emerald-200 pb-3 uppercase tracking-tighter">
                         {selectedPatient.diagnosis.patternId.replace(/_/g, ' ')}
                       </h4>
                       <div className="flex items-center justify-between mb-4">
                          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200 font-black text-[10px] uppercase tracking-widest">
                             Confidence: {Math.round(selectedPatient.diagnosis.confidence * 100)}%
                          </div>
                       </div>
                       <p className="text-sm text-emerald-800 leading-relaxed font-medium">
                          {selectedPatient.diagnosis.explanation}
                       </p>
                    </div>
                 </div>
              </div>

              {/* Physical Markers Section */}
              <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl shadow-sm">
                 <h3 className="text-sm font-black text-purple-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Clipboard className="w-4 h-4" /> Physical Exam Markers
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    <div className="space-y-4">
                       <div className="bg-white p-4 rounded-xl border border-purple-200">
                          <span className="block text-[9px] text-purple-500 font-black uppercase mb-2">Subjective Sensation</span>
                          <p className="text-purple-900 font-medium">Lidah: {selectedPatient.tongue.body_color} Body, {selectedPatient.tongue.coating_quality} {selectedPatient.tongue.coating_color} coat</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                             {selectedPatient.tongue.special_features?.map(f => (
                               <span key={f} className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[9px] font-bold rounded border border-purple-200">{f}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                    <div>
                       <div className="bg-white p-4 rounded-xl border border-purple-200 h-full flex flex-col justify-center">
                          <span className="block text-[9px] text-purple-500 font-black uppercase mb-2">Nadi Palpation</span>
                          <div className="flex flex-wrap gap-2">
                            {selectedPatient.pulse.qualities?.map(q => (
                              <span key={q} className="px-3 py-1 bg-purple-100 text-purple-800 text-[10px] font-black rounded-lg border border-purple-200 uppercase tracking-tighter">
                                {q}
                              </span>
                            )) || <span className="text-purple-400">N/A</span>}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Interactive Footer */}
              <div className="flex justify-center py-10 border-t border-purple-100">
                 <button 
                    onClick={() => {
                        if (window.confirm("Restore this diagnostic session to the active CDSS interface?")) {
                            onLoadPatient(selectedPatient);
                        }
                    }}
                    className="flex items-center gap-3 text-purple-400 hover:text-purple-700 transition-all text-[10px] font-black uppercase tracking-[0.3em] group"
                 >
                    <RotateCcw className="w-5 h-5 group-hover:rotate-[-90deg] transition-transform" /> Restore Session Data
                 </button>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default PatientArchivePanel;
