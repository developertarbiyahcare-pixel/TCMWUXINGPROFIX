import React, { useState } from 'react';
import { TCM_DB } from '../constants';
import { BrainCircuit, Activity, Zap, AlertTriangle, Pill, Stethoscope, ChevronDown, ChevronRight, Layers, FileText, Microscope, Syringe, UserCheck } from 'lucide-react';

const StrokeEducationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'intro' | 'etiology' | 'scalp' | 'jin' | 'abdominal' | 'other' | 'research' | 'cases' | 'herbs'>('intro');
  const protocols = (TCM_DB as any).stroke_protocols;

  const TabButton = ({ id, label, icon }: { id: string, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all font-medium text-xs md:text-sm w-full md:w-auto shrink-0 ${
        activeTab === id 
        ? 'bg-gradient-to-r from-tcm-primary to-tcm-secondary text-white shadow-sm' 
        : 'bg-white text-purple-600 hover:bg-purple-50 hover:text-purple-900 border border-purple-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="h-full bg-purple-50 text-purple-900 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-purple-200 bg-white/50">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-tcm-primary mb-2">
          MANAJEMEN STROKE (APOPLEXY)
        </h1>
        <p className="text-sm text-purple-600">
          Panduan klinis lengkap: Etiologi, Scalp, Jin's 3 Needles, Abdominal, dan Studi Kasus.
        </p>
        <div className="text-[10px] text-purple-500 mt-1 uppercase tracking-widest">
          Sumber: dr. Michael Wicaksono, M.Med
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-b border-purple-200 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          <TabButton id="intro" label="Dasar" icon={<BrainCircuit className="w-4 h-4"/>} />
          <TabButton id="etiology" label="Etiologi" icon={<Activity className="w-4 h-4"/>} />
          <TabButton id="scalp" label="Scalp" icon={<Layers className="w-4 h-4"/>} />
          <TabButton id="jin" label="Jin's 3" icon={<Zap className="w-4 h-4"/>} />
          <TabButton id="abdominal" label="Abdominal" icon={<Activity className="w-4 h-4"/>} />
          <TabButton id="other" label="Metode Lain" icon={<Syringe className="w-4 h-4"/>} />
          <TabButton id="herbs" label="Herbal" icon={<Pill className="w-4 h-4"/>} />
          <TabButton id="research" label="Riset" icon={<Microscope className="w-4 h-4"/>} />
          <TabButton id="cases" label="Kasus" icon={<UserCheck className="w-4 h-4"/>} />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-purple-50">
        
        {/* TAB: INTRO */}
        {activeTab === 'intro' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-white border border-purple-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
                <BrainCircuit className="text-tcm-primary" /> Definisi TCM: Zhong Feng (Apoplexy)
              </h3>
              <p className="text-purple-700 leading-relaxed mb-4">
                Dalam akupunktur dikenal istilah <strong>Apoplexy (中风)</strong>, yang memiliki gejala sama dengan stroke: 
                kehilangan kesadaran dan keseimbangan mendadak, kelumpuhan sebelah anggota gerak, dan deviasi mulut/mata.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-bold text-purple-800 mb-2">1. Tanpa Gangguan Kesadaran</h4>
                  <p className="text-sm text-purple-600">Proses patologis dianggap hanya menyerang <strong>Meridian</strong>.</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                  <h4 className="font-bold text-rose-800 mb-2">2. Dengan Gangguan Kesadaran</h4>
                  <p className="text-sm text-rose-600">Proses patologis dianggap menyerang <strong>Organ Zang-Fu</strong> (lebih berat).</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-purple-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-purple-900 mb-3">Patogenesis Utama</h3>
              <ul className="space-y-3 text-sm text-purple-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tcm-primary mt-2"></div>
                  <span><strong>Angin (Wind):</strong> Menyerang ke atas (kepala), onset cepat, gejala berubah-ubah.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tcm-accent mt-2"></div>
                  <span><strong>Api (Fire):</strong> Naik ke atas, menyebabkan kemerahan, agitasi, dan perdarahan (pembuluh pecah).</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2"></div>
                  <span><strong>Flegma (Phlegm):</strong> Menyumbat orifisium (kesadaran) dan meridian (kelumpuhan/baal).</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2"></div>
                  <span><strong>Stasis Darah (Blood Stasis):</strong> Akibat trauma, operasi, atau stagnasi Qi yang parah.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB: ETIOLOGY */}
        {activeTab === 'etiology' && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            {protocols.etiologies.map((item: any, idx: number) => (
              <div key={idx} className="bg-white border border-purple-200 rounded-xl p-5 hover:border-tcm-primary transition-colors group shadow-sm">
                <h3 className="font-bold text-lg text-purple-900 mb-1 group-hover:text-tcm-primary transition-colors">{item.name}</h3>
                <p className="text-xs text-purple-500 uppercase tracking-wider mb-4 font-semibold">{item.pathogen}</p>
                
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-2 mb-2 text-xs text-tcm-secondary font-bold uppercase">
                    <Activity className="w-3 h-3" /> Rekomendasi Titik
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.points.map((p: string) => (
                      <span key={p} className="text-xs px-2 py-1 rounded bg-white text-purple-700 border border-purple-200 shadow-sm">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
                {item.focus && (
                   <div className="mt-3 text-xs text-amber-700 italic bg-amber-50 p-2 rounded border border-amber-200">
                      Focus: {item.focus}
                   </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB: SCALP */}
        {activeTab === 'scalp' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-gradient-to-br from-purple-100 to-white border border-purple-200 rounded-xl p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-bold text-purple-900 mb-2 flex items-center gap-2">
                <Layers className="text-purple-600" /> Scalp Acupuncture
              </h3>
              <p className="text-sm text-purple-700 mb-4">
                Metode khusus di kulit kepala untuk mengaktivasi area korteks serebri. 
                Bertujuan mencegah perluasan zona infark dan mengaktivasi neuroplastisitas.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 text-xs text-amber-800">
                <strong>Perhatian:</strong> Cek riwayat kraniotomi (operasi batok kepala) sebelum menusuk. Hati-hati stimulasi elektrik pada riwayat epilepsi.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {protocols.scalp_zones.map((zone: any, idx: number) => (
                 <div key={idx} className="bg-white border border-purple-200 p-4 rounded-xl flex flex-col shadow-sm">
                    <h4 className="font-bold text-purple-900 mb-2 border-b border-purple-100 pb-2">{zone.name}</h4>
                    <p className="text-sm text-purple-600 leading-relaxed">{zone.desc}</p>
                 </div>
               ))}
            </div>
            
            {/* Additional visual explanation based on slides */}
            <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
               <h4 className="font-bold text-purple-800 mb-2 text-sm">Zona Motorik (Homunculus)</h4>
               <ul className="text-xs text-purple-600 space-y-1 list-disc list-inside">
                  <li><strong>1/5 Atas:</strong> Kelumpuhan Kaki / Anggota Bawah.</li>
                  <li><strong>2/5 Tengah:</strong> Kelumpuhan Tangan / Anggota Atas.</li>
                  <li><strong>2/5 Bawah:</strong> Wajah & Lidah (Bicara/Menelan).</li>
               </ul>
               <p className="text-xs text-purple-500 mt-2 italic">Penusukan horizontal 1.5 cun untuk menjangkau beberapa sub-zona.</p>
            </div>
          </div>
        )}

        {/* TAB: JIN'S NEEDLES */}
        {activeTab === 'jin' && (
          <div className="max-w-5xl mx-auto animate-fade-in">
             <div className="mb-6">
                <h3 className="text-xl font-bold text-purple-900 mb-1">Jin's Three Needles (Jin San Zhen 靳三针)</h3>
                <p className="text-sm text-purple-600">Teknik Profesor Jin Rui (Guangzhou, 1980) menggunakan kombinasi 3 titik efektif.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {protocols.jins_three_needles.map((group: any, idx: number) => (
                   <div key={idx} className="bg-white border border-purple-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow shadow-sm">
                      <div className="bg-purple-50 px-4 py-3 border-b border-purple-100 flex justify-between items-center">
                         <h4 className="font-bold text-tcm-primary text-sm">{group.name}</h4>
                         <Zap className="w-3 h-3 text-purple-400" />
                      </div>
                      <div className="p-4 space-y-3">
                         <div>
                            <span className="text-[10px] text-purple-500 uppercase font-bold tracking-wider">Titik</span>
                            <ul className="text-sm text-purple-900 mt-1 list-disc list-inside">
                               {group.points.map((p: string, i: number) => <li key={i}>{p}</li>)}
                            </ul>
                         </div>
                         <div>
                            <span className="text-[10px] text-purple-500 uppercase font-bold tracking-wider">Indikasi</span>
                            <p className="text-xs text-purple-700 mt-1 leading-relaxed">{group.indication}</p>
                         </div>
                         {group.method && (
                            <div className="bg-purple-50 p-2 rounded border border-purple-100 text-[10px] text-purple-600 italic">
                               Metode: {group.method}
                            </div>
                         )}
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB: ABDOMINAL */}
        {activeTab === 'abdominal' && protocols.abdominal_acupuncture && (
           <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="bg-white border border-purple-200 rounded-xl p-6 shadow-sm mb-6">
                 <h3 className="text-xl font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <Activity className="text-tcm-primary" /> {protocols.abdominal_acupuncture.name}
                 </h3>
                 <p className="text-sm text-purple-600 mb-4">{protocols.abdominal_acupuncture.indication}</p>
                 <div className="bg-purple-50 p-3 rounded border border-purple-200 text-xs text-purple-700 inline-block">
                    Penusukan tegak lurus 1.0 - 1.5 cun. Sangat efektif untuk kasus kronis (sequelae).
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm">
                    <h4 className="font-bold text-purple-900 text-sm mb-3 border-b border-purple-100 pb-2">Titik Utama (Ren Mai)</h4>
                    <ul className="text-sm text-purple-700 space-y-2 list-disc list-inside">
                       {protocols.abdominal_acupuncture.points_main.map((p: string, i: number) => <li key={i}>{p}</li>)}
                    </ul>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm">
                    <h4 className="font-bold text-rose-600 text-sm mb-3 border-b border-purple-100 pb-2">Sisi Sakit (Lumpuh)</h4>
                    <ul className="text-sm text-purple-700 space-y-2 list-disc list-inside">
                       {protocols.abdominal_acupuncture.points_affected_side.map((p: string, i: number) => <li key={i}>{p}</li>)}
                    </ul>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm">
                    <h4 className="font-bold text-emerald-600 text-sm mb-3 border-b border-purple-100 pb-2">Sisi Sehat</h4>
                    <ul className="text-sm text-purple-700 space-y-2 list-disc list-inside">
                       {protocols.abdominal_acupuncture.points_healthy_side.map((p: string, i: number) => <li key={i}>{p}</li>)}
                    </ul>
                 </div>
              </div>
           </div>
        )}

        {/* TAB: OTHER */}
        {activeTab === 'other' && protocols.other_methods && (
           <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              {protocols.other_methods.map((method: any, idx: number) => (
                 <div key={idx} className="bg-white border border-purple-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-purple-900 mb-2">{method.name}</h3>
                    <p className="text-sm text-purple-600 mb-4">{method.description}</p>
                    {method.indication && (
                       <div className="mb-4 text-xs font-semibold text-tcm-secondary uppercase tracking-wider">
                          Indikasi: {method.indication}
                       </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                       {method.points.map((p: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-purple-50 rounded border border-purple-200 text-sm text-purple-800">
                             {p}
                          </span>
                       ))}
                    </div>
                 </div>
              ))}
           </div>
        )}

        {/* TAB: HERBS */}
        {activeTab === 'herbs' && (
          <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
             <div className="bg-white border border-purple-200 rounded-xl p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-20 h-20 bg-rose-50 rounded-bl-full"></div>
                <h3 className="text-xl font-bold text-rose-600 mb-2">Angong Niuhuang Wan (安宫牛黄丸)</h3>
                <p className="text-sm text-purple-700 mb-4">
                   Herbal paten "legendaris" untuk fase akut stroke. Berfungsi membuka orifisium (kesadaran) dan membuang panas toksik.
                </p>
                <div className="flex gap-2 items-center bg-red-50 border border-red-200 p-3 rounded-lg">
                   <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                   <p className="text-xs text-red-800">
                      <strong>KONTRAINDIKASI KERAS:</strong> Stroke Hemoragik (Perdarahan). Herbal ini bersifat dingin dan melancarkan darah, dapat memperparah perdarahan aktif. Hanya untuk stroke iskemik/penyumbatan dengan tanda Panas.
                   </p>
                </div>
             </div>

             <div className="bg-white border border-purple-200 rounded-xl p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full"></div>
                <h3 className="text-xl font-bold text-amber-600 mb-2">Buchang Naoxintong (步长脑心通)</h3>
                <p className="text-sm text-purple-700 mb-4">
                   Digunakan untuk fase pemulihan (sequelae) post-stroke non-hemoragik. Berfungsi melancarkan darah, mengurai bekuan, dan meredakan kekakuan.
                </p>
                <ul className="text-xs text-purple-600 list-disc list-inside space-y-1">
                   <li>Juga dapat mencegah penyumbatan pembuluh darah jantung.</li>
                   <li>Hindari pada kehamilan dan gangguan pembekuan darah.</li>
                </ul>
             </div>
          </div>
        )}

        {/* TAB: RESEARCH */}
        {activeTab === 'research' && protocols.research_highlights && (
           <div className="max-w-4xl mx-auto animate-fade-in">
              <h3 className="text-xl font-bold text-purple-900 mb-6">Highlight Riset Medis & Mekanisme</h3>
              <div className="space-y-4">
                 {protocols.research_highlights.map((item: any, idx: number) => (
                    <div key={idx} className="bg-white border border-purple-200 rounded-xl p-5 hover:border-purple-400 transition-colors shadow-sm">
                       <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded uppercase">{item.context}</span>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                             <span className="text-[10px] text-purple-500 uppercase font-bold">Mekanisme</span>
                             <p className="text-sm text-purple-900 font-medium">{item.mechanism}</p>
                          </div>
                          <div>
                             <span className="text-[10px] text-purple-500 uppercase font-bold">Efek Klinis</span>
                             <p className="text-sm text-emerald-600">{item.effect}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* TAB: CASE STUDIES */}
        {activeTab === 'cases' && protocols.case_studies && (
           <div className="max-w-5xl mx-auto animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {protocols.case_studies.map((c: any, idx: number) => (
                    <div key={idx} className="bg-white border border-purple-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
                       <div className="bg-purple-50 p-4 border-b border-purple-100">
                          <h3 className="font-bold text-purple-900 text-lg">{c.title}</h3>
                          <p className="text-xs text-purple-500 italic mt-1">{c.patient_profile}</p>
                       </div>
                       <div className="p-5 space-y-4 flex-1">
                          <div>
                             <span className="text-[10px] text-purple-500 uppercase font-bold tracking-wider block mb-1">Riwayat & Diagnosis</span>
                             <p className="text-sm text-purple-700">{c.history}</p>
                             <div className="mt-1 text-sm font-semibold text-tcm-primary">{c.diagnosis}</div>
                          </div>
                          
                          <div className="bg-purple-50 p-3 rounded border border-purple-100">
                             <span className="text-[10px] text-purple-500 uppercase font-bold tracking-wider block mb-2">Titik Yang Digunakan</span>
                             <div className="flex flex-wrap gap-2">
                                {c.points_used.map((p: string, i: number) => (
                                   <span key={i} className="text-xs px-2 py-1 bg-white rounded text-purple-800 border border-purple-200 shadow-sm">{p}</span>
                                ))}
                             </div>
                          </div>

                          <div>
                             <span className="text-[10px] text-purple-500 uppercase font-bold tracking-wider block mb-1">Hasil Follow Up</span>
                             <ul className="list-disc list-inside text-sm text-emerald-600 space-y-1">
                                {c.results.map((r: string, i: number) => <li key={i}>{r}</li>)}
                             </ul>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default StrokeEducationPanel;