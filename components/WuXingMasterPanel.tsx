
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TCM_DB } from '../constants';
import { 
  ArrowRight, Loader2, Info, ChevronDown, Target, Filter, 
  LayoutGrid, Map as MapIcon, X, Search, Activity, 
  BookOpen, Heart, Brain, Zap, Waves, Wind, Mountain, 
  Smile, Frown, AlertCircle, Clock
} from 'lucide-react';
import { WuXingInteractiveDiagram } from './WuXingInteractiveDiagram';

interface Props {
  onPilihSyndrome?: (id: string) => void;
  isMemuat?: boolean;
}

const elements = [
  { 
    name: 'wood', display: 'Wood (Kayu)', 
    color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/50', shadowColor: 'shadow-emerald-900/50',
    keywords: ['Liver', 'Gall', 'Wood', 'Hati', 'Empedu'],
    organs: ['Liver', 'Gall Bladder'],
    tagline: 'Aliran Qi & Fleksibilitas'
  },
  { 
    name: 'fire', display: 'Fire (Api)', 
    color: 'text-rose-400', bgColor: 'bg-rose-500/10', borderColor: 'border-rose-500/50', shadowColor: 'shadow-rose-900/50',
    keywords: ['Heart', 'Small Intestine', 'Pericardium', 'San Jiao', 'Fire', 'Jantung'],
    organs: ['Heart', 'Small Intestine', 'Pericardium', 'San Jiao'],
    tagline: 'Vitalitas & Kesadaran'
  },
  { 
    name: 'earth', display: 'Earth (Tanah)', 
    color: 'text-amber-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-amber-500/50', shadowColor: 'shadow-amber-900/50',
    keywords: ['Spleen', 'Stomach', 'Earth', 'Limpa', 'Lambung'],
    organs: ['Spleen', 'Stomach'],
    tagline: 'Transformasi & Nutrisi'
  },
  { 
    name: 'metal', display: 'Metal (Logam)', 
    color: 'text-slate-100', bgColor: 'bg-slate-400/10', borderColor: 'border-slate-300/50', shadowColor: 'shadow-slate-500/50',
    keywords: ['Lung', 'Large Intestine', 'Metal', 'Paru', 'Usus Besar'],
    organs: ['Lung', 'Large Intestine'],
    tagline: 'Respirasi & Pertahanan'
  },
  { 
    name: 'water', display: 'Water (Air)', 
    color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/50', shadowColor: 'shadow-blue-900/50',
    keywords: ['Kidney', 'Bladder', 'Water', 'Ginjal', 'Kandung Kemih'],
    organs: ['Kidney', 'Bladder'],
    tagline: 'Esensi & Akar Kehidupan'
  },
];

