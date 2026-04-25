import React, { useMemo, useState } from 'react';

interface Props {
  points?: { code: string; description?: string; system?: 'TCM' | 'MasterTung'; role?: string }[];
}

const POINT_COORDS: Record<string, { x: number; y: number; view: 'front' | 'back'; system?: 'TCM' | 'MasterTung' }> = {
  // === STANDARD TCM (Front & Kembali) ===
  'GV20': { x: 75, y: 15, view: 'front' },
  'Yintang': { x: 75, y: 35, view: 'front' },
  'GV24': { x: 75, y: 20, view: 'front' },
  'DU24': { x: 75, y: 20, view: 'front' },
  'ST2': { x: 88, y: 45, view: 'front' },
  'GB20': { x: 210, y: 40, view: 'back' },
  'REN17': { x: 75, y: 110, view: 'front' },
  'CV17': { x: 75, y: 110, view: 'front' },
  'REN15': { x: 75, y: 130, view: 'front' },
  'REN14': { x: 75, y: 138, view: 'front' },
  'REN12': { x: 75, y: 150, view: 'front' },
  'CV12': { x: 75, y: 150, view: 'front' },
  'REN6': { x: 75, y: 175, view: 'front' },
  'CV6': { x: 75, y: 175, view: 'front' },
  'REN4': { x: 75, y: 185, view: 'front' },
  'CV4': { x: 75, y: 185, view: 'front' },
  'REN3': { x: 75, y: 195, view: 'front' },
  'ST25': { x: 95, y: 175, view: 'front' }, 
  'ST28': { x: 90, y: 195, view: 'front' },
  'SP15': { x: 105, y: 175, view: 'front' },
  'LR13': { x: 110, y: 160, view: 'front' },
  'LR14': { x: 95, y: 140, view: 'front' },
  'DU14': { x: 225, y: 65, view: 'back' },
  'GV14': { x: 225, y: 65, view: 'back' },
  'BL12': { x: 205, y: 75, view: 'back' },
  'BL13': { x: 205, y: 90, view: 'back' },
  'BL15': { x: 205, y: 105, view: 'back' },
  'BL17': { x: 205, y: 120, view: 'back' },
  'BL18': { x: 205, y: 130, view: 'back' },
  'BL20': { x: 205, y: 150, view: 'back' },
  'BL21': { x: 205, y: 160, view: 'back' },
  'BL23': { x: 205, y: 170, view: 'back' },
  'BL25': { x: 205, y: 185, view: 'back' },
  'BL28': { x: 205, y: 205, view: 'back' },
  'DU4': { x: 225, y: 170, view: 'back' },
  'GV4': { x: 225, y: 170, view: 'back' },
  'LU1': { x: 45, y: 90, view: 'front' },
  'LU5': { x: 25, y: 115, view: 'front' },
  'LU7': { x: 20, y: 130, view: 'front' },
  'LU9': { x: 18, y: 140, view: 'front' },
  'PC6': { x: 25, y: 140, view: 'front' },
  'HT7': { x: 28, y: 145, view: 'front' },
  'HT9': { x: 28, y: 168, view: 'front' },
  'LI4': { x: 15, y: 160, view: 'front' },
  'LI11': { x: 35, y: 110, view: 'front' },
  'TE5': { x: 35, y: 135, view: 'back' },
  'ST36': { x: 60, y: 260, view: 'front' },
  'ST37': { x: 60, y: 275, view: 'front' },
  'ST40': { x: 55, y: 290, view: 'front' },
  'ST44': { x: 60, y: 370, view: 'front' },
  'SP9': { x: 85, y: 250, view: 'front' }, 
  'SP6': { x: 85, y: 340, view: 'front' },
  'SP3': { x: 82, y: 365, view: 'front' },
  'LR2': { x: 70, y: 375, view: 'front' },
  'LR3': { x: 65, y: 375, view: 'front' },
  'KI3': { x: 90, y: 360, view: 'front' },
  'KI6': { x: 90, y: 365, view: 'front' }, 
  'KI7': { x: 90, y: 350, view: 'front' },
  'GB34': { x: 50, y: 260, view: 'front' }, 
  'BL40': { x: 210, y: 260, view: 'back' },
  'BL57': { x: 210, y: 310, view: 'back' },
  'BL60': { x: 240, y: 360, view: 'back' },

  // === MASTER TUNG (approximate locations) ===
  '22.05': { x: 28, y: 138, view: 'front', system: 'MasterTung' }, // Linggu (forearm)
  '22.06': { x: 32, y: 138, view: 'front', system: 'MasterTung' },
  '77.01': { x: 55, y: 275, view: 'front', system: 'MasterTung' }, // Zhengjin (calf)
  '77.02': { x: 58, y: 275, view: 'front', system: 'MasterTung' },
  '88.12': { x: 45, y: 245, view: 'front', system: 'MasterTung' }, // Thigh area
  '88.13': { x: 48, y: 245, view: 'front', system: 'MasterTung' },
};

