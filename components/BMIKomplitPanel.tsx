import React, { useState, useRef } from 'react';
import { Calculator, Activity, Scale, Info, FileText, Download, Utensils, Dumbbell } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const BMIKomplitPanel: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<number>(1.2);
  const [bmiStandard, setBmiStandard] = useState<'who' | 'asia'>('asia');

  const calculateBMI = () => {
    if (!weight || !height) return null;
    const heightInMeters = Number(height) / 100;
    return Number(weight) / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number) => {
    if (bmiStandard === 'who') {
      if (bmi < 18.5) return { label: 'Underweight (Kurus)', color: 'text-blue-500', bg: 'bg-blue-100' };
      if (bmi < 25) return { label: 'Normal (Ideal)', color: 'text-green-500', bg: 'bg-green-100' };
      if (bmi < 30) return { label: 'Overweight (Gemuk)', color: 'text-yellow-500', bg: 'bg-yellow-100' };
      if (bmi < 35) return { label: 'Obese Class I (Obesitas I)', color: 'text-orange-500', bg: 'bg-orange-100' };
      if (bmi < 40) return { label: 'Obese Class II (Obesitas II)', color: 'text-red-500', bg: 'bg-red-100' };
      return { label: 'Obese Class III (Obesitas Ekstrem)', color: 'text-red-700', bg: 'bg-red-200' };
    } else {
      // Asia-Pacific standard
      if (bmi < 18.5) return { label: 'Underweight (Kurus)', color: 'text-blue-500', bg: 'bg-blue-100' };
      if (bmi < 23) return { label: 'Normal (Ideal)', color: 'text-green-500', bg: 'bg-green-100' };
      if (bmi < 25) return { label: 'Overweight (Beresiko)', color: 'text-yellow-500', bg: 'bg-yellow-100' };
      if (bmi < 30) return { label: 'Obese I (Obesitas I)', color: 'text-orange-500', bg: 'bg-orange-100' };
      return { label: 'Obese II (Obesitas II)', color: 'text-red-600', bg: 'bg-red-100' };
    }
  };

  const calculateIdealWeight = () => {
    if (!height) return null;
    const h = Number(height);
    if (gender === 'male') {
      return (h - 100) - ((h - 100) * 0.1);
    } else {
      return (h - 100) - ((h - 100) * 0.15);
    }
  };

  const calculateBMR = () => {
    if (!weight || !height || !age) return null;
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);
    if (gender === 'male') {
      return (10 * w) + (6.25 * h) - (5 * a) + 5;
    } else {
      return (10 * w) + (6.25 * h) - (5 * a) - 161;
    }
  };

  const getRecommendations = (bmi: number) => {
    if (bmiStandard === 'who') {
      if (bmi < 18.5) return getUnderweightRecs();
      if (bmi < 25) return getNormalRecs();
      if (bmi < 30) return getOverweightRecs();
      return getObeseRecs();
    } else {
      if (bmi < 18.5) return getUnderweightRecs();
      if (bmi < 23) return getNormalRecs();
      if (bmi < 25) return getOverweightRecs();
      return getObeseRecs();
    }
  };

  const getUnderweightRecs = () => ({
    acupoints: "ST36 (Zusanli), SP6 (Sanyinjiao), CV12 (Zhongwan) - Menguatkan Limpa & Lambung, meningkatkan penyerapan nutrisi.",
    diet: "Tingkatkan asupan kalori padat nutrisi. Konsumsi protein berkualitas (daging tanpa lemak, telur), karbohidrat kompleks, dan lemak sehat (alpukat, kacang). Hindari makanan mentah/dingin yang melemahkan Limpa.",
    exercise: "Fase 1 (Ringan): Jalan santai 15-20 menit, Tai Chi dasar.\nFase 2 (Sedang): Latihan beban ringan (bodyweight) untuk membangun massa otot, Yoga.\nFase 3 (Berat): Latihan beban progresif 3-4x seminggu dengan durasi 45 menit."
  });

  const getNormalRecs = () => ({
    acupoints: "ST36 (Zusanli), CV6 (Qihai) - Menjaga keseimbangan energi (Qi) dan memelihara kesehatan secara umum.",
    diet: "Pertahankan pola makan seimbang. Porsi seimbang antara sayuran, protein, dan karbohidrat. Konsumsi makanan sesuai musim untuk menjaga harmoni tubuh.",
    exercise: "Fase 1 (Ringan): Jalan cepat, peregangan harian.\nFase 2 (Sedang): Jogging, berenang, bersepeda 3-4x seminggu.\nFase 3 (Berat): Latihan interval (HIIT) atau olahraga kompetitif 1-2x seminggu untuk kebugaran kardio."
  });

  const getOverweightRecs = () => ({
    acupoints: "ST40 (Fenglong), SP9 (Yinlingquan), CV9 (Shuifen) - Mengusir kelembaban (Dampness) dan melancarkan metabolisme cairan.",
    diet: "Kurangi karbohidrat olahan dan gula. Perbanyak sayuran berserat tinggi, teh hijau, dan makanan yang mengeringkan kelembaban (seperti jali/yi yi ren). Hindari makanan berminyak, manis, dan produk susu berlebih.",
    exercise: "Fase 1 (Ringan): Jalan kaki 30 menit setiap hari, senam aerobik low-impact.\nFase 2 (Sedang): Bersepeda, berenang, brisk walking 45 menit 4x seminggu.\nFase 3 (Berat): Latihan kardio intensitas sedang-tinggi dikombinasikan dengan latihan beban ringan untuk membakar lemak."
  });

  const getObeseRecs = () => ({
    acupoints: "ST40 (Fenglong), SP9 (Yinlingquan), CV9 (Shuifen), ST25 (Tianshu) - Fokus kuat pada mengeliminasi Kelembaban-Dahak (Phlegm-Dampness) dan melancarkan pencernaan.",
    diet: "Defisit kalori terkontrol. Diet rendah karbohidrat dan tinggi protein/serat. Sangat disarankan menghindari makanan manis, gorengan, dan alkohol. Konsumsi makanan hangat dan mudah dicerna.",
    exercise: "Fase 1 (Ringan): Berjalan di air (water aerobics) untuk mengurangi beban sendi, jalan santai 15-20 menit.\nFase 2 (Sedang): Sepeda statis, jalan cepat bertahap hingga 30-40 menit.\nFase 3 (Berat): Latihan beban terstruktur dan kardio low-impact durasi panjang (45-60 menit) setelah sendi terbiasa."
  });

  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`BMI_Report_${name.replace(/\s+/g, '_') || 'Patient'}.pdf`);
  };

  const handleDownloadTXT = () => {
    if (!bmi) return;
    const cat = getBMICategory(bmi);
    const recs = getRecommendations(bmi);
    
    const text = `
LAPORAN ANALISIS BMI & CDSS TCM
================================
Nama: ${name || '-'}
Alamat: ${address || '-'}
Gender: ${gender === 'male' ? 'Pria' : 'Wanita'}
Usia: ${age} Tahun
Height: ${height} cm
Weight: ${weight} kg

HASIL ANALISIS
--------------
Skor BMI: ${bmi.toFixed(1)}
Kategori: ${cat?.label}
Berat Ideal: ${idealWeight?.toFixed(1)} kg
BMR: ${bmr?.toFixed(0)} kcal
TDEE: ${tdee?.toFixed(0)} kcal/hari

REKOMENDASI CDSS TCM
--------------------
Titik Akupuntur:
${recs?.acupoints}

Saran Diet/Makanan:
${recs?.diet}

Program Olahraga (Bertahap):
${recs?.exercise}
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BMI_Report_${name.replace(/\s+/g, '_') || 'Patient'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const bmi = calculateBMI();
  const category = bmi ? getBMICategory(bmi) : null;
  const idealWeight = calculateIdealWeight();
  const bmr = calculateBMR();
  const tdee = bmr ? bmr * activityLevel : null;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Kalkulator BMI Komplit</h2>
              <p className="text-sm text-slate-500">Analisis BMI, Weight Ideal & Kebutuhan Kalori</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder="Nama Pasien"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Alamat</label>
                  <textarea 
                    value={address} 
                    onChange={e => setAddress(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder="Alamat Pasien"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Jenis Kelamin</label>
                  <div className="flex rounded-lg overflow-hidden border border-slate-200">
                    <button 
                      className={`flex-1 py-2 text-sm font-bold transition-colors ${gender === 'male' ? 'bg-teal-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      onClick={() => setGender('male')}
                    >
                      Pria
                    </button>
                    <button 
                      className={`flex-1 py-2 text-sm font-bold transition-colors ${gender === 'female' ? 'bg-teal-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      onClick={() => setGender('female')}
                    >
                      Wanita
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Usia (Tahun)</label>
                  <input 
                    type="number" 
                    value={age} 
                    onChange={e => setAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder="Contoh: 30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Height (cm)</label>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={e => setHeight(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder="Contoh: 170"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={weight} 
                    onChange={e => setWeight(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder="Contoh: 70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Standar BMI</label>
                <div className="flex rounded-lg overflow-hidden border border-slate-200">
                  <button 
                    className={`flex-1 py-2 text-sm font-bold transition-colors ${bmiStandard === 'asia' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    onClick={() => setBmiStandard('asia')}
                  >
                    Asia-Pasifik
                  </button>
                  <button 
                    className={`flex-1 py-2 text-sm font-bold transition-colors ${bmiStandard === 'who' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    onClick={() => setBmiStandard('who')}
                  >
                    WHO (Global)
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Standar Asia lebih ketat untuk deteksi risiko obesitas.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tingkat Aktivitas Fisik</label>
                <select 
                  value={activityLevel}
                  onChange={e => setActivityLevel(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white"
                >
                  <option value={1.2}>Sangat Jarang Olahraga (Sedentary)</option>
                  <option value={1.375}>Jarang Olahraga (1-3 hari/minggu)</option>
                  <option value={1.55}>Normal Olahraga (3-5 hari/minggu)</option>
                  <option value={1.725}>Sering Olahraga (6-7 hari/minggu)</option>
                  <option value={1.9}>Sangat Sering Olahraga / Pekerja Fisik</option>
                </select>
              </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col gap-4">
              <div ref={printRef} className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-center">
                {bmi ? (
                  <div className="space-y-6 animate-fade-in-up">
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Skor BMI Anda</p>
                      <div className="text-6xl font-black text-slate-800 tracking-tighter mb-2">
                        {bmi.toFixed(1)}
                      </div>
                      <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${category?.bg} ${category?.color}`}>
                        {category?.label}
                      </div>
                    </div>

                    <div className="h-px bg-slate-200 w-full"></div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                          <Scale className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Berat Ideal</span>
                        </div>
                        <div className="text-xl font-black text-slate-800">
                          {idealWeight?.toFixed(1)} <span className="text-sm font-medium text-slate-500">kg</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Formula Broca</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                          <Activity className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">BMR</span>
                        </div>
                        <div className="text-xl font-black text-slate-800">
                          {bmr?.toFixed(0)} <span className="text-sm font-medium text-slate-500">kcal</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Kalori Basal / Hari</p>
                      </div>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                      <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">Total Kebutuhan Kalori (TDEE)</p>
                      <div className="text-2xl font-black text-teal-900">
                        {tdee?.toFixed(0)} <span className="text-base font-medium text-teal-700">kcal / hari</span>
                      </div>
                      <p className="text-xs text-teal-600 mt-1">
                        Kalori yang dibutuhkan untuk mempertahankan Weight saat ini.
                      </p>
                    </div>

                    {/* CDSS Recommendations */}
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Rekomendasi CDSS TCM</h3>
                      
                      <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> Titik Akupuntur</h4>
                        <p className="text-sm text-slate-600">{getRecommendations(bmi)?.acupoints}</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <h4 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2"><Utensils className="w-4 h-4"/> Saran Diet & Makanan</h4>
                        <p className="text-sm text-slate-600">{getRecommendations(bmi)?.diet}</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <h4 className="text-sm font-bold text-blue-700 mb-2 flex items-center gap-2"><Dumbbell className="w-4 h-4"/> Program Olahraga Bertahap</h4>
                        <p className="text-sm text-slate-600 whitespace-pre-line">{getRecommendations(bmi)?.exercise}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-12">
                    <Calculator className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="font-medium">Masukkan data di samping untuk melihat hasil analisis BMI.</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {bmi && (
                <div className="flex gap-4">
                  <button onClick={handleDownloadPDF} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <FileText className="w-5 h-5" /> Download PDF
                  </button>
                  <button onClick={handleDownloadTXT} className="flex-1 bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <Download className="w-5 h-5" /> Download TXT
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMIKomplitPanel;