const WuXingMasterPanel: React.FC<Props> = ({ onPilihSyndrome, isMemuat = false }) => {
  const [diagramPilihion, setDiagramPilihion] = useState<string | null>(null);
  const [organFilter, setOrganFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allSyndromes = useMemo(() => Array.from(
    new Map(
      [
        ...(TCM_DB.syndromes.FILLED_FROM_PDF || []),
        ...(TCM_DB.syndromes.TODO_FROM_PDF || [])
      ].map(s => [s.id, s])
    ).values()
  ), []);

  const handleElemenPilih = (el: string | null) => {
    setOrganFilter(null);
    setDiagramPilihion(el);
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOrganFilter = (org: string) => {
    setOrganFilter(org);
    const foundEl = elements.find(e => e.organs.includes(org));
    if (foundEl) setDiagramPilihion(foundEl.name);
  };

  const clearAllFilters = () => {
    setDiagramPilihion(null);
    setOrganFilter(null);
    setSearchQuery('');
  };

  const getFilteredSyndromes = (elName: string) => {
    const el = elements.find(e => e.name === elName);
    if (!el) return [];
    
    return allSyndromes.filter(s => {
      const q = searchQuery.toLowerCase();
      const matchSearch = q === '' || (s.name_id || "").toLowerCase().includes(q) || (s.name_en || "").toLowerCase().includes(q);
      
      if (!matchSearch) return false;

      if (organFilter) {
          return (s.primary_organs || []).some(o => o.toLowerCase() === organFilter.toLowerCase());
      }
      
      if (s.wuxing_element && s.wuxing_element.toLowerCase().startsWith(elName.toLowerCase())) return true;
      
      const text = ((s.name_en || "") + " " + (s.name_id || "") + " " + (s.primary_organs || []).join(" ")).toLowerCase();
      return el.keywords.some(k => text.includes(k.toLowerCase()));
    });
  };

  const OrganEncyclopedia = () => (
    <div className="mt-4 pb-20 space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-purple-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-200">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-purple-900 uppercase tracking-tight">Organ Knowledge Base</h2>
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Physiology & Clinical Associations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Liver', 'Spleen', 'Kidney', 'Heart', 'Lung'].map((orgName) => {
          const org = TCM_DB.organ_details[orgName];
          if (!org) return null;
          const el = elements.find(e => e.name.toLowerCase() === org.element.toLowerCase());

          return (
            <div key={orgName} className="bg-white border border-purple-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${el?.bgColor} ${el?.color} border ${el?.borderColor}`}>
                  {org.element}
                </div>
                <div className="p-2 bg-purple-50 rounded-xl">
                   {org.name === 'Liver' && <Wind className="w-5 h-5 text-emerald-600" />}
                   {org.name === 'Spleen' && <Mountain className="w-5 h-5 text-amber-600" />}
                   {org.name === 'Kidney' && <Waves className="w-5 h-5 text-blue-600" />}
                   {org.name === 'Heart' && <Heart className="w-5 h-5 text-rose-600" />}
                   {org.name === 'Lung' && <Wind className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              <h3 className="text-xl font-black text-purple-900 uppercase mb-4">{org.name}</h3>

              <div className="space-y-4 flex-1">
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-purple-300 uppercase tracking-widest">Functions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(org.main_functions || []).slice(0, 3).map((fn, idx) => (
                      <span key={idx} className="text-[10px] bg-purple-50 text-purple-700 px-2 py-1 rounded-lg border border-purple-100 font-medium">{fn}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-purple-50">
                   <div>
                      <span className="text-[8px] font-black text-purple-300 uppercase block">Emotion</span>
                      <span className="text-xs font-bold text-purple-800 uppercase">{org.emotion}</span>
                   </div>
                   <div>
                      <span className="text-[8px] font-black text-purple-300 uppercase block">Flavor</span>
                      <span className="text-xs font-bold text-purple-800 uppercase">{org.flavor}</span>
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (isMemuat) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-purple-50 p-6">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
        <p className="text-xs font-black text-purple-400 uppercase tracking-widest">Memuat Syndrome Master...</p>
      </div>
    );
  }

  const activeElemenData = diagramPilihion 
    ? elements.find(e => e.name.toLowerCase() === diagramPilihion.toLowerCase()) 
    : null;

  return (
    <div className="h-full bg-purple-50 flex flex-col md:flex-row overflow-hidden rounded-3xl border border-purple-100 shadow-inner">
      
      {/* LEFT MAP BAR */}
      <div className="w-full md:w-[320px] lg:w-[380px] border-r border-purple-100 bg-white flex flex-col shrink-0 relative">
         <div className="p-5 border-b border-purple-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div>
               <h3 className="text-sm font-black text-purple-900 uppercase tracking-tight flex items-center gap-2">
                 <MapIcon className="w-4 h-4 text-purple-600" /> Elemenal Map
               </h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => { setShowEncyclopedia(!showEncyclopedia); clearAllFilters(); }} 
                className={`p-2 rounded-xl border transition-all ${showEncyclopedia ? 'bg-purple-600 border-purple-400 text-white shadow-md' : 'bg-white border-purple-200 text-purple-400 hover:text-purple-600'}`}
                title="Toggle Encyclopedia"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              {(diagramPilihion || organFilter || searchQuery) && (
                <button onClick={clearAllFilters} className="p-2 bg-rose-50 text-rose-500 rounded-xl border border-rose-100 hover:bg-rose-100 transition-all">
                    <X className="w-4 h-4" />
                </button>
              )}
            </div>
         </div>
         
         <div className="flex-1 min-h-0 flex items-center justify-center p-4">
            <div className="w-full aspect-square max-w-[280px]">
              <WuXingInteractiveDiagram 
                  embedded={true} 
                  className="h-full w-full" 
                  onElemenPilih={handleElemenPilih}
                  initialHighlight={diagramPilihion}
              />
            </div>
         </div>

         <div className="p-4 border-t border-purple-100 bg-purple-50/30">
            <div className="flex flex-wrap gap-1.5 justify-center">
               {['Liver', 'Heart', 'Spleen', 'Lung', 'Kidney'].map(org => (
                 <button 
                    key={org}
                    onClick={() => handleOrganFilter(org)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                        organFilter === org 
                        ? 'bg-purple-600 border-purple-400 text-white shadow-md' 
                        : 'bg-white border-purple-200 text-purple-500 hover:border-purple-300'
                    }`}
                 >
                    {org}
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* RIGHT CONTENT AREA */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-white scroll-smooth relative">
         
         <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-purple-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-purple-900 uppercase tracking-tight">
                        {showEncyclopedia ? 'Clinical Encyclopedia' : diagramPilihion ? `${diagramPilihion} Patterns` : 'Syndrome Master'}
                    </h2>
                    <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">
                        {organFilter ? `Focusing on ${organFilter}` : 'Pattern Differentiation Engine'}
                    </p>
                </div>
                
                {!showEncyclopedia && (
                  <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-purple-300 group-focus-within:text-purple-600 transition-colors" />
                      <input 
                          type="text"
                          placeholder="Search patterns..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full sm:w-64 bg-purple-50 border border-purple-100 rounded-xl py-2.5 pl-9 pr-4 text-xs text-purple-900 focus:bg-white focus:border-purple-400 outline-none transition-all"
                      />
                  </div>
                )}
            </div>
         </div>

         <div className="p-6">
            {showEncyclopedia ? (
              <OrganEncyclopedia />
            ) : (
              <div className="space-y-12">
                  {(diagramPilihion ? [activeElemenData!] : elements).map((el) => {
                  const syndromes = getFilteredSyndromes(el.name);
                  if (diagramPilihion === null && syndromes.length === 0) return null;
                  
                  return (
                      <div key={el.name} className="animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-1.5 h-6 rounded-full ${el.color.replace('text-', 'bg-')}`}></div>
                            <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${el.color}`}>{el.display}</h3>
                            <span className="text-[9px] bg-purple-50 text-purple-400 px-2 py-0.5 rounded-full border border-purple-100 font-bold">{syndromes.length}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {syndromes.map(s => (
                            <div 
                                key={s.id}
                                onClick={() => onPilihSyndrome?.(s.id)}
                                className="bg-white hover:bg-purple-50 p-5 rounded-2xl border border-purple-100 hover:border-purple-300 cursor-pointer transition-all group flex flex-col gap-4 shadow-sm active:scale-[0.98]"
                            >
                                <div className="flex items-start justify-between">
                                    <div className={`p-2.5 rounded-xl bg-purple-50 border border-purple-100 ${el.color}`}>
                                        <Target className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-wrap justify-end gap-1">
                                        {(s.primary_organs || []).slice(0, 2).map(org => (
                                            <span key={org} className="px-2 py-0.5 rounded-lg bg-purple-100 text-[8px] text-purple-600 font-black uppercase border border-purple-200">{org}</span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-black text-purple-900 text-sm leading-tight group-hover:text-purple-700 transition-colors mb-1 uppercase">{s.name_id}</h4>
                                    <p className="text-purple-400 text-[10px] italic truncate">{s.name_en}</p>
                                </div>
                                
                                <div className="pt-3 border-t border-purple-50 flex items-center justify-between text-purple-300 group-hover:text-purple-600 transition-colors">
                                    <span className="text-[8px] font-black uppercase tracking-widest">View Details</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                            ))}

                            {syndromes.length === 0 && (
                            <div className="col-span-full py-12 border-2 border-dashed border-purple-50 rounded-3xl flex flex-col items-center justify-center text-purple-300">
                                <Info className="w-8 h-8 mb-2 opacity-30" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No patterns found</p>
                            </div>
                            )}
                        </div>
                      </div>
                  );
                  })}
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default WuXingMasterPanel;
