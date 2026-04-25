
import React, { useState, useMemo, useEffect } from 'react';
import { UKOM_QUESTIONS } from '../services/ukomData';
import { Search, GraduationCap, Eye, EyeOff, Filter, ChevronRight, BookOpen, AlertCircle, Timer, Play, Pause, RotateCcw } from 'lucide-react';

const UkomPracticePanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setPilihedTheme] = useState<string>('All');
  const [visibleJawabans, setVisibleJawabans] = useState<Record<number, boolean>>({});
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  const formatWaktu = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const themes = useMemo(() => {
    const set = new Set<string>();
    UKOM_QUESTIONS.forEach(q => q.theme && set.add(q.theme));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredPertanyaans = useMemo(() => {
    return UKOM_QUESTIONS.filter(q => {
      const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           q.discussion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           q.theme?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTheme = selectedTheme === 'All' || q.theme === selectedTheme;
      return matchesSearch && matchesTheme;
    });
  }, [searchTerm, selectedTheme]);

  const toggleJawaban = (id: number) => {
    setVisibleJawabans(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="h-full flex flex-col bg-purple-50 animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-white border-b border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 rounded-2xl border border-purple-200">
            <GraduationCap className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-purple-900 tracking-tight">UKOM Akupunktur</h2>
            <p className="text-sm text-purple-500">Latihan Soal & Pembahasan Uji Kompetensi Nasional</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
            <input 
              type="text"
              placeholder="Cari kata kunci (gejala, titik, sindrom)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-purple-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-purple-900 placeholder-purple-300 focus:border-purple-500 outline-none transition-all"
            />
          </div>
          <div className="w-full md:w-64 relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
             <select 
               value={selectedTheme}
               onChange={(e) => setPilihedTheme(e.target.value)}
               className="w-full bg-white border border-purple-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-purple-900 appearance-none cursor-pointer outline-none focus:border-purple-500"
             >
                {themes.map(t => <option key={t} value={t}>{t}</option>)}
             </select>
          </div>
          <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-xl border border-purple-200">
             <Timer className={`w-4 h-4 ${isTimerActive ? 'text-rose-500 animate-pulse' : 'text-purple-400'}`} />
             <span className="text-sm font-mono font-black text-purple-900 w-12">{formatWaktu(timer)}</span>
             <div className="flex gap-1 border-l border-purple-200 ml-2 pl-2">
                <button 
                  onClick={() => setIsTimerActive(!isTimerActive)}
                  className="p-1 hover:bg-purple-200 rounded transition-colors text-purple-600"
                >
                  {isTimerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button 
                  onClick={() => {setTimer(0); setIsTimerActive(false);}}
                  className="p-1 hover:bg-purple-200 rounded transition-colors text-purple-400"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Pertanyaans List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {filteredPertanyaans.length > 0 ? (
          filteredPertanyaans.map((q) => (
            <div key={q.id} className="bg-white border border-purple-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-purple-300">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                   <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-1 rounded border border-purple-100">
                      SOAL #{q.id} {q.theme && `• ${q.theme}`}
                   </span>
                   <button 
                     onClick={() => toggleJawaban(q.id)}
                     className="text-purple-400 hover:text-purple-600 transition-colors"
                   >
                      {visibleJawabans[q.id] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                   </button>
                </div>
                
                <p className="text-purple-900 leading-relaxed font-medium mb-5">
                   {q.question}
                </p>

                {q.options && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                     {q.options.map((opt, i) => (
                       <div key={i} className="bg-purple-50 border border-purple-100 p-3 rounded-xl text-sm text-purple-700">
                          {opt}
                       </div>
                     ))}
                  </div>
                )}

                {visibleJawabans[q.id] && (
                  <div className="animate-fade-in space-y-4 pt-4 border-t border-purple-100">
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                       <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase mb-2">
                          <ChevronRight className="w-4 h-4" /> Jawaban Benar
                       </div>
                       <p className="text-emerald-900 text-sm font-bold">{q.answer}</p>
                    </div>

                    <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                       <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase mb-2">
                          <BookOpen className="w-4 h-4" /> Pembahasan Klinik
                       </div>
                       <p className="text-purple-800 text-sm leading-relaxed italic">
                          {q.discussion}
                       </p>
                    </div>
                  </div>
                )}

                {!visibleJawabans[q.id] && (
                  <button 
                    onClick={() => toggleJawaban(q.id)}
                    className="w-full py-3 bg-purple-50 hover:bg-purple-100 text-purple-500 hover:text-purple-700 rounded-xl text-xs font-bold uppercase tracking-widest border border-purple-200 border-dashed transition-all"
                  >
                    Tampilkan Jawaban & Pembahasan
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-purple-400">
             <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
             <p>Tidak ada soal yang ditemukan.</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-purple-200 text-center">
         <p className="text-[10px] text-purple-400 uppercase font-mono tracking-widest">
            Total Database: {UKOM_QUESTIONS.length} Cases Integrated
         </p>
      </div>
    </div>
  );
};

export default UkomPracticePanel;
