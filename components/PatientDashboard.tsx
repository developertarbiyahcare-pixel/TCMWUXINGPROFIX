import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Calendar, User, SearchX } from 'lucide-react';
import { db } from '../services/db';
import DoctorNoteModal from './DoctorNoteModal';
import { SavedPatient } from '../types'; // assuming SavedPatient is the type

const PatientDashboard: React.FC = () => {
  const [patients, setPatients] = useState<SavedPatient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setPilihedPatient] = useState<SavedPatient | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [isMemuat, setIsMemuat] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setIsMemuat(true);
    try {
      const allPatients = await db.patients.getAll();
      // Sort patients by date, most recent first
      setPatients(allPatients.sort((a,b) => b.timestamp - a.timestamp));
    } catch (e) {
      console.error(e);
    } finally {
      setIsMemuat(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis?.patternId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin hapus data pasien ini?')) {
      await db.patients.delete(id);
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-purple-950">Dashboard Pasien</h1>
          <p className="text-purple-600 font-medium">Kelola semua data pasien dengan aman dan tersinkronisasi.</p>
        </div>
        {/* Placeholder if we wanted to open new patient manually here. But typically it's handled via the chat/diagnosis flow */}
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 rounded-3xl p-6 shadow-sm">
          <div className="text-purple-500 font-bold tracking-widest text-xs uppercase">Total Pasien</div>
          <div className="text-4xl font-black text-purple-900 mt-2">{patients.length}</div>
        </div>
        <div className="bg-gradient-to-br from-white to-amber-50 border border-amber-100 rounded-3xl p-6 shadow-sm">
          <div className="text-amber-500 font-bold tracking-widest text-xs uppercase">Diagnosa Terdaftar</div>
          <div className="text-4xl font-black text-amber-600 mt-2">{patients.filter(p => p.diagnosis?.patternId).length}</div>
        </div>
        <div className="bg-gradient-to-br from-white to-emerald-50 border border-emerald-100 rounded-3xl p-6 shadow-sm">
          <div className="text-emerald-500 font-bold tracking-widest text-xs uppercase">Pasien Terbaru</div>
          <div className="text-lg font-black text-emerald-600 mt-3 truncate pl-1">
            {patients.length > 0 ? patients[0].name : '-'}
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 group-focus-within:text-purple-500 transition-colors" />
          <input
            type="text"
            placeholder="Cari nama pasien atau diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-purple-100 rounded-[2rem] focus:outline-none focus:border-purple-400 focus:bg-purple-50/30 transition-all font-medium text-purple-900"
          />
        </div>
        <button className="px-8 py-4 bg-white border-2 border-purple-100 rounded-[2rem] font-bold text-purple-700 flex items-center justify-center gap-2 hover:border-purple-300 hover:bg-purple-50 transition-all shadow-sm shrink-0">
          <Calendar className="w-5 h-5" />
          Filter Data
        </button>
      </div>

      {/* Tabel Pasien */}
      <div className="bg-white border border-purple-100 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-purple-50/50">
              <tr>
                <th className="text-left py-5 px-6 font-black text-xs uppercase tracking-widest text-purple-800">Nama Pasien</th>
                <th className="text-left py-5 px-6 font-black text-xs uppercase tracking-widest text-purple-800">Usia/JK</th>
                <th className="text-left py-5 px-6 font-black text-xs uppercase tracking-widest text-purple-800">Kunjungan Terakhir</th>
                <th className="text-left py-5 px-6 font-black text-xs uppercase tracking-widest text-purple-800">Diagnosis Utama</th>
                <th className="w-24 py-5 px-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {isMemuat ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-purple-400 font-medium">Memuat data...</td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-purple-50 rounded-full">
                        <SearchX className="w-8 h-8 text-purple-300" />
                      </div>
                      <p className="text-purple-500 font-medium">Tidak ada data pasien yang ditemukan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => {
                      setPilihedPatient(patient);
                      setShowNoteModal(true);
                    }}
                    className="hover:bg-purple-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-5 px-6 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <div className="font-bold text-purple-950">{patient.name || 'NN'}</div>
                        <div className="text-xs text-purple-500 mt-1">{patient.phone || '-'}</div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="font-medium text-purple-800">{patient.age || '?'} thn</span>
                      <span className="text-purple-400 text-sm ml-2">({patient.sex || '-'})</span>
                    </td>
                    <td className="py-5 px-6 text-purple-600 text-sm">
                      {patient.timestamp ? new Date(patient.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                    </td>
                    <td className="py-5 px-6">
                      {patient.diagnosis?.patternId ? (
                        <span className="inline-flex items-center px-4 py-1.5 bg-amber-100 text-amber-800 rounded-xl text-xs font-bold border border-amber-200">
                          {patient.diagnosis.patternId}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm italic">Belum diagnosis</span>
                      )}
                    </td>
                    <td className="py-5 px-6 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(patient.id); }}
                        className="text-gray-300 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Hapus Data"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Catatan Dokter */}
      {showNoteModal && selectedPatient && (
        <DoctorNoteModal
          isOpen={showNoteModal}
          onClose={() => setShowNoteModal(false)}
          diagnosis={selectedPatient.diagnosis as any}
          initialPatientData={selectedPatient}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