// Database deskripsi titik (bisa diperluas)
const POINT_DESCRIPTIONS: Record<string, { name: string; desc: string; system?: 'TCM' | 'MasterTung' }> = {
  // TCM Classic
  'GV20': { name: 'Baihui (Hundred Meetings)', desc: 'Mengatasi vertigo, sakit kepala, masalah telinga/hidung, gangguan mental, meningkatkan kesadaran dan energi ke atas.' },
  'Yintang': { name: 'Yintang (Hall of Impression)', desc: 'Mengatasi sakit kepala, sinusitis, insomnia, stres, dan menenangkan pikiran.' },
  'REN17': { name: 'Shanzhong / CV17 (Chest Center)', desc: 'Mengatur Qi dada, mengatasi sesak napas, batuk, dan masalah jantung.' },
  'CV12': { name: 'Zhongwan (Middle Cavity)', desc: 'Titik utama untuk masalah pencernaan, mual, kembung, dan harmonisasi lambung-limpa.' },
  'CV6': { name: 'Qihai (Sea of Qi)', desc: 'Meningkatkan energi vital (Qi), mengatasi kelelahan, kelemahan, dan masalah reproduksi.' },
  'CV4': { name: 'Guanyuan (Gate of Origin)', desc: 'Menguatkan ginjal, esensi (Jing), fertilitas, dan vitalitas secara keseluruhan.' },
  'ST36': { name: 'Zusanli (Leg Three Miles)', desc: 'Titik paling penting untuk meningkatkan energi, pencernaan, kekebalan tubuh, dan stamina. Mengatasi kelelahan kronis.' },
  'SP6': { name: 'Sanyinjiao (Three Yin Intersection)', desc: 'Mengatur hormon wanita, menstruasi, pencernaan, dan kelembaban tubuh. Sangat berguna untuk masalah ginekologi.' },
  'LR3': { name: 'Taichong (Great Surge)', desc: 'Menyebarkan Qi Liver, mengatasi stres, sakit kepala, tekanan darah tinggi, dan emosi tertekan.' },
  'KI3': { name: 'Taixi (Great Ravine)', desc: 'Menguatkan Ginjal, mengatasi kelelahan, tinnitus, sakit punggung bawah, dan masalah tulang.' },
  'GB34': { name: 'Yanglingquan (Yang Mound Spring)', desc: 'Menguntungkan tendon & sendi, mengatasi nyeri pinggang, sciatica, dan masalah Liver-Gallbladder.' },
  'BL23': { name: 'Shenshu (Kidney Shu)', desc: 'Titik utama untuk menguatkan Ginjal, mengatasi sakit punggung bawah, tinnitus, dan kelemahan.' },
  'GV14': { name: 'Dazhui (Great Vertebra)', desc: 'Mengeluarkan panas, mengatasi demam, kaku leher, dan memperkuat pertahanan tubuh.' },

  // Master Tung Popular
  '22.05': { name: 'LingGu (Spirit Bone)', desc: 'Sangat efektif untuk nyeri punggung, sciatica, nyeri lutut, nyeri bahu, gangguan ginekologi, dan masalah pencernaan. Kombinasi klasik dengan DaBai.' , system: 'MasterTung' },
  '22.04': { name: 'DaBai (Big White)', desc: 'Mengatasi nyeri punggung, sciatica, sakit kepala, masalah pernapasan (asma, batuk), dan nyeri sendi. Sering dipasangkan dengan LingGu.' , system: 'MasterTung' },
  '77.01': { name: 'ZhengJin (Correct Tendon)', desc: 'Mengatasi nyeri leher, punggung, dan masalah tendon. Terletak di area Achilles tendon.' , system: 'MasterTung' },
  '77.02': { name: 'ZhengZong (Correct Ancestor)', desc: 'Membantu nyeri punggung bawah dan masalah struktural tubuh.' , system: 'MasterTung' },
};

