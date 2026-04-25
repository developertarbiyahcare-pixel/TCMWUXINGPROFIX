
import React, { useMemo, useState, useEffect } from "react";
import {
  Activity, Search, Thermometer, SunMedium, Snowflake, Droplets, Flame, Wind,
  BrainCircuit, ArrowRightCircle, Leaf, Filter, AlertCircle, Layers, Grid
} from "lucide-react";
import { TCM_DB } from "../constants";

type QuadrantId = "DEF_COLD" | "DEF_HEAT" | "EXCESS_COLD" | "EXCESS_HEAT" | "OTHER_DEF" | "OTHER_EXCESS" | "OTHER";

interface Props {
  onPilihSyndrome?: (id: string) => void;
}

const elementColors: Record<string, string> = {
  Wood: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  Fire: "text-rose-400 border-rose-500/30 bg-rose-500/10",
  Earth: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  Metal: "text-slate-100 border-slate-400/30 bg-slate-400/10",
  Water: "text-blue-400 border-blue-500/30 bg-blue-500/10",
};

function classifyQuadrant(patternTipe: string): QuadrantId {
  const t = (patternTipe || "").toLowerCase();
  const isDef = t.includes("def") || t.includes("empty");
  const isExcess = t.includes("full") || t.includes("excess") || t.includes("invasion") || t.includes("stagnation");
  const isHeat = t.includes("heat") || t.includes("fire");
  const isCold = t.includes("cold");

  if (isDef && isCold) return "DEF_COLD";
  if (isDef && isHeat) return "DEF_HEAT";
  if (isExcess && isCold) return "EXCESS_COLD";
  if (isExcess && isHeat) return "EXCESS_HEAT";
  if (isDef) return "OTHER_DEF";
  if (isExcess) return "OTHER_EXCESS";
  return "OTHER";
}

