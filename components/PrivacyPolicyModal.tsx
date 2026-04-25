import React from 'react';
import { Shield, FileText, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-3xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in border border-purple-200">
        <div className="sticky top-0 bg-white border-b border-purple-100 px-8 py-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-xl font-black text-purple-950 uppercase tracking-tighter">Kebijakan Privasi & PDP</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 text-gray-700 leading-relaxed space-y-8 text-sm overflow-y-auto scrollbar-hide">
          <p className="text-base font-medium">
            TCM WuXing Pro menghormati privasi Anda dan melindungi data kesehatan sesuai <strong>Undang-Undang Perlindungan Data Pribadi (UU PDP) No. 27 Tahun 2022</strong>.
          </p>

          <div>
            <h4 className="font-black text-purple-900 mb-3 text-lg">Apa yang kami kumpulkan?</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-purple-500 mt-1 shrink-0" />
                Data pasien (nama, usia, gejala, lidah, nadi, diagnosis TCM)
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-purple-500 mt-1 shrink-0" />
                Catatan dokter dan resep akupunktur
              </li>
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-purple-500 mt-1 shrink-0" />
                Data penggunaan aplikasi (anonim)
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-purple-900 mb-3 text-lg">Bagaimana kami melindungi data Anda?</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                Seluruh data dienkripsi dengan standar database Cloud sebelum disimpan
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                Data hanya bisa diakses oleh akun Anda sendiri yang terautentikasi
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                Tidak ada penjualan data ke pihak ketiga
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                Anda dapat menghapus semua data rekam medis kapan saja
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex gap-3 text-xs shadow-inner">
            <Shield className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <strong className="block text-amber-900 text-sm mb-1 uppercase tracking-wider">Catatan Penting</strong>
              <span className="text-amber-800 font-medium">Aplikasi ini dirancang untuk penggunaan klinis dan edukasi. Anda bertanggung jawab memastikan persetujuan pasien secara lisan atau tertulis sebelum menyimpan data mereka ke dalam sistem.</span>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-purple-100 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
