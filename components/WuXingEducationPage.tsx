import React, { useState, useEffect } from 'react';
import { Zap, RotateCw, ArrowRight, BookOpen, Lightbulb, CheckCircle, Play, Pause } from 'lucide-react';

const casesData = [
  {
    title: "Kasus 1 – Liver Fire Blazing",
    symptoms: "Pasien mudah marah, mata merah, sakit kepala, lidah merah sisi, nadi wiry-rapid.",
    analysis: "Kayu (Liver) Cheng → menindas Tanah (Spleen)",
    colorClass: "text-red-600",
  },
  {
    title: "Kasus 2 – Spleen Yang Deficiency",
    symptoms: "Pasien lelah kronis, diare, perut kembung, tangan dingin, lidah pucat bengkak.",
    analysis: "Tanah (Spleen) lemah → Wu (dirampok) oleh Kayu (Liver)",
    colorClass: "text-amber-600",
  },
  {
    title: "Kasus 3 – Liver Invading Stomach",
    symptoms: "Pasien stres, mual, muntah asam, nyeri epigastrium, mudah marah.",
    analysis: "Kayu (Liver) Cheng → menindas Tanah (Stomach)",
    colorClass: "text-emerald-600",
  },
  {
    title: "Kasus 4 – Kidney Yin Deficiency (Liver Yang Rising)",
    symptoms: "Pusing, mata kering, tinnitus, keringat malam, nadi tipis-cepat.",
    analysis: "Air (Kidney) lemah → gagal Sheng (menghidupi) Kayu (Liver)",
    colorClass: "text-blue-600",
  },
  {
    title: "Kasus 5 – Heart Fire Insulting Kidney Water",
    symptoms: "Insomnia, sariawan, gelisah, urine kemerahan dan nyeri.",
    analysis: "Api (Heart) terlalu kuat → Wu (menghina) Air (Kidney)",
    colorClass: "text-red-600",
  },
  {
    title: "Kasus 6 – Spleen Qi Deficiency leading to Lung Qi Def.",
    symptoms: "Napas pendek, suara pelan, anoreksia, feses lembek, keringat spontan.",
    analysis: "Tanah (Spleen) lemah → gagal Sheng (menghidupi) Logam (Lung)",
    colorClass: "text-amber-600",
  },
  {
    title: "Kasus 7 – Liver Fire Insulting Lung",
    symptoms: "Batuk rejan atau berdarah yang dipicu oleh emosi marah, nyeri iga.",
    analysis: "Kayu (Liver) terlalu kuat → Wu (merampok) Logam (Lung)",
    colorClass: "text-emerald-600",
  },
  {
    title: "Kasus 8 – Kidney Yang Def. failing to warm Spleen",
    symptoms: "Diare subuh (cock-crow diarrhea), kaki dingin, nyeri pinggang, kelelahan.",
    analysis: "Api (Mingmen/Kidney) lemah → gagal Sheng (menghangatkan) Tanah (Spleen)",
    colorClass: "text-blue-600",
  },
  {
    title: "Kasus 9 – Heart Fire Overacting on Lung",
    symptoms: "Sesak napas parah, batuk kering, berkeringat di dada, dada terasa panas/panik.",
    analysis: "Api (Heart) terlalu kuat → Cheng (menindas) Logam (Lung)",
    colorClass: "text-red-600",
  },
  {
    title: "Kasus 10 – Lung Qi Def. failing to assist Kidney Water",
    symptoms: "Asma yang memburuk saat aktivitas, sulit menarik napas, keringat gampang keluar.",
    analysis: "Logam (Lung) lemah → gagal Sheng (menghasilkan) Air (Kidney menerima Qi)",
    colorClass: "text-slate-500",
  },
  {
    title: "Kasus 11 – Spleen Dampness rebelling against Liver",
    symptoms: "Jaundice (Kuning), perut buncit berair (asites), mual, rasa berat.",
    analysis: "Tanah (Spleen) berlebih (Lembab) → Wu (menghina) Kayu (Liver)",
    colorClass: "text-amber-600",
  },
  {
    title: "Kasus 12 – Liver Wind moving internally",
    symptoms: "Tremor, kejang, vertigo hebat mendadak, otot kaku (spasme).",
    analysis: "Kayu (Liver) berlebih → Cheng (menindas) Tanah (Spleen/Otot)",
    colorClass: "text-emerald-600",
  },
  {
    title: "Kasus 13 – Lung Heat Intruding Heart",
    symptoms: "Demam sangat tinggi, delirium, sesak parah, ruam kemerahan.",
    analysis: "Logam (Lung) berlebih panas → Wu (merampok/menghina) Api (Heart)",
    colorClass: "text-slate-500",
  },
  {
    title: "Kasus 14 – Kidney Water Overacting on Heart",
    symptoms: "Edema parah, jantung berdebar kencang, takut dingin, bibir kebiruan.",
    analysis: "Air (Kidney/Dingin) berlebih → Cheng (menindas) Api (Heart Yang)",
    colorClass: "text-blue-600",
  },
  {
    title: "Kasus 15 – Spleen Deficiency leading to Damp-Phlegm in Lung",
    symptoms: "Batuk banyak dahak putih persisten, kembung, mudah lelah setelah makan.",
    analysis: "Tanah (Spleen) lemah → patogen berkumpul di Anak (Logam/Lung)",
    colorClass: "text-amber-600",
  }
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Dalam siklus Sheng (Generating), elemen apa yang melahirkan Api?",
    options: ["Air", "Kayu", "Tanah", "Logam"],
    correctJawaban: "Kayu",
    explanation: "Siklus Sheng: Kayu terbakar untuk menghasilkan Api."
  },
  {
    id: 2,
    question: "Dalam siklus Ke (Controlling), elemen apa yang mengontrol Tanah?",
    options: ["Logam", "Api", "Kayu", "Air"],
    correctJawaban: "Kayu",
    explanation: "Siklus Ke: Akar pohon (Kayu) menembus dan menahan Tanah."
  },
  {
    id: 3,
    question: "Pasien mengamuk dan matanya merah. Tak lama kemudian dia mengalami sakit perut hebat (diare). Secara Wu Xing, ini contoh over-acting dari elemen apa ke elemen apa?",
    options: ["Hati (Kayu) ke Limpa (Tanah)", "Paru (Logam) ke Hati (Kayu)", "Jantung (Api) ke Limpa (Tanah)", "Ginjal (Air) ke Jantung (Api)"],
    correctJawaban: "Hati (Kayu) ke Limpa (Tanah)",
    explanation: "Ini adalah siklus Cheng (Over-acting). Kayu (Hati) yang berlebihan menginvasi Tanah (Limpa/Lambung)."
  },
  {
    id: 4,
    question: "Organ Zang mana yang berhubungan dengan elemen Logam?",
    options: ["Jantung", "Ginjal", "Paru-paru", "Hati"],
    correctJawaban: "Paru-paru",
    explanation: "Paru-paru (Zang) dan Usus Besar (Fu) adalah organ elemen Logam."
  },
  {
    id: 5,
    question: "Jika Paru-paru (Logam) defisien dan tidak bisa mengontrol Hati (Kayu), fenomena (siklus) apa ini?",
    options: ["Cheng (Over-acting)", "Wu (Insulting)", "Sheng (Generating)", "Gagal Ke (Controlling) yang mengarah ke Wu"],
    correctJawaban: "Wu (Insulting)",
    explanation: "Kayu menghina balik Logam (Wu) karena Logam terlalu lemah untuk mengendalikan Kayu secara normal."
  }
];

const WuXingEducationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'theory' | 'animation' | 'table' | 'cases' | 'quiz'>('animation');
  const [activeCycle, setActiveCycle] = useState<'sheng' | 'ke' | 'cheng' | 'wu'>('sheng');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedElemen, setPilihedElemen] = useState<string | null>(null);
  const [selectedMeridian, setPilihedMeridian] = useState<string | null>(null);
  
  const [quizScore, setQuizScore] = useState(0);
  const [answered, setJawabaned] = useState<number[]>([]);
  const [selectedJawabans, setPilihedJawabans] = useState<Record<number, string>>({});

  const handleJawabanSubmit = (questionId: number, answer: string) => {
    if (answered.includes(questionId)) return;
    
    setPilihedJawabans(prev => ({ ...prev, [questionId]: answer }));
    setJawabaned(prev => [...prev, questionId]);
    
    const question = QUIZ_QUESTIONS.find(q => q.id === questionId);
    if (question && question.correctJawaban === answer) {
      setQuizScore(prev => prev + 1);
    }
  };

  // Tabel meridian (klik interaktif)
  const meridians = [
    { code: "LU", name: "Paru-paru", element: "Logam" },
    { code: "HT", name: "Jantung", element: "Api" },
    { code: "SP", name: "Limpah", element: "Tanah" },
    { code: "KI", name: "Ginjal", element: "Air" },
    { code: "LR", name: "Hati", element: "Kayu" },
  ];

  const simpleExplanation = (meridian: string) => {
    if (meridian === "LR") return "Hati (Kayu) seperti pohon besar. Kalau terlalu kuat, bisa menekan perut/limpa (Tanah) dan menyebabkan kembung/marah.";
    if (meridian === "HT") return "Jantung (Api) seperti api unggun. Kalau terlalu besar, bisa membakar paru-paru (Logam).";
    if (meridian === "SP") return "Limpah (Tanah) bertugas mencerna makanan. Jika ia basah/lembab, ia meronta mencegah air mengalir lurus ke Kayu.";
    if (meridian === "LU") return "Paru-paru (Logam) seperti kapak yang mengontrol pohon (Kayu). Jika batuk keras, bisa menyakitkan area iga.";
    if (meridian === "KI") return "Ginjal (Air) seperti cadangan air untuk menyiram pohon. Jika kering, pohon gersang, dan api menjalar ke mana-mana.";
    return "Semua meridian saling menjaga keseimbangan sistem elemen tubuh manusia.";
  };

  const elements = [
    { id: 'wood', name: 'Kayu', symbol: '木', color: '#10b981', x: 180, y: 50 },
    { id: 'fire', name: 'Api', symbol: '火', color: '#ef4444', x: 300, y: 130 },
    { id: 'earth', name: 'Tanah', symbol: '土', color: '#d97706', x: 260, y: 260 },
    { id: 'metal', name: 'Logam', symbol: '金', color: '#64748b', x: 100, y: 260 },
    { id: 'water', name: 'Air', symbol: '水', color: '#3b82f6', x: 60, y: 130 },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        const cycles = ['sheng', 'ke', 'cheng', 'wu'] as const;
        const currentIndex = cycles.indexOf(activeCycle);
        setActiveCycle(cycles[(currentIndex + 1) % 4]);
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeCycle]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-white rounded-3xl shadow-2xl min-h-screen animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <Zap className="w-10 h-10 text-amber-500" />
        <h1 className="text-3xl md:text-4xl font-black text-purple-950">Wu Xing Masterclass</h1>
      </div>
      <p className="text-purple-600 text-sm md:text-lg mb-10">Pemahaman Lengkap Lima Unsur – Teori, Animasi, Tabel, dan Latihan Kasus Nyata</p>

      {/* Navigation Tabs */}
      <div className="flex border-b border-purple-200 mb-8 overflow-x-auto scrollbar-hide">
        {['theory', 'animation', 'table', 'cases', 'quiz'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 md:px-8 py-4 font-bold text-sm md:text-lg transition-all shrink-0 whitespace-nowrap ${activeTab === tab ? 'border-b-4 border-amber-500 text-purple-900 bg-amber-50' : 'text-purple-500 hover:text-purple-700 hover:bg-purple-50'}`}
          >
            {tab === 'theory' && 'Teori Dasar'}
            {tab === 'animation' && 'Animasi Siklus'}
            {tab === 'table' && 'Tabel Interaktif'}
            {tab === 'cases' && 'Latihan Kasus Nyata (15+)'} 
            {tab === 'quiz' && 'Quiz Seru'} 
          </button>
        ))}
      </div>

      {/* TEORI DASAR */}
      {activeTab === 'theory' && (
        <div className="prose max-w-none animate-fade-in">
          <h2 className="text-2xl font-bold text-purple-900 mb-4 flex items-center gap-2"><BookOpen className="w-6 h-6 text-purple-500"/> Teori Wu Xing – Lima Unsur</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Wu Xing terdiri dari 5 elemen: <strong>Kayu (Wood), Api (Fire), Tanah (Earth), Logam (Metal), Air (Water)</strong>.<br />
            Kelima elemen ini saling berinteraksi melalui dua siklus utama (fisiologis) dan dua siklus patologis.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl shadow-sm">
              <h3 className="font-bold text-emerald-800 text-lg mb-3 flex items-center gap-2"><ArrowRight className="w-5 h-5"/> Sheng Cycle (Melahirkan / Menutrisi)</h3>
              <p className="text-emerald-700 leading-relaxed font-medium">Siklus menghidupi seperti ibu pada anak:</p>
              <ul className="mt-3 space-y-2 text-sm text-emerald-900">
                <li>• <b>Kayu</b> melahirkan <b>Api</b></li>
                <li>• <b>Api</b> melahirkan <b>Tanah</b> (menjadi abu)</li>
                <li>• <b>Tanah</b> melahirkan <b>Logam</b> (mineral dalam bumi)</li>
                <li>• <b>Logam</b> melahirkan <b>Air</b> (embun)</li>
                <li>• <b>Air</b> melahirkan <b>Kayu</b> (pohon)</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-3xl shadow-sm">
              <h3 className="font-bold text-blue-800 text-lg mb-3 flex items-center gap-2"><ArrowRight className="w-5 h-5"/> Ke Cycle (Mengendalikan)</h3>
              <p className="text-blue-700 leading-relaxed font-medium">Siklus mengontrol agar elemen tidak berlebih:</p>
              <ul className="mt-3 space-y-2 text-sm text-blue-900">
                <li>• <b>Kayu</b> mengendalikan <b>Tanah</b> (akar membelah bumi)</li>
                <li>• <b>Tanah</b> mengendalikan <b>Air</b> (bendungan)</li>
                <li>• <b>Air</b> mengendalikan <b>Api</b> (memadamkan)</li>
                <li>• <b>Api</b> mengendalikan <b>Logam</b> (melelehkan)</li>
                <li>• <b>Logam</b> mengendalikan <b>Kayu</b> (kapak memotong pohon)</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 p-6 rounded-3xl shadow-sm">
              <h3 className="font-bold text-red-800 text-lg mb-3 flex items-center gap-2"><RotateCw className="w-5 h-5"/> Cheng Cycle (Overacting / Tertindas)</h3>
              <p className="text-red-700 leading-relaxed font-medium text-sm">
                Terjadi ketika satu elemen memiliki energi silang yang berlebihan (Shi), lalu ia menekan (<i>over-controls</i>) elemen yang seharusnya berada di bawah kendalinya di siklus Ke normal, hingga merusak eksistensi elemen yang ditindas.
                <br/><br/>Contoh: Kayu (Liver) Shi (berlebih) akan menekan Tanah (Limpa/Spleen).
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 p-6 rounded-3xl shadow-sm">
              <h3 className="font-bold text-orange-800 text-lg mb-3 flex items-center gap-2"><RotateCw className="w-5 h-5"/> Wu Cycle (Insulting / Merampok)</h3>
              <p className="text-orange-700 leading-relaxed font-medium text-sm">
                Terjadi ketika elemen di siklus Ke berbalik arah. Elemen "Bawah" yang berlebihan memberontak dan menghina/mengalahkan elemen "Atas" yang seharusnya menjadi tuannya/pengontrolnya.
                <br/><br/>Contoh: Tanah (Spleen) sangat berlebih (Lembab), akan berbalik memberontak merusak formasi Kayu (Liver).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ANIMASI HIDUP */}
      {activeTab === 'animation' && (
        <div className="flex flex-col items-center animate-fade-in">
          <h3 className="text-2xl font-bold mb-6 text-purple-900">Animasi Siklus Wu Xing Interaktif</h3>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button onClick={() => setActiveCycle('sheng')} className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeCycle === 'sheng' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>Sheng (Menghidupi)</button>
            <button onClick={() => setActiveCycle('ke')} className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeCycle === 'ke' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>Ke (Mengendalikan)</button>
            <button onClick={() => setActiveCycle('cheng')} className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeCycle === 'cheng' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>Cheng (Tertindas)</button>
            <button onClick={() => setActiveCycle('wu')} className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeCycle === 'wu' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>Wu (Merampok)</button>
          </div>

          <div className="relative w-[360px] h-[360px] md:w-[420px] md:h-[420px] bg-white rounded-full shadow-2xl border-[12px] border-purple-50 flex items-center justify-center">
            {/* SVG ANIMASI UTAMA */}
            <svg width="100%" height="100%" viewBox="0 0 360 360" className="absolute inset-0 w-full h-full drop-shadow-lg">
              {/* Lingkaran luar/jalur Sheng */}
              <circle cx="180" cy="180" r="140" fill="none" stroke="#f3f4f6" strokeWidth="20" />
              
              {/* Animasi Panah Sheng */}
              {activeCycle === 'sheng' && (
                <circle cx="180" cy="180" r="140" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="12 12" className="animate-[spin_8s_linear_infinite] origin-center opacity-70" />
              )}
              {/* Animasi Panah Ke/Cheng/Wu (simplified) */}
              {(activeCycle === 'ke' || activeCycle === 'cheng' || activeCycle === 'wu') && (
                <g className={activeCycle === 'cheng' || activeCycle === 'wu' ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : ''}>
                  {/* Bintang bentuk Ke (Sederhana via polyline berulang) */}
                  <polygon points="180,50 300,130 100,260 260,260 60,130" fill="none" stroke={activeCycle === 'ke' ? '#3b82f6' : activeCycle === 'cheng' ? '#ef4444' : '#f97316'} strokeWidth="4" strokeDasharray="8 8" className="opacity-50" />
                </g>
              )}

              {/* Render Elemen */}
              {elements.map((el) => (
                <g key={el.id} onClick={() => setPilihedElemen(el.id)} className="cursor-pointer group">
                  <circle cx={el.x} cy={el.y} r="35" fill={el.color} fillOpacity="0.15" stroke={el.color} strokeWidth="4" className="group-hover:scale-[1.15] transition-transform origin-center" style={{ transformOrigin: `${el.x}px ${el.y}px` }} />
                  <text x={el.x} y={el.y + 8} textAnchor="middle" fontSize="36" fontBerat Badan="700" fill={el.color} className="pointer-events-none">{el.symbol}</text>
                  <text x={el.x} y={el.y + 50} textAnchor="middle" fontSize="12" fill="#6b7280" fontBerat Badan="700" className="pointer-events-none">{el.name}</text>
                </g>
              ))}
            </svg>

            {/* Label Tengah Info Siklus */}
            <div className="z-10 text-center px-8 bg-white/80 rounded-full w-40 h-40 flex flex-col justify-center backdrop-blur-sm pointer-events-none shadow-inner border border-purple-100">
              <h4 className="font-black text-xl md:text-2xl uppercase tracking-widest text-purple-900 leading-none">
                {activeCycle === 'sheng' && <span className="text-emerald-600">Sheng</span>}
                {activeCycle === 'ke' && <span className="text-blue-600">Ke</span>}
                {activeCycle === 'cheng' && <span className="text-red-600">Cheng</span>}
                {activeCycle === 'wu' && <span className="text-orange-600">Wu</span>}
              </h4>
              <p className="text-[9px] md:text-[10px] font-bold text-gray-400 mt-2">
                {activeCycle === 'sheng' && "Fisiologis. Menghidupi/ Menutrisi."}
                {activeCycle === 'ke' && "Fisiologis. Mengontrol/ Membatasi."}
                {activeCycle === 'cheng' && "Patologis. Siklus menindas kelebihan."}
                {activeCycle === 'wu' && "Patologis. Siklus menghina berbalik."}
              </p>
            </div>
          </div>

          {/* Kontrol Play/Pause Animasi Secara Otomatis */}
          <div className="flex flex-col md:flex-row items-center gap-6 mt-10">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-900/20 transition-all active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? 'Pause Auto-Play' : 'Mulai Auto-Play Siklus'}
            </button>
          </div>

          {/* Penjelasan Interaktif Info Elemen yang diKlik */}
          <div className="w-full max-w-2xl mt-8">
             {selectedElemen ? (
               <div className="bg-purple-50 border border-purple-200 rounded-3xl p-6 text-center animate-fade-in shadow-sm">
                 <h4 className="font-black text-lg text-purple-900">Pusat Fokus: {elements.find(e => e.id === selectedElemen)?.name}</h4>
                 <p className="text-sm mt-3 text-purple-700">
                   Berdasarkan teori Wu Xing, jika elemen <b>{elements.find(e => e.id === selectedElemen)?.name}</b> ini mengalami patologi berlebih (Excess), 
                   maka dalam siklus <span className="text-red-600 font-bold uppercase">Cheng</span> ia berpotensi merusak dan menindas 
                   elemen yang seharusnya dikendalikannya secara berlebihan.
                 </p>
               </div>
             ) : (
               <div className="bg-white border border-dashed border-purple-300 rounded-3xl p-6 text-center text-purple-400 text-sm italic">
                  Klik elemen apapun pada bagan (Kayu, Api, dll.) untuk melihat detail interaksinya.
               </div>
             )}
          </div>
        </div>
      )}

      {/* TABEL LENGKAP TITIK WU XING */}
      {activeTab === 'table' && (
        <div className="animate-fade-in flex flex-col gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-purple-900 flex items-center gap-2"><BookOpen className="w-6 h-6 text-amber-500" /> Jelajah Meridian (Dongeng 5 Elemen)</h3>
            <p className="text-purple-600 mb-6">Klik meridian mana saja, mari belajar karakternya melalui analogi yang mudah.</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {meridians.map(m => (
                <div
                  key={m.code}
                  onClick={() => setPilihedMeridian(m.code)}
                  className={`p-6 rounded-3xl border-2 cursor-pointer transition-all hover:-translate-y-1 shadow-sm ${selectedMeridian === m.code ? 'border-amber-500 bg-amber-50 scale-105 shadow-md' : 'border-purple-200 hover:border-purple-300'}`}
                >
                  <div className="font-black text-2xl text-purple-900">{m.code}</div>
                  <div className="text-purple-700 font-bold mt-1">{m.name}</div>
                  <div className="text-xs font-black uppercase tracking-widest text-purple-500 mt-2 bg-purple-100/50 w-fit px-2 py-1 rounded-lg">{m.element}</div>
                </div>
              ))}
            </div>

            {selectedMeridian && (
              <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200 shadow-inner animate-fade-in">
                <h3 className="font-black text-xl text-amber-900 mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-600" /> Analogi Sederhana:</h3>
                <p className="text-lg leading-relaxed text-amber-800 font-medium">{simpleExplanation(selectedMeridian)}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6 text-purple-900 flex items-center gap-2"><Lightbulb className="w-6 h-6 text-amber-500" /> Tabel Lengkap Titik Wu Xing Spesifik</h3>
            <div className="overflow-x-auto rounded-2xl border border-purple-200">
              <table className="w-full text-sm border-collapse bg-white">
                <thead className="bg-purple-100">
                <tr>
                  <th className="p-4 text-left font-black text-purple-900">Meridian</th>
                  <th className="p-4 text-center font-bold text-emerald-700">Jing Well</th>
                  <th className="p-4 text-center font-bold text-amber-700">Ying Spring</th>
                  <th className="p-4 text-center font-bold text-purple-700">Shu Stream</th>
                  <th className="p-4 text-center font-bold text-blue-700">Jing River</th>
                  <th className="p-4 text-center font-bold text-rose-700">He Sea</th>
                  <th className="p-4 text-center font-black text-purple-900">Yuan Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                <tr className="bg-purple-50/50 uppercase text-[10px] font-black tracking-widest text-emerald-600">
                  <td colSpan={7} className="p-2 text-center border-b border-purple-100">--- Meridian YIN ---</td>
                </tr>
                <tr className="hover:bg-purple-50 transition-colors"><td className="p-4 font-semibold text-purple-900">Lung (LU)</td><td className="p-4 text-center">11</td><td className="p-4 text-center">10</td><td className="p-4 text-center">9</td><td className="p-4 text-center">8</td><td className="p-4 text-center">5</td><td className="p-4 text-center font-black text-purple-800">LU 9</td></tr>
                <tr className="hover:bg-purple-50 transition-colors"><td className="p-4 font-semibold text-purple-900">Heart (HT)</td><td className="p-4 text-center">9</td><td className="p-4 text-center">8</td><td className="p-4 text-center">7</td><td className="p-4 text-center">4</td><td className="p-4 text-center">3</td><td className="p-4 text-center font-black text-purple-800">HT 7</td></tr>
                <tr className="hover:bg-purple-50 transition-colors"><td className="p-4 font-semibold text-purple-900">Spleen (SP)</td><td className="p-4 text-center">1</td><td className="p-4 text-center">2</td><td className="p-4 text-center">3</td><td className="p-4 text-center">5</td><td className="p-4 text-center">9</td><td className="p-4 text-center font-black text-purple-800">SP 3</td></tr>
                <tr className="hover:bg-purple-50 transition-colors"><td className="p-4 font-semibold text-purple-900">Kidney (KI)</td><td className="p-4 text-center">1</td><td className="p-4 text-center">2</td><td className="p-4 text-center">3</td><td className="p-4 text-center">7</td><td className="p-4 text-center">10</td><td className="p-4 text-center font-black text-purple-800">KI 3</td></tr>
                <tr className="hover:bg-purple-50 transition-colors"><td className="p-4 font-semibold text-purple-900">Liver (LR)</td><td className="p-4 text-center">1</td><td className="p-4 text-center">2</td><td className="p-4 text-center">3</td><td className="p-4 text-center">4</td><td className="p-4 text-center">8</td><td className="p-4 text-center font-black text-purple-800">LR 3</td></tr>
                <tr className="hover:bg-purple-50 transition-colors"><td className="p-4 font-semibold text-purple-900">Pericardium (PC)</td><td className="p-4 text-center">9</td><td className="p-4 text-center">8</td><td className="p-4 text-center">7</td><td className="p-4 text-center">5</td><td className="p-4 text-center">3</td><td className="p-4 text-center font-black text-purple-800">PC 7</td></tr>
                
                <tr className="bg-purple-50/50 uppercase text-[10px] font-black tracking-widest text-amber-600">
                  <td colSpan={7} className="p-2 text-center border-y border-purple-100">--- Meridian YANG ---</td>
                </tr>
                <tr className="hover:bg-purple-50 transition-colors"><td className="p-4 font-semibold text-purple-900">Large Intestine (LI)</td><td className="p-4 text-center">1</td><td className="p-4 text-center">2</td><td className="p-4 text-center">3</td><td className="p-4 text-center">5</td><td className="p-4 text-center">11</td><td className="p-4 text-center font-black text-purple-800">LI 4</td></tr>
                <tr className="hover:bg-purple-50 transition-colors"><td className="p-4 font-semibold text-purple-900">Stomach (ST)</td><td className="p-4 text-center">45</td><td className="p-4 text-center">44</td><td className="p-4 text-center">43</td><td className="p-4 text-center">41</td><td className="p-4 text-center">36</td><td className="p-4 text-center font-black text-purple-800">ST 42</td></tr>
                <tr className="hover:bg-purple-50 transition-colors"><td className="p-4 font-semibold text-purple-900">Small Intestine (SI)</td><td className="p-4 text-center">1</td><td className="p-4 text-center">2</td><td className="p-4 text-center">3</td><td className="p-4 text-center">5</td><td className="p-4 text-center">8</td><td className="p-4 text-center font-black text-purple-800">SI 4</td></tr>
                <tr className="hover:bg-purple-50 transition-colors"><td className="p-4 font-semibold text-purple-900">Bladder (BL)</td><td className="p-4 text-center">67</td><td className="p-4 text-center">66</td><td className="p-4 text-center">65</td><td className="p-4 text-center">60</td><td className="p-4 text-center">40</td><td className="p-4 text-center font-black text-purple-800">BL 64</td></tr>
                <tr className="hover:bg-purple-50 transition-colors"><td className="p-4 font-semibold text-purple-900">Gallbladder (GB)</td><td className="p-4 text-center">44</td><td className="p-4 text-center">43</td><td className="p-4 text-center">41</td><td className="p-4 text-center">38</td><td className="p-4 text-center">34</td><td className="p-4 text-center font-black text-purple-800">GB 40</td></tr>
                <tr className="hover:bg-purple-50 transition-colors"><td className="p-4 font-semibold text-purple-900">San Jiao (TE)</td><td className="p-4 text-center">1</td><td className="p-4 text-center">2</td><td className="p-4 text-center">3</td><td className="p-4 text-center">6</td><td className="p-4 text-center">10</td><td className="p-4 text-center font-black text-purple-800">TE 4</td></tr>
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {/* LATIHAN KASUS NYATA (15+) */}
      {activeTab === 'cases' && (
        <div className="animate-fade-in">
          <h3 className="text-2xl font-bold mb-8 text-purple-900 flex items-center gap-2"><CheckCircle className="w-6 h-6 text-emerald-500"/> 15 Latihan Kasus Nyata Wu Xing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {casesData.map((c, i) => (
              <div key={i} className="bg-white border border-purple-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group flex flex-col h-full">
                <div className={`font-black text-base ${c.colorClass} mb-2`}>{c.title}</div>
                <p className="mt-2 text-sm text-gray-600 flex-1">"{c.symptoms}"</p>
                <div className="bg-purple-50 p-4 rounded-2xl mt-4 border border-purple-100">
                  <p className="text-xs font-bold text-purple-800 uppercase tracking-widest mb-1">Analisis Logis:</p>
                  <p className="text-sm font-medium text-purple-900 leading-snug">{c.analysis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUIZ SERU */}
      {activeTab === 'quiz' && (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-4 text-purple-900">Quiz Wu Xing</h2>
            <p className="text-purple-600 font-medium">Uji pemahaman Anda tentang lima elemen. Pilih jawaban yang menurut Anda paling tepat.</p>
          </div>

          <div className="flex justify-between items-center bg-purple-50 p-6 rounded-3xl border border-purple-100">
            <h3 className="font-bold text-purple-900 tracking-wider">Progress: {answered.length} / {QUIZ_QUESTIONS.length}</h3>
            <div className="text-xl font-black text-amber-500">Skor: {quizScore * 20}</div>
          </div>

          <div className="space-y-6">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const isJawabaned = answered.includes(q.id);
              const userJawaban = selectedJawabans[q.id];
              const isCorrect = userJawaban === q.correctJawaban;

              return (
                <div key={q.id} className="bg-white border border-purple-200 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-purple-900 mb-6"><span className="text-purple-500 mr-2">{idx + 1}.</span> {q.question}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {q.options.map((opt) => {
                      let btnClass = "border border-purple-200 bg-white hover:bg-purple-50 text-purple-800 text-left";
                      if (isJawabaned) {
                         if (opt === q.correctJawaban) {
                            btnClass = "bg-emerald-100 border-emerald-300 text-emerald-800 font-bold shadow-inner";
                         } else if (opt === userJawaban && !isCorrect) {
                            btnClass = "bg-red-50 border-red-200 text-red-600 text-left";
                         } else {
                            btnClass = "bg-white border-gray-100 text-gray-400 opacity-60";
                         }
                      }
                      
                      return (
                        <button
                          key={opt}
                          disabled={isJawabaned}
                          onClick={() => handleJawabanSubmit(q.id, opt)}
                          className={`px-6 py-4 rounded-2xl transition-all font-medium text-sm ${btnClass}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isJawabaned && (
                    <div className={`p-5 rounded-2xl border text-sm ${isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                       <p className={`font-bold uppercase tracking-widest text-[10px] mb-1 ${isCorrect ? 'text-emerald-600' : 'text-amber-600'}`}>
                         {isCorrect ? 'BENAR!' : 'KURANG TEPAT'}
                       </p>
                       <p className="text-gray-700 font-medium">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {answered.length === QUIZ_QUESTIONS.length && (
            <div className="bg-purple-600 text-white p-8 rounded-3xl text-center shadow-lg shadow-purple-900/20">
               <h3 className="text-3xl font-black mb-2">Selesai!</h3>
               <p className="text-purple-200 font-medium mb-6">Anda telah menyelesaikan semua soal.</p>
               <button 
                 onClick={() => { setJawabaned([]); setPilihedJawabans({}); setQuizScore(0); }}
                 className="px-8 py-3 bg-white text-purple-700 font-bold rounded-2xl uppercase tracking-widest text-xs hover:-translate-y-1 transition-transform"
               >
                 Ulangi Quiz
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WuXingEducationPage;
