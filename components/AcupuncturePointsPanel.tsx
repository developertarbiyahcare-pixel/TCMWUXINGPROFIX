import React, { useState, useMemo } from 'react';
import { MapPin, Info, Zap, Search, Layers } from 'lucide-react';
import { AcupunctureSystem, Point } from '../types/acupuncture';
import { tcmPoints } from '../data/tcmPoints';
import { masterTungPoints } from '../data/masterTungPoints';

const AcupuncturePointsPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSystem, setActiveSystem] = useState<AcupunctureSystem | 'ALL'>('ALL');

  const allPoints = useMemo(() => {
    return [...tcmPoints, ...masterTungPoints];
  }, []);

  const filteredPoints = useMemo(() => {
    return allPoints.filter(p => 
      (activeSystem === 'ALL' || p.system === activeSystem) && (
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.indication.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.element.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.reactionArea && p.reactionArea.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );
  }, [searchTerm, activeSystem, allPoints]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-purple-100 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Acupuncture Reference</h2>
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Clinical Master Points</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex bg-white/10 p-1 rounded-2xl border border-white/20">
                <button
                  onClick={() => setActiveSystem('ALL')}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                    activeSystem === 'ALL' 
                      ? 'bg-white text-teal-600 shadow-lg' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Semua Titik
                </button>
                <button
                  onClick={() => setActiveSystem(AcupunctureSystem.TCM)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                    activeSystem === AcupunctureSystem.TCM 
                      ? 'bg-white text-teal-600 shadow-lg' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  TCM
                </button>
                <button
                  onClick={() => setActiveSystem(AcupunctureSystem.MASTER_TUNG)}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                    activeSystem === AcupunctureSystem.MASTER_TUNG 
                      ? 'bg-white text-teal-600 shadow-lg' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Tung
                </button>
              </div>
              
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                <input 
                  type="text"
                  placeholder="Cari titik..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-white/60 outline-none focus:bg-white/20 transition-all w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPoints.length > 0 ? filteredPoints.map((point, idx) => (
              <div key={idx} className="group bg-purple-50 hover:bg-white border border-purple-100 hover:border-teal-200 rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col">
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={point.imageUrl} 
                    alt={point.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-lg ${
                      point.element === 'Wood' ? 'bg-emerald-500 text-white' :
                      point.element === 'Fire' ? 'bg-rose-500 text-white' :
                      point.element === 'Earth' ? 'bg-amber-500 text-white' :
                      point.element === 'Metal' ? 'bg-slate-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {point.element}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <h3 className="text-sm font-black text-teal-600 uppercase tracking-tight leading-tight">{point.name}</h3>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border ${
                      point.system === AcupunctureSystem.MASTER_TUNG 
                        ? 'bg-purple-50 text-purple-500 border-purple-200' 
                        : 'bg-teal-50 text-teal-500 border-teal-200'
                    }`}>
                      {point.system === AcupunctureSystem.MASTER_TUNG ? 'Master Tung' : 'TCM Standard'}
                    </span>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <div className="flex gap-2">
                      <MapPin className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest mb-0.5">Location</p>
                        <p className="text-xs text-purple-700 leading-relaxed line-clamp-2 hover:line-clamp-none transition-all">{point.location}</p>
                      </div>
                    </div>

                    {point.reactionArea && (
                      <div className="flex gap-2">
                        <Layers className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-0.5">Reaction Area</p>
                          <p className="text-xs font-bold text-purple-900">{point.reactionArea}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-0.5">Indication</p>
                        <p className="text-xs font-bold text-purple-900 line-clamp-2 hover:line-clamp-none transition-all">{point.indication}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 bg-white/50 p-2 rounded-xl border border-purple-100 mt-auto">
                      <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-0.5">Needle Technique</p>
                        <p className="text-xs italic text-purple-800 font-medium">{point.technique}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-10 text-center text-purple-400">
                <p className="text-sm font-bold uppercase tracking-widest">No points found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
        <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Info className="w-4 h-4" /> Clinical Note
        </h3>
        <p className="text-xs text-amber-800 leading-relaxed font-medium">
          {activeSystem === 'ALL' 
            ? "This database combines standard TCM points with Master Tung's clinical master points. TCM points focus on meridian flow, while Master Tung points emphasize distal needling and reaction areas."
            : activeSystem === AcupunctureSystem.TCM 
            ? "The points listed above are fundamental master points used in TCM clinical practice. Proper needle technique and sterilization are mandatory."
            : "Master Tung's points are unique family lineage points known for their immediate clinical efficacy. They often use distal needling and specific Reaction Areas for diagnosis and treatment."}
        </p>
      </div>
    </div>
  );
};

export default AcupuncturePointsPanel;
