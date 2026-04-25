import React from 'react';
import { FileText, Shield } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const ConsentModal: React.FC<Props> = ({ isOpen, onAccept, onDecline }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl max-w-lg w-full mx-4 p-8 animate-fade-in shadow-2xl border border-purple-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-100 rounded-2xl">
            <Shield className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-purple-950">Persetujuan Penggunaan Data</h2>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6 font-medium text-sm">
          Aplikasi TCM WuXing Pro mengumpulkan data pasien (gejala, diagnosis, catatan) untuk keperluan klinis dan edukasi. 
          Data Anda dilindungi dengan enkripsi keamanan dan sesuai <strong>UU PDP No.27 Tahun 2022</strong>.
        </p>

        <div className="text-xs bg-purple-50 p-5 rounded-2xl mb-8 space-y-3 border border-purple-100 font-bold text-purple-800">
          <p className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-purple-600 shrink-0" />
            Data hanya diakses oleh Anda sebagai pemilik akun
          </p>
          <p className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-purple-600 shrink-0" />
            Data tidak akan dijual ke pihak ketiga
          </p>
          <p className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-purple-600 shrink-0" />
            Anda dapat menghapus semua data kapan saja
          </p>
        </div>

        <div className="flex gap-4">
          <button onClick={onDecline} className="flex-1 py-4 border-2 border-gray-200 text-gray-600 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-gray-50 hover:border-gray-300 transition-all">
            Tolak Akses
          </button>
          <button onClick={onAccept} className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-700 hover:-translate-y-0.5 active:scale-95 transition-all shadow-lg shadow-emerald-200">
            Saya Setuju & Lanjut
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentModal;