export const SyndromeAtlasWindow: React.FC<Props> = ({ onPilihSyndrome }) => {
  const [selectedId, setPilihedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeElemen, setActiveElemen] = useState<string>("ALL");
  const [activeQuadrant, setActiveQuadrant] = useState<QuadrantId | "ALL">("ALL");

  const allSyndromes = useMemo(() => {
    return Array.from(
      new Map(
        [
          ...(TCM_DB.syndromes.FILLED_FROM_PDF || []),
          ...(TCM_DB.syndromes.TODO_FROM_PDF || [])
        ].map(s => [s.id, s])
      ).values()
    ).map(s => ({
      ...s,
      quadrant: classifyQuadrant(s.pattern_type)
    }));
  }, []);

  const filtered = useMemo(() => {
    return allSyndromes.filter(s => {
      const matchSearch = s.name_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.name_en || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchElemen = activeElemen === "ALL" || (s.wuxing_element && s.wuxing_element.toLowerCase() === activeElemen.toLowerCase());
      const matchQuadrant = activeQuadrant === "ALL" || s.quadrant === activeQuadrant;
      return matchSearch && matchElemen && matchQuadrant;
    });
  }, [allSyndromes, searchTerm, activeElemen, activeQuadrant]);

  // Sync selectedId with the first item in filtered if current selected is gone
  useEffect(() => {
    if (filtered.length > 0 && (!selectedId || !filtered.some(s => s.id === selectedId))) {
      setPilihedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find(s => s.id === selectedId) || null;

  const QuadrantHeader = ({ id, label, icon: Icon, color }: { id: QuadrantId, label: string, icon: any, color: string }) => (
    <button 
      onClick={() => setActiveQuadrant(activeQuadrant === id ? "ALL" : id)}
      className={`flex-1 min-w-[80px] p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
        activeQuadrant === id ? `${color} border-current ring-1 ring-current` : "bg-white border-purple-200 text-purple-400 grayscale opacity-60"
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-[9px] font-black uppercase tracking-wider text-center leading-tight">{label}</span>
    </button>
  );

  return (
    <div className="flex h-full bg-purple-50 text-purple-900 overflow-hidden animate-fade-in">
      
      {/* LEFT: MASTER LIST & DASHBOARD */}
      <aside className="w-full md:w-[400px] flex flex-col border-r border-purple-200 bg-white/50">
         <div className="p-6 border-b border-purple-200">
            <h2 className="text-xl font-black text-purple-700 flex items-center gap-3 mb-4">
              <Layers className="w-6 h-6" /> Atlas Sindrom
            </h2>
            
            <div className="relative mb-6">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
               <input 
                  type="text"
                  placeholder="Cari pola (Ind/Eng)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-purple-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-purple-500 transition-all text-purple-900 placeholder-purple-300"
               />
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
               <QuadrantHeader id="EXCESS_HEAT" label="Excess Heat" icon={Flame} color="text-rose-600 bg-rose-50" />
               <QuadrantHeader id="DEF_HEAT" label="Yin Def" icon={SunMedium} color="text-amber-600 bg-amber-50" />
               <QuadrantHeader id="EXCESS_COLD" label="Excess Cold" icon={Snowflake} color="text-blue-600 bg-blue-50" />
               <QuadrantHeader id="DEF_COLD" label="Yang Def" icon={Droplets} color="text-sky-600 bg-sky-50" />
               <QuadrantHeader id="OTHER_DEF" label="Qi/Blood Def" icon={Leaf} color="text-emerald-600 bg-emerald-50" />
               <QuadrantHeader id="OTHER_EXCESS" label="Stagnation" icon={Wind} color="text-purple-600 bg-purple-50" />
            </div>

            <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
               {["ALL", "Wood", "Fire", "Earth", "Metal", "Water"].map(el => (
                 <button 
                  key={el}
                  onClick={() => setActiveElemen(el)}
                  className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase transition-all border ${
                    activeElemen === el ? "bg-purple-500 border-purple-400 text-white" : "bg-white border-purple-200 text-purple-500 hover:bg-purple-50"
                  }`}
                 >
                   {el}
                 </button>
               ))}
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
            {filtered.map(s => (
               <button 
                key={s.id}
                onClick={() => setPilihedId(s.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all border group ${
                  selected?.id === s.id ? "bg-purple-50 border-purple-400 shadow-sm" : "bg-white border-purple-200 hover:border-purple-300"
                }`}
               >
                 <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-purple-900 group-hover:text-purple-700 transition-colors">{s.name_id}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${elementColors[s.wuxing_element || ''] || 'text-purple-500'}`}>
                       {s.wuxing_element}
                    </span>
                 </div>
                 <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] text-purple-500 italic truncate flex-1">{s.name_en}</p>
                 </div>
                 <div className="flex gap-1">
                    {(s.primary_organs || []).map(org => (
                      <span key={org} className="text-[8px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-md border border-purple-200">{org}</span>
                    ))}
                 </div>
               </button>
            ))}
            {filtered.length === 0 && (
               <div className="text-center py-20 text-purple-400">
                  <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Pola tidak ditemukan</p>
               </div>
            )}
         </div>
      </aside>

      {/* RIGHT: DETAILED ANALYSIS VIEW */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12 scroll-smooth scrollbar-hide bg-purple-50">
        {selected ? (
          <div className="max-w-4xl mx-auto space-y-12 animate-slide-in-right pb-24">
             <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-purple-200 pb-8">
                <div className="flex-1">
                   <div className="flex items-center gap-4 mb-2">
                      <h1 className="text-4xl md:text-5xl font-black text-purple-900 uppercase tracking-tighter">{selected.name_id}</h1>
                   </div>
                   <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-lg text-purple-600 font-medium italic">{selected.name_en}</span>
                      {selected.name_zh && (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-300"></span>
                          <span className="text-lg text-purple-500 font-medium">{selected.name_zh}</span>
                        </>
                      )}
                      {selected.name_pinyin && (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-300"></span>
                          <span className="text-sm text-purple-400">{selected.name_pinyin}</span>
                        </>
                      )}
                   </div>
                   <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">{selected.pattern_type.replace(/_/g, ' ')}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${elementColors[selected.wuxing_element || ''] || 'text-purple-600 bg-white border-purple-200'}`}>{selected.wuxing_element}</span>
                      {selected.primary_organs && selected.primary_organs.length > 0 && (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-300"></span>
                          <div className="flex gap-1">
                            {selected.primary_organs.map(org => (
                              <span key={org} className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-white px-3 py-1 rounded-full border border-purple-200">{org}</span>
                            ))}
                          </div>
                        </>
                      )}
                   </div>
                </div>
                {onPilihSyndrome && (
                  <button 
                    onClick={() => onPilihSyndrome(selected.id)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-purple-900/20 transition-all active:scale-95"
                  >
                    <ArrowRightCircle className="w-5 h-5" /> Analisis Sekarang
                  </button>
                )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-white p-8 rounded-3xl border border-purple-200 shadow-sm">
                   <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                     <Thermometer className="w-4 h-4" /> Tanda-Tanda Klinis
                   </h3>
                   <ul className="space-y-3">
                      {(selected.clinical_manifestations || []).map((m, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-purple-800">
                           <div className="w-1 h-4 bg-purple-400/50 rounded-full shrink-0 mt-0.5" />
                           {m}
                        </li>
                      ))}
                   </ul>
                   <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                         <span className="text-[9px] font-black text-purple-400 uppercase block mb-1">Lidah</span>
                         <p className="text-xs text-purple-900 font-bold">{(selected.tongue || []).join(' • ') || 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                         <span className="text-[9px] font-black text-purple-400 uppercase block mb-1">Nadi</span>
                         <p className="text-xs text-purple-900 font-bold">{(selected.pulse || []).join(' • ') || 'N/A'}</p>
                      </div>
                   </div>
                </section>

                <div className="space-y-8">
                   <section className="bg-white p-8 rounded-3xl border border-purple-200 shadow-sm">
                      <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4" /> Prinsip Terapi
                      </h3>
                      <div className="space-y-4">
                         {(selected.treatment_principle || []).map((p, i) => (
                           <div key={i} className="text-lg font-bold text-purple-900 leading-tight">
                              {p}
                           </div>
                         ))}
                      </div>
                      <div className="mt-8 border-t border-purple-100 pt-6">
                         <span className="text-[10px] font-black text-purple-400 uppercase mb-4 block">Titik Utama</span>
                         <div className="flex flex-wrap gap-2">
                            {(selected.acupuncture_points || []).map((pt: any) => (
                               <span key={pt} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl border border-purple-200 text-xs font-black">{pt}</span>
                            ))}
                         </div>
                      </div>
                   </section>

                   <section className="bg-purple-100/50 p-8 rounded-3xl border border-purple-200 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none -mr-8 -mt-8 text-purple-900">
                         <AlertCircle className="w-full h-full" />
                      </div>
                      <h3 className="text-xs font-black text-purple-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Mutiara Klinis
                      </h3>
                      
                      {selected.key_symptoms && selected.key_symptoms.length > 0 && (
                        <div className="mb-4">
                          <span className="text-[10px] font-black text-purple-500 uppercase mb-2 block">Gejala Kunci</span>
                          <ul className="space-y-1">
                            {selected.key_symptoms.map((ks, i) => (
                              <li key={i} className="text-sm text-purple-800 flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span> {ks}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selected.diagnostic_tip && (
                        <div className="mb-4">
                          <span className="text-[10px] font-black text-purple-500 uppercase mb-2 block">Kiat Diagnosis</span>
                          <p className="text-sm text-purple-800 italic">
                            "{selected.diagnostic_tip}"
                          </p>
                        </div>
                      )}

                      {selected.needling_method && (
                        <div>
                          <span className="text-[10px] font-black text-purple-500 uppercase mb-2 block">Metode Penusukan</span>
                          <p className="text-sm text-purple-800">
                            {selected.needling_method}
                          </p>
                        </div>
                      )}
                      
                      {(!selected.key_symptoms?.length && !selected.diagnostic_tip && !selected.needling_method) && (
                        <p className="text-sm text-purple-800/50 italic">
                          Mutiara klinis detail tidak tersedia untuk sindrom ini.
                        </p>
                      )}
                   </section>
                </div>
             </div>
             
             <div className="pt-20 border-t border-purple-200 text-center">
                <p className="text-[10px] text-purple-400 uppercase tracking-[0.5em] font-mono">
                   Atlas Sindrom Database v{TCM_DB.metadata.version} • Powered by TCM WuXing Engine
                </p>
             </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-purple-200">
             <Grid className="w-20 h-20 opacity-50" />
          </div>
        )}
      </main>
    </div>
  );
};

export default SyndromeAtlasWindow;
