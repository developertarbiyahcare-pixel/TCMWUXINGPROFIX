
import React, { useState, useEffect, useRef } from 'react';
import { ScoredSyndrome, RxPoint, TcmDiagnosisResult } from '../types';
import { TCM_DB } from '../constants';
import { getHerbalRecommendation } from '../services/tcmLogic';
import { Activity, CheckCircle, MapPin, ArrowRight, BrainCircuit, Printer, Leaf, Loader2, ArrowLeft, Plus, Trash2, Syringe, X, FileText, Camera, Stethoscope, Download } from 'lucide-react';
import BodyMapSekarangJadi from './BodyMapSekarangJadi'; 
import DoctorNoteModal from './DoctorNoteModal';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Props {
  analysis: ScoredSyndrome[];
  onAnalyzeRequest: () => void;
  initialSyndromeId?: string;
  isAnalyzing?: boolean;
  onKembali?: () => void;
  patientContext?: any;
}

const ScoringAndPointsHub: React.FC<Props> = ({ analysis, onAnalyzeRequest, initialSyndromeId, isAnalyzing = false, onKembali, patientContext }) => {
  const [selectedSyndrome, setPilihedSyndrome] = useState<ScoredSyndrome | null>(null);
  const [manualPoints, setManualPoints] = useState<RxPoint[]>([]);
  const [manualInput, setManualInput] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSyndromeId) {
        const allSyndromes = [...TCM_DB.syndromes.FILLED_FROM_PDF, ...TCM_DB.syndromes.TODO_FROM_PDF];
        const found = allSyndromes.find(s => s.id === initialSyndromeId);
        if (found) {
            const existingInAnalysis = (analysis || []).find(a => a.syndrome.id === initialSyndromeId);
            if (existingInAnalysis) {
                setPilihedSyndrome(existingInAnalysis);
            } else {
                let mockPoints: RxPoint[] = Array.isArray(found.acupuncture_points) 
                    ? found.acupuncture_points.map(code => ({ code, role: 'kausal', source: 'manual', note: 'Titik Basis Data' }))
                    : [];

                setPilihedSyndrome({
                    syndrome: found,
                    score: 0, 
                    points: mockPoints,
                    warnings: [],
                    rationale: ["Pilihan Manual dari Atlas"],
                    herbal_recommendation: getHerbalRecommendation(found),
                });
            }
        }
    }
  }, [initialSyndromeId, analysis]);

  useEffect(() => {
    if (!selectedSyndrome && analysis?.length > 0) {
        setPilihedSyndrome(analysis[0]);
    }
  }, [analysis, selectedSyndrome]);

  const handleAddManualPoint = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualInput.trim()) return;
    const code = manualInput.toUpperCase().trim();
    if (!manualPoints.some(p => p.code === code)) {
        setManualPoints([...manualPoints, { code, role: 'manual', source: 'user_add', note: 'Input Manual User' }]);
    }
    setManualInput('');
  };

  const activePoints = selectedSyndrome ? [...(selectedSyndrome.points || []), ...manualPoints] : [];

  const diagnosisForModal: TcmDiagnosisResult | null = selectedSyndrome ? {
      patternId: selectedSyndrome.syndrome.name_id,
      confidence: selectedSyndrome.score / 100,
      explanation: selectedSyndrome.rationale?.join('\n') || "Analisis CDSS",
      recommendedPoints: activePoints.map(p => ({ code: p.code, description: p.note || p.role })),
      lifestyleAdvice: "Ikuti protokol diet dan istirahat sesuai pola sindrom yang ditemukan.",
      herbal_recommendation: selectedSyndrome.herbal_recommendation,
      wuxingElemen: selectedSyndrome.syndrome.wuxing_element
  } : null;

  return (
    <div className="flex h-full p-4 gap-4 print:p-0">
      {diagnosisForModal && showNoteModal && (
          <DoctorNoteModal 
            isOpen={showNoteModal} 
            onClose={() => setShowNoteModal(false)} 
            diagnosis={diagnosisForModal}
            initialPatientData={{ name: patientContext?.patientName, age: patientContext?.age }}
          />
      )}

      {/* List Analysis */}
      <div className="w-1/3 min-h-full bg-white border border-purple-100 rounded-3xl p-5 shadow-xl flex flex-col">
        <h2 className="text-lg font-black text-purple-950 uppercase tracking-tighter mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-tcm-primary" /> Analisis CDSS
        </h2>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
            {analysis.length > 0 ? analysis.map((res) => (
              <div 
                key={res.syndrome.id}
                onClick={() => { setPilihedSyndrome(res); setManualPoints([]); }}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  selectedSyndrome?.syndrome.id === res.syndrome.id 
                    ? 'bg-purple-50 border-tcm-primary shadow-md' 
                    : 'bg-white border-purple-100 hover:bg-purple-50/50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-purple-900 text-sm">{res.syndrome.name_id}</span>
                    <span className="text-xs font-black text-tcm-primary">{Math.round(res.score)}%</span>
                </div>
                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">{res.syndrome.primary_organs?.join(' & ')}</p>
              </div>
            )) : <p className="text-purple-400 text-xs italic text-center py-10">Data pasien diperlukan.</p>}
        </div>
        <button onClick={onAnalyzeRequest} className="mt-4 w-full py-4 bg-tcm-primary hover:brightness-110 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-purple-900/20 transition-all active:scale-95">
            Diagnosa Baru
        </button>
      </div>

      {/* Detail & Map */}
      <div ref={contentRef} className="flex-1 bg-white border border-purple-100 rounded-3xl p-6 shadow-xl flex flex-col relative overflow-hidden">
        {selectedSyndrome ? (
          <>
            <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="text-2xl font-black text-purple-950 tracking-tighter">{selectedSyndrome.syndrome.name_id}</h3>
                   <p className="text-xs text-purple-500 font-bold uppercase tracking-widest">{selectedSyndrome.syndrome.name_en}</p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setShowNoteModal(true)} className="px-4 py-2.5 bg-tcm-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-md transition-all active:scale-95 hover:brightness-110">
                      <FileText className="w-4 h-4" /> Nota / Resep
                   </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
               <div className="bg-purple-50/50 border border-purple-100 rounded-3xl overflow-hidden relative shadow-inner">
                  <BodyMapSekarangJadi points={activePoints} />
               </div>
               
               <div className="flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">
                  <div className="bg-purple-50/50 border border-purple-100 p-5 rounded-2xl shadow-sm">
                     <span className="text-[10px] font-black text-tcm-primary uppercase tracking-widest mb-4 block flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Daftar Titik Aktif
                     </span>
                     <div className="flex flex-wrap gap-2">
                        {activePoints.map((p, i) => (
                          <div key={i} className={`px-2 py-1 rounded-lg border text-[10px] font-black flex items-center gap-2 ${p.role === 'manual' ? 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700' : 'bg-white border-purple-200 text-purple-700 shadow-sm'}`}>
                             {p.code}
                             {p.role === 'manual' && <X className="w-3 h-3 cursor-pointer" onClick={() => setManualPoints(manualPoints.filter(mp => mp.code !== p.code))} />}
                          </div>
                        ))}
                     </div>
                     <form onSubmit={handleAddManualPoint} className="mt-4 flex gap-2">
                        <input value={manualInput} onChange={e => setManualInput(e.target.value)} placeholder="Tambah titik..." className="flex-1 bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-xs text-purple-900 outline-none focus:border-tcm-primary uppercase shadow-inner" />
                        <button type="submit" className="p-2 bg-purple-100 hover:bg-purple-200 rounded-xl border border-purple-200 text-purple-700 transition-colors"><Plus className="w-4 h-4"/></button>
                     </form>
                  </div>
                  
                  {selectedSyndrome.herbal_recommendation && (
                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl shadow-sm">
                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 block">Rekomendasi Herbal</span>
                       <p className="text-sm font-bold text-emerald-950 mb-2">{selectedSyndrome.herbal_recommendation.formula_name}</p>
                       <p className="text-[10px] text-emerald-700/80 leading-relaxed italic">{selectedSyndrome.herbal_recommendation.chief.join(', ')}</p>
                    </div>
                  )}
               </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-purple-300 gap-4">
             <Stethoscope className="w-12 h-12 opacity-50" />
             <p className="text-sm font-bold uppercase tracking-widest text-purple-400">Silakan pilih sindrom dari daftar kiri</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoringAndPointsHub;