const BodyMapSekarangJadi: React.FC<Props> = ({ points = [] }) => {
  const [selectedPoint, setPilihedPoint] = useState<any>(null);

  const activePoints = useMemo(() => {
    return points
      .map((p) => {
        let raw = p.code.split(/[+\s]/)[0].trim().toUpperCase();
        raw = raw.replace(/^CV/, 'REN').replace(/^GV/, 'DU').replace(/^HE/, 'HT').replace(/^LIV/, 'LR');
        const coord = POINT_COORDS[raw] || POINT_COORDS[p.code];
        if (!coord) return null;

        const descData = POINT_DESCRIPTIONS[raw] || POINT_DESCRIPTIONS[p.code] || { name: p.code, desc: p.description || 'Titik akupunktur klasik untuk mengatur aliran Qi dan mengatasi gejala terkait.' };
        return { 
          ...coord, 
          ...p, 
          code: raw || p.code,
          displayName: descData.name,
          fullDesc: descData.desc
        };
      })
      .filter(Boolean) as any[];
  }, [points]);

  return (
    <div className="w-full h-full flex flex-col items-center bg-purple-50 rounded-3xl p-6 relative overflow-hidden">
      <div className="text-xs font-black text-purple-500 mb-4 tracking-widest">BODY MAP AKUPUNKTUR • TCM + MASTER TUNG</div>

      <svg viewBox="0 0 300 400" className="w-full max-h-[560px] drop-shadow-xl" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* FRONT BODY */}
        <g>
          <text x="75" y="15" textAnchor="middle" fill="#a855f7" fontSize="11" fontBerat Badan="700">ANTERIOR (Depan)</text>
          <path d="M75,30 C90,30 95,45 95,55 L115,60 L125,180 L130,190 L110,380 L95,390 L85,300 L75,280 L65,300 L55,390 L40,380 L20,190 L25,180 L35,60 L55,55 C55,45 60,30 75,30 Z" fill="#f3e8ff" stroke="#c026d3" strokeWidth="7" />
          <circle cx="75" cy="40" r="13" fill="#f3e8ff" stroke="#c026d3" strokeWidth="6" />
        </g>

        {/* BACK BODY */}
        <g transform="translate(150,0)">
          <text x="75" y="15" textAnchor="middle" fill="#a855f7" fontSize="11" fontBerat Badan="700">POSTERIOR (Belakang)</text>
          <path d="M75,30 C90,30 95,45 95,55 L115,60 L125,180 L130,190 L110,380 L95,390 L85,300 L75,280 L65,300 L55,390 L40,380 L20,190 L25,180 L35,60 L55,55 C55,45 60,30 75,30 Z" fill="#f3e8ff" stroke="#c026d3" strokeWidth="7" />
          <circle cx="75" cy="40" r="13" fill="#f3e8ff" stroke="#c026d3" strokeWidth="6" />
        </g>

        {/* Render Points */}
        {activePoints.map((pt, i) => (
          <g key={i} className="cursor-pointer group" onClick={() => setPilihedPoint(pt)}>
            <circle
              cx={pt.x} cy={pt.y}
              r={pt.system === 'MasterTung' ? 6.5 : 5}
              fill={pt.system === 'MasterTung' ? '#f59e0b' : '#7e22ce'}
              filter="url(#glow)"
              className="transition-all group-hover:scale-125"
            />
            <circle cx={pt.x} cy={pt.y} r="1.8" fill="white" />
            <text x={pt.x} y={pt.y - 11} textAnchor="middle" fill="#3b0764" fontSize="8.5" fontBerat Badan="700" className="drop-shadow">
              {pt.code}
            </text>
          </g>
        ))}
      </svg>

      {/* Improved Tooltip */}
      {selectedPoint && (
        <div className="absolute bottom-8 left-8 bg-white border border-purple-200 shadow-2xl rounded-3xl p-6 max-w-sm z-50 animate-fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-black text-2xl text-purple-900 tracking-tighter">{selectedPoint.code}</div>
              <div className="text-lg font-semibold text-purple-700">{selectedPoint.displayName}</div>
            </div>
            <button 
              onClick={() => setPilihedPoint(null)} 
              className="text-2xl text-purple-400 hover:text-rose-500 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className={`inline-block px-3 py-1 text-xs font-black rounded-full mb-4 ${selectedPoint.system === 'MasterTung' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>
            {selectedPoint.system === 'MasterTung' ? 'MASTER TUNG POINT' : 'TCM CLASSIC POINT'}
          </div>

          <p className="text-purple-800 leading-relaxed text-[13.5px]">
            {selectedPoint.fullDesc}
          </p>

          {selectedPoint.description && selectedPoint.description !== selectedPoint.fullDesc && (
            <p className="text-purple-600 text-xs mt-3 italic border-t border-purple-100 pt-3">
              {selectedPoint.description}
            </p>
          )}
        </div>
      )}

      {activePoints.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-purple-400 text-sm font-medium">
          Klik titik pada peta atau pilih diagnosis untuk menampilkan deskripsi
        </div>
      )}
    </div>
  );
};

export default BodyMapSekarangJadi;